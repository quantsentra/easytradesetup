"""
LLM service.

Selects an extraction provider based on `LLM_PROVIDER`:
    - "openai"     → OpenAI Chat Completions, JSON-object response format
    - "anthropic"  → Anthropic Messages API, JSON-only system prompt
    - "mock"       → Deterministic keyword-based extractor (no network)

Public API:
    summarize_transcript(transcript)  -> str
    classify_urgency(transcript)      -> str
    extract_ticket_fields(transcript) -> ExtractedTicket

If the chosen provider raises *any* error during extraction, the lower-level
function raises `LLMExtractionError` with the original cause attached. The
caller (ticket_service) is responsible for the fallback policy so the LLM
layer stays single-purpose.
"""
from __future__ import annotations

import json
import logging
import os
import re
from typing import Any

from app.config import settings
from app.schemas.ticket import ExtractedTicket

logger = logging.getLogger(__name__)


class LLMExtractionError(RuntimeError):
    """Raised when the configured LLM provider fails to return a valid JSON ticket."""


# --- Prompt -----------------------------------------------------------------

SYSTEM_PROMPT = (
    "You are an IT support intake assistant. You read raw call transcripts "
    "and extract a structured ticket. Output JSON only — no prose, no markdown "
    "fences. Do not invent facts not present in the transcript."
)

EXTRACTION_INSTRUCTION = """\
Extract a JSON object from the transcript with EXACTLY these keys:

{
  "caller_name": "<full name as said in transcript, or empty string>",
  "company": "<company name as said, or empty string>",
  "callback_number": "<phone number to call back, or empty string>",
  "issue_summary": "<one or two sentences describing the issue>",
  "category": "<one of: password_reset | email | vpn | hardware | network | software | access | general>",
  "urgency": "<one of: low | normal | high | urgent>",
  "impact": "<one of: single_user | team | department | company_wide>",
  "affected_service": "<the system or service most affected, or empty string>",
  "recommended_action": "<short next step the IT team should take>",
  "confidence_score": <number between 0 and 1>
}

Rules:
- "ASAP" / "down" / "outage" / "production" → urgency = "urgent".
- If a whole team or company is blocked, impact is at least "team".
- If unsure of category, use "general".
- Output JSON only. No prose. No markdown fences.

Transcript:
\"\"\"
{transcript}
\"\"\"
"""


def _build_user_prompt(transcript: str) -> str:
    return EXTRACTION_INSTRUCTION.format(transcript=transcript)


# --- Provider implementations ----------------------------------------------


def _extract_via_openai(transcript: str) -> dict[str, Any]:
    """Call OpenAI with JSON-object response format."""
    try:
        from openai import OpenAI  # lazy import — only required if provider=openai
    except ImportError as e:  # pragma: no cover
        raise LLMExtractionError(
            "openai package not installed. Run `pip install openai`."
        ) from e

    api_key = settings.llm_api_key or os.environ.get("OPENAI_API_KEY")
    if not api_key:
        raise LLMExtractionError(
            "No API key configured. Set LLM_API_KEY (or OPENAI_API_KEY) in .env."
        )

    client = OpenAI(api_key=api_key)
    model = settings.llm_model or "gpt-4o-mini"

    response = client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": _build_user_prompt(transcript)},
        ],
        response_format={"type": "json_object"},
        temperature=0,
    )
    raw = response.choices[0].message.content or "{}"
    return _parse_json_payload(raw)


def _extract_via_anthropic(transcript: str) -> dict[str, Any]:
    """Call Anthropic and parse JSON from the text response."""
    try:
        import anthropic  # lazy import — only required if provider=anthropic
    except ImportError as e:  # pragma: no cover
        raise LLMExtractionError(
            "anthropic package not installed. Run `pip install anthropic`."
        ) from e

    api_key = settings.llm_api_key or os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        raise LLMExtractionError(
            "No API key configured. Set LLM_API_KEY (or ANTHROPIC_API_KEY) in .env."
        )

    client = anthropic.Anthropic(api_key=api_key)
    model = settings.llm_model or "claude-haiku-4-5-20251001"

    response = client.messages.create(
        model=model,
        max_tokens=1024,
        system=SYSTEM_PROMPT,
        messages=[{"role": "user", "content": _build_user_prompt(transcript)}],
    )
    text = "".join(
        getattr(block, "text", "") for block in response.content
    ).strip()
    return _parse_json_payload(text)


def _parse_json_payload(text: str) -> dict[str, Any]:
    """
    Pull a JSON object out of a model response.
    Tolerant of stray markdown fences or leading/trailing prose.
    """
    text = text.strip()
    if not text:
        raise LLMExtractionError("LLM returned empty response.")

    # Strip ```json ... ``` fences if the model ignored the rule.
    if text.startswith("```"):
        text = re.sub(r"^```(?:json)?\s*", "", text)
        text = re.sub(r"\s*```\s*$", "", text)

    # Last-resort: grab the first {...} block.
    if not text.lstrip().startswith("{"):
        match = re.search(r"\{.*\}", text, re.DOTALL)
        if not match:
            raise LLMExtractionError(f"No JSON object found in LLM response: {text[:200]!r}")
        text = match.group(0)

    try:
        data = json.loads(text)
    except json.JSONDecodeError as e:
        raise LLMExtractionError(f"LLM response was not valid JSON: {e}") from e

    if not isinstance(data, dict):
        raise LLMExtractionError(f"LLM returned {type(data).__name__}, expected object.")
    return data


# --- Mock provider ---------------------------------------------------------


_CATEGORY_RULES: list[tuple[str, list[str]]] = [
    ("password_reset", ["password", "reset password", "locked out", "can't log in", "cannot log in"]),
    ("email", ["email", "outlook", "mailbox", "smtp", "imap"]),
    ("vpn", ["vpn", "remote access", "tunnel"]),
    ("hardware", ["laptop", "monitor", "keyboard", "mouse", "printer", "headset", "screen"]),
    ("network", ["wifi", "wi-fi", "internet", "network", "router", "ethernet"]),
    ("software", ["install", "software", "application", "app crash", "crashing", "error"]),
    ("access", ["access", "permission", "shared drive", "folder", "file share"]),
]

_URGENCY_RULES: list[tuple[str, list[str]]] = [
    ("urgent", ["urgent", "asap", "immediately", "down", "outage", "production"]),
    ("high", ["important", "blocked", "can't work", "cannot work", "deadline"]),
    ("low", ["whenever", "no rush", "minor", "cosmetic"]),
]

_IMPACT_KEYWORDS = {
    "company_wide": ["everyone", "all users", "company-wide", "company wide", "whole company"],
    "department": ["department", "entire department"],
    "team": ["team", "whole team", "all of us", "everyone here"],
}

_AFFECTED_SERVICE_BY_CATEGORY = {
    "password_reset": "Active Directory / SSO",
    "email": "Email (Outlook / Exchange)",
    "vpn": "VPN",
    "hardware": "",
    "network": "Network",
    "software": "",
    "access": "Shared drive",
    "general": "",
}

_ACTION_BY_CATEGORY = {
    "password_reset": "Reset password via Active Directory and verify access.",
    "email": "Check mail server status and validate user mailbox.",
    "vpn": "Inspect VPN client logs and gateway connectivity.",
    "hardware": "Schedule on-site hardware diagnosis or replacement.",
    "network": "Run network diagnostics on the user's segment.",
    "software": "Reproduce the error and check application logs.",
    "access": "Verify user permissions on the affected resource.",
    "general": "Manual triage required — review transcript and assign owner.",
}


def _summarize(text: str, max_chars: int = 200) -> str:
    parts = re.split(r"(?<=[.!?])\s+", text.strip(), maxsplit=1)
    first = (parts[0] if parts else text).strip()
    if len(first) > max_chars:
        first = first[: max_chars - 1].rstrip() + "…"
    return first


def _detect_category(text: str) -> str:
    lowered = text.lower()
    for category, keywords in _CATEGORY_RULES:
        if any(kw in lowered for kw in keywords):
            return category
    return "general"


def _detect_urgency(text: str) -> str:
    lowered = text.lower()
    for urgency, keywords in _URGENCY_RULES:
        if any(kw in lowered for kw in keywords):
            return urgency
    return "normal"


def _detect_impact(text: str) -> str:
    lowered = text.lower()
    for impact, keywords in _IMPACT_KEYWORDS.items():
        if any(kw in lowered for kw in keywords):
            return impact
    return "single_user"


def _extract_via_mock(transcript: str) -> dict[str, Any]:
    """Deterministic keyword-based extractor — no network, no API key."""
    category = _detect_category(transcript)
    return {
        "caller_name": "",  # form value will fill this in
        "company": "",
        "callback_number": "",
        "issue_summary": _summarize(transcript),
        "category": category,
        "urgency": _detect_urgency(transcript),
        "impact": _detect_impact(transcript),
        "affected_service": _AFFECTED_SERVICE_BY_CATEGORY.get(category, ""),
        "recommended_action": _ACTION_BY_CATEGORY.get(category, _ACTION_BY_CATEGORY["general"]),
        "confidence_score": 0.5,
    }


# --- Dispatch + public API -------------------------------------------------


_PROVIDERS = {
    "openai": _extract_via_openai,
    "anthropic": _extract_via_anthropic,
    "mock": _extract_via_mock,
}


def extract_ticket_fields(transcript: str) -> ExtractedTicket:
    """
    Run extraction with the configured provider and return a validated
    `ExtractedTicket`. Raises `LLMExtractionError` on any failure.
    """
    provider_name = (settings.llm_provider or "mock").lower()
    provider_fn = _PROVIDERS.get(provider_name)
    if provider_fn is None:
        raise LLMExtractionError(
            f"Unknown LLM_PROVIDER {provider_name!r}. Expected one of: "
            f"{', '.join(_PROVIDERS)}."
        )

    try:
        raw = provider_fn(transcript)
    except LLMExtractionError:
        raise  # already well-formed; let it bubble
    except Exception as e:
        # Network errors, auth errors, rate limits, malformed payloads.
        # `logger.exception` emits the full stack trace once — caller logs
        # the high-level fallback decision.
        logger.exception("LLM provider %r raised during extraction", provider_name)
        raise LLMExtractionError(
            f"{provider_name} provider failed: {type(e).__name__}: {e}"
        ) from e

    try:
        return ExtractedTicket(**raw)
    except Exception as e:
        logger.exception("LLM response failed schema validation: %s", raw)
        raise LLMExtractionError(f"LLM response failed validation: {e}") from e


def summarize_transcript(transcript: str) -> str:
    """
    Return only the issue summary.

    Convenience wrapper — internally runs the full extractor. For real LLM
    providers, prefer calling `extract_ticket_fields` directly to avoid
    multiple API round-trips when you also need the other fields.
    """
    return extract_ticket_fields(transcript).issue_summary


def classify_urgency(transcript: str) -> str:
    """
    Return only the urgency label (low / normal / high / urgent).

    Same caveat as `summarize_transcript`: prefer `extract_ticket_fields`
    when you need more than one field.
    """
    return extract_ticket_fields(transcript).urgency

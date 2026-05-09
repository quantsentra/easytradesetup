"""
LLM service — placeholder implementation.

Replace `extract_ticket_fields` with a real LLM call (OpenAI, Anthropic, local
Ollama, etc.) when the MVP graduates. Until then we run a deterministic
keyword-based extractor so the rest of the stack can be built and tested
without an API key.
"""
from __future__ import annotations

import re

from app.schemas.ticket import ExtractedTicket


# Very small keyword → category map. Order matters: first match wins.
_CATEGORY_RULES: list[tuple[str, list[str]]] = [
    ("password_reset", ["password", "reset password", "locked out", "can't log in", "cannot log in"]),
    ("email", ["email", "outlook", "mailbox", "smtp", "imap"]),
    ("vpn", ["vpn", "remote access", "tunnel"]),
    ("hardware", ["laptop", "monitor", "keyboard", "mouse", "printer", "headset", "screen"]),
    ("network", ["wifi", "wi-fi", "internet", "network", "router", "ethernet"]),
    ("software", ["install", "software", "application", "app crash", "crashing", "error"]),
    ("access", ["access", "permission", "shared drive", "folder", "file share"]),
]

# Priority keywords. "urgent" overrides "high" overrides "low".
_PRIORITY_RULES: list[tuple[str, list[str]]] = [
    ("urgent", ["urgent", "asap", "immediately", "down", "outage", "production", "everyone"]),
    ("high", ["important", "blocked", "can't work", "cannot work", "deadline"]),
    ("low", ["whenever", "no rush", "minor", "cosmetic"]),
]


def _detect_category(text: str) -> str:
    lowered = text.lower()
    for category, keywords in _CATEGORY_RULES:
        if any(kw in lowered for kw in keywords):
            return category
    return "general"


def _detect_priority(text: str) -> str:
    lowered = text.lower()
    for priority, keywords in _PRIORITY_RULES:
        if any(kw in lowered for kw in keywords):
            return priority
    return "normal"


def _summarize(text: str, max_chars: int = 200) -> str:
    """
    Cheap one-line summary: first sentence, trimmed.
    Good enough as a placeholder — a real LLM produces a proper summary.
    """
    # Split on sentence-ish boundaries
    parts = re.split(r"(?<=[.!?])\s+", text.strip(), maxsplit=1)
    first = parts[0] if parts else text
    first = first.strip()
    if len(first) > max_chars:
        first = first[: max_chars - 1].rstrip() + "…"
    return first


def extract_ticket_fields(transcript: str) -> ExtractedTicket:
    """
    Placeholder LLM call. Pulls structured fields out of a raw transcript.

    Swap this body for a real model call when ready — keep the return type
    so callers don't need to change.
    """
    return ExtractedTicket(
        summary=_summarize(transcript),
        category=_detect_category(transcript),
        priority=_detect_priority(transcript),  # type: ignore[arg-type]
    )

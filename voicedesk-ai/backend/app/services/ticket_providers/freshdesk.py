"""
Freshdesk ticket provider.

Pushes a local Ticket to a Freshdesk account via the v2 REST API:
    POST https://{FRESHDESK_DOMAIN}.freshdesk.com/api/v2/tickets

Auth is HTTP Basic — username = API key, password = "X" — per Freshdesk docs.
The provider catches every error it can think of and translates it into an
`ExternalPushResult(status="failed", error=...)`. It never raises so the
orchestrator can safely continue without losing the local ticket.
"""
from __future__ import annotations

import logging
from typing import Any

import httpx

from app.config import settings
from app.models.ticket import Ticket
from app.services.ticket_providers.base import (
    EXTERNAL_STATUS_FAILED,
    EXTERNAL_STATUS_SUCCESS,
    ExternalPushResult,
)

logger = logging.getLogger(__name__)


# Freshdesk priority is 1..4 (low → urgent). Map our urgency strings into it.
_URGENCY_TO_FRESHDESK = {
    "low": 1,
    "normal": 2,
    "high": 3,
    "urgent": 4,
}

_REQUEST_TIMEOUT_SECONDS = 10.0
_FRESHDESK_STATUS_OPEN = 2  # Freshdesk's enum value for "Open"


def _build_description(ticket: Ticket) -> str:
    """
    Compose the ticket body sent to Freshdesk.

    We prefix metadata so an agent reading the Freshdesk UI sees the LLM's
    structured fields *and* the original transcript verbatim.
    """
    return (
        f"<b>Caller:</b> {ticket.caller_name} ({ticket.company})<br>"
        f"<b>Callback:</b> {ticket.callback_number or ticket.phone_number}<br>"
        f"<b>Category:</b> {ticket.category} &nbsp; "
        f"<b>Urgency:</b> {ticket.urgency} &nbsp; "
        f"<b>Impact:</b> {ticket.impact}<br>"
        f"<b>Affected service:</b> {ticket.affected_service or '—'}<br>"
        f"<b>Recommended action:</b> {ticket.recommended_action or '—'}<br>"
        f"<b>Confidence:</b> {ticket.confidence_score:.2f}<br><br>"
        f"<b>Transcript</b><br><pre>{ticket.transcript}</pre>"
    )


def _build_payload(ticket: Ticket) -> dict[str, Any]:
    subject = (ticket.issue_summary or ticket.transcript[:80] or "Support call").strip()
    if len(subject) > 255:
        subject = subject[:254] + "…"

    return {
        "subject": subject,
        "description": _build_description(ticket),
        # Freshdesk requires at least one requester identifier. Phone is the
        # safest bet here since we don't always have an email.
        "phone": ticket.callback_number or ticket.phone_number,
        "name": ticket.caller_name or "Unknown caller",
        "priority": _URGENCY_TO_FRESHDESK.get(ticket.urgency, 2),
        "status": _FRESHDESK_STATUS_OPEN,
    }


def push(ticket: Ticket) -> ExternalPushResult:
    domain = settings.freshdesk_domain
    api_key = settings.freshdesk_api_key

    if not domain or not api_key:
        msg = "FRESHDESK_DOMAIN and FRESHDESK_API_KEY must be set."
        logger.warning("Freshdesk push skipped: %s", msg)
        return ExternalPushResult(status=EXTERNAL_STATUS_FAILED, error=msg)

    url = f"https://{domain}.freshdesk.com/api/v2/tickets"
    payload = _build_payload(ticket)

    try:
        with httpx.Client(timeout=_REQUEST_TIMEOUT_SECONDS) as client:
            response = client.post(url, json=payload, auth=(api_key, "X"))
    except httpx.HTTPError as e:
        # Network errors, DNS failures, timeouts.
        logger.exception("Freshdesk request failed for ticket id=%s", ticket.id)
        return ExternalPushResult(
            status=EXTERNAL_STATUS_FAILED,
            error=f"{type(e).__name__}: {e}",
        )

    if 200 <= response.status_code < 300:
        try:
            data = response.json()
        except ValueError as e:
            logger.error("Freshdesk returned non-JSON success body: %s", e)
            return ExternalPushResult(
                status=EXTERNAL_STATUS_FAILED,
                error=f"Freshdesk returned non-JSON body: {e}",
            )
        external_id = data.get("id")
        if external_id is None:
            return ExternalPushResult(
                status=EXTERNAL_STATUS_FAILED,
                error="Freshdesk response missing 'id' field.",
            )
        return ExternalPushResult(
            status=EXTERNAL_STATUS_SUCCESS,
            external_id=str(external_id),
        )

    # Truncate long error bodies — Freshdesk sometimes returns big HTML pages.
    body_snippet = (response.text or "")[:300]
    logger.error(
        "Freshdesk returned HTTP %s for ticket id=%s: %s",
        response.status_code,
        ticket.id,
        body_snippet,
    )
    return ExternalPushResult(
        status=EXTERNAL_STATUS_FAILED,
        error=f"Freshdesk HTTP {response.status_code}: {body_snippet}",
    )

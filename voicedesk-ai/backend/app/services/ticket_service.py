"""
Ticket service — orchestrator.

Two responsibilities, in order:

    1. LLM extraction (with fallback if the provider fails).
    2. Persist locally (SQLite is the source of truth) and *then* attempt to
       forward to an external helpdesk via the configured ticket provider.

If the external push fails, the local row is updated with
`external_ticket_status='failed'` and the error message — but the ticket is
never lost. Local DB remains authoritative.
"""
from __future__ import annotations

import logging

from sqlalchemy.orm import Session

from app.config import settings
from app.models.ticket import Ticket
from app.schemas.ticket import ExtractedTicket, TranscriptIntake
from app.services.llm_service import LLMExtractionError, extract_ticket_fields
from app.services.ticket_providers import (
    EXTERNAL_STATUS_FAILED,
    EXTERNAL_STATUS_PENDING,
    ExternalPushResult,
    get_provider,
)

logger = logging.getLogger(__name__)


def _fallback_extraction(payload: TranscriptIntake) -> ExtractedTicket:
    """Conservative extraction used when the LLM provider fails."""
    snippet = payload.transcript.strip()
    if len(snippet) > 200:
        snippet = snippet[:199].rstrip() + "…"
    return ExtractedTicket(
        caller_name=payload.caller_name,
        company=payload.company,
        callback_number=payload.phone_number,
        issue_summary=snippet,
        category="general",
        urgency="normal",
        impact="single_user",
        affected_service="",
        recommended_action="Manual triage required — LLM extraction failed.",
        confidence_score=0.0,
    )


def _push_to_external(db: Session, ticket: Ticket) -> None:
    """
    Forward a persisted ticket to the configured external provider and write
    the result back to the same row. Never raises — failures are recorded on
    the row, not propagated.
    """
    provider_name = (settings.ticket_provider or "local").lower()
    try:
        push_fn = get_provider(provider_name)
    except ValueError as e:
        logger.error("Invalid TICKET_PROVIDER configured: %s", e)
        result = ExternalPushResult(status=EXTERNAL_STATUS_FAILED, error=str(e))
    else:
        try:
            result = push_fn(ticket)
        except Exception as e:
            # Provider contract says they shouldn't raise — but defend anyway
            # so an unexpected bug never loses the local ticket.
            logger.exception(
                "Ticket provider %r raised unexpectedly for ticket id=%s",
                provider_name,
                ticket.id,
            )
            result = ExternalPushResult(
                status=EXTERNAL_STATUS_FAILED,
                error=f"{type(e).__name__}: {e}",
            )

    if result.status == EXTERNAL_STATUS_FAILED:
        logger.error(
            "External push to %r failed for ticket id=%s: %s",
            provider_name,
            ticket.id,
            result.error,
        )
    else:
        logger.info(
            "External push to %r for ticket id=%s → %s (external_id=%s)",
            provider_name,
            ticket.id,
            result.status,
            result.external_id,
        )

    ticket.external_ticket_id = result.external_id
    ticket.external_ticket_status = result.status
    ticket.external_error_message = result.error
    db.commit()
    db.refresh(ticket)


def create_ticket_from_transcript(db: Session, payload: TranscriptIntake) -> Ticket:
    """
    1. Run the LLM extractor on the transcript (with fallback).
    2. Persist locally — local SQLite is the source of truth.
    3. Push to the external provider; record outcome on the same row.
    4. Return the (possibly updated) ticket.
    """
    # --- 1. LLM extraction ---------------------------------------------------
    extraction_error: str | None = None
    try:
        extracted = extract_ticket_fields(payload.transcript)
    except LLMExtractionError as e:
        logger.error(
            "LLM extraction failed for caller=%r company=%r — creating fallback ticket. Error: %s",
            payload.caller_name,
            payload.company,
            e,
        )
        extraction_error = str(e)
        extracted = _fallback_extraction(payload)

    # --- 2. Persist locally first (source of truth) --------------------------
    ticket = Ticket(
        caller_name=extracted.caller_name or payload.caller_name,
        company=extracted.company or payload.company,
        phone_number=payload.phone_number,
        callback_number=extracted.callback_number or payload.phone_number,
        transcript=payload.transcript,
        issue_summary=extracted.issue_summary,
        category=extracted.category,
        urgency=extracted.urgency,
        impact=extracted.impact,
        affected_service=extracted.affected_service,
        recommended_action=extracted.recommended_action,
        confidence_score=extracted.confidence_score,
        status="open",
        llm_provider=settings.llm_provider,
        llm_error=extraction_error,
        external_ticket_status=EXTERNAL_STATUS_PENDING,
    )
    db.add(ticket)
    db.commit()
    db.refresh(ticket)

    # --- 3. External push (best-effort, never raises) -----------------------
    _push_to_external(db, ticket)

    return ticket


def list_tickets(db: Session, limit: int = 100) -> list[Ticket]:
    return (
        db.query(Ticket)
        .order_by(Ticket.created_at.desc())
        .limit(limit)
        .all()
    )


def get_ticket(db: Session, ticket_id: int) -> Ticket | None:
    return db.query(Ticket).filter(Ticket.id == ticket_id).first()

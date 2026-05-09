"""
Ticket service — orchestrates LLM extraction + persistence.

Owns the fallback policy: if extraction fails, we *still* create a ticket
(with conservative defaults) so the transcript is never lost. The original
error is logged and persisted to `Ticket.llm_error` for human follow-up.
"""
from __future__ import annotations

import logging

from sqlalchemy.orm import Session

from app.config import settings
from app.models.ticket import Ticket
from app.schemas.ticket import ExtractedTicket, TranscriptIntake
from app.services.llm_service import LLMExtractionError, extract_ticket_fields

logger = logging.getLogger(__name__)


def _fallback_extraction(payload: TranscriptIntake) -> ExtractedTicket:
    """
    Conservative extraction used when the LLM provider fails.
    Confidence = 0 signals to downstream tooling that this needs human review.
    """
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


def create_ticket_from_transcript(db: Session, payload: TranscriptIntake) -> Ticket:
    """
    1. Run the LLM extractor on the transcript.
    2. On failure: log clearly, build a fallback extraction, record the error.
    3. Merge form-supplied caller info as a backstop where the LLM left blanks.
    4. Persist and return the ticket.

    The transcript is always preserved on the row — even when extraction fails.
    """
    extraction_error: str | None = None

    try:
        extracted = extract_ticket_fields(payload.transcript)
    except LLMExtractionError as e:
        # Provider already logged its own stack trace; here we record the
        # high-level decision so ops can grep for "fallback ticket".
        logger.error(
            "LLM extraction failed for caller=%r company=%r — creating fallback ticket. Error: %s",
            payload.caller_name,
            payload.company,
            e,
        )
        extraction_error = str(e)
        extracted = _fallback_extraction(payload)

    ticket = Ticket(
        # LLM-extracted values win; form values backstop blanks.
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
    )
    db.add(ticket)
    db.commit()
    db.refresh(ticket)
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

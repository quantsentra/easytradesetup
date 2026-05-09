"""
Ticket service — orchestrates LLM extraction + persistence.

Routes call into here so the route layer stays thin.
"""
from __future__ import annotations

from sqlalchemy.orm import Session

from app.models.ticket import Ticket
from app.schemas.ticket import TranscriptIntake
from app.services.llm_service import extract_ticket_fields


def create_ticket_from_transcript(db: Session, payload: TranscriptIntake) -> Ticket:
    """
    1. Run the LLM extractor on the transcript.
    2. Persist a Ticket row with caller info + extracted fields.
    3. Return the saved row.
    """
    extracted = extract_ticket_fields(payload.transcript)

    ticket = Ticket(
        caller_name=payload.caller_name,
        company=payload.company,
        phone_number=payload.phone_number,
        transcript=payload.transcript,
        summary=extracted.summary,
        category=extracted.category,
        priority=extracted.priority,
        status="open",
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

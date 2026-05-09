"""
Intake routes — convert raw transcripts into structured tickets.
"""
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.ticket import TicketOut, TranscriptIntake
from app.services.ticket_service import create_ticket_from_transcript

router = APIRouter(prefix="/intake", tags=["intake"])


@router.post(
    "/transcript",
    response_model=TicketOut,
    status_code=status.HTTP_201_CREATED,
)
def intake_transcript(
    payload: TranscriptIntake,
    db: Session = Depends(get_db),
) -> TicketOut:
    """
    Accept a call transcript + caller info, run it through the LLM placeholder,
    persist a ticket, and return the saved record.
    """
    ticket = create_ticket_from_transcript(db, payload)
    return ticket  # type: ignore[return-value]

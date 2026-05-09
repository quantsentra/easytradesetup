"""
Ticket read routes.

Write-side of tickets is handled by /intake/transcript — this module only lists
and fetches them.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.ticket import TicketOut
from app.services.ticket_service import get_ticket, list_tickets

router = APIRouter(prefix="/tickets", tags=["tickets"])


@router.get("", response_model=list[TicketOut])
def get_tickets(db: Session = Depends(get_db)) -> list[TicketOut]:
    """Return the most recent 100 tickets, newest first."""
    return list_tickets(db)  # type: ignore[return-value]


@router.get("/{ticket_id}", response_model=TicketOut)
def get_ticket_by_id(ticket_id: int, db: Session = Depends(get_db)) -> TicketOut:
    """Fetch a single ticket by primary key."""
    ticket = get_ticket(db, ticket_id)
    if ticket is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Ticket {ticket_id} not found",
        )
    return ticket  # type: ignore[return-value]

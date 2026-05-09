"""
Ticket ORM model.

A ticket is the structured artefact produced from a raw call transcript.
Caller info is denormalised onto the row — no separate Customer table for the MVP.

The local SQLite row is always the source of truth. Fields prefixed
`external_` track the optional push to a third-party helpdesk (Freshdesk, etc.).
"""
from datetime import datetime, timezone
from typing import Optional

from sqlalchemy import DateTime, Float, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.db.session import Base


def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


class Ticket(Base):
    __tablename__ = "tickets"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)

    # Caller / company info — form-supplied at intake; LLM may refine.
    caller_name: Mapped[str] = mapped_column(String(120), nullable=False)
    company: Mapped[str] = mapped_column(String(120), nullable=False)
    phone_number: Mapped[str] = mapped_column(String(40), nullable=False)
    callback_number: Mapped[str] = mapped_column(String(40), nullable=False, default="")

    # Raw transcript — always preserved, even when LLM extraction fails.
    transcript: Mapped[str] = mapped_column(Text, nullable=False)

    # Structured fields extracted from the transcript.
    issue_summary: Mapped[str] = mapped_column(Text, nullable=False, default="")
    category: Mapped[str] = mapped_column(String(60), nullable=False, default="general")
    urgency: Mapped[str] = mapped_column(String(20), nullable=False, default="normal")
    impact: Mapped[str] = mapped_column(String(30), nullable=False, default="single_user")
    affected_service: Mapped[str] = mapped_column(String(120), nullable=False, default="")
    recommended_action: Mapped[str] = mapped_column(Text, nullable=False, default="")
    confidence_score: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)

    # Lifecycle + LLM provenance
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="open")
    llm_provider: Mapped[str] = mapped_column(String(40), nullable=False, default="mock")
    llm_error: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    # External helpdesk integration (optional). Status is one of:
    #   "pending"  — local row written, external push not yet attempted
    #   "skipped"  — TICKET_PROVIDER=local, no external system configured
    #   "success"  — pushed to external helpdesk; external_ticket_id populated
    #   "failed"   — push attempted and failed; see external_error_message
    external_ticket_id: Mapped[Optional[str]] = mapped_column(String(120), nullable=True)
    external_ticket_status: Mapped[str] = mapped_column(
        String(20), nullable=False, default="pending"
    )
    external_error_message: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=_utcnow, nullable=False
    )

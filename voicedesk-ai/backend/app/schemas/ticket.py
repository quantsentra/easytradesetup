"""
Pydantic schemas for the intake / ticket API.
"""
from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field


# --- Intake (input) ---------------------------------------------------------


class TranscriptIntake(BaseModel):
    """Payload accepted by POST /intake/transcript."""

    caller_name: str = Field(..., min_length=1, max_length=120)
    company: str = Field(..., min_length=1, max_length=120)
    phone_number: str = Field(..., min_length=3, max_length=40)
    transcript: str = Field(..., min_length=1)


# --- LLM extraction shape ---------------------------------------------------


class ExtractedTicket(BaseModel):
    """
    Structured fields extracted from a transcript.
    The mock LLM service returns this; a real LLM would too.
    """

    summary: str
    category: str
    priority: Literal["low", "normal", "high", "urgent"]


# --- Ticket (output) --------------------------------------------------------


class TicketOut(BaseModel):
    """Ticket as returned by the API."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    caller_name: str
    company: str
    phone_number: str
    transcript: str
    summary: str
    category: str
    priority: str
    status: str
    created_at: datetime

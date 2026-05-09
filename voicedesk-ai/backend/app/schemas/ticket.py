"""
Pydantic schemas for the intake / ticket API.
"""
from datetime import datetime
from typing import Literal, Optional

from pydantic import BaseModel, ConfigDict, Field, field_validator


# Allowed enum values — kept here so validators and prompt stay in sync.
URGENCY_VALUES = ("low", "normal", "high", "urgent")
IMPACT_VALUES = ("single_user", "team", "department", "company_wide")

# Lenient mappings for values an LLM might hallucinate.
_URGENCY_ALIASES = {
    "medium": "normal",
    "med": "normal",
    "moderate": "normal",
    "critical": "urgent",
    "p1": "urgent",
    "p0": "urgent",
    "blocker": "urgent",
    "minor": "low",
    "trivial": "low",
}
_IMPACT_ALIASES = {
    "individual": "single_user",
    "user": "single_user",
    "one_user": "single_user",
    "group": "team",
    "org": "company_wide",
    "organization": "company_wide",
    "global": "company_wide",
    "all_users": "company_wide",
}


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

    Validators normalise values the LLM may return in unexpected casing or
    near-synonyms — the goal is resilience without silently swallowing errors.
    """

    caller_name: str = ""
    company: str = ""
    callback_number: str = ""
    issue_summary: str = ""
    category: str = "general"
    urgency: Literal["low", "normal", "high", "urgent"] = "normal"
    impact: Literal["single_user", "team", "department", "company_wide"] = "single_user"
    affected_service: str = ""
    recommended_action: str = ""
    confidence_score: float = 0.5

    @field_validator("urgency", mode="before")
    @classmethod
    def _normalize_urgency(cls, v):
        if not isinstance(v, str):
            return "normal"
        v_lower = v.strip().lower()
        if v_lower in URGENCY_VALUES:
            return v_lower
        return _URGENCY_ALIASES.get(v_lower, "normal")

    @field_validator("impact", mode="before")
    @classmethod
    def _normalize_impact(cls, v):
        if not isinstance(v, str):
            return "single_user"
        v_lower = v.strip().lower().replace(" ", "_").replace("-", "_")
        if v_lower in IMPACT_VALUES:
            return v_lower
        return _IMPACT_ALIASES.get(v_lower, "single_user")

    @field_validator("confidence_score", mode="before")
    @classmethod
    def _clamp_confidence(cls, v):
        try:
            f = float(v)
        except (TypeError, ValueError):
            return 0.5
        return max(0.0, min(1.0, f))

    @field_validator("category", mode="before")
    @classmethod
    def _normalize_category(cls, v):
        if not isinstance(v, str) or not v.strip():
            return "general"
        return v.strip().lower().replace(" ", "_").replace("-", "_")


# --- Ticket (output) --------------------------------------------------------


class TicketOut(BaseModel):
    """Ticket as returned by the API."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    caller_name: str
    company: str
    phone_number: str
    callback_number: str
    transcript: str
    issue_summary: str
    category: str
    urgency: str
    impact: str
    affected_service: str
    recommended_action: str
    confidence_score: float
    status: str
    llm_provider: str
    llm_error: Optional[str] = None
    created_at: datetime

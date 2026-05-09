"""
Common types for external ticket providers.
"""
from dataclasses import dataclass
from typing import Optional


# Status string values written to Ticket.external_ticket_status.
EXTERNAL_STATUS_PENDING = "pending"
EXTERNAL_STATUS_SKIPPED = "skipped"
EXTERNAL_STATUS_SUCCESS = "success"
EXTERNAL_STATUS_FAILED = "failed"


@dataclass(frozen=True)
class ExternalPushResult:
    """
    Outcome of a single push to an external helpdesk.

    Provider implementations must NEVER raise — they catch their own errors
    and return `status=EXTERNAL_STATUS_FAILED` with a human-readable `error`.
    The orchestrator relies on this contract to keep local persistence safe.
    """

    status: str  # one of EXTERNAL_STATUS_*
    external_id: Optional[str] = None
    error: Optional[str] = None

"""
Local ticket provider — no-op.

Local SQLite is always written by `ticket_service` *before* the external push
runs, so when `TICKET_PROVIDER=local` we simply mark the row as `skipped`
and move on. There is no second store to write to.
"""
from app.models.ticket import Ticket
from app.services.ticket_providers.base import (
    EXTERNAL_STATUS_SKIPPED,
    ExternalPushResult,
)


def push(_: Ticket) -> ExternalPushResult:
    return ExternalPushResult(status=EXTERNAL_STATUS_SKIPPED)

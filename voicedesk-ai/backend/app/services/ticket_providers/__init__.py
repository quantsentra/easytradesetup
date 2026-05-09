"""
External ticket provider registry.

Maps `TICKET_PROVIDER` env values to a `push(ticket) -> ExternalPushResult`
callable. The local provider is a no-op — local SQLite is always written
by `ticket_service` regardless of provider, so "local" simply means "don't
forward anywhere".
"""
from typing import Callable

from app.models.ticket import Ticket
from app.services.ticket_providers import freshdesk, local
from app.services.ticket_providers.base import (
    EXTERNAL_STATUS_FAILED,
    EXTERNAL_STATUS_PENDING,
    EXTERNAL_STATUS_SKIPPED,
    EXTERNAL_STATUS_SUCCESS,
    ExternalPushResult,
)

PushFn = Callable[[Ticket], ExternalPushResult]

PROVIDERS: dict[str, PushFn] = {
    "local": local.push,
    "freshdesk": freshdesk.push,
}


def get_provider(name: str) -> PushFn:
    """Return the push function for `name`. Defaults to local if unknown name."""
    fn = PROVIDERS.get((name or "local").lower())
    if fn is None:
        raise ValueError(
            f"Unknown TICKET_PROVIDER {name!r}. Expected one of: "
            f"{', '.join(PROVIDERS)}."
        )
    return fn


__all__ = [
    "ExternalPushResult",
    "EXTERNAL_STATUS_FAILED",
    "EXTERNAL_STATUS_PENDING",
    "EXTERNAL_STATUS_SKIPPED",
    "EXTERNAL_STATUS_SUCCESS",
    "PROVIDERS",
    "get_provider",
]

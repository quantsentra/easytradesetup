"""
FastAPI application entry point.

Run locally with:
    uvicorn app.main:app --reload --port 8000
"""
import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.config import settings
from app.db.session import init_db
from app.routes import health, intake, tickets


def _configure_logging() -> None:
    # Single root configuration — uvicorn keeps its own access logger.
    logging.basicConfig(
        level=settings.log_level.upper(),
        format="%(asctime)s %(levelname)s %(name)s — %(message)s",
    )


@asynccontextmanager
async def lifespan(_: FastAPI):
    _configure_logging()
    logging.getLogger(__name__).info(
        "Starting %s (env=%s, llm_provider=%s, ticket_provider=%s)",
        settings.app_name,
        settings.app_env,
        settings.llm_provider,
        settings.ticket_provider,
    )
    init_db()
    yield


app = FastAPI(
    title=settings.app_name,
    version="0.3.0",
    description="Local-first MVP that turns support call transcripts into structured IT tickets.",
    lifespan=lifespan,
)

app.include_router(health.router)
app.include_router(intake.router)
app.include_router(tickets.router)

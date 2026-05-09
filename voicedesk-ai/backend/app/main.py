"""
FastAPI application entry point.

Run locally with:
    uvicorn app.main:app --reload --port 8000
"""
from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.config import settings
from app.db.session import init_db
from app.routes import health, intake, tickets


@asynccontextmanager
async def lifespan(_: FastAPI):
    # Create SQLite tables on startup. Idempotent.
    init_db()
    yield


app = FastAPI(
    title=settings.app_name,
    version="0.1.0",
    description="Local-first MVP that turns support call transcripts into structured IT tickets.",
    lifespan=lifespan,
)

# Mount routers
app.include_router(health.router)
app.include_router(intake.router)
app.include_router(tickets.router)

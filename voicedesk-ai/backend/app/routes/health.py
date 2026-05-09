"""Health-check route."""
from fastapi import APIRouter

from app.config import settings

router = APIRouter(tags=["health"])


@router.get("/health")
def health() -> dict:
    """Simple liveness probe — used by smoke tests and uptime checks."""
    return {
        "status": "ok",
        "app": settings.app_name,
        "env": settings.app_env,
    }

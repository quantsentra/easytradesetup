"""
SQLAlchemy engine + session factory.

Single file because the MVP only talks to one SQLite DB.
"""
from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

from app.config import settings


# `check_same_thread=False` is required for SQLite when used by FastAPI
# (FastAPI runs request handlers across threads in the default worker).
engine = create_engine(
    settings.database_url,
    connect_args={"check_same_thread": False}
    if settings.database_url.startswith("sqlite")
    else {},
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    """Base class for all ORM models."""
    pass


def get_db():
    """
    FastAPI dependency that yields a DB session and closes it after the request.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db() -> None:
    """
    Create all tables. Called once on app startup.
    For an MVP this is fine — no migrations yet.
    """
    # Import models so they register with Base.metadata before create_all
    from app.models import ticket  # noqa: F401

    Base.metadata.create_all(bind=engine)

"""
Application configuration.

Loads values from a local `.env` file (see `.env.example`).
Kept tiny on purpose — this is an MVP.
"""
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # SQLite by default — file lives next to the backend working dir
    database_url: str = "sqlite:///./voicedesk.db"

    # App metadata
    app_name: str = "VoiceDesk AI"
    app_env: str = "local"

    # LLM provider (placeholder — mock service ignores these for now)
    llm_provider: str = "mock"
    llm_api_key: str = ""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )


# Singleton settings instance imported by the rest of the app
settings = Settings()

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

    # LLM provider: "openai" | "anthropic" | "mock"
    llm_provider: str = "mock"
    # Generic API key. Provider clients also accept their native env var
    # (OPENAI_API_KEY / ANTHROPIC_API_KEY) when this is empty.
    llm_api_key: str = ""
    # Optional model override. Empty → provider-specific default.
    llm_model: str = ""

    # External ticket provider: "local" | "freshdesk"
    # Local SQLite is *always* written; this only controls extra forwarding.
    ticket_provider: str = "local"
    freshdesk_domain: str = ""
    freshdesk_api_key: str = ""

    # Logging level for the app. DEBUG / INFO / WARNING / ERROR.
    log_level: str = "INFO"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )


# Singleton settings instance imported by the rest of the app
settings = Settings()

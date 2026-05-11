# backend/app/config.py
"""
Centralized configuration.
Reads .env at startup and exposes a typed Settings object.

Usage:
    from app.config import settings
    print(settings.DATABASE_URL)
"""

from functools import lru_cache
from typing import Annotated, List

from pydantic import field_validator
from pydantic_settings import BaseSettings, NoDecode, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )

    # --- Database ---
    DATABASE_URL: str = "sqlite:///./medai.db"

    # --- JWT ---
    SECRET_KEY: str = "dev-only-not-secure-change-me"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    MFA_PENDING_TOKEN_EXPIRE_MINUTES: int = 5

    # --- MFA ---
    MFA_ISSUER_NAME: str = "MedAI Radiology"

    # --- App ---
    UPLOAD_DIR: str = "./uploads"
    BACKEND_CORS_ORIGINS: Annotated[List[str], NoDecode] = ["http://localhost:5173"]
    ENVIRONMENT: str = "development"

    @field_validator("BACKEND_CORS_ORIGINS", mode="before")
    @classmethod
    def _split_cors_origins(cls, v):
        """Allow comma-separated string in .env."""
        if isinstance(v, str):
            return [origin.strip() for origin in v.split(",") if origin.strip()]
        return v


@lru_cache
def get_settings() -> Settings:
    """Cached singleton — settings only read once."""
    return Settings()


settings = get_settings()
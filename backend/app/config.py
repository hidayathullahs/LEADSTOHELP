import os
from functools import lru_cache
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "LEADSTOHELP AI"
    VERSION: str = "1.0.0"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    PORT: int = 8080
    HOST: str = "0.0.0.0"

    # Google Cloud & Gen AI
    GOOGLE_CLOUD_PROJECT: str = "leadstohelp-ai"
    GEMINI_MODEL: str = "gemini-2.5-flash"
    GEMINI_API_KEY: str = ""

    # Firestore & Persistence
    FIRESTORE_DATABASE: str = "(default)"
    FIRESTORE_MODE: str = "dual"  # "cloud", "local", or "dual"
    GCS_BUCKET_INVOICES: str = "leadstohelp-invoices-dev"

    # Security & Auth
    FIREBASE_AUTH_EMULATOR_HOST: str = ""
    JWT_SECRET_KEY: str = "dev_jwt_secret_leadstohelp_change_in_production"
    CORS_ORIGINS: str = "http://localhost:5173,http://localhost:3000,http://localhost:8080,*"

    # Localization
    STORE_ID: str = "store_deccan_roast_01"
    BUSINESS_NAME: str = "Deccan Roast Specialty Coffee & Bakery"
    BASE_CURRENCY: str = "INR"
    TIMEZONE: str = "Asia/Kolkata"

    model_config = SettingsConfigDict(
        env_file=os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env"),
        env_file_encoding="utf-8",
        extra="ignore"
    )

    @property
    def cors_origins_list(self) -> List[str]:
        if not self.CORS_ORIGINS:
            return ["*"]
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]

    @property
    def is_production(self) -> bool:
        return self.ENVIRONMENT.lower() == "production" or not self.DEBUG

@lru_cache()
def get_settings() -> Settings:
    return Settings()

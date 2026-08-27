"""
LEADSTOHELP AI - Deterministic Pytest Test Suite Configuration & Isolation
Ensures local execution mode and bounded google-auth metadata discovery
are established BEFORE any application module or singleton is initialized.
"""

import os
import pytest

def pytest_configure(config):
    """
    Pytest startup hook called BEFORE test collection or module importing.
    Guarantees deterministic local development environment for the test suite.

    Also sets google-auth metadata bounds so that the production security test
    (which intentionally triggers cloud Firestore init with invalid credentials)
    fails fast (~2-3s) instead of blocking for ~300s in metadata backoff.
    """
    # Application environment
    os.environ["DEBUG"] = "true"
    os.environ["ENVIRONMENT"] = "development"
    os.environ["FIRESTORE_MODE"] = "local"
    os.environ["GOOGLE_CLOUD_PROJECT"] = "leadstohelp-ai-test"
    os.environ["GEMINI_MODEL"] = "gemini-2.5-flash"
    os.environ["FIREBASE_AUTH_EMULATOR_HOST"] = ""

    # Bound google-auth GCE metadata server discovery (library-supported knobs).
    # These prevent the metadata server retry loop from blocking for ~300s
    # when no valid credentials exist.
    os.environ.setdefault("GCE_METADATA_TIMEOUT", "1")
    os.environ.setdefault("GCE_METADATA_DETECT_RETRIES", "1")


@pytest.fixture(autouse=True)
def isolate_test_environment(monkeypatch):
    """
    Autouse fixture that runs for every test in the suite.
    Resets settings cache and singleton instances so tests do not leak mutated state.
    """
    from app.config import get_settings
    from app.services.firestore_service import reset_firestore_service
    from app.services.audit_service import reset_audit_service

    # Pre-test cleanup
    get_settings.cache_clear()
    reset_firestore_service()
    reset_audit_service()

    yield

    # Post-test cleanup
    get_settings.cache_clear()
    reset_firestore_service()
    reset_audit_service()

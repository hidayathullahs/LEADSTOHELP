"""
LEADSTOHELP AI - Deterministic Pytest Test Suite Configuration & Isolation
Ensures local execution mode is established BEFORE any application module or singleton is initialized.
"""

import os
import pytest

def pytest_configure(config):
    """
    Pytest startup hook called BEFORE test collection or module importing.
    Guarantees deterministic local development environment for the test suite.
    """
    os.environ["DEBUG"] = "true"
    os.environ["ENVIRONMENT"] = "development"
    os.environ["FIRESTORE_MODE"] = "local"
    os.environ["GOOGLE_CLOUD_PROJECT"] = "leadstohelp-ai-test"
    os.environ["GEMINI_MODEL"] = "gemini-2.5-flash"
    os.environ["FIREBASE_AUTH_EMULATOR_HOST"] = ""


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

"""
LEADSTOHELP AI - Root Pytest Hook Configuration
Ensures local execution environment and bounded google-auth metadata discovery
before any test module or app component is imported.
"""

import os

def pytest_configure(config):
    """
    Early hook configuring local mock/development flags before importing
    application code. Also sets google-auth metadata discovery bounds so
    any test that accidentally triggers credential resolution fails fast
    instead of blocking for ~300s.
    """
    # Application environment
    os.environ["DEBUG"] = "true"
    os.environ["ENVIRONMENT"] = "development"
    os.environ["FIRESTORE_MODE"] = "local"
    os.environ["GOOGLE_CLOUD_PROJECT"] = "leadstohelp-ai-test"
    os.environ["GEMINI_MODEL"] = "gemini-2.5-flash"
    os.environ["FIREBASE_AUTH_EMULATOR_HOST"] = ""

    # Bound google-auth GCE metadata server discovery (library-supported knobs)
    os.environ.setdefault("GCE_METADATA_TIMEOUT", "1")
    os.environ.setdefault("GCE_METADATA_DETECT_RETRIES", "1")

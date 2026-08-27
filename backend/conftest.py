"""
LEADSTOHELP AI - Root Pytest Hook Configuration
Ensures local execution environment before any test module or app component is imported.
"""

import os

def pytest_configure(config):
    """Early hook configuring local mock/development flags before importing application code."""
    os.environ["DEBUG"] = "true"
    os.environ["ENVIRONMENT"] = "development"
    os.environ["FIRESTORE_MODE"] = "local"
    os.environ["GOOGLE_CLOUD_PROJECT"] = "leadstohelp-ai-test"
    os.environ["GEMINI_MODEL"] = "gemini-2.5-flash"
    os.environ["FIREBASE_AUTH_EMULATOR_HOST"] = ""

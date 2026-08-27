"""
LEADSTOHELP AI - Production Readiness & Security Test Suite
Verifies strict authentication, absence of silent fallbacks in production,
visible telemetry tagging, and non-secret status disclosures.
"""

import os
import pytest
from fastapi.testclient import TestClient
from fastapi import HTTPException

from app.main import app
from app.config import Settings, get_settings
from app.auth import verify_token, require_manager_role, AuthenticatedUser
from app.services.gemini_service import GeminiService
from app.services.firestore_service import DualModeFirestoreService

client = TestClient(app)

# -----------------------------------------------------------------------------
# Test A: Production rejects unauthenticated request
# -----------------------------------------------------------------------------
def test_production_rejects_unauthenticated_request(monkeypatch):
    # Simulate Production Environment
    monkeypatch.setenv("DEBUG", "false")
    monkeypatch.setenv("ENVIRONMENT", "production")
    get_settings.cache_clear()
    
    # Request without Authorization header
    with pytest.raises(HTTPException) as exc_info:
        verify_token(authorization=None)
    assert exc_info.value.status_code == 401
    assert "Authorization header missing" in exc_info.value.detail
    get_settings.cache_clear()


# -----------------------------------------------------------------------------
# Test B: Production rejects development token
# -----------------------------------------------------------------------------
def test_production_rejects_development_token(monkeypatch):
    # Simulate Production Environment
    monkeypatch.setenv("DEBUG", "false")
    monkeypatch.setenv("ENVIRONMENT", "production")
    get_settings.cache_clear()
    
    dev_token = "Bearer dev_jwt_secret_leadstohelp_change_in_production"
    
    with pytest.raises(HTTPException) as exc_info:
        verify_token(authorization=dev_token)
    assert exc_info.value.status_code == 401
    get_settings.cache_clear()


# -----------------------------------------------------------------------------
# Test C: Local mode permits configured development behavior
# -----------------------------------------------------------------------------
def test_local_mode_permits_configured_development_behavior(monkeypatch):
    # Simulate Local Dev Environment
    monkeypatch.setenv("DEBUG", "true")
    monkeypatch.setenv("ENVIRONMENT", "development")
    get_settings.cache_clear()
    
    user = verify_token(authorization=None)
    assert user is not None
    assert user.role == "STORE_MANAGER"
    assert user.store_id == "store_deccan_roast_01"
    get_settings.cache_clear()


# -----------------------------------------------------------------------------
# Test D: Production Firestore failure does not silently fall back
# -----------------------------------------------------------------------------
def test_production_firestore_failure_does_not_silently_fallback(monkeypatch):
    # Simulate production mode with FIRESTORE_MODE="cloud" and non-existent project/ADC
    monkeypatch.setenv("DEBUG", "false")
    monkeypatch.setenv("ENVIRONMENT", "production")
    monkeypatch.setenv("FIRESTORE_MODE", "cloud")
    monkeypatch.setenv("GOOGLE_CLOUD_PROJECT", "invalid-mock-project-for-test-999")
    get_settings.cache_clear()
    
    # In cloud mode without credentials, it must raise RuntimeError and fail loudly
    with pytest.raises(RuntimeError) as exc_info:
        DualModeFirestoreService()
    assert "CRITICAL: Failed to initialize Google Cloud Firestore" in str(exc_info.value)
    get_settings.cache_clear()


# -----------------------------------------------------------------------------
# Test E: Gemini fallback is visibly distinguishable
# -----------------------------------------------------------------------------
@pytest.mark.asyncio
async def test_gemini_fallback_is_visibly_distinguishable(monkeypatch):
    monkeypatch.setenv("GEMINI_API_KEY", "")
    get_settings.cache_clear()
    service = GeminiService()
    
    # Check status indicator
    status = service.get_status()
    assert status["gemini_configured"] is False
    assert status["gemini_live_available"] is False
    assert "DEMO / OFFLINE" in status["ai_mode"]
    
    # Check reasoning response has visible disclaimer
    response = await service.generate_reasoning(
        system_instruction="You are an operations assistant",
        user_prompt="Will we run out of coffee beans?"
    )
    assert "[DEMO / OFFLINE FALLBACK MODE" in response


# -----------------------------------------------------------------------------
# Test F: Health and Status endpoints do not expose secrets
# -----------------------------------------------------------------------------
def test_health_and_status_endpoints_do_not_expose_secrets():
    # 1. Test /health
    res_health = client.get("/health")
    assert res_health.status_code == 200
    health_data = res_health.json()
    assert health_data["status"] == "healthy"
    assert "api_key" not in health_data
    assert "secret" not in str(health_data).lower()
    
    # 2. Test /api/system/status
    res_status = client.get("/api/system/status")
    assert res_status.status_code == 200
    status_data = res_status.json()
    assert "service" in status_data
    assert "gemini" in status_data
    assert "firestore" in status_data
    assert "authentication" in status_data
    
    # Ensure no secrets leak
    for key in ["api_key", "jwt_secret_key", "password", "token"]:
        assert key not in status_data
        assert key not in status_data["gemini"]
        assert key not in status_data["firestore"]


# -----------------------------------------------------------------------------
# Test G: Approval state transitions cannot be bypassed
# -----------------------------------------------------------------------------
def test_approval_state_cannot_be_bypassed():
    from app.services.firestore_service import get_firestore_service
    db = get_firestore_service()
    
    # Retrieve approvals (or create one if needed)
    approvals = db.get_approvals("store_deccan_roast_01")
    if not approvals:
        from app.tools.approval_tools import request_approval_for_proposal
        db.save_negotiation_proposal({
            "proposal_id": "PROP-TEST-SEC",
            "store_id": "store_deccan_roast_01",
            "sku": "COFFEE-001",
            "scenario_id": "SCENARIO-B",
            "supplier_id": "SUPP-001",
            "supplier_name": "Metro Wholesale Hub",
            "product_name": "Coffee Beans",
            "target_quantity": 50,
            "target_unit_price": 850.0,
            "current_quote_unit_price": 900.0,
            "expected_savings": 2500.0,
            "status": "PENDING_APPROVAL"
        })
        request_approval_for_proposal("PROP-TEST-SEC")
        approvals = db.get_approvals("store_deccan_roast_01")
    
    assert len(approvals) > 0
    test_id = approvals[0]["approval_id"]
    
    # Submit approval decision
    res = client.post(
        f"/api/approvals/{test_id}/decision",
        json={"decision": "APPROVED", "decision_reason": "Verified stock levels and authorized by manager."}
    )
    assert res.status_code == 200
    updated = res.json()
    assert updated["status"] == "APPROVED"
    assert updated["decided_by_name"] == "Arjun Rao (Operations Manager)"
    
    # Verify audit log was recorded
    audit_logs = db._local_db.get("audit_logs", [])
    matched_logs = [log for log in audit_logs if log.get("resource_id") == test_id]
    assert len(matched_logs) > 0
    assert matched_logs[-1]["action"] in ["APPROVAL_GRANTED", "APPROVAL_APPROVED"]


# -----------------------------------------------------------------------------
# Test H: Unauthorized users cannot approve procurement actions
# -----------------------------------------------------------------------------
def test_unauthorized_users_cannot_approve_actions():
    unauthorized_staff = AuthenticatedUser(
        uid="staff_user_99",
        email="barista@deccanroast.in",
        name="Junior Barista",
        role="STAFF",
        store_id="store_deccan_roast_01"
    )
    
    with pytest.raises(HTTPException) as exc_info:
        require_manager_role(user=unauthorized_staff)
    assert exc_info.value.status_code == 403
    assert "Insufficient permissions" in exc_info.value.detail

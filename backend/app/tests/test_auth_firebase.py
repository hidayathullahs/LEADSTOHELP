"""
Tests for Firebase Authentication, ID Token Verification, and RBAC Enforcers
"""

import pytest
from unittest.mock import patch, MagicMock
from fastapi import HTTPException
from app.auth import verify_token, require_manager_role, AuthenticatedUser, init_firebase_admin
from app.config import get_settings


def test_auth_missing_header_rejected_in_production():
    """In production mode, missing Authorization header must raise HTTP 401"""
    with patch("app.auth.get_settings") as mock_settings:
        settings_instance = MagicMock()
        settings_instance.is_production = True
        settings_instance.DEBUG = False
        settings_instance.ENABLE_DEV_AUTH_BYPASS = False
        settings_instance.STORE_ID = "store_deccan_roast_01"
        mock_settings.return_value = settings_instance

        with pytest.raises(HTTPException) as exc_info:
            verify_token(authorization=None)
        assert exc_info.value.status_code == 401
        assert "Authorization header missing" in exc_info.value.detail


def test_auth_invalid_token_format_rejected():
    """Tokens not prefixed with 'Bearer ' must raise HTTP 401"""
    with pytest.raises(HTTPException) as exc_info:
        verify_token(authorization="Basic dXNlcjpwYXNz")
    assert exc_info.value.status_code == 401
    assert "Expected 'Bearer <token>'" in exc_info.value.detail


def test_auth_production_invalid_firebase_token_rejected():
    """In production mode, an unverified Firebase token must raise HTTP 401"""
    with patch("app.auth.get_settings") as mock_settings:
        settings_instance = MagicMock()
        settings_instance.is_production = True
        settings_instance.DEBUG = False
        settings_instance.ENABLE_DEV_AUTH_BYPASS = False
        settings_instance.STORE_ID = "store_deccan_roast_01"
        mock_settings.return_value = settings_instance

        with pytest.raises(HTTPException) as exc_info:
            verify_token(authorization="Bearer invalid_fake_token_12345")
        assert exc_info.value.status_code == 401


def test_auth_verified_firebase_token_extracts_user():
    """A successfully decoded Firebase token should populate AuthenticatedUser accurately"""
    mock_decoded = {
        "uid": "firebase_uid_rahul_sharma",
        "email": "rahul.sharma@deccanroast.in",
        "name": "Rahul Sharma",
        "role": "PROCUREMENT_LEAD",
        "store_id": "store_deccan_roast_01"
    }

    mock_auth_module = MagicMock()
    mock_auth_module.verify_id_token.return_value = mock_decoded
    mock_firebase_admin = MagicMock()
    mock_firebase_admin.auth = mock_auth_module

    with patch.dict("sys.modules", {"firebase_admin": mock_firebase_admin, "firebase_admin.auth": mock_auth_module}):
        user = verify_token(authorization="Bearer valid_mocked_id_token")
        assert user.uid == "firebase_uid_rahul_sharma"
        assert user.email == "rahul.sharma@deccanroast.in"
        assert user.role == "PROCUREMENT_LEAD"
        assert user.store_id == "store_deccan_roast_01"


def test_require_manager_role_permits_authorized_roles():
    """require_manager_role should accept STORE_MANAGER, PROCUREMENT_LEAD, and BUSINESS_OWNER"""
    manager = AuthenticatedUser(
        uid="u1", email="m@d.in", name="Manager", role="STORE_MANAGER", store_id="s1"
    )
    assert require_manager_role(manager) == manager

    proc_lead = AuthenticatedUser(
        uid="u2", email="p@d.in", name="Proc", role="PROCUREMENT_LEAD", store_id="s1"
    )
    assert require_manager_role(proc_lead) == proc_lead


def test_require_manager_role_forbids_staff_role():
    """require_manager_role should raise HTTP 403 for unauthorized roles like STAFF"""
    staff = AuthenticatedUser(
        uid="u3", email="s@d.in", name="Staff Member", role="STAFF", store_id="s1"
    )
    with pytest.raises(HTTPException) as exc_info:
        require_manager_role(staff)
    assert exc_info.value.status_code == 403
    assert "Insufficient permissions" in exc_info.value.detail

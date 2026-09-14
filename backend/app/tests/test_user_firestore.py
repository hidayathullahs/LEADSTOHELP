"""
Tests for User-Isolated Firestore Persistence (/users/{uid}/...)
Verifies that data belonging to User A is completely unreachable and partitioned from User B.
"""

import pytest
from app.services.user_firestore_service import get_user_firestore_service, reset_user_firestore_service


@pytest.fixture(autouse=True)
def clean_user_db():
    reset_user_firestore_service()
    yield
    reset_user_firestore_service()


def test_user_chat_session_creation_and_isolation():
    """Validates that chat sessions are strictly partitioned by authenticated UID"""
    service = get_user_firestore_service()
    user_a = "uid_arjun_operations"
    user_b = "uid_priya_finance"

    # User A creates a session
    s_a = service.create_chat_session(uid=user_a, session_id="ses_a_001", title="Arabica Coffee Run-Rate")
    assert s_a["session_id"] == "ses_a_001"
    assert s_a["uid"] == user_a

    # User B creates a session
    s_b = service.create_chat_session(uid=user_b, session_id="ses_b_001", title="Vendor Audit Kaveri")
    assert s_b["session_id"] == "ses_b_001"
    assert s_b["uid"] == user_b

    # Verify User A only sees User A sessions
    sessions_a = service.get_chat_sessions(uid=user_a)
    assert len(sessions_a) == 1
    assert sessions_a[0]["session_id"] == "ses_a_001"

    # Verify User B only sees User B sessions
    sessions_b = service.get_chat_sessions(uid=user_b)
    assert len(sessions_b) == 1
    assert sessions_b[0]["session_id"] == "ses_b_001"

    # Direct retrieval cross-check: User A cannot retrieve User B's session
    assert service.get_chat_session(uid=user_a, session_id="ses_b_001") is None
    assert service.get_chat_session(uid=user_b, session_id="ses_a_001") is None


def test_user_multi_turn_message_history_isolation():
    """Validates that chat message history turns are strictly isolated between UIDs"""
    service = get_user_firestore_service()
    user_a = "uid_arjun_operations"
    user_b = "uid_priya_finance"
    session_id = "shared_id_attempt"

    # User A writes messages
    service.save_chat_message(uid=user_a, session_id=session_id, role="user", content="What is Arabica stock?")
    service.save_chat_message(uid=user_a, session_id=session_id, role="model", content="Current stock is 36 kg.")

    # User B writes messages to what might be the same session ID name
    service.save_chat_message(uid=user_b, session_id=session_id, role="user", content="Review invoice INV-8842.")
    service.save_chat_message(uid=user_b, session_id=session_id, role="model", content="Found ₹486.40 discrepancy.")

    # Check history isolation
    history_a = service.get_chat_history(uid=user_a, session_id=session_id)
    assert len(history_a) == 2
    assert "Arabica stock" in history_a[0]["content"]

    history_b = service.get_chat_history(uid=user_b, session_id=session_id)
    assert len(history_b) == 2
    assert "INV-8842" in history_b[0]["content"]


def test_user_approval_history_isolation():
    """Validates that approval records are stored under /users/{uid}/approvals and isolated"""
    service = get_user_firestore_service()
    user_a = "uid_arjun_operations"
    user_b = "uid_priya_finance"

    service.record_user_approval(uid=user_a, approval_data={
        "approval_id": "APPR-2026-001",
        "title": "Split Order PO for Coffee Beans",
        "cost_inr": 86328.0
    })

    service.record_user_approval(uid=user_b, approval_data={
        "approval_id": "APPR-2026-002",
        "title": "Milk Supply Contract Renewal",
        "cost_inr": 45000.0
    })

    approvals_a = service.get_user_approvals(uid=user_a)
    assert len(approvals_a) == 1
    assert approvals_a[0]["approval_id"] == "APPR-2026-001"

    approvals_b = service.get_user_approvals(uid=user_b)
    assert len(approvals_b) == 1
    assert approvals_b[0]["approval_id"] == "APPR-2026-002"

    # User A updates their approval
    updated = service.update_user_approval_decision(
        uid=user_a, approval_id="APPR-2026-001", decision="APPROVED", reason="SLA verified"
    )
    assert updated["status"] == "APPROVED"
    assert updated["decision_reason"] == "SLA verified"

    # User B cannot update User A's approval
    cross_update = service.update_user_approval_decision(
        uid=user_b, approval_id="APPR-2026-001", decision="REJECTED"
    )
    assert cross_update is None


def test_user_preferences_isolation():
    """Validates user preferences storage under /users/{uid}/preferences/settings"""
    service = get_user_firestore_service()
    user_a = "uid_arjun_operations"
    user_b = "uid_priya_finance"

    service.save_user_preferences(uid=user_a, preferences={"theme": "dark", "safety_buffer_days": 3})
    service.save_user_preferences(uid=user_b, preferences={"theme": "light", "safety_buffer_days": 7})

    prefs_a = service.get_user_preferences(uid=user_a)
    assert prefs_a["theme"] == "dark"
    assert prefs_a["safety_buffer_days"] == 3

    prefs_b = service.get_user_preferences(uid=user_b)
    assert prefs_b["theme"] == "light"
    assert prefs_b["safety_buffer_days"] == 7

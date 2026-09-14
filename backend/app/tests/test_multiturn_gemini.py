"""
Tests for Gemini Multi-Turn Conversational Interaction & Session Memory
"""

import pytest
from app.services.gemini_service import get_gemini_service
from app.agents.orchestrator import get_orchestrator
from app.services.user_firestore_service import reset_user_firestore_service


@pytest.fixture(autouse=True)
def setup_teardown():
    reset_user_firestore_service()
    yield
    reset_user_firestore_service()


@pytest.mark.asyncio
async def test_gemini_multiturn_grounded_followup():
    """Validates that Gemini service preserves multi-turn conversation context across turns"""
    service = get_gemini_service()

    # Turn 1: Initial query regarding coffee stockout
    turn_1_prompt = "Why is Arabica coffee at risk of stockout?"
    turn_1_response = await service.generate_multiturn_reasoning(
        system_instruction="You are an operations assistant.",
        user_prompt=turn_1_prompt,
        conversation_history=[]
    )
    assert "Stockout Analysis" in turn_1_response or "Arabica" in turn_1_response
    assert "COFFEE-001" in turn_1_response or "36" in turn_1_response

    # Turn 2: Follow-up query referencing previous turn context
    history = [
        {"role": "user", "content": turn_1_prompt},
        {"role": "model", "content": turn_1_response}
    ]
    turn_2_prompt = "What happens if weekend demand increases by 20%?"
    turn_2_response = await service.generate_multiturn_reasoning(
        system_instruction="You are an operations assistant.",
        user_prompt=turn_2_prompt,
        conversation_history=history
    )
    assert "Demand Surge" in turn_2_response or "15.6" in turn_2_response or "2.3" in turn_2_response

    # Turn 3: Strategy comparison follow-up
    history.extend([
        {"role": "user", "content": turn_2_prompt},
        {"role": "model", "content": turn_2_response}
    ]
    )
    turn_3_prompt = "Which supplier strategy is safer?"
    turn_3_response = await service.generate_multiturn_reasoning(
        system_instruction="You are an operations assistant.",
        user_prompt=turn_3_prompt,
        conversation_history=history
    )
    assert "Scenario B" in turn_3_response or "Split-Order" in turn_3_response or "Safest" in turn_3_response


@pytest.mark.asyncio
async def test_orchestrator_session_id_persistence():
    """Validates that Orchestrator generates/accepts session_id and saves both user and model turns"""
    orchestrator = get_orchestrator()
    uid = "test_operator_uid"

    # 1. Ask initial question with new session
    res1 = await orchestrator.process_user_request(
        user_prompt="Run stockout risk check for Arabica",
        user_id=uid,
        session_id="custom_session_999"
    )
    assert res1["session_id"] == "custom_session_999"
    assert res1["status"] == "COMPLETED"

    # Check that messages were persisted to user Firestore
    messages = orchestrator.user_db.get_chat_history(uid=uid, session_id="custom_session_999")
    assert len(messages) == 2
    assert messages[0]["role"] == "user"
    assert messages[1]["role"] == "model"

    # 2. Ask follow-up question referencing same session_id
    res2 = await orchestrator.process_user_request(
        user_prompt="What happens if demand increases by 20%?",
        user_id=uid,
        session_id="custom_session_999"
    )
    assert res2["session_id"] == "custom_session_999"

    # Verify 4 total messages in session history
    updated_messages = orchestrator.user_db.get_chat_history(uid=uid, session_id="custom_session_999")
    assert len(updated_messages) == 4
    assert updated_messages[2]["role"] == "user"
    assert updated_messages[3]["role"] == "model"

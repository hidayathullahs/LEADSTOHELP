"""
LEADSTOHELP AI - Phase 1 Automated Test Suite
Validates dynamic, SKU-specific data in Operations Copilot, removing hardcoded
coffee evidence and procurement narratives.

Coverage:
1. Two different non-coffee SKUs (DAIRY-001, PACK-001) asserting SKU-specific data and no hardcoded coffee values.
2. Dynamically updated inventory stock reflected immediately in evidence and days of supply.
3. Missing optional inventory metrics explicitly marked 'Unavailable' without crashing.
4. Procurement simulation scenarios, supplier allocations, and costs dynamically generated.
5. Grounded Gemini offline fallback mode with clear demo disclaimer and dynamic SKU context.
"""

import pytest
import copy
from fastapi.testclient import TestClient
from app.main import app
from app.services.firestore_service import get_firestore_service
from app.services.gemini_service import get_gemini_service
from app.services.user_firestore_service import reset_user_firestore_service
from app.tools import procurement_tools

client = TestClient(app)
AUTH_HEADER = {"Authorization": "Bearer dev_jwt_secret_leadstohelp_change_in_production"}


@pytest.fixture(autouse=True)
def setup_teardown():
    reset_user_firestore_service()
    yield
    reset_user_firestore_service()


def test_copilot_sku_dairy():
    """Validates Operations Copilot dynamically fetches DAIRY-001 data without hardcoded coffee numbers"""
    db = get_firestore_service()
    item = db.get_inventory_by_sku("store_deccan_roast_01", "DAIRY-001")
    assert item is not None, "DAIRY-001 must exist in seeded inventory"

    response = client.post(
        "/api/agent/ask",
        json={
            "prompt": "Check stock levels and replenishment for DAIRY-001",
            "sku": "DAIRY-001",
            "context": {"page_context": "inventory", "selected_sku": "DAIRY-001"}
        },
        headers=AUTH_HEADER
    )
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "COMPLETED"

    # Evidence inspection
    evidence_map = {e["label"]: e["value"] for e in data["evidence"]}
    assert evidence_map["SKU Analyzed"] == "DAIRY-001"
    assert f"{item['current_stock']} litres" in str(evidence_map["Current Stock"])
    assert f"{item['daily_usage_avg']} litres/day" in str(evidence_map["Daily Run-Rate"])
    assert "litres" in str(evidence_map["Safety Threshold"])
    assert "litres" in str(evidence_map["Reorder Point"])

    # Assert response does NOT contain unrelated coffee figures or coffee SKU
    text_content = (
        data.get("response", "") + " " +
        data.get("summary", "") + " " +
        data.get("recommended_strategy", "")
    )
    assert "COFFEE-001" not in text_content
    assert "Arabica" not in text_content
    assert "86328" not in text_content
    assert "86,328" not in text_content
    assert "8,672" not in text_content


def test_copilot_sku_packaging():
    """Validates Operations Copilot dynamically fetches PACK-001 data (packets) without coffee figures"""
    db = get_firestore_service()
    item = db.get_inventory_by_sku("store_deccan_roast_01", "PACK-001")
    assert item is not None, "PACK-001 must exist in seeded inventory"

    response = client.post(
        "/api/agent/ask",
        json={
            "prompt": "Evaluate stockout risk for 12oz Kraft Cups",
            "sku": "PACK-001",
            "context": {"page_context": "inventory", "selected_sku": "PACK-001"}
        },
        headers=AUTH_HEADER
    )
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "COMPLETED"

    evidence_map = {e["label"]: e["value"] for e in data["evidence"]}
    assert evidence_map["SKU Analyzed"] == "PACK-001"
    assert "packets" in str(evidence_map["Current Stock"])
    assert "packets/day" in str(evidence_map["Daily Run-Rate"])

    text_content = (
        data.get("response", "") + " " +
        data.get("summary", "") + " " +
        data.get("recommended_strategy", "")
    )
    assert "Arabica" not in text_content
    assert "86328" not in text_content


def test_copilot_changed_inventory_values():
    """Validates that modifying inventory stock immediately updates evidence and replenishment calculations"""
    db = get_firestore_service()
    orig_item = copy.deepcopy(db.get_inventory_by_sku("store_deccan_roast_01", "DAIRY-001"))
    
    try:
        # Update stock to a distinct test value (18.5 litres)
        db.update_inventory_stock("store_deccan_roast_01", "DAIRY-001", 18.5)

        response = client.post(
            "/api/agent/ask",
            json={
                "prompt": "Will we run out of milk this weekend?",
                "sku": "DAIRY-001",
                "context": {"page_context": "inventory", "selected_sku": "DAIRY-001"}
            },
            headers=AUTH_HEADER
        )
        assert response.status_code == 200
        data = response.json()

        evidence_map = {e["label"]: e["value"] for e in data["evidence"]}
        assert "18.5 litres" in str(evidence_map["Current Stock"])
        
        # Verify depletion proximity reflects new stock: 18.5 / 35.0 = ~0.5 days
        depletion_str = str(evidence_map["Depletion Proximity"])
        assert "0.5 days" in depletion_str or "0.6 days" in depletion_str or "0.4 days" in depletion_str
    finally:
        # Restore original stock
        db.update_inventory_stock("store_deccan_roast_01", "DAIRY-001", orig_item["current_stock"])


def test_copilot_missing_optional_metric_marked_unavailable():
    """Validates that missing optional metrics are explicitly marked 'Unavailable' and do not crash"""
    db = get_firestore_service()
    test_sku = "TEST-SPARE-001"
    spare_item = {
        "sku": test_sku,
        "name": "Spare Portafilter Gasket",
        "category": "Maintenance",
        "unit": "pieces",
        "current_stock": 4.0,
        "daily_usage_avg": None,   # Missing optional metric
        "safety_stock": None,      # Missing optional metric
        "reorder_point": None,     # Missing optional metric
        "lead_time_days": None,    # Missing optional metric
        "stockout_risk": None,     # Missing optional metric
        "store_id": "store_deccan_roast_01"
    }
    db._local_db["inventory"].append(spare_item)

    try:
        response = client.post(
            "/api/agent/ask",
            json={
                "prompt": "Analyze inventory status for Spare Portafilter Gasket",
                "sku": test_sku,
                "context": {"page_context": "inventory", "selected_sku": test_sku}
            },
            headers=AUTH_HEADER
        )
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "COMPLETED"

        evidence_map = {e["label"]: e["value"] for e in data["evidence"]}
        assert evidence_map["SKU Analyzed"] == test_sku
        assert "4.0 pieces" in str(evidence_map["Current Stock"])
        assert evidence_map["Daily Run-Rate"] == "Unavailable"
        assert evidence_map["Depletion Proximity"] == "Unavailable"
        assert evidence_map["Safety Threshold"] == "Unavailable"
        assert evidence_map["Reorder Point"] == "Unavailable"
        assert evidence_map["Lead Time"] == "Unavailable"
        assert evidence_map["Stockout Risk"] == "Unavailable"

        # Assert no fabricated depletion date or days_until_stockout is returned
        from app.tools import inventory_tools
        forecast = inventory_tools.forecast_demand(test_sku)
        assert forecast.get("days_until_stockout") is None
        assert forecast.get("projected_stockout_date") is None
    finally:
        db._local_db["inventory"] = [i for i in db._local_db["inventory"] if i.get("sku") != test_sku]
        db._save_local_data()


def test_copilot_missing_stock_or_zero_usage_depletion_unavailable():
    """Validates that missing current_stock or zero daily_usage_avg yields Unavailable depletion proximity and no fabricated date"""
    db = get_firestore_service()
    sku_no_stock = "TEST-NO-STOCK-001"
    sku_zero_usage = "TEST-ZERO-USAGE-001"
    
    item_no_stock = {
        "sku": sku_no_stock,
        "name": "Widget With Unknown Stock",
        "category": "Testing",
        "unit": "units",
        "current_stock": None,     # Missing current stock
        "daily_usage_avg": 5.0,    # Daily usage present
        "store_id": "store_deccan_roast_01"
    }
    item_zero_usage = {
        "sku": sku_zero_usage,
        "name": "Dormant Seasonal Widget",
        "category": "Testing",
        "unit": "units",
        "current_stock": 25.0,     # Current stock present
        "daily_usage_avg": 0.0,    # Zero daily usage
        "store_id": "store_deccan_roast_01"
    }
    db._local_db["inventory"].extend([item_no_stock, item_zero_usage])

    try:
        # Case 1: Missing current stock
        res1 = client.post(
            "/api/agent/ask",
            json={"prompt": f"Analyze stockout for {sku_no_stock}", "sku": sku_no_stock},
            headers=AUTH_HEADER
        )
        assert res1.status_code == 200
        ev1 = {e["label"]: e["value"] for e in res1.json()["evidence"]}
        assert ev1["Current Stock"] == "Unavailable"
        assert ev1["Daily Run-Rate"] == "5.0 units/day"
        assert ev1["Depletion Proximity"] == "Unavailable"

        # Case 2: Zero daily usage
        res2 = client.post(
            "/api/agent/ask",
            json={"prompt": f"Analyze stockout for {sku_zero_usage}", "sku": sku_zero_usage},
            headers=AUTH_HEADER
        )
        assert res2.status_code == 200
        ev2 = {e["label"]: e["value"] for e in res2.json()["evidence"]}
        assert "25.0 units" in ev2["Current Stock"]
        assert ev2["Daily Run-Rate"] == "0.0 units/day"
        assert ev2["Depletion Proximity"] == "Unavailable"

        # Case 3: Verify forecast tool returns no fabricated date for either
        from app.tools import inventory_tools
        fc1 = inventory_tools.forecast_demand(sku_no_stock)
        assert fc1.get("days_until_stockout") is None
        assert fc1.get("projected_stockout_date") is None

        fc2 = inventory_tools.forecast_demand(sku_zero_usage)
        assert fc2.get("days_until_stockout") is None
        assert fc2.get("projected_stockout_date") is None
    finally:
        db._local_db["inventory"] = [
            i for i in db._local_db["inventory"]
            if i.get("sku") not in (sku_no_stock, sku_zero_usage)
        ]
        db._save_local_data()


def test_copilot_procurement_scenario_data():
    """Validates that recommendation and governance approval use actual simulator output"""
    db = get_firestore_service()
    sku = "DAIRY-001"
    sim_result = procurement_tools.simulate_procurement(sku=sku)
    rec_scenario = sim_result["recommended_scenario"]
    expected_cost = rec_scenario["total_cost"]
    expected_savings = rec_scenario["savings_vs_quote"]

    response = client.post(
        "/api/agent/ask",
        json={
            "prompt": "Replenish barista milk",
            "sku": sku,
            "context": {"page_context": "procurement", "selected_sku": sku}
        },
        headers=AUTH_HEADER
    )
    assert response.status_code == 200
    data = response.json()

    assert rec_scenario["name"] in data["recommended_strategy"]
    
    # Check user approvals created in session
    approvals_resp = client.get("/api/user/approvals", headers=AUTH_HEADER)
    assert approvals_resp.status_code == 200
    user_approvals = approvals_resp.json()["approvals"]
    
    latest_approval = next((a for a in user_approvals if a.get("sku") == sku), None)
    assert latest_approval is not None
    assert latest_approval["cost_inr"] == pytest.approx(expected_cost, 0.01)
    assert latest_approval["potential_savings_inr"] == pytest.approx(expected_savings, 0.01)


def test_gemini_offline_fallback_dynamic_and_badged():
    """Validates that Gemini offline fallback is badged and contextualized to requested SKU"""
    gemini = get_gemini_service()
    
    # 1. Test DAIRY-001 fallback
    fallback_dairy = gemini._generate_grounded_fallback(
        system_instruction="You are an operations assistant.",
        user_prompt="Stockout check for DAIRY-001",
        context_data={
            "sku": "DAIRY-001",
            "product_name": "Pasteurized Full Cream Barista Milk",
            "unit": "litres",
            "current_stock": 45.0,
            "daily_usage_avg": 35.0,
            "days_left": 1.3,
            "safety_stock": 25.0,
            "reorder_point": 60.0,
            "lead_time_days": 1,
            "stockout_risk": "HIGH",
            "total_cost": 5800.0,
            "expected_savings": 450.0
        }
    )
    assert "DEMO / OFFLINE FALLBACK MODE" in fallback_dairy
    assert "DAIRY-001" in fallback_dairy
    assert "litres" in fallback_dairy
    assert "45.0 litres" in fallback_dairy
    assert "35.0 litres/day" in fallback_dairy
    assert "₹5,800.00" in fallback_dairy
    assert "Arabica" not in fallback_dairy
    assert "86328" not in fallback_dairy

    # 2. Test COFFEE-001 fallback still preserves baseline
    fallback_coffee = gemini._generate_grounded_fallback(
        system_instruction="You are an operations assistant.",
        user_prompt="Why is Arabica coffee at risk of stockout?",
        context_data=None  # Should resolve COFFEE-001 from prompt
    )
    assert "DEMO / OFFLINE FALLBACK MODE" in fallback_coffee
    assert "COFFEE-001" in fallback_coffee
    assert "Arabica" in fallback_coffee
    assert "36.0 kg" in fallback_coffee

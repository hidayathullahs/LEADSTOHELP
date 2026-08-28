"""
LEADSTOHELP AI - End-to-End API Integration & Multi-Agent Tests
Validates health probe, inventory endpoints, scenario simulations, approval governance, and agent runs.
"""

import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_endpoint():
    """Validates /health liveness probe"""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["service"] == "leadstohelp-ai"

def test_overview_endpoint():
    """Validates control tower summary and risk metrics"""
    response = client.get("/api/overview", headers={"Authorization": "Bearer dev_jwt_secret_leadstohelp_change_in_production"})
    assert response.status_code == 200
    data = response.json()
    assert "risk_radar" in data
    assert "metrics" in data
    assert data["metrics"]["total_skus"] >= 60

def test_inventory_list_and_details():
    """Validates inventory filtering and individual SKU lookup"""
    response = client.get("/api/inventory?category=Coffee", headers={"Authorization": "Bearer dev_jwt_secret_leadstohelp_change_in_production"})
    assert response.status_code == 200
    data = response.json()
    assert data["count"] >= 5

    sku_resp = client.get("/api/inventory/COFFEE-001", headers={"Authorization": "Bearer dev_jwt_secret_leadstohelp_change_in_production"})
    assert sku_resp.status_code == 200
    sku_data = sku_resp.json()
    assert sku_data["item"]["sku"] == "COFFEE-001"
    assert len(sku_data["sales_history"]) > 0

def test_procurement_simulator_endpoint():
    """Validates simulation endpoint returning strategic scenarios"""
    response = client.get("/api/procurement/simulate?sku=COFFEE-001&quantity=100", headers={"Authorization": "Bearer dev_jwt_secret_leadstohelp_change_in_production"})
    assert response.status_code == 200
    data = response.json()
    assert len(data["scenarios"]) == 6
    assert any(s["scenario_id"] == "SCENARIO-A" for s in data["scenarios"])
    assert any(s["scenario_id"] == "SCENARIO-B" for s in data["scenarios"])
    assert any(s["scenario_id"] == "SCENARIO-C" for s in data["scenarios"])
    assert any(s["scenario_id"] == "SCENARIO-D" for s in data["scenarios"])


def test_human_in_the_loop_approval_lifecycle():
    """Validates approval creation, review, and manager decision recording"""
    # 1. Fetch approvals (or create one if queue is empty)
    list_resp = client.get("/api/approvals", headers={"Authorization": "Bearer dev_jwt_secret_leadstohelp_change_in_production"})
    assert list_resp.status_code == 200
    approvals = list_resp.json()["approvals"]
    
    if not approvals:
        # Create a proposal to populate queue
        prop_res = client.post(
            "/api/procurement/proposals",
            json={"sku": "COFFEE-001", "scenario_id": "SCENARIO-B", "target_quantity": 100},
            headers={"Authorization": "Bearer dev_jwt_secret_leadstohelp_change_in_production"}
        )
        assert prop_res.status_code == 200
        list_resp = client.get("/api/approvals", headers={"Authorization": "Bearer dev_jwt_secret_leadstohelp_change_in_production"})
        approvals = list_resp.json()["approvals"]

    assert len(approvals) >= 1
    appr_id = approvals[0]["approval_id"]
    
    # 2. Approve action
    dec_resp = client.post(
        f"/api/approvals/{appr_id}/decision",
        json={"decision": "APPROVED", "decision_reason": "Authorized for weekend peak service."},
        headers={"Authorization": "Bearer dev_jwt_secret_leadstohelp_change_in_production"}
    )
    assert dec_resp.status_code == 200
    assert dec_resp.json()["status"] == "APPROVED"

def test_multimodal_invoice_audit_endpoint():
    """Validates invoice audit submission and discrepancy reconciliation"""
    invoice_payload = {
        "supplier_name": "Kaveri Organic Dairy Co-op",
        "invoice_number": "INV-TEST-001",
        "purchase_order_id": "PO-10022",
        "items": [{"sku": "DAIRY-001", "name": "Milk", "quantity": 100.0, "unit_price": 60.8, "line_total": 6080.0}],
        "total_amount": 6584.0
    }
    
    import json
    response = client.post(
        "/api/invoices/audit-upload",
        data={"raw_json": json.dumps(invoice_payload)},
        headers={"Authorization": "Bearer dev_jwt_secret_leadstohelp_change_in_production"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["status"] in ["RED", "AMBER", "GREEN"]
    assert "discrepancies" in data

def test_master_agent_ask_stockout_flow():
    """Validates end-to-end Master Orchestrator prompt processing"""
    response = client.post(
        "/api/agent/ask",
        json={"prompt": "Will we run out of coffee beans this week?"},
        headers={"Authorization": "Bearer dev_jwt_secret_leadstohelp_change_in_production"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "COMPLETED"
    assert "Inventory Intelligence Agent" in data["agents_involved"]
    assert len(data["steps"]) >= 2

def test_whatif_simulate_endpoint():
    """Validates /api/whatif/simulate digital twin endpoint"""
    response = client.post(
        "/api/whatif/simulate",
        json={"sku": "COFFEE-001", "demand_change_pct": 20.0, "supplier_delay_days": 2.0},
        headers={"Authorization": "Bearer dev_jwt_secret_leadstohelp_change_in_production"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["sku"] == "COFFEE-001"
    assert "baseline" in data
    assert "modified" in data
    assert "risk_delta" in data
    assert "recommendation" in data
    assert data["modified"]["days_of_supply"] < data["baseline"]["days_of_supply"]

def test_impact_metrics_endpoint():
    """Validates /api/impact/metrics analytics endpoint"""
    response = client.get(
        "/api/impact/metrics",
        headers={"Authorization": "Bearer dev_jwt_secret_leadstohelp_change_in_production"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "metrics" in data
    assert "label" in data
    assert data["metrics"]["total_skus_monitored"] > 0
    assert "estimated_savings_inr" in data["metrics"]

def test_sku_evidence_endpoint():
    """Validates /api/inventory/{sku}/evidence endpoint"""
    response = client.get(
        "/api/inventory/COFFEE-001/evidence",
        headers={"Authorization": "Bearer dev_jwt_secret_leadstohelp_change_in_production"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["sku"] == "COFFEE-001"
    assert "evidence" in data
    assert len(data["evidence"]) >= 5
    assert "forecast" in data

def test_demo_reset_endpoint():
    """Validates /api/demo/reset endpoint restores deterministic state"""
    response = client.post(
        "/api/demo/reset",
        headers={"Authorization": "Bearer dev_jwt_secret_leadstohelp_change_in_production"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "RESET_COMPLETE"

def test_master_agent_structured_response_envelope():
    """Validates 8-part structured response envelope with correlation ID and evidence"""
    response = client.post(
        "/api/agent/ask",
        json={"prompt": "Run the Arabica Crisis demo", "sku": "COFFEE-001", "context": {"page_context": "inventory"}},
        headers={"Authorization": "Bearer dev_jwt_secret_leadstohelp_change_in_production"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "COMPLETED"
    assert "correlation_id" in data
    assert data["correlation_id"].startswith("LH-")
    assert "summary" in data
    assert "evidence" in data
    assert len(data["evidence"]) >= 3
    assert "what_if_insight" in data
    assert "recommended_strategy" in data
    assert "risk_level" in data
    assert "governance_state" in data
    assert "action_buttons" in data
    assert "REVIEW_EVIDENCE" in data["action_buttons"]
    assert "tools_used" in data
    assert len(data["tools_used"]) >= 1

def test_agent_runs_telemetry_with_correlation():
    """Validates that Agent Inspector telemetry records contain correlation_id and step traces"""
    # Trigger a query first
    client.post(
        "/api/agent/ask",
        json={"prompt": "Audit Kaveri Dairy invoice for quantity shortages", "context": {"page_context": "invoices"}},
        headers={"Authorization": "Bearer dev_jwt_secret_leadstohelp_change_in_production"}
    )
    
    # Check agent runs list
    response = client.get(
        "/api/agent-runs",
        headers={"Authorization": "Bearer dev_jwt_secret_leadstohelp_change_in_production"}
    )
    assert response.status_code == 200
    runs = response.json()
    assert runs["count"] > 0
    latest_run = runs["runs"][0]
    assert "correlation_id" in latest_run
    assert latest_run["correlation_id"].startswith("LH-")
    assert "steps" in latest_run
    assert len(latest_run["steps"]) >= 1
    assert "agent_name" in latest_run["steps"][0]



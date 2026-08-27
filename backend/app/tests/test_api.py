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
    """Validates simulation endpoint returning 3 strategic scenarios"""
    response = client.get("/api/procurement/simulate?sku=COFFEE-001&quantity=100", headers={"Authorization": "Bearer dev_jwt_secret_leadstohelp_change_in_production"})
    assert response.status_code == 200
    data = response.json()
    assert len(data["scenarios"]) == 3
    assert data["recommended_scenario"]["scenario_id"] == "SCENARIO-B"

def test_human_in_the_loop_approval_lifecycle():
    """Validates approval creation, review, and manager decision recording"""
    # 1. Fetch pending approvals
    list_resp = client.get("/api/approvals?status=PENDING", headers={"Authorization": "Bearer dev_jwt_secret_leadstohelp_change_in_production"})
    assert list_resp.status_code == 200
    approvals = list_resp.json()["approvals"]
    assert len(approvals) >= 1
    
    appr_id = approvals[0]["approval_id"]
    
    # 2. Approve action
    dec_resp = client.post(
        f"/api/approvals/{appr_id}/decision",
        json={"decision": "APPROVED", "reason": "Authorized for weekend peak service."},
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

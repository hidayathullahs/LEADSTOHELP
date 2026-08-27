"""
LEADSTOHELP AI - Deterministic Calculation Engines Test Suite
Validates mathematical precision, safety stock formulas, scenario simulation, and 3-way discrepancy checks.
"""

import pytest
from app.engines.inventory_engine import (
    calculate_safety_stock,
    calculate_reorder_point,
    calculate_days_of_supply,
    calculate_recommended_order_quantity,
    generate_demand_forecast
)
from app.engines.simulator_engine import (
    simulate_procurement_scenarios,
    calculate_effective_price_with_discount
)
from app.engines.discrepancy_engine import compare_invoice_to_purchase_order
from app.engines.risk_engine import evaluate_supply_risk_radar
from app.engines.supplier_scoring_engine import calculate_supplier_reliability

def test_inventory_math():
    """Validates Safety Stock and Reorder Point formulas"""
    # Daily usage std = 2.5, Lead time = 2 days, Z = 1.645
    # Safety stock = 1.645 * 2.5 * sqrt(2) = 5.815 -> 5.8
    safety_stock = calculate_safety_stock(daily_std=2.5, lead_time_days=2, service_level=0.95)
    assert safety_stock >= 5.5 and safety_stock <= 6.0
    
    # ROP = (13.0 * 2) + 5.8 = 31.8
    rop = calculate_reorder_point(daily_avg=13.0, lead_time_days=2, safety_stock=safety_stock)
    assert rop == round((13.0 * 2) + safety_stock, 1)
    
    # Days of supply = 36.0 / 13.0 = 2.76 -> 2.8
    dos = calculate_days_of_supply(current_stock=36.0, daily_avg=13.0)
    assert dos == 2.8

def test_scenario_simulator():
    """Validates multi-supplier procurement simulation"""
    mock_suppliers = [
        {
            "supplier_id": "sup_01",
            "name": "Metro Wholesale Hub",
            "performance": {"reliability_score": 91.0, "on_time_delivery_rate": 96.0},
            "catalog": [
                {
                    "sku": "COFFEE-001",
                    "base_unit_price": 950.0,
                    "lead_time_days": 2,
                    "volume_discount_tiers": [{"min_quantity": 50, "discount_percentage": 5.0, "discounted_unit_price": 902.5}]
                }
            ]
        },
        {
            "supplier_id": "sup_02",
            "name": "Malnad Coffee Direct",
            "performance": {"reliability_score": 94.5, "on_time_delivery_rate": 92.0},
            "catalog": [
                {
                    "sku": "COFFEE-001",
                    "base_unit_price": 920.0,
                    "lead_time_days": 4,
                    "volume_discount_tiers": [{"min_quantity": 60, "discount_percentage": 9.0, "discounted_unit_price": 837.2}]
                }
            ]
        }
    ]

    scenarios = simulate_procurement_scenarios(
        sku="COFFEE-001",
        target_quantity=100.0,
        suppliers=mock_suppliers,
        current_stock=36.0,
        daily_usage=13.0
    )

    assert len(scenarios) == 3
    scenario_b = next(s for s in scenarios if s["scenario_id"] == "SCENARIO-B")
    assert scenario_b["is_recommended"] is True
    assert scenario_b["unit_price"] < 900.0
    assert scenario_b["savings_vs_quote"] > 0

def test_invoice_discrepancy_detection_perfect_match():
    """Validates zero-discrepancy clean invoice verification"""
    po = {
        "po_id": "PO-10021",
        "supplier_name": "Metro Wholesale Hub",
        "total_amount": 44600.0,
        "items": [{"sku": "COFFEE-001", "product_name": "Arabica Coffee", "quantity": 50.0, "unit_price": 840.0, "line_total": 42000.0}]
    }
    inv = {
        "supplier_name": "Metro Wholesale Hub",
        "invoice_number": "INV-10428",
        "purchase_order_id": "PO-10021",
        "total_amount": 44600.0,
        "items": [{"sku": "COFFEE-001", "name": "Arabica Coffee", "quantity": 50.0, "unit_price": 840.0, "line_total": 42000.0}]
    }

    result = compare_invoice_to_purchase_order(inv, po)
    assert result["status"] == "GREEN"
    assert len(result["discrepancies"]) == 0
    assert result["total_variance_inr"] == 0.0

def test_invoice_discrepancy_detection_quantity_shortage():
    """Validates detection of physical shortage (8 units missing)"""
    po = {
        "po_id": "PO-10022",
        "supplier_name": "Kaveri Organic Dairy Co-op",
        "total_amount": 6584.0,
        "items": [{"sku": "DAIRY-001", "product_name": "Barista Milk", "quantity": 100.0, "received_quantity": 92.0, "unit_price": 60.8, "line_total": 6080.0}]
    }
    inv = {
        "supplier_name": "Kaveri Organic Dairy Co-op",
        "invoice_number": "INV-KAV-8842",
        "purchase_order_id": "PO-10022",
        "total_amount": 6584.0,
        "items": [{"sku": "DAIRY-001", "name": "Barista Milk", "quantity": 100.0, "unit_price": 60.8, "line_total": 6080.0}]
    }

    result = compare_invoice_to_purchase_order(inv, po)
    assert result["status"] == "RED"
    assert len(result["discrepancies"]) == 1
    assert result["discrepancies"][0]["type"] == "QUANTITY_MISMATCH"
    assert result["total_variance_inr"] == round(8.0 * 60.8, 2)

def test_supply_risk_radar():
    """Validates 7-factor risk radar aggregation and explainability"""
    mock_inv = [{"sku": "COFFEE-001", "days_of_supply": 2.8, "lead_time_days": 2, "stockout_risk": "HIGH"}]
    mock_sup = [{"name": "Metro", "performance": {"reliability_score": 91.0, "on_time_delivery_rate": 96.0}}]
    mock_audits = [{"status": "RED", "supplier_name": "Kaveri Dairy"}]
    mock_store = {"monthly_procurement_budget": 850000.0, "current_month_spend": 512000.0}

    radar = evaluate_supply_risk_radar(mock_inv, mock_sup, mock_audits, mock_store)
    assert 0 <= radar["overall_score"] <= 100
    assert len(radar["dimensions"]) == 7
    assert radar["critical_risks_count"] >= 1
    assert "Stockout Risk" in [d["dimension_name"] for d in radar["dimensions"]]

def test_supplier_reliability_scoring():
    """Validates dynamic reliability metric formulation"""
    score = calculate_supplier_reliability(
        on_time_delivery_rate=96.0,
        invoice_accuracy_rate=94.0,
        fulfillment_rate=98.0,
        price_stability_rate=88.0,
        avg_response_time_min=14.0,
        discrepancy_rate=4.5
    )
    assert score >= 88.0 and score <= 94.0

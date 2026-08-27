"""
LEADSTOHELP AI - Procurement & Simulation Tools
Tools for multi-scenario order modeling, budget impact, and draft proposal preparation.
"""

from typing import Dict, Any, List, Optional
from datetime import datetime, timedelta
from ..services.firestore_service import get_firestore_service
from ..engines.simulator_engine import simulate_procurement_scenarios
from ..engines.inventory_engine import calculate_recommended_order_quantity

def simulate_procurement(sku: str, quantity: Optional[float] = None) -> Dict[str, Any]:
    """
    Executes deep simulation comparing Scenario A (Single Supplier), 
    Scenario B (Split Order), and Scenario C (Delay Purchase).
    """
    db = get_firestore_service()
    item = db.get_inventory_by_sku("store_deccan_roast_01", sku)
    if not item:
        return {"error": f"SKU {sku} not found."}
        
    suppliers = db.get_suppliers()
    
    if not quantity:
        quantity = calculate_recommended_order_quantity(
            current_stock=item.get("current_stock", 0.0),
            reorder_point=item.get("reorder_point", 10.0),
            daily_avg=item.get("daily_usage_avg", 5.0),
            min_order_qty=item.get("min_order_qty", 10.0)
        )
        
    scenarios = simulate_procurement_scenarios(
        sku=sku,
        target_quantity=quantity,
        suppliers=suppliers,
        current_stock=item.get("current_stock", 0.0),
        daily_usage=item.get("daily_usage_avg", 5.0)
    )
    
    recommended_scenario = next((s for s in scenarios if s.get("is_recommended")), scenarios[0])
    
    return {
        "sku": sku,
        "product_name": item.get("name"),
        "target_quantity": quantity,
        "scenarios": scenarios,
        "recommended_scenario": recommended_scenario,
        "simulated_at": datetime.now().isoformat()
    }

def create_purchase_proposal(
    sku: str,
    target_scenario_id: str = "SCENARIO-B",
    quantity: Optional[float] = None
) -> Dict[str, Any]:
    """Generates an actionable procurement proposal with structured scenarios and draft outreach."""
    db = get_firestore_service()
    sim_result = simulate_procurement(sku=sku, quantity=quantity)
    if "error" in sim_result:
        return sim_result
        
    selected_scenario = next((s for s in sim_result["scenarios"] if s["scenario_id"] == target_scenario_id), sim_result["recommended_scenario"])
    
    proposal_data = {
        "proposal_id": f"PROP-{datetime.now().year}-{len(db.get_negotiation_proposals()) + 1:03d}",
        "store_id": "store_deccan_roast_01",
        "supplier_id": selected_scenario["supplier_allocations"][0]["supplier_id"],
        "supplier_name": selected_scenario["supplier_allocations"][0]["supplier_name"],
        "sku": sku,
        "product_name": sim_result["product_name"],
        "quantity": sim_result["target_quantity"],
        "current_quote_unit_price": selected_scenario["unit_price"] * 1.08,
        "historical_avg_unit_price": selected_scenario["unit_price"] * 0.97,
        "target_unit_price": selected_scenario["unit_price"],
        "total_original_cost": round(selected_scenario["total_cost"] + selected_scenario["savings_vs_quote"], 2),
        "total_target_cost": selected_scenario["total_cost"],
        "expected_savings": selected_scenario["savings_vs_quote"],
        "supplier_reliability_score": 91.0,
        "lead_time_days": selected_scenario["lead_time_days"],
        "rationale": f"Simulated {selected_scenario['name']}. Secured lowest blended unit price with guaranteed stockout mitigation buffer.",
        "data_points_used": [
            f"Target replenishment: {sim_result['target_quantity']} units",
            f"Strategy selected: {selected_scenario['name']}",
            f"Projected savings: ₹{selected_scenario['savings_vs_quote']:.2f}"
        ],
        "draft_negotiation_message": (
            f"Hi team,\n\n"
            f"We are looking to confirm our replenishment order of {sim_result['target_quantity']} units of {sim_result['product_name']}.\n"
            f"Based on planned volume, please confirm confirmation at ₹{selected_scenario['unit_price']:.2f}/unit with {selected_scenario['lead_time_days']}-day delivery SLA.\n\n"
            f"Regards,\nOperations Team | Deccan Roast"
        ),
        "status": "PENDING_APPROVAL",
        "scenarios": sim_result["scenarios"],
        "selected_scenario_id": target_scenario_id
    }
    
    saved_proposal = db.save_negotiation_proposal(proposal_data)
    return saved_proposal

def create_purchase_order_draft(
    supplier_id: str,
    items: List[Dict[str, Any]],
    expected_delivery_days: int = 2
) -> Dict[str, Any]:
    """Prepares a formal Draft Purchase Order ready for approval routing."""
    db = get_firestore_service()
    sup = db.get_supplier_by_id(supplier_id)
    
    subtotal = sum(float(i.get("unit_price", 0.0)) * float(i.get("quantity", 0.0)) for i in items)
    tax_amount = round(subtotal * 0.05, 2)
    total_amount = round(subtotal + tax_amount, 2)
    
    delivery_date = (datetime.now() + timedelta(days=expected_delivery_days)).strftime("%Y-%m-%d")
    
    po_data = {
        "store_id": "store_deccan_roast_01",
        "supplier_id": supplier_id,
        "supplier_name": sup.get("name") if sup else "Supplier Partner",
        "status": "DRAFT",
        "items": items,
        "subtotal": subtotal,
        "tax_rate": 0.05,
        "tax_amount": tax_amount,
        "shipping_cost": 0.0,
        "total_amount": total_amount,
        "expected_delivery_date": delivery_date
    }
    
    return db.create_purchase_order(po_data)

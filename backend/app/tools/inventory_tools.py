"""
LEADSTOHELP AI - Inventory Intelligence Tools
Explicit typed tool signatures for Inventory Agent and Orchestrator.
"""

from typing import Dict, Any, List, Optional
from ..services.firestore_service import get_firestore_service
from ..engines.inventory_engine import (
    calculate_safety_stock,
    calculate_reorder_point,
    calculate_days_of_supply,
    calculate_recommended_order_quantity,
    generate_demand_forecast
)

def get_inventory(
    category: Optional[str] = None,
    risk_level: Optional[str] = None,
    search: Optional[str] = None
) -> List[Dict[str, Any]]:
    """Retrieves list of inventory items with optional filtering by category, risk level, or name/SKU search."""
    db = get_firestore_service()
    return db.get_inventory(category=category, risk_level=risk_level, search=search)

def get_inventory_by_sku(sku: str) -> Optional[Dict[str, Any]]:
    """Fetches full inventory record for a specific SKU."""
    db = get_firestore_service()
    return db.get_inventory_by_sku("store_deccan_roast_01", sku)

def get_inventory_risk() -> Dict[str, Any]:
    """Identifies items currently breaching safety stock thresholds or at critical stockout risk."""
    db = get_firestore_service()
    items = db.get_inventory()
    critical_items = [i for i in items if i.get("stockout_risk") == "HIGH"]
    warning_items = [i for i in items if i.get("stockout_risk") == "MEDIUM"]
    excess_items = [i for i in items if i.get("excess_stock_risk") in ["HIGH", "MEDIUM"]]
    
    return {
        "critical_count": len(critical_items),
        "warning_count": len(warning_items),
        "excess_count": len(excess_items),
        "critical_items": critical_items,
        "warning_items": warning_items,
        "excess_items": excess_items
    }

def get_sales_history(sku: str, days: int = 90) -> List[Dict[str, Any]]:
    """Retrieves historical sales and consumption records for an SKU."""
    db = get_firestore_service()
    return db.get_sales_history("store_deccan_roast_01", sku, days=days)

def forecast_demand(sku: str, horizon_days: int = 7) -> Dict[str, Any]:
    """Calculates statistical forward demand projection and stockout date for an SKU."""
    db = get_firestore_service()
    item = db.get_inventory_by_sku("store_deccan_roast_01", sku)
    if not item:
        return {"error": f"SKU {sku} not found."}
    
    sales = db.get_sales_history("store_deccan_roast_01", sku, days=90)
    forecast = generate_demand_forecast(
        sales_history=sales,
        current_stock=item.get("current_stock", 0.0),
        lead_time_days=item.get("lead_time_days", 2),
        horizon_days=horizon_days
    )
    forecast["sku"] = sku
    forecast["product_name"] = item.get("name")
    return forecast

def calculate_reorder_quantity(sku: str) -> Dict[str, Any]:
    """Determines exact replenishment order quantity based on safety stock and current run-rate."""
    db = get_firestore_service()
    item = db.get_inventory_by_sku("store_deccan_roast_01", sku)
    if not item:
        return {"error": f"SKU {sku} not found."}
        
    recommended_qty = calculate_recommended_order_quantity(
        current_stock=item.get("current_stock", 0.0),
        reorder_point=item.get("reorder_point", 10.0),
        daily_avg=item.get("daily_usage_avg", 5.0),
        min_order_qty=item.get("min_order_qty", 10.0)
    )
    return {
        "sku": sku,
        "product_name": item.get("name"),
        "current_stock": item.get("current_stock"),
        "reorder_point": item.get("reorder_point"),
        "recommended_order_quantity": recommended_qty,
        "unit": item.get("unit")
    }

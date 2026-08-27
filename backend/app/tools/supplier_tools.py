"""
LEADSTOHELP AI - Supplier Intelligence Tools
Explicit typed tool signatures for Supplier Network and Procurement Agents.
"""

from typing import Dict, Any, List, Optional
from ..services.firestore_service import get_firestore_service

def get_suppliers(category: Optional[str] = None) -> List[Dict[str, Any]]:
    """Retrieves all approved suppliers with reliability scores and performance metrics."""
    db = get_firestore_service()
    return db.get_suppliers(category=category)

def get_supplier_by_id(supplier_id: str) -> Optional[Dict[str, Any]]:
    """Fetches comprehensive profile, catalog, and SLA history for a specific supplier."""
    db = get_firestore_service()
    return db.get_supplier_by_id(supplier_id)

def get_supplier_catalog(supplier_id: str) -> List[Dict[str, Any]]:
    """Retrieves full item catalog and volume discount tiers for a supplier."""
    db = get_firestore_service()
    sup = db.get_supplier_by_id(supplier_id)
    return sup.get("catalog", []) if sup else []

def get_supplier_terms(supplier_id: str) -> Dict[str, Any]:
    """Retrieves contractual payment terms, GSTIN, and minimum lead time for a supplier."""
    db = get_firestore_service()
    sup = db.get_supplier_by_id(supplier_id)
    if not sup:
        return {"error": f"Supplier {supplier_id} not found."}
    return {
        "supplier_id": supplier_id,
        "name": sup.get("name"),
        "payment_terms": sup.get("payment_terms"),
        "gstin": sup.get("gstin"),
        "performance": sup.get("performance", {})
    }

def compare_suppliers(sku: str) -> Dict[str, Any]:
    """Compares all suppliers carrying a specific SKU on unit price, lead time, and reliability score."""
    db = get_firestore_service()
    suppliers = db.get_suppliers()
    
    comparisons = []
    for s in suppliers:
        for cat_item in s.get("catalog", []):
            if cat_item.get("sku") == sku:
                comparisons.append({
                    "supplier_id": s["supplier_id"],
                    "supplier_name": s["name"],
                    "base_unit_price": cat_item.get("base_unit_price"),
                    "lead_time_days": cat_item.get("lead_time_days"),
                    "reliability_score": s.get("performance", {}).get("reliability_score"),
                    "on_time_rate": s.get("performance", {}).get("on_time_delivery_rate"),
                    "invoice_accuracy_rate": s.get("performance", {}).get("invoice_accuracy_rate"),
                    "volume_discount_tiers": cat_item.get("volume_discount_tiers", [])
                })
                
    # Sort by reliability score and price
    comparisons.sort(key=lambda x: (-x["reliability_score"], x["base_unit_price"]))
    return {
        "sku": sku,
        "matching_suppliers_count": len(comparisons),
        "suppliers": comparisons
    }

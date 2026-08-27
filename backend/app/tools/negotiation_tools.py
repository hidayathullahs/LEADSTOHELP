"""
LEADSTOHELP AI - Vendor Negotiation Tools
Calculates mathematically grounded discount targets and formats professional vendor communications.
"""

from typing import Dict, Any, List, Optional
from ..services.firestore_service import get_firestore_service
from ..engines.simulator_engine import calculate_effective_price_with_discount

def calculate_target_price(sku: str, supplier_id: str, quantity: float) -> Dict[str, Any]:
    """Calculates realistic target unit price and volume savings grounded in supplier tiers."""
    db = get_firestore_service()
    sup = db.get_supplier_by_id(supplier_id)
    if not sup:
        return {"error": f"Supplier {supplier_id} not found."}
        
    catalog_item = next((i for i in sup.get("catalog", []) if i.get("sku") == sku), None)
    if not catalog_item:
        return {"error": f"Supplier {sup.get('name')} does not carry SKU {sku}."}
        
    base_price = catalog_item.get("base_unit_price", 100.0)
    tier_discount_price = calculate_effective_price_with_discount(catalog_item, quantity)
    
    # Target price represents aggressive but realistic volume pricing (additional ~2-3% on top of volume tier)
    target_price = round(tier_discount_price * 0.98, 2)
    expected_savings = round((base_price - target_price) * quantity, 2)
    
    return {
        "sku": sku,
        "product_name": catalog_item.get("product_name"),
        "supplier_id": supplier_id,
        "supplier_name": sup.get("name"),
        "quantity": quantity,
        "base_unit_price": base_price,
        "tier_discount_unit_price": tier_discount_price,
        "recommended_target_unit_price": target_price,
        "total_savings_inr": expected_savings,
        "savings_percentage": round(((base_price - target_price) / base_price) * 100.0, 1),
        "supplier_reliability_score": sup.get("performance", {}).get("reliability_score", 85.0)
    }

def generate_negotiation_message(
    sku: str,
    supplier_id: str,
    quantity: float,
    target_price: float,
    delivery_days: int = 2
) -> str:
    """Drafts professional negotiation message citing volume commitments and delivery SLA."""
    db = get_firestore_service()
    sup = db.get_supplier_by_id(supplier_id)
    item = db.get_inventory_by_sku("store_deccan_roast_01", sku)
    
    sup_name = sup.get("name", "Supplier") if sup else "Supplier"
    contact = sup.get("contact_person", "Team") if sup else "Team"
    prod_name = item.get("name", sku) if item else sku
    
    return (
        f"Dear {contact} ({sup_name}),\n\n"
        f"Hope this email finds you well.\n\n"
        f"In light of our scheduled store operations and recurring monthly volume, Deccan Roast is planning an immediate order of "
        f"{quantity:.0f} {item.get('unit', 'units') if item else 'units'} of {prod_name}.\n\n"
        f"Based on our planned quarterly volume commitment and ongoing partnership, we request confirmation of a special volume unit price of "
        f"₹{target_price:,.2f}/{item.get('unit', 'unit') if item else 'unit'} with delivery scheduled within {delivery_days} business days.\n\n"
        f"Please let us know if you can confirm this rate so we can issue the official purchase order.\n\n"
        f"Warm regards,\n"
        f"Arjun Rao | Operations Lead\n"
        f"Deccan Roast Specialty Coffee & Bakery\n"
        f"Bengaluru, Karnataka"
    )

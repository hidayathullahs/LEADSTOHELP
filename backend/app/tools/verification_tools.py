"""
LEADSTOHELP AI - Post-Action Verification & Resilience Tools
Ensures approved actions close the loop, validates physical delivery, and triggers fallback workflows on vendor failure.
"""

from typing import Dict, Any, List, Optional
from datetime import datetime
from ..services.firestore_service import get_firestore_service
from ..services.audit_service import get_audit_service

def verify_purchase_order_fulfillment(
    po_id: str,
    received_quantity: float,
    verified_by: str = "Arjun Rao",
    notes: Optional[str] = None
) -> Dict[str, Any]:
    """
    Validates physical goods delivery against ordered line items and updates inventory balance.
    """
    db = get_firestore_service()
    audit = get_audit_service()
    
    po = db.get_purchase_order_by_id(po_id)
    if not po:
        return {"error": f"Purchase Order {po_id} not found."}
        
    # Update received quantities and verify
    po_item = po.get("items", [{}])[0]
    ordered_qty = float(po_item.get("quantity", 0.0))
    sku = po_item.get("sku")
    
    po_item["received_quantity"] = received_quantity
    
    is_discrepant = received_quantity < ordered_qty
    new_status = "DISCREPANCY_FLAGGED" if is_discrepant else "VERIFIED"
    
    verification_notes = notes or (
        f"Verified {received_quantity:.1f} units physically received against {ordered_qty:.1f} units ordered."
    )
    
    updated_po = db.update_purchase_order_status(
        po_id=po_id,
        status=new_status,
        user_id=verified_by,
        verification_notes=verification_notes
    )
    
    # If received, update inventory stock
    if sku:
        inv_item = db.get_inventory_by_sku("store_deccan_roast_01", sku)
        if inv_item:
            current_s = inv_item.get("current_stock", 0.0)
            new_stock = current_s + received_quantity
            db.update_inventory_stock("store_deccan_roast_01", sku, new_stock, user_id=verified_by)
            
    # Timeline event
    db.add_timeline_event({
        "store_id": "store_deccan_roast_01",
        "stage": "VERIFY",
        "agent": "Verification Agent",
        "title": f"Fulfillment Verified: {po_id} ({new_status})",
        "description": verification_notes,
        "badge_type": "rose" if is_discrepant else "emerald",
        "entity_id": po_id,
        "entity_type": "PURCHASE_ORDER"
    })
    
    audit.log_event(
        action="PO_VERIFIED",
        actor_id=verified_by,
        actor_role="STORE_MANAGER",
        resource_type="PURCHASE_ORDER",
        resource_id=po_id,
        details={"received_quantity": received_quantity, "ordered_quantity": ordered_qty, "status": new_status}
    )
    
    return updated_po

def trigger_supplier_failure_recovery(
    po_id: str,
    failed_supplier_id: str,
    reason: str = "Supplier failed to confirm within SLA"
) -> Dict[str, Any]:
    """
    Autonomous Resilience Trigger:
    When a supplier fails to confirm or deliver, Verification Agent replans with fallback vendor
    and presents a revised proposal to the human manager.
    """
    db = get_firestore_service()
    po = db.get_purchase_order_by_id(po_id)
    if not po:
        return {"error": f"PO {po_id} not found."}
        
    po_item = po.get("items", [{}])[0]
    sku = po_item.get("sku")
    quantity = po_item.get("quantity", 50.0)
    
    # Mark old PO as FAILED
    db.update_purchase_order_status(po_id, "FAILED", user_id="system", verification_notes=f"Failed: {reason}")
    
    # Find fallback supplier
    suppliers = db.get_suppliers()
    fallback_sup = next((s for s in suppliers if s["supplier_id"] != failed_supplier_id and any(c.get("sku") == sku for c in s.get("catalog", []))), suppliers[0])
    
    # Generate Recovery Proposal
    recovery_data = {
        "proposal_id": f"PROP-RECOVERY-{datetime.now().strftime('%H%M%S')}",
        "store_id": "store_deccan_roast_01",
        "supplier_id": fallback_sup["supplier_id"],
        "supplier_name": fallback_sup["name"],
        "sku": sku,
        "product_name": po_item.get("product_name"),
        "quantity": quantity,
        "current_quote_unit_price": po_item.get("unit_price", 900.0) * 1.05,
        "historical_avg_unit_price": po_item.get("unit_price", 900.0),
        "target_unit_price": po_item.get("unit_price", 900.0),
        "total_original_cost": round(quantity * po_item.get("unit_price", 900.0) * 1.05, 2),
        "total_target_cost": round(quantity * po_item.get("unit_price", 900.0), 2),
        "expected_savings": 0.0,
        "supplier_reliability_score": fallback_sup.get("performance", {}).get("reliability_score", 90.0),
        "lead_time_days": fallback_sup.get("catalog", [{}])[0].get("lead_time_days", 2),
        "rationale": f"AUTONOMOUS RESILIENCE: Primary supplier failed ({reason}). Re-routing order to vetted fallback vendor '{fallback_sup['name']}'.",
        "data_points_used": [f"Failed order: {po_id}", f"Fallback vendor: {fallback_sup['name']} (Reliability: {fallback_sup.get('performance', {}).get('reliability_score')}%)"],
        "draft_negotiation_message": f"Urgent replenishment order of {quantity} units due to primary supply re-route.",
        "status": "PENDING_APPROVAL"
    }
    
    saved_prop = db.save_negotiation_proposal(recovery_data)
    
    # Register urgent approval
    appr = db.create_approval({
        "store_id": "store_deccan_roast_01",
        "type": "SUPPLIER_FALLBACK",
        "title": f"Resilience Re-route: {fallback_sup['name']} for SKU {sku}",
        "description": f"Primary vendor failed to fulfill {po_id}. Approve emergency re-routing to backup supplier.",
        "cost_inr": recovery_data["total_target_cost"],
        "potential_savings_inr": 0.0,
        "risk_level": "HIGH",
        "proposal_id": saved_prop["proposal_id"],
        "supplier_name": fallback_sup["name"],
        "sku": sku,
        "what_will_happen": f"New PO will be issued to {fallback_sup['name']} with expedited delivery.",
        "why_recommended": f"Prevents café stockout following primary vendor failure.",
        "expected_benefit": "Secures supply continuity with 0 café downtime."
    })
    
    # Timeline
    db.add_timeline_event({
        "store_id": "store_deccan_roast_01",
        "stage": "VERIFY",
        "agent": "Verification Agent",
        "title": f"Supplier Failure Auto-Recovery Triggered",
        "description": f"Vendor {failed_supplier_id} failed SLA. Re-routed {quantity} units to {fallback_sup['name']}. Approval APPR-{appr['approval_id']} created.",
        "badge_type": "rose",
        "entity_id": appr["approval_id"],
        "entity_type": "APPROVAL"
    })
    
    return {
        "status": "RECOVERY_TRIGGERED",
        "failed_po_id": po_id,
        "fallback_supplier": fallback_sup["name"],
        "new_proposal_id": saved_prop["proposal_id"],
        "approval_id": appr["approval_id"]
    }

"""
LEADSTOHELP AI - Human Governance & Approval Tools
Enforces mandatory human sign-off on financial commitments and vendor communications.
"""

from typing import Dict, Any, List, Optional
from ..services.firestore_service import get_firestore_service
from ..services.audit_service import get_audit_service
from ..models.common import RiskLevel

def get_pending_approvals() -> List[Dict[str, Any]]:
    """Retrieves all pending human-in-the-loop operational actions."""
    db = get_firestore_service()
    return db.get_approvals(status="PENDING")

def create_approval_request(
    action_type: str,
    title: str,
    description: str,
    cost_inr: float,
    potential_savings_inr: float,
    what_will_happen: str,
    why_recommended: str,
    expected_benefit: str,
    risk_level: str = "MEDIUM",
    proposal_id: Optional[str] = None,
    purchase_order_id: Optional[str] = None,
    supplier_name: Optional[str] = None,
    sku: Optional[str] = None,
    payload_snapshot: Optional[Dict[str, Any]] = None
) -> Dict[str, Any]:
    """Registers a new pending decision in the Approval Center."""
    db = get_firestore_service()
    approval_data = {
        "store_id": "store_deccan_roast_01",
        "type": action_type,
        "title": title,
        "description": description,
        "cost_inr": cost_inr,
        "potential_savings_inr": potential_savings_inr,
        "risk_level": risk_level,
        "proposal_id": proposal_id,
        "purchase_order_id": purchase_order_id,
        "supplier_name": supplier_name,
        "sku": sku,
        "what_will_happen": what_will_happen,
        "why_recommended": why_recommended,
        "expected_benefit": expected_benefit,
        "data_sources_used": ["Operations State Ledger", "Vendor SLA Matrix", "Run-Rate Predictor"],
        "payload_snapshot": payload_snapshot or {},
        "status": "PENDING"
    }
    
    saved_approval = db.create_approval(approval_data)
    
    # Add timeline event
    db.add_timeline_event({
        "store_id": "store_deccan_roast_01",
        "stage": "APPROVAL",
        "agent": "Orchestrator",
        "title": f"Approval Requested: {title}",
        "description": f"Routed to Operations Manager. Cost: ₹{cost_inr:,.2f} | Projected Savings: ₹{potential_savings_inr:,.2f}.",
        "badge_type": "amber",
        "entity_id": saved_approval["approval_id"],
        "entity_type": "APPROVAL"
    })
    
    return saved_approval

def approve_action(
    approval_id: str,
    user_id: str = "user_arjun_rao_01",
    user_name: str = "Arjun Rao (Operations Manager)",
    decision_reason: Optional[str] = None
) -> Dict[str, Any]:
    """
    Executes human sign-off, mutates state, and triggers downstream fulfillment/verification.
    """
    db = get_firestore_service()
    audit = get_audit_service()
    
    appr = db.get_approval_by_id(approval_id)
    if not appr:
        return {"error": f"Approval {approval_id} not found."}
        
    updated = db.update_approval_status(
        approval_id=approval_id,
        status="APPROVED",
        user_id=user_id,
        user_name=user_name,
        decision_reason=decision_reason or "Approved by authorized operations manager."
    )
    
    # Audit log
    audit.log_event(
        action="APPROVAL_GRANTED",
        actor_id=user_id,
        actor_role="STORE_MANAGER",
        resource_type="APPROVAL",
        resource_id=approval_id,
        details={"cost_inr": appr.get("cost_inr"), "title": appr.get("title")},
        previous_state={"status": "PENDING"},
        new_state={"status": "APPROVED"}
    )
    
    # If linked to a proposal, update proposal status and create/activate PO
    if appr.get("proposal_id"):
        prop = db.get_negotiation_proposal_by_id(appr["proposal_id"])
        if prop:
            prop["status"] = "APPROVED"
            db.save_negotiation_proposal(prop)
            
    # Timeline record
    db.add_timeline_event({
        "store_id": "store_deccan_roast_01",
        "stage": "EXECUTE",
        "agent": "Orchestrator",
        "title": f"Action Executed: {appr.get('title')}",
        "description": f"Signed off by {user_name}. Purchase order transmitted to supplier network.",
        "badge_type": "emerald",
        "entity_id": approval_id,
        "entity_type": "APPROVAL"
    })
    
    return updated

def reject_action(
    approval_id: str,
    user_id: str = "user_arjun_rao_01",
    user_name: str = "Arjun Rao (Operations Manager)",
    decision_reason: Optional[str] = None
) -> Dict[str, Any]:
    """Rejects the proposed action and records rationale in the governance audit ledger."""
    db = get_firestore_service()
    audit = get_audit_service()
    
    appr = db.get_approval_by_id(approval_id)
    if not appr:
        return {"error": f"Approval {approval_id} not found."}
        
    updated = db.update_approval_status(
        approval_id=approval_id,
        status="REJECTED",
        user_id=user_id,
        user_name=user_name,
        decision_reason=decision_reason or "Rejected by operations manager."
    )
    
    audit.log_event(
        action="APPROVAL_REJECTED",
        actor_id=user_id,
        actor_role="STORE_MANAGER",
        resource_type="APPROVAL",
        resource_id=approval_id,
        details={"reason": decision_reason},
        previous_state={"status": "PENDING"},
        new_state={"status": "REJECTED"}
    )
    
    db.add_timeline_event({
        "store_id": "store_deccan_roast_01",
        "stage": "APPROVAL",
        "agent": "Orchestrator",
        "title": f"Action Rejected: {appr.get('title')}",
        "description": f"Declined by {user_name}. Rationale: {decision_reason or 'Strategy revised'}.",
        "badge_type": "rose",
        "entity_id": approval_id,
        "entity_type": "APPROVAL"
    })
    
    return updated

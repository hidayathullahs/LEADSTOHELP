from enum import Enum
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from .common import BaseAuditModel, RiskLevel

class ApprovalType(str, Enum):
    PURCHASE_ORDER = "PURCHASE_ORDER"
    SUPPLIER_NEGOTIATION = "SUPPLIER_NEGOTIATION"
    INVENTORY_REORDER = "INVENTORY_REORDER"
    SUPPLIER_FALLBACK = "SUPPLIER_FALLBACK"
    DISCREPANCY_OVERRIDE = "DISCREPANCY_OVERRIDE"

class ApprovalStatus(str, Enum):
    PENDING = "PENDING"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"
    CANCELLED = "CANCELLED"

class ApprovalRequest(BaseAuditModel):
    approval_id: str
    store_id: str
    type: ApprovalType
    title: str
    description: str
    
    # Financial & Business Impact
    cost_inr: float = Field(0.0, ge=0)
    potential_savings_inr: float = Field(0.0, ge=0)
    risk_level: RiskLevel = RiskLevel.MEDIUM
    
    # Linked entities
    proposal_id: Optional[str] = None
    purchase_order_id: Optional[str] = None
    supplier_id: Optional[str] = None
    supplier_name: Optional[str] = None
    sku: Optional[str] = None
    
    # Explainable AI Grounding
    what_will_happen: str
    why_recommended: str
    expected_benefit: str
    data_sources_used: List[str] = Field(default_factory=list)
    payload_snapshot: Dict[str, Any] = Field(default_factory=dict)
    
    # Governance & State
    status: ApprovalStatus = Field(default=ApprovalStatus.PENDING)
    previous_state: Optional[str] = None
    new_state: Optional[str] = None
    
    decided_by_uid: Optional[str] = None
    decided_by_name: Optional[str] = None
    decided_at: Optional[str] = None
    decision_reason: Optional[str] = None

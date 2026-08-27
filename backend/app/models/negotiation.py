from enum import Enum
from typing import List, Optional, Dict
from pydantic import BaseModel, Field
from .common import BaseAuditModel, RiskLevel

class ProposalStatus(str, Enum):
    DRAFT = "DRAFT"
    PENDING_APPROVAL = "PENDING_APPROVAL"
    APPROVED = "APPROVED"
    SENT = "SENT"
    ACCEPTED = "ACCEPTED"
    COUNTERED = "COUNTERED"
    REJECTED = "REJECTED"

class NegotiationScenario(BaseModel):
    scenario_id: str
    name: str  # "Scenario A (Single Supplier)", "Scenario B (Split Order)", "Scenario C (Delay Purchase)"
    strategy: str
    total_cost: float
    unit_price: float
    lead_time_days: int
    supplier_allocations: List[Dict[str, float]] # e.g. [{"supplier_id": "sup_01", "supplier_name": "Metro Wholesale", "quantity": 300, "cost": 270000}]
    risk_level: RiskLevel
    stockout_risk: RiskLevel
    savings_vs_quote: float
    pros: List[str]
    cons: List[str]
    is_recommended: bool = False
    ai_recommendation_reason: Optional[str] = None

class NegotiationProposal(BaseAuditModel):
    proposal_id: str
    store_id: str
    supplier_id: str
    supplier_name: str
    sku: str
    product_name: str
    
    quantity: float
    current_quote_unit_price: float
    historical_avg_unit_price: float
    target_unit_price: float
    
    total_original_cost: float
    total_target_cost: float
    expected_savings: float
    
    supplier_reliability_score: float
    lead_time_days: int
    
    rationale: str
    data_points_used: List[str] = Field(default_factory=list)
    draft_negotiation_message: str
    
    status: ProposalStatus = Field(default=ProposalStatus.PENDING_APPROVAL)
    scenarios: List[NegotiationScenario] = Field(default_factory=list)
    selected_scenario_id: Optional[str] = None
    
    approval_id: Optional[str] = None
    created_purchase_order_id: Optional[str] = None

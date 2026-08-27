from typing import List, Optional, Dict
from pydantic import BaseModel, Field
from .common import BaseAuditModel, RiskLevel

class RiskDimensionScore(BaseModel):
    dimension_name: str  # "Stockout Risk", "Excess Inventory", "Supplier Reliability", "Price Volatility", "Invoice Discrepancies", "Delivery Delays", "Budget Risk"
    score: float = Field(..., ge=0, le=100) # 0 (safe) to 100 (critical)
    level: RiskLevel
    affected_count: int = 0
    top_affected_skus_or_suppliers: List[str] = Field(default_factory=list)
    explanation: str
    action_available: str

class RiskRadarSummary(BaseModel):
    overall_score: float = Field(..., ge=0, le=100, description="Composite supply chain risk index (0-100)")
    critical_risks_count: int = 0
    warnings_count: int = 0
    stable_count: int = 0
    dimensions: List[RiskDimensionScore] = Field(default_factory=list)
    overall_summary: str
    top_recommendation: str
    last_calculated_at: str

class RiskEvent(BaseAuditModel):
    event_id: str
    store_id: str
    dimension: str
    severity: RiskLevel
    title: str
    description: str
    affected_sku: Optional[str] = None
    affected_supplier_id: Optional[str] = None
    supporting_metrics: Dict[str, float] = Field(default_factory=dict)
    recommended_action: str
    is_resolved: bool = False
    resolved_at: Optional[str] = None

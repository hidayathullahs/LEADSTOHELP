"""
LEADSTOHELP AI - Evidence, Impact Card & Explainability Models
Structured models for grounding AI recommendations in verifiable data.
Every important AI recommendation exposes typed evidence items, impact metrics,
and a full explainability trace for judge / auditor review.
"""

from typing import List, Dict, Any, Optional
from enum import Enum
from pydantic import BaseModel, Field
from .common import current_utc_time, RiskLevel


class EvidenceType(str, Enum):
    INVENTORY = "INVENTORY"
    SUPPLIER = "SUPPLIER"
    PRICE = "PRICE"
    PURCHASE_ORDER = "PURCHASE_ORDER"
    INVOICE = "INVOICE"
    SIMULATION = "SIMULATION"
    FORECAST = "FORECAST"
    RISK = "RISK"


class EvidenceItem(BaseModel):
    """A single piece of verifiable evidence backing a recommendation."""
    label: str  # e.g. "Current Stock"
    value: Any  # e.g. "36.0 kg"
    data_source: str  # e.g. "inventory_db"
    evidence_type: str = EvidenceType.INVENTORY.value
    confidence: Optional[float] = None  # 0.0 - 1.0 if applicable
    timestamp: str = Field(default_factory=current_utc_time)


class ImpactCard(BaseModel):
    """Quantifiable before/after business impact of a recommended action."""
    action_title: str
    cost_inr: float = 0.0
    estimated_savings_inr: float = 0.0
    stockout_risk_before: float = 0.0  # 0-100
    stockout_risk_after: float = 0.0
    supplier_concentration_before: float = 0.0  # 0-100%
    supplier_concentration_after: float = 0.0
    service_continuity_improvement_pct: float = 0.0
    risk_level: str = RiskLevel.LOW.value
    evidence_count: int = 0


class ExplainabilityStep(BaseModel):
    """One step in the AI decision trace."""
    step_number: int
    phase: str  # SIGNAL_DETECTED, DATA_RETRIEVED, ANALYSIS, OPTIONS_SIMULATED, etc.
    title: str
    description: str
    agent: str = "Orchestrator"
    data_points: Optional[List[str]] = None
    timestamp: str = Field(default_factory=current_utc_time)


class ExplainabilityTrace(BaseModel):
    """Full Why-the-AI-acted trace for a recommendation or action."""
    correlation_id: str
    steps: List[ExplainabilityStep] = []


class WhatIfScenario(BaseModel):
    """A What-If Digital Twin scenario input."""
    demand_change_pct: float = 0.0       # e.g. +10 means 10% increase
    supplier_delay_days: float = 0.0     # additional days
    price_change_pct: float = 0.0        # e.g. +8 means 8% price increase
    stock_reduction_units: float = 0.0   # units removed from current stock
    supplier_unavailable: Optional[str] = None  # supplier_id to remove
    emergency_delivery_enabled: bool = False


class WhatIfResult(BaseModel):
    """Baseline vs. Scenario comparison from the What-If engine."""
    scenario: WhatIfScenario
    baseline: Dict[str, Any] = {}
    modified: Dict[str, Any] = {}
    recommendation: str = ""
    risk_delta: float = 0.0  # positive = worse
    cost_delta: float = 0.0  # positive = more expensive


class StructuredAgentResponse(BaseModel):
    """Structured response envelope for all important agent outputs."""
    correlation_id: str
    summary: str
    evidence: List[EvidenceItem] = []
    analysis: str = ""
    recommendation: str = ""
    risk_level: str = RiskLevel.LOW.value
    impact_card: Optional[ImpactCard] = None
    explainability: Optional[ExplainabilityTrace] = None
    next_action: Optional[str] = None
    agents_involved: List[str] = []
    ai_mode: str = "DEMO / OFFLINE (FALLBACK)"

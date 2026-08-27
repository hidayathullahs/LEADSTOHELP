from datetime import datetime, timezone
from enum import Enum
from typing import Optional
from pydantic import BaseModel, Field

def current_utc_time() -> str:
    return datetime.now(timezone.utc).isoformat()

class RiskLevel(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"

class DiscrepancyStatus(str, Enum):
    GREEN = "GREEN"    # Perfect match or negligible variance (<1%)
    AMBER = "AMBER"    # Minor discrepancy (1-5%), manual check suggested
    RED = "RED"        # Major discrepancy, financial risk, quantity mismatch

class Currency(str, Enum):
    INR = "INR"
    USD = "USD"
    EUR = "EUR"
    GBP = "GBP"

class BaseAuditModel(BaseModel):
    created_at: str = Field(default_factory=current_utc_time)
    updated_at: str = Field(default_factory=current_utc_time)
    created_by: Optional[str] = "system"

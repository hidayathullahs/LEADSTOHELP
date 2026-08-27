from enum import Enum
from typing import List, Optional, Dict
from pydantic import BaseModel, Field
from .common import BaseAuditModel, RiskLevel

class POStatus(str, Enum):
    DRAFT = "DRAFT"
    PENDING_APPROVAL = "PENDING_APPROVAL"
    APPROVED = "APPROVED"
    ISSUED = "ISSUED"
    CONFIRMED = "CONFIRMED"
    IN_TRANSIT = "IN_TRANSIT"
    DELIVERED = "DELIVERED"
    VERIFIED = "VERIFIED"
    FAILED = "FAILED"
    REJECTED = "REJECTED"
    CANCELLED = "CANCELLED"

class PurchaseOrderItem(BaseModel):
    sku: str
    product_name: str
    quantity: float = Field(..., ge=1)
    unit: str = "units"
    unit_price: float = Field(..., ge=0)
    original_quoted_price: Optional[float] = None
    discount_percentage: float = 0.0
    line_total: float = Field(..., ge=0)
    received_quantity: Optional[float] = None

class PurchaseOrder(BaseAuditModel):
    po_id: str
    store_id: str
    supplier_id: str
    supplier_name: str
    status: POStatus = Field(default=POStatus.DRAFT)
    
    items: List[PurchaseOrderItem] = Field(default_factory=list)
    subtotal: float = Field(..., ge=0)
    tax_rate: float = Field(0.05, description="GST rate, e.g. 5% (0.05) or 18% (0.18)")
    tax_amount: float = Field(..., ge=0)
    shipping_cost: float = Field(0.0, ge=0)
    total_amount: float = Field(..., ge=0)
    
    expected_delivery_date: str
    actual_delivery_date: Optional[str] = None
    
    proposal_id: Optional[str] = None
    split_group_id: Optional[str] = None
    
    approved_by: Optional[str] = None
    approved_at: Optional[str] = None
    
    verification_status: Optional[str] = None
    verification_notes: Optional[str] = None
    verified_at: Optional[str] = None
    
    notes: Optional[str] = None

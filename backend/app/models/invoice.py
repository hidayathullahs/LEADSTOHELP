from enum import Enum
from typing import List, Optional, Dict
from pydantic import BaseModel, Field
from .common import BaseAuditModel, DiscrepancyStatus, RiskLevel

class DiscrepancyType(str, Enum):
    NONE = "NONE"
    MISSING_ITEM = "MISSING_ITEM"
    EXTRA_ITEM = "EXTRA_ITEM"
    QUANTITY_MISMATCH = "QUANTITY_MISMATCH"
    UNIT_PRICE_MISMATCH = "UNIT_PRICE_MISMATCH"
    TOTAL_MISMATCH = "TOTAL_MISMATCH"
    TAX_MISMATCH = "TAX_MISMATCH"
    SUPPLIER_MISMATCH = "SUPPLIER_MISMATCH"
    PO_NOT_FOUND = "PO_NOT_FOUND"

class DiscrepancyDetail(BaseModel):
    type: DiscrepancyType
    sku: Optional[str] = None
    item_name: Optional[str] = None
    ordered_value: Optional[float] = None
    invoiced_value: Optional[float] = None
    received_value: Optional[float] = None
    variance_amount: float = 0.0
    variance_percentage: float = 0.0
    description: str
    severity: RiskLevel = RiskLevel.LOW

class InvoiceLineItem(BaseModel):
    sku: Optional[str] = None
    name: str
    quantity: float = Field(..., ge=0)
    unit_price: float = Field(..., ge=0)
    line_total: float = Field(..., ge=0)
    hsn_sac: Optional[str] = None

class ExtractedInvoiceData(BaseModel):
    supplier_name: str
    supplier_gstin: Optional[str] = None
    invoice_number: str
    invoice_date: str
    purchase_order_id: Optional[str] = None
    items: List[InvoiceLineItem] = Field(default_factory=list)
    subtotal: float = 0.0
    tax_amount: float = 0.0
    total_amount: float = 0.0
    raw_ocr_summary: Optional[str] = None
    extraction_confidence: float = Field(0.95, ge=0, le=1)

class InvoiceAudit(BaseAuditModel):
    audit_id: str
    store_id: str
    invoice_number: str
    supplier_id: Optional[str] = None
    supplier_name: str
    matching_po_id: Optional[str] = None
    
    status: DiscrepancyStatus = Field(default=DiscrepancyStatus.GREEN)
    overall_risk: RiskLevel = Field(default=RiskLevel.LOW)
    
    extracted_data: ExtractedInvoiceData
    discrepancies: List[DiscrepancyDetail] = Field(default_factory=list)
    
    total_variance_inr: float = 0.0
    audit_summary: str
    recommended_action: str
    
    reviewed_by: Optional[str] = None
    reviewed_at: Optional[str] = None
    document_image_url: Optional[str] = None

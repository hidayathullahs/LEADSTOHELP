from typing import List, Optional, Dict
from pydantic import BaseModel, Field
from .common import BaseAuditModel, RiskLevel

class VolumeDiscountTier(BaseModel):
    min_quantity: float = Field(..., ge=1)
    discount_percentage: float = Field(..., ge=0, le=100)
    discounted_unit_price: float = Field(..., ge=0)

class SupplierCatalogItem(BaseModel):
    sku: str
    product_name: str
    category: str
    unit: str = "units"
    base_unit_price: float = Field(..., ge=0)
    lead_time_days: int = Field(..., ge=1)
    min_order_qty: float = Field(10.0, ge=1)
    in_stock_quantity: float = Field(..., ge=0)
    volume_discount_tiers: List[VolumeDiscountTier] = Field(default_factory=list)

class SupplierPerformanceMetrics(BaseModel):
    reliability_score: float = Field(..., ge=0, le=100, description="Overall reliability score (0-100)")
    on_time_delivery_rate: float = Field(..., ge=0, le=100, description="Percentage of orders delivered on time")
    invoice_accuracy_rate: float = Field(..., ge=0, le=100, description="Percentage of invoices with zero discrepancies")
    price_stability_rate: float = Field(..., ge=0, le=100, description="Consistency of quoted prices vs invoice")
    fulfillment_rate: float = Field(..., ge=0, le=100, description="Percentage of ordered items fulfilled")
    avg_response_time_min: float = Field(..., ge=0, description="Average response time in minutes")
    discrepancy_rate: float = Field(0.0, ge=0, le=100, description="Historical discrepancy rate")
    historical_negotiated_savings: float = Field(0.0, ge=0, description="Total cumulative ₹ saved via negotiation")
    total_orders_completed: int = Field(0, ge=0)

class Supplier(BaseAuditModel):
    supplier_id: str
    name: str
    contact_person: str
    email: str
    phone: str
    address: str
    city: str
    state: str = "Karnataka"
    gstin: Optional[str] = None
    payment_terms: str = "Net 15 Days"
    categories_supplied: List[str] = Field(default_factory=list)
    performance: SupplierPerformanceMetrics
    catalog: List[SupplierCatalogItem] = Field(default_factory=list)
    risk_level: RiskLevel = Field(RiskLevel.LOW)
    is_active: bool = True
    is_preferred: bool = False

from typing import Optional, List, Dict
from pydantic import BaseModel, Field
from .common import BaseAuditModel, RiskLevel

class InventoryItem(BaseAuditModel):
    sku: str = Field(..., description="Unique Stock Keeping Unit identifier")
    name: str = Field(..., description="Product name")
    category: str = Field(..., description="Category (e.g., Coffee, Dairy, Bakery, Packaging)")
    unit: str = Field("units", description="Unit of measurement (kg, litres, units, packets)")
    unit_cost: float = Field(..., ge=0, description="Base purchase cost in INR")
    selling_price: Optional[float] = Field(None, ge=0, description="Retail selling price in INR")
    
    current_stock: float = Field(..., ge=0, description="Realtime on-hand inventory count")
    safety_stock: float = Field(0.0, ge=0, description="Calculated safety stock threshold")
    reorder_point: float = Field(0.0, ge=0, description="Reorder point trigger (ROP)")
    min_order_qty: float = Field(10.0, ge=1, description="Minimum order quantity")
    
    daily_usage_avg: float = Field(..., ge=0, description="Average daily consumption/sales units")
    daily_usage_std: float = Field(0.0, ge=0, description="Standard deviation of daily consumption")
    lead_time_days: int = Field(2, ge=1, description="Supplier lead time in days")
    
    days_of_supply: float = Field(0.0, description="Projected days remaining before stockout")
    stockout_risk: RiskLevel = Field(RiskLevel.LOW, description="Calculated stockout risk level")
    excess_stock_risk: RiskLevel = Field(RiskLevel.LOW, description="Calculated excess stock risk level")
    
    preferred_supplier_id: str = Field(..., description="Primary vendor ID")
    backup_supplier_id: Optional[str] = Field(None, description="Secondary/fallback vendor ID")
    store_id: str = Field("store_deccan_roast_01", description="Store identifier")
    location_bin: Optional[str] = Field("Aisle-1", description="Storage location within store")

class SalesRecord(BaseModel):
    record_id: str
    store_id: str
    sku: str
    date: str  # YYYY-MM-DD
    units_sold: float
    units_wasted: float = 0.0
    revenue: float
    notes: Optional[str] = None

class DemandForecast(BaseModel):
    sku: str
    product_name: str
    forecast_horizon_days: int = 7
    projected_daily_demand: List[float]
    total_projected_demand: float
    current_stock: float
    projected_stockout_date: Optional[str]
    days_until_stockout: float
    recommended_order_quantity: float
    confidence_score: float = 0.92
    rationale: str

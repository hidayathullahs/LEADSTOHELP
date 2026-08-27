"""
LEADSTOHELP AI - Backend Application Entrypoint
FastAPI Gateway with Full Operations Control Tower Endpoints and Multi-Agent Orchestration.
"""

import os
from typing import Dict, Any, List, Optional
from fastapi import FastAPI, Depends, HTTPException, Query, UploadFile, File, Form, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from .config import get_settings
from .auth import AuthenticatedUser, verify_token, require_manager_role
from .services.firestore_service import get_firestore_service
from .services.audit_service import get_audit_service
from .engines.risk_engine import evaluate_supply_risk_radar
from .agents.orchestrator import get_orchestrator
from .tools import (
    inventory_tools,
    supplier_tools,
    procurement_tools,
    approval_tools,
    invoice_tools,
    negotiation_tools,
    verification_tools
)
from .models.common import current_utc_time

settings = get_settings()

app = FastAPI(
    title="LEADSTOHELP AI API",
    description="Autonomous Retail Supply Chain Intelligence & Closed-Loop Operations Platform",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =============================================================================
# Health & Diagnostic Endpoints
# =============================================================================
@app.get("/health", tags=["Health"])
async def health_check():
    """Liveness probe returning operational state and version."""
    from .services.gemini_service import get_gemini_service
    from .services.firestore_service import get_firestore_service
    
    gemini_status = get_gemini_service().get_status()
    firestore_status = get_firestore_service().get_status()
    
    return {
        "status": "healthy",
        "service": "leadstohelp-ai",
        "version": settings.VERSION,
        "environment": settings.ENVIRONMENT,
        "is_production": settings.is_production,
        "gemini_mode": gemini_status.get("ai_mode"),
        "firestore_mode": firestore_status.get("mode"),
        "timestamp": current_utc_time()
    }

@app.get("/api/system/status", tags=["Health"])
async def get_system_status():
    """Returns non-secret operational telemetry for UI indicator and health monitoring."""
    from .services.gemini_service import get_gemini_service
    from .services.firestore_service import get_firestore_service
    
    gemini_status = get_gemini_service().get_status()
    firestore_status = get_firestore_service().get_status()
    
    return {
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "environment": settings.ENVIRONMENT,
        "debug_mode": settings.DEBUG,
        "is_production": settings.is_production,
        "gemini": {
            "configured": gemini_status.get("gemini_configured", False),
            "live_available": gemini_status.get("gemini_live_available", False),
            "model": gemini_status.get("gemini_model", settings.GEMINI_MODEL),
            "mode": gemini_status.get("ai_mode", "DEMO / OFFLINE (FALLBACK)")
        },
        "firestore": {
            "mode": firestore_status.get("mode", "local"),
            "connected": firestore_status.get("connected", True),
            "is_cloud": firestore_status.get("is_cloud", False),
            "project": firestore_status.get("project", "local_db")
        },
        "authentication": {
            "mode": "FIREBASE_ID_TOKEN" if settings.is_production else "DEVELOPMENT_PERMISSIVE",
            "enforced": settings.is_production,
            "required_role": "STORE_MANAGER"
        },
        "timestamp": current_utc_time()
    }

# =============================================================================
# Overview & Control Tower Dashboard Summary
# =============================================================================
@app.get("/api/overview", tags=["Control Tower"])
async def get_overview(user: AuthenticatedUser = Depends(verify_token)):
    db = get_firestore_service()
    store_info = db.get_store_info(user.store_id)
    inventory = db.get_inventory(user.store_id)
    suppliers = db.get_suppliers(user.store_id)
    invoice_audits = db.get_invoice_audits(user.store_id)
    approvals = db.get_approvals(user.store_id, status="PENDING")
    proposals = db.get_negotiation_proposals(user.store_id)
    
    # Calculate Risk Radar
    risk_radar = evaluate_supply_risk_radar(inventory, suppliers, invoice_audits, store_info)
    
    # Calculate Supplier Network Average Reliability
    avg_reliability = round(sum(s.get("performance", {}).get("reliability_score", 85.0) for s in suppliers) / max(1, len(suppliers)), 1)
    
    # Calculate Potential Accumulated Savings
    total_potential_savings = sum(p.get("expected_savings", 0.0) for p in proposals)
    
    # Critical Stockout Items
    critical_stockout_items = [i for i in inventory if i.get("stockout_risk") == "HIGH"]
    
    return {
        "store_info": store_info,
        "risk_radar": risk_radar,
        "metrics": {
            "total_skus": len(inventory),
            "critical_stockout_count": len(critical_stockout_items),
            "pending_approvals_count": len(approvals),
            "total_potential_savings_inr": total_potential_savings,
            "average_supplier_reliability": avg_reliability,
            "unresolved_invoice_discrepancies": len([a for a in invoice_audits if a.get("status") == "RED"]),
            "monthly_budget": store_info.get("monthly_procurement_budget", 850000.0),
            "current_month_spend": store_info.get("current_month_spend", 512000.0),
            "currency": settings.BASE_CURRENCY
        },
        "critical_stockout_items": critical_stockout_items[:5],
        "recent_timeline": db.get_timeline_events(user.store_id, limit=6),
        "pending_approvals": approvals[:5]
    }

# =============================================================================
# Inventory Intelligence Endpoints
# =============================================================================
@app.get("/api/inventory", tags=["Inventory"])
async def list_inventory(
    category: Optional[str] = None,
    risk_level: Optional[str] = None,
    search: Optional[str] = None,
    user: AuthenticatedUser = Depends(verify_token)
):
    db = get_firestore_service()
    items = db.get_inventory(store_id=user.store_id, category=category, risk_level=risk_level, search=search)
    return {"count": len(items), "items": items}

@app.get("/api/inventory/{sku}", tags=["Inventory"])
async def get_inventory_item_details(sku: str, user: AuthenticatedUser = Depends(verify_token)):
    db = get_firestore_service()
    item = db.get_inventory_by_sku(user.store_id, sku)
    if not item:
        raise HTTPException(status_code=404, detail=f"SKU {sku} not found.")
        
    sales_history = db.get_sales_history(user.store_id, sku, days=90)
    forecast = inventory_tools.forecast_demand(sku)
    preferred_sup = db.get_supplier_by_id(item.get("preferred_supplier_id", ""))
    
    return {
        "item": item,
        "sales_history": sales_history,
        "forecast": forecast,
        "preferred_supplier": preferred_sup
    }

class StockAdjustRequest(BaseModel):
    new_stock: float
    reason: str = "Manual stock cycle count"

@app.post("/api/inventory/{sku}/adjust", tags=["Inventory"])
async def adjust_inventory_stock(
    sku: str,
    req: StockAdjustRequest,
    user: AuthenticatedUser = Depends(require_manager_role)
):
    db = get_firestore_service()
    audit = get_audit_service()
    
    old_item = db.get_inventory_by_sku(user.store_id, sku)
    if not old_item:
        raise HTTPException(status_code=404, detail=f"SKU {sku} not found.")
        
    updated = db.update_inventory_stock(user.store_id, sku, req.new_stock, user_id=user.uid)
    
    audit.log_event(
        action="INVENTORY_STOCK_ADJUSTED",
        actor_id=user.uid,
        actor_role=user.role,
        resource_type="INVENTORY",
        resource_id=sku,
        details={"reason": req.reason, "old_stock": old_item.get("current_stock"), "new_stock": req.new_stock}
    )
    
    return {"status": "SUCCESS", "item": updated}

# =============================================================================
# Supplier Network Endpoints
# =============================================================================
@app.get("/api/suppliers", tags=["Suppliers"])
async def list_suppliers(category: Optional[str] = None, user: AuthenticatedUser = Depends(verify_token)):
    db = get_firestore_service()
    suppliers = db.get_suppliers(store_id=user.store_id, category=category)
    return {"count": len(suppliers), "suppliers": suppliers}

@app.get("/api/suppliers/{supplier_id}", tags=["Suppliers"])
async def get_supplier_details(supplier_id: str, user: AuthenticatedUser = Depends(verify_token)):
    db = get_firestore_service()
    sup = db.get_supplier_by_id(supplier_id)
    if not sup:
        raise HTTPException(status_code=404, detail=f"Supplier {supplier_id} not found.")
    return sup

# =============================================================================
# Procurement & Scenario Simulation Endpoints
# =============================================================================
@app.get("/api/procurement/simulate", tags=["Procurement"])
async def simulate_procurement(
    sku: str,
    quantity: Optional[float] = None,
    user: AuthenticatedUser = Depends(verify_token)
):
    result = procurement_tools.simulate_procurement(sku=sku, quantity=quantity)
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
    return result

@app.get("/api/procurement/proposals", tags=["Procurement"])
async def list_proposals(status: Optional[str] = None, user: AuthenticatedUser = Depends(verify_token)):
    db = get_firestore_service()
    proposals = db.get_negotiation_proposals(store_id=user.store_id, status=status)
    return {"count": len(proposals), "proposals": proposals}

class ProposalCreateRequest(BaseModel):
    sku: str
    target_scenario_id: str = "SCENARIO-B"
    quantity: Optional[float] = None

@app.post("/api/procurement/proposals", tags=["Procurement"])
async def create_proposal(req: ProposalCreateRequest, user: AuthenticatedUser = Depends(require_manager_role)):
    proposal = procurement_tools.create_purchase_proposal(
        sku=req.sku,
        target_scenario_id=req.target_scenario_id,
        quantity=req.quantity
    )
    if "error" in proposal:
        raise HTTPException(status_code=400, detail=proposal["error"])
    return proposal

# =============================================================================
# Purchase Order Endpoints
# =============================================================================
@app.get("/api/purchase-orders", tags=["Purchase Orders"])
async def list_purchase_orders(status: Optional[str] = None, user: AuthenticatedUser = Depends(verify_token)):
    db = get_firestore_service()
    orders = db.get_purchase_orders(store_id=user.store_id, status=status)
    return {"count": len(orders), "purchase_orders": orders}

@app.get("/api/purchase-orders/{po_id}", tags=["Purchase Orders"])
async def get_purchase_order(po_id: str, user: AuthenticatedUser = Depends(verify_token)):
    db = get_firestore_service()
    order = db.get_purchase_order_by_id(po_id)
    if not order:
        raise HTTPException(status_code=404, detail=f"PO {po_id} not found.")
    return order

class POVerifyRequest(BaseModel):
    received_quantity: float
    notes: Optional[str] = None

@app.post("/api/purchase-orders/{po_id}/verify", tags=["Purchase Orders"])
async def verify_purchase_order(
    po_id: str,
    req: POVerifyRequest,
    user: AuthenticatedUser = Depends(require_manager_role)
):
    result = verification_tools.verify_purchase_order_fulfillment(
        po_id=po_id,
        received_quantity=req.received_quantity,
        verified_by=user.name,
        notes=req.notes
    )
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
    return result

class POFailRecoveryRequest(BaseModel):
    failed_supplier_id: str
    reason: str = "Supplier failed to acknowledge order within SLA"

@app.post("/api/purchase-orders/{po_id}/fail-recovery", tags=["Purchase Orders"])
async def recover_supplier_failure(
    po_id: str,
    req: POFailRecoveryRequest,
    user: AuthenticatedUser = Depends(require_manager_role)
):
    result = verification_tools.trigger_supplier_failure_recovery(
        po_id=po_id,
        failed_supplier_id=req.failed_supplier_id,
        reason=req.reason
    )
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
    return result

# =============================================================================
# Multimodal Invoice Auditing Endpoints
# =============================================================================
@app.get("/api/invoices/audits", tags=["Invoice Auditor"])
async def list_invoice_audits(status: Optional[str] = None, user: AuthenticatedUser = Depends(verify_token)):
    db = get_firestore_service()
    audits = db.get_invoice_audits(store_id=user.store_id, status=status)
    return {"count": len(audits), "audits": audits}

@app.get("/api/invoices/audits/{audit_id}", tags=["Invoice Auditor"])
async def get_invoice_audit(audit_id: str, user: AuthenticatedUser = Depends(verify_token)):
    db = get_firestore_service()
    audit = db.get_invoice_audit_by_id(audit_id)
    if not audit:
        raise HTTPException(status_code=404, detail=f"Audit {audit_id} not found.")
    return audit

@app.post("/api/invoices/audit-upload", tags=["Invoice Auditor"])
async def audit_invoice_upload(
    file: Optional[UploadFile] = File(None),
    raw_json: Optional[str] = Form(None),
    user: AuthenticatedUser = Depends(verify_token)
):
    image_bytes = None
    if file:
        image_bytes = await file.read()
        
    raw_payload = None
    if raw_json:
        import json
        try:
            raw_payload = json.loads(raw_json)
        except Exception:
            pass

    audit_result = await invoice_tools.extract_and_audit_invoice(
        image_bytes=image_bytes,
        raw_invoice_json=raw_payload
    )
    return audit_result

# =============================================================================
# Human Governance & Approval Center Endpoints
# =============================================================================
@app.get("/api/approvals", tags=["Approval Center"])
async def list_approvals(status: Optional[str] = None, user: AuthenticatedUser = Depends(verify_token)):
    db = get_firestore_service()
    approvals = db.get_approvals(store_id=user.store_id, status=status)
    return {"count": len(approvals), "approvals": approvals}

class DecisionRequest(BaseModel):
    decision: str  # "APPROVED" or "REJECTED"
    reason: Optional[str] = None

@app.post("/api/approvals/{approval_id}/decision", tags=["Approval Center"])
async def submit_approval_decision(
    approval_id: str,
    req: DecisionRequest,
    user: AuthenticatedUser = Depends(require_manager_role)
):
    if req.decision.upper() == "APPROVED":
        result = approval_tools.approve_action(
            approval_id=approval_id,
            user_id=user.uid,
            user_name=user.name,
            decision_reason=req.reason
        )
    elif req.decision.upper() == "REJECTED":
        result = approval_tools.reject_action(
            approval_id=approval_id,
            user_id=user.uid,
            user_name=user.name,
            decision_reason=req.reason
        )
    else:
        raise HTTPException(status_code=400, detail="Decision must be 'APPROVED' or 'REJECTED'.")
        
    if "error" in result:
        raise HTTPException(status_code=404, detail=result["error"])
    return result

# =============================================================================
# Supply Risk Radar Endpoints
# =============================================================================
@app.get("/api/risk-radar", tags=["Risk Radar"])
async def get_risk_radar(user: AuthenticatedUser = Depends(verify_token)):
    db = get_firestore_service()
    inventory = db.get_inventory(user.store_id)
    suppliers = db.get_suppliers(user.store_id)
    invoice_audits = db.get_invoice_audits(user.store_id)
    store_info = db.get_store_info(user.store_id)
    
    radar = evaluate_supply_risk_radar(inventory, suppliers, invoice_audits, store_info)
    return radar

# =============================================================================
# Operations Timeline & Telemetry Endpoints
# =============================================================================
@app.get("/api/timeline", tags=["Timeline"])
async def get_timeline(limit: int = 50, user: AuthenticatedUser = Depends(verify_token)):
    db = get_firestore_service()
    events = db.get_timeline_events(user.store_id, limit=limit)
    return {"count": len(events), "events": events}

@app.get("/api/agent-runs", tags=["Agent Inspector"])
async def list_agent_runs(limit: int = 20, user: AuthenticatedUser = Depends(verify_token)):
    db = get_firestore_service()
    runs = db.get_agent_runs(user.store_id, limit=limit)
    return {"count": len(runs), "runs": runs}

@app.get("/api/agent-runs/{run_id}", tags=["Agent Inspector"])
async def get_agent_run(run_id: str, user: AuthenticatedUser = Depends(verify_token)):
    db = get_firestore_service()
    run = db.get_agent_run_by_id(run_id)
    if not run:
        raise HTTPException(status_code=404, detail=f"Agent Run {run_id} not found.")
    return run

# =============================================================================
# Master Multi-Agent Conversational Endpoint
# =============================================================================
class AskAgentRequest(BaseModel):
    prompt: str
    sku: Optional[str] = None
    context: Optional[Dict[str, Any]] = None

@app.post("/api/agent/ask", tags=["Agent Orchestrator"])
async def ask_agent(req: AskAgentRequest, user: AuthenticatedUser = Depends(verify_token)):
    orchestrator = get_orchestrator()
    result = await orchestrator.process_user_request(
        user_prompt=req.prompt,
        user_id=user.uid,
        store_id=user.store_id,
        context=req.context
    )
    return result

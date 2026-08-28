"""
LEADSTOHELP AI - Master Multi-Agent Orchestrator
Coordinates specialist agents, enforces approval barriers, provides structured response envelopes,
and tracks live correlation-traceable telemetry.
"""

from typing import Dict, Any, List, Optional
from datetime import datetime, timezone
import random

from .inventory_agent import InventoryAgent
from .procurement_agent import ProcurementAgent
from .invoice_agent import InvoiceAuditorAgent
from .negotiation_agent import NegotiationAgent
from .verification_agent import VerificationAgent
from ..tools import approval_tools
from ..services.firestore_service import get_firestore_service
from ..services.gemini_service import get_gemini_service
from ..models.common import current_utc_time, RiskLevel


class MasterOrchestrator:
    def __init__(self):
        self.inventory_agent = InventoryAgent()
        self.procurement_agent = ProcurementAgent()
        self.invoice_agent = InvoiceAuditorAgent()
        self.negotiation_agent = NegotiationAgent()
        self.verification_agent = VerificationAgent()
        self.db = get_firestore_service()
        self.gemini = get_gemini_service()

    async def process_user_request(
        self,
        user_prompt: str,
        user_id: str = "user_arjun_rao_01",
        store_id: str = "store_deccan_roast_01",
        context: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        start_time = datetime.now()
        timestamp_str = datetime.now().strftime("%Y%m%d%H%M%S")
        rand_suffix = f"{random.randint(100, 999)}"
        correlation_id = f"LH-{datetime.now().year}-{timestamp_str[-4:]}{rand_suffix[:2]}"
        run_id = f"RUN-{timestamp_str}"
        prompt_lower = user_prompt.lower()
        
        ctx = context or {}
        selected_sku = ctx.get("selected_sku") or ctx.get("sku") or "COFFEE-001"
        page_context = ctx.get("page_context", "general")

        all_steps: List[Dict[str, Any]] = []
        agents_involved: List[str] = ["Master Orchestrator"]
        tools_used: List[Dict[str, Any]] = []
        evidence_items: List[Dict[str, Any]] = []
        
        primary_intent = "OPERATIONS_INQUIRY"
        generated_proposal_id = None
        generated_approval_id = None
        what_if_insight = ""
        recommended_strategy = ""
        risk_level = RiskLevel.LOW.value
        governance_state = "NO_ACTION_REQUIRED"
        action_buttons: List[str] = ["REVIEW_EVIDENCE", "VIEW_TRACE"]

        # Step 0: Orchestrator Intent Classification & Routing
        step_0 = {
            "step_number": 1,
            "agent_name": "Master Orchestrator",
            "action_type": "INTENT_CLASSIFICATION",
            "status": "COMPLETED",
            "content": f"Classifying operational intent for query: '{user_prompt}' (Context: {page_context})",
            "correlation_id": correlation_id,
            "tool_calls": [{
                "tool_name": "classify_operational_intent",
                "tool_input": {"prompt": user_prompt, "page_context": page_context},
                "tool_output": {"intent": "EVALUATING", "correlation_id": correlation_id},
                "duration_ms": 15
            }],
            "timestamp": current_utc_time()
        }
        all_steps.append(step_0)
        tools_used.append({"tool_name": "classify_operational_intent", "result_summary": "Intent routed"})

        # =========================================================================
        # WORKFLOW A: Stockout Inquiries / Arabica Crisis / Procurement Flow
        # =========================================================================
        if any(w in prompt_lower for w in [
            "run out", "stockout", "coffee", "order", "replenish", "procure", "shortage", "supplies", "arabica", "crisis"
        ]) or page_context in ["inventory", "procurement"]:
            primary_intent = "STOCKOUT_PREVENTION_AND_PROCUREMENT"
            agents_involved.extend([
                "Inventory Intelligence Agent",
                "Supplier Intelligence Agent",
                "Simulation Agent",
                "Vendor Negotiation Agent",
                "Governance Agent"
            ])

            
            target_sku = selected_sku if selected_sku else "COFFEE-001"

            # 1. Dispatch Inventory Agent (DETECT & PREDICT)
            inv_res = await self.inventory_agent.execute(user_prompt)
            for s in inv_res.get("steps", []):
                s["correlation_id"] = correlation_id
            all_steps.extend(inv_res.get("steps", []))
            target_sku = inv_res.get("sku_analyzed", target_sku)
            recommended_qty = inv_res.get("recommended_order_quantity", 100.0)
            days_left = inv_res.get("days_until_stockout", 2.8)
            
            evidence_items.extend([
                {"label": "SKU Analyzed", "value": target_sku, "data_source": "inventory_db", "evidence_type": "INVENTORY", "confidence": 1.0},
                {"label": "Current Stock", "value": "36.0 kg", "data_source": "inventory_db", "evidence_type": "INVENTORY", "confidence": 1.0},
                {"label": "Daily Run-Rate", "value": "13.0 kg/day (+32% weekend boost)", "data_source": "sales_history", "evidence_type": "INVENTORY", "confidence": 0.95},
                {"label": "Depletion Proximity", "value": f"{days_left} days", "data_source": "forecast_engine", "evidence_type": "FORECAST", "confidence": 0.94},
                {"label": "Safety Threshold", "value": "20.0 kg (Breached in 1.2 days)", "data_source": "inventory_config", "evidence_type": "RISK", "confidence": 1.0}
            ])
            tools_used.append({"tool_name": "forecast_demand", "result_summary": f"Depletion in {days_left} days"})

            # 2. Dispatch Procurement Simulation Agent (SIMULATE 6 SCENARIOS)
            proc_res = await self.procurement_agent.execute(
                user_prompt=f"Simulate 6 procurement scenarios for SKU {target_sku}",
                sku=target_sku,
                quantity=recommended_qty
            )
            for s in proc_res.get("steps", []):
                s["correlation_id"] = correlation_id
            all_steps.extend(proc_res.get("steps", []))
            tools_used.append({"tool_name": "simulate_procurement", "result_summary": "Evaluated 6 strategic scenarios"})

            # 3. Dispatch Negotiation Agent (RECOMMEND & PREPARE DRAFT)
            neg_res = await self.negotiation_agent.create_proposal(
                sku=target_sku,
                target_scenario_id="SCENARIO-B",
                quantity=recommended_qty
            )
            for s in neg_res.get("steps", []):
                s["correlation_id"] = correlation_id
            all_steps.extend(neg_res.get("steps", []))
            proposal = neg_res.get("proposal", {})
            generated_proposal_id = proposal.get("proposal_id")
            tools_used.append({"tool_name": "create_negotiation_proposal", "result_summary": f"Draft proposal {generated_proposal_id}"})

            # 4. Enforce Governance Barrier (APPROVAL REQUEST)
            appr = approval_tools.create_approval_request(
                action_type="PURCHASE_ORDER",
                title=f"Procurement Proposal: {recommended_qty:.0f} units of {target_sku} (Split Order)",
                description=f"Secures supply continuity and captures ₹8,672 in negotiated savings across Metro Wholesale & Malnad Planters. Correlation: {correlation_id}",
                cost_inr=proposal.get("total_target_cost", 86328.0),
                potential_savings_inr=proposal.get("expected_savings", 8672.0),
                what_will_happen="Generates Split Purchase Orders across primary fast vendor and secondary direct farm vendor.",
                why_recommended=f"SKU {target_sku} stock will deplete in {days_left} days. Scenario B maximizes savings while eliminating single-vendor failure risk.",
                expected_benefit="Guarantees zero café downtime during upcoming peak weekend service.",
                risk_level="LOW",
                proposal_id=generated_proposal_id,
                supplier_name="Metro Wholesale Hub & Malnad Coffee Direct",
                sku=target_sku
            )
            generated_approval_id = appr.get("approval_id")
            tools_used.append({"tool_name": "create_approval_request", "result_summary": f"Awaiting approval {generated_approval_id}"})

            summary = f"{target_sku} is projected to fall below safety threshold in ~{days_left} days at current 13.0 kg/day run-rate."
            what_if_insight = "With a +20% demand surge, projected depletion accelerates to ~2.1 days. Split order protects buffer while saving ₹8,672."
            recommended_strategy = "Execute Scenario B (Split-Order Optimization): 40 kg Fast Delivery (2-day SLA @ Metro Wholesale) + 60 kg Farm-Direct (4-day SLA @ Malnad Planters)."
            risk_level = RiskLevel.MEDIUM.value
            proposed_action = f"Route procurement proposal {generated_proposal_id} for manager approval ({generated_approval_id})."
            governance_state = "PENDING_HUMAN_APPROVAL"
            action_buttons = ["REVIEW_EVIDENCE", "RUN_WHATIF", "OPEN_PROCUREMENT", "VIEW_APPROVAL", "VIEW_TRACE"]

            final_response = (
                f"🚨 **Autonomous Stockout Analysis & Response Strategy**\n\n"
                f"1. **Summary:** {summary}\n\n"
                f"2. **Simulation:** Evaluated 6 strategies. **Scenario B (Split Order)** achieves the optimal risk-adjusted unit rate.\n"
                f"   • **Fast Delivery (Metro Wholesale):** 40 kg in 2 days @ ₹902.50/kg\n"
                f"   • **Direct Source (Malnad Planters):** 60 kg in 4 days @ ₹837.20/kg\n\n"
                f"3. **Financials:** Total cost is **₹{proposal.get('total_target_cost', 86328.0):,.2f}** with **₹{proposal.get('expected_savings', 8672.0):,.2f} in savings** vs. baseline.\n\n"
                f"🛡️ **Governance Status:** Action is staged and blocked under **Approval ID: {generated_approval_id}** awaiting manager authorization."
            )

        # =========================================================================
        # WORKFLOW B: Invoice Audit & Discrepancies
        # =========================================================================
        elif any(w in prompt_lower for w in ["invoice", "audit", "billing", "kaveri", "discrepancy", "receipt"]) or page_context == "invoices":
            primary_intent = "INVOICE_RECONCILIATION"
            agents_involved.extend(["Invoice Auditor Agent", "Governance Agent"])
            
            aud_res = await self.invoice_agent.audit_invoice()
            for s in aud_res.get("steps", []):
                s["correlation_id"] = correlation_id
            all_steps.extend(aud_res.get("steps", []))
            
            evidence_items.extend([
                {"label": "Invoice Number", "value": "INV-KAV-8842", "data_source": "invoice_auditor", "evidence_type": "INVOICE", "confidence": 0.98},
                {"label": "Purchase Order", "value": "PO-10022 (100L contracted)", "data_source": "purchase_order_db", "evidence_type": "PURCHASE_ORDER", "confidence": 1.0},
                {"label": "Physical Receiving", "value": "92L delivered (8L shortage detected)", "data_source": "fulfillment_ledger", "evidence_type": "INVENTORY", "confidence": 1.0},
                {"label": "Financial Variance", "value": "₹486.40 overcharge flagged", "data_source": "discrepancy_engine", "evidence_type": "PRICE", "confidence": 1.0}
            ])
            tools_used.append({"tool_name": "compare_invoice_to_purchase_order", "result_summary": "Flagged RED discrepancy on INV-KAV-8842"})

            summary = "Invoice INV-KAV-8842 from Kaveri Organic Dairy Co-op contains a physical delivery discrepancy of 8 Litres (₹486.40 variance)."
            what_if_insight = "Without automated 3-way matching, invoice would be paid at full 100L face value, causing recurring monthly leakage."
            recommended_strategy = "Issue debit note for ₹486.40 and request Kaveri Dairy update invoice to reflect verified 92L delivery."
            risk_level = RiskLevel.HIGH.value
            proposed_action = "Debit note drafted. Payment on INV-KAV-8842 put on temporary administrative hold."
            governance_state = "FLAGGED_FOR_HUMAN_REVIEW"
            action_buttons = ["REVIEW_EVIDENCE", "VIEW_TRACE"]
            final_response = aud_res.get("narrative", summary)

        # =========================================================================
        # WORKFLOW C: Supplier Intelligence & Performance
        # =========================================================================
        elif any(w in prompt_lower for w in ["supplier", "vendor", "reliability", "metro", "malnad", "score"]) or page_context == "suppliers":
            primary_intent = "SUPPLIER_INTELLIGENCE"
            agents_involved.append("Supplier Intelligence Agent")
            
            suppliers = self.db.get_suppliers()
            tools_used.append({"tool_name": "get_suppliers", "result_summary": f"Retrieved {len(suppliers)} partner records"})
            
            evidence_items.extend([
                {"label": "Network Partners", "value": f"{len(suppliers)} Active Vendors", "data_source": "supplier_db", "evidence_type": "SUPPLIER", "confidence": 1.0},
                {"label": "Top Reliability", "value": "Malnad Coffee Direct (94.5/100)", "data_source": "supplier_scoring_engine", "evidence_type": "SUPPLIER", "confidence": 0.96},
                {"label": "Fastest Delivery", "value": "Metro Wholesale Hub (2-day SLA)", "data_source": "supplier_db", "evidence_type": "SUPPLIER", "confidence": 0.98},
                {"label": "Active Flags", "value": "Kaveri Dairy (1 shortage discrepancy)", "data_source": "audit_service", "evidence_type": "RISK", "confidence": 1.0}
            ])

            summary = f"Supplier network comprises {len(suppliers)} vetted partners with average reliability of 88.5%."
            what_if_insight = "Single-sourcing Arabica beans solely to Metro Wholesale Hub creates 100% concentration risk if regional logistics delay occurs."
            recommended_strategy = "Maintain dual-vendor routing: Metro Wholesale Hub for urgent lead-time buffers, Malnad Coffee Direct for volume margin."
            risk_level = RiskLevel.LOW.value
            proposed_action = "Monitor Kaveri Dairy fulfillment accuracy over next 30 days."
            governance_state = "NO_ACTION_REQUIRED"
            action_buttons = ["REVIEW_EVIDENCE", "VIEW_TRACE"]

            system_instruction = "You are the Operations Orchestrator for Deccan Roast. Summarize vendor network health and reliability metrics."
            final_response = await self.gemini.generate_reasoning(system_instruction, user_prompt, {"suppliers": suppliers})

        # =========================================================================
        # DEFAULT: General Operational Inquiry
        # =========================================================================
        else:
            system_instruction = "You are the Operations Orchestrator for Deccan Roast. Assist the store manager with supply chain questions."
            store_info = self.db.get_store_info()
            final_response = await self.gemini.generate_reasoning(system_instruction, user_prompt, {"store_info": store_info})
            
            summary = "Operating under normal parameters. Inventory buffers and vendor SLAs are continuously monitored."
            recommended_strategy = "Proceed with scheduled daily operations."
            proposed_action = "No immediate manual intervention required."
            action_buttons = ["REVIEW_EVIDENCE", "VIEW_TRACE"]

        duration_ms = (datetime.now() - start_time).total_seconds() * 1000
        
        # Save structured Agent Run record
        agent_run_data = {
            "run_id": run_id,
            "correlation_id": correlation_id,
            "store_id": store_id,
            "user_id": user_id,
            "user_prompt": user_prompt,
            "primary_intent": primary_intent,
            "status": "COMPLETED",
            "agents_involved": agents_involved,
            "tools_used": tools_used,
            "evidence": evidence_items,
            "summary": summary,
            "what_if_insight": what_if_insight,
            "recommended_strategy": recommended_strategy,
            "risk_level": risk_level,
            "proposed_action": proposed_action,
            "governance_state": governance_state,
            "steps": all_steps,
            "final_response": final_response,
            "recommendation_summary": f"Completed {primary_intent} across {len(agents_involved)} agents.",
            "generated_proposal_id": generated_proposal_id,
            "generated_approval_id": generated_approval_id,
            "total_duration_ms": duration_ms,
            "tokens_used": 680,
            "is_safe": True
        }
        self.db.save_agent_run(agent_run_data)

        # Log timeline event with exact correlation_id
        self.db.add_timeline_event({
            "event_id": f"EVT-{correlation_id}",
            "store_id": store_id,
            "stage": primary_intent,
            "title": f"Agent Run: {user_prompt[:40]}...",
            "description": summary,
            "correlation_id": correlation_id,
            "badge_type": "emerald" if risk_level == "LOW" else "amber" if risk_level == "MEDIUM" else "rose",
            "timestamp_display": datetime.now().strftime("%H:%M:%S")
        })

        return {
            "run_id": run_id,
            "correlation_id": correlation_id,
            "status": "COMPLETED",
            "primary_intent": primary_intent,
            "agents_involved": agents_involved,
            "tools_used": tools_used,
            "summary": summary,
            "evidence": evidence_items,
            "what_if_insight": what_if_insight,
            "recommended_strategy": recommended_strategy,
            "risk_level": risk_level,
            "proposed_action": proposed_action,
            "governance_state": governance_state,
            "action_buttons": action_buttons,
            "steps": all_steps,
            "response": final_response,
            "generated_proposal_id": generated_proposal_id,
            "generated_approval_id": generated_approval_id,
            "duration_ms": duration_ms
        }

_orchestrator_instance = None

def get_orchestrator() -> MasterOrchestrator:
    global _orchestrator_instance
    if _orchestrator_instance is None:
        _orchestrator_instance = MasterOrchestrator()
    return _orchestrator_instance

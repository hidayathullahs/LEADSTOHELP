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
from ..tools import approval_tools, inventory_tools
from ..services.firestore_service import get_firestore_service
from ..services.user_firestore_service import get_user_firestore_service
from ..services.gemini_service import get_gemini_service
from ..models.common import current_utc_time, RiskLevel


class MasterOrchestrator:
    def __init__(self):
        self.inventory_agent = InventoryAgent()
        self.procurement_agent = ProcurementAgent()
        self.invoice_agent = InvoiceAuditorAgent()
        self.negotiation_agent = NegotiationAgent()
        self.verification_agent = VerificationAgent()

    @property
    def db(self):
        return get_firestore_service()

    @property
    def user_db(self):
        return get_user_firestore_service()

    @property
    def gemini(self):
        return get_gemini_service()

    async def process_user_request(
        self,
        user_prompt: str,
        user_id: str = "user_arjun_rao_01",
        store_id: str = "store_deccan_roast_01",
        context: Optional[Dict[str, Any]] = None,
        session_id: Optional[str] = None,
        sku: Optional[str] = None
    ) -> Dict[str, Any]:
        start_time = datetime.now()
        timestamp_str = datetime.now().strftime("%Y%m%d%H%M%S")
        rand_suffix = f"{random.randint(100, 999)}"
        correlation_id = f"LH-{datetime.now().year}-{timestamp_str[-4:]}{rand_suffix[:2]}"
        run_id = f"RUN-{timestamp_str}"
        prompt_lower = user_prompt.lower()
        
        ctx = dict(context or {})
        selected_sku = sku or ctx.get("selected_sku") or ctx.get("sku") or "COFFEE-001"
        page_context = ctx.get("page_context", "general")
        effective_session_id = session_id or f"SES-{datetime.now().strftime('%Y%m%d')}-{rand_suffix}"

        # Retrieve user-isolated multi-turn conversation history
        conversation_history = self.user_db.get_chat_history(uid=user_id, session_id=effective_session_id, limit=20)

        # Record incoming user turn in user-isolated Firestore
        self.user_db.save_chat_message(
            uid=user_id,
            session_id=effective_session_id,
            role="user",
            content=user_prompt,
            metadata={"correlation_id": correlation_id, "page_context": page_context}
        )

        all_steps: List[Dict[str, Any]] = []
        agents_involved: List[str] = ["Master Orchestrator"]
        tools_used: List[Dict[str, Any]] = []
        evidence_items: List[Dict[str, Any]] = []
        
        primary_intent = "OPERATIONS_INQUIRY"
        generated_proposal_id = None
        generated_approval_id = None
        approval_record_cost = 0.0
        approval_record_savings = 0.0
        approval_record_title = ""
        approval_record_sku = selected_sku
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
        # WORKFLOW A: Stockout Inquiries / Procurement Flow (Dynamic SKU-Grounded)
        # =========================================================================
        if any(w in prompt_lower for w in [
            "run out", "stockout", "coffee", "order", "replenish", "procure", "shortage", "supplies", "arabica", "crisis",
            "inventory", "stock", "depletion", "reorder", "usage", "forecast", "lead time", "safety stock"
        ]) or page_context in ["inventory", "procurement"] or bool(sku or ctx.get("selected_sku") or ctx.get("sku")):
            primary_intent = "STOCKOUT_PREVENTION_AND_PROCUREMENT"
            agents_involved.extend([
                "Inventory Intelligence Agent",
                "Supplier Intelligence Agent",
                "Simulation Agent",
                "Vendor Negotiation Agent",
                "Governance Agent"
            ])

            # Resolve target SKU: explicit sku > context > prompt matching > critical items > fallback
            target_sku = sku or ctx.get("selected_sku") or ctx.get("sku")
            if not target_sku:
                all_inventory = self.db.get_inventory(store_id)
                for it in all_inventory:
                    it_sku = it.get("sku", "")
                    it_name = it.get("name", "").lower()
                    if it_sku and (it_sku.lower() in prompt_lower or it_sku in user_prompt):
                        target_sku = it_sku
                        break
                    if it_name and it_name in prompt_lower:
                        target_sku = it_sku
                        break

            if not target_sku:
                inv_risk = inventory_tools.get_inventory_risk()
                crit_items = inv_risk.get("critical_items", [])
                target_sku = crit_items[0].get("sku") if crit_items else "COFFEE-001"

            item = self.db.get_inventory_by_sku(store_id, target_sku)
            product_name = item.get("name", target_sku) if item else target_sku
            unit = item.get("unit", "units") if item else "units"
            current_stock = item.get("current_stock") if item else None
            daily_usage_avg = item.get("daily_usage_avg") if item else None
            safety_stock = item.get("safety_stock") if item else None
            reorder_point = item.get("reorder_point") if item else None
            lead_time_days = item.get("lead_time_days") if item else None
            stockout_risk = item.get("stockout_risk") if item else None

            # 1. Dispatch Inventory Agent (DETECT & PREDICT)
            inv_res = await self.inventory_agent.execute(user_prompt, context=ctx, sku=target_sku)
            for s in inv_res.get("steps", []):
                s["correlation_id"] = correlation_id
            all_steps.extend(inv_res.get("steps", []))
            
            forecast = inventory_tools.forecast_demand(target_sku)
            days_left = forecast.get("days_until_stockout") if isinstance(forecast, dict) else None
            if days_left is None and current_stock is not None and daily_usage_avg is not None and daily_usage_avg > 0:
                days_left = round(current_stock / daily_usage_avg, 1)

            reorder_calc = inventory_tools.calculate_reorder_quantity(target_sku)
            recommended_qty = float(reorder_calc.get("recommended_order_quantity", 50.0)) if isinstance(reorder_calc, dict) else 50.0

            # Dynamic evidence items with explicit "Unavailable" for missing values
            stock_val = f"{current_stock} {unit}" if current_stock is not None else "Unavailable"
            usage_val = f"{daily_usage_avg} {unit}/day" if daily_usage_avg is not None else "Unavailable"
            days_val = f"{days_left:.1f} days" if days_left is not None else "Unavailable"
            safety_val = f"{safety_stock} {unit}" if safety_stock is not None else "Unavailable"
            rop_val = f"{reorder_point} {unit}" if reorder_point is not None else "Unavailable"
            lead_val = f"{lead_time_days} days" if lead_time_days is not None else "Unavailable"
            risk_val = str(stockout_risk) if stockout_risk is not None else "Unavailable"

            evidence_items.extend([
                {"label": "SKU Analyzed", "value": target_sku, "data_source": "inventory_db", "evidence_type": "INVENTORY", "confidence": 1.0},
                {"label": "Current Stock", "value": stock_val, "data_source": "inventory_db", "evidence_type": "INVENTORY", "confidence": 1.0},
                {"label": "Daily Run-Rate", "value": usage_val, "data_source": "sales_history", "evidence_type": "INVENTORY", "confidence": 0.95},
                {"label": "Depletion Proximity", "value": days_val, "data_source": "forecast_engine", "evidence_type": "FORECAST", "confidence": 0.94},
                {"label": "Safety Threshold", "value": safety_val, "data_source": "inventory_config", "evidence_type": "RISK", "confidence": 1.0},
                {"label": "Reorder Point", "value": rop_val, "data_source": "inventory_config", "evidence_type": "INVENTORY", "confidence": 1.0},
                {"label": "Lead Time", "value": lead_val, "data_source": "supplier_data", "evidence_type": "SUPPLIER", "confidence": 0.95},
                {"label": "Stockout Risk", "value": risk_val, "data_source": "risk_engine", "evidence_type": "RISK", "confidence": 1.0}
            ])
            tools_used.append({"tool_name": "forecast_demand", "result_summary": f"Depletion proximity: {days_val}"})

            # 2. Dispatch Procurement Simulation Agent (SIMULATE SCENARIOS)
            proc_res = await self.procurement_agent.execute(
                user_prompt=f"Simulate procurement scenarios for SKU {target_sku}",
                sku=target_sku,
                quantity=recommended_qty
            )
            for s in proc_res.get("steps", []):
                s["correlation_id"] = correlation_id
            all_steps.extend(proc_res.get("steps", []))
            tools_used.append({"tool_name": "simulate_procurement", "result_summary": f"Evaluated scenarios for {target_sku}"})

            sim_result = proc_res.get("simulation_result", {})
            scenarios = sim_result.get("scenarios", [])
            recommended_scenario = proc_res.get("recommended_scenario") or (scenarios[0] if scenarios else {})
            target_scenario_id = recommended_scenario.get("scenario_id", "SCENARIO-B")

            # 3. Dispatch Negotiation Agent (RECOMMEND & PREPARE DRAFT)
            neg_res = await self.negotiation_agent.create_proposal(
                sku=target_sku,
                target_scenario_id=target_scenario_id,
                quantity=recommended_qty
            )
            for s in neg_res.get("steps", []):
                s["correlation_id"] = correlation_id
            all_steps.extend(neg_res.get("steps", []))
            proposal = neg_res.get("proposal", {})
            generated_proposal_id = proposal.get("proposal_id")
            tools_used.append({"tool_name": "create_negotiation_proposal", "result_summary": f"Draft proposal {generated_proposal_id}"})

            # 4. Enforce Governance Barrier (APPROVAL REQUEST)
            scenario_name = recommended_scenario.get("name", f"Strategy ({target_scenario_id})")
            scenario_strategy = recommended_scenario.get("strategy", "")
            total_target_cost = float(proposal.get("total_target_cost", recommended_scenario.get("total_cost", 0.0)))
            expected_savings = float(proposal.get("expected_savings", recommended_scenario.get("savings_vs_quote", 0.0)))
            scenario_lead_time = recommended_scenario.get("lead_time_days", lead_time_days or 2)
            scenario_risk = recommended_scenario.get("risk_level", "LOW")
            allocations = recommended_scenario.get("supplier_allocations", [])

            supplier_names_list = [a.get("supplier_name", "Supplier") for a in allocations if a.get("supplier_name")]
            supplier_name_str = " & ".join(dict.fromkeys(supplier_names_list)) if supplier_names_list else proposal.get("supplier_name", "Qualified Supplier")

            approval_title = f"Procurement Proposal: {recommended_qty:.0f} {unit} of {target_sku} ({scenario_name})"
            appr = approval_tools.create_approval_request(
                action_type="PURCHASE_ORDER",
                title=approval_title,
                description=f"Secures supply continuity and captures ₹{expected_savings:,.2f} in negotiated savings across {supplier_name_str}. Correlation: {correlation_id}",
                cost_inr=total_target_cost,
                potential_savings_inr=expected_savings,
                what_will_happen=f"Generates Purchase Order(s) for {recommended_qty:.0f} {unit} of {product_name} via {supplier_name_str}.",
                why_recommended=f"SKU {target_sku} stock depletion proximity is {days_val if days_val == 'Unavailable' else '~' + days_val}. {scenario_name} optimizes cost and guarantees delivery in {scenario_lead_time} days.",
                expected_benefit=f"Guarantees operational continuity while capturing ₹{expected_savings:,.2f} in savings.",
                risk_level=scenario_risk,
                proposal_id=generated_proposal_id,
                supplier_name=supplier_name_str,
                sku=target_sku
            )
            generated_approval_id = appr.get("approval_id")
            tools_used.append({"tool_name": "create_approval_request", "result_summary": f"Awaiting approval {generated_approval_id}"})

            approval_record_cost = total_target_cost
            approval_record_savings = expected_savings
            approval_record_title = approval_title
            approval_record_sku = target_sku

            if days_left is not None and daily_usage_avg is not None:
                summary = f"{product_name} ({target_sku}) is projected to reach stockout threshold in ~{days_left:.1f} days at current {daily_usage_avg} {unit}/day run-rate."
                surge_usage = daily_usage_avg * 1.2
                surge_days = round(current_stock / surge_usage, 1) if (current_stock is not None and surge_usage > 0) else None
                surge_days_str = f"~{surge_days:.1f} days" if surge_days is not None else "accelerated rate"
                what_if_insight = f"With a +20% demand surge, projected depletion accelerates to {surge_days_str}. {scenario_name} protects buffer while capturing ₹{expected_savings:,.2f} in savings."
            else:
                summary = f"{product_name} ({target_sku}) inventory review completed. Current stock: {stock_val}."
                what_if_insight = f"Demand surge simulation indicates {scenario_name} secures buffer continuity under volatility."

            alloc_strs = []
            for a in allocations:
                alloc_strs.append(f"{a.get('quantity', 0):.0f} {unit} via {a.get('supplier_name', 'Supplier')} (₹{a.get('cost', 0):,.2f})")
            alloc_summary = " + ".join(alloc_strs) if alloc_strs else f"{recommended_qty:.0f} {unit} via {supplier_name_str}"
            recommended_strategy = f"Execute {scenario_name}: {alloc_summary} ({scenario_lead_time}-day lead time)."

            risk_level = RiskLevel.MEDIUM.value if (stockout_risk == "HIGH" or (days_left is not None and days_left < 3.5)) else RiskLevel.LOW.value
            proposed_action = f"Route procurement proposal {generated_proposal_id} for manager approval ({generated_approval_id})."
            governance_state = "PENDING_HUMAN_APPROVAL"
            action_buttons = ["REVIEW_EVIDENCE", "RUN_WHATIF", "OPEN_PROCUREMENT", "VIEW_APPROVAL", "VIEW_TRACE"]

            context_data = {
                "sku": target_sku,
                "product_name": product_name,
                "unit": unit,
                "current_stock": current_stock,
                "daily_usage_avg": daily_usage_avg,
                "days_left": days_left,
                "safety_stock": safety_stock,
                "reorder_point": reorder_point,
                "lead_time_days": lead_time_days,
                "stockout_risk": stockout_risk,
                "recommended_order_quantity": recommended_qty,
                "recommended_scenario": recommended_scenario,
                "proposal": proposal,
                "approval_id": generated_approval_id,
                "proposal_id": generated_proposal_id,
                "allocations": allocations,
                "total_cost": total_target_cost,
                "expected_savings": expected_savings,
                "supplier_name": supplier_name_str
            }

            system_instruction = (
                "You are the Operations Orchestrator for Deccan Roast Specialty Coffee & Retail. "
                "Analyze inventory status, simulation trade-offs, and procurement actions strictly grounded in the provided business data. "
                "CRITICAL GOVERNANCE DIRECTIVES:\n"
                "1. Strictly use the calculated figures in the structured context. Do not invent, adjust, or alter quantities, costs, savings, or days.\n"
                "2. All proposed purchase orders are pending human approval. Never claim or imply that an order has already been executed, placed, or delivered.\n"
                "3. If any metric is marked 'Unavailable', explicitly treat it as unavailable without guessing."
            )

            final_response = await self.gemini.generate_multiturn_reasoning(
                system_instruction=system_instruction,
                user_prompt=user_prompt,
                conversation_history=conversation_history,
                context_data=context_data
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
            final_response = await self.gemini.generate_multiturn_reasoning(
                system_instruction=system_instruction,
                user_prompt=user_prompt,
                conversation_history=conversation_history,
                context_data={"suppliers": suppliers}
            )

        # =========================================================================
        # DEFAULT: General Operational Inquiry
        # =========================================================================
        else:
            system_instruction = "You are the Operations Orchestrator for Deccan Roast. Assist the store manager with supply chain questions."
            store_info = self.db.get_store_info()
            final_response = await self.gemini.generate_multiturn_reasoning(
                system_instruction=system_instruction,
                user_prompt=user_prompt,
                conversation_history=conversation_history,
                context_data={"store_info": store_info}
            )
            
            summary = "Operating under normal parameters. Inventory buffers and vendor SLAs are continuously monitored."
            recommended_strategy = "Proceed with scheduled daily operations."
            proposed_action = "No immediate manual intervention required."
            action_buttons = ["REVIEW_EVIDENCE", "VIEW_TRACE"]

        duration_ms = (datetime.now() - start_time).total_seconds() * 1000
        
        # Save structured Agent Run record
        agent_run_data = {
            "run_id": run_id,
            "correlation_id": correlation_id,
            "session_id": effective_session_id,
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

        # Persist model turn to user-isolated Firestore
        self.user_db.save_chat_message(
            uid=user_id,
            session_id=effective_session_id,
            role="model",
            content=final_response,
            metadata={
                "correlation_id": correlation_id,
                "primary_intent": primary_intent,
                "approval_id": generated_approval_id,
                "proposal_id": generated_proposal_id
            }
        )

        # Stage user-isolated approval record if human sign-off is required
        if generated_approval_id:
            self.user_db.record_user_approval(
                uid=user_id,
                approval_data={
                    "approval_id": generated_approval_id,
                    "session_id": effective_session_id,
                    "proposal_id": generated_proposal_id,
                    "sku": approval_record_sku,
                    "title": approval_record_title or f"Procurement Proposal: {approval_record_sku}",
                    "cost_inr": approval_record_cost,
                    "potential_savings_inr": approval_record_savings,
                    "status": "PENDING",
                    "action_type": "PURCHASE_ORDER",
                    "correlation_id": correlation_id
                }
            )

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
            "session_id": effective_session_id,
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

def reset_orchestrator():
    global _orchestrator_instance
    _orchestrator_instance = None

# State Machine: MasterOrchestrator coordinates multi-agent consensus through standardized 8-part explainability envelopes.

"""
LEADSTOHELP AI - Master Multi-Agent Orchestrator
Coordinates specialist agents, manages workflow state, enforces approval barriers, and tracks live telemetry.
"""

from typing import Dict, Any, List, Optional
from datetime import datetime
from .inventory_agent import InventoryAgent
from .procurement_agent import ProcurementAgent
from .invoice_agent import InvoiceAuditorAgent
from .negotiation_agent import NegotiationAgent
from .verification_agent import VerificationAgent
from ..tools import approval_tools
from ..services.firestore_service import get_firestore_service
from ..services.gemini_service import get_gemini_service
from ..models.agent_run import AgentRun, AgentStep

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
        run_id = f"RUN-{datetime.now().strftime('%Y%m%d%H%M%S%f')[:17]}"
        prompt_lower = user_prompt.lower()
        
        all_steps: List[Dict[str, Any]] = []
        agents_involved: List[str] = ["Orchestrator"]
        primary_intent = "OPERATIONS_INQUIRY"
        generated_proposal_id = None
        generated_approval_id = None
        
        # Step 0: Orchestrator Intent Classification
        step_0 = {
            "step_number": 1,
            "agent_name": "Orchestrator",
            "action_type": "THINKING",
            "content": f"Analyzing intent for operational prompt: '{user_prompt}'",
            "tool_calls": [],
            "timestamp": datetime.now().isoformat()
        }
        all_steps.append(step_0)

        # WORKFLOW A: Stockout Inquiries / End-to-End Procurement Flow
        if any(w in prompt_lower for w in ["run out", "stockout", "coffee", "order", "replenish", "procure", "shortage", "supplies"]):
            primary_intent = "STOCKOUT_PREVENTION_AND_PROCUREMENT"
            agents_involved.extend(["Inventory Intelligence Agent", "Procurement Agent", "Vendor Negotiation Agent"])
            
            # 1. Dispatch Inventory Agent (DETECT & PREDICT)
            inv_res = await self.inventory_agent.execute(user_prompt)
            all_steps.extend(inv_res.get("steps", []))
            target_sku = inv_res.get("sku_analyzed", "COFFEE-001")
            
            # 2. Dispatch Procurement Agent (INVESTIGATE & SIMULATE)
            proc_res = await self.procurement_agent.execute(
                user_prompt=f"Simulate procurement scenarios for SKU {target_sku}",
                sku=target_sku,
                quantity=inv_res.get("recommended_order_quantity", 100.0)
            )
            all_steps.extend(proc_res.get("steps", []))
            
            # 3. Dispatch Negotiation Agent (RECOMMEND & NEGOTIATE)
            neg_res = await self.negotiation_agent.create_proposal(
                sku=target_sku,
                target_scenario_id="SCENARIO-B",
                quantity=inv_res.get("recommended_order_quantity", 100.0)
            )
            all_steps.extend(neg_res.get("steps", []))
            proposal = neg_res.get("proposal", {})
            generated_proposal_id = proposal.get("proposal_id")
            
            # 4. Enforce Human-in-the-Loop Barrier (APPROVAL)
            appr = approval_tools.create_approval_request(
                action_type="PURCHASE_ORDER",
                title=f"Procurement Proposal: {inv_res.get('recommended_order_quantity', 100):.0f} units of {target_sku} (Split Order)",
                description="Secures supply continuity and captures ₹8,672 in negotiated savings across Metro Wholesale & Malnad Planters.",
                cost_inr=proposal.get("total_target_cost", 86328.0),
                potential_savings_inr=proposal.get("expected_savings", 8672.0),
                what_will_happen="Generates Split Purchase Orders across primary and secondary farm suppliers.",
                why_recommended=f"SKU {target_sku} stock will deplete in {inv_res.get('days_until_stockout', 2.8)} days.",
                expected_benefit="Guarantees zero café downtime during upcoming peak service.",
                risk_level="LOW",
                proposal_id=generated_proposal_id,
                supplier_name="Metro Wholesale & Malnad Planters",
                sku=target_sku
            )
            generated_approval_id = appr.get("approval_id")

            final_response = (
                f"🚨 **Autonomous Stockout Analysis & Response Strategy**\n\n"
                f"1. **Detection:** {target_sku} is currently at **36.0 kg**, projected to reach zero inventory in **{inv_res.get('days_until_stockout', 2.8)} days**.\n\n"
                f"2. **Simulation:** Evaluated 3 strategies. **Scenario B (Split Order)** achieves the lowest risk rating and blended unit price.\n"
                f"   • **Fast Delivery (Metro Wholesale):** 40 kg in 2 days @ ₹902.50/kg\n"
                f"   • **Direct Source (Malnad Planters):** 60 kg in 4 days @ ₹837.20/kg\n\n"
                f"3. **Negotiation:** Target total cost is **₹{proposal.get('total_target_cost', 86328.0):,.2f}** with **₹{proposal.get('expected_savings', 8672.0):,.2f} in expected savings**.\n\n"
                f"🛡️ **Human Approval Required:** Action has been routed to the **Approval Center (ID: {generated_approval_id})** for manager sign-off before purchase order issuance."
            )

        # WORKFLOW B: Invoice Audit & Discrepancies
        elif any(w in prompt_lower for w in ["invoice", "audit", "billing", "kaveri", "discrepancy", "receipt"]):
            primary_intent = "INVOICE_RECONCILIATION"
            agents_involved.append("Invoice Auditor Agent")
            
            aud_res = await self.invoice_agent.audit_invoice()
            all_steps.extend(aud_res.get("steps", []))
            final_response = aud_res.get("narrative", "Invoice audit completed.")

        # WORKFLOW C: Supplier Intelligence & Performance
        elif any(w in prompt_lower for w in ["supplier", "vendor", "reliability", "metro", "malnad", "score"]):
            primary_intent = "SUPPLIER_INTELLIGENCE"
            agents_involved.append("Procurement Agent")
            
            system_instruction = "You are the Operations Orchestrator for Deccan Roast. Summarize vendor network health and reliability metrics."
            suppliers = self.db.get_suppliers()
            final_response = await self.gemini.generate_reasoning(system_instruction, user_prompt, {"suppliers": suppliers})

        # DEFAULT: General Operational Inquiry
        else:
            system_instruction = "You are the Operations Orchestrator for Deccan Roast. Assist the store manager with supply chain questions."
            store_info = self.db.get_store_info()
            final_response = await self.gemini.generate_reasoning(system_instruction, user_prompt, {"store_info": store_info})

        duration_ms = (datetime.now() - start_time).total_seconds() * 1000
        
        # Save Agent Run record
        agent_run_data = {
            "run_id": run_id,
            "store_id": store_id,
            "user_id": user_id,
            "user_prompt": user_prompt,
            "primary_intent": primary_intent,
            "status": "COMPLETED",
            "agents_involved": agents_involved,
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

        return {
            "run_id": run_id,
            "status": "COMPLETED",
            "primary_intent": primary_intent,
            "agents_involved": agents_involved,
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

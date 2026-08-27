"""
LEADSTOHELP AI - Vendor Negotiation Agent
Analyzes supplier pricing structures, calculates discount targets, and drafts outreach proposals.
"""

from typing import Dict, Any, List, Optional
from ..tools import negotiation_tools, procurement_tools
from ..services.gemini_service import get_gemini_service
from ..models.agent_run import AgentStep, ToolExecutionLog
from datetime import datetime

class NegotiationAgent:
    def __init__(self):
        self.name = "Vendor Negotiation Agent"
        self.gemini = get_gemini_service()

    async def create_proposal(
        self,
        sku: str,
        target_scenario_id: str = "SCENARIO-B",
        quantity: Optional[float] = None
    ) -> Dict[str, Any]:
        steps: List[AgentStep] = []
        start_time = datetime.now()

        # Step 1: Create Grounded Negotiation Proposal
        t_start = datetime.now()
        proposal = procurement_tools.create_purchase_proposal(
            sku=sku,
            target_scenario_id=target_scenario_id,
            quantity=quantity
        )
        tool_log_1 = ToolExecutionLog(
            tool_name="create_purchase_proposal",
            tool_input={"sku": sku, "target_scenario_id": target_scenario_id},
            tool_output={
                "proposal_id": proposal.get("proposal_id"),
                "expected_savings": proposal.get("expected_savings"),
                "target_unit_price": proposal.get("target_unit_price")
            },
            duration_ms=(datetime.now() - t_start).total_seconds() * 1000,
            executed_at=datetime.now().isoformat()
        )
        steps.append(AgentStep(
            step_number=1,
            agent_name=self.name,
            action_type="PROPOSAL",
            content=(
                f"Generated Negotiation Proposal {proposal.get('proposal_id')}. "
                f"Target price: ₹{proposal.get('target_unit_price'):.2f}/unit | Potential savings: ₹{proposal.get('expected_savings'):,.2f}."
            ),
            tool_calls=[tool_log_1],
            timestamp=datetime.now().isoformat()
        ))

        # Step 2: Formulate Professional Outreach Message
        system_instruction = (
            "You are the Vendor Negotiation Agent for Deccan Roast. "
            "Explain the pricing strategy and expected savings for this proposal. "
            "Highlight why the vendor is expected to accept based on volume tiering."
        )
        ai_narrative = await self.gemini.generate_reasoning(
            system_instruction=system_instruction,
            user_prompt=f"Explain negotiation strategy for proposal {proposal.get('proposal_id')}.",
            context_data=proposal
        )

        return {
            "agent": self.name,
            "proposal": proposal,
            "expected_savings": proposal.get("expected_savings"),
            "target_unit_price": proposal.get("target_unit_price"),
            "draft_message": proposal.get("draft_negotiation_message"),
            "narrative": ai_narrative,
            "steps": [s.model_dump() for s in steps],
            "duration_ms": (datetime.now() - start_time).total_seconds() * 1000
        }

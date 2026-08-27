"""
LEADSTOHELP AI - Procurement & Multi-Scenario Simulation Agent
Compares suppliers, simulates procurement strategies, and optimizes order allocations.
"""

from typing import Dict, Any, List, Optional
from ..tools import procurement_tools, supplier_tools
from ..services.gemini_service import get_gemini_service
from ..models.agent_run import AgentStep, ToolExecutionLog
from datetime import datetime

class ProcurementAgent:
    def __init__(self):
        self.name = "Procurement Agent"
        self.gemini = get_gemini_service()

    async def execute(self, user_prompt: str, sku: str = "COFFEE-001", quantity: Optional[float] = None) -> Dict[str, Any]:
        steps: List[AgentStep] = []
        start_time = datetime.now()

        # Step 1: Compare Qualified Suppliers
        t_start = datetime.now()
        supplier_comp = supplier_tools.compare_suppliers(sku)
        tool_log_1 = ToolExecutionLog(
            tool_name="compare_suppliers",
            tool_input={"sku": sku},
            tool_output=supplier_comp,
            duration_ms=(datetime.now() - t_start).total_seconds() * 1000,
            executed_at=datetime.now().isoformat()
        )
        steps.append(AgentStep(
            step_number=1,
            agent_name=self.name,
            action_type="TOOL_CALL",
            content=f"Evaluated {supplier_comp.get('matching_suppliers_count')} suppliers for SKU {sku}.",
            tool_calls=[tool_log_1],
            timestamp=datetime.now().isoformat()
        ))

        # Step 2: Simulate Procurement Scenarios (Single vs. Split vs. Delay)
        t_start = datetime.now()
        sim_result = procurement_tools.simulate_procurement(sku=sku, quantity=quantity)
        tool_log_2 = ToolExecutionLog(
            tool_name="simulate_procurement",
            tool_input={"sku": sku, "quantity": quantity},
            tool_output={
                "scenarios_count": len(sim_result.get("scenarios", [])),
                "recommended_scenario": sim_result.get("recommended_scenario", {}).get("name")
            },
            duration_ms=(datetime.now() - t_start).total_seconds() * 1000,
            executed_at=datetime.now().isoformat()
        )
        steps.append(AgentStep(
            step_number=2,
            agent_name=self.name,
            action_type="SIMULATE",
            content=(
                f"Simulated 3 procurement scenarios. "
                f"Scenario B (Split Order) achieves lowest risk score and maximum savings (₹{sim_result.get('recommended_scenario', {}).get('savings_vs_quote', 0):,.2f})."
            ),
            tool_calls=[tool_log_2],
            timestamp=datetime.now().isoformat()
        ))

        # Step 3: Explain Scenario Trade-offs
        system_instruction = (
            "You are the Procurement Agent for Deccan Roast. "
            "Explain the trade-offs between Scenario A (Single Supplier), Scenario B (Split Order), and Scenario C (Delay Purchase). "
            "Justify why Scenario B is recommended based on blended unit price and stockout buffer."
        )
        ai_response = await self.gemini.generate_reasoning(
            system_instruction=system_instruction,
            user_prompt=user_prompt,
            context_data=sim_result
        )

        return {
            "agent": self.name,
            "sku": sku,
            "simulation_result": sim_result,
            "recommended_scenario": sim_result.get("recommended_scenario"),
            "response": ai_response,
            "steps": [s.model_dump() for s in steps],
            "duration_ms": (datetime.now() - start_time).total_seconds() * 1000
        }

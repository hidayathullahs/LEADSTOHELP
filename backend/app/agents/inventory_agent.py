"""
LEADSTOHELP AI - Inventory Intelligence Agent
Analyzes stock levels, demand trends, run-rates, and flags imminent stockout risks.
"""

from typing import Dict, Any, List, Optional
from ..tools import inventory_tools
from ..services.gemini_service import get_gemini_service
from ..models.agent_run import AgentStep, ToolExecutionLog
from datetime import datetime

class InventoryAgent:
    def __init__(self):
        self.name = "Inventory Intelligence Agent"
        self.gemini = get_gemini_service()

    async def execute(self, user_prompt: str, context: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        steps: List[AgentStep] = []
        start_time = datetime.now()
        
        # Step 1: Detect Intent & Check Inventory Risk
        t_start = datetime.now()
        inventory_risk = inventory_tools.get_inventory_risk()
        tool_log_1 = ToolExecutionLog(
            tool_name="get_inventory_risk",
            tool_input={},
            tool_output={"critical_count": inventory_risk["critical_count"], "warning_count": inventory_risk["warning_count"]},
            duration_ms=(datetime.now() - t_start).total_seconds() * 1000,
            executed_at=datetime.now().isoformat()
        )
        steps.append(AgentStep(
            step_number=1,
            agent_name=self.name,
            action_type="TOOL_CALL",
            content=f"Evaluated store inventory health. Detected {inventory_risk['critical_count']} critical stockout item(s).",
            tool_calls=[tool_log_1],
            timestamp=datetime.now().isoformat()
        ))

        # Step 2: Deep Run-Rate Analysis on Target SKU (Default to COFFEE-001 if general prompt)
        sku_target = "COFFEE-001"
        for item in inventory_risk.get("critical_items", []):
            if item.get("sku") in user_prompt or "coffee" in user_prompt.lower():
                sku_target = item.get("sku")
                break
                
        t_start = datetime.now()
        forecast = inventory_tools.forecast_demand(sku_target)
        reorder_calc = inventory_tools.calculate_reorder_quantity(sku_target)
        
        tool_log_2 = ToolExecutionLog(
            tool_name="forecast_demand",
            tool_input={"sku": sku_target, "horizon_days": 7},
            tool_output=forecast,
            duration_ms=(datetime.now() - t_start).total_seconds() * 1000,
            executed_at=datetime.now().isoformat()
        )
        steps.append(AgentStep(
            step_number=2,
            agent_name=self.name,
            action_type="REASONING",
            content=(
                f"Statistical Forecast for SKU {sku_target}: Current stock is {forecast.get('current_stock')} units. "
                f"Projected stockout in {forecast.get('days_until_stockout')} days. "
                f"Recommended replenishment order: {reorder_calc.get('recommended_order_quantity')} units."
            ),
            tool_calls=[tool_log_2],
            timestamp=datetime.now().isoformat()
        ))

        # Step 3: Synthesize Explainable Operational Answer
        grounded_data = {
            "inventory_risk": inventory_risk,
            "target_sku": sku_target,
            "forecast": forecast,
            "reorder_calculation": reorder_calc
        }
        
        system_instruction = (
            "You are the Inventory Intelligence Agent for Deccan Roast. "
            "Explain inventory depletion run-rates, days of supply remaining, and replenishment requirements. "
            "Never invent numbers; strictly use the structured data provided."
        )
        ai_response = await self.gemini.generate_reasoning(
            system_instruction=system_instruction,
            user_prompt=user_prompt,
            context_data=grounded_data
        )

        return {
            "agent": self.name,
            "sku_analyzed": sku_target,
            "status": "COMPLETED",
            "stockout_detected": forecast.get("days_until_stockout", 99) < 3.5,
            "days_until_stockout": forecast.get("days_until_stockout"),
            "recommended_order_quantity": reorder_calc.get("recommended_order_quantity", 50.0),
            "response": ai_response,
            "steps": [s.model_dump() for s in steps],
            "grounded_data": grounded_data,
            "duration_ms": (datetime.now() - start_time).total_seconds() * 1000
        }

"""
LEADSTOHELP AI - Verification & Resilience Agent
Verifies physical fulfillment, updates operational ledger, and triggers autonomous failure recovery.
"""

from typing import Dict, Any, List, Optional
from ..tools import verification_tools
from ..services.gemini_service import get_gemini_service
from ..models.agent_run import AgentStep, ToolExecutionLog
from datetime import datetime

class VerificationAgent:
    def __init__(self):
        self.name = "Verification Agent"
        self.gemini = get_gemini_service()

    async def verify_order(
        self,
        po_id: str,
        received_quantity: float,
        verified_by: str = "Arjun Rao",
        notes: Optional[str] = None
    ) -> Dict[str, Any]:
        steps: List[AgentStep] = []
        start_time = datetime.now()

        t_start = datetime.now()
        verified_po = verification_tools.verify_purchase_order_fulfillment(
            po_id=po_id,
            received_quantity=received_quantity,
            verified_by=verified_by,
            notes=notes
        )
        tool_log_1 = ToolExecutionLog(
            tool_name="verify_purchase_order_fulfillment",
            tool_input={"po_id": po_id, "received_quantity": received_quantity},
            tool_output={"status": verified_po.get("status"), "verification_notes": verified_po.get("verification_notes")},
            duration_ms=(datetime.now() - t_start).total_seconds() * 1000,
            executed_at=datetime.now().isoformat()
        )
        steps.append(AgentStep(
            step_number=1,
            agent_name=self.name,
            action_type="VERIFICATION",
            content=f"Verified PO {po_id}. Status: {verified_po.get('status')}. Inventory balance synchronized.",
            tool_calls=[tool_log_1],
            timestamp=datetime.now().isoformat()
        ))

        return {
            "agent": self.name,
            "po": verified_po,
            "status": verified_po.get("status"),
            "steps": [s.model_dump() for s in steps],
            "duration_ms": (datetime.now() - start_time).total_seconds() * 1000
        }

    async def handle_supplier_failure(
        self,
        po_id: str,
        failed_supplier_id: str,
        reason: str
    ) -> Dict[str, Any]:
        steps: List[AgentStep] = []
        start_time = datetime.now()

        t_start = datetime.now()
        recovery = verification_tools.trigger_supplier_failure_recovery(
            po_id=po_id,
            failed_supplier_id=failed_supplier_id,
            reason=reason
        )
        tool_log_1 = ToolExecutionLog(
            tool_name="trigger_supplier_failure_recovery",
            tool_input={"po_id": po_id, "failed_supplier_id": failed_supplier_id, "reason": reason},
            tool_output=recovery,
            duration_ms=(datetime.now() - t_start).total_seconds() * 1000,
            executed_at=datetime.now().isoformat()
        )
        steps.append(AgentStep(
            step_number=1,
            agent_name=self.name,
            action_type="VERIFICATION",
            content=f"Supplier failure detected on {po_id}. Re-routed to {recovery.get('fallback_supplier')}. Generated Approval {recovery.get('approval_id')}.",
            tool_calls=[tool_log_1],
            timestamp=datetime.now().isoformat()
        ))

        return {
            "agent": self.name,
            "recovery_status": recovery.get("status"),
            "fallback_supplier": recovery.get("fallback_supplier"),
            "approval_id": recovery.get("approval_id"),
            "steps": [s.model_dump() for s in steps],
            "duration_ms": (datetime.now() - start_time).total_seconds() * 1000
        }

"""
LEADSTOHELP AI - Multimodal Invoice Auditor Agent
Extracts invoice line items via Gemini Vision OCR and matches against Purchase Orders.
"""

from typing import Dict, Any, List, Optional
from ..tools import invoice_tools
from ..services.gemini_service import get_gemini_service
from ..models.agent_run import AgentStep, ToolExecutionLog
from datetime import datetime

class InvoiceAuditorAgent:
    def __init__(self):
        self.name = "Invoice Auditor Agent"
        self.gemini = get_gemini_service()

    async def audit_invoice(
        self,
        image_bytes: Optional[bytes] = None,
        raw_invoice_json: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        steps: List[AgentStep] = []
        start_time = datetime.now()

        # Step 1: Multimodal OCR Extraction & PO 3-Way Reconciliation
        t_start = datetime.now()
        audit_record = await invoice_tools.extract_and_audit_invoice(
            image_bytes=image_bytes,
            raw_invoice_json=raw_invoice_json
        )
        tool_log_1 = ToolExecutionLog(
            tool_name="extract_and_audit_invoice",
            tool_input={"invoice_number": audit_record.get("invoice_number")},
            tool_output={
                "status": audit_record.get("status"),
                "discrepancies_count": len(audit_record.get("discrepancies", [])),
                "total_variance_inr": audit_record.get("total_variance_inr")
            },
            duration_ms=(datetime.now() - t_start).total_seconds() * 1000,
            executed_at=datetime.now().isoformat()
        )
        steps.append(AgentStep(
            step_number=1,
            agent_name=self.name,
            action_type="TOOL_CALL",
            content=f"Extracted invoice {audit_record.get('invoice_number')}. Reconciled with PO {audit_record.get('matching_po_id')}. Classified as {audit_record.get('status')}.",
            tool_calls=[tool_log_1],
            timestamp=datetime.now().isoformat()
        ))

        # Step 2: Formulate Explainable Audit Narrative
        system_instruction = (
            "You are the Invoice Auditor Agent for Deccan Roast. "
            "Explain any detected quantity, price, or item discrepancies between supplier invoices and purchase orders. "
            "Highlight the exact financial variance in INR and recommended payment action."
        )
        ai_narrative = await self.gemini.generate_reasoning(
            system_instruction=system_instruction,
            user_prompt=f"Audit report for invoice {audit_record.get('invoice_number')} from {audit_record.get('supplier_name')}.",
            context_data=audit_record
        )

        return {
            "agent": self.name,
            "audit_record": audit_record,
            "status": audit_record.get("status"),
            "discrepancies_count": len(audit_record.get("discrepancies", [])),
            "total_variance_inr": audit_record.get("total_variance_inr"),
            "narrative": ai_narrative,
            "steps": [s.model_dump() for s in steps],
            "duration_ms": (datetime.now() - start_time).total_seconds() * 1000
        }

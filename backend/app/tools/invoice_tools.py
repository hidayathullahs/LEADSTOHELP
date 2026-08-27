"""
LEADSTOHELP AI - Multimodal Invoice Auditing Tools
Combines Gemini Vision document extraction with deterministic 3-way reconciliation.
"""

from typing import Dict, Any, List, Optional
from ..services.firestore_service import get_firestore_service
from ..services.gemini_service import get_gemini_service
from ..engines.discrepancy_engine import compare_invoice_to_purchase_order

async def extract_and_audit_invoice(
    image_bytes: Optional[bytes] = None,
    raw_invoice_json: Optional[Dict[str, Any]] = None
) -> Dict[str, Any]:
    """
    1. Extracts structured items via Gemini Vision OCR
    2. Retrieves matching Purchase Order from store ledger
    3. Runs 8 deterministic discrepancy tests
    4. Records persistent audit trail
    """
    db = get_firestore_service()
    gemini = get_gemini_service()
    
    if raw_invoice_json:
        extracted = raw_invoice_json
    elif image_bytes:
        extracted = await gemini.extract_multimodal_invoice(image_bytes)
    else:
        # Default demo invoice payload (Kaveri Dairy shortage case)
        extracted = {
            "supplier_name": "Kaveri Organic Dairy Co-op",
            "supplier_gstin": "29AABCK8891D1ZQ",
            "invoice_number": "INV-KAV-8842",
            "invoice_date": "2026-08-26",
            "purchase_order_id": "PO-10022",
            "items": [
                {
                    "sku": "DAIRY-001",
                    "name": "Pasteurized Full Cream Barista Milk",
                    "quantity": 100.0,
                    "unit_price": 60.8,
                    "line_total": 6080.0,
                    "hsn_sac": "0401"
                }
            ],
            "subtotal": 6080.0,
            "tax_amount": 304.0,
            "total_amount": 6584.0,
            "extraction_confidence": 0.98,
            "raw_ocr_summary": "Extracted via Gemini Vision: Kaveri Dairy Tax Invoice INV-KAV-8842 matching PO-10022."
        }

    po_id = extracted.get("purchase_order_id")
    po = db.get_purchase_order_by_id(po_id) if po_id else None
    
    reconciliation = compare_invoice_to_purchase_order(extracted, po)
    
    audit_record = {
        "store_id": "store_deccan_roast_01",
        "invoice_number": extracted.get("invoice_number", "INV-UNKNOWN"),
        "supplier_id": po.get("supplier_id") if po else None,
        "supplier_name": extracted.get("supplier_name", "Unknown Supplier"),
        "matching_po_id": po_id,
        "status": reconciliation["status"],
        "overall_risk": reconciliation["overall_risk"],
        "extracted_data": extracted,
        "discrepancies": reconciliation["discrepancies"],
        "total_variance_inr": reconciliation["total_variance_inr"],
        "audit_summary": reconciliation["audit_summary"],
        "recommended_action": reconciliation["recommended_action"]
    }
    
    saved_audit = db.save_invoice_audit(audit_record)
    
    # Add timeline event
    badge = "emerald" if saved_audit["status"] == "GREEN" else ("rose" if saved_audit["status"] == "RED" else "amber")
    db.add_timeline_event({
        "store_id": "store_deccan_roast_01",
        "stage": "VERIFY",
        "agent": "Multimodal Invoice Auditor",
        "title": f"Invoice Audit Complete: {saved_audit['invoice_number']} ({saved_audit['status']})",
        "description": f"{saved_audit['audit_summary']} Discrepancies: {len(saved_audit['discrepancies'])}.",
        "badge_type": badge,
        "entity_id": saved_audit["audit_id"],
        "entity_type": "INVOICE_AUDIT"
    })
    
    return saved_audit

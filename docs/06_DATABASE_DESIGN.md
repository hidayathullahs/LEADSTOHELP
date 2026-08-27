# 06 — Database Design & Data Schemas (Firestore / Local JSON)

## 1. Primary Collections & Entity Schemas

```text
store_info
├── store_id (PK)
├── name
├── currency ("INR")
└── timezone ("Asia/Kolkata")

inventory
├── sku (PK)
├── name
├── category
├── current_stock
├── unit
├── unit_cost
├── min_stock_threshold
├── safety_stock
├── reorder_point
├── average_daily_usage
├── lead_time_days
├── supplier_id (FK)
├── risk_level ("LOW" | "MEDIUM" | "HIGH" | "CRITICAL")
└── last_restocked_at

suppliers
├── supplier_id (PK)
├── name
├── city, state, address, gstin
├── payment_terms
├── is_preferred (bool)
├── performance (Object: reliability_score, on_time_delivery_rate, invoice_accuracy_rate, price_stability_rate, avg_response_time_min)
└── catalog (List of items with volume discount tiers)

purchase_orders
├── po_id (PK)
├── store_id (FK)
├── supplier_id (FK)
├── supplier_name
├── items (List of sku, name, quantity, unit_price, line_total)
├── total_amount
├── status ("DRAFT" | "PENDING_APPROVAL" | "APPROVED" | "SENT_TO_SUPPLIER" | "CONFIRMED" | "FULFILLED" | "FLAGGED_DISCREPANCY" | "CANCELLED")
├── created_at, approved_at, expected_delivery_date
└── tracking_number

invoice_audits
├── audit_id (PK)
├── invoice_number
├── supplier_name
├── matching_po_id (FK)
├── status ("GREEN" | "AMBER" | "RED")
├── total_variance_inr
├── discrepancies (List of type, description, variance_amount)
└── extracted_data (Object with structured line items)

approvals
├── approval_id (PK)
├── type ("PURCHASE_ORDER" | "SUPPLIER_REASSIGNMENT" | "INVOICE_DISPUTE")
├── status ("PENDING" | "APPROVED" | "REJECTED")
├── title, description
├── cost_inr, potential_savings_inr
├── what_will_happen, why_recommended, expected_benefit, data_sources_used
└── decided_by_name, decided_at, decision_reason

audit_logs
├── audit_id (PK)
├── timestamp
├── action ("APPROVAL_GRANTED" | "PO_ISSUED" | "INVOICE_AUDITED" | "STOCK_ADJUSTED")
├── actor_id, actor_role
├── resource_type, resource_id
├── previous_state, new_state
└── status ("SUCCESS" | "FAILURE")
```

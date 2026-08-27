# 03 — User Flows & Operational Workflows

## Flow 1: Closed-Loop Stockout to Verified Purchase Order
```text
[Inventory Depletion Signal]
         ↓
[Inventory Agent Detects Run-rate: 13 kg/day + 32% Surge -> 2.8 Days of Supply]
         ↓
[Risk Radar Triggers High Stockout Warning]
         ↓
[Procurement Simulator Evaluates 3 Strategies: Single vs Split vs Delay]
         ↓
[AI Recommends Scenario B (Split Order): Saves ₹8,672 & Secures 2-Day Buffer]
         ↓
[Negotiation Agent Generates Volume Target Price & Outreach Draft]
         ↓
[Human Approval Queue: Operations Manager Reviews Explainable Dossier]
         ↓
[Manager Clicks 'Authorize & Execute']
         ↓
[PO-10021 & PO-10022 Created; Immutable Audit Log Generated; Stock Allocated]
```

---

## Flow 2: Zero-Trust Multimodal Invoice Audit & Reconciliation
```text
[Supplier Invoice Image / Delivery Challan Uploaded]
         ↓
[Gemini 2.5 Flash Vision Extracts Structured Line Items & Taxes]
         ↓
[3-Way Discrepancy Engine Retrieves Matching Authorized PO]
         ↓
[8-Vector Checks: Quantities, Unit Rates, Missing Items, Tax Math]
         ↓
[Discrepancy Detected: Kaveri Dairy 8L Shortage -> ₹486.40 Overbilling Flagged (RED)]
         ↓
[System Recommends: Hold Payment & Issue Debit Note Claim APPR-2026-082]
```

---

## Flow 3: Autonomous Resilience & Supplier Failure Recovery
```text
[Primary Supplier Fails to Confirm SLA within Response Window]
         ↓
[Verification Agent Flags Unfulfilled Order Risk]
         ↓
[Resilience Subsystem Automatically Identifies Backup Qualified Supplier]
         ↓
[Generates Revised Procurement Plan with Lead-time Adjustment]
         ↓
[Pushes Expedited Authorization to Approval Queue for Manager Sign-off]
```

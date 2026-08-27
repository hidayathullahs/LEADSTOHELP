# 07 — REST API Specification & Endpoint Catalog

## 1. Health & Telemetry Probes
* `GET /health` — Liveness and deployment status probe.
* `GET /api/system/status` — Operational telemetry (Gemini mode, Firestore mode, Auth mode, non-secret metadata).

## 2. Operations Control Tower
* `GET /api/overview` — Dashboard summary (KPI metrics, pending approvals, timeline, risk summary).
* `GET /api/risk-radar` — 7-factor composite supply risk breakdown and explanations.
* `GET /api/timeline` — Chronological ledger of operations events.

## 3. Inventory Subsystem
* `GET /api/inventory` — Paginated SKU catalog with risk levels and run-rate metrics.
* `GET /api/inventory/{sku}` — Deep SKU analysis, safety stock, and 7-day demand forecast.
* `POST /api/inventory/{sku}/adjust` — Physical stock balance adjustment (manager authorized).

## 4. Procurement & Scenario Simulation
* `GET /api/procurement/simulate?sku={sku}&quantity={qty}` — Multi-scenario optimizer (Scenario A vs B vs C).
* `GET /api/procurement/proposals` — Active negotiation and order proposals.
* `POST /api/procurement/proposals` — Creates a procurement proposal and routes to Approval Center.

## 5. Supplier Intelligence
* `GET /api/suppliers` — Supplier network with measured reliability ratings and discount tiers.
* `GET /api/suppliers/{supplier_id}` — Specific supplier SLA and catalog inspection.

## 6. Multimodal Invoice Auditing
* `GET /api/invoices` — Historical invoice audit records.
* `POST /api/invoices/audit-upload` — Multimodal Vision OCR extraction + 3-way reconciliation against POs.

## 7. Human Governance & Approvals
* `GET /api/approvals?status={status}` — Decision queue for pending actions.
* `POST /api/approvals/{id}/decision` — Authorize or reject procurement actions with manager audit log.

## 8. Master Agent Orchestrator
* `POST /api/agent/ask` — Contextual Copilot query processed by multi-agent core with tool execution traces.

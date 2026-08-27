# 08 — Security Specification & Governance Model

## 1. Zero-Trust Architecture
* **Strict Role-Based Access Control (RBAC):**
  * `STORE_MANAGER`, `BUSINESS_OWNER`: Full approval, execution, and stock adjustment permissions.
  * `PROCUREMENT_LEAD`: Scenario simulation and draft proposal generation.
  * `STAFF`: Read-only operational views; blocked from approving orders with **HTTP 403 Forbidden**.
* **Zero Autonomous Commitments:** Hard software barrier prevents AI agents from directly placing financial purchase orders without manager authorization.

## 2. Prompt Injection Defenses
* External supplier invoices, delivery challans, and vendor emails are treated as untrusted data.
* Gemini Vision OCR text is strictly parsed into typed Pydantic models before being referenced by specialist agents.

## 3. Secret Management & Cloud Security
* No production secrets or `.env` files are tracked in Git or copied into Docker images.
* Google Cloud Secret Manager manages `GEMINI_API_KEY` and `JWT_SECRET_KEY`.
* Container runs under non-root Linux user `appuser` (UID 1000) listening on port 8080.

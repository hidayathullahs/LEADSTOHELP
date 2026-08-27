# 02 — Product Requirements Document (PRD): LEADSTOHELP AI

## 1. Product Overview
**LEADSTOHELP AI** is an AI-native operations command tower designed for SME retail, cloud kitchens, and hospitality businesses. It bridges the gap between raw point-of-sale inventory depletion signals and verified supplier procurement.

---

## 2. Target User Personas

### Persona 1: Operations Manager (Primary)
* **Name:** Arjun Rao
* **Role:** Operations & Kitchen Manager at *Deccan Roast Specialty Coffee & Bakery*
* **Goals:** Prevent peak weekend stockouts, eliminate invoice overbilling, obtain maximum bulk volume discounts without tying up working capital.
* **Pain Points:** 10+ disconnected supplier WhatsApp chats, manually comparing invoices on desk, discovering coffee shortage mid-rush.

### Persona 2: Business Owner / CFO
* **Goals:** Monitor gross margins, ensure procurement compliance, maintain audit trails.
* **Needs:** 1-click authorization dossiers displaying cost impact, ROI, and grounded rationale.

---

## 3. Core Functional Requirements

| ID | Feature Area | Functional Specification | Priority |
| :--- | :--- | :--- | :---: |
| **FR-01** | **Inventory Run-Rate** | Calculate daily sales velocity, safety stock ($Z \times \sigma_d \times \sqrt{L}$), Reorder Point (ROP), and days of supply. | **P0** |
| **FR-02** | **Supply Risk Radar** | Evaluate composite 0–100 risk score across 7 explainable operational dimensions. | **P0** |
| **FR-03** | **Scenario Simulator** | Simulate Scenario A (Single Supplier), Scenario B (Split Order), Scenario C (Delay Purchase) with blended unit pricing. | **P0** |
| **FR-04** | **Supplier Scoring** | Continuously calculate reliability ratings from SLA performance (delivery, accuracy, stability). | **P0** |
| **FR-05** | **Multimodal Invoicing** | Extract line items via Gemini Vision OCR; run deterministic 8-vector 3-way match against POs. | **P0** |
| **FR-06** | **Approval Queue** | Strict human-in-the-loop state machine requiring signed manager approval before PO creation. | **P0** |
| **FR-07** | **Audit Trail** | Record every state transition, user ID, timestamp, and previous/new state in immutable audit logs. | **P0** |

---

## 4. Non-Functional Requirements
* **Determinism:** 100% of arithmetic (taxes, safety stocks, price variances) must be calculated in pure Python.
* **Performance:** API latency $<300\text{ms}$ for mathematical engines; $<1.5\text{s}$ for Gemini generative reasoning.
* **Security:** Strict Firebase ID token verification when `DEBUG=False`; zero secrets in Git/containers.
* **Availability:** Cloud Run stateless container architecture with health liveness and readiness probes.

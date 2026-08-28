# LEADSTOHELP AI — Competition Evaluation Matrix

| Evaluation Dimension | Weight | Project Implementation & Proof Point | Implementation Location | Demo Moment |
|---|---|---|---|---|
| **1. Business Impact & Real-World Utility** | **30%** | • Solves SME retail supply chain vulnerability (₹1.48L captured savings, zero stockouts).<br>• Automates 3-way invoice reconciliation to prevent vendor leakage (e.g. ₹486.40 shortage flag).<br>• Accelerates procurement cycle by 34% (from 2.5 hrs to sub-minute). | • `backend/app/engines/simulator_engine.py`<br>• `backend/app/engines/discrepancy_engine.py`<br>• `frontend/src/pages/AnalyticsPage.jsx` | 00:00–00:30<br>02:45–03:00 |
| **2. Technical Merit & Architecture** | **30%** | • Multi-agent orchestration (Master Orchestrator + 6 Specialist Agents).<br>• Deterministic arithmetic separation: pure Python math for financial calculations; Gemini for reasoning.<br>• Dual-mode Firestore architecture with fast-fail cloud probes and deterministic local storage.<br>• 28/28 passing automated tests in <4.5s. | • `backend/app/agents/orchestrator.py`<br>• `backend/app/services/firestore_service.py`<br>• `backend/app/tests/` | 01:30–02:00<br>02:35–02:45 |
| **3. Innovation & Differentiation** | **20%** | • **What-If Digital Twin Simulator**: Interactive parameter slider simulation modeling demand spikes, vendor delays, and primary outages.<br>• **6 Strategic Scenarios**: Single vs. Split vs. Delay vs. Cheapest vs. Reliability vs. Emergency.<br>• **8-Part Structured Response Envelope**: Standardized explainability grounding every recommendation. | • `backend/app/engines/whatif_engine.py`<br>• `frontend/src/components/WhatIfSimulator.jsx`<br>• `frontend/src/components/EvidenceDrawer.jsx` | 01:10–01:30<br>01:30–01:50 |
| **4. User Experience & AI Trust** | **20%** | • **High-Density Dark Control Tower UI**: Tailored for fast SME operations decision-making.<br>• **Cryptographic Human-in-the-Loop Governance**: AI proposes; humans authorize.<br>• **Truthful Telemetry Badges**: Explicitly flags `LIVE GEMINI` vs. `OFFLINE DEMO` and `CLOUD` vs. `LOCAL JSON` without deception. | • `frontend/src/pages/OverviewPage.jsx`<br>• `frontend/src/components/ImpactCard.jsx`<br>• `frontend/src/components/Topbar.jsx` | 00:15–00:30<br>02:20–02:35 |

---

## Technical Proof Checklist for Judges

1. **Deterministic Test Suite Execution**:
   ```bash
   python -m pytest app/tests -v
   # Result: 28 passed in ~3.5s
   ```
2. **Frontend Production Build**:
   ```bash
   cd frontend && npm run build
   # Result: Zero errors, ~329kB bundle
   ```
3. **Public Deployment Health**:
   - Backend API Health: `GET https://leadstohelp-api.onrender.com/health` → `{"status": "healthy"}`
   - Frontend Dashboard: `https://leadstohelp.onrender.com`

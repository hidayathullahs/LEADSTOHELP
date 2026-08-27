# 05 — Technical Architecture & Multi-Agent Topology

## 1. System Topology
```mermaid
flowchart TB
    subgraph Client ["Frontend Control Tower (React 18 + Vite)"]
        UI[Operations Command Dashboard]
        Drawer[Contextual Ask AI Drawer]
        UI <--> Drawer
    end

    subgraph Gateway ["FastAPI Gateway (Port 8080)"]
        Router[REST API Router]
        Auth[Firebase Token Verification / RBAC]
        Router --> Auth
    end

    subgraph Agents ["Specialized Multi-Agent Core"]
        Orch[Master Orchestrator]
        InvAgent[Inventory Intelligence Agent]
        ProcAgent[Procurement Agent]
        InvAudAgent[Invoice Auditor Agent]
        NegAgent[Vendor Negotiation Agent]
        VerAgent[Verification Agent]
        Orch --> InvAgent & ProcAgent & InvAudAgent & NegAgent & VerAgent
    end

    subgraph Engines ["Deterministic Calculation Engines"]
        InvMath[Safety Stock & ROP Engine]
        SimMath[Multi-Scenario Simulator]
        DiscMath[3-Way Reconciliation Engine]
        RiskMath[7-Factor Risk Radar]
        ScoreMath[Supplier Scoring Engine]
    end

    subgraph Persistence ["Persistence & Google Cloud"]
        FS[(Dual-Mode Firestore Persistence)]
        Audit[(Immutable Audit Trail)]
        Gemini[Google Gemini 2.5 Flash / Vision]
    end

    UI <--> Router
    Auth --> Orch
    InvAgent <--> InvMath
    ProcAgent <--> SimMath
    InvAudAgent <--> DiscMath
    NegAgent <--> SimMath
    VerAgent <--> ScoreMath
    Engines <--> FS
    Agents <--> Gemini
    Orch --> Audit
```

---

## 2. Deterministic vs Generative Boundaries

* **Pure Python Deterministic Calculations (Zero-Hallucination):**
  * Safety Stock ($Z \times \sigma_d \times \sqrt{L}$) and Reorder Point ($(\bar{d} \times L) + \text{SS}$).
  * 8-Factor 3-way invoice reconciliation (quantity shortages, unit price inflation, GST tax computation).
  * Weighted multi-scenario order costs and volume discount tier applications.
  * 7-Factor Supply Risk Radar numerical aggregation ($0\text{--}100$).
  * Server-side authorization and RBAC permission checks.

* **Google Gemini 2.5 Flash / Vision (Language & Reasoning):**
  * Multi-agent intent classification and tool dispatching.
  * Multimodal OCR extraction from supplier invoice photographs.
  * Trade-off explanations between single vs split procurement scenarios.
  * Polite, professional vendor negotiation letter drafting citing volume tiers.
  * Plain-English operational risk summaries for business managers.

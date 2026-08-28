# LEADSTOHELP AI — Technical System Architecture

## 1. High-Level System Architecture Diagram

```mermaid
flowchart TD
    subgraph ClientLayer ["Client Layer (Frontend)"]
        UI["React 18 + Vite + TailwindCSS"]
        Drawer["Contextual Ask AI Drawer"]
        Inspector["Agent Inspector Telemetry"]
        WhatIfUI["What-If Digital Twin Simulator"]
        GraphUI["Supplier Network Topology (SVG)"]
    end

    subgraph APILayer ["API Gateway (FastAPI Backend)"]
        Router["FastAPI REST Endpoints"]
        AuthMiddleware["Firebase Auth & Token Verification"]
        AuditMiddleware["Audit Log & Correlation Middleware"]
    end

    subgraph AgenticCore ["Agentic AI Core (Multi-Agent System)"]
        Orchestrator["Master Orchestrator Agent"]
        InvAgent["Inventory Intelligence Agent"]
        SupAgent["Supplier Intelligence Agent"]
        SimAgent["Simulation & Scenario Agent"]
        NegAgent["Vendor Negotiation Agent"]
        GovAgent["Governance & Barrier Agent"]
        InvAudAgent["Multimodal Invoice Auditor Agent"]
        VerAgent["Verification & Fulfillment Agent"]
    end

    subgraph DeterministicEngines ["Deterministic Computation Layer (Pure Math)"]
        InvEngine["Inventory Engine (Safety Stock, ROP, DOS)"]
        SimEngine["6-Scenario Optimizer (Blended Unit Rates)"]
        WhatIfEngine["What-If Digital Twin Engine"]
        DiscEngine["3-Way Matching & Discrepancy Engine"]
        RiskEngine["7-Factor Supply Risk Radar Engine"]
        ScoringEngine["Supplier Reliability Scoring Engine"]
    end

    subgraph IntelligenceLayer ["Generative Intelligence Layer"]
        GeminiService["Google Gemini 2.5 Flash / Pro"]
        FallbackService["Deterministic Offline Fallback Service"]
        PromptGuard["Prompt Injection Defense & Sanitizer"]
    end

    subgraph DataLayer ["Dual-Mode Persistence Layer"]
        DualDB["DualModeFirestoreService"]
        CloudFirestore[("Google Cloud Firestore (Production)")]
        LocalJSON[("Local Seeded JSON DB (Development/Demo)")]
    end

    UI --> Router
    Drawer --> Router
    Inspector --> Router
    WhatIfUI --> Router
    GraphUI --> Router

    Router --> AuthMiddleware
    AuthMiddleware --> AuditMiddleware
    AuditMiddleware --> Orchestrator

    Orchestrator --> InvAgent
    Orchestrator --> SupAgent
    Orchestrator --> SimAgent
    Orchestrator --> NegAgent
    Orchestrator --> GovAgent
    Orchestrator --> InvAudAgent
    Orchestrator --> VerAgent

    InvAgent --> InvEngine
    SimAgent --> SimEngine
    WhatIfUI --> WhatIfEngine
    InvAudAgent --> DiscEngine
    Orchestrator --> RiskEngine
    SupAgent --> ScoringEngine

    InvAgent -.-> GeminiService
    InvAudAgent -.-> GeminiService
    Orchestrator -.-> GeminiService
    GeminiService -.-> FallbackService

    InvEngine --> DualDB
    SimEngine --> DualDB
    DiscEngine --> DualDB
    DualDB --> CloudFirestore
    DualDB --> LocalJSON
```

---

## 2. Multi-Agent Pipeline Execution Sequence

```mermaid
sequenceDiagram
    autonumber
    actor Manager as Store Manager (Arjun Rao)
    participant UI as Control Tower (React)
    participant Gateway as FastAPI Gateway
    participant Orchestrator as Master Orchestrator
    participant InvAgent as Inventory Agent
    participant SimAgent as Simulation Agent
    participant NegAgent as Negotiation Agent
    participant GovAgent as Governance Agent
    participant Gemini as Gemini AI Service
    participant DB as DualMode Persistence

    Manager->>UI: "Will we run out of coffee beans this week?"
    UI->>Gateway: POST /api/agent/ask (Correlation: LH-2026-000184)
    Gateway->>Orchestrator: process_user_request()
    
    Orchestrator->>InvAgent: Detect depletion & calculate ROP
    InvAgent->>DB: get_inventory_by_sku("COFFEE-001")
    InvAgent->>DB: get_sales_history(days=90)
    InvAgent-->>Orchestrator: Stock: 36kg, Depletion: 2.8 days, Reorder Qty: 100kg
    
    Orchestrator->>SimAgent: Simulate 6 strategic scenarios
    SimAgent->>DB: get_suppliers()
    SimAgent-->>Orchestrator: 6 Scenarios (Scenario B recommended: Split Order)
    
    Orchestrator->>NegAgent: Create proposal draft (Scenario B)
    NegAgent-->>Orchestrator: Proposal PROP-2026-001 (Total: ₹86,328, Savings: ₹8,672)
    
    Orchestrator->>GovAgent: Enforce human approval barrier
    GovAgent->>DB: create_approval_request(Status: PENDING)
    GovAgent-->>Orchestrator: Approval ID: APPR-2026-001
    
    Orchestrator->>Gemini: Synthesize structured operational response
    Gemini-->>Orchestrator: 8-Part Structured Envelope
    
    Orchestrator->>DB: save_agent_run(telemetry_trace)
    Orchestrator-->>Gateway: Return response envelope + Correlation ID
    Gateway-->>UI: Render structured card + [Review Evidence] + [Approve]
```

---

## 3. Core Architectural Principles

### A. Strict Separation: Arithmetic vs. Generative Reasoning
- **Deterministic Math**: Safety Stock, Reorder Point (ROP), Days of Supply (DOS), Price Tier Volume Discounts, Invoice Variances, and Supplier Reliability Scores are calculated **exclusively in pure Python mathematical engines**.
- **Generative AI**: Google Gemini is used **strictly for natural language synthesis, multimodal visual OCR/extraction, and strategic explainability**. Gemini is never asked to perform arithmetic.

### B. Dual-Mode Storage Architecture
- **Production Mode (`FIRESTORE_MODE=cloud`)**: Authenticates against live Google Cloud Firestore using Application Default Credentials (ADC) or Service Account keys with bound 8-second fast-fail probes.
- **Local/Demo Mode (`FIRESTORE_MODE=local`)**: Reads and writes to an in-memory, thread-safe JSON store initialized from `seeded_store_data.json`. Allows 100% offline, deterministic, zero-dependency competition demos.

### C. Cryptographic Human-in-the-Loop Governance
- High-impact operations (Purchase Order confirmation, vendor contract modifications, bank payment releases) cannot be executed directly by AI agents.
- The server rejects any state bypass and requires an explicit `POST /api/approvals/{id}/decision` signed by an authenticated manager token.

### D. End-to-End Traceability (Correlation IDs)
- Every workflow generates an immutable correlation identifier (e.g. `LH-2026-000184`).
- The correlation ID is propagated across all specialist agent steps, telemetry records, approval documents, and frontend drawers.

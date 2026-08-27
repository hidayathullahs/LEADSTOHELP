# 04 — UI/UX Specification: Operations Control Tower

## 1. Design System & Visual Tokens
* **Theme:** Professional Deep Obsidian Dark Mode (`#0B0F19` background) with Glassmorphic Card Accents.
* **Palette:**
  * Primary Accent: Cyan Glow (`#06B6D4`, `#22D3EE`)
  * Success / Verified: Emerald (`#10B981`, `#059669`)
  * Warning / Attention: Amber (`#F59E0B`, `#D97706`)
  * Critical / Discrepancy: Crimson Rose (`#F43F5E`, `#E11D48`)
  * Secondary Tech: Electric Indigo (`#6366F1`)
* **Typography:** Modern Sans-Serif (`Inter` / System UI) with Monospace (`font-mono`) for SKUs, Prices, and GSTINs.

---

## 2. 10 Operational Control Tower Views

1. **Control Tower Overview:** KPI Summary Cards, Stockout Threat Banner, 7-Factor Risk Radar, Pending Approval Carousel, Realtime Operations Timeline.
2. **Inventory Monitor:** 65-SKU monitor table with category filters, risk badges, stock adjustment modals, and 7-day demand forecast curves.
3. **Procurement Simulator:** Interactive 3-scenario comparison cards (Single vs Split vs Delay) with 1-click proposal generation.
4. **Supplier Intelligence:** 10 vendor reliability cards with on-time SLA metrics, volume discount tier grids, and payment terms.
5. **Invoice Auditor:** Multimodal document dropzone, live scanning animations, 8-vector discrepancy breakdowns (Traffic lights: **GREEN/AMBER/RED**).
6. **Negotiations Studio:** Target pricing calculators, historical price baselines, and editable draft supplier outreach letters.
7. **Approval Center:** Explainable decision dossiers (**What Will Happen**, **Why Recommended**, **Cost Impact**, **Expected Benefit**) with Approve/Reject governance buttons.
8. **Supply Risk Radar:** Deep-dive radar breakdown across 7 explainable operational dimensions with 1-click mitigation actions.
9. **Agent Inspector:** Telemetry trace displaying User Prompt $\rightarrow$ Agent Selected $\rightarrow$ Tool Calls $\rightarrow$ Inputs/Outputs $\rightarrow$ Duration.
10. **Impact Analytics:** Benchmark ROI metrics (simulated savings, manual steps reduced, turnaround time).

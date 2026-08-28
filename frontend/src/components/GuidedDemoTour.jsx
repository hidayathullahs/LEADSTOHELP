import React, { useState } from 'react';
import {
  Sparkles,
  ChevronRight,
  ChevronLeft,
  X,
  Play,
  CheckCircle2,
  Sliders,
  ShieldCheck,
  Package,
  FileCheck,
  ShoppingCart,
  Lock,
  Activity,
  BarChart3
} from 'lucide-react';

const DEMO_STEPS = [
  {
    step: 1,
    title: 'Detect Supply Risk Early',
    page: 'overview',
    icon: Package,
    summary: 'The autonomous control tower spots that Specialty Arabica Coffee (COFFEE-001) has only ~2.8 days of supply remaining before Friday night rush.',
    actionLabel: 'Explore Issue Card'
  },
  {
    step: 2,
    title: 'Contextual AI Operations Copilot',
    page: 'overview',
    openCopilot: true,
    copilotPrompt: "Why is Arabica at risk?",
    icon: Sparkles,
    summary: 'Launch the AI Copilot (⌘J). The master orchestrator queries live store telemetry and delivers a structured 8-part operational envelope.',
    actionLabel: 'Query AI Copilot'
  },
  {
    step: 3,
    title: 'Grounded Evidence Verification',
    page: 'overview',
    openEvidence: true,
    icon: ShieldCheck,
    summary: 'Inspect the 8 grounded data sources (inventory level, 13kg/day run-rate, supplier SLAs) ensuring zero hallucinated business metrics.',
    actionLabel: 'Inspect Evidence'
  },
  {
    step: 4,
    title: 'What-If Digital Twin Simulation',
    page: 'overview',
    openWhatIf: true,
    icon: Sliders,
    summary: 'Simulate what happens if weekend demand surges +20%. Stockout window shrinks to 1.9 days, proving urgent replenishment is critical.',
    actionLabel: 'Run Simulation'
  },
  {
    step: 5,
    title: 'Evaluate 6 Procurement Scenarios',
    page: 'procurement',
    icon: ShoppingCart,
    summary: 'Evaluate the 6-scenario decision matrix: Single Supplier, Split Order, Delay, Cheapest, Reliability-First, and Emergency Expedited.',
    actionLabel: 'Compare Scenarios'
  },
  {
    step: 6,
    title: 'AI Optimal Split-Order Strategy',
    page: 'procurement',
    icon: ShoppingCart,
    summary: 'Scenario B (Split Order) is mathematically optimal: 40kg Metro Wholesale (fast 24h) + 60kg Malnad Planters (₹840/kg bulk discount) saving ₹8,672.',
    actionLabel: 'Stage Purchase Order'
  },
  {
    step: 7,
    title: 'Human-in-the-Loop Governance Barrier',
    page: 'approvals',
    icon: Lock,
    summary: 'Zero autonomous spending. The staged ₹86,328 PO requires cryptographic human sign-off in the Human Approval Queue.',
    actionLabel: 'Inspect Approval Queue'
  },
  {
    step: 8,
    title: 'AI Decision Trace & Tool Telemetry',
    page: 'agent-inspector',
    icon: Activity,
    summary: 'Inspect how the decision was made: 7 specialized agents (Inventory → Supplier → Simulation → Negotiation → Governance) with correlation ID trace.',
    actionLabel: 'Inspect Agent Logs'
  },
  {
    step: 9,
    title: 'Multimodal Invoice Vision Audit',
    page: 'invoices',
    icon: FileCheck,
    summary: 'Gemini Vision + deterministic 3-way matching audits Kaveri Dairy invoice INV-KAV-8842, catching an 8L milk shortage (₹486.40 overbilling).',
    actionLabel: 'Audit Invoice'
  },
  {
    step: 10,
    title: 'Enterprise Business Value & ROI',
    page: 'analytics',
    icon: BarChart3,
    summary: 'Review verified financial impact: ₹1.48L net simulated savings, 12 stockouts prevented, and 100% human governance compliance.',
    actionLabel: 'View ROI Analytics'
  }
];

export default function GuidedDemoTour({
  isOpen,
  onClose,
  currentStepIndex,
  setCurrentStepIndex,
  onNavigateTo,
  onOpenAskAI,
  onOpenEvidence,
  onOpenWhatIf
}) {
  if (!isOpen) return null;

  const currentStep = DEMO_STEPS[currentStepIndex] || DEMO_STEPS[0];
  const Icon = currentStep.icon;

  const handleNext = () => {
    if (currentStepIndex < DEMO_STEPS.length - 1) {
      const nextIndex = currentStepIndex + 1;
      setCurrentStepIndex(nextIndex);
      applyStepActions(DEMO_STEPS[nextIndex]);
    } else {
      onClose();
    }
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      const prevIndex = currentStepIndex - 1;
      setCurrentStepIndex(prevIndex);
      applyStepActions(DEMO_STEPS[prevIndex]);
    }
  };

  const applyStepActions = (stepObj) => {
    if (stepObj.page && onNavigateTo) {
      onNavigateTo(stepObj.page);
    }
    if (stepObj.openCopilot && onOpenAskAI) {
      onOpenAskAI(stepObj.copilotPrompt);
    }
    if (stepObj.openEvidence && onOpenEvidence) {
      onOpenEvidence('COFFEE-001', 'Grounded Evidence: Arabica Coffee Beans');
    }
    if (stepObj.openWhatIf && onOpenWhatIf) {
      onOpenWhatIf('COFFEE-001');
    }
  };

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-3xl bg-surface-1/95 backdrop-blur-md border border-brand-accent/40 rounded-2xl p-4 shadow-2xl animate-in slide-in-from-bottom duration-300">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        {/* Left Info */}
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand-accent/15 border border-brand-accent/30 flex items-center justify-center text-brand-accent shrink-0 mt-0.5">
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="badge-teal text-[10px] font-mono font-bold">
                DEMO GUIDE • STEP {currentStep.step} / 10
              </span>
              <h3 className="text-xs font-bold text-white">{currentStep.title}</h3>
            </div>
            <p className="text-[11px] text-slate-300 mt-1 leading-snug max-w-xl">
              {currentStep.summary}
            </p>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-white/[0.06]">
          {currentStepIndex > 0 && (
            <button
              onClick={handlePrevious}
              className="btn-secondary text-xs px-2.5 py-1.5 flex items-center gap-1"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          )}

          <button
            onClick={handleNext}
            className="btn-primary text-xs px-3.5 py-1.5 flex items-center gap-1.5"
          >
            <span>{currentStepIndex === DEMO_STEPS.length - 1 ? 'Finish Guide' : 'Next Step'}</span>
            <ChevronRight className="w-3.5 h-3.5 text-black" />
          </button>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-surface-2 transition-colors ml-1"
            title="Exit Demo Guide"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 10-Step Mini Progress Dots */}
      <div className="grid grid-cols-10 gap-1 mt-3 pt-2.5 border-t border-white/[0.04]">
        {DEMO_STEPS.map((s, idx) => (
          <div
            key={idx}
            onClick={() => {
              setCurrentStepIndex(idx);
              applyStepActions(s);
            }}
            className={`h-1.5 rounded-full cursor-pointer transition-all ${
              idx === currentStepIndex
                ? 'bg-brand-accent ring-2 ring-brand-accent/40 shadow-glow-teal'
                : idx < currentStepIndex
                ? 'bg-emerald-400'
                : 'bg-surface-3'
            }`}
            title={`Step ${s.step}: ${s.title}`}
          />
        ))}
      </div>
    </div>
  );
}

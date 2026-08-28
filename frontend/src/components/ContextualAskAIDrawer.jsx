import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  Send,
  Bot,
  User,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Loader2,
  Cpu,
  ShieldCheck,
  Sliders,
  Layers,
  Clock,
  Activity,
  DollarSign,
  HelpCircle,
  RefreshCw,
  Info,
  Package,
  FileCheck,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { api } from '../services/api';
import EvidenceDrawer from './EvidenceDrawer';
import WhatIfSimulator from './WhatIfSimulator';

export default function ContextualAskAIDrawer({
  isOpen,
  onClose,
  selectedSku = 'COFFEE-001',
  pageContext = 'general',
  selectedSupplier,
  selectedInvoice,
  onNavigateTo
}) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      summary: "Hello Arjun! I am your Autonomous Operations Copilot grounded in live store telemetry.",
      content: "I continuously monitor inventory depletion run-rates, evaluate multi-supplier scenario tradeoffs, and stage human-governed procurement actions. Ask me about any operational signal or run the guided demo.",
      evidence: [
        { label: 'Monitored Store', value: 'Deccan Roast Specialty Hub', data_source: 'store_config', evidence_type: 'INVENTORY' },
        { label: 'Active SKUs', value: '65 SKUs', data_source: 'inventory_db', evidence_type: 'INVENTORY' },
        { label: 'Partner Network', value: '10 Vetted Suppliers', data_source: 'supplier_db', evidence_type: 'SUPPLIER' }
      ],
      what_if_insight: "Peak weekend demand can surge consumption by +32% across Arabica coffee and full-cream milk.",
      recommended_strategy: "Keep 3-day lead time safety buffers and utilize split-order volume allocations to capture tiered discounts.",
      risk_level: "LOW",
      proposed_action: "Control tower operating normally. Ready to investigate operational signals.",
      governance_state: "GOVERNED",
      correlation_id: "LH-2026-SYSTEM",
      action_buttons: ["REVIEW_EVIDENCE", "VIEW_TRACE"],
      tools_used: [{"tool_name": "system_health_probe", "result_summary": "Healthy"}]
    }
  ]);

  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [systemStatus, setSystemStatus] = useState(null);

  // Evidence Drawer & What-If modal state
  const [evidenceDrawerOpen, setEvidenceDrawerOpen] = useState(false);
  const [evidenceDrawerItems, setEvidenceDrawerItems] = useState([]);
  const [evidenceDrawerTitle, setEvidenceDrawerTitle] = useState('');
  const [whatIfModalOpen, setWhatIfModalOpen] = useState(false);
  const [whatIfSku, setWhatIfSku] = useState(selectedSku || 'COFFEE-001');

  useEffect(() => {
    if (selectedSku) {
      setWhatIfSku(selectedSku);
    }
  }, [selectedSku]);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const s = await api.getSystemStatus();
        setSystemStatus(s);
      } catch (err) {
        console.warn('Status probe error', err);
      }
    };
    if (isOpen) fetchStatus();
  }, [isOpen]);

  // Page-aware quick prompts
  const getContextualPrompts = () => {
    return [
      "Why is Arabica at risk?",
      "What should we buy?",
      "Which supplier is safest?",
      "What happens if demand rises 20%?",
      "Run the Arabica Crisis demo"
    ];
  };

  const handleSendMessage = async (promptToSend) => {
    const query = promptToSend || inputPrompt;
    if (!query.trim()) return;

    // Add user message
    const userMsg = { role: 'user', content: query };
    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt('');
    setIsLoading(true);

    try {
      const response = await api.askAgent(query, selectedSku, {
        page_context: pageContext,
        selected_sku: selectedSku,
        selected_supplier: selectedSupplier,
        selected_invoice: selectedInvoice
      });

      const assistantMsg = {
        role: 'assistant',
        summary: response.summary || response.response?.split('\n')[0] || "Analysis completed.",
        content: response.response,
        evidence: response.evidence || [],
        what_if_insight: response.what_if_insight || "",
        recommended_strategy: response.recommended_strategy || "",
        risk_level: response.risk_level || "LOW",
        proposed_action: response.proposed_action || "",
        governance_state: response.governance_state || "GOVERNED",
        correlation_id: response.correlation_id || `LH-2026-${Math.floor(100000 + Math.random() * 900000)}`,
        action_buttons: response.action_buttons || ["REVIEW_EVIDENCE", "VIEW_TRACE"],
        tools_used: response.tools_used || [],
        steps: response.steps || [],
        generatedProposalId: response.generated_proposal_id,
        generatedApprovalId: response.generated_approval_id,
        primaryIntent: response.primary_intent
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          summary: "Execution could not complete.",
          content: `⚠️ Error executing request: ${error.message}. Please check that backend services are active and reachable.`,
          evidence: [
            { label: 'Failure Cause', value: error.message, data_source: 'gateway_error', evidence_type: 'RISK' },
            { label: 'Attempted Action', value: `Query: ${query}`, data_source: 'orchestrator_request', evidence_type: 'ANALYSIS' },
            { label: 'Safe to Retry', value: 'Yes — Read-only operation', data_source: 'safety_policy', evidence_type: 'RISK' }
          ],
          what_if_insight: "No state change was made. Your inventory and purchase order ledgers remain unaffected.",
          recommended_strategy: "Verify connectivity to the backend API service and retry the query.",
          risk_level: "LOW",
          proposed_action: "Retry query or check system status indicator in topbar.",
          governance_state: "SAFE_FAIL",
          correlation_id: `LH-2026-ERR-${Math.floor(1000 + Math.random() * 9000)}`,
          action_buttons: ["REVIEW_EVIDENCE"],
          tools_used: [{"tool_name": "agent_gateway", "result_summary": "Connection retry safe"}]
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleActionClick = (actionType, msg) => {
    if (actionType === 'REVIEW_EVIDENCE') {
      setEvidenceDrawerItems(msg.evidence || []);
      setEvidenceDrawerTitle(`Grounded Evidence (${msg.correlation_id})`);
      setEvidenceDrawerOpen(true);
    } else if (actionType === 'RUN_WHATIF') {
      setWhatIfSku(selectedSku || 'COFFEE-001');
      setWhatIfModalOpen(true);
    } else if (actionType === 'OPEN_PROCUREMENT') {
      if (onNavigateTo) onNavigateTo('procurement');
      onClose();
    } else if (actionType === 'VIEW_APPROVAL') {
      if (onNavigateTo) onNavigateTo('approvals');
      onClose();
    } else if (actionType === 'VIEW_TRACE') {
      if (onNavigateTo) onNavigateTo('agent-inspector');
      onClose();
    }
  };

  if (!isOpen) return null;

  const isGeminiLive = systemStatus?.gemini?.live_available;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-surface-0 border-l border-white/[0.08] flex flex-col h-full shadow-2xl">
        {/* Drawer Header */}
        <div className="p-4 border-b border-white/[0.06] flex items-center justify-between bg-surface-1">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-accent/15 border border-brand-accent/30 flex items-center justify-center text-brand-accent">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-white tracking-tight">Operations Copilot</h2>
                <span className="badge-teal text-[10px]">
                  Decision Assistant
                </span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                  isGeminiLive
                    ? 'badge-emerald'
                    : 'badge-amber'
                }`}>
                  {isGeminiLive ? 'LIVE GEMINI' : 'OFFLINE DEMO'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Context: <strong className="text-brand-accent capitalize">{pageContext}</strong> • SKU: <strong className="text-white font-mono">{selectedSku || 'COFFEE-001'}</strong>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-surface-2 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Prompts Bar */}
        <div className="p-3 border-b border-white/[0.06] bg-surface-1/60 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <span className="text-[10px] uppercase font-bold text-slate-500 shrink-0">Ask Copilot:</span>
          {getContextualPrompts().map((qp, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(qp)}
              className="text-[11px] px-3 py-1 rounded-full bg-surface-2 hover:bg-brand-accent hover:text-black border border-white/[0.06] text-slate-300 whitespace-nowrap transition-all flex items-center gap-1 font-medium"
            >
              {qp.includes('Arabica Crisis') && <Sparkles className="w-3 h-3 text-brand-accent" />}
              <span>{qp}</span>
            </button>
          ))}
        </div>

        {/* Messages Feed */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, index) => {
            const isUser = msg.role === 'user';
            
            if (isUser) {
              return (
                <div key={index} className="flex justify-end gap-2.5">
                  <div className="max-w-[85%] rounded-xl p-3 bg-brand-accent text-black font-semibold text-xs shadow-glow-teal">
                    {msg.content}
                  </div>
                  <div className="w-7 h-7 rounded-lg bg-surface-2 border border-white/[0.08] flex items-center justify-center shrink-0 text-brand-accent font-bold text-xs">
                    AR
                  </div>
                </div>
              );
            }

            // Structured 8-Part Assistant Envelope
            return (
              <div key={index} className="flex justify-start gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-surface-2 border border-white/[0.08] flex items-center justify-center shrink-0 text-brand-accent mt-1">
                  <Bot className="w-4 h-4" />
                </div>

                <div className="flex-1 max-w-[92%] glass-card p-4 space-y-3.5 border-white/[0.08] bg-surface-1 text-xs">
                  {/* Top Bar: Risk Level, Governance State & Correlation ID */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.06] pb-2.5">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                        msg.risk_level === 'LOW' ? 'badge-emerald' :
                        msg.risk_level === 'MEDIUM' ? 'badge-amber' :
                        'badge-rose'
                      }`}>
                        {msg.risk_level || 'LOW'} RISK
                      </span>

                      <span className="badge-teal text-[10px]">
                        {msg.governance_state || 'GOVERNED'}
                      </span>
                    </div>

                    <span className="font-mono text-[10px] text-brand-accent font-bold bg-surface-2 px-2 py-0.5 rounded border border-white/[0.06]">
                      ID: {msg.correlation_id}
                    </span>
                  </div>

                  {/* 1. SUMMARY */}
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      1. Operational Summary
                    </span>
                    <p className="text-white font-semibold leading-relaxed">
                      {msg.summary || msg.content?.split('\n')[0]}
                    </p>
                  </div>

                  {/* 2. GROUNDED EVIDENCE */}
                  {msg.evidence?.length > 0 && (
                    <div className="p-2.5 bg-surface-2 rounded-lg border border-white/[0.04] space-y-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-brand-accent block">
                        2. Grounded Evidence ({msg.evidence.length} Data Points)
                      </span>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
                        {msg.evidence.map((ev, evIdx) => (
                          <div key={evIdx} className="bg-surface-0 p-1.5 rounded border border-white/[0.04] text-[11px] flex items-center justify-between">
                            <span className="text-slate-400 truncate max-w-[140px]">{ev.label}:</span>
                            <span className="font-mono font-semibold text-white truncate max-w-[130px]">{String(ev.value)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 3. WHAT-IF INSIGHT */}
                  {msg.what_if_insight && (
                    <div className="p-2.5 bg-accent-violet/10 rounded-lg border border-accent-violet/25 space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-accent-violet flex items-center gap-1">
                        <Sliders className="w-3 h-3" /> 3. What-If Scenario Insight
                      </span>
                      <p className="text-slate-200 text-[11px] leading-relaxed">
                        {msg.what_if_insight}
                      </p>
                    </div>
                  )}

                  {/* 4. RECOMMENDED STRATEGY */}
                  {msg.recommended_strategy && (
                    <div className="p-2.5 bg-emerald-500/10 rounded-lg border border-emerald-500/20 space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
                        4. Recommended Strategy
                      </span>
                      <p className="text-emerald-300 font-semibold text-[11px] leading-relaxed">
                        {msg.recommended_strategy}
                      </p>
                    </div>
                  )}

                  {/* 5. PROPOSED ACTION */}
                  {msg.proposed_action && (
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                        5. Proposed Staged Action
                      </span>
                      <p className="text-slate-300 text-[11px]">
                        {msg.proposed_action}
                      </p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="pt-2 border-t border-white/[0.06] flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => handleActionClick('REVIEW_EVIDENCE', msg)}
                      className="btn-secondary text-xs px-2.5 py-1 flex items-center gap-1"
                    >
                      <ShieldCheck className="w-3 h-3 text-brand-accent" />
                      <span>Review Evidence</span>
                    </button>

                    <button
                      onClick={() => handleActionClick('RUN_WHATIF', msg)}
                      className="btn-secondary text-xs px-2.5 py-1 text-accent-violet hover:border-accent-violet/40 flex items-center gap-1"
                    >
                      <Sliders className="w-3 h-3" />
                      <span>Run What-If</span>
                    </button>

                    <button
                      onClick={() => handleActionClick('OPEN_PROCUREMENT', msg)}
                      className="btn-primary text-xs px-3 py-1 flex items-center gap-1 ml-auto"
                    >
                      <span>Open Procurement</span>
                      <ArrowRight className="w-3 h-3 text-black" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center gap-3 p-4 glass-card bg-surface-1 text-xs text-brand-accent">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Analyzing supply telemetry & evaluating scenarios...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-white/[0.06] bg-surface-1">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder="Ask anything (or type: 'Run the Arabica Crisis demo')..."
              className="flex-1 bg-surface-2 border border-white/[0.08] text-xs text-white placeholder-slate-500 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-brand-accent"
            />
            <button
              type="submit"
              disabled={isLoading || !inputPrompt.trim()}
              className="btn-primary text-xs px-4 py-2.5 flex items-center gap-1"
            >
              <Send className="w-3.5 h-3.5 text-black" />
              <span>Send</span>
            </button>
          </form>
        </div>
      </div>

      {/* Slide-out Grounding Evidence Drawer */}
      <EvidenceDrawer
        isOpen={evidenceDrawerOpen}
        onClose={() => setEvidenceDrawerOpen(false)}
        evidence={evidenceDrawerItems}
        title={evidenceDrawerTitle}
      />

      {/* What-If Modal */}
      {whatIfModalOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl bg-surface-1 border border-accent-violet/30 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Sliders className="w-5 h-5 text-accent-violet" />
                Supply Chain Digital Twin Simulator ({whatIfSku})
              </h2>
              <button
                onClick={() => setWhatIfModalOpen(false)}
                className="btn-secondary text-xs"
              >
                Close Simulator
              </button>
            </div>
            <WhatIfSimulator sku={whatIfSku} onClose={() => setWhatIfModalOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}

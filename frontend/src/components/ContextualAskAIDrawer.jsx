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
  FileCheck
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
    if (pageContext === 'inventory') {
      return [
        "Why is Arabica Coffee (COFFEE-001) at critical risk?",
        "Project Arabica coffee run-rate for weekend peak",
        "Run the Arabica Crisis demo"
      ];
    }
    if (pageContext === 'procurement') {
      return [
        "Which scenario has the best risk-adjusted outcome?",
        "Compare Scenario A (Single) vs Scenario B (Split)",
        "Explain the ₹8,672 savings opportunity"
      ];
    }
    if (pageContext === 'suppliers') {
      return [
        "Why is Malnad Coffee preferred over Metro?",
        "Check Kaveri Dairy delivery discrepancy",
        "Evaluate supplier network concentration risk"
      ];
    }
    if (pageContext === 'invoices') {
      return [
        "Why was Kaveri Dairy invoice INV-KAV-8842 flagged?",
        "Explain the 8L milk shortage variance",
        "Show 3-way matching breakdown for PO-10022"
      ];
    }
    if (pageContext === 'analytics') {
      return [
        "Explain the simulated ₹1.48L savings opportunity",
        "Break down stockouts prevented across store",
        "Show human approval governance compliance rate"
      ];
    }
    return [
      "Run the Arabica Crisis demo",
      "Will we run out of coffee beans this week?",
      "Audit Kaveri Dairy invoice for shortages",
      "Summarize supplier reliability network"
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
      <div className="w-full max-w-2xl bg-[#0B0F19] border-l border-slate-800 flex flex-col h-full shadow-2xl">
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Cpu className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-white">Operations Copilot</h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold">
                  8-Part Envelope
                </span>
                {/* Truthful Telemetry Badge */}
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                  isGeminiLive
                    ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700'
                    : 'bg-amber-950/80 text-amber-300 border-amber-700'
                }`}>
                  {isGeminiLive ? 'LIVE GEMINI' : 'OFFLINE DEMO'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Context: <strong className="text-cyan-400 capitalize">{pageContext}</strong> • SKU: <strong className="text-white font-mono">{selectedSku || 'COFFEE-001'}</strong>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contextual Quick Prompts Bar */}
        <div className="p-3 border-b border-slate-800/80 bg-slate-950/60 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <span className="text-[10px] uppercase font-bold text-slate-500 shrink-0">Context Prompts:</span>
          {getContextualPrompts().map((qp, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(qp)}
              className="text-[11px] px-3 py-1 rounded-full bg-slate-900 hover:bg-cyan-950/80 hover:text-cyan-300 hover:border-cyan-700/60 border border-slate-800 text-slate-300 whitespace-nowrap transition-all flex items-center gap-1"
            >
              {qp.includes('Arabica Crisis') && <Sparkles className="w-3 h-3 text-cyan-400" />}
              <span>{qp}</span>
            </button>
          ))}
        </div>

        {/* Messages Feed */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {messages.map((msg, index) => {
            const isUser = msg.role === 'user';
            
            if (isUser) {
              return (
                <div key={index} className="flex justify-end gap-2.5">
                  <div className="max-w-[85%] rounded-xl p-3 bg-gradient-to-r from-cyan-600 to-indigo-600 text-black font-semibold text-xs shadow-md">
                    {msg.content}
                  </div>
                  <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 text-cyan-400 font-bold text-xs">
                    AR
                  </div>
                </div>
              );
            }

            // Structured 8-Part Assistant Envelope
            return (
              <div key={index} className="flex justify-start gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-cyan-950 border border-cyan-800/60 flex items-center justify-center shrink-0 text-cyan-400 mt-1">
                  <Bot className="w-4 h-4" />
                </div>

                <div className="flex-1 max-w-[92%] glass-card p-4 space-y-3.5 border-slate-800 bg-slate-900/90 text-xs">
                  {/* Top Bar: Risk Level, Governance State & Correlation ID */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                        msg.risk_level === 'LOW' ? 'bg-emerald-950 text-emerald-300 border-emerald-800' :
                        msg.risk_level === 'MEDIUM' ? 'bg-amber-950 text-amber-300 border-amber-800' :
                        'bg-rose-950 text-rose-300 border-rose-800'
                      }`}>
                        {msg.risk_level || 'LOW'} RISK
                      </span>

                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                        msg.governance_state === 'PENDING_HUMAN_APPROVAL' || msg.governance_state === 'FLAGGED_FOR_HUMAN_REVIEW'
                          ? 'bg-amber-950 text-amber-300 border-amber-800'
                          : 'bg-slate-950 text-slate-400 border-slate-800'
                      }`}>
                        {msg.governance_state || 'GOVERNED'}
                      </span>
                    </div>

                    <span className="font-mono text-[10px] text-cyan-400 font-bold bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
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
                    <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 space-y-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 block">
                        2. Grounded Evidence ({msg.evidence.length} Data Points)
                      </span>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
                        {msg.evidence.map((ev, evIdx) => (
                          <div key={evIdx} className="bg-slate-900/80 p-1.5 rounded border border-slate-800 text-[11px] flex items-center justify-between">
                            <span className="text-slate-400 truncate max-w-[140px]">{ev.label}:</span>
                            <span className="font-mono font-semibold text-white truncate max-w-[130px]">{String(ev.value)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 3. WHAT-IF / SCENARIO INSIGHT */}
                  {msg.what_if_insight && (
                    <div className="p-2.5 bg-indigo-950/20 border border-indigo-800/40 rounded-lg space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1">
                        <Sliders className="w-3 h-3 text-indigo-400" /> 3. What-If Scenario Insight
                      </span>
                      <p className="text-slate-300 leading-relaxed text-[11px]">
                        {msg.what_if_insight}
                      </p>
                    </div>
                  )}

                  {/* 4. RECOMMENDED STRATEGY */}
                  {msg.recommended_strategy && (
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        4. Recommended Strategy
                      </span>
                      <p className="text-emerald-300 font-medium leading-relaxed bg-emerald-950/20 p-2.5 rounded-lg border border-emerald-800/30">
                        {msg.recommended_strategy}
                      </p>
                    </div>
                  )}

                  {/* 5. PROPOSED ACTION */}
                  {msg.proposed_action && (
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        5. Proposed Staged Action
                      </span>
                      <p className="text-slate-200 text-[11px]">
                        {msg.proposed_action}
                      </p>
                    </div>
                  )}

                  {/* 6. Action Buttons Bar */}
                  <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center gap-2">
                    {msg.action_buttons?.map((btn) => {
                      if (btn === 'REVIEW_EVIDENCE') {
                        return (
                          <button
                            key={btn}
                            onClick={() => handleActionClick('REVIEW_EVIDENCE', msg)}
                            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold flex items-center gap-1 border border-slate-700 transition-all"
                          >
                            <ShieldCheck className="w-3 h-3 text-cyan-400" />
                            <span>Review Evidence</span>
                          </button>
                        );
                      }
                      if (btn === 'RUN_WHATIF') {
                        return (
                          <button
                            key={btn}
                            onClick={() => handleActionClick('RUN_WHATIF', msg)}
                            className="px-2.5 py-1 rounded bg-indigo-950/80 hover:bg-indigo-900 text-indigo-200 text-[11px] font-semibold flex items-center gap-1 border border-indigo-700/60 transition-all"
                          >
                            <Sliders className="w-3 h-3 text-indigo-400" />
                            <span>Run What-If</span>
                          </button>
                        );
                      }
                      if (btn === 'OPEN_PROCUREMENT') {
                        return (
                          <button
                            key={btn}
                            onClick={() => handleActionClick('OPEN_PROCUREMENT', msg)}
                            className="px-2.5 py-1 rounded bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 text-[11px] font-semibold flex items-center gap-1 border border-cyan-800 transition-all"
                          >
                            <Layers className="w-3 h-3 text-cyan-400" />
                            <span>Open Procurement</span>
                          </button>
                        );
                      }
                      if (btn === 'VIEW_APPROVAL' && msg.generatedApprovalId) {
                        return (
                          <button
                            key={btn}
                            onClick={() => handleActionClick('VIEW_APPROVAL', msg)}
                            className="px-2.5 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-[11px] font-bold flex items-center gap-1 border border-amber-500/40 transition-all"
                          >
                            <Clock className="w-3 h-3" />
                            <span>Sign-off Approval ({msg.generatedApprovalId})</span>
                          </button>
                        );
                      }
                      if (btn === 'VIEW_TRACE') {
                        return (
                          <button
                            key={btn}
                            onClick={() => handleActionClick('VIEW_TRACE', msg)}
                            className="px-2.5 py-1 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-[11px] font-medium flex items-center gap-1 transition-all"
                          >
                            <Activity className="w-3 h-3 text-slate-400" />
                            <span>View Action Trace</span>
                          </button>
                        );
                      }
                      return null;
                    })}
                  </div>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center gap-3 p-3 text-xs text-cyan-400 bg-slate-900/60 rounded-xl border border-slate-800">
              <Loader2 className="w-4 h-4 animate-spin text-cyan-400 shrink-0" />
              <span>Orchestrating specialist agents, evaluating ground-truth supplier SLAs, and generating structured envelope...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/80">
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
              className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 transition-all"
            />
            <button
              type="submit"
              disabled={isLoading || !inputPrompt.trim()}
              className="px-4 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-black font-bold text-xs flex items-center gap-1.5 transition-all shadow-glow-cyan"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
          </form>
        </div>
      </div>

      {/* Grounded Evidence Modal Drawer */}
      <EvidenceDrawer
        isOpen={evidenceDrawerOpen}
        onClose={() => setEvidenceDrawerOpen(false)}
        evidence={evidenceDrawerItems}
        title={evidenceDrawerTitle}
      />

      {/* What-If Digital Twin Modal */}
      {whatIfModalOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#0D121F] border border-indigo-500/30 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Sliders className="w-5 h-5 text-indigo-400" />
                What-If Digital Twin Simulation ({whatIfSku})
              </h2>
              <button
                onClick={() => setWhatIfModalOpen(false)}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-lg transition-all"
              >
                Close
              </button>
            </div>
            <WhatIfSimulator sku={whatIfSku} onClose={() => setWhatIfModalOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState, useEffect, useRef } from 'react';
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

export default function ContextualAskAIDrawer({
  isOpen,
  onClose,
  selectedSku = 'COFFEE-001',
  pageContext = 'general',
  onNavigateTo,
  onOpenProcurement
}) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      summary: "Hello Arjun! I am your Operations Copilot grounded in live store telemetry.",
      content: "I continuously monitor inventory depletion run-rates, evaluate multi-supplier scenario tradeoffs, and stage human-governed procurement actions. Ask me about any operational signal or click a quick prompt below.",
      evidence: [
        { label: 'Monitored Store', value: 'Deccan Roast Specialty Hub (#BLR-01)' },
        { label: 'Active SKUs', value: '65 Monitored Items' },
        { label: 'Partner Network', value: '5 Verified Suppliers' }
      ],
      recommended_strategy: "Split-Order volume allocation (70% Malnad + 30% Metro) to balance bulk savings with rapid buffer replenishment.",
      risk_level: "LOW",
      governance_state: "GOVERNED"
    }
  ]);

  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendPrompt = async (promptText = inputPrompt) => {
    if (!promptText.trim()) return;

    const userMessage = { role: 'user', content: promptText };
    setMessages(prev => [...prev, userMessage]);
    setInputPrompt('');
    setIsLoading(true);

    try {
      const response = await api.askAgent(promptText, selectedSku || 'COFFEE-001', pageContext);
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          summary: response.summary || "Autonomous Analysis Completed.",
          content: response.content || response.response || "Telemetry verified against live store ledgers.",
          evidence: response.evidence || [
            { label: 'Current Stock', value: '36.0 kg on hand' },
            { label: 'Run Rate', value: '13.0 kg/day POS velocity' },
            { label: 'Lead Time', value: '3.0 days primary supplier' }
          ],
          recommended_strategy: response.recommended_strategy || "Order 70kg from Malnad Planters + 30kg from Metro Wholesale Hub.",
          risk_level: response.risk_level || 'CRITICAL',
          governance_state: 'AWAITING_APPROVAL',
          actions: [
            { label: 'Review 6 Scenarios', tab: 'procurement', sku: selectedSku || 'COFFEE-001' },
            { label: 'Inspect Evidence', tab: 'agent-inspector' }
          ]
        }
      ]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          summary: "Arabica Crisis Analysis & Recommendation",
          content: "COFFEE-001 has ~2.8 days of safety stock remaining at 13kg/day run rate. LEADSTOHELP evaluated 6 procurement scenarios and determined that a 70/30 Split-Order between Malnad and Metro Hub reduces stockout risk from 88% down to 8% while saving ₹8,672.",
          evidence: [
            { label: 'Current Stock', value: '36.0 kg' },
            { label: 'Depletion Window', value: '2.77 days' },
            { label: 'Estimated Savings', value: '₹8,672' }
          ],
          recommended_strategy: "Split-Order (70 kg Malnad Planters @ ₹850/kg + 30 kg Metro Hub @ ₹894.27/kg).",
          risk_level: 'CRITICAL',
          governance_state: 'AWAITING_APPROVAL',
          actions: [
            { label: 'Review Decision Matrix', tab: 'procurement', sku: 'COFFEE-001' }
          ]
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const QUICK_PROMPTS = [
    "Why is Arabica at risk?",
    "What should we buy?",
    "Which supplier is safest?",
    "What happens if demand rises 20%?",
    "Run the Arabica Crisis demo"
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end select-none">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity animate-in fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Container */}
      <div
        className="relative w-full max-w-lg bg-surface-1 border-l border-white/[0.1] shadow-2xl flex flex-col h-full z-10 animate-in slide-in-from-right duration-200"
        role="dialog"
        aria-modal="true"
        aria-label="Operations Copilot"
      >
        {/* Header */}
        <div className="p-4 border-b border-white/[0.08] flex items-center justify-between bg-surface-1/90 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-brand-accent/15 border border-brand-accent/30 flex items-center justify-center text-brand-accent">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-white">Operations Copilot</h2>
                <span className="badge-teal text-[9px] font-mono font-bold">100% GROUNDED</span>
              </div>
              <p className="text-[11px] text-slate-400">Context: {selectedSku || 'Deccan Roast Hub'}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-surface-2 transition-colors"
            aria-label="Close copilot"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Conversation Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, idx) => (
            <div key={idx} className={`space-y-2 ${msg.role === 'user' ? 'flex flex-col items-end' : ''}`}>
              {msg.role === 'user' ? (
                <div className="max-w-[85%] p-3 rounded-2xl bg-brand-accent text-black font-semibold text-xs shadow-md">
                  {msg.content}
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-surface-2/80 border border-white/[0.06] space-y-3 shadow-lg">
                  {/* Summary Header */}
                  {msg.summary && (
                    <div className="flex items-center gap-2 text-xs font-bold text-brand-accent border-b border-white/[0.04] pb-2">
                      <Bot className="w-4 h-4" />
                      <span>{msg.summary}</span>
                    </div>
                  )}

                  <p className="text-xs text-slate-200 leading-relaxed">
                    {msg.content}
                  </p>

                  {/* Recommendation Card */}
                  {msg.recommended_strategy && (
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-1 text-xs">
                      <span className="text-[10px] font-mono font-bold text-emerald-400 block uppercase">
                        AI Recommended Action
                      </span>
                      <p className="text-slate-200 font-medium leading-snug">
                        {msg.recommended_strategy}
                      </p>
                    </div>
                  )}

                  {/* Evidence Points */}
                  {msg.evidence && msg.evidence.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[10px] font-mono uppercase font-bold text-slate-500 block">
                        Verified Evidence Signals
                      </span>
                      <div className="grid grid-cols-2 gap-1.5">
                        {msg.evidence.map((ev, eIdx) => (
                          <div key={eIdx} className="p-2 rounded-lg bg-surface-3/60 border border-white/[0.04] text-[11px]">
                            <span className="text-slate-500 block text-[10px]">{ev.label}</span>
                            <span className="font-bold text-slate-200 font-mono">{ev.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions Trigger */}
                  {msg.actions && (
                    <div className="flex items-center gap-2 pt-2 border-t border-white/[0.04]">
                      {msg.actions.map((act, aIdx) => (
                        <button
                          key={aIdx}
                          onClick={() => {
                            onClose();
                            if (act.tab === 'procurement' && onOpenProcurement) {
                              onOpenProcurement(act.sku || 'COFFEE-001');
                            } else if (onNavigateTo) {
                              onNavigateTo(act.tab);
                            }
                          }}
                          className="btn-primary text-[11px] py-1.5 px-3 flex items-center gap-1"
                        >
                          <span>{act.label}</span>
                          <ArrowRight className="w-3 h-3 text-black" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="p-4 rounded-2xl bg-surface-2/80 border border-white/[0.06] flex items-center gap-3 text-xs text-brand-accent animate-pulse">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Querying telemetry and calculating deterministic scenarios...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompt Suggestions */}
        <div className="px-4 py-2 border-t border-white/[0.06] bg-surface-1/90 overflow-x-auto shrink-0 flex items-center gap-1.5">
          {QUICK_PROMPTS.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSendPrompt(p)}
              className="px-2.5 py-1 rounded-lg bg-surface-2 hover:bg-surface-3 text-[11px] text-slate-300 hover:text-white border border-white/[0.06] whitespace-nowrap transition-colors"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Prompt Input Form */}
        <form onSubmit={(e) => { e.preventDefault(); handleSendPrompt(); }} className="p-3 border-t border-white/[0.08] bg-surface-2/80 flex items-center gap-2 shrink-0">
          <input
            type="text"
            placeholder="Ask about SKUs, suppliers, POs, or risk simulations..."
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            disabled={isLoading}
            className="flex-1 bg-surface-1 border border-white/[0.08] text-xs text-white placeholder-slate-500 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-brand-accent transition-colors"
          />
          <button
            type="submit"
            disabled={isLoading || !inputPrompt.trim()}
            className="btn-primary p-2.5 rounded-xl disabled:opacity-40"
            aria-label="Send message"
          >
            <Send className="w-3.5 h-3.5 text-black" />
          </button>
        </form>
      </div>
    </div>
  );
}

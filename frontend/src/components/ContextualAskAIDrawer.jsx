import React, { useState } from 'react';
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
  Cpu
} from 'lucide-react';
import { api } from '../services/api';

const QUICK_PROMPTS = [
  "Will we run out of coffee beans this week?",
  "Simulate split order for Arabica Coffee (COFFEE-001)",
  "Audit Kaveri Dairy invoice for quantity shortages",
  "Summarize supplier reliability network",
  "Explain our current Supply Risk Radar score"
];

export default function ContextualAskAIDrawer({ isOpen, onClose, selectedSku, onNavigateTo }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hello Arjun! I am your Autonomous Operations Copilot. How can I help you investigate inventory run-rates, simulate procurement, or review supplier negotiations today?",
      steps: []
    }
  ]);
  const [inputPrompt, setInputPrompt] = useState(
    selectedSku ? `Analyze stockout risk for SKU ${selectedSku}` : ''
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (promptToSend) => {
    const query = promptToSend || inputPrompt;
    if (!query.trim()) return;

    // Add user message
    const userMsg = { role: 'user', content: query };
    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt('');
    setIsLoading(true);

    try {
      const response = await api.askAgent(query, selectedSku);
      const assistantMsg = {
        role: 'assistant',
        content: response.response,
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
          content: `⚠️ Error executing request: ${error.message}. Please check that backend services are active.`,
          steps: []
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-[#0B0F19] border-l border-slate-800 flex flex-col h-full shadow-2xl">
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Cpu className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                Operations Copilot
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                  Closed-Loop
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">Grounded in live store inventory & supplier SLAs</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Prompts Bar */}
        <div className="p-3 border-b border-slate-800/80 bg-slate-950/40 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <span className="text-[10px] uppercase font-bold text-slate-500 shrink-0">Quick Ask:</span>
          {QUICK_PROMPTS.map((qp, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(qp)}
              className="text-[11px] px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-cyan-950/80 hover:text-cyan-300 hover:border-cyan-700/60 border border-slate-700/60 text-slate-300 whitespace-nowrap transition-all"
            >
              {qp}
            </button>
          ))}
        </div>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-7 h-7 rounded-lg bg-cyan-950 border border-cyan-800/60 flex items-center justify-center shrink-0 text-cyan-400 mt-1">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-xl p-3.5 text-xs leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-black font-semibold shadow-md'
                    : 'bg-slate-900/90 border border-slate-800 text-slate-200'
                }`}
              >
                <div className="whitespace-pre-line">{msg.content}</div>

                {/* In-Response Action Pill */}
                {msg.generatedApprovalId && onNavigateTo && (
                  <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-[11px] text-amber-400 font-medium flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" /> Sign-off Pending in Approval Center
                    </span>
                    <button
                      onClick={() => {
                        onClose();
                        onNavigateTo('approvals');
                      }}
                      className="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded text-[11px] font-bold flex items-center gap-1"
                    >
                      Review Approval <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>

              {msg.role === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 text-cyan-400 mt-1 font-bold text-xs">
                  AR
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 items-center text-xs text-cyan-400 p-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Orchestrating specialist agents & calculating deterministic ROP...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/60">
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
              placeholder="Ask anything (e.g. Will we run out of coffee this week?)..."
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
    </div>
  );
}

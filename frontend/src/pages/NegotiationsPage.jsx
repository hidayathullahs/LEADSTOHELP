import React, { useState, useEffect } from 'react';
import {
  MessageSquareDiff,
  TrendingDown,
  DollarSign,
  Send,
  Sparkles,
  ShieldAlert,
  CheckCircle2,
  Copy,
  Clock,
  ChevronRight
} from 'lucide-react';
import { api } from '../services/api';

export default function NegotiationsPage({ onNavigateToApprovals, onOpenAskAI }) {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [copied, setCopied] = useState(false);

  const fetchProposals = async () => {
    setLoading(true);
    try {
      const res = await api.getProposals();
      setProposals(res.proposals || []);
      if (res.proposals && res.proposals.length > 0) {
        setSelectedProposal(res.proposals[0]);
      }
    } catch (err) {
      console.error('Failed to load proposals', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProposals();
  }, []);

  const handleCopyMessage = () => {
    if (selectedProposal?.draft_negotiation_message) {
      navigator.clipboard.writeText(selectedProposal.draft_negotiation_message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
              Autonomous Vendor Outreach
            </span>
            <span className="text-xs text-slate-400">Grounded Target Pricing</span>
          </div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <MessageSquareDiff className="w-5 h-5 text-cyan-400" />
            Vendor Negotiation & Outreach Studio
          </h1>
          <p className="text-xs text-slate-400">
            AI calculates mathematically achievable discount targets and drafts professional supplier outreach letters.
          </p>
        </div>

        <button
          onClick={() => onOpenAskAI("Draft a supplier negotiation for our next bulk coffee bean order.")}
          className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 text-black font-bold text-xs rounded-xl shadow-glow-cyan flex items-center gap-1.5 transition-all"
        >
          <Sparkles className="w-4 h-4" />
          <span>Ask AI Negotiation Agent</span>
        </button>
      </div>

      {/* Main Grid: Proposals List (Left) + Detailed Draft & Target Matrix (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Proposals List (4 Cols) */}
        <div className="lg:col-span-4 space-y-3">
          <h3 className="text-xs font-bold uppercase text-slate-400">Active Proposals ({proposals.length})</h3>
          {loading ? (
            <div className="text-xs text-slate-400 py-6 text-center">Loading proposals...</div>
          ) : (
            proposals.map((p) => (
              <div
                key={p.proposal_id}
                onClick={() => setSelectedProposal(p)}
                className={`glass-card p-4 cursor-pointer transition-all ${
                  selectedProposal?.proposal_id === p.proposal_id
                    ? 'border-cyan-500 bg-cyan-950/20 shadow-glow-cyan'
                    : 'hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono text-[10px] text-cyan-400 font-bold">{p.proposal_id}</span>
                  <span className="badge-amber">{p.status}</span>
                </div>
                <h4 className="text-xs font-bold text-white truncate">{p.product_name}</h4>
                <p className="text-[11px] text-slate-400">{p.supplier_name}</p>

                <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Target Savings:</span>
                  <strong className="font-mono text-emerald-400">+₹{p.expected_savings?.toLocaleString()}</strong>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right Column: Selected Proposal Detail & Draft (8 Cols) */}
        {selectedProposal ? (
          <div className="lg:col-span-8 glass-card p-6 space-y-6">
            {/* Top Stats */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="font-mono text-xs text-cyan-400 font-bold">{selectedProposal.proposal_id}</span>
                <h2 className="text-base font-bold text-white mt-0.5">{selectedProposal.product_name}</h2>
                <p className="text-xs text-slate-400">
                  Target Supplier: <strong className="text-white">{selectedProposal.supplier_name}</strong> • Reliability: <strong className="text-emerald-400 font-mono">{selectedProposal.supplier_reliability_score}/100</strong>
                </p>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-emerald-400 font-bold uppercase block">Projected Cost Savings</span>
                <span className="text-xl font-extrabold font-mono text-emerald-400">
                  +₹{selectedProposal.expected_savings?.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Price Target Comparison Grid */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase font-bold">Quoted Baseline</span>
                <p className="text-base font-bold font-mono text-slate-400 mt-1">
                  ₹{selectedProposal.current_quote_unit_price?.toFixed(2)}/unit
                </p>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase font-bold">Historical Agreed</span>
                <p className="text-base font-bold font-mono text-slate-300 mt-1">
                  ₹{selectedProposal.historical_avg_unit_price?.toFixed(2)}/unit
                </p>
              </div>

              <div className="p-3 bg-cyan-950/40 rounded-xl border border-cyan-800/60">
                <span className="text-[10px] text-cyan-400 uppercase font-bold">AI Target Unit Price</span>
                <p className="text-base font-bold font-mono text-cyan-300 mt-1">
                  ₹{selectedProposal.target_unit_price?.toFixed(2)}/unit
                </p>
              </div>
            </div>

            {/* Strategic Rationale */}
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-slate-500">Negotiation Grounding & Rationale:</span>
              <p className="text-xs text-slate-200">{selectedProposal.rationale}</p>
            </div>

            {/* Draft Communication Message */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Send className="w-3.5 h-3.5 text-cyan-400" />
                  Prepared Supplier Outreach Draft (Requires Human Approval)
                </span>
                <button
                  onClick={handleCopyMessage}
                  className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copied ? 'Copied!' : 'Copy Draft'}</span>
                </button>
              </div>

              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono text-slate-300 whitespace-pre-line leading-relaxed">
                {selectedProposal.draft_negotiation_message}
              </div>
            </div>

            {/* Governance Barrier Callout */}
            <div className="p-4 bg-amber-950/20 border border-amber-500/30 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-amber-300">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>External communications & financial commitments require manager sign-off.</span>
              </div>

              <button
                onClick={onNavigateToApprovals}
                className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded-lg flex items-center gap-1 shadow-glow-amber"
              >
                <span>Go to Approval Queue</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-8 glass-card p-12 text-center text-slate-500">
            Select a proposal to inspect pricing matrix and drafted outreach.
          </div>
        )}
      </div>
    </div>
  );
}

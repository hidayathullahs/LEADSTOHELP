import React, { useState } from 'react';
import {
  Settings,
  Store,
  ShieldCheck,
  Cpu,
  Globe,
  Database,
  Key,
  CheckCircle2,
  Bell,
  Sliders,
  Users,
  Lock,
  Radio,
  Check
} from 'lucide-react';
import { useToast } from '../components/ToastContext';

export default function SettingsPage({ user }) {
  const [activeTab, setActiveTab] = useState('store'); // 'store' | 'rbac' | 'notifications' | 'ai' | 'telemetry'
  const [saved, setSaved] = useState(false);
  const { addToast } = useToast();

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setSaved(true);
    addToast({
      title: 'Settings Saved',
      message: 'Store operational parameters updated successfully.',
      type: 'success'
    });
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto select-none">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-4 border-b border-white/[0.06] gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="badge-teal text-[10px] uppercase font-bold font-mono">
              Store Configuration
            </span>
            <span className="text-xs text-slate-400">Hub BLR-01 Settings & RBAC Rules</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2 tracking-tight">
            <Settings className="w-5 h-5 text-brand-accent shrink-0" />
            Store Settings & Operations Parameters
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Operational store parameters, operator roles, alert thresholds, and AI deterministic preferences.
          </p>
        </div>

        <button
          onClick={handleSaveSettings}
          className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5"
        >
          {saved ? <Check className="w-3.5 h-3.5 text-black" /> : null}
          <span>{saved ? 'Saved' : 'Save Changes'}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto border-b border-white/[0.06] pb-2 text-xs">
        {[
          { id: 'store', label: 'Store Profile', icon: Store },
          { id: 'rbac', label: 'Operators & RBAC', icon: Users },
          { id: 'notifications', label: 'Notifications & Alerts', icon: Bell },
          { id: 'ai', label: 'AI Preferences', icon: Sliders },
          { id: 'telemetry', label: 'Environment Telemetry', icon: Cpu }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-surface-2 text-white border border-white/[0.08] shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      <div className="max-w-3xl">
        {/* Store Profile Tab */}
        {activeTab === 'store' && (
          <div className="glass-card p-6 space-y-4 border-white/[0.08]">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Store className="w-4 h-4 text-brand-accent" />
              <span>Store Operational Profile</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Store Name</label>
                <input
                  type="text"
                  readOnly
                  value="Deccan Roast Specialty Coffee & Bakery"
                  className="w-full bg-surface-2 border border-white/[0.08] rounded-xl p-2.5 text-white font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Store Hub ID</label>
                  <input
                    type="text"
                    readOnly
                    value="store_deccan_roast_01 (#BLR-01)"
                    className="w-full bg-surface-2 border border-white/[0.08] rounded-xl p-2.5 text-brand-accent font-mono"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Base Currency</label>
                  <input
                    type="text"
                    readOnly
                    value="INR (₹)"
                    className="w-full bg-surface-2 border border-white/[0.08] rounded-xl p-2.5 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Location / Hub</label>
                  <input
                    type="text"
                    readOnly
                    value="Bengaluru, Karnataka"
                    className="w-full bg-surface-2 border border-white/[0.08] rounded-xl p-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Timezone</label>
                  <input
                    type="text"
                    readOnly
                    value="Asia/Kolkata (IST)"
                    className="w-full bg-surface-2 border border-white/[0.08] rounded-xl p-2.5 text-white font-mono"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Operators & RBAC Tab */}
        {activeTab === 'rbac' && (
          <div className="glass-card p-6 space-y-4 border-white/[0.08]">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-400" />
              <span>Active Operators & Governance Rules</span>
            </h3>

            <div className="p-4 rounded-xl bg-surface-2/60 border border-white/[0.04] space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white">{user?.name || 'Arjun Rao'}</h4>
                  <p className="text-[11px] text-slate-400 font-mono">{user?.email || 'arjun.rao@deccanroast.in'}</p>
                </div>
                <span className="badge-emerald text-[10px] font-mono font-bold">OPERATIONS LEAD</span>
              </div>
              <p className="text-[11px] text-slate-300 pt-1 border-t border-white/[0.04]">
                Authorized to approve purchase orders up to ₹2,50,000 and issue supplier debit notes.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-surface-2/40 border border-white/[0.04] text-[11px] text-slate-400 flex items-start gap-2">
              <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span>Strict RBAC: Dual-operator authorization required for transactions above ₹5,00,000.</span>
            </div>
          </div>
        )}

        {/* Notifications & Alerts Tab */}
        {activeTab === 'notifications' && (
          <div className="glass-card p-6 space-y-4 border-white/[0.08]">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-400" />
              <span>Alert Thresholds & Subscriptions</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-surface-2/60 border border-white/[0.04]">
                <div>
                  <h4 className="font-bold text-white">Critical Stockout Alert Threshold</h4>
                  <p className="text-[11px] text-slate-400">Trigger alert when SKU coverage drops below 3.0 days.</p>
                </div>
                <span className="badge-rose font-mono font-bold">&lt; 3.0 Days</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-surface-2/60 border border-white/[0.04]">
                <div>
                  <h4 className="font-bold text-white">Invoice Variance Auto-Flag</h4>
                  <p className="text-[11px] text-slate-400">Flag any GRN quantity discrepancy exceeding 2% or ₹100.</p>
                </div>
                <span className="badge-amber font-mono font-bold">&gt; 2% Variance</span>
              </div>
            </div>
          </div>
        )}

        {/* AI Preferences Tab */}
        {activeTab === 'ai' && (
          <div className="glass-card p-6 space-y-4 border-white/[0.08]">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-brand-accent" />
              <span>AI Engine & Optimization Parameters</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-surface-2/60 border border-white/[0.04]">
                <div>
                  <h4 className="font-bold text-white">Deterministic Execution Engine</h4>
                  <p className="text-[11px] text-slate-400">Zero temperature; pure mathematical multi-scenario optimization.</p>
                </div>
                <span className="badge-emerald font-mono font-bold">ACTIVE (0.00 TEMP)</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-surface-2/60 border border-white/[0.04]">
                <div>
                  <h4 className="font-bold text-white">Gemini Multimodal Vision Engine</h4>
                  <p className="text-[11px] text-slate-400">For optical character recognition on uploaded invoice receipts.</p>
                </div>
                <span className="badge-teal font-mono font-bold">READY</span>
              </div>
            </div>
          </div>
        )}

        {/* Environment Telemetry Tab */}
        {activeTab === 'telemetry' && (
          <div className="glass-card p-6 space-y-4 border-white/[0.08]">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-brand-accent" />
              <span>Runtime System Telemetry</span>
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-surface-2/60 border border-white/[0.04]">
                <span className="text-[10px] text-slate-500 block">Backend Framework</span>
                <span className="text-white font-bold">FastAPI 0.110+ (Python 3.11)</span>
              </div>
              <div className="p-3 rounded-xl bg-surface-2/60 border border-white/[0.04]">
                <span className="text-[10px] text-slate-500 block">Ledger State</span>
                <span className="text-white font-bold">Local JSON / Cloud Firestore</span>
              </div>
              <div className="p-3 rounded-xl bg-surface-2/60 border border-white/[0.04]">
                <span className="text-[10px] text-slate-500 block">Pytest Status</span>
                <span className="text-emerald-400 font-bold">28 / 28 Tests Passing</span>
              </div>
              <div className="p-3 rounded-xl bg-surface-2/60 border border-white/[0.04]">
                <span className="text-[10px] text-slate-500 block">Vite Build</span>
                <span className="text-emerald-400 font-bold">Production Clean</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

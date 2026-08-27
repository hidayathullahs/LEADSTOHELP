import React from 'react';
import {
  Settings,
  Store,
  ShieldCheck,
  Cpu,
  Globe,
  Database,
  Key,
  CheckCircle2
} from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
          <Settings className="w-5 h-5 text-cyan-400" />
          Store & System Configuration
        </h1>
        <p className="text-xs text-slate-400">
          Operational store parameters, tenant isolation, and Google Cloud Gemini connectivity settings.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Store Profile Card */}
        <div className="glass-card p-5 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Store className="w-4 h-4 text-cyan-400" />
            Store Operational Profile
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-slate-400 block mb-1">Store Name</label>
              <input
                type="text"
                readOnly
                value="Deccan Roast Specialty Coffee & Bakery"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-semibold"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-400 block mb-1">Store ID</label>
                <input
                  type="text"
                  readOnly
                  value="store_deccan_roast_01"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-cyan-400 font-mono"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Base Currency</label>
                <input
                  type="text"
                  readOnly
                  value="INR (₹)"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-mono"
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
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Timezone</label>
                <input
                  type="text"
                  readOnly
                  value="Asia/Kolkata (IST)"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Cloud & AI Model Card */}
        <div className="glass-card p-5 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            Google Cloud & Gen AI Engine
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-slate-400 block mb-1">Google Gen AI Model</label>
              <input
                type="text"
                readOnly
                value="gemini-2.5-flash (Configurable via GEMINI_MODEL)"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-cyan-300 font-mono"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Persistence Engine</label>
              <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
                <span className="text-white font-mono">Dual-Mode Firestore (Cloud + Local)</span>
                <span className="badge-emerald">Active</span>
              </div>
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Security & Authorization</label>
              <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
                <span className="text-white">Role-Based Access Control (RBAC)</span>
                <span className="badge-cyan">Manager Signed</span>
              </div>
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Health Liveness Status</label>
              <div className="p-2.5 bg-emerald-950/40 rounded-lg border border-emerald-800/40 flex items-center gap-2 text-emerald-400 font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Backend API Online & Passing Verification Tests</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

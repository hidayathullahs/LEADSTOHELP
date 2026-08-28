import React, { useState, useRef, useEffect } from 'react';
import {
  User,
  ShieldCheck,
  Store,
  LogOut,
  Settings,
  Radio,
  ChevronDown
} from 'lucide-react';

export default function UserMenu({ user, onSignOut, onNavigateTo }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1 pl-2 rounded-xl bg-surface-2 hover:bg-surface-3 border border-white/[0.06] transition-all group"
      >
        <div className="text-right hidden sm:block">
          <span className="text-xs font-bold text-white block leading-tight">
            {user?.name || 'Arjun Rao'}
          </span>
          <span className="text-[10px] text-slate-400 font-mono block">
            {user?.role || 'Lead Operator'}
          </span>
        </div>
        <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center font-bold text-black text-xs shadow-sm">
          AR
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-colors" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-surface-1 border border-white/[0.1] rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in duration-150 text-xs">
          {/* User Meta */}
          <div className="p-4 border-b border-white/[0.06] bg-surface-2/60 space-y-1">
            <h4 className="font-bold text-white text-sm">{user?.name || 'Arjun Rao'}</h4>
            <p className="text-[11px] text-slate-400">{user?.email || 'arjun.rao@deccanroast.in'}</p>
            <div className="flex items-center gap-1.5 pt-1 text-[10px] font-mono text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span>{user?.authMode || 'Strict RBAC Session'}</span>
            </div>
          </div>

          {/* Store Info */}
          <div className="p-3 border-b border-white/[0.04] text-[11px] text-slate-300 space-y-1 bg-surface-1">
            <div className="flex items-center gap-2 text-slate-400">
              <Store className="w-3.5 h-3.5 text-brand-accent" />
              <span>Assigned Store Hub:</span>
            </div>
            <p className="font-semibold text-white pl-5 font-mono">Deccan Roast #BLR-01</p>
          </div>

          {/* Actions */}
          <div className="p-1.5 space-y-0.5">
            <button
              onClick={() => {
                onNavigateTo('settings');
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-surface-2 text-left transition-colors"
            >
              <Settings className="w-4 h-4 text-slate-400" />
              <span>Store Configuration</span>
            </button>

            <button
              onClick={() => {
                setIsOpen(false);
                onSignOut();
              }}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 text-left transition-colors font-medium"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

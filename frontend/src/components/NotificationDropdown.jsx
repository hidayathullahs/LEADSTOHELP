import React, { useState, useRef, useEffect } from 'react';
import {
  Bell,
  AlertTriangle,
  Clock,
  FileCheck,
  CheckSquare,
  ChevronRight,
  X
} from 'lucide-react';

export default function NotificationDropdown({ onNavigateTo }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const notifications = [
    {
      id: 1,
      type: 'critical',
      title: 'Critical Stockout Risk',
      message: 'COFFEE-001 Specialty Arabica depleted to 36kg (~2.8 days left).',
      time: '10m ago',
      target: 'overview'
    },
    {
      id: 2,
      type: 'warning',
      title: 'Invoice Discrepancy Flagged',
      message: 'Kaveri Dairy INV-KAV-8842 billed 100L vs 92L received (8L shortage).',
      time: '25m ago',
      target: 'invoices'
    },
    {
      id: 3,
      type: 'info',
      title: 'Human Sign-off Staged',
      message: 'Split-order PO (₹86,328) staged in Approval Queue.',
      time: '1h ago',
      target: 'approvals'
    }
  ];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-surface-2 transition-all relative"
        title="Notifications"
      >
        <Bell className="w-4 h-4" />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-surface-0"></span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-surface-1 border border-white/[0.1] rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in duration-150">
          <div className="p-3 border-b border-white/[0.06] flex items-center justify-between bg-surface-2/60">
            <span className="text-xs font-bold text-white">Operations Notifications</span>
            <span className="badge-rose text-[9px]">3 Alerts</span>
          </div>

          <div className="max-h-72 overflow-y-auto divide-y divide-white/[0.04]">
            {notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => {
                  onNavigateTo(n.target);
                  setIsOpen(false);
                }}
                className="p-3 hover:bg-surface-2/70 cursor-pointer transition-colors space-y-1 group"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white group-hover:text-brand-accent transition-colors flex items-center gap-1.5">
                    {n.type === 'critical' && <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>}
                    {n.type === 'warning' && <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>}
                    {n.type === 'info' && <span className="w-1.5 h-1.5 rounded-full bg-brand-accent"></span>}
                    {n.title}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">{n.time}</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">{n.message}</p>
              </div>
            ))}
          </div>

          <div className="p-2.5 border-t border-white/[0.06] bg-surface-2/40 text-center">
            <button
              onClick={() => {
                onNavigateTo('overview');
                setIsOpen(false);
              }}
              className="text-[11px] text-brand-accent hover:underline font-semibold"
            >
              View All Operations Alerts
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

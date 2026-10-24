import React, { useState } from 'react';
import { useKiosk } from '../../../context/KioskContext';
import { 
  ShieldCheck, 
  Search, 
  Download, 
  Clock, 
  User, 
  KeyRound, 
  AlertCircle, 
  CheckCircle2, 
  FileText
} from 'lucide-react';

export const AuditLogsPage: React.FC = () => {
  const { showToast } = useKiosk();
  const [searchQuery, setSearchQuery] = useState('');

  const auditLogs = [
    { id: 'LOG-5501', time: '10:48 AM', user: 'chef_vikram (Head Chef)', action: 'Toggled item availability: Crispy Masala Dosa -> AVAILABLE', category: 'MENU_UPDATE', severity: 'INFO', station: 'KDS Station 1 (IP: 192.168.1.45)' },
    { id: 'LOG-5500', time: '10:45 AM', user: 'system_auto (Cloud Sync)', action: 'Diner Order #1025 placed from Table 12 kiosk (UPI ₹890)', category: 'ORDER_PLACED', severity: 'SUCCESS', station: 'Table 12 Kiosk (IP: 192.168.1.112)' },
    { id: 'LOG-5499', time: '10:32 AM', user: 'manager_indiranagar (General Manager)', action: 'Exported Daily Payout & Settlement report (₹48,620)', category: 'FINANCIAL_EXPORT', severity: 'INFO', station: 'Management Dashboard (IP: 192.168.1.10)' },
    { id: 'LOG-5498', time: '10:15 AM', user: 'supervisor_raj (Floor Lead)', action: 'Assigned Waiter Ravi Teja to Table 8 spice assist call', category: 'WAITER_CALL', severity: 'INFO', station: 'Floor Tablet 1 (IP: 192.168.1.60)' },
    { id: 'LOG-5497', time: '09:55 AM', user: 'cook_arjun (Line Cook)', action: 'Authenticated successfully into KDS line via PIN 4321', category: 'STAFF_AUTH', severity: 'SUCCESS', station: 'KDS Station 2 (IP: 192.168.1.46)' },
    { id: 'LOG-5496', time: '09:30 AM', user: 'manager_indiranagar (General Manager)', action: 'Updated Butter Chicken price from ₹310 to ₹320 (+₹10)', category: 'PRICE_CHANGE', severity: 'WARNING', station: 'Management Dashboard (IP: 192.168.1.10)' },
    { id: 'LOG-5495', time: '09:00 AM', user: 'system_auto (Supabase Cloud)', action: 'Heartbeat ping successful across all 20 table tablets', category: 'HEARTBEAT', severity: 'INFO', station: 'Cloud Gateway (fgltjpftvxgauzpfrwh)' },
  ];

  const filteredLogs = auditLogs.filter(log =>
    !searchQuery ||
    log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Header */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white font-display">
              Security, Operations &amp; Audit Logs
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200 text-xs font-bold">
              Immutable Trail
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Chronological cryptographic log of staff actions, price revisions, KDS updates, and auth attempts
          </p>
        </div>

        <button
          onClick={() => showToast('Audit logs exported as secure CSV')}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Audit Trail</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search audit trail by user or action..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 font-extrabold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Log ID</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Staff User</th>
                <th className="py-3 px-4">Action Performed</th>
                <th className="py-3 px-4">Station / IP</th>
                <th className="py-3 px-4 text-center">Severity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white text-[11px]">
                    {log.id}
                  </td>
                  <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                    {log.time}
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-800 dark:text-slate-200">
                    {log.user}
                  </td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                    {log.action}
                  </td>
                  <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                    {log.station}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                      log.severity === 'SUCCESS'
                        ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60'
                        : log.severity === 'WARNING'
                        ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/60'
                        : 'bg-blue-50 text-blue-600 dark:bg-blue-950/60'
                    }`}>
                      {log.severity}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default AuditLogsPage;

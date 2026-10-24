import React, { useState } from 'react';
import { useKiosk } from '../../../context/KioskContext';
import { 
  Bell, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ChefHat, 
  Tablet, 
  DollarSign, 
  Users, 
  Filter,
  Check
} from 'lucide-react';

export const NotificationsPage: React.FC = () => {
  const { staffAlerts, resolveStaffAlert, showToast } = useKiosk();
  const [filterType, setFilterType] = useState<'ALL' | 'KITCHEN' | 'WAITER' | 'DEVICE'>('ALL');

  const staticSystemNotifications = [
    {
      id: 'notif-1',
      category: 'KITCHEN',
      title: 'Kitchen Order #1024 Delay Notice (+5m)',
      message: 'Dum Biryani preparation took 19 mins. Auto ₹0 delay compensation item offered to diner.',
      timestamp: '6 mins ago',
      severity: 'WARNING',
      isResolved: false
    },
    {
      id: 'notif-2',
      category: 'DEVICE',
      title: 'Table 14 Kiosk Charging Docked',
      message: 'Tablet battery is 48%. Device is safely plugged into the dock stand.',
      timestamp: '18 mins ago',
      severity: 'INFO',
      isResolved: true
    },
    {
      id: 'notif-3',
      category: 'WAITER',
      title: 'Table 8 Call Waiter: Assistance Requested',
      message: 'Guest requested spice level adjustment on Butter Chicken. Waiter Ravi assigned.',
      timestamp: '25 mins ago',
      severity: 'WARNING',
      isResolved: false
    },
    {
      id: 'notif-4',
      category: 'DEVICE',
      title: 'Kiosk Firmware Auto-Check Complete',
      message: 'All 20 table tablets running latest v2.4.2-prod software successfully.',
      timestamp: '1 hour ago',
      severity: 'SUCCESS',
      isResolved: true
    }
  ];

  const [notifications, setNotifications] = useState(staticSystemNotifications);

  const handleResolve = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isResolved: true } : n));
    showToast('Alert marked as resolved');
  };

  const filteredNotifs = notifications.filter(n => filterType === 'ALL' || n.category === filterType);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Header */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white font-display">
              Operational Notification Center
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-200 text-xs font-bold">
              Live Alerts
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time operational warnings for kitchen delays, waiter call bells, and table tablet pings
          </p>
        </div>

        <button
          onClick={() => {
            setNotifications(prev => prev.map(n => ({ ...n, isResolved: true })));
            showToast('All operational alerts marked as resolved');
          }}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors cursor-pointer"
        >
          <Check className="w-3.5 h-3.5" />
          <span>Mark All as Resolved</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs text-xs font-bold overflow-x-auto">
        {(['ALL', 'KITCHEN', 'WAITER', 'DEVICE'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterType(cat)}
            className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
              filterType === cat
                ? 'bg-blue-600 text-white shadow-xs font-extrabold'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            {cat === 'ALL' ? 'All Alerts' : `${cat} Notifications`}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifs.map((item) => {
          const severityColors = {
            WARNING: 'border-l-4 border-l-amber-500 bg-amber-50/20 dark:bg-amber-950/20',
            INFO: 'border-l-4 border-l-blue-500 bg-blue-50/20 dark:bg-blue-950/20',
            SUCCESS: 'border-l-4 border-l-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/20',
          };

          return (
            <div
              key={item.id}
              className={`bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                severityColors[item.severity as keyof typeof severityColors] || ''
              } ${item.isResolved ? 'opacity-60' : ''}`}
            >
              <div className="flex items-start gap-3.5">
                <div className={`p-2.5 rounded-xl shrink-0 ${
                  item.category === 'KITCHEN' 
                    ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/60' 
                    : item.category === 'DEVICE' 
                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/60' 
                    : 'bg-purple-50 text-purple-600 dark:bg-purple-950/60'
                }`}>
                  {item.category === 'KITCHEN' ? <ChefHat className="w-5 h-5" /> : item.category === 'DEVICE' ? <Tablet className="w-5 h-5" /> : <Bell className="w-5 h-5" />}
                </div>

                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                      {item.title}
                    </h3>
                    <span className="text-[10px] font-bold text-slate-400">
                      • {item.timestamp}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                    {item.message}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                {item.isResolved ? (
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Resolved
                  </span>
                ) : (
                  <button
                    onClick={() => handleResolve(item.id)}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
                  >
                    Resolve Alert
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};

export default NotificationsPage;

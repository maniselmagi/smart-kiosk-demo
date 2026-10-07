import React from 'react';
import { useKiosk } from '../../context/KioskContext';
import { 
  Tablet, 
  ChefHat, 
  BarChart3, 
  RotateCcw, 
  Home, 
  Radio, 
  ExternalLink 
} from 'lucide-react';

export const DemoNavigation: React.FC = () => {
  const { view, setView, resetDemoData, tableNumber, activeOrders, staffAlerts } = useKiosk();

  const pendingOrdersCount = activeOrders.filter((o) => o.status !== 'COMPLETED').length;
  const pendingAlertsCount = staffAlerts.filter((a) => a.status === 'PENDING').length;

  return (
    <div className="bg-slate-950 text-white text-xs border-b border-slate-800 shadow-lg px-4 py-2 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        
        {/* Left: Interactive Demo Mode Badge */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold text-[11px] border border-emerald-500/30">
            <Radio className="w-3 h-3 animate-pulse text-emerald-400" />
            <span>Live Cloud Demo</span>
          </div>
          <span className="text-slate-400 hidden lg:inline text-[11px]">
            Presentation Prototype • Real-time Multi-screen Sync
          </span>
        </div>

        {/* Center: Main View Switchers */}
        <div className="flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
          
          <button
            onClick={() => setView('hub')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-bold transition-all ${
              view === 'hub'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>Hub</span>
          </button>

          <button
            onClick={() => setView('kiosk')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
              view === 'kiosk'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Tablet className="w-3.5 h-3.5" />
            <span>Customer Kiosk</span>
            <span className="text-[10px] opacity-75 px-1 rounded bg-black/30">T{tableNumber}</span>
          </button>

          <button
            onClick={() => setView('kitchen')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all relative ${
              view === 'kitchen'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <ChefHat className="w-3.5 h-3.5" />
            <span>Kitchen KDS</span>
            {pendingOrdersCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-red-500 text-white text-[10px] font-black">
                {pendingOrdersCount}
              </span>
            )}
            {pendingAlertsCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            )}
          </button>

          <button
            onClick={() => setView('dashboard')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
              view === 'dashboard'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Management</span>
          </button>

        </div>

        {/* Right: Quick actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (window.confirm('Reset all demo orders, alerts and feedback to pristine sample state?')) {
                resetDemoData();
              }
            }}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-slate-400 hover:text-amber-300 hover:bg-slate-900 transition-colors text-[11px]"
            title="Reset demo data to initial state"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden sm:inline">Reset Demo</span>
          </button>

          <button
            onClick={() => {
              window.open(window.location.href, '_blank');
            }}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors text-[11px]"
            title="Open in new window to test live tablet-to-kitchen sync across dual screens"
          >
            <ExternalLink className="w-3 h-3" />
            <span className="hidden md:inline">Open 2nd Tab</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default DemoNavigation;

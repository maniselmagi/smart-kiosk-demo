import React, { useState } from 'react';
import { useKiosk } from '../../context/KioskContext';
import { 
  Tablet, 
  ChefHat, 
  BarChart3, 
  RotateCcw, 
  Home, 
  Radio, 
  ExternalLink,
  Sun,
  Moon,
  ChevronUp,
  ChevronDown,
  Layers
} from 'lucide-react';

export const DemoNavigation: React.FC = () => {
  const { 
    view, 
    setView, 
    resetDemoData, 
    tableNumber, 
    activeOrders, 
    staffAlerts, 
    isStandaloneRole,
    theme,
    toggleTheme
  } = useKiosk();

  const [isMinimized, setIsMinimized] = useState(false);

  // Hide the bar when visiting standalone kiosk roles
  if (isStandaloneRole && view !== 'hub') {
    return null;
  }

  const pendingOrdersCount = activeOrders.filter((o) => o.status !== 'COMPLETED').length;
  const pendingAlertsCount = staffAlerts.filter((a) => a.status === 'PENDING').length;

  if (isMinimized) {
    return (
      <div className="fixed top-2 right-2 z-50 animate-in fade-in duration-200">
        <button
          onClick={() => setIsMinimized(false)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-950/90 hover:bg-slate-900 text-amber-400 border border-amber-500/40 text-xs font-bold shadow-2xl backdrop-blur-md cursor-pointer transition-all active:scale-95"
          title="Expand Operations Switcher"
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Stations</span>
          <ChevronDown className="w-3 h-3 opacity-70" />
        </button>
      </div>
    );
  }

  return (
    <div className="bg-slate-950/95 backdrop-blur-md text-white text-xs border-b border-slate-800 shadow-md px-4 py-2 sticky top-0 z-40 transition-all duration-200">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        
        {/* Left: Operations Core Badge */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-400 font-bold text-[11px] border border-amber-500/30">
            <Radio className="w-3 h-3 animate-pulse text-amber-400" />
            <span className="font-display tracking-wider">ROYAL EMBER CORE</span>
          </div>
          <span className="text-slate-400 hidden lg:inline text-[11px]">
            Enterprise Station Switcher
          </span>
        </div>

        {/* Center: Main View Switchers */}
        <div className="flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
          
          <button
            onClick={() => setView('hub')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              view === 'hub'
                ? 'bg-amber-500 text-slate-950 shadow-sm font-black'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>Station Hub</span>
          </button>

          <button
            onClick={() => setView('kiosk')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              view === 'kiosk'
                ? 'bg-amber-500 text-slate-950 shadow-sm font-black'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Tablet className="w-3.5 h-3.5" />
            <span>Table Kiosk</span>
            <span className="text-[10px] opacity-75 px-1 rounded bg-black/30 font-black">T{tableNumber}</span>
          </button>

          <button
            onClick={() => setView('kitchen')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all relative cursor-pointer ${
              view === 'kitchen'
                ? 'bg-amber-500 text-slate-950 shadow-sm font-black'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <ChefHat className="w-3.5 h-3.5" />
            <span>Kitchen KDS</span>
            {pendingOrdersCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px] font-black">
                {pendingOrdersCount}
              </span>
            )}
            {pendingAlertsCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            )}
          </button>

          <button
            onClick={() => setView('dashboard')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              view === 'dashboard'
                ? 'bg-amber-500 text-slate-950 shadow-sm font-black'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Management</span>
          </button>

        </div>

        {/* Right: Quick actions & Minimize */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle in Top Bar */}
          <button
            type="button"
            onClick={toggleTheme}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-amber-400 transition-colors text-[11px] border border-slate-800 active:scale-95 cursor-pointer"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Light</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-slate-300" />
                <span className="hidden sm:inline">Dark</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              if (window.confirm('Reset all demo orders, alerts and feedback to pristine sample state?')) {
                resetDemoData();
              }
            }}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-slate-400 hover:text-amber-300 hover:bg-slate-900 transition-colors text-[11px] cursor-pointer"
            title="Reset sample orders & tables"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          <button
            type="button"
            onClick={() => {
              window.open('/kitchen', '_blank');
            }}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800/90 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors text-[11px] cursor-pointer"
            title="Open Kitchen KDS in new window to test live tablet-to-kitchen sync"
          >
            <ExternalLink className="w-3 h-3" />
            <span className="hidden md:inline">Kitchen Screen</span>
          </button>

          {/* Minimize Top Bar Toggle */}
          <button
            type="button"
            onClick={() => setIsMinimized(true)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer transition-colors"
            title="Minimize Bar"
          >
            <ChevronUp className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};

export default DemoNavigation;

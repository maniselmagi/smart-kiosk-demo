import React from 'react';
import { useKiosk } from '../../context/KioskContext';
import { 
  Tablet, 
  ChefHat, 
  BarChart3, 
  ArrowRight, 
  Clock, 
  Sparkles, 
  Layers, 
  Split, 
  Languages, 
  ShieldCheck, 
  TrendingUp, 
  CheckCircle2, 
  Flame, 
  UtensilsCrossed 
} from 'lucide-react';

export const LandingHub: React.FC = () => {
  const { setView, tableNumber, setTableNumber, activeOrders, staffAlerts } = useKiosk();

  const pendingOrders = activeOrders.filter((o) => o.status !== 'COMPLETED').length;
  const pendingAlerts = staffAlerts.filter((a) => a.status === 'PENDING').length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white selection:bg-brand-500 selection:text-white">
      
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-brand-500/10 blur-[120px] pointer-events-none rounded-full" />

      {/* Main Container */}
      <div className="relative max-w-6xl mx-auto px-4 py-12 md:py-20 flex flex-col items-center">
        
        {/* Top Proposal Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/60 text-xs font-semibold text-brand-300 mb-6 shadow-inner">
          <Sparkles className="w-3.5 h-3.5 text-brand-400" />
          <span>Product Proposal Prototype • Restaurant Review 2026</span>
        </div>

        {/* Hero Title */}
        <div className="text-center max-w-3xl mb-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-amber-500 flex items-center justify-center text-white shadow-xl shadow-brand-500/25">
              <UtensilsCrossed className="w-6 h-6" />
            </div>
            <span className="text-2xl font-bold tracking-tight font-display text-slate-100">
              OrderEase
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white font-display uppercase leading-tight mb-4">
            Smart Table-Side <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-amber-300 to-brand-500">
              Self-Ordering Kiosk
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto">
            A connected ordering, kitchen, and analytics experience for modern dine-in restaurants.
          </p>
        </div>

        {/* Core 5-Stage Workflow Bar */}
        <div className="w-full max-w-4xl bg-slate-800/50 backdrop-blur-md rounded-2xl border border-slate-700/60 p-4 mb-12 shadow-xl">
          <div className="text-center text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            Connected Business Flow
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
            <div className="flex flex-col items-center p-2.5 rounded-xl bg-slate-900/60 border border-slate-700/40">
              <span className="w-6 h-6 rounded-full bg-brand-500/20 text-brand-400 font-bold flex items-center justify-center mb-1 text-xs">1</span>
              <span className="font-bold text-slate-200">Guest Orders</span>
              <span className="text-[10px] text-slate-400 mt-0.5">Photos, Prep, Spice</span>
            </div>
            <div className="flex flex-col items-center p-2.5 rounded-xl bg-slate-900/60 border border-slate-700/40">
              <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center mb-1 text-xs">2</span>
              <span className="font-bold text-slate-200">Kitchen Receives</span>
              <span className="text-[10px] text-slate-400 mt-0.5">Live KDS routing</span>
            </div>
            <div className="flex flex-col items-center p-2.5 rounded-xl bg-slate-900/60 border border-slate-700/40">
              <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 font-bold flex items-center justify-center mb-1 text-xs">3</span>
              <span className="font-bold text-slate-200">Meal Prepared</span>
              <span className="text-[10px] text-slate-400 mt-0.5">Real-time status sync</span>
            </div>
            <div className="flex flex-col items-center p-2.5 rounded-xl bg-slate-900/60 border border-slate-700/40">
              <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center mb-1 text-xs">4</span>
              <span className="font-bold text-slate-200">Guest Pays</span>
              <span className="text-[10px] text-slate-400 mt-0.5">UPI, Cards, Split bill</span>
            </div>
            <div className="col-span-2 sm:col-span-1 flex flex-col items-center p-2.5 rounded-xl bg-slate-900/60 border border-slate-700/40">
              <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 font-bold flex items-center justify-center mb-1 text-xs">5</span>
              <span className="font-bold text-slate-200">Data Syncs</span>
              <span className="text-[10px] text-slate-400 mt-0.5">Sales & Feedback</span>
            </div>
          </div>
        </div>

        {/* 3 Main Experience Launch Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mb-12">
          
          {/* 1. Customer Kiosk */}
          <div className="group relative bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-brand-500/80 rounded-3xl p-6 transition-all duration-300 shadow-xl hover:shadow-brand-500/10 flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center text-white mb-5 shadow-lg shadow-brand-500/30 group-hover:scale-105 transition-transform">
                <Tablet className="w-7 h-7" />
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-400">
                  Guest Experience
                </span>
                <span className="text-xs bg-slate-700/80 text-slate-300 px-2 py-0.5 rounded-full font-semibold">
                  Table {tableNumber}
                </span>
              </div>
              <h3 className="text-2xl font-bold font-display text-white mb-2">
                Customer Kiosk
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">
                Tablet touch interface for guests: full food imagery, live prep time, spice selector, AI combos, digital receipt, split bill, and call waiter.
              </p>
              
              {/* Quick Table Selector */}
              <div className="flex items-center gap-1.5 mb-6 text-xs text-slate-400">
                <span>Select Table:</span>
                {[4, 8, 12, 16].map((num) => (
                  <button
                    key={num}
                    onClick={() => setTableNumber(num)}
                    className={`px-2 py-1 rounded-md font-bold transition-colors ${
                      tableNumber === num 
                        ? 'bg-brand-600 text-white' 
                        : 'bg-slate-750 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    #{num}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setView('kiosk')}
              className="w-full py-3.5 px-4 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-brand-500/25 active:scale-98 group-hover:gap-3"
            >
              <span>Launch Customer Kiosk</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* 2. Kitchen Display */}
          <div className="group relative bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-amber-500/80 rounded-3xl p-6 transition-all duration-300 shadow-xl hover:shadow-amber-500/10 flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-white mb-5 shadow-lg shadow-amber-500/30 group-hover:scale-105 transition-transform">
                <ChefHat className="w-7 h-7" />
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  Kitchen Operations
                </span>
                {pendingOrders > 0 && (
                  <span className="text-xs bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full font-bold animate-pulse">
                    {pendingOrders} Active
                  </span>
                )}
              </div>
              <h3 className="text-2xl font-bold font-display text-white mb-2">
                Kitchen Display (KDS)
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">
                Real-time tickets screen for chef: New → Preparing → Ready → Served. Manage prep times, receive instant table waiter calls, and toggle sold-out dishes.
              </p>

              <div className="flex items-center gap-2 mb-6 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-400" /> Real-time status sync
                </span>
                {pendingAlerts > 0 && (
                  <span className="text-amber-400 font-semibold">
                    • {pendingAlerts} waiter calls
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={() => setView('kitchen')}
              className="w-full py-3.5 px-4 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-600/25 active:scale-98 group-hover:gap-3"
            >
              <span>Open Kitchen Display</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* 3. Management Dashboard */}
          <div className="group relative bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-indigo-500/80 rounded-3xl p-6 transition-all duration-300 shadow-xl hover:shadow-indigo-500/10 flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center text-white mb-5 shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform">
                <BarChart3 className="w-7 h-7" />
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                  Business Intelligence
                </span>
                <span className="text-xs bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 px-2 py-0.5 rounded-full font-bold">
                  Live KPIs
                </span>
              </div>
              <h3 className="text-2xl font-bold font-display text-white mb-2">
                Management Dashboard
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">
                Actionable analytics for restaurant owners: sales by day & hour, peak-hour rush planning, dish margin profitability (38%–58%), and live guest feedback.
              </p>

              <div className="flex items-center gap-2 mb-6 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5 text-indigo-400" /> ₹48,620 Today's Sales
                </span>
                <span>• 4.7 ★ Rating</span>
              </div>
            </div>

            <button
              onClick={() => setView('dashboard')}
              className="w-full py-3.5 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-600/25 active:scale-98 group-hover:gap-3"
            >
              <span>Open Management Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Presentation Pro Tip: Multi-Window Sync */}
        <div className="w-full max-w-4xl bg-slate-900/90 border border-brand-500/30 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-500/20 text-brand-400 flex items-center justify-center shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">
                Presenter Pro-Tip: Dual Window Demonstration
              </h4>
              <p className="text-xs text-slate-400">
                Open Kiosk in one browser window and Kitchen KDS in another window side-by-side to showcase zero-latency live synchronization.
              </p>
            </div>
          </div>
          <button
            onClick={() => window.open(window.location.href, '_blank')}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-750 transition-colors shrink-0"
          >
            Launch 2nd Window
          </button>
        </div>

        {/* Feature Checkpoints from Product Proposal */}
        <div className="mt-12 w-full max-w-5xl border-t border-slate-800 pt-8">
          <div className="text-xs uppercase tracking-wider text-slate-500 font-bold mb-4 text-center">
            Comprehensive Customer Proposal Capabilities Included
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-slate-300">
            <div className="flex items-center gap-2 bg-slate-900/50 p-2.5 rounded-xl border border-slate-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Full Visual Menu & Prep Time</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-900/50 p-2.5 rounded-xl border border-slate-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>4-Level Spice Customizer</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-900/50 p-2.5 rounded-xl border border-slate-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Split Bill & Tip Support</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-900/50 p-2.5 rounded-xl border border-slate-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Digital Receipt & SMS/Email</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-900/50 p-2.5 rounded-xl border border-slate-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>English & Tamil Multilingual</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-900/50 p-2.5 rounded-xl border border-slate-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Sold-Out Real-time Sync</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-900/50 p-2.5 rounded-xl border border-slate-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Call Waiter Alert Matrix</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-900/50 p-2.5 rounded-xl border border-slate-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>High-Contrast Accessibility Mode</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LandingHub;

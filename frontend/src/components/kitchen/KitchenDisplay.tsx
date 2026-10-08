import React, { useState, useEffect } from 'react';
import { useKiosk } from '../../context/KioskContext';
import type { OrderStatus } from '../../types';
import { 
  ChefHat, 
  Clock, 
  CheckCircle2, 
  UtensilsCrossed, 
  Flame, 
  Bell, 
  Check, 
  Sparkles, 
  ArrowLeft,
  Filter,
  CheckCheck
} from 'lucide-react';

export const KitchenDisplay: React.FC = () => {
  const { 
    activeOrders, 
    updateOrderStatus, 
    menuItems, 
    toggleItemAvailability, 
    staffAlerts, 
    resolveStaffAlert, 
    setView,
    isStandaloneRole 
  } = useKiosk();

  // Active view tab: orders or inventory/alerts
  const [activeTab, setActiveTab] = useState<'kds' | 'inventory' | 'alerts'>('kds');
  
  // Selected status filter for responsive tablet/mobile view
  const [statusFilter, setStatusFilter] = useState<'ALL' | OrderStatus>('ALL');

  // Live clock
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  // Order status columns definitions
  const columns: { status: OrderStatus; label: string; bgHeader: string; border: string; actionLabel: string; nextStatus: OrderStatus }[] = [
    { 
      status: 'NEW', 
      label: 'NEW ORDERS', 
      bgHeader: 'bg-amber-500/15 text-amber-400 border-amber-500/30', 
      border: 'border-amber-500/40',
      actionLabel: 'Start Preparing',
      nextStatus: 'PREPARING'
    },
    { 
      status: 'PREPARING', 
      label: 'PREPARING', 
      bgHeader: 'bg-blue-500/15 text-blue-400 border-blue-500/30', 
      border: 'border-blue-500/40',
      actionLabel: 'Mark Ready',
      nextStatus: 'READY'
    },
    { 
      status: 'READY', 
      label: 'READY TO SERVE', 
      bgHeader: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30', 
      border: 'border-emerald-500/40',
      actionLabel: 'Mark as Served',
      nextStatus: 'COMPLETED'
    },
    { 
      status: 'COMPLETED', 
      label: 'COMPLETED / SERVED', 
      bgHeader: 'bg-slate-800 text-slate-400 border-slate-700', 
      border: 'border-slate-800',
      actionLabel: '',
      nextStatus: 'COMPLETED'
    },
  ];

  const pendingAlerts = staffAlerts.filter((a) => a.status === 'PENDING');
  const activeOrdersCount = activeOrders.filter((o) => o.status !== 'COMPLETED').length;

  // Elapsed time helper
  const getElapsedMinutes = (dateStr: string) => {
    const elapsed = Math.floor((Date.now() - new Date(dateStr).getTime()) / 60000);
    return Math.max(1, elapsed);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-amber-500 selection:text-black">
      
      {/* Top KDS Control Bar - Fully Responsive */}
      <header className="bg-slate-900 border-b border-slate-800/80 px-4 py-3.5 md:px-6 md:py-4 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3.5">
          
          {/* Brand & KDS Identifier */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {!isStandaloneRole && (
                <button
                  onClick={() => setView('hub')}
                  className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                  title="Back to Hub"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
              )}
              
              <div className="w-10 h-10 md:w-11 md:h-11 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-400 text-slate-950 flex items-center justify-center font-black shadow-lg shadow-amber-500/20 shrink-0">
                <ChefHat className="w-5 h-5 md:w-6 md:h-6" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg md:text-xl font-black font-display tracking-tight text-white uppercase">
                    Kitchen Display (KDS)
                  </h1>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold animate-pulse">
                    LIVE
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 hidden sm:block">
                  Station 1 • Main Kitchen Line & Tandoor
                </p>
              </div>
            </div>

            {/* Live Clock on Mobile / Tablet */}
            <div className="flex lg:hidden items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-800/80 text-amber-400 text-xs font-mono font-bold">
              <Clock className="w-3.5 h-3.5" />
              <span>{currentTime}</span>
            </div>
          </div>

          {/* View Mode Switcher Pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 lg:pb-0">
            
            <button
              onClick={() => setActiveTab('kds')}
              className={`flex-1 sm:flex-none px-3.5 py-2 rounded-xl text-xs font-bold transition-all border whitespace-nowrap flex items-center justify-center gap-1.5 ${
                activeTab === 'kds'
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md font-black'
                  : 'bg-slate-800/80 text-slate-300 border-slate-700/80 hover:text-white hover:bg-slate-700'
              }`}
            >
              <UtensilsCrossed className="w-3.5 h-3.5" />
              <span>Live Tickets ({activeOrdersCount})</span>
            </button>

            <button
              onClick={() => setActiveTab('alerts')}
              className={`flex-1 sm:flex-none relative px-3.5 py-2 rounded-xl text-xs font-bold transition-all border whitespace-nowrap flex items-center justify-center gap-1.5 ${
                activeTab === 'alerts'
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md font-black'
                  : 'bg-slate-800/80 text-slate-300 border-slate-700/80 hover:text-white hover:bg-slate-700'
              }`}
            >
              <Bell className="w-3.5 h-3.5" />
              <span>Waiter Calls</span>
              {pendingAlerts.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-red-500 text-white text-[10px] font-black animate-pulse">
                  {pendingAlerts.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('inventory')}
              className={`flex-1 sm:flex-none px-3.5 py-2 rounded-xl text-xs font-bold transition-all border whitespace-nowrap flex items-center justify-center gap-1.5 ${
                activeTab === 'inventory'
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md font-black'
                  : 'bg-slate-800/80 text-slate-300 border-slate-700/80 hover:text-white hover:bg-slate-700'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Sold-Out ({menuItems.filter((i) => !i.isAvailable).length})</span>
            </button>

            {/* Desktop Clock */}
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/60 text-amber-400 text-xs font-mono font-bold border border-slate-700/60 ml-2">
              <Clock className="w-3.5 h-3.5" />
              <span>{currentTime}</span>
            </div>

          </div>

        </div>
      </header>

      {/* Main KDS Board Content */}
      <main className="flex-1 p-3 md:p-6 max-w-7xl mx-auto w-full">
        
        {/* TAB 1: KDS ORDERS VIEW */}
        {activeTab === 'kds' && (
          <div className="space-y-4">
            
            {/* Responsive Status Filter Bar (Mobile & Tablet) */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
              <span className="text-xs font-bold text-slate-400 flex items-center gap-1 mr-1 hidden sm:flex">
                <Filter className="w-3.5 h-3.5" />
                <span>Filter:</span>
              </span>

              <button
                onClick={() => setStatusFilter('ALL')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border whitespace-nowrap ${
                  statusFilter === 'ALL'
                    ? 'bg-white text-slate-950 border-white shadow-sm'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                All Stages ({activeOrders.length})
              </button>

              {columns.map((col) => {
                const count = activeOrders.filter((o) => o.status === col.status).length;
                const isSelected = statusFilter === col.status;
                return (
                  <button
                    key={col.status}
                    onClick={() => setStatusFilter(col.status)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border whitespace-nowrap flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-white text-slate-950 border-white shadow-sm'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    <span>{col.label}</span>
                    <span className="px-1.5 py-0.2 rounded-full bg-slate-800 text-[10px] font-mono">
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Responsive Columns Grid */}
            <div className={`grid gap-4 items-start ${
              statusFilter !== 'ALL' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                : 'grid-cols-1 md:grid-cols-2 xl:grid-cols-4'
            }`}>
              {columns
                .filter((col) => statusFilter === 'ALL' || statusFilter === col.status)
                .map((col) => {
                  const ordersInCol = activeOrders.filter((o) => o.status === col.status);

                  return (
                    <div 
                      key={col.status} 
                      className="bg-slate-900/80 rounded-3xl border border-slate-800/90 p-3.5 flex flex-col min-h-[450px] shadow-lg"
                    >
                      
                      {/* Column Header */}
                      <div className={`p-3 rounded-2xl border font-black text-xs tracking-wider uppercase mb-3 flex items-center justify-between ${col.bgHeader}`}>
                        <span>{col.label}</span>
                        <span className="px-2 py-0.5 rounded-full bg-black/40 font-mono text-xs font-bold">
                          {ordersInCol.length}
                        </span>
                      </div>

                      {/* Order Tickets in this Column */}
                      <div className="space-y-3 flex-1 overflow-y-auto max-h-[70vh] pr-1">
                        {ordersInCol.length === 0 ? (
                          <div className="py-16 flex flex-col items-center justify-center text-center text-slate-600 text-xs">
                            <CheckCheck className="w-8 h-8 mb-2 text-slate-700" />
                            <span>No orders in {col.label}</span>
                          </div>
                        ) : (
                          ordersInCol.map((order) => {
                            const elapsed = getElapsedMinutes(order.createdAt);
                            const isLate = elapsed > order.estimatedPrepTime;

                            return (
                              <div
                                key={order.id}
                                className={`p-4 rounded-2xl bg-slate-950 border transition-all shadow-md relative overflow-hidden ${
                                  isLate ? 'border-red-500/80 ring-1 ring-red-500/30' : 'border-slate-800 hover:border-slate-700'
                                }`}
                              >
                                
                                {/* Ticket Top Meta */}
                                <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-800/80">
                                  <div className="flex items-center gap-2">
                                    <span className="font-mono font-black text-base text-white">
                                      #{order.orderNumber}
                                    </span>
                                    <span className="px-2.5 py-0.5 rounded-lg bg-amber-500 text-slate-950 font-black text-xs">
                                      TABLE {order.tableNumber}
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-1 text-xs font-mono">
                                    <Clock className={`w-3.5 h-3.5 ${isLate ? 'text-red-400 animate-pulse' : 'text-slate-400'}`} />
                                    <span className={isLate ? 'text-red-400 font-bold' : 'text-slate-400'}>
                                      {elapsed}m ago
                                    </span>
                                  </div>
                                </div>

                                {/* Ticket Items List */}
                                <div className="space-y-2.5 mb-4">
                                  {order.items.map((item) => (
                                    <div key={item.cartItemId} className="text-xs">
                                      <div className="flex items-start justify-between gap-1">
                                        <span className="font-extrabold text-slate-100 leading-snug">
                                          <span className="text-amber-400 mr-1.5 font-mono text-sm">{item.quantity}×</span>
                                          {item.name}
                                        </span>
                                      </div>

                                      {/* Spice and Customization */}
                                      <div className="flex flex-wrap items-center gap-1 text-[11px] mt-1 text-slate-400">
                                        <span className={`px-1.5 py-0.5 rounded font-bold text-[10px] ${
                                          item.spiceLevel === 'Hot' || item.spiceLevel === 'Extra Hot'
                                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                            : 'bg-slate-800 text-slate-300'
                                        }`}>
                                          {item.spiceLevel} Spice
                                        </span>
                                        {item.customizations.map((c) => (
                                          <span key={c} className="text-amber-300/90 bg-amber-950/40 px-1 rounded">
                                            • {c}
                                          </span>
                                        ))}
                                        {item.specialInstructions && (
                                          <span className="italic text-slate-400 block w-full text-[10px] mt-0.5">
                                            Note: "{item.specialInstructions}"
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>

                                {/* Stage Progression Button */}
                                <div className="pt-2 border-t border-slate-800/80">
                                  {col.status === 'NEW' && (
                                    <button
                                      onClick={() => updateOrderStatus(order.id, 'PREPARING')}
                                      className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-98 text-white font-black text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                                    >
                                      <ChefHat className="w-4 h-4" />
                                      <span>Start Preparing</span>
                                    </button>
                                  )}

                                  {col.status === 'PREPARING' && (
                                    <button
                                      onClick={() => updateOrderStatus(order.id, 'READY')}
                                      className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white font-black text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                                    >
                                      <CheckCircle2 className="w-4 h-4" />
                                      <span>Mark Ready to Serve</span>
                                    </button>
                                  )}

                                  {col.status === 'READY' && (
                                    <button
                                      onClick={() => updateOrderStatus(order.id, 'COMPLETED')}
                                      className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-98 text-slate-200 font-black text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                                    >
                                      <Sparkles className="w-4 h-4 text-amber-400" />
                                      <span>Mark as Served</span>
                                    </button>
                                  )}

                                  {col.status === 'COMPLETED' && (
                                    <div className="text-center text-[11px] text-slate-500 font-semibold py-1">
                                      ✓ Served & Archived
                                    </div>
                                  )}
                                </div>

                              </div>
                            );
                          })
                        )}
                      </div>

                    </div>
                  );
                })}
            </div>

          </div>
        )}

        {/* TAB 2: INVENTORY & SOLD-OUT CONTROLLER - Fully Responsive */}
        {activeTab === 'inventory' && (
          <div className="bg-slate-900 rounded-3xl border border-slate-800 p-4 md:p-6 shadow-xl animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 mb-6 border-b border-slate-800">
              <div>
                <h3 className="text-lg md:text-xl font-black font-display text-white">
                  Live Dish Availability & Sold-Out Controller
                </h3>
                <p className="text-xs text-slate-400">
                  Toggling an item immediately syncs to all table kiosks, greying out the dish and disabling orders.
                </p>
              </div>
              <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/20 shrink-0">
                Live Kitchen Sync Active
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {menuItems.map((item) => (
                <div
                  key={item.id}
                  className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                    item.isAvailable
                      ? 'bg-slate-950/60 border-slate-800/80'
                      : 'bg-red-950/20 border-red-500/50'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-12 h-12 rounded-xl object-cover shrink-0" 
                    />
                    <div className="min-w-0">
                      <h4 className="font-extrabold text-sm text-white truncate">
                        {item.name}
                      </h4>
                      <p className="text-xs text-slate-400">
                        ₹{item.price} • {item.category}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleItemAvailability(item.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all active:scale-95 shrink-0 ${
                      item.isAvailable
                        ? 'bg-slate-800 hover:bg-red-600 hover:text-white text-slate-300'
                        : 'bg-red-600 text-white shadow-md shadow-red-600/30'
                    }`}
                  >
                    {item.isAvailable ? 'Mark Sold Out' : 'Sold Out ✕ (Re-enable)'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: TABLE WAITER CALLS MONITOR - Fully Responsive */}
        {activeTab === 'alerts' && (
          <div className="bg-slate-900 rounded-3xl border border-slate-800 p-4 md:p-6 shadow-xl animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 mb-6 border-b border-slate-800">
              <div>
                <h3 className="text-lg md:text-xl font-black font-display text-white">
                  Table Assistance & Waiter Calls
                </h3>
                <p className="text-xs text-slate-400">
                  Real-time guest requests from table tablets requiring staff service
                </p>
              </div>
              <span className="text-xs font-bold text-red-400 bg-red-500/10 px-3 py-1.5 rounded-xl border border-red-500/20 shrink-0">
                {pendingAlerts.length} Unresolved Requests
              </span>
            </div>

            <div className="space-y-3">
              {staffAlerts.length === 0 ? (
                <div className="py-16 text-center text-slate-500 text-xs">
                  No active waiter assistance calls.
                </div>
              ) : (
                staffAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-all ${
                      alert.status === 'PENDING'
                        ? 'bg-amber-500/10 border-amber-500/40'
                        : 'bg-slate-950/40 border-slate-800 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black text-sm shrink-0 ${
                        alert.status === 'PENDING' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                      }`}>
                        T#{alert.tableNumber}
                      </div>
                      <div>
                        <span className="font-extrabold text-sm text-white block">
                          Table {alert.tableNumber}: {alert.type}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          Logged at {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>

                    {alert.status === 'PENDING' ? (
                      <button
                        onClick={() => resolveStaffAlert(alert.id)}
                        className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Acknowledge & Dismiss</span>
                      </button>
                    ) : (
                      <span className="text-xs font-semibold text-slate-500">
                        Resolved ✓
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

      </main>

      {/* Bottom KDS Info */}
      <footer className="bg-slate-900 border-t border-slate-800/80 px-4 py-3 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <span>OrderEase Kitchen Display System • Station 1 Line</span>
        <span className="text-[11px] text-slate-500">
          Connected to Table Kiosks • Real-time Sync
        </span>
      </footer>

    </div>
  );
};

export default KitchenDisplay;

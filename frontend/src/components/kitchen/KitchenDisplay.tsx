import React, { useState } from 'react';
import { useKiosk } from '../../context/KioskContext';
import { Order, OrderStatus } from '../../types';
import { 
  ChefHat, 
  Clock, 
  CheckCircle2, 
  UtensilsCrossed, 
  Flame, 
  AlertTriangle, 
  Bell, 
  Check, 
  Filter, 
  RotateCcw, 
  Volume2, 
  Sparkles, 
  Eye, 
  ArrowRight 
} from 'lucide-react';

export const KitchenDisplay: React.FC = () => {
  const { 
    activeOrders, 
    updateOrderStatus, 
    menuItems, 
    toggleItemAvailability, 
    staffAlerts, 
    resolveStaffAlert, 
    tableNumber,
    setView 
  } = useKiosk();

  // Active view tab: orders or inventory/alerts
  const [activeTab, setActiveTab] = useState<'kds' | 'inventory' | 'alerts'>('kds');

  // Order status columns
  const columns: { status: OrderStatus; label: string; bgHeader: string; border: string }[] = [
    { status: 'NEW', label: 'NEW ORDERS', bgHeader: 'bg-amber-500/10 text-amber-500 border-amber-500/30', border: 'border-amber-500/40' },
    { status: 'PREPARING', label: 'PREPARING', bgHeader: 'bg-blue-500/10 text-blue-400 border-blue-500/30', border: 'border-blue-500/40' },
    { status: 'READY', label: 'READY TO SERVE', bgHeader: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30', border: 'border-emerald-500/40' },
    { status: 'COMPLETED', label: 'SERVED / ARCHIVE', bgHeader: 'bg-slate-700/20 text-slate-400 border-slate-700/30', border: 'border-slate-800' },
  ];

  const pendingAlerts = staffAlerts.filter((a) => a.status === 'PENDING');

  // Elapsed time helper
  const getElapsedMinutes = (dateStr: string) => {
    const elapsed = Math.floor((Date.now() - new Date(dateStr).getTime()) / 60000);
    return Math.max(1, elapsed);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-6 flex flex-col justify-between selection:bg-amber-500 selection:text-black">
      
      {/* Top KDS Control Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        
        {/* Brand & KDS Identifier */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-lg shadow-amber-500/20">
            <ChefHat className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-black font-display tracking-tight text-white uppercase">
                Kitchen Display System (KDS)
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold animate-pulse">
                LIVE
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Station: Main Kitchen & Tandoor • Direct Tablet Kiosk Synchronizer
            </p>
          </div>
        </div>

        {/* View Switchers & Alerts indicator */}
        <div className="flex items-center gap-2 self-start md:self-auto flex-wrap">
          
          <button
            onClick={() => setActiveTab('kds')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
              activeTab === 'kds'
                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md font-black'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            Live Tickets ({activeOrders.filter((o) => o.status !== 'COMPLETED').length})
          </button>

          <button
            onClick={() => setActiveTab('alerts')}
            className={`relative px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
              activeTab === 'alerts'
                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md font-black'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Bell className="w-3.5 h-3.5" />
              <span>Waiter Calls</span>
              {pendingAlerts.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-red-500 text-white text-[10px] font-black">
                  {pendingAlerts.length}
                </span>
              )}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
              activeTab === 'inventory'
                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md font-black'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            Sold-Out Controller ({menuItems.filter((i) => !i.isAvailable).length} out)
          </button>

        </div>

      </div>

      {/* Main KDS Board Content */}
      <div className="flex-1 py-6 overflow-x-auto">
        
        {/* TAB 1: KDS COLUMNS VIEW */}
        {activeTab === 'kds' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 min-w-[900px] h-full items-start">
            {columns.map((col) => {
              const ordersInCol = activeOrders.filter((o) => o.status === col.status);

              return (
                <div 
                  key={col.status} 
                  className="bg-slate-900/60 rounded-3xl border border-slate-800/80 p-3.5 flex flex-col min-h-[600px] shadow-xl"
                >
                  
                  {/* Column Header */}
                  <div className={`p-3 rounded-2xl border font-black text-xs tracking-wider uppercase mb-3.5 flex items-center justify-between ${col.bgHeader}`}>
                    <span>{col.label}</span>
                    <span className="px-2 py-0.5 rounded-full bg-black/40 font-mono text-xs">
                      {ordersInCol.length}
                    </span>
                  </div>

                  {/* Order Tickets in this Column */}
                  <div className="space-y-3.5 flex-1 overflow-y-auto pr-1">
                    {ordersInCol.length === 0 ? (
                      <div className="h-48 flex items-center justify-center text-center text-slate-600 text-xs">
                        No orders in this stage
                      </div>
                    ) : (
                      ordersInCol.map((order) => {
                        const elapsed = getElapsedMinutes(order.createdAt);
                        const isLate = elapsed > order.estimatedPrepTime;

                        return (
                          <div
                            key={order.id}
                            className={`p-4 rounded-2xl bg-slate-900 border transition-all shadow-md relative overflow-hidden ${
                              order.tableNumber === tableNumber ? 'ring-2 ring-brand-500/50' : ''
                            } ${
                              isLate ? 'border-red-500/80' : 'border-slate-800 hover:border-slate-700'
                            }`}
                          >
                            
                            {/* Ticket Top Meta */}
                            <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-800">
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-black text-base text-white">
                                  #{order.orderNumber}
                                </span>
                                <span className="px-2 py-0.5 rounded-lg bg-amber-500 text-slate-950 font-black text-xs">
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
                            <div className="space-y-2 mb-4">
                              {order.items.map((item) => (
                                <div key={item.cartItemId} className="text-xs">
                                  <div className="flex items-start justify-between gap-1">
                                    <span className="font-extrabold text-slate-100 leading-tight">
                                      <span className="text-amber-400 mr-1.5">{item.quantity}×</span>
                                      {item.name}
                                    </span>
                                  </div>

                                  {/* Spice and Customization */}
                                  <div className="flex flex-wrap items-center gap-1 text-[11px] mt-0.5 text-slate-400">
                                    <span className={`px-1 rounded font-bold text-[10px] ${
                                      item.spiceLevel === 'Hot' || item.spiceLevel === 'Extra Hot'
                                        ? 'bg-red-500/20 text-red-400'
                                        : 'bg-slate-800 text-slate-300'
                                    }`}>
                                      {item.spiceLevel} Spice
                                    </span>
                                    {item.customizations.map((c) => (
                                      <span key={c} className="text-amber-300/80">
                                        • {c}
                                      </span>
                                    ))}
                                    {item.specialInstructions && (
                                      <span className="italic text-slate-400 block w-full text-[10px]">
                                        Note: {item.specialInstructions}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* Stage Transition Buttons */}
                            <div className="pt-2 border-t border-slate-800">
                              {col.status === 'NEW' && (
                                <button
                                  onClick={() => updateOrderStatus(order.id, 'PREPARING')}
                                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs shadow-md transition-colors flex items-center justify-center gap-1.5"
                                >
                                  <ChefHat className="w-4 h-4" />
                                  <span>Start Preparing</span>
                                </button>
                              )}

                              {col.status === 'PREPARING' && (
                                <button
                                  onClick={() => updateOrderStatus(order.id, 'READY')}
                                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md transition-colors flex items-center justify-center gap-1.5"
                                >
                                  <CheckCircle2 className="w-4 h-4" />
                                  <span>Mark Ready to Serve</span>
                                </button>
                              )}

                              {col.status === 'READY' && (
                                <button
                                  onClick={() => updateOrderStatus(order.id, 'COMPLETED')}
                                  className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-extrabold text-xs transition-colors flex items-center justify-center gap-1.5"
                                >
                                  <Sparkles className="w-4 h-4" />
                                  <span>Served to Guest</span>
                                </button>
                              )}

                              {col.status === 'COMPLETED' && (
                                <div className="text-center text-[11px] text-slate-500 font-semibold py-1">
                                  ✓ Completed & Logged
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
        )}

        {/* TAB 2: INVENTORY & SOLD-OUT CONTROLLER */}
        {activeTab === 'inventory' && (
          <div className="max-w-4xl mx-auto bg-slate-900 rounded-3xl border border-slate-800 p-6 shadow-xl animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800">
              <div>
                <h3 className="text-xl font-black font-display text-white">
                  Live Dish Availability & Sold-Out Controller
                </h3>
                <p className="text-xs text-slate-400">
                  Toggling any dish here immediately updates all tablet kiosks and greys out the dish!
                </p>
              </div>
              <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/20">
                Real-Time Synchronizer Active
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {menuItems.map((item) => (
                <div
                  key={item.id}
                  className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                    item.isAvailable
                      ? 'bg-slate-950/60 border-slate-800'
                      : 'bg-red-950/20 border-red-500/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover shrink-0" />
                    <div>
                      <h4 className="font-extrabold text-sm text-white">
                        {item.name}
                      </h4>
                      <p className="text-xs text-slate-400">
                        ₹{item.price} • {item.category}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleItemAvailability(item.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all active:scale-95 ${
                      item.isAvailable
                        ? 'bg-slate-800 hover:bg-red-600 hover:text-white text-slate-300'
                        : 'bg-red-600 text-white shadow-md shadow-red-600/30'
                    }`}
                  >
                    {item.isAvailable ? 'Mark Sold Out' : 'Sold Out ✕ (Make Available)'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: TABLE WAITER CALLS MONITOR */}
        {activeTab === 'alerts' && (
          <div className="max-w-3xl mx-auto bg-slate-900 rounded-3xl border border-slate-800 p-6 shadow-xl animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800">
              <div>
                <h3 className="text-xl font-black font-display text-white">
                  Table Assistance & Waiter Calls
                </h3>
                <p className="text-xs text-slate-400">
                  Guest requests broadcasted instantly from dining tables
                </p>
              </div>
              <span className="text-xs font-bold text-red-400 bg-red-500/10 px-3 py-1.5 rounded-xl border border-red-500/20">
                {pendingAlerts.length} Unresolved Requests
              </span>
            </div>

            <div className="space-y-3">
              {staffAlerts.length === 0 ? (
                <div className="py-12 text-center text-slate-500 text-xs">
                  No waiter assistance calls yet.
                </div>
              ) : (
                staffAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-4 rounded-2xl border flex items-center justify-between gap-4 transition-all ${
                      alert.status === 'PENDING'
                        ? 'bg-amber-500/10 border-amber-500/40'
                        : 'bg-slate-950/40 border-slate-800 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs ${
                        alert.status === 'PENDING' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                      }`}>
                        T#{alert.tableNumber}
                      </div>
                      <div>
                        <span className="font-extrabold text-sm text-white block">
                          Table {alert.tableNumber}: {alert.type}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>

                    {alert.status === 'PENDING' ? (
                      <button
                        onClick={() => resolveStaffAlert(alert.id)}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold transition-colors flex items-center gap-1.5"
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

      </div>

      {/* Bottom KDS Info */}
      <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
        <span>OrderEase Kitchen Display System • Station 1</span>
        <button
          onClick={() => setView('kiosk')}
          className="text-amber-400 hover:underline flex items-center gap-1"
        >
          <span>Switch back to Table {tableNumber} Kiosk</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
};

export default KitchenDisplay;

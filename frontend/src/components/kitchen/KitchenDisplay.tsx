import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useKiosk } from '../../context/KioskContext';
import type { OrderStatus, Order, CartItem } from '../../types';
import { storageService } from '../../services/storageService';
import { 
  ChefHat, 
  Clock, 
  CheckCircle2, 
  UtensilsCrossed, 
  Flame, 
  Bell, 
  Check, 
  ArrowLeft,
  CheckCheck,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Search,
  AlertTriangle,
  Sun,
  Moon,
  X,
  Eye,
  Receipt,
  UserCheck,
  Download,
  Info
} from 'lucide-react';
import { getAssignedWaiter } from '../../utils/waiterAssignment';
import { authService, UserCredential } from '../../services/authService';

// Audio chime for real-time kitchen orders
function playKitchenChime() {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;
    
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, now);
    gain1.gain.setValueAtTime(0.18, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.35);

    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880, now + 0.1);
    gain2.gain.setValueAtTime(0.22, now + 0.1);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.1);
    osc2.stop(now + 0.5);
  } catch {
    // safe fallback
  }
}

// Timing helper
function getOrderTiming(createdAt: string | undefined, targetMinutes: number = 15) {
  if (!createdAt) {
    return { display: 'Just now', minutes: 1, isOverdue: false, overdueMins: 0 };
  }
  const t = new Date(createdAt).getTime();
  if (isNaN(t) || t <= 0) {
    return { display: 'Just now', minutes: 1, isOverdue: false, overdueMins: 0 };
  }
  const diff = Date.now() - t;
  const rawMins = Math.max(0, Math.floor(diff / 60000));
  const effectiveMins = rawMins > 90 ? 14 : rawMins;

  let display = '';
  if (effectiveMins === 0) display = 'Just now';
  else if (effectiveMins < 60) display = `${effectiveMins}m ago`;
  else display = `${Math.floor(effectiveMins / 60)}h ${effectiveMins % 60}m ago`;

  const target = targetMinutes > 0 ? targetMinutes : 15;
  const isOverdue = effectiveMins > target;
  const overdueMins = isOverdue ? Math.min(effectiveMins - target, 15) : 0;

  return { display, minutes: effectiveMins, isOverdue, overdueMins };
}

export const KitchenDisplay: React.FC = () => {
  const { 
    activeOrders, 
    updateOrderStatus, 
    menuItems, 
    toggleItemAvailability, 
    staffAlerts, 
    resolveStaffAlert, 
    setView,
    isStandaloneRole,
    showToast,
    theme,
    toggleTheme
  } = useKiosk();

  // Storage heartbeat
  const [liveOrders, setLiveOrders] = useState<Order[]>(() => {
    const stored = storageService.getOrders();
    return stored.length > 0 ? stored : activeOrders;
  });

  const prevCountRef = useRef(liveOrders.length);

  // Audio preference
  const [isAudioEnabled, setIsAudioEnabled] = useState<boolean>(() => {
    return localStorage.getItem('kds_audio_enabled') !== 'false';
  });

  // Filters
  const [selectedStation, setSelectedStation] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | OrderStatus>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected Order for Full Ticket Drawer / Modal
  const [selectedOrderForModal, setSelectedOrderForModal] = useState<Order | null>(null);

  // Modals
  const [isWaiterCallsOpen, setIsWaiterCallsOpen] = useState(false);
  const [isSoldOutOpen, setIsSoldOutOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Real-time Clock
  const [clockTime, setClockTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));

  useEffect(() => {
    const timer = setInterval(() => {
      setClockTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Sync pulse
  useEffect(() => {
    const syncPulse = () => {
      const stored = storageService.getOrders();
      if (stored.length > prevCountRef.current && isAudioEnabled) {
        playKitchenChime();
      }
      prevCountRef.current = stored.length;
      setLiveOrders(stored);
    };

    syncPulse();
    const interval = setInterval(syncPulse, 1000);
    const unsubscribe = storageService.subscribe(() => {
      syncPulse();
    });

    return () => {
      clearInterval(interval);
      unsubscribe();
    };
  }, [isAudioEnabled]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const toggleAudio = () => {
    const next = !isAudioEnabled;
    setIsAudioEnabled(next);
    localStorage.setItem('kds_audio_enabled', String(next));
    if (next) {
      playKitchenChime();
      showToast('Kitchen sound alert enabled');
    } else {
      showToast('Kitchen sound alert muted');
    }
  };

  const isDark = theme === 'dark';
  const displayOrders = liveOrders.length > 0 ? liveOrders : activeOrders;

  // Operational metrics
  const pendingAlerts = staffAlerts.filter((a) => a.status === 'PENDING');
  const soldOutItems = menuItems.filter((i) => !i.isAvailable);

  const counts = useMemo(() => {
    return {
      ALL: displayOrders.length,
      NEW: displayOrders.filter(o => o.status === 'NEW').length,
      PREPARING: displayOrders.filter(o => o.status === 'PREPARING').length,
      READY: displayOrders.filter(o => o.status === 'READY').length,
      COMPLETED: displayOrders.filter(o => o.status === 'COMPLETED').length,
    };
  }, [displayOrders]);

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return displayOrders.filter((order) => {
      if (statusFilter !== 'ALL' && order.status !== statusFilter) {
        return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchNum = order.orderNumber.toString().includes(q);
        const matchTable = `table ${order.tableNumber}`.includes(q) || order.tableNumber.toString() === q;
        const matchItem = order.items.some(i => i.name.toLowerCase().includes(q));
        if (!matchNum && !matchTable && !matchItem) return false;
      }

      if (selectedStation !== 'ALL') {
        if (selectedStation === 'HOT') {
          return order.items.some(i => /biryani|chicken|curry|paneer|dal|gravy|rice|pulao/i.test(i.name));
        }
        if (selectedStation === 'TANDOOR') {
          return order.items.some(i => /naan|roti|tikka|kebab|kulcha|paratha/i.test(i.name));
        }
        if (selectedStation === 'STARTER') {
          return order.items.some(i => /dosa|idli|vada|starter|poori|fries|soup/i.test(i.name));
        }
        if (selectedStation === 'BEVERAGE') {
          return order.items.some(i => /coffee|chai|tea|frappé|shake|juice|soda|jamun|kesari|dessert/i.test(i.name));
        }
      }

      return true;
    });
  }, [displayOrders, statusFilter, searchQuery, selectedStation]);

  // Status progression handler
  const handleAdvanceStatus = (orderId: string, currentStatus: OrderStatus, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const nextMap: Record<OrderStatus, OrderStatus> = {
      NEW: 'PREPARING',
      PREPARING: 'READY',
      READY: 'COMPLETED',
      COMPLETED: 'COMPLETED'
    };
    const next = nextMap[currentStatus];
    if (next !== currentStatus) {
      updateOrderStatus(orderId, next);
      if (isAudioEnabled) playKitchenChime();
      showToast(`Order #${orderId} moved to ${next}`);
      if (selectedOrderForModal && selectedOrderForModal.id === orderId) {
        setSelectedOrderForModal({ ...selectedOrderForModal, status: next });
      }
    }
  };

  return (
    <div className={`min-h-screen p-4 sm:p-6 transition-colors duration-200 ${
      isDark ? 'bg-[#0B0F19] text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      
      <div className="max-w-7xl mx-auto space-y-5">

        {/* ========================================================= */}
        {/* 1. TOP HEADER & OPERATIONS BAR                            */}
        {/* ========================================================= */}
        <div className={`p-4 sm:p-5 rounded-2xl border shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/80'
        }`}>
          
          <div className="flex items-center gap-3">
            {!isStandaloneRole && (
              <button
                onClick={() => setView('kiosk')}
                className={`p-2 rounded-xl transition-all cursor-pointer ${
                  isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
                title="Return to Kiosk"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}

            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-md shadow-orange-500/20">
              <ChefHat className="w-5 h-5" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-extrabold font-display tracking-tight">
                  Kitchen Operations Ledger
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-xs font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live Sync
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Executive prep line order tracking • Royal Ember Indiranagar
              </p>
            </div>
          </div>

          {/* Quick Tools */}
          <div className="flex items-center gap-2 flex-wrap">
            
            {/* Waiter Calls Badge */}
            <button
              onClick={() => setIsWaiterCallsOpen(true)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                pendingAlerts.length > 0 
                  ? 'bg-rose-500/10 text-rose-500 border border-rose-500/30 hover:bg-rose-500/20' 
                  : isDark ? 'bg-slate-800 text-slate-400 hover:text-white' : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              <Bell className={`w-3.5 h-3.5 ${pendingAlerts.length > 0 ? 'animate-bounce text-rose-500' : ''}`} />
              <span>Waiter Calls</span>
              {pendingAlerts.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center">
                  {pendingAlerts.length}
                </span>
              )}
            </button>

            {/* 86'd Menu Controller */}
            <button
              onClick={() => setIsSoldOutOpen(true)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                soldOutItems.length > 0 
                  ? 'bg-amber-500/10 text-amber-500 border border-amber-500/30 hover:bg-amber-500/20' 
                  : isDark ? 'bg-slate-800 text-slate-400 hover:text-white' : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              <span>86'd ({soldOutItems.length})</span>
            </button>

            {/* Audio Toggle */}
            <button
              onClick={toggleAudio}
              className={`p-2 rounded-xl transition-all cursor-pointer ${
                isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
              title={isAudioEnabled ? "Kitchen Chimes Enabled" : "Kitchen Chimes Muted"}
            >
              {isAudioEnabled ? <Volume2 className="w-4 h-4 text-emerald-500" /> : <VolumeX className="w-4 h-4 opacity-50" />}
            </button>

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className={`p-2 rounded-xl transition-all cursor-pointer hidden sm:flex ${
                isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
              title="Fullscreen"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Dark/Light Switcher */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-xl transition-all cursor-pointer ${
                isDark ? 'bg-slate-800 hover:bg-slate-700 text-amber-400' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
              title="Toggle Theme"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Clock */}
            <div className={`px-2.5 py-1.5 rounded-xl text-xs font-mono font-bold hidden md:flex items-center gap-1.5 ${
              isDark ? 'bg-slate-950 border border-slate-800 text-amber-400' : 'bg-slate-100 text-slate-700'
            }`}>
              <Clock className="w-3.5 h-3.5 opacity-60" />
              <span>{clockTime}</span>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 2. EXECUTIVE KPI SUMMARY METRIC CARDS                     */}
        {/* ========================================================= */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          
          <button
            onClick={() => setStatusFilter('NEW')}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
              statusFilter === 'NEW'
                ? 'bg-amber-500/10 border-amber-500/50 shadow-sm ring-1 ring-amber-500/30'
                : isDark ? 'bg-slate-900 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200 hover:border-amber-300'
            }`}
          >
            <span className="text-[11px] font-bold text-amber-500 uppercase tracking-wider block">
              New Tickets
            </span>
            <div className="text-2xl font-black font-display mt-1">
              {counts.NEW}
            </div>
            <span className="text-[10px] text-slate-400 mt-0.5 block">Awaiting chef acceptance</span>
          </button>

          <button
            onClick={() => setStatusFilter('PREPARING')}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
              statusFilter === 'PREPARING'
                ? 'bg-blue-500/10 border-blue-500/50 shadow-sm ring-1 ring-blue-500/30'
                : isDark ? 'bg-slate-900 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200 hover:border-blue-300'
            }`}
          >
            <span className="text-[11px] font-bold text-blue-500 uppercase tracking-wider block">
              Cooking Line
            </span>
            <div className="text-2xl font-black font-display mt-1">
              {counts.PREPARING}
            </div>
            <span className="text-[10px] text-slate-400 mt-0.5 block">Under chef preparation</span>
          </button>

          <button
            onClick={() => setStatusFilter('READY')}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
              statusFilter === 'READY'
                ? 'bg-emerald-500/10 border-emerald-500/50 shadow-sm ring-1 ring-emerald-500/30'
                : isDark ? 'bg-slate-900 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200 hover:border-emerald-300'
            }`}
          >
            <span className="text-[11px] font-bold text-emerald-500 uppercase tracking-wider block">
              Ready to Serve
            </span>
            <div className="text-2xl font-black font-display mt-1">
              {counts.READY}
            </div>
            <span className="text-[10px] text-slate-400 mt-0.5 block">Waiter alerted for pickup</span>
          </button>

          <button
            onClick={() => setStatusFilter('COMPLETED')}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
              statusFilter === 'COMPLETED'
                ? 'bg-slate-800 border-slate-600 shadow-sm ring-1 ring-slate-500/30'
                : isDark ? 'bg-slate-900 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200 hover:border-slate-400'
            }`}
          >
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Served &amp; Cleared
            </span>
            <div className="text-2xl font-black font-display mt-1">
              {counts.COMPLETED}
            </div>
            <span className="text-[10px] text-slate-400 mt-0.5 block">Delivered to dining table</span>
          </button>
        </div>

        {/* ========================================================= */}
        {/* 3. FILTER, STATION TABS & SEARCH BAR                       */}
        {/* ========================================================= */}
        <div className={`p-4 rounded-2xl border shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/80'
        }`}>
          
          {/* Status Tabs */}
          <div className={`flex items-center gap-1 overflow-x-auto p-1 rounded-xl text-xs font-bold ${
            isDark ? 'bg-slate-950' : 'bg-slate-100'
          }`}>
            {(['ALL', 'NEW', 'PREPARING', 'READY', 'COMPLETED'] as const).map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                  statusFilter === st
                    ? isDark 
                      ? 'bg-blue-600 text-white shadow-xs font-black' 
                      : 'bg-white text-slate-900 shadow-xs font-black'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {st === 'ALL' ? 'All Orders' : st} ({counts[st]})
              </button>
            ))}
          </div>

          {/* Station Selector & Search */}
          <div className="flex items-center gap-2">
            <select
              value={selectedStation}
              onChange={(e) => setSelectedStation(e.target.value)}
              className={`px-3 py-2 text-xs rounded-xl border outline-none font-medium cursor-pointer ${
                isDark ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-100 border-slate-200 text-slate-800'
              }`}
            >
              <option value="ALL">All Kitchen Stations</option>
              <option value="HOT">Hot Cooking Line</option>
              <option value="TANDOOR">Tandoor &amp; Breads</option>
              <option value="STARTER">Starters &amp; Tiffin</option>
              <option value="BEVERAGE">Drinks &amp; Sweets</option>
            </select>

            <div className={`relative flex-1 sm:w-64 rounded-xl border flex items-center px-3 py-2 ${
              isDark ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-100 border-slate-200 text-slate-800'
            }`}>
              <Search className="w-3.5 h-3.5 opacity-40 mr-2 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search ticket #, table..."
                className="bg-transparent border-none outline-none text-xs w-full placeholder:opacity-50"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="p-0.5 opacity-50 hover:opacity-100">
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 4. PROFESSIONAL KITCHEN OPERATIONS DATA TABLE             */}
        {/* ========================================================= */}
        <div className={`rounded-2xl border shadow-xs overflow-hidden ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/80'
        }`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className={`border-b font-extrabold uppercase tracking-wider text-[10px] ${
                  isDark 
                    ? 'bg-slate-950/70 border-slate-800 text-slate-400' 
                    : 'bg-slate-50 border-slate-200/80 text-slate-500'
                }`}>
                  <th className="py-3.5 px-4">Ticket</th>
                  <th className="py-3.5 px-4">Table</th>
                  <th className="py-3.5 px-4">Server</th>
                  <th className="py-3.5 px-4">Dishes &amp; Preparation Details</th>
                  <th className="py-3.5 px-4">Elapsed / Target</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-right">Kitchen Action</th>
                </tr>
              </thead>
              
              <tbody className={`divide-y ${isDark ? 'divide-slate-800/80' : 'divide-slate-100'}`}>
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-14 text-center text-slate-400">
                      <UtensilsCrossed className="w-9 h-9 mx-auto mb-2 opacity-30 stroke-1" />
                      <p className="font-bold text-sm">No orders matching your active filter.</p>
                      <p className="text-xs opacity-60 mt-0.5">Kitchen prep line is caught up.</p>
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map(order => {
                    const timing = getOrderTiming(order.createdAt, 15);
                    const waiter = getAssignedWaiter(order.tableNumber);
                    const customerNote = order.items.find(i => i.specialInstructions)?.specialInstructions;

                    // Status pill styling
                    const statusStyles = {
                      NEW: 'bg-amber-500/10 text-amber-500 border-amber-500/30',
                      PREPARING: 'bg-blue-500/10 text-blue-500 border-blue-500/30',
                      READY: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30',
                      COMPLETED: 'bg-slate-500/10 text-slate-400 border-slate-500/30'
                    }[order.status];

                    return (
                      <tr 
                        key={order.id} 
                        onClick={() => setSelectedOrderForModal(order)}
                        className={`transition-colors cursor-pointer ${
                          isDark 
                            ? 'hover:bg-slate-800/50' 
                            : 'hover:bg-slate-50/80'
                        }`}
                      >
                        {/* 1. Ticket # */}
                        <td className="py-3.5 px-4 font-mono font-extrabold text-xs whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-md font-bold ${
                            isDark ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-800'
                          }`}>
                            #{order.orderNumber}
                          </span>
                        </td>

                        {/* 2. Table # */}
                        <td className="py-3.5 px-4 font-bold whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-blue-500" />
                            <span className="font-black text-xs">Table {order.tableNumber}</span>
                          </div>
                        </td>

                        {/* 3. Server / Zone */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="text-xs font-semibold text-slate-300 dark:text-slate-300">
                            {waiter.name}
                          </span>
                          <span className="text-[10px] text-slate-400 block">
                            {waiter.zone}
                          </span>
                        </td>

                        {/* 4. Items List (Clean, not dumped) */}
                        <td className="py-3.5 px-4 max-w-md">
                          <div className="space-y-1">
                            {order.items.map((item, idx) => {
                              const isVeg = /veg|paneer|dosa|idli|coffee|vada|kesari|papad|poori/i.test(item.name);
                              return (
                                <div key={idx} className="flex items-center gap-2 text-xs">
                                  <span className="font-black text-amber-500 text-xs shrink-0">
                                    {item.quantity}×
                                  </span>
                                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isVeg ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                                  <span className="font-bold truncate text-slate-800 dark:text-slate-100">
                                    {item.name}
                                  </span>
                                  {item.spiceLevel && (
                                    <span className="text-[10px] opacity-60 text-slate-400 shrink-0">
                                      ({item.spiceLevel})
                                    </span>
                                  )}
                                </div>
                              );
                            })}

                            {/* Customer note if present */}
                            {customerNote && (
                              <div className="text-[11px] text-amber-400 italic pt-0.5 flex items-center gap-1">
                                <Info className="w-3 h-3 shrink-0" />
                                <span className="truncate">"{customerNote}"</span>
                              </div>
                            )}
                          </div>
                        </td>

                        {/* 5. Elapsed / Target */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <span className={`font-mono text-xs font-bold ${
                              timing.isOverdue ? 'text-rose-500 animate-pulse font-black' : 'text-slate-400'
                            }`}>
                              {timing.display}
                            </span>
                            {timing.isOverdue && (
                              <span className="px-1.5 py-0.2 rounded bg-rose-500/10 text-rose-500 border border-rose-500/20 text-[10px] font-bold">
                                +{timing.overdueMins}m
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] opacity-50 text-slate-400 block mt-0.5">
                            Target: 15m
                          </span>
                        </td>

                        {/* 6. Status Pill */}
                        <td className="py-3.5 px-4 text-center whitespace-nowrap">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase border ${statusStyles}`}>
                            {order.status}
                          </span>
                        </td>

                        {/* 7. Action Button */}
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                            
                            {/* Inspect Eye */}
                            <button
                              onClick={() => setSelectedOrderForModal(order)}
                              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                                isDark 
                                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' 
                                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                              }`}
                              title="Inspect Ticket Details"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>

                            {/* Advance Stage Button */}
                            {order.status === 'NEW' && (
                              <button
                                onClick={(e) => handleAdvanceStatus(order.id, 'NEW', e)}
                                className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black flex items-center gap-1 shadow-xs cursor-pointer transition-transform active:scale-95"
                              >
                                <Flame className="w-3 h-3 fill-slate-950" />
                                <span>Start Cooking</span>
                              </button>
                            )}

                            {order.status === 'PREPARING' && (
                              <button
                                onClick={(e) => handleAdvanceStatus(order.id, 'PREPARING', e)}
                                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black flex items-center gap-1 shadow-xs cursor-pointer transition-transform active:scale-95"
                              >
                                <CheckCircle2 className="w-3 h-3" />
                                <span>Mark Ready</span>
                              </button>
                            )}

                            {order.status === 'READY' && (
                              <button
                                onClick={(e) => handleAdvanceStatus(order.id, 'READY', e)}
                                className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black flex items-center gap-1 shadow-xs cursor-pointer transition-transform active:scale-95"
                              >
                                <CheckCheck className="w-3 h-3" />
                                <span>Deliver to Table</span>
                              </button>
                            )}

                            {order.status === 'COMPLETED' && (
                              <span className="px-2.5 py-1 text-[11px] font-bold text-slate-500 flex items-center gap-1">
                                <Check className="w-3.5 h-3.5 text-emerald-500" />
                                <span>Served</span>
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* ========================================================= */}
      {/* 5. CLEAN TICKET DETAIL MODAL                              */}
      {/* ========================================================= */}
      {selectedOrderForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className={`w-full max-w-lg rounded-3xl shadow-2xl border overflow-hidden flex flex-col ${
            isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            
            {/* Modal Header */}
            <div className={`p-5 border-b flex items-center justify-between ${
              isDark ? 'border-slate-800 bg-slate-950/40' : 'border-slate-100 bg-slate-50/80'
            }`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 border border-blue-500/20 flex items-center justify-center">
                  <Receipt className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base font-display">
                    Order Ticket #{selectedOrderForModal.orderNumber}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Table {selectedOrderForModal.tableNumber} • Server: {getAssignedWaiter(selectedOrderForModal.tableNumber).name}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedOrderForModal(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto custom-kds-scrollbar">
              
              {/* Status & Timing summary */}
              <div className={`p-3.5 rounded-2xl border flex items-center justify-between text-xs ${
                isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Status</span>
                  <span className="font-extrabold text-sm">{selectedOrderForModal.status}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Elapsed Time</span>
                  <span className="font-extrabold text-sm font-mono">
                    {getOrderTiming(selectedOrderForModal.createdAt, 15).display}
                  </span>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Dishes &amp; Recipe Instructions ({selectedOrderForModal.items.length})
                </span>

                {selectedOrderForModal.items.map((item, idx) => {
                  const isVeg = /veg|paneer|dosa|idli|coffee|vada|kesari|papad|poori/i.test(item.name);
                  return (
                    <div 
                      key={idx}
                      className={`p-3 rounded-xl border flex items-start justify-between gap-3 text-xs ${
                        isDark ? 'bg-slate-800/40 border-slate-800' : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <span className="w-6 h-6 rounded-md bg-amber-500/10 text-amber-500 font-black text-xs flex items-center justify-center shrink-0">
                          {item.quantity}×
                        </span>
                        <div>
                          <div className="flex items-center gap-1.5 font-bold">
                            <span className={`w-1.5 h-1.5 rounded-full ${isVeg ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                            <span>{item.name}</span>
                          </div>
                          {item.spiceLevel && (
                            <span className="text-[10px] text-slate-400 block mt-0.5">
                              Spice Level: {item.spiceLevel}
                            </span>
                          )}
                          {item.customizations && item.customizations.length > 0 && (
                            <span className="text-[10px] text-slate-400 block mt-0.5">
                              +{item.customizations.join(', ')}
                            </span>
                          )}
                        </div>
                      </div>

                      <span className="font-black text-xs text-slate-400">
                        ₹{item.price * item.quantity}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Special Note */}
              {selectedOrderForModal.items.some(i => i.specialInstructions) && (
                <div className="p-3.5 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-400 text-xs flex items-start gap-2">
                  <Info className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-bold uppercase text-[10px] tracking-wider">
                      Customer Special Request:
                    </strong>
                    <span>"{selectedOrderForModal.items.find(i => i.specialInstructions)?.specialInstructions}"</span>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className={`p-4 border-t flex items-center justify-between gap-3 ${
              isDark ? 'border-slate-800 bg-slate-950/40' : 'border-slate-100 bg-slate-50/80'
            }`}>
              <button
                onClick={() => setSelectedOrderForModal(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
              >
                Close
              </button>

              {selectedOrderForModal.status !== 'COMPLETED' && (
                <button
                  onClick={() => handleAdvanceStatus(selectedOrderForModal.id, selectedOrderForModal.status)}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md cursor-pointer transition-transform active:scale-95"
                >
                  Advance Stage →
                </button>
              )}
            </div>

          </div>
        </div>
      )}

      {/* Waiter Calls Modal */}
      {isWaiterCallsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className={`max-w-md w-full rounded-2xl border p-5 shadow-2xl ${
            isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-rose-500 animate-bounce" />
                <h3 className="font-black text-sm font-display">Staff / Table Alerts</h3>
              </div>
              <button onClick={() => setIsWaiterCallsOpen(false)} className="p-1 rounded-lg hover:bg-slate-800 opacity-60 hover:opacity-100">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 space-y-2 max-h-80 overflow-y-auto custom-kds-scrollbar">
              {staffAlerts.length === 0 ? (
                <p className="text-center text-xs opacity-60 py-6">No pending waiter calls at this moment.</p>
              ) : (
                staffAlerts.map(alert => (
                  <div key={alert.id} className="p-3 rounded-xl border border-rose-500/30 bg-rose-500/10 flex items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="font-bold flex items-center gap-2">
                        <span>Table {alert.tableNumber}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-500 text-white font-bold uppercase">{alert.type}</span>
                      </div>
                      <p className="text-[11px] opacity-70 mt-0.5">Customer requested server assistance</p>
                    </div>
                    {alert.status === 'PENDING' ? (
                      <button
                        onClick={() => {
                          resolveStaffAlert(alert.id);
                          showToast(`Alert for Table ${alert.tableNumber} resolved`);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                      >
                        Resolve
                      </button>
                    ) : (
                      <span className="text-[11px] text-emerald-500 font-bold">Resolved</span>
                    )}
                  </div>
                ))
              )}
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setIsWaiterCallsOpen(false)}
                className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 86'd / Sold-Out Menu Modal */}
      {isSoldOutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className={`max-w-lg w-full rounded-2xl border p-5 shadow-2xl ${
            isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-amber-500" />
                <h3 className="font-black text-sm font-display">86'd Station Ingredients &amp; Dishes</h3>
              </div>
              <button onClick={() => setIsSoldOutOpen(false)} className="p-1 rounded-lg hover:bg-slate-800 opacity-60 hover:opacity-100">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 space-y-2 max-h-96 overflow-y-auto custom-kds-scrollbar">
              <p className="text-[11px] opacity-70 mb-3">
                Toggle items marked out of stock. When toggled, table kiosks immediately disable ordering for this dish.
              </p>
              {menuItems.slice(0, 15).map(item => (
                <div key={item.id} className="p-2.5 rounded-xl border border-slate-800 bg-slate-800/40 flex items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="font-bold">{item.name}</span>
                    <span className="text-[10px] opacity-60 block">₹{item.price} • {item.category}</span>
                  </div>
                  <button
                    onClick={() => {
                      toggleItemAvailability(item.id);
                      showToast(`${item.name} marked as ${item.isAvailable ? '86-SOLD OUT' : 'AVAILABLE'}`);
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      item.isAvailable 
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                        : 'bg-rose-500 text-white shadow-xs'
                    }`}
                  >
                    {item.isAvailable ? 'Available' : "86'd Sold Out"}
                  </button>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setIsSoldOutOpen(false)}
                className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

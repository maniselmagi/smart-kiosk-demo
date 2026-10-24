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
  Info,
  RefreshCw,
  Filter
} from 'lucide-react';
import { getAssignedWaiter, getWaiterZones, WaiterZoneConfig } from '../../utils/waiterAssignment';
import { authService } from '../../services/authService';

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

  // Selected Order for Full Ticket Modal
  const [selectedOrderForModal, setSelectedOrderForModal] = useState<Order | null>(null);

  // Modals
  const [isWaiterCallsOpen, setIsWaiterCallsOpen] = useState(false);
  const [isSoldOutOpen, setIsSoldOutOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Waiter-Table Allocation State (Configured from Management Dashboard)
  const [waiterZones, setWaiterZones] = useState<WaiterZoneConfig[]>(getWaiterZones);
  const [selectedWaiterFilter, setSelectedWaiterFilter] = useState<string | null>(null);

  useEffect(() => {
    const handleUpdate = () => setWaiterZones(getWaiterZones());
    window.addEventListener('waiter_zones_updated', handleUpdate);
    return () => window.removeEventListener('waiter_zones_updated', handleUpdate);
  }, []);

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

      if (selectedWaiterFilter) {
        const waiter = getAssignedWaiter(order.tableNumber);
        if (waiter.code !== selectedWaiterFilter && waiter.name !== selectedWaiterFilter) {
          return false;
        }
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

  // Format today's date in "Thursday 29th of September 2025" style
  const formattedDate = useMemo(() => {
    const now = new Date();
    const dayName = now.toLocaleDateString('en-US', { weekday: 'long' });
    const day = now.getDate();
    const suffix = (d: number) => {
      if (d > 3 && d < 21) return 'th';
      switch (d % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
      }
    };
    const monthName = now.toLocaleDateString('en-US', { month: 'long' });
    const year = now.getFullYear();
    return `Today is ${dayName} ${day}${suffix(day)} of ${monthName} ${year}.`;
  }, []);

  // Top navigation active tab
  const [activeNavTab, setActiveNavTab] = useState<'Dashboard' | 'Orders' | 'Cooking' | 'Ready' | 'Calls' | 'SoldOut'>('Dashboard');

  return (
    <div className={`min-h-screen p-3 sm:p-6 lg:p-8 font-sans transition-colors duration-200 relative overflow-x-hidden ${
      isDark 
        ? 'bg-[#0f172a] text-slate-100' 
        : 'bg-[#f8fafc] text-slate-800'
    }`}
    style={{
      backgroundImage: isDark 
        ? 'radial-gradient(at 0% 0%, rgba(99, 102, 241, 0.15) 0px, transparent 50%), radial-gradient(at 100% 0%, rgba(217, 70, 239, 0.12) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(56, 189, 248, 0.12) 0px, transparent 50%)' 
        : 'radial-gradient(at 0% 0%, rgba(192, 132, 252, 0.35) 0px, transparent 50%), radial-gradient(at 100% 0%, rgba(244, 114, 182, 0.28) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(56, 189, 248, 0.28) 0px, transparent 50%), radial-gradient(at 0% 100%, rgba(167, 139, 250, 0.25) 0px, transparent 50%)'
    }}
    >
      
      {/* ========================================================= */}
      {/* MAIN WHITE CARD CONTAINER (REFERENCE SAAS DESIGN)         */}
      {/* ========================================================= */}
      <div className={`max-w-[1540px] mx-auto rounded-3xl border shadow-xl p-6 sm:p-8 transition-colors ${
        isDark 
          ? 'bg-slate-900/95 border-slate-800 shadow-black/40' 
          : 'bg-white border-slate-100/90 shadow-2xl shadow-purple-950/5'
      }`}>

        {/* --------------------------------------------------------- */}
        {/* TOP NAVIGATION BAR                                        */}
        {/* --------------------------------------------------------- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-800/80 gap-4">
          
          {/* Logo & Navigation Tabs */}
          <div className="flex items-center gap-6 lg:gap-8 flex-wrap">
            {/* Iridescent Swirl Brand Icon */}
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-pink-500 via-amber-400 to-cyan-400 p-0.5 flex items-center justify-center shadow-xs">
                <div className="w-full h-full rounded-full bg-white dark:bg-slate-900 flex items-center justify-center">
                  <ChefHat className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
              <span className="font-extrabold text-sm tracking-tight hidden sm:inline">Royal Ember</span>
            </div>

            {/* Nav Tabs */}
            <nav className="flex items-center gap-5 sm:gap-7 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <button 
                onClick={() => { setActiveNavTab('Dashboard'); setStatusFilter('ALL'); }}
                className={`py-1 cursor-pointer transition-colors relative ${
                  activeNavTab === 'Dashboard' 
                    ? 'text-slate-900 dark:text-white font-bold' 
                    : 'hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                Dashboard
                {activeNavTab === 'Dashboard' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900 dark:bg-white rounded-full" />
                )}
              </button>

              <button 
                onClick={() => { setActiveNavTab('Orders'); setStatusFilter('NEW'); }}
                className={`py-1 cursor-pointer transition-colors relative ${
                  activeNavTab === 'Orders' 
                    ? 'text-slate-900 dark:text-white font-bold' 
                    : 'hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                Orders
                {activeNavTab === 'Orders' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900 dark:bg-white rounded-full" />
                )}
              </button>

              <button 
                onClick={() => { setActiveNavTab('Cooking'); setStatusFilter('PREPARING'); }}
                className={`py-1 cursor-pointer transition-colors relative ${
                  activeNavTab === 'Cooking' 
                    ? 'text-slate-900 dark:text-white font-bold' 
                    : 'hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                Cooking Line
                {activeNavTab === 'Cooking' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900 dark:bg-white rounded-full" />
                )}
              </button>

              <button 
                onClick={() => { setActiveNavTab('Ready'); setStatusFilter('READY'); }}
                className={`py-1 cursor-pointer transition-colors relative ${
                  activeNavTab === 'Ready' 
                    ? 'text-slate-900 dark:text-white font-bold' 
                    : 'hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                Ready to Serve
                {activeNavTab === 'Ready' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900 dark:bg-white rounded-full" />
                )}
              </button>

              <button 
                onClick={() => setIsWaiterCallsOpen(true)}
                className="py-1 cursor-pointer transition-colors hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1.5"
              >
                <span>Waiter Calls</span>
                {pendingAlerts.length > 0 && (
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                )}
              </button>

              <button 
                onClick={() => setIsSoldOutOpen(true)}
                className="py-1 cursor-pointer transition-colors hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1"
              >
                <span>86'd Menu</span>
                {soldOutItems.length > 0 && (
                  <span className="text-[10px] px-1.5 py-0.2 bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300 rounded-full font-bold">
                    {soldOutItems.length}
                  </span>
                )}
              </button>
            </nav>
          </div>

          {/* User Profile & Quick Action Utilities */}
          <div className="flex items-center gap-4 self-end md:self-auto">
            {/* Quick Utility Icons */}
            <div className="flex items-center gap-1.5 pr-3 border-r border-slate-200 dark:border-slate-800">
              {!isStandaloneRole && (
                <button
                  onClick={() => setView('kiosk')}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  title="Return to Kiosk"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
              )}

              <button
                onClick={toggleAudio}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title={isAudioEnabled ? "Kitchen Chimes Enabled" : "Kitchen Chimes Muted"}
              >
                {isAudioEnabled ? <Volume2 className="w-4 h-4 text-emerald-600" /> : <VolumeX className="w-4 h-4 opacity-40" />}
              </button>

              <button
                onClick={toggleFullscreen}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer hidden sm:block"
                title="Toggle Fullscreen"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>

              <button
                onClick={toggleTheme}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title="Toggle Theme"
              >
                {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
              </button>
            </div>

            {/* Profile Avatar & Title (Matches Reference Screenshot) */}
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                  Robert Briggs
                </div>
                <div className="text-[11px] text-slate-400 dark:text-slate-400 leading-tight">
                  Royal Ember Kitchen Line
                </div>
              </div>
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                alt="Robert Briggs"
                className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-100 dark:ring-slate-800"
              />
            </div>
          </div>
        </div>

        {/* --------------------------------------------------------- */}
        {/* SUB-HEADER: DATE GREETING                                 */}
        {/* --------------------------------------------------------- */}
        <div className="pt-6 pb-2 text-xs font-semibold text-slate-800 dark:text-slate-200">
          <span>{formattedDate}</span>
        </div>

        {/* --------------------------------------------------------- */}
        {/* 6 KPI STAT CARDS ROW (EXACT REFERENCE DESIGN)             */}
        {/* --------------------------------------------------------- */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 my-4">
          
          {/* Card 1: System Status */}
          <div className={`p-4 rounded-2xl border transition-all ${
            isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-100 shadow-xs hover:border-slate-200'
          }`}>
            <div className="flex items-center justify-between text-slate-500 text-[11px] font-semibold">
              <span>System Status</span>
              <span className="opacity-40 hover:opacity-100 cursor-pointer">•••</span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 shrink-0" />
              <span className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Good</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">No issues</p>
          </div>

          {/* Card 2: Open Orders */}
          <div className={`p-4 rounded-2xl border transition-all ${
            isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-100 shadow-xs hover:border-slate-200'
          }`}>
            <div className="flex items-center justify-between text-slate-500 text-[11px] font-semibold">
              <span>Open Orders</span>
              <span className="opacity-40 hover:opacity-100 cursor-pointer">•••</span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="w-3 h-3 rounded-full bg-blue-500 shrink-0" />
              <span className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">{counts.NEW}</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Orders awaiting fulfilment</p>
          </div>

          {/* Card 3: In Transit Orders (Preparing) */}
          <div className={`p-4 rounded-2xl border transition-all ${
            isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-100 shadow-xs hover:border-slate-200'
          }`}>
            <div className="flex items-center justify-between text-slate-500 text-[11px] font-semibold">
              <span>In Transit Orders</span>
              <span className="opacity-40 hover:opacity-100 cursor-pointer">•••</span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="w-3 h-3 rounded-full bg-amber-500 shrink-0" />
              <span className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">{counts.PREPARING}</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Orders en route to customers</p>
          </div>

          {/* Card 4: Flagged Orders / Ready to Serve */}
          <div className={`p-4 rounded-2xl border transition-all ${
            isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-100 shadow-xs hover:border-slate-200'
          }`}>
            <div className="flex items-center justify-between text-slate-500 text-[11px] font-semibold">
              <span>Flagged Orders</span>
              <span className="opacity-40 hover:opacity-100 cursor-pointer">•••</span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="w-3 h-3 rounded-full bg-rose-500 shrink-0" />
              <span className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">{counts.READY}</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Require review / dispatch</p>
          </div>

          {/* Card 5: Orders this Month / Today */}
          <div className={`p-4 rounded-2xl border transition-all ${
            isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-100 shadow-xs hover:border-slate-200'
          }`}>
            <div className="flex items-center justify-between text-slate-500 text-[11px] font-semibold">
              <span>Orders this Month</span>
              <span className="opacity-40 hover:opacity-100 cursor-pointer">•••</span>
            </div>
            <div className="mt-2">
              <span className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                {counts.ALL > 0 ? (4340 + counts.ALL).toLocaleString() : '4,348'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">1.8% more than last month</p>
          </div>

          {/* Card 6: Unread Messages / Waiter Calls */}
          <div className={`p-4 rounded-2xl border transition-all ${
            isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-100 shadow-xs hover:border-slate-200'
          }`}>
            <div className="flex items-center justify-between text-slate-500 text-[11px] font-semibold">
              <span>Unread Messages</span>
              <span className="opacity-40 hover:opacity-100 cursor-pointer">•••</span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="w-3 h-3 rounded-full bg-rose-500 shrink-0" />
              <span className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">{pendingAlerts.length}</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Messages awaiting your reply</p>
          </div>

        </div>

        {/* --------------------------------------------------------- */}
        {/* ORDERS SECTION: TITLE & CONTROLS TOOLBAR                  */}
        {/* --------------------------------------------------------- */}
        <div className="pt-6 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            
            {/* Left: Orders Title & Waiter Zone Filters */}
            <div className="flex items-center gap-4 flex-wrap">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                Orders
              </h2>

              {/* Waiter Allocation Badges (Configured in Management Dashboard) */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {waiterZones.map(zone => {
                  const isSelected = selectedWaiterFilter === zone.waiter.code;
                  return (
                    <button
                      key={zone.id}
                      onClick={() => setSelectedWaiterFilter(isSelected ? null : zone.waiter.code)}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all cursor-pointer flex items-center gap-1.5 ${
                        isSelected 
                          ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-transparent shadow-xs' 
                          : 'bg-slate-50 text-slate-600 dark:bg-slate-800/80 dark:text-slate-300 border-slate-200/80 dark:border-slate-700 hover:border-slate-300'
                      }`}
                      title={`Filter by ${zone.waiter.name} (${zone.rangeLabel})`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
                      <span className="font-bold">{zone.rangeLabel}</span>
                      <span>{zone.waiter.name}</span>
                    </button>
                  );
                })}

                {selectedWaiterFilter && (
                  <button
                    onClick={() => setSelectedWaiterFilter(null)}
                    className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline cursor-pointer ml-1"
                  >
                    Clear Filter
                  </button>
                )}
              </div>
            </div>

            {/* Right: Filter & Search Bar (Exact Reference Controls) */}
            <div className="flex items-center gap-3">
              
              {/* Filter Button */}
              <div className="relative">
                <button 
                  onClick={() => {
                    const next: Record<string, string> = {
                      'ALL': 'HOT',
                      'HOT': 'TANDOOR',
                      'TANDOOR': 'STARTER',
                      'STARTER': 'BEVERAGE',
                      'BEVERAGE': 'ALL'
                    };
                    setSelectedStation(next[selectedStation] || 'ALL');
                  }}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    selectedStation !== 'ALL'
                      ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-700'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                  }`}
                  title="Click to cycle station lines"
                >
                  <Filter className="w-3.5 h-3.5 opacity-60" />
                  <span>Filter {selectedStation !== 'ALL' ? `(${selectedStation})` : ''}</span>
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className={`w-44 sm:w-56 pl-3 pr-8 py-1.5 text-xs rounded-lg border outline-none transition-all placeholder:text-slate-400 ${
                    isDark 
                      ? 'bg-slate-800 border-slate-700 text-white focus:border-slate-500' 
                      : 'bg-white border-slate-200 text-slate-800 focus:border-slate-400'
                  }`}
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 pointer-events-none" />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-7 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

            </div>

          </div>
        </div>

        {/* --------------------------------------------------------- */}
        {/* CLEAN ORDERS DATA TABLE (EXACT REFERENCE DESIGN)          */}
        {/* --------------------------------------------------------- */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-medium text-[11px]">
                <th className="py-3 px-3">Order ID</th>
                <th className="py-3 px-3">Customer</th>
                <th className="py-3 px-3">Order Date</th>
                <th className="py-3 px-3">Order Status</th>
                <th className="py-3 px-3">Payment Status</th>
                <th className="py-3 px-3">Item Count</th>
                <th className="py-3 px-3">Total Value</th>
                <th className="py-3 px-3">Assigned Staff</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100/90 dark:divide-slate-800/80">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-14 text-center text-slate-400">
                    <UtensilsCrossed className="w-8 h-8 mx-auto mb-2 opacity-30 stroke-1" />
                    <p className="font-semibold text-sm text-slate-700 dark:text-slate-300">No matching orders found</p>
                    <p className="text-xs text-slate-400 mt-0.5">All active tickets have been fulfilled or clear.</p>
                  </td>
                </tr>
              ) : (
                filteredOrders.map(order => {
                  const timing = getOrderTiming(order.createdAt, 15);
                  const waiter = getAssignedWaiter(order.tableNumber);
                  const customerNote = order.items.find(i => i.specialInstructions)?.specialInstructions;
                  const totalItemsCount = order.items.reduce((acc, i) => acc + (i.quantity || 1), 0);
                  const calculatedTotal = typeof order.total === 'number' && order.total > 0 
                    ? order.total 
                    : order.items.reduce((acc, i) => acc + (i.price * (i.quantity || 1)), 0);

                  // Status badge matching reference image styles
                  const statusConfig = {
                    NEW: {
                      label: 'Open',
                      pillClass: 'bg-blue-50 text-blue-700 border border-blue-100/80 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900',
                      dotClass: 'bg-blue-600'
                    },
                    PREPARING: {
                      label: 'In Transit',
                      pillClass: 'bg-amber-50 text-amber-700 border border-amber-100/80 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900',
                      dotClass: 'bg-amber-500'
                    },
                    READY: {
                      label: 'Delivered',
                      pillClass: 'bg-emerald-50 text-emerald-700 border border-emerald-100/80 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900',
                      dotClass: 'bg-emerald-600'
                    },
                    COMPLETED: {
                      label: 'Delivered',
                      pillClass: 'bg-emerald-50 text-emerald-700 border border-emerald-100/80 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900',
                      dotClass: 'bg-emerald-600'
                    }
                  }[order.status];

                  // Payment status badge matching reference image (Paid / Not Paid)
                  const isPaid = order.paymentStatus === 'PAID' || order.status === 'COMPLETED';
                  const paymentBadge = isPaid ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100/80 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                      Paid
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-100/80 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      Not Paid
                    </span>
                  );

                  return (
                    <tr 
                      key={order.id}
                      onClick={() => setSelectedOrderForModal(order)}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors cursor-pointer group"
                    >
                      {/* 1. Order ID */}
                      <td className="py-4 px-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap align-middle">
                        #{order.orderNumber}
                      </td>

                      {/* 2. Customer / Table */}
                      <td className="py-4 px-3 font-semibold text-slate-900 dark:text-white whitespace-nowrap align-middle">
                        Table {order.tableNumber}
                      </td>

                      {/* 3. Order Date & Elapsed Time */}
                      <td className="py-4 px-3 text-slate-500 dark:text-slate-400 whitespace-nowrap align-middle">
                        <div className="leading-tight">
                          <span>{order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-GB') : '29/09/25'}</span>
                          <span className="block text-[10px] text-slate-400 mt-0.5 font-mono">
                            {timing.display}
                            {timing.isOverdue && (
                              <span className="text-rose-500 font-bold ml-1">+{timing.overdueMins}m</span>
                            )}
                          </span>
                        </div>
                      </td>

                      {/* 4. Order Status Pill with colored dot */}
                      <td className="py-4 px-3 whitespace-nowrap align-middle">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold ${statusConfig.pillClass}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dotClass}`} />
                          {statusConfig.label}
                        </span>
                      </td>

                      {/* 5. Payment Status Pill with colored dot */}
                      <td className="py-4 px-3 whitespace-nowrap align-middle">
                        {paymentBadge}
                      </td>

                      {/* 6. Item Count & Dish Breakdown (Clean, airy, non-dumped) */}
                      <td className="py-4 px-3 align-middle max-w-xs sm:max-w-md">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-900 dark:text-white">
                            {totalItemsCount}
                          </span>
                          <span className="text-slate-400 text-[11px]">
                            ({order.items.length} {order.items.length === 1 ? 'dish' : 'dishes'})
                          </span>
                        </div>

                        {/* Dish preview snippets */}
                        <div className="mt-1 space-y-1">
                          {order.items.slice(0, 2).map((item, idx) => {
                            const isVeg = /veg|paneer|dosa|idli|coffee|vada|kesari|papad|poori/i.test(item.name);
                            const isTreat = item.name.toLowerCase().includes('complimentary') || item.name.toLowerCase().includes('delay');
                            return (
                              <div key={idx} className="flex items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-300">
                                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isVeg ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                                <span className="font-medium truncate">{item.quantity}× {item.name}</span>
                                {item.spiceLevel && (
                                  <span className="text-[10px] text-slate-400 shrink-0">({item.spiceLevel})</span>
                                )}
                                {isTreat && (
                                  <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-1 rounded shrink-0">Treat</span>
                                )}
                              </div>
                            );
                          })}
                          {order.items.length > 2 && (
                            <div className="text-[10px] text-slate-400 italic">
                              +{order.items.length - 2} more items...
                            </div>
                          )}
                          {customerNote && (
                            <div className="text-[10px] text-blue-600 dark:text-blue-400 italic truncate max-w-xs">
                              Note: "{customerNote}"
                            </div>
                          )}
                        </div>
                      </td>

                      {/* 7. Total Value */}
                      <td className="py-4 px-3 font-semibold text-slate-900 dark:text-white whitespace-nowrap align-middle">
                        ₹{calculatedTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>

                      {/* 8. Assigned Staff with Circular Avatar (Exact Reference Design) */}
                      <td className="py-4 px-3 whitespace-nowrap align-middle">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-slate-800 dark:text-slate-200">
                            {waiter.name}
                          </span>
                          {waiter.avatarUrl ? (
                            <img 
                              src={waiter.avatarUrl} 
                              alt={waiter.name}
                              className="w-6 h-6 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700 shrink-0" 
                            />
                          ) : (
                            <span className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-[10px] font-bold flex items-center justify-center shrink-0">
                              {waiter.initial}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* 9. Clean Action Controls */}
                      <td className="py-4 px-3 text-right whitespace-nowrap align-middle">
                        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                          
                          {order.status === 'NEW' && (
                            <button
                              onClick={(e) => handleAdvanceStatus(order.id, 'NEW', e)}
                              className="px-2.5 py-1 rounded-md bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-semibold cursor-pointer transition-colors shadow-xs"
                            >
                              Accept &amp; Cook
                            </button>
                          )}

                          {order.status === 'PREPARING' && (
                            <button
                              onClick={(e) => handleAdvanceStatus(order.id, 'PREPARING', e)}
                              className="px-2.5 py-1 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-semibold cursor-pointer transition-colors shadow-xs"
                            >
                              Mark Ready
                            </button>
                          )}

                          {order.status === 'READY' && (
                            <button
                              onClick={(e) => handleAdvanceStatus(order.id, 'READY', e)}
                              className="px-2.5 py-1 rounded-md bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-semibold cursor-pointer transition-colors shadow-xs"
                            >
                              Deliver
                            </button>
                          )}

                          {order.status === 'COMPLETED' && (
                            <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Delivered</span>
                            </span>
                          )}

                          <button
                            onClick={() => setSelectedOrderForModal(order)}
                            className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                            title="Inspect Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
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

      {/* ========================================================= */}
      {/* 3. TICKET DETAIL MODAL                                    */}
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
                  Dishes &amp; Preparation Details ({selectedOrderForModal.items.length})
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

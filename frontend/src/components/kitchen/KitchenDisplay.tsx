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
  Sparkles, 
  ArrowLeft,
  CheckCheck,
  User,
  ShieldCheck,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Search,
  AlertTriangle,
  Layers,
  Sun,
  Moon,
  Gift,
  X,
  Coffee,
  Info,
  Eye,
  Printer,
  ChevronRight,
  Filter,
  UserCheck,
  ArrowRight,
  SlidersHorizontal,
  LayoutGrid,
  Columns3,
  SplitSquareVertical,
  CheckSquare,
  Square,
  Send,
  Zap,
  Timer
} from 'lucide-react';
import { getAssignedWaiter, WAITER_ZONES } from '../../utils/waiterAssignment';
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

// Elapsed timer helper: consistent, clean, avoiding huge numbers
function getOrderTiming(createdAt: string | undefined, targetMinutes: number = 15) {
  if (!createdAt) {
    return { display: '1m', minutes: 1, percent: 10, isOverdue: false, overdueMins: 0 };
  }
  const t = new Date(createdAt).getTime();
  if (isNaN(t) || t <= 0) {
    return { display: '1m', minutes: 1, percent: 10, isOverdue: false, overdueMins: 0 };
  }
  const diff = Date.now() - t;
  const rawMins = Math.max(0, Math.floor(diff / 60000));
  const effectiveMins = rawMins > 90 ? 14 : rawMins;

  let display = '';
  if (effectiveMins === 0) display = 'Just now';
  else if (effectiveMins < 60) display = `${effectiveMins}m`;
  else display = `${Math.floor(effectiveMins / 60)}h ${effectiveMins % 60}m`;

  const target = targetMinutes > 0 ? targetMinutes : 15;
  const isOverdue = effectiveMins > target;
  const overdueMins = isOverdue ? Math.min(effectiveMins - target, 15) : 0;
  const percent = Math.min(100, Math.round((effectiveMins / target) * 100));

  return { display, minutes: effectiveMins, percent, isOverdue, overdueMins };
}

type ViewMode = 'GRID' | 'EXPEDITER' | 'PIPELINE';

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

  // Display View Mode: Bento Grid (default), Expediter Split, or 4-Stage Pipeline
  const [viewMode, setViewMode] = useState<ViewMode>('GRID');

  // Filter state
  const [selectedStation, setSelectedStation] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | OrderStatus>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [urgentOnly, setUrgentOnly] = useState(false);

  // Item strike-through state (Item-level cooking checkbox for chefs)
  // Map of `${orderId}-${itemIndex}` -> boolean
  const [completedItems, setCompletedItems] = useState<Record<string, boolean>>({});

  // Selected Order for Expediter view or Drawer
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  // Modals
  const [isWaiterCallsOpen, setIsWaiterCallsOpen] = useState(false);
  const [isSoldOutOpen, setIsSoldOutOpen] = useState(false);
  const [isChefSelectorOpen, setIsChefSelectorOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Active Chef on Duty
  const [activeChef, setActiveChef] = useState<UserCredential | null>(() => {
    const user = authService.getCurrentUser();
    if (user && user.role === 'kitchen') return user;
    const all = authService.getUsers();
    return all.find(u => u.role === 'kitchen') || {
      id: 'usr-chef',
      name: 'Chef Vikram Sharma',
      username: 'chef_vikram',
      password: '',
      role: 'kitchen',
      title: 'Executive Head Chef',
      pin: '1234',
      department: 'Kitchen Brigade',
      createdAt: '',
      isDefault: false
    };
  });

  // Real-time Clock
  const [clockTime, setClockTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));

  useEffect(() => {
    const timer = setInterval(() => {
      setClockTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Heartbeat & audio sync
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

  // Set initial selected order for expediter mode
  useEffect(() => {
    if (!selectedOrderId && displayOrders.length > 0) {
      setSelectedOrderId(displayOrders[0].id);
    }
  }, [displayOrders, selectedOrderId]);

  // Toggle item strike-through
  const toggleItemDone = (orderId: string, itemIdx: number) => {
    const key = `${orderId}-${itemIdx}`;
    setCompletedItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return displayOrders.filter((order) => {
      if (statusFilter !== 'ALL' && order.status !== statusFilter) {
        return false;
      }

      if (urgentOnly) {
        const timing = getOrderTiming(order.createdAt, 15);
        if (!timing.isOverdue && order.status !== 'NEW') {
          return false;
        }
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
  }, [displayOrders, statusFilter, searchQuery, selectedStation, urgentOnly]);

  // Operational metrics
  const pendingAlerts = staffAlerts.filter((a) => a.status === 'PENDING');
  const soldOutItems = menuItems.filter((i) => !i.isAvailable);

  const metrics = useMemo(() => {
    const newCount = displayOrders.filter(o => o.status === 'NEW').length;
    const prepCount = displayOrders.filter(o => o.status === 'PREPARING').length;
    const readyCount = displayOrders.filter(o => o.status === 'READY').length;
    const servedCount = displayOrders.filter(o => o.status === 'COMPLETED').length;
    const overdueCount = displayOrders.filter(o => {
      if (o.status === 'COMPLETED') return false;
      return getOrderTiming(o.createdAt, 15).isOverdue;
    }).length;

    return {
      total: displayOrders.length,
      new: newCount,
      preparing: prepCount,
      ready: readyCount,
      served: servedCount,
      overdue: overdueCount
    };
  }, [displayOrders]);

  // "All-Day Item Summary" (Aggregated items currently needing preparation across active orders)
  const allDaySummary = useMemo(() => {
    const itemMap = new Map<string, { name: string; count: number; isVeg: boolean }>();
    displayOrders
      .filter(o => o.status === 'NEW' || o.status === 'PREPARING')
      .forEach(order => {
        order.items.forEach(item => {
          const isVeg = /veg|paneer|dosa|idli|coffee|vada|kesari|papad|poori/i.test(item.name);
          const current = itemMap.get(item.name) || { name: item.name, count: 0, isVeg };
          current.count += item.quantity;
          itemMap.set(item.name, current);
        });
      });
    return Array.from(itemMap.values()).sort((a, b) => b.count - a.count).slice(0, 8);
  }, [displayOrders]);

  // Advance Order Status
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
    }
  };

  // Currently inspected order for Expediter View
  const activeExpediterOrder = useMemo(() => {
    if (!selectedOrderId) return filteredOrders[0] || null;
    return displayOrders.find(o => o.id === selectedOrderId) || filteredOrders[0] || null;
  }, [selectedOrderId, displayOrders, filteredOrders]);

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-200 select-none ${
      isDark ? 'bg-[#0B0F19] text-slate-100' : 'bg-slate-100/90 text-slate-900'
    }`}>
      
      {/* ========================================================= */}
      {/* 1. TOP KITCHEN COMMAND BAR (Commercial POS Header)         */}
      {/* ========================================================= */}
      <header className={`sticky top-0 z-40 border-b backdrop-blur-md px-4 py-2.5 flex items-center justify-between gap-4 transition-colors ${
        isDark 
          ? 'bg-[#0F172A]/95 border-slate-800 text-white shadow-lg' 
          : 'bg-white/95 border-slate-200/90 text-slate-800 shadow-xs'
      }`}>
        
        {/* Left: Branding & Station Indicator */}
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

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-md shadow-orange-500/20">
              <ChefHat className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm tracking-tight font-display">
                  Royal Ember
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-500 border border-amber-500/20">
                  Kitchen Command Station
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-500">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  LIVE
                </span>
              </div>
              <p className="text-[11px] opacity-60">
                Active Prep Line • Indiranagar Flagship
              </p>
            </div>
          </div>
        </div>

        {/* Center: Search & Rush Filter */}
        <div className="hidden lg:flex items-center gap-2 max-w-md w-full">
          <div className={`relative flex-1 rounded-xl border flex items-center px-3 py-1.5 ${
            isDark ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
          }`}>
            <Search className="w-3.5 h-3.5 opacity-40 mr-2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by Ticket #, Table, or Dish..."
              className="bg-transparent border-none outline-none text-xs w-full placeholder:opacity-50"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="p-0.5 opacity-50 hover:opacity-100">
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          <button
            onClick={() => setUrgentOnly(!urgentOnly)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              urgentOnly
                ? 'bg-rose-500 text-white shadow-md shadow-rose-500/25 ring-2 ring-rose-500/30'
                : isDark 
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' 
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Zap className={`w-3.5 h-3.5 ${urgentOnly ? 'animate-bounce' : 'text-amber-500'}`} />
            <span>Rush Only ({metrics.overdue})</span>
          </button>
        </div>

        {/* Right: Operational Tools & User Badge */}
        <div className="flex items-center gap-2">
          
          {/* Waiter Calls Badge */}
          <button
            onClick={() => setIsWaiterCallsOpen(true)}
            className={`relative px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              pendingAlerts.length > 0 
                ? 'bg-rose-500/10 text-rose-500 border border-rose-500/30 hover:bg-rose-500/20' 
                : isDark ? 'bg-slate-800 text-slate-400 hover:text-white' : 'bg-slate-100 text-slate-600 hover:text-slate-900'
            }`}
          >
            <Bell className={`w-3.5 h-3.5 ${pendingAlerts.length > 0 ? 'animate-bounce text-rose-500' : ''}`} />
            <span>Assistance</span>
            {pendingAlerts.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center">
                {pendingAlerts.length}
              </span>
            )}
          </button>

          {/* 86'd / Sold-Out Menu Items Controller */}
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

          <div className="h-4 w-px bg-slate-300 dark:bg-slate-800 mx-1 hidden sm:block" />

          {/* Sound Mute/Unmute */}
          <button
            onClick={toggleAudio}
            className={`p-2 rounded-xl transition-all cursor-pointer ${
              isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
            title={isAudioEnabled ? "Sound Alerts Active" : "Sound Alerts Muted"}
          >
            {isAudioEnabled ? <Volume2 className="w-4 h-4 text-emerald-500" /> : <VolumeX className="w-4 h-4 opacity-50" />}
          </button>

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            className={`p-2 rounded-xl transition-all cursor-pointer hidden md:flex ${
              isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-xl transition-all cursor-pointer ${
              isDark ? 'bg-slate-800 hover:bg-slate-700 text-amber-400' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
            title="Switch Dark/Light Theme"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Clock */}
          <div className={`px-2.5 py-1 rounded-xl text-xs font-mono font-bold tracking-tight hidden sm:flex items-center gap-1.5 ${
            isDark ? 'bg-slate-900 border border-slate-800 text-amber-400' : 'bg-slate-100 border border-slate-200 text-slate-700'
          }`}>
            <Clock className="w-3.5 h-3.5 opacity-60" />
            <span>{clockTime}</span>
          </div>

          {/* Chef Profile Badge */}
          <button
            onClick={() => setIsChefSelectorOpen(true)}
            className={`flex items-center gap-2 pl-2 pr-3 py-1 rounded-xl border text-left cursor-pointer transition-colors ${
              isDark ? 'bg-slate-900 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="w-6 h-6 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
              {activeChef?.name?.charAt(0) || 'C'}
            </div>
            <div className="hidden xl:block">
              <span className="text-xs font-bold block leading-tight truncate max-w-[110px]">
                {activeChef?.name || 'Chef on Duty'}
              </span>
              <span className="text-[10px] opacity-60 block leading-none">
                Station Lead
              </span>
            </div>
          </button>
        </div>
      </header>

      {/* ========================================================= */}
      {/* 2. ALL-DAY FIRE SUMMARY (Commercial Batch Cooking Board)   */}
      {/* ========================================================= */}
      {allDaySummary.length > 0 && (
        <div className={`px-4 py-2 border-b flex items-center gap-3 overflow-x-auto text-xs ${
          isDark ? 'bg-slate-900/60 border-slate-800/80 text-slate-300' : 'bg-amber-50/60 border-amber-200/50 text-slate-700'
        }`}>
          <div className="flex items-center gap-1.5 font-extrabold text-[11px] uppercase tracking-wider text-amber-500 whitespace-nowrap pl-1">
            <Flame className="w-3.5 h-3.5 fill-amber-500 animate-pulse" />
            <span>All-Day Prep Fire:</span>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto py-0.5 custom-kds-scrollbar">
            {allDaySummary.map((item, idx) => (
              <div 
                key={idx}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border font-medium text-xs whitespace-nowrap transition-transform hover:scale-105 ${
                  isDark 
                    ? 'bg-slate-800/90 border-slate-700/80 text-slate-200' 
                    : 'bg-white border-amber-200 text-slate-800 shadow-xs'
                }`}
              >
                <span className="font-black text-amber-500 text-xs">
                  {item.count}×
                </span>
                <span className="font-semibold">{item.name}</span>
                <span className={`w-1.5 h-1.5 rounded-full ${item.isVeg ? 'bg-emerald-500' : 'bg-rose-500'}`} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. WORKSPACE CONTROLS & SEGMENTED STATUS NAV               */}
      {/* ========================================================= */}
      <div className={`px-4 py-2.5 border-b flex flex-col md:flex-row md:items-center justify-between gap-3 ${
        isDark ? 'bg-slate-900/40 border-slate-800/60' : 'bg-white/80 border-slate-200/70'
      }`}>
        
        {/* Left: Station Category Filters */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 custom-kds-scrollbar">
          {[
            { id: 'ALL', label: 'All Stations' },
            { id: 'HOT', label: 'Hot Cooking' },
            { id: 'TANDOOR', label: 'Tandoor & Breads' },
            { id: 'STARTER', label: 'Starters & Tiffin' },
            { id: 'BEVERAGE', label: 'Drinks & Sweets' }
          ].map(station => (
            <button
              key={station.id}
              onClick={() => setSelectedStation(station.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedStation === station.id
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-black'
                  : isDark 
                    ? 'bg-slate-800/70 text-slate-400 hover:text-white hover:bg-slate-800' 
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              {station.label}
            </button>
          ))}
        </div>

        {/* Center: Stage Status Pills with Counts */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 custom-kds-scrollbar">
          {[
            { id: 'ALL', label: 'All Active', count: metrics.total, color: 'text-slate-400' },
            { id: 'NEW', label: 'New Tickets', count: metrics.new, color: 'text-amber-500' },
            { id: 'PREPARING', label: 'Cooking Line', count: metrics.preparing, color: 'text-blue-500' },
            { id: 'READY', label: 'Ready to Serve', count: metrics.ready, color: 'text-emerald-500' },
            { id: 'COMPLETED', label: 'Served', count: metrics.served, color: 'text-slate-400' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id as 'ALL' | OrderStatus)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                statusFilter === tab.id
                  ? isDark
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-black'
                    : 'bg-slate-900 text-white shadow-md shadow-slate-900/20 font-black'
                  : isDark 
                    ? 'bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-800' 
                    : 'bg-slate-100/80 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                statusFilter === tab.id 
                  ? 'bg-white/20 text-white' 
                  : isDark ? 'bg-slate-900 text-slate-300' : 'bg-white text-slate-700 border border-slate-200'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Right: Layout Switcher (Bento Tickets vs Expediter Split vs 4-Stage Pipeline) */}
        <div className={`p-1 rounded-xl border flex items-center gap-1 ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'
        }`}>
          <button
            onClick={() => setViewMode('GRID')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'GRID'
                ? isDark ? 'bg-slate-800 text-white shadow-xs' : 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Bento Ticket Grid"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Ticket Rail</span>
          </button>

          <button
            onClick={() => setViewMode('EXPEDITER')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'EXPEDITER'
                ? isDark ? 'bg-slate-800 text-white shadow-xs' : 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Split Expediter View"
          >
            <SplitSquareVertical className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Expediter</span>
          </button>

          <button
            onClick={() => setViewMode('PIPELINE')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'PIPELINE'
                ? isDark ? 'bg-slate-800 text-white shadow-xs' : 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Stage Pipeline Columns"
          >
            <Columns3 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Pipeline</span>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 4. MAIN KITCHEN WORK AREA (According to Selected ViewMode) */}
      {/* ========================================================= */}
      <main className="flex-1 p-4 overflow-y-auto">
        
        {filteredOrders.length === 0 ? (
          <div className="h-96 flex flex-col items-center justify-center text-center opacity-60">
            <UtensilsCrossed className="w-12 h-12 mb-3 stroke-1 text-slate-400" />
            <h3 className="text-lg font-bold">No Kitchen Orders Found</h3>
            <p className="text-xs max-w-sm mt-1">
              {searchQuery ? `No active tickets match "${searchQuery}".` : 'All stations are currently clear and prep is caught up.'}
            </p>
          </div>
        ) : viewMode === 'GRID' ? (
          
          /* ------------------------------------------------------- */
          /* VIEW 1: BENTO TICKET GRID (Commercial Responsive KDS)   */
          /* ------------------------------------------------------- */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
            {filteredOrders.map(order => (
              <KitchenBentoCard
                key={order.id}
                order={order}
                isDark={isDark}
                completedItems={completedItems}
                onToggleItem={toggleItemDone}
                onAdvance={handleAdvanceStatus}
              />
            ))}
          </div>

        ) : viewMode === 'EXPEDITER' ? (
          
          /* ------------------------------------------------------- */
          /* VIEW 2: SPLIT EXPEDITER VIEW (Master Ticket Inspector)  */
          /* ------------------------------------------------------- */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[calc(100vh-190px)] min-h-[500px]">
            
            {/* Left Column: Dense Ticket Queue (5 cols) */}
            <div className={`lg:col-span-5 rounded-2xl border flex flex-col overflow-hidden ${
              isDark ? 'bg-slate-900/70 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
            }`}>
              <div className={`px-4 py-3 border-b flex items-center justify-between text-xs font-bold ${
                isDark ? 'border-slate-800 bg-slate-900' : 'border-slate-100 bg-slate-50'
              }`}>
                <span>Active Queue ({filteredOrders.length} Tickets)</span>
                <span className="text-[11px] opacity-60">Click ticket to inspect</span>
              </div>
              <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 custom-kds-scrollbar">
                {filteredOrders.map(order => {
                  const timing = getOrderTiming(order.createdAt, 15);
                  const isSelected = activeExpediterOrder?.id === order.id;
                  const waiter = getAssignedWaiter(order.tableNumber);

                  return (
                    <div
                      key={order.id}
                      onClick={() => setSelectedOrderId(order.id)}
                      className={`p-3.5 transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isSelected 
                          ? isDark 
                            ? 'bg-blue-600/15 border-l-4 border-l-blue-500' 
                            : 'bg-blue-50/80 border-l-4 border-l-blue-600'
                          : isDark ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-11 h-11 rounded-xl flex flex-col items-center justify-center font-black ${
                          timing.isOverdue
                            ? 'bg-rose-500/20 text-rose-500 border border-rose-500/30'
                            : order.status === 'NEW'
                              ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30'
                              : isDark ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-800'
                        }`}>
                          <span className="text-[10px] uppercase font-bold leading-none">TBL</span>
                          <span className="text-sm font-black leading-none">{order.tableNumber}</span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-xs">#{order.orderNumber}</span>
                            <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-md ${
                              order.status === 'NEW' ? 'bg-amber-500/10 text-amber-500' :
                              order.status === 'PREPARING' ? 'bg-blue-500/10 text-blue-500' :
                              order.status === 'READY' ? 'bg-emerald-500/10 text-emerald-500' :
                              'bg-slate-500/10 text-slate-400'
                            }`}>
                              {order.status}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 truncate max-w-[200px] mt-0.5">
                            {order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className={`text-xs font-mono font-bold block ${
                          timing.isOverdue ? 'text-rose-500 animate-pulse' : 'text-slate-400'
                        }`}>
                          ⏱ {timing.display}
                        </span>
                        <span className="text-[10px] opacity-60 block mt-0.5">
                          {waiter.name}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column: High-Detail Ticket Plating Canvas (7 cols) */}
            <div className={`lg:col-span-7 rounded-2xl border flex flex-col overflow-hidden ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              {activeExpediterOrder ? (
                <div className="flex-1 flex flex-col overflow-hidden">
                  
                  {/* Master Header */}
                  <div className={`p-4 border-b flex items-center justify-between ${
                    isDark ? 'bg-slate-800/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-black flex flex-col items-center justify-center shadow-md">
                        <span className="text-[9px] uppercase tracking-wider font-bold">TABLE</span>
                        <span className="text-base leading-none">{activeExpediterOrder.tableNumber}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-lg font-black font-display tracking-tight">
                            Ticket #{activeExpediterOrder.orderNumber}
                          </h2>
                          <span className="text-xs font-mono opacity-50 font-normal">
                            (ID: {activeExpediterOrder.id})
                          </span>
                        </div>
                        <p className="text-xs text-slate-400">
                          Server: <strong className="text-slate-200">{getAssignedWaiter(activeExpediterOrder.tableNumber).name}</strong> • Zone {getAssignedWaiter(activeExpediterOrder.tableNumber).zone} • Dine-In Order
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      {(() => {
                        const timing = getOrderTiming(activeExpediterOrder.createdAt, 15);
                        return (
                          <div className={`px-3 py-1.5 rounded-xl border text-center ${
                            timing.isOverdue 
                              ? 'bg-rose-500/10 border-rose-500/30 text-rose-500' 
                              : isDark ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-white border-slate-200 text-slate-800'
                          }`}>
                            <span className="text-[10px] font-bold uppercase tracking-wider block">Prep Elapsed</span>
                            <span className="text-sm font-black font-mono">{timing.display}</span>
                            {timing.isOverdue && (
                              <span className="text-[10px] font-bold block text-rose-500 leading-none mt-0.5">
                                +{timing.overdueMins}m Overdue
                              </span>
                            )}
                          </div>
                        );
                      })()}
                    </div>
                  </div>

                  {/* Checklist of Dishes */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-kds-scrollbar">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                      <span>Plating Item Checklist (Tap item to check off)</span>
                      <span>{activeExpediterOrder.items.length} Distinct Dishes</span>
                    </div>

                    {activeExpediterOrder.items.map((item, idx) => {
                      const itemKey = `${activeExpediterOrder.id}-${idx}`;
                      const isDone = completedItems[itemKey];
                      const isVeg = /veg|paneer|dosa|idli|coffee|vada|kesari|papad|poori/i.test(item.name);

                      return (
                        <div
                          key={idx}
                          onClick={() => toggleItemDone(activeExpediterOrder.id, idx)}
                          className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                            isDone 
                              ? isDark 
                                ? 'bg-slate-800/40 border-slate-800 opacity-50' 
                                : 'bg-slate-50 border-slate-200 opacity-60'
                              : isDark 
                                ? 'bg-slate-800/90 border-slate-700/80 hover:border-slate-600' 
                                : 'bg-white border-slate-200 hover:border-blue-400 shadow-xs'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <button className="text-slate-400 hover:text-emerald-500 transition-colors">
                              {isDone ? (
                                <CheckSquare className="w-5 h-5 text-emerald-500" />
                              ) : (
                                <Square className="w-5 h-5" />
                              )}
                            </button>
                            
                            <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-500 font-black text-sm flex items-center justify-center">
                              {item.quantity}×
                            </div>

                            <div>
                              <div className="flex items-center gap-2">
                                <span className={`w-2.5 h-2.5 rounded-xs border flex items-center justify-center p-0.5 ${
                                  isVeg ? 'border-emerald-500' : 'border-rose-500'
                                }`}>
                                  <span className={`w-full h-full rounded-full ${isVeg ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                                </span>
                                <span className={`font-bold text-sm ${isDone ? 'line-through text-slate-400' : ''}`}>
                                  {item.name}
                                </span>
                              </div>

                              <div className="flex items-center gap-2 mt-1">
                                {item.spiceLevel && (
                                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-slate-700/40 text-slate-300">
                                    Spice: {item.spiceLevel}
                                  </span>
                                )}
                                {item.customizations && item.customizations.length > 0 && (
                                  <span className="text-[10px] font-medium text-slate-400">
                                    +{item.customizations.join(', ')}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="text-right">
                            {isDone ? (
                              <span className="text-[11px] font-bold text-emerald-500 flex items-center gap-1">
                                <Check className="w-3.5 h-3.5" /> Plated
                              </span>
                            ) : (
                              <span className="text-[11px] font-medium text-amber-500">
                                In Cooking
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}

                    {/* Customer Instructions Alert */}
                    {activeExpediterOrder.items.some(i => i.specialInstructions) && (
                      <div className="p-3.5 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-400 text-xs flex items-start gap-2.5">
                        <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <div>
                          <strong className="block font-bold uppercase text-[10px] tracking-wider text-amber-300">
                            Customer Special Instruction:
                          </strong>
                          <span>"{activeExpediterOrder.items.find(i => i.specialInstructions)?.specialInstructions}"</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Expediter Stage Bump Bar */}
                  <div className={`p-4 border-t flex items-center justify-between gap-3 ${
                    isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          showToast(`Server ${getAssignedWaiter(activeExpediterOrder.tableNumber).name} paged to Table ${activeExpediterOrder.tableNumber}`);
                        }}
                        className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                          isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-white border border-slate-200 hover:bg-slate-100 text-slate-700'
                        }`}
                      >
                        <Send className="w-3.5 h-3.5 text-blue-500" />
                        <span>Page Server</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      {activeExpediterOrder.status === 'NEW' && (
                        <button
                          onClick={(e) => handleAdvanceStatus(activeExpediterOrder.id, 'NEW', e)}
                          className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer transition-transform active:scale-95"
                        >
                          <Flame className="w-4 h-4 fill-slate-950" />
                          <span>Fire to Cooking Line</span>
                        </button>
                      )}

                      {activeExpediterOrder.status === 'PREPARING' && (
                        <button
                          onClick={(e) => handleAdvanceStatus(activeExpediterOrder.id, 'PREPARING', e)}
                          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/20 cursor-pointer transition-transform active:scale-95"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Mark Plated &amp; Ready</span>
                        </button>
                      )}

                      {activeExpediterOrder.status === 'READY' && (
                        <button
                          onClick={(e) => handleAdvanceStatus(activeExpediterOrder.id, 'READY', e)}
                          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs flex items-center gap-2 shadow-lg shadow-blue-600/20 cursor-pointer transition-transform active:scale-95"
                        >
                          <CheckCheck className="w-4 h-4" />
                          <span>Bump / Served to Table</span>
                        </button>
                      )}

                      {activeExpediterOrder.status === 'COMPLETED' && (
                        <span className="px-4 py-2 rounded-xl bg-slate-800 text-slate-400 text-xs font-bold flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                          <span>Order Completed</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-400 text-xs">
                  Select an order ticket from the queue on the left
                </div>
              )}
            </div>
          </div>

        ) : (
          
          /* ------------------------------------------------------- */
          /* VIEW 3: PIPELINE COLUMNS (Refined Modern 4-Stage Lanes) */
          /* ------------------------------------------------------- */
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 h-[calc(100vh-190px)]">
            {(['NEW', 'PREPARING', 'READY', 'COMPLETED'] as const).map(colStatus => {
              const colOrders = filteredOrders.filter(o => o.status === colStatus);
              const headerMeta = {
                NEW: { label: 'New Tickets', color: 'border-t-amber-500', countColor: 'text-amber-500 bg-amber-500/10' },
                PREPARING: { label: 'Cooking Line', color: 'border-t-blue-500', countColor: 'text-blue-500 bg-blue-500/10' },
                READY: { label: 'Ready to Expedite', color: 'border-t-emerald-500', countColor: 'text-emerald-500 bg-emerald-500/10' },
                COMPLETED: { label: 'Served & Cleared', color: 'border-t-slate-500', countColor: 'text-slate-400 bg-slate-500/10' },
              }[colStatus];

              return (
                <div 
                  key={colStatus} 
                  className={`rounded-2xl border border-t-4 ${headerMeta.color} flex flex-col overflow-hidden ${
                    isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
                  }`}
                >
                  <div className={`px-4 py-3 border-b flex items-center justify-between ${
                    isDark ? 'border-slate-800 bg-slate-900' : 'border-slate-100 bg-slate-50'
                  }`}>
                    <span className="font-extrabold text-xs uppercase tracking-wider">
                      {headerMeta.label}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-black ${headerMeta.countColor}`}>
                      {colOrders.length}
                    </span>
                  </div>

                  <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-kds-scrollbar">
                    {colOrders.length === 0 ? (
                      <div className="h-40 flex items-center justify-center text-center opacity-40 text-xs">
                        No orders in this stage
                      </div>
                    ) : (
                      colOrders.map(order => (
                        <KitchenBentoCard
                          key={order.id}
                          order={order}
                          isDark={isDark}
                          completedItems={completedItems}
                          onToggleItem={toggleItemDone}
                          onAdvance={handleAdvanceStatus}
                        />
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* ========================================================= */}
      {/* 5. SLIDE-OVER / MODALS (Waiter Calls, 86'd, Chef Switch)   */}
      {/* ========================================================= */}
      
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

      {/* Chef Profile Switcher Modal */}
      {isChefSelectorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className={`max-w-md w-full rounded-2xl border p-5 shadow-2xl ${
            isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <ChefHat className="w-5 h-5 text-amber-500" />
                <h3 className="font-black text-sm font-display">Select Kitchen Station Lead</h3>
              </div>
              <button onClick={() => setIsChefSelectorOpen(false)} className="p-1 rounded-lg hover:bg-slate-800 opacity-60 hover:opacity-100">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 space-y-2 max-h-80 overflow-y-auto custom-kds-scrollbar">
              {authService.getUsers().filter(u => u.role === 'kitchen').map(chef => (
                <div
                  key={chef.id}
                  onClick={() => {
                    setActiveChef(chef);
                    setIsChefSelectorOpen(false);
                    showToast(`Active Station Lead set to ${chef.name}`);
                  }}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    activeChef?.id === chef.id 
                      ? 'bg-blue-600/20 border-blue-500' 
                      : 'bg-slate-800/40 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
                      {chef.name.charAt(0)}
                    </div>
                    <div>
                      <span className="font-bold text-xs block">{chef.name}</span>
                      <span className="text-[10px] opacity-60 block">{chef.title} • PIN: {chef.pin}</span>
                    </div>
                  </div>
                  {activeChef?.id === chef.id && (
                    <Check className="w-4 h-4 text-blue-400" />
                  )}
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setIsChefSelectorOpen(false)}
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

/* ================================================================= */
/* 6. MODULAR KITCHEN BENTO CARD COMPONENT (Authentic KDS Ticket)   */
/* ================================================================= */
interface BentoCardProps {
  order: Order;
  isDark: boolean;
  completedItems: Record<string, boolean>;
  onToggleItem: (orderId: string, idx: number) => void;
  onAdvance: (orderId: string, current: OrderStatus, e?: React.MouseEvent) => void;
}

const KitchenBentoCard: React.FC<BentoCardProps> = ({
  order,
  isDark,
  completedItems,
  onToggleItem,
  onAdvance
}) => {
  const timing = getOrderTiming(order.createdAt, 15);
  const waiter = getAssignedWaiter(order.tableNumber);

  // Status Styling & Action meta
  const statusMeta = {
    NEW: {
      badge: 'bg-amber-500/10 text-amber-500 border border-amber-500/30',
      actionLabel: 'Accept & Cook',
      actionColor: 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-black',
      icon: Flame,
      headerBar: 'border-t-amber-500'
    },
    PREPARING: {
      badge: 'bg-blue-500/10 text-blue-500 border border-blue-500/30',
      actionLabel: 'Mark Ready',
      actionColor: 'bg-emerald-600 hover:bg-emerald-500 text-white font-black',
      icon: CheckCircle2,
      headerBar: 'border-t-blue-500'
    },
    READY: {
      badge: 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/30',
      actionLabel: 'Deliver to Table',
      actionColor: 'bg-blue-600 hover:bg-blue-500 text-white font-black',
      icon: CheckCheck,
      headerBar: 'border-t-emerald-500'
    },
    COMPLETED: {
      badge: 'bg-slate-500/10 text-slate-400 border border-slate-500/30',
      actionLabel: 'Delivered',
      actionColor: 'bg-slate-800 text-slate-400 cursor-default',
      icon: Check,
      headerBar: 'border-t-slate-700'
    }
  }[order.status];

  return (
    <div className={`rounded-2xl border border-t-4 ${statusMeta.headerBar} flex flex-col justify-between transition-all duration-150 overflow-hidden shadow-xs hover:shadow-md ${
      isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'
    }`}>
      
      {/* 1. Ticket Header Strip */}
      <div className={`p-3.5 border-b flex items-start justify-between gap-2 ${
        isDark ? 'bg-slate-800/40 border-slate-800' : 'bg-slate-50 border-slate-100'
      }`}>
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 text-white flex flex-col items-center justify-center font-black shadow-xs">
            <span className="text-[9px] uppercase font-bold tracking-wider text-amber-400 leading-none">TBL</span>
            <span className="text-sm font-black leading-none mt-0.5">{order.tableNumber}</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-mono font-extrabold text-xs">#{order.orderNumber}</span>
              <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-md ${statusMeta.badge}`}>
                {order.status}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
              <UserCheck className="w-3 h-3 text-slate-400" />
              <span>{waiter.name}</span>
              <span className="text-[10px] opacity-60">({waiter.zone})</span>
            </p>
          </div>
        </div>

        {/* Dynamic Timing Pill */}
        <div className="text-right">
          <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg font-mono text-xs font-bold border ${
            timing.isOverdue 
              ? 'bg-rose-500/15 border-rose-500/30 text-rose-500 animate-pulse' 
              : isDark ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-white border-slate-200 text-slate-700'
          }`}>
            <Clock className="w-3 h-3" />
            <span>{timing.display}</span>
          </div>
          {timing.isOverdue && (
            <span className="text-[9px] font-bold text-rose-500 block text-right mt-0.5">
              +{timing.overdueMins}m RUSH
            </span>
          )}
        </div>
      </div>

      {/* 2. Itemized Food Prep Checklist */}
      <div className="p-3.5 flex-1 space-y-2.5 overflow-y-auto max-h-72 custom-kds-scrollbar">
        {order.items.map((item, idx) => {
          const itemKey = `${order.id}-${idx}`;
          const isDone = completedItems[itemKey];
          const isVeg = /veg|paneer|dosa|idli|coffee|vada|kesari|papad|poori/i.test(item.name);

          return (
            <div
              key={idx}
              onClick={() => onToggleItem(order.id, idx)}
              className={`p-2 rounded-xl transition-all cursor-pointer flex items-start gap-2.5 border ${
                isDone 
                  ? isDark 
                    ? 'bg-slate-800/30 border-slate-800 opacity-40' 
                    : 'bg-slate-100/60 border-slate-200 opacity-50'
                  : isDark 
                    ? 'bg-slate-800/70 border-slate-700/60 hover:border-slate-600' 
                    : 'bg-slate-50/80 border-slate-200 hover:border-blue-400'
              }`}
            >
              <div className="pt-0.5 text-slate-400">
                {isDone ? (
                  <CheckSquare className="w-4 h-4 text-emerald-500" />
                ) : (
                  <Square className="w-4 h-4" />
                )}
              </div>

              <div className="w-5 h-5 rounded-md bg-amber-500/10 text-amber-500 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                {item.quantity}×
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-xs border flex items-center justify-center shrink-0 ${
                    isVeg ? 'border-emerald-500' : 'border-rose-500'
                  }`}>
                    <span className={`w-1 h-1 rounded-full ${isVeg ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                  </span>
                  <span className={`font-bold text-xs truncate ${isDone ? 'line-through text-slate-400' : ''}`}>
                    {item.name}
                  </span>
                </div>

                {item.spiceLevel && (
                  <span className="text-[10px] text-slate-400 font-medium block mt-0.5">
                    Spice: {item.spiceLevel}
                  </span>
                )}
              </div>
            </div>
          );
        })}

        {/* Customer Special Instruction Box */}
        {order.items.some(i => i.specialInstructions) && (
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[11px] flex items-start gap-1.5">
            <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            <span className="font-medium italic truncate">"{order.items.find(i => i.specialInstructions)?.specialInstructions}"</span>
          </div>
        )}
      </div>

      {/* 3. Urgency Progress Bar */}
      <div className="w-full bg-slate-200 dark:bg-slate-800 h-1 overflow-hidden">
        <div 
          className={`h-full transition-all duration-300 ${
            timing.isOverdue ? 'bg-rose-500' : order.status === 'READY' ? 'bg-emerald-500' : 'bg-amber-500'
          }`}
          style={{ width: `${Math.min(100, timing.percent)}%` }}
        />
      </div>

      {/* 4. Action Button Footer */}
      <div className={`p-3 border-t flex items-center gap-2 ${
        isDark ? 'bg-slate-800/20 border-slate-800' : 'bg-slate-50 border-slate-100'
      }`}>
        <button
          disabled={order.status === 'COMPLETED'}
          onClick={(e) => onAdvance(order.id, order.status, e)}
          className={`w-full py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer transition-all active:scale-98 ${
            statusMeta.actionColor
          }`}
        >
          <statusMeta.icon className="w-4 h-4" />
          <span>{statusMeta.actionLabel}</span>
        </button>
      </div>

    </div>
  );
};

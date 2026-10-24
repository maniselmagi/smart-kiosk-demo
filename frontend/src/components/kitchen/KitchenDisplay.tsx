import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useKiosk } from '../../context/KioskContext';
import type { OrderStatus, Order } from '../../types';
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
  Columns,
  LayoutGrid,
  UserCheck,
  Send,
  Timer
} from 'lucide-react';
import { getAssignedWaiter, WAITER_ZONES } from '../../utils/waiterAssignment';
import { authService, UserCredential } from '../../services/authService';

// Pleasant dual-tone kitchen order chime
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
    gain1.gain.setValueAtTime(0.16, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.35);

    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880, now + 0.1);
    gain2.gain.setValueAtTime(0.2, now + 0.1);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.1);
    osc2.stop(now + 0.5);
  } catch {
    // ignore
  }
}

// Elapsed timer calculation
function getOrderTiming(createdAt: string | undefined, targetMinutes: number = 15) {
  if (!createdAt) {
    return { display: 'Just now', minutes: 1, percent: 10, isOverdue: false, overdueMins: 0 };
  }
  const t = new Date(createdAt).getTime();
  if (isNaN(t) || t <= 0) {
    return { display: 'Just now', minutes: 1, percent: 10, isOverdue: false, overdueMins: 0 };
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
  const percent = Math.min(100, Math.round((effectiveMins / target) * 100));

  return { display, minutes: effectiveMins, percent, isOverdue, overdueMins };
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

  // Station and Stage filtering
  const [selectedStation, setSelectedStation] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | OrderStatus>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [layoutMode, setLayoutMode] = useState<'kanban' | 'grid'>('kanban');

  // Modals
  const [isWaiterCallsOpen, setIsWaiterCallsOpen] = useState(false);
  const [isSoldOutOpen, setIsSoldOutOpen] = useState(false);
  const [isChefSelectorOpen, setIsChefSelectorOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Active Chef User
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

  // Clock
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

  // Operational metrics
  const pendingAlerts = staffAlerts.filter((a) => a.status === 'PENDING');
  const soldOutItems = menuItems.filter((i) => !i.isAvailable);

  const metrics = useMemo(() => {
    return {
      newCount: displayOrders.filter(o => o.status === 'NEW').length,
      prepCount: displayOrders.filter(o => o.status === 'PREPARING').length,
      readyCount: displayOrders.filter(o => o.status === 'READY').length,
      completedCount: displayOrders.filter(o => o.status === 'COMPLETED').length,
      totalActive: displayOrders.filter(o => o.status !== 'COMPLETED').length,
    };
  }, [displayOrders]);

  const handleAdvance = (order: Order, next: OrderStatus) => {
    updateOrderStatus(order.id, next);
    if (isAudioEnabled) playKitchenChime();
    showToast(`Order #${order.orderNumber} (Table ${order.tableNumber}) updated to ${next}`);
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
      isDark ? 'bg-slate-950 text-slate-100' : 'bg-[#F4F6F9] text-slate-800'
    }`}>
      
      {/* =========================================================================
          TOP NAV: MATCHES RESTAURANT MANAGEMENT DASHBOARD (RIDAY STYLE)
      ========================================================================= */}
      <header className={`border-b px-4 py-3 md:px-6 transition-colors shadow-2xs ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/90'
      }`}>
        <div className="max-w-[1920px] mx-auto flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          
          {/* Left Brand Emblem & Title */}
          <div className="flex items-center flex-wrap gap-3">
            {!isStandaloneRole && (
              <button
                onClick={() => setView('hub')}
                className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                  isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700' : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
                title="Back to Landing Hub"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}

            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-black shadow-md shadow-blue-500/20 shrink-0">
                <ChefHat className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className={`text-lg font-black tracking-tight font-display ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Kitchen Display System
                  </h1>
                  <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-[10px] font-black tracking-wider">
                    KDS LIVE
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <span>Royal Ember</span>
                  <span>/</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Indiranagar Flagship Kitchen Line</span>
                </div>
              </div>
            </div>

            {/* Search Input in Top Bar */}
            <div className="relative w-72 hidden xl:block ml-4">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search orders, dishes, table..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-9 pr-8 py-2 rounded-xl text-xs font-medium border transition-colors outline-hidden ${
                  isDark
                    ? 'bg-slate-800/80 border-slate-700 text-white placeholder-slate-400 focus:border-blue-500'
                    : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500'
                }`}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Right Header Navigation & Operational Tools */}
          <div className="flex items-center flex-wrap gap-2 justify-between lg:justify-end">
            
            {/* Waiter Calls Badge Button */}
            <button
              onClick={() => setIsWaiterCallsOpen(true)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                pendingAlerts.length > 0
                  ? 'bg-rose-50 text-rose-700 border-rose-300 dark:bg-rose-950/60 dark:text-rose-300'
                  : isDark
                    ? 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
              title="View Table Waiter Calls"
            >
              <Bell className="w-3.5 h-3.5" />
              <span>Waiter Calls</span>
              {pendingAlerts.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-rose-600 text-white text-[10px] font-black">
                  {pendingAlerts.length}
                </span>
              )}
            </button>

            {/* Sold-Out Items Badge Button */}
            <button
              onClick={() => setIsSoldOutOpen(true)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                soldOutItems.length > 0
                  ? 'bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300'
                  : isDark
                    ? 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
              title="Manage Sold-Out Dishes"
            >
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              <span>Sold-Out ({soldOutItems.length})</span>
            </button>

            {/* Audio Alerts Toggle */}
            <button
              onClick={toggleAudio}
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                isAudioEnabled
                  ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800'
                  : isDark
                    ? 'bg-slate-800 text-slate-400 border-slate-700'
                    : 'bg-slate-50 text-slate-400 border-slate-200'
              }`}
              title={isAudioEnabled ? 'Chime sound is active' : 'Chime sound is muted'}
            >
              {isAudioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Fullscreen Toggle */}
            <button
              onClick={toggleFullscreen}
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                isDark ? 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
              title="Toggle Fullscreen"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                isDark ? 'bg-slate-800 text-amber-400 border-slate-700 hover:bg-slate-700' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
              title="Toggle Light / Dark Mode"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Active Chef Lead Profile Badge */}
            <button
              onClick={() => setIsChefSelectorOpen(true)}
              className={`flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                isDark ? 'bg-slate-800 text-white border-slate-700 hover:bg-slate-700' : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100'
              }`}
              title="Active Station Lead"
            >
              <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-black">
                {activeChef?.name.charAt(0) || 'C'}
              </div>
              <div className="text-left leading-tight hidden sm:block">
                <span className="block font-black text-xs">{activeChef?.name || 'Chef Lead'}</span>
                <span className="block text-[10px] text-slate-400 font-normal">@{activeChef?.username}</span>
              </div>
            </button>

            {/* Real-time Clock */}
            <div className={`px-3 py-1.5 rounded-xl border font-mono text-xs font-bold flex items-center gap-1.5 ${
              isDark ? 'bg-slate-800 text-slate-300 border-slate-700' : 'bg-slate-50 text-slate-700 border-slate-200'
            }`}>
              <Clock className="w-3.5 h-3.5 text-blue-500" />
              <span>{clockTime}</span>
            </div>

          </div>

        </div>
      </header>

      {/* =========================================================================
          EXECUTIVE KPI METRICS CARDS (4 IN A ROW)
          (Explicitly styled with high-contrast text to avoid white-on-white bugs)
      ========================================================================= */}
      <section className="px-4 pt-4 md:px-6 max-w-[1920px] mx-auto w-full">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          
          {/* Card 1: New Tickets */}
          <div 
            onClick={() => setStatusFilter(statusFilter === 'NEW' ? 'ALL' : 'NEW')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer ${
              statusFilter === 'NEW'
                ? 'ring-2 ring-amber-500/50 bg-amber-50/70 dark:bg-amber-950/40 border-amber-300'
                : isDark ? 'bg-slate-900 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200/80 shadow-2xs hover:shadow-xs'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  New Tickets
                </span>
                <div className={`text-3xl font-black font-display mt-0.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {metrics.newCount}
                </div>
                <span className="text-[11px] text-amber-600 font-bold flex items-center gap-1 mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  Awaiting Acceptance
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-600 shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Card 2: In Preparation */}
          <div 
            onClick={() => setStatusFilter(statusFilter === 'PREPARING' ? 'ALL' : 'PREPARING')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer ${
              statusFilter === 'PREPARING'
                ? 'ring-2 ring-blue-500/50 bg-blue-50/70 dark:bg-blue-950/40 border-blue-300'
                : isDark ? 'bg-slate-900 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200/80 shadow-2xs hover:shadow-xs'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Cooking Line
                </span>
                <div className={`text-3xl font-black font-display mt-0.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {metrics.prepCount}
                </div>
                <span className="text-[11px] text-blue-600 font-bold flex items-center gap-1 mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  Station In Progress
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 shrink-0">
                <Flame className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Card 3: Ready for Pickup */}
          <div 
            onClick={() => setStatusFilter(statusFilter === 'READY' ? 'ALL' : 'READY')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer ${
              statusFilter === 'READY'
                ? 'ring-2 ring-emerald-500/50 bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-300'
                : isDark ? 'bg-slate-900 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200/80 shadow-2xs hover:shadow-xs'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Ready to Serve
                </span>
                <div className={`text-3xl font-black font-display mt-0.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {metrics.readyCount}
                </div>
                <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1 mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Waiter Alerted
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Card 4: Total Completed Today */}
          <div 
            onClick={() => setStatusFilter(statusFilter === 'COMPLETED' ? 'ALL' : 'COMPLETED')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer ${
              statusFilter === 'COMPLETED'
                ? 'ring-2 ring-purple-500/50 bg-purple-50/70 dark:bg-purple-950/40 border-purple-300'
                : isDark ? 'bg-slate-900 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200/80 shadow-2xs hover:shadow-xs'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Served Today
                </span>
                <div className={`text-3xl font-black font-display mt-0.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {metrics.completedCount}
                </div>
                <span className="text-[11px] text-purple-600 font-bold flex items-center gap-1 mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                  Total Finished
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 flex items-center justify-center text-purple-600 shrink-0">
                <UtensilsCrossed className="w-6 h-6" />
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          CONTROL TOOLBAR: STATION SELECTOR & LAYOUT TOGGLE
      ========================================================================= */}
      <section className="px-4 py-3 md:px-6 max-w-[1920px] mx-auto w-full">
        <div className={`p-3 rounded-2xl border flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/80 shadow-2xs'
        }`}>
          
          {/* Station Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {[
              { id: 'ALL', label: 'All Stations' },
              { id: 'HOT', label: 'Hot Cooking' },
              { id: 'TANDOOR', label: 'Tandoor & Breads' },
              { id: 'STARTER', label: 'Starters & Tiffin' },
              { id: 'BEVERAGE', label: 'Drinks & Sweets' },
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => setSelectedStation(st.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  selectedStation === st.id
                    ? 'bg-blue-600 text-white shadow-xs'
                    : isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>

          {/* Right Toolbar Controls */}
          <div className="flex items-center gap-3 justify-between md:justify-end">
            
            {/* Waiter zone badges */}
            <div className="hidden lg:flex items-center gap-1.5">
              {WAITER_ZONES.map((zone) => (
                <span
                  key={zone.rangeLabel}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold border flex items-center gap-1 ${zone.waiter.color}`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-current" />
                  {zone.rangeLabel}: {zone.waiter.initial}
                </span>
              ))}
            </div>

            {/* Layout Toggle */}
            <div className={`p-1 rounded-xl border flex items-center gap-1 ${
              isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'
            }`}>
              <button
                onClick={() => setLayoutMode('kanban')}
                className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                  layoutMode === 'kanban'
                    ? isDark ? 'bg-slate-700 text-white shadow-xs' : 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
                title="Kanban Board View"
              >
                <Columns className="w-3.5 h-3.5" />
                <span className="hidden sm:inline text-[11px]">Kanban</span>
              </button>

              <button
                onClick={() => setLayoutMode('grid')}
                className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                  layoutMode === 'grid'
                    ? isDark ? 'bg-slate-700 text-white shadow-xs' : 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
                title="Grid Cards View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="hidden sm:inline text-[11px]">Grid</span>
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          MAIN ORDER BOARD: CLEAN KANBAN OR GRID
      ========================================================================= */}
      <main className="flex-1 px-4 pb-6 md:px-6 max-w-[1920px] mx-auto w-full">
        
        {layoutMode === 'kanban' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-start">
            
            {[
              {
                status: 'NEW' as OrderStatus,
                title: 'New Tickets',
                sub: 'Awaiting Acceptance',
                count: metrics.newCount,
                dotColor: 'bg-amber-500',
                badgeBg: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800',
                next: 'PREPARING' as OrderStatus,
                actionText: 'Accept & Cook',
                actionClass: 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              },
              {
                status: 'PREPARING' as OrderStatus,
                title: 'Cooking Line',
                sub: 'Under Chef Preparation',
                count: metrics.prepCount,
                dotColor: 'bg-blue-500',
                badgeBg: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800',
                next: 'READY' as OrderStatus,
                actionText: 'Mark Ready to Serve',
                actionClass: 'bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white shadow-md shadow-emerald-600/20'
              },
              {
                status: 'READY' as OrderStatus,
                title: 'Ready to Serve',
                sub: 'Waiter Alerted',
                count: metrics.readyCount,
                dotColor: 'bg-emerald-500',
                badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800',
                next: 'COMPLETED' as OrderStatus,
                actionText: 'Deliver to Table',
                actionClass: 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md shadow-blue-600/20'
              },
              {
                status: 'COMPLETED' as OrderStatus,
                title: 'Served & Cleared',
                sub: 'Finished & Delivered',
                count: metrics.completedCount,
                dotColor: 'bg-slate-400',
                badgeBg: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
                next: 'COMPLETED' as OrderStatus,
                actionText: '✓ Served',
                actionClass: 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-default'
              }
            ].map((col) => {
              const ordersInCol = filteredOrders.filter(o => o.status === col.status);

              return (
                <div
                  key={col.status}
                  className={`rounded-2xl border flex flex-col min-h-[580px] transition-colors ${
                    isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-100/60 border-slate-200/80'
                  }`}
                >
                  
                  {/* Column Header */}
                  <div className={`p-4 rounded-t-2xl border-b flex items-center justify-between ${
                    isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/80'
                  }`}>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${col.dotColor}`} />
                        <h2 className={`font-black text-sm uppercase tracking-wide font-display ${
                          isDark ? 'text-white' : 'text-slate-900'
                        }`}>
                          {col.title}
                        </h2>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {col.sub}
                      </p>
                    </div>

                    <span className={`px-2.5 py-1 rounded-xl text-xs font-mono font-black border ${col.badgeBg}`}>
                      {ordersInCol.length}
                    </span>
                  </div>

                  {/* Cards List in this Column */}
                  <div className="p-3 space-y-3 flex-1 overflow-y-auto max-h-[calc(100vh-270px)] custom-kds-scrollbar">
                    {ordersInCol.length === 0 ? (
                      <div className={`py-16 text-center rounded-2xl border border-dashed ${
                        isDark ? 'border-slate-800 text-slate-500' : 'border-slate-200 text-slate-400'
                      }`}>
                        <CheckCheck className="w-8 h-8 mx-auto mb-1.5 opacity-40" />
                        <span className="text-xs font-bold block">No {col.title}</span>
                        <span className="text-[11px] opacity-70">Kitchen line caught up</span>
                      </div>
                    ) : (
                      ordersInCol.map((order) => (
                        <KdsOrderCard
                          key={order.id}
                          order={order}
                          isDark={isDark}
                          actionText={col.actionText}
                          actionClass={col.actionClass}
                          onAdvance={() => handleAdvance(order, col.next)}
                        />
                      ))
                    )}
                  </div>

                </div>
              );
            })}

          </div>
        ) : (
          /* GRID VIEW */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredOrders.length === 0 ? (
              <div className="col-span-full py-20 text-center text-slate-400">
                <UtensilsCrossed className="w-10 h-10 mx-auto mb-2 opacity-50" />
                <span className="text-sm font-bold block">No tickets matching filter</span>
              </div>
            ) : (
              filteredOrders.map((order) => {
                const nextStatus: OrderStatus = 
                  order.status === 'NEW' ? 'PREPARING' :
                  order.status === 'PREPARING' ? 'READY' :
                  'COMPLETED';

                const actionText = 
                  order.status === 'NEW' ? 'Accept & Cook' :
                  order.status === 'PREPARING' ? 'Mark Ready to Serve' :
                  order.status === 'READY' ? 'Deliver to Table' :
                  '✓ Served';

                const actionClass = 
                  order.status === 'NEW' ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-amber-500/20' :
                  order.status === 'PREPARING' ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-emerald-600/20' :
                  order.status === 'READY' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-blue-600/20' :
                  'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-default';

                return (
                  <KdsOrderCard
                    key={order.id}
                    order={order}
                    isDark={isDark}
                    actionText={actionText}
                    actionClass={actionClass}
                    onAdvance={() => handleAdvance(order, nextStatus)}
                  />
                );
              })
            )}
          </div>
        )}

      </main>

      {/* =========================================================================
          MODALS
      ========================================================================= */}
      {/* Waiter Calls */}
      {isWaiterCallsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className={`w-full max-w-xl rounded-3xl border shadow-2xl overflow-hidden ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className={`p-5 border-b flex items-center justify-between ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h3 className={`font-black text-lg font-display ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Table Assistance Requests
                  </h3>
                  <p className="text-xs text-slate-500">Live guest calls from table kiosks</p>
                </div>
              </div>
              <button onClick={() => setIsWaiterCallsOpen(false)} className="p-2 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 max-h-[60vh] overflow-y-auto space-y-3">
              {staffAlerts.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-xs">
                  <CheckCheck className="w-8 h-8 mx-auto mb-1.5 opacity-50" />
                  <span>No active waiter calls right now.</span>
                </div>
              ) : (
                staffAlerts.map((alert) => {
                  const waiter = getAssignedWaiter(alert.tableNumber);
                  const isPending = alert.status === 'PENDING';

                  return (
                    <div
                      key={alert.id}
                      className={`p-4 rounded-2xl border flex items-center justify-between gap-3 ${
                        isPending
                          ? 'bg-amber-50/50 border-amber-200 dark:bg-amber-950/40 dark:border-amber-800'
                          : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-70'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl font-mono font-black text-xs flex items-center justify-center ${
                          isPending ? 'bg-amber-500 text-slate-950' : 'bg-slate-700 text-white'
                        }`}>
                          T#{alert.tableNumber}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className={`font-black text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                              Table {alert.tableNumber}: {alert.type}
                            </h4>
                            <span className={`px-2 py-0.2 rounded text-[10px] font-bold border ${waiter.color}`}>
                              Waiter {waiter.initial} ({waiter.name})
                            </span>
                          </div>
                          <span className="text-xs text-slate-400">
                            Logged at {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>

                      {isPending ? (
                        <button
                          onClick={() => {
                            resolveStaffAlert(alert.id);
                            showToast(`Table ${alert.tableNumber} call cleared`);
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors cursor-pointer"
                        >
                          Clear
                        </button>
                      ) : (
                        <span className="text-xs font-bold text-slate-400">Resolved ✓</span>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            <div className={`p-4 border-t flex justify-end ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <button
                onClick={() => setIsWaiterCallsOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sold Out */}
      {isSoldOutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className={`w-full max-w-2xl rounded-3xl border shadow-2xl overflow-hidden ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className={`p-5 border-b flex items-center justify-between ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <h3 className={`font-black text-lg font-display ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Dish Availability &amp; 86'd List
                  </h3>
                  <p className="text-xs text-slate-500">Live syncs with table kiosks</p>
                </div>
              </div>
              <button onClick={() => setIsSoldOutOpen(false)} className="p-2 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 max-h-[60vh] overflow-y-auto space-y-2.5">
              {menuItems.map((item) => (
                <div
                  key={item.id}
                  className={`p-3 rounded-2xl border flex items-center justify-between gap-3 ${
                    item.isAvailable
                      ? isDark ? 'bg-slate-800/40 border-slate-800' : 'bg-slate-50 border-slate-200'
                      : 'bg-rose-50 border-rose-200 dark:bg-rose-950/40 dark:border-rose-800'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img src={item.image} alt={item.name} className="w-11 h-11 rounded-xl object-cover shrink-0" />
                    <div className="min-w-0">
                      <h4 className={`font-bold text-xs truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {item.name}
                      </h4>
                      <p className="text-[11px] text-slate-400">₹{item.price} • {item.category}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      toggleItemAvailability(item.id);
                      showToast(`${item.name} set to ${item.isAvailable ? 'Sold Out' : 'Available'}`);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      item.isAvailable
                        ? 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-rose-600 hover:text-white'
                        : 'bg-rose-600 text-white'
                    }`}
                  >
                    {item.isAvailable ? 'Mark Sold Out' : 'Sold Out ✕ (Re-enable)'}
                  </button>
                </div>
              ))}
            </div>

            <div className={`p-4 border-t flex justify-end ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <button
                onClick={() => setIsSoldOutOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-bold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chef Selector */}
      {isChefSelectorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className={`w-full max-w-md rounded-3xl border shadow-2xl overflow-hidden ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className={`p-5 border-b flex items-center justify-between ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className={`font-black text-lg font-display ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Active Kitchen Lead
                  </h3>
                  <p className="text-xs text-slate-500">Switch current station operator</p>
                </div>
              </div>
              <button onClick={() => setIsChefSelectorOpen(false)} className="p-2 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-2.5">
              {authService.getUsers().filter(u => u.role === 'kitchen' || u.role === 'management').map((user) => {
                const isSelected = activeChef?.username === user.username;
                return (
                  <button
                    key={user.id}
                    onClick={() => {
                      setActiveChef(user);
                      authService.setCurrentUser(user);
                      setIsChefSelectorOpen(false);
                      showToast(`Station operator switched to ${user.name}`);
                    }}
                    className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50 border-blue-300 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200'
                        : isDark
                          ? 'bg-slate-800/60 border-slate-700 text-slate-200 hover:bg-slate-800'
                          : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-sm">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <span className="font-bold text-sm block">{user.name}</span>
                        <span className="text-xs text-slate-400">@{user.username} • {user.title || user.department}</span>
                      </div>
                    </div>
                    {isSelected && (
                      <span className="px-2 py-0.5 rounded-md bg-blue-600 text-white text-[10px] font-black">
                        ACTIVE
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className={`p-4 border-t flex justify-end ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <button
                onClick={() => setIsChefSelectorOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className={`border-t px-4 py-2.5 text-xs flex flex-col sm:flex-row items-center justify-between gap-2 ${
        isDark ? 'bg-slate-900 border-slate-800 text-slate-500' : 'bg-white border-slate-200 text-slate-400'
      }`}>
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-700 dark:text-slate-300">Royal Ember KDS</span>
          <span>•</span>
          <span>Synchronized with Table Kiosks &amp; Supabase Cloud</span>
        </div>
        <div className="flex items-center gap-3 text-[11px]">
          <span>Lead: <strong>{activeChef?.name}</strong></span>
          <span>•</span>
          <span>Chimes: <strong>{isAudioEnabled ? 'Active' : 'Muted'}</strong></span>
        </div>
      </footer>

    </div>
  );
};

// =============================================================================
// SUBCOMPONENT: BRAND NEW REFINED RESTAURANT ORDER CARD
// =============================================================================
interface KdsOrderCardProps {
  order: Order;
  isDark: boolean;
  actionText: string;
  actionClass: string;
  onAdvance: () => void;
}

const KdsOrderCard: React.FC<KdsOrderCardProps> = ({ order, isDark, actionText, actionClass, onAdvance }) => {
  const timing = getOrderTiming(order.createdAt, order.estimatedPrepTime);
  const waiter = getAssignedWaiter(order.tableNumber);
  const compItem = order.items.find(i => i.price === 0 || i.name.includes('Complimentary') || i.name.includes('🎁'));

  return (
    <article className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
      isDark 
        ? 'bg-slate-900 border-slate-800 hover:border-slate-700 shadow-sm' 
        : 'bg-white border-slate-200/90 hover:border-slate-300 shadow-xs hover:shadow-sm'
    }`}>
      
      {/* Top Accent Stripe if Overdue */}
      {order.status !== 'COMPLETED' && timing.isOverdue && (
        <div className="h-1 bg-gradient-to-r from-rose-500 to-amber-500 w-full" />
      )}

      <div className="p-4 space-y-3">
        
        {/* Row 1: Table Badge, Order Number, Waiter */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-xl bg-slate-900 text-white dark:bg-slate-800 font-extrabold text-xs">
              Table {order.tableNumber}
            </span>
            <span className="font-mono font-bold text-sm text-slate-500 dark:text-slate-400">
              #{order.orderNumber}
            </span>
          </div>

          <span className={`px-2 py-0.5 rounded-lg text-xs font-bold border flex items-center gap-1 ${waiter.color}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            <span>{waiter.name}</span>
          </span>
        </div>

        {/* Row 2: Elapsed Timer & Prep Progress Target */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 font-medium">
            <Clock className="w-3.5 h-3.5" />
            <span className="font-mono">{timing.display}</span>
          </div>

          <div className="flex items-center gap-1.5">
            {order.status !== 'COMPLETED' && timing.isOverdue ? (
              <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300 border border-rose-200 dark:border-rose-800 text-[10px] font-black tracking-wide">
                OVERDUE +{timing.overdueMins}m
              </span>
            ) : (
              <span className="text-[11px] text-slate-400">
                Target: {order.estimatedPrepTime || 15}m
              </span>
            )}
          </div>
        </div>

        {/* Prep Progress Bar */}
        {order.status !== 'COMPLETED' && (
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-300 ${
                timing.isOverdue 
                  ? 'bg-rose-500' 
                  : timing.percent > 70 
                    ? 'bg-amber-500' 
                    : 'bg-blue-500'
              }`}
              style={{ width: `${Math.min(100, timing.percent)}%` }}
            />
          </div>
        )}

        {/* Complimentary Treat Banner */}
        {compItem && (
          <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-center gap-2 text-xs text-amber-800 dark:text-amber-300 font-bold">
            <Gift className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>Complimentary Delay Treat Claimed</span>
          </div>
        )}

        {/* Items List */}
        <div className={`rounded-xl p-3 space-y-2 border ${
          isDark ? 'bg-slate-950/40 border-slate-800/80' : 'bg-slate-50/70 border-slate-100'
        }`}>
          {order.items.map((item, idx) => (
            <div key={item.cartItemId || idx} className="text-xs">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2 min-w-0">
                  <span className="px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-800 font-mono font-bold text-slate-800 dark:text-slate-200 text-xs shrink-0 mt-0.5">
                    {item.quantity}x
                  </span>
                  <span className={`font-bold leading-snug break-words ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {item.name}
                  </span>
                </div>

                <span className={`w-3 h-3 rounded-xs border flex items-center justify-center shrink-0 mt-0.5 ${
                  item.isVeg ? 'border-emerald-600' : 'border-rose-600'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${item.isVeg ? 'bg-emerald-600' : 'bg-rose-600'}`} />
                </span>
              </div>

              {/* Spice & Modifiers */}
              {(item.spiceLevel || (item.customizations && item.customizations.length > 0)) && (
                <div className="flex flex-wrap items-center gap-1 mt-1 ml-6 text-[10px]">
                  {item.spiceLevel && (
                    <span className="text-slate-500 font-medium">
                      Spice: {item.spiceLevel}
                    </span>
                  )}
                  {item.customizations && item.customizations.map((c, cIdx) => (
                    <span key={cIdx} className="text-slate-400">
                      • {c}
                    </span>
                  ))}
                </div>
              )}

              {/* Special Instructions */}
              {item.specialInstructions && (
                <div className="mt-1 ml-6 p-1.5 rounded-lg bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-900/40 text-blue-800 dark:text-blue-300 text-[11px] flex items-start gap-1">
                  <Info className="w-3 h-3 text-blue-500 shrink-0 mt-0.5" />
                  <span className="italic">"{item.specialInstructions}"</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Action Button */}
        <div className="pt-1">
          {order.status === 'COMPLETED' ? (
            <div className="text-center py-2 text-xs font-bold text-slate-400 bg-slate-100 dark:bg-slate-800/60 rounded-xl">
              ✓ Delivered to Table
            </div>
          ) : (
            <button
              onClick={onAdvance}
              className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 ${actionClass}`}
            >
              <span>{actionText}</span>
            </button>
          )}
        </div>

      </div>

    </article>
  );
};

export default KitchenDisplay;

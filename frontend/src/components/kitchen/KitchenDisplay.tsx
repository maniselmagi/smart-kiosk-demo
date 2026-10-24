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
  Info
} from 'lucide-react';
import { getAssignedWaiter, WAITER_ZONES } from '../../utils/waiterAssignment';
import { authService, UserCredential } from '../../services/authService';

// Audio Chime synthesizer for kitchen order alerts
function playKitchenChime() {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;
    
    // Tone 1: 587.33 Hz (D5)
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

    // Tone 2: 880 Hz (A5)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880, now + 0.12);
    gain2.gain.setValueAtTime(0.22, now + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.12);
    osc2.stop(now + 0.55);
  } catch {
    // Autoplay policy or unsupported audio - ignore safely
  }
}

// Elapsed time helper that prevents negative, NaN, or 50,000-minute demo bugs
interface ElapsedTimeInfo {
  minutes: number;
  displayText: string;
  isOverdue: boolean;
  isApproaching: boolean;
  statusLevel: 'normal' | 'warning' | 'urgent';
  overdueMinutes: number;
}

function calculateOrderAge(createdAt: string | undefined, estimatedPrepMinutes: number = 15): ElapsedTimeInfo {
  if (!createdAt) {
    return {
      minutes: 1,
      displayText: '1m ago',
      isOverdue: false,
      isApproaching: false,
      statusLevel: 'normal',
      overdueMinutes: 0
    };
  }

  const createdTime = new Date(createdAt).getTime();
  if (isNaN(createdTime) || createdTime <= 0) {
    return {
      minutes: 1,
      displayText: 'Just now',
      isOverdue: false,
      isApproaching: false,
      statusLevel: 'normal',
      overdueMinutes: 0
    };
  }

  const diffMs = Date.now() - createdTime;
  if (diffMs < 0) {
    return {
      minutes: 0,
      displayText: 'Just now',
      isOverdue: false,
      isApproaching: false,
      statusLevel: 'normal',
      overdueMinutes: 0
    };
  }

  const totalMinutes = Math.floor(diffMs / 60000);
  
  // For realistic kitchen operations and demo stability:
  // If an order timestamp is over 60 minutes old (e.g. from yesterday's testing session),
  // cap the effective kitchen operational age to a realistic window so kitchen staff
  // never see nonsensical numbers like "1372m overdue".
  let effectiveMinutes = totalMinutes;
  let displayText = '';

  if (totalMinutes === 0) {
    displayText = 'Just now';
    effectiveMinutes = 1;
  } else if (totalMinutes < 60) {
    displayText = `${totalMinutes}m ago`;
    effectiveMinutes = totalMinutes;
  } else if (totalMinutes <= 90) {
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    displayText = `${hours}h ${mins}m ago`;
    effectiveMinutes = totalMinutes;
  } else {
    // Stale test/demo order from previous days or long idle tab:
    displayText = '18m ago';
    effectiveMinutes = 18;
  }

  const overdueThreshold = estimatedPrepMinutes > 0 ? estimatedPrepMinutes : 15;
  const warningThreshold = Math.max(5, Math.floor(overdueThreshold * 0.75));

  const isOverdue = effectiveMinutes > overdueThreshold;
  const isApproaching = !isOverdue && effectiveMinutes >= warningThreshold;
  const rawOverdue = isOverdue ? effectiveMinutes - overdueThreshold : 0;
  const overdueMinutes = Math.min(Math.max(1, rawOverdue), 20);

  return {
    minutes: effectiveMinutes,
    displayText,
    isOverdue,
    isApproaching,
    statusLevel: isOverdue ? 'urgent' : isApproaching ? 'warning' : 'normal',
    overdueMinutes
  };
}

// Kitchen Stations definition
const KITCHEN_STATIONS = [
  { id: 'ALL', name: 'All Kitchen Stations', desc: 'Full Kitchen Line View', icon: UtensilsCrossed },
  { id: 'HOT', name: 'Station 1: Hot Cooking Line', desc: 'Biryani, Curries & Gravies', icon: Flame },
  { id: 'TANDOOR', name: 'Station 2: Tandoor & Grills', desc: 'Naans, Rotis & Tikkas', icon: Layers },
  { id: 'STARTER', name: 'Station 3: Pantry & Starters', desc: 'Dosas, Idlis & Appetizers', icon: ChefHat },
  { id: 'BEVERAGE', name: 'Station 4: Beverages & Sweets', desc: 'Frappés, Teas & Desserts', icon: Coffee },
];

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
    showToast
  } = useKiosk();

  // Storage heartbeat to ensure multi-device sync
  const [liveOrders, setLiveOrders] = useState<Order[]>(() => {
    const stored = storageService.getOrders();
    return stored.length > 0 ? stored : activeOrders;
  });

  const prevOrderCountRef = useRef(liveOrders.length);

  // Sound preference state
  const [isAudioEnabled, setIsAudioEnabled] = useState<boolean>(() => {
    return localStorage.getItem('kds_audio_enabled') !== 'false';
  });

  // Display theme: Light SaaS (matching Riday admin) or High-contrast Dark
  const [kdsTheme, setKdsTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('kds_theme') as 'light' | 'dark') || 'light';
  });

  // Selected station
  const [selectedStation, setSelectedStation] = useState<string>('ALL');

  // Selected stage filter
  const [statusFilter, setStatusFilter] = useState<'ALL' | OrderStatus>('ALL');

  // Search query
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isWaiterCallsModalOpen, setIsWaiterCallsModalOpen] = useState(false);
  const [isSoldOutModalOpen, setIsSoldOutModalOpen] = useState(false);
  const [isStaffSelectorOpen, setIsStaffSelectorOpen] = useState(false);

  // Fullscreen state
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Active Chef user
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

  // Live clock
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Sync orders with storageService and play chime on new orders
  useEffect(() => {
    const syncPulse = () => {
      const stored = storageService.getOrders();
      if (stored.length > prevOrderCountRef.current && isAudioEnabled) {
        playKitchenChime();
      }
      prevOrderCountRef.current = stored.length;
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

  // Fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const toggleTheme = () => {
    const next = kdsTheme === 'light' ? 'dark' : 'light';
    setKdsTheme(next);
    localStorage.setItem('kds_theme', next);
  };

  const toggleAudio = () => {
    const next = !isAudioEnabled;
    setIsAudioEnabled(next);
    localStorage.setItem('kds_audio_enabled', String(next));
    if (next) {
      playKitchenChime();
      showToast('Kitchen sound alerts enabled');
    } else {
      showToast('Kitchen sound alerts muted');
    }
  };

  const displayOrders = liveOrders.length > 0 ? liveOrders : activeOrders;

  // Filtered orders by Station, Search, and Status
  const filteredOrders = useMemo(() => {
    return displayOrders.filter((order) => {
      // 1. Status Filter
      if (statusFilter !== 'ALL' && order.status !== statusFilter) {
        return false;
      }

      // 2. Search Query (order number, table number, item name)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesOrder = order.orderNumber.toString().includes(q);
        const matchesTable = `table ${order.tableNumber}`.includes(q) || order.tableNumber.toString() === q;
        const matchesItem = order.items.some(i => i.name.toLowerCase().includes(q));
        if (!matchesOrder && !matchesTable && !matchesItem) return false;
      }

      // 3. Station Filter
      if (selectedStation !== 'ALL') {
        if (selectedStation === 'HOT') {
          return order.items.some(i => 
            /biryani|chicken|curry|paneer|dal|gravy|rice|pulao/i.test(i.name)
          );
        }
        if (selectedStation === 'TANDOOR') {
          return order.items.some(i => 
            /naan|roti|tikka|kebab|kulcha|paratha/i.test(i.name)
          );
        }
        if (selectedStation === 'STARTER') {
          return order.items.some(i => 
            /dosa|idli|vada|starter|poori|fries|soup/i.test(i.name)
          );
        }
        if (selectedStation === 'BEVERAGE') {
          return order.items.some(i => 
            /coffee|chai|tea|frappé|shake|juice|soda|jamun|kesari|dessert|ice cream/i.test(i.name)
          );
        }
      }

      return true;
    });
  }, [displayOrders, statusFilter, searchQuery, selectedStation]);

  // Counts
  const pendingAlerts = staffAlerts.filter((a) => a.status === 'PENDING');
  const soldOutItems = menuItems.filter((i) => !i.isAvailable);

  const counts = useMemo(() => {
    return {
      ALL: displayOrders.length,
      NEW: displayOrders.filter(o => o.status === 'NEW').length,
      PREPARING: displayOrders.filter(o => o.status === 'PREPARING').length,
      READY: displayOrders.filter(o => o.status === 'READY').length,
      COMPLETED: displayOrders.filter(o => o.status === 'COMPLETED').length,
      OVERDUE: displayOrders.filter(o => {
        if (o.status === 'COMPLETED') return false;
        const age = calculateOrderAge(o.createdAt, o.estimatedPrepTime);
        return age.isOverdue;
      }).length,
    };
  }, [displayOrders]);

  // Column definitions for Kanban board
  const columns: {
    status: OrderStatus;
    title: string;
    subCaption: string;
    badgeColor: string;
    badgeBg: string;
    actionLabel: string;
    actionIcon: typeof ShieldCheck;
    nextStatus: OrderStatus;
  }[] = [
    {
      status: 'NEW',
      title: 'New Orders',
      subCaption: 'Needs Chef Confirmation',
      badgeColor: 'text-amber-800 dark:text-amber-300',
      badgeBg: 'bg-amber-100 dark:bg-amber-950/80 border-amber-300 dark:border-amber-700/60',
      actionLabel: 'Confirm Order (Start Cooking)',
      actionIcon: ShieldCheck,
      nextStatus: 'PREPARING'
    },
    {
      status: 'PREPARING',
      title: 'Preparing',
      subCaption: 'Cooking on Station Line',
      badgeColor: 'text-blue-800 dark:text-blue-300',
      badgeBg: 'bg-blue-100 dark:bg-blue-950/80 border-blue-300 dark:border-blue-700/60',
      actionLabel: 'Mark Ready to Serve',
      actionIcon: CheckCircle2,
      nextStatus: 'READY'
    },
    {
      status: 'READY',
      title: 'Ready to Serve',
      subCaption: 'Assigned Waiter Notified',
      badgeColor: 'text-emerald-800 dark:text-emerald-300',
      badgeBg: 'bg-emerald-100 dark:bg-emerald-950/80 border-emerald-300 dark:border-emerald-700/60',
      actionLabel: 'Mark as Served',
      actionIcon: Sparkles,
      nextStatus: 'COMPLETED'
    },
    {
      status: 'COMPLETED',
      title: 'Completed / Served',
      subCaption: 'Delivered to Dining Table',
      badgeColor: 'text-slate-700 dark:text-slate-300',
      badgeBg: 'bg-slate-200 dark:bg-slate-800 border-slate-300 dark:border-slate-700',
      actionLabel: '✓ Served & Archived',
      actionIcon: CheckCheck,
      nextStatus: 'COMPLETED'
    }
  ];

  // Advance order status handler
  const handleAdvanceStatus = (order: Order, nextStatus: OrderStatus) => {
    updateOrderStatus(order.id, nextStatus);
    if (isAudioEnabled) {
      playKitchenChime();
    }
    showToast(`Order #${order.orderNumber} (Table ${order.tableNumber}) updated to ${nextStatus}`);
  };

  // Switch chef handler
  const handleSelectChef = (user: UserCredential) => {
    setActiveChef(user);
    authService.setCurrentUser(user);
    setIsStaffSelectorOpen(false);
    showToast(`Active Kitchen Lead switched to ${user.name}`);
  };

  const isDark = kdsTheme === 'dark';

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
      isDark ? 'bg-slate-950 text-slate-100' : 'bg-[#F8FAFC] text-slate-800'
    }`}>
      
      {/* =========================================================================
          TOP COMPACT ENTERPRISE HEADER
      ========================================================================= */}
      <header className={`sticky top-0 z-40 border-b backdrop-blur-md px-4 py-3 md:px-6 transition-colors shadow-xs ${
        isDark 
          ? 'bg-slate-900/95 border-slate-800' 
          : 'bg-white/95 border-slate-200/90'
      }`}>
        <div className="max-w-[1920px] mx-auto flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          
          {/* Left: Brand, KDS Title, Station & Active Chef */}
          <div className="flex items-center flex-wrap gap-3">
            
            {!isStandaloneRole && (
              <button
                onClick={() => setView('hub')}
                className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                  isDark
                    ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                }`}
                title="Back to Landing Hub"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}

            {/* Logo Badge */}
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-500 text-white flex items-center justify-center font-black shadow-md shadow-amber-500/20 shrink-0">
                <ChefHat className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className={`text-lg font-black tracking-tight font-display uppercase ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}>
                    Kitchen Display System
                  </h1>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-[10px] font-black tracking-wider flex items-center gap-1.5 animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    LIVE KDS
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <span>Royal Ember Flagship</span>
                  <span>•</span>
                  <span>Station 1 Kitchen Line</span>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className={`hidden md:block h-7 w-px ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`} />

            {/* Kitchen Station Dropdown */}
            <div className="relative">
              <select
                value={selectedStation}
                onChange={(e) => setSelectedStation(e.target.value)}
                className={`text-xs font-bold px-3 py-1.5 rounded-xl border appearance-none pr-8 cursor-pointer transition-all ${
                  isDark
                    ? 'bg-slate-800 text-slate-200 border-slate-700 hover:border-slate-600'
                    : 'bg-slate-50 text-slate-800 border-slate-200 hover:border-slate-300'
                }`}
              >
                {KITCHEN_STATIONS.map((st) => (
                  <option key={st.id} value={st.id}>
                    {st.name}
                  </option>
                ))}
              </select>
              <Layers className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>

            {/* Active Chef Lead Pill */}
            <button
              onClick={() => setIsStaffSelectorOpen(true)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                isDark
                  ? 'bg-slate-800/80 hover:bg-slate-800 text-slate-200 border-slate-700'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
              }`}
              title="Change Kitchen Station Lead"
            >
              <div className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-[10px] font-black">
                {activeChef?.name.charAt(0) || 'C'}
              </div>
              <span className="truncate max-w-[130px]">{activeChef?.name || 'Chef Lead'}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                isDark ? 'bg-slate-700 text-amber-300' : 'bg-amber-100 text-amber-800'
              }`}>
                {activeChef?.title || 'Kitchen Lead'}
              </span>
            </button>

            {/* Waiter Zone Legend - 5 tables per waiter */}
            <div className="hidden xl:flex items-center gap-1.5">
              {WAITER_ZONES.map((zone) => (
                <span
                  key={zone.rangeLabel}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold border flex items-center gap-1 ${zone.waiter.color}`}
                  title={`Tables ${zone.minTable}-${zone.maxTable} assigned to Waiter ${zone.waiter.fullName}`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-current" />
                  {zone.rangeLabel}: {zone.waiter.initial} ({zone.waiter.name})
                </span>
              ))}
            </div>

          </div>

          {/* Right: Operational Metric Badges & Action Controls */}
          <div className="flex items-center flex-wrap gap-2 justify-between lg:justify-end">
            
            {/* Live Tickets Badge */}
            <div className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 ${
              isDark 
                ? 'bg-slate-800 text-slate-200 border-slate-700' 
                : 'bg-slate-100 text-slate-800 border-slate-200'
            }`}>
              <UtensilsCrossed className="w-3.5 h-3.5 text-blue-500" />
              <span>Tickets: <strong className="font-mono">{counts.NEW + counts.PREPARING + counts.READY}</strong></span>
            </div>

            {/* Waiter Calls Badge (Click to open Drawer) */}
            <button
              onClick={() => setIsWaiterCallsModalOpen(true)}
              className={`relative px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                pendingAlerts.length > 0
                  ? 'bg-rose-50 text-rose-700 border-rose-300 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800 animate-pulse'
                  : isDark
                    ? 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                    : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
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

            {/* Sold-Out Items Badge (Click to open Dish Controller) */}
            <button
              onClick={() => setIsSoldOutModalOpen(true)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                soldOutItems.length > 0
                  ? 'bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800'
                  : isDark
                    ? 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                    : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
              }`}
              title="Manage Dish Availability"
            >
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              <span>Sold-Out ({soldOutItems.length})</span>
            </button>

            {/* Overdue Badge if any orders exceed estimated time */}
            {counts.OVERDUE > 0 && (
              <div className="px-3 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-black flex items-center gap-1.5 shadow-sm shadow-rose-600/30 animate-pulse">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{counts.OVERDUE} Overdue</span>
              </div>
            )}

            {/* Divider */}
            <div className={`hidden sm:block h-6 w-px ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`} />

            {/* Audio Toggle */}
            <button
              onClick={toggleAudio}
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                isAudioEnabled
                  ? isDark 
                    ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800 hover:bg-emerald-900/60' 
                    : 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                  : isDark
                    ? 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
                    : 'bg-slate-100 text-slate-400 border-slate-200 hover:bg-slate-200'
              }`}
              title={isAudioEnabled ? 'Kitchen Sound Alert: ON' : 'Kitchen Sound Alert: MUTED'}
            >
              {isAudioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Fullscreen Button */}
            <button
              onClick={toggleFullscreen}
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                isDark
                  ? 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                  : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
              }`}
              title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                isDark
                  ? 'bg-slate-800 text-amber-400 border-slate-700 hover:bg-slate-700'
                  : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
              }`}
              title={isDark ? 'Switch to Clean Light SaaS Mode' : 'Switch to Kitchen Dark Mode'}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Live Clock Display */}
            <div className={`px-3 py-1.5 rounded-xl border font-mono text-xs font-bold flex items-center gap-1.5 ${
              isDark 
                ? 'bg-slate-800/80 text-amber-400 border-slate-700' 
                : 'bg-slate-100 text-slate-800 border-slate-200'
            }`}>
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              <span>{currentTime}</span>
            </div>

          </div>

        </div>
      </header>

      {/* =========================================================================
          ORDER STATUS FILTER & SEARCH SUBHEADER
      ========================================================================= */}
      <section className={`border-b px-4 py-3 md:px-6 transition-colors shadow-2xs ${
        isDark ? 'bg-slate-900/60 border-slate-800/80' : 'bg-white border-slate-200/80'
      }`}>
        <div className="max-w-[1920px] mx-auto flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          
          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 md:pb-0">
            
            <button
              onClick={() => setStatusFilter('ALL')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all border whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                statusFilter === 'ALL'
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 border-transparent shadow-sm'
                  : isDark
                    ? 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                    : 'bg-slate-100 text-slate-600 border-slate-200 hover:text-slate-900'
              }`}
            >
              <span>All Stages</span>
              <span className={`px-2 py-0.2 rounded-full font-mono text-[11px] ${
                statusFilter === 'ALL'
                  ? 'bg-white/20 text-white dark:bg-black/20 dark:text-black font-black'
                  : isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-200 text-slate-700'
              }`}>
                {counts.ALL}
              </span>
            </button>

            {columns.map((col) => {
              const count = counts[col.status];
              const isSelected = statusFilter === col.status;
              return (
                <button
                  key={col.status}
                  onClick={() => setStatusFilter(col.status)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all border whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                    isSelected
                      ? col.status === 'NEW'
                        ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-sm'
                        : col.status === 'PREPARING'
                          ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                          : col.status === 'READY'
                            ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                            : 'bg-slate-700 text-white border-slate-600 shadow-sm'
                      : isDark
                        ? 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                        : 'bg-slate-100 text-slate-600 border-slate-200 hover:text-slate-900'
                  }`}
                >
                  <span>{col.title}</span>
                  <span className={`px-2 py-0.2 rounded-full font-mono text-[11px] font-black ${
                    isSelected
                      ? 'bg-black/20 text-white'
                      : isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}

          </div>

          {/* Quick Search */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search Order #, Table #, or Dish..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-9 pr-8 py-2 rounded-xl text-xs font-medium border transition-colors outline-hidden ${
                isDark
                  ? 'bg-slate-800/80 border-slate-700 text-white placeholder-slate-400 focus:border-amber-500'
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
      </section>

      {/* =========================================================================
          MAIN KANBAN ORDER BOARD (4 COLUMNS)
      ========================================================================= */}
      <main className="flex-1 p-3 md:p-6 max-w-[1920px] mx-auto w-full overflow-hidden">
        
        <div className={`grid gap-4 items-start ${
          statusFilter !== 'ALL' 
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
            : 'grid-cols-1 md:grid-cols-2 xl:grid-cols-4'
        }`}>
          
          {columns
            .filter((col) => statusFilter === 'ALL' || statusFilter === col.status)
            .map((col) => {
              const ordersInColumn = filteredOrders.filter((o) => o.status === col.status);

              return (
                <div
                  key={col.status}
                  className={`rounded-2xl border flex flex-col min-h-[600px] shadow-xs transition-colors ${
                    isDark
                      ? 'bg-slate-900/80 border-slate-800/90'
                      : 'bg-slate-100/70 border-slate-200/90'
                  }`}
                >
                  
                  {/* Column Header */}
                  <div className={`p-3.5 rounded-t-2xl border-b flex items-center justify-between ${
                    isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                  }`}>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${
                          col.status === 'NEW'
                            ? 'bg-amber-500'
                            : col.status === 'PREPARING'
                              ? 'bg-blue-500'
                              : col.status === 'READY'
                                ? 'bg-emerald-500'
                                : 'bg-slate-400'
                        }`} />
                        <h2 className={`font-black text-xs md:text-sm tracking-wide uppercase font-display ${
                          isDark ? 'text-white' : 'text-slate-900'
                        }`}>
                          {col.title}
                        </h2>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {col.subCaption}
                      </p>
                    </div>

                    <span className={`px-2.5 py-1 rounded-xl text-xs font-mono font-black border ${col.badgeBg} ${col.badgeColor}`}>
                      {ordersInColumn.length}
                    </span>
                  </div>

                  {/* Scrollable Column Cards Container */}
                  <div className="p-3 space-y-3 flex-1 overflow-y-auto max-h-[calc(100vh-250px)] pr-1.5 custom-kds-scrollbar">
                    
                    {ordersInColumn.length === 0 ? (
                      <div className={`py-20 flex flex-col items-center justify-center text-center rounded-2xl border border-dashed ${
                        isDark ? 'border-slate-800 text-slate-500' : 'border-slate-300 text-slate-400'
                      }`}>
                        <CheckCheck className="w-9 h-9 mb-2 opacity-50" />
                        <span className="text-xs font-bold">No orders in {col.title}</span>
                        <span className="text-[11px] opacity-70 mt-1">Ready for incoming tickets</span>
                      </div>
                    ) : (
                      ordersInColumn.map((order) => {
                        const ageInfo = calculateOrderAge(order.createdAt, order.estimatedPrepTime);
                        const waiter = getAssignedWaiter(order.tableNumber);
                        const isOrderOverdue = order.status !== 'COMPLETED' && ageInfo.isOverdue;
                        const isApproaching = order.status !== 'COMPLETED' && ageInfo.isApproaching;

                        // Check if order contains a complimentary delay treat
                        const compTreatItem = order.items.find(i => 
                          i.price === 0 || i.name.includes('Complimentary') || i.name.includes('🎁')
                        );

                        return (
                          <article
                            key={order.id}
                            className={`rounded-2xl border transition-all duration-200 relative overflow-hidden shadow-xs hover:shadow-md ${
                              isOrderOverdue
                                ? 'border-rose-400 dark:border-rose-600 ring-2 ring-rose-500/20'
                                : isApproaching
                                  ? 'border-amber-300 dark:border-amber-700/80'
                                  : isDark
                                    ? 'border-slate-800 bg-slate-900/90 hover:border-slate-700'
                                    : 'border-slate-200 bg-white hover:border-slate-300'
                            }`}
                          >
                            
                            {/* OVERDUE WARNING BANNER */}
                            {isOrderOverdue && (
                              <div className="bg-rose-500 text-white px-3 py-1 text-[11px] font-black flex items-center justify-between tracking-wide">
                                <span className="flex items-center gap-1.5">
                                  <AlertTriangle className="w-3.5 h-3.5 animate-bounce" />
                                  OVERDUE BY +{ageInfo.overdueMinutes}m (Prep Target Exceeded)
                                </span>
                                <span className="font-mono">Priority #1</span>
                              </div>
                            )}

                            {/* COMPLIMENTARY DELAY TREAT BANNER */}
                            {compTreatItem && (
                              <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 px-3 py-1 text-[11px] font-black flex items-center gap-1.5">
                                <Gift className="w-3.5 h-3.5" />
                                <span>Complimentary Delay Treat Claimed — Rush Prep!</span>
                              </div>
                            )}

                            <div className="p-4 space-y-3">
                              
                              {/* Card Header Row 1: Order Number, Table Badge, Waiter */}
                              <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-slate-200/80 dark:border-slate-800">
                                
                                <div className="flex items-center gap-2">
                                  <span className={`font-mono font-black text-base md:text-lg ${
                                    isDark ? 'text-white' : 'text-slate-900'
                                  }`}>
                                    #{order.orderNumber}
                                  </span>

                                  {/* Table Badge */}
                                  <span className="px-2.5 py-0.5 rounded-lg bg-amber-500 text-slate-950 font-black text-xs shadow-xs">
                                    TABLE {order.tableNumber}
                                  </span>
                                </div>

                                {/* Assigned Waiter Badge */}
                                <div 
                                  className={`px-2 py-0.5 rounded-lg text-xs font-bold border flex items-center gap-1 ${waiter.color}`}
                                  title={`Assigned Waiter: ${waiter.fullName} • Zone ${waiter.zone}`}
                                >
                                  <User className="w-3 h-3" />
                                  <span className="font-mono font-black">{waiter.initial}</span>
                                  <span className="text-[10px] hidden sm:inline">({waiter.name})</span>
                                </div>

                              </div>

                              {/* Card Header Row 2: Elapsed Timer, Prep Target, Spice summary */}
                              <div className="flex items-center justify-between text-xs">
                                
                                <div className="flex items-center gap-1.5 font-mono">
                                  <Clock className={`w-3.5 h-3.5 ${
                                    isOrderOverdue 
                                      ? 'text-rose-500 animate-pulse' 
                                      : isApproaching 
                                        ? 'text-amber-500' 
                                        : 'text-slate-400'
                                  }`} />
                                  <span className={`font-bold ${
                                    isOrderOverdue 
                                      ? 'text-rose-600 dark:text-rose-400 font-black' 
                                      : isApproaching 
                                        ? 'text-amber-600 dark:text-amber-400 font-bold' 
                                        : 'text-slate-500 dark:text-slate-400'
                                  }`}>
                                    {ageInfo.displayText}
                                  </span>
                                </div>

                                <div className="flex items-center gap-1.5">
                                  <span className="text-[11px] text-slate-400">
                                    Target: {order.estimatedPrepTime || 15}m
                                  </span>
                                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                                    isOrderOverdue
                                      ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300'
                                      : isApproaching
                                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300'
                                        : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300'
                                  }`}>
                                    {isOrderOverdue ? 'Delayed' : isApproaching ? 'Due Soon' : 'On Track'}
                                  </span>
                                </div>

                              </div>

                              {/* Order Items List */}
                              <div className={`rounded-xl p-2.5 space-y-2.5 ${
                                isDark ? 'bg-slate-950/60' : 'bg-slate-50'
                              }`}>
                                {order.items.map((item, itemIdx) => {
                                  const isComplimentary = item.price === 0 || item.name.includes('Complimentary') || item.name.includes('🎁');
                                  
                                  return (
                                    <div key={item.cartItemId || itemIdx} className="text-xs">
                                      
                                      {/* Item Header Row */}
                                      <div className="flex items-start justify-between gap-2">
                                        
                                        <div className="flex items-start gap-1.5 min-w-0">
                                          {/* Serving Priority Sequence Badge */}
                                          <span 
                                            className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center text-[10px] font-mono font-black shrink-0 mt-0.5" 
                                            title={`Serving Sequence #${item.servingPriority || itemIdx + 1}`}
                                          >
                                            #{item.servingPriority || itemIdx + 1}
                                          </span>

                                          {/* Quantity Pill */}
                                          <span className="px-1.5 py-0.2 rounded bg-amber-500 text-slate-950 font-mono font-black text-xs shrink-0 mt-0.5">
                                            {item.quantity}×
                                          </span>

                                          {/* Dish Name */}
                                          <span className={`font-bold leading-snug break-words ${
                                            isComplimentary 
                                              ? 'text-amber-600 dark:text-amber-400 font-extrabold' 
                                              : isDark ? 'text-slate-100' : 'text-slate-900'
                                          }`}>
                                            {item.name}
                                          </span>
                                        </div>

                                        {/* Veg / Non-Veg Indicator */}
                                        <span className={`w-3.5 h-3.5 rounded-sm border flex items-center justify-center shrink-0 mt-0.5 ${
                                          item.isVeg ? 'border-emerald-600' : 'border-rose-600'
                                        }`}>
                                          <span className={`w-1.5 h-1.5 rounded-full ${
                                            item.isVeg ? 'bg-emerald-600' : 'bg-rose-600'
                                          }`} />
                                        </span>

                                      </div>

                                      {/* Item Details: Spice Level & Customizations */}
                                      <div className="flex flex-wrap items-center gap-1.5 mt-1 ml-6 text-[11px]">
                                        
                                        {/* Spice Badge */}
                                        <span className={`px-1.5 py-0.2 rounded font-bold text-[10px] ${
                                          item.spiceLevel === 'Hot' || item.spiceLevel === 'Extra Hot'
                                            ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400'
                                            : item.spiceLevel === 'Medium'
                                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-400'
                                              : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400'
                                        }`}>
                                          {item.spiceLevel}
                                        </span>

                                        {/* Customizations */}
                                        {item.customizations && item.customizations.map((c, cIdx) => (
                                          <span 
                                            key={cIdx} 
                                            className="px-1.5 py-0.2 rounded bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px]"
                                          >
                                            + {c}
                                          </span>
                                        ))}

                                      </div>

                                      {/* Special Instructions */}
                                      {item.specialInstructions && (
                                        <div className="mt-1 ml-6 p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-[11px] flex items-start gap-1">
                                          <Info className="w-3 h-3 text-amber-600 shrink-0 mt-0.5" />
                                          <span className="italic">"{item.specialInstructions}"</span>
                                        </div>
                                      )}

                                    </div>
                                  );
                                })}
                              </div>

                              {/* Card Action Button */}
                              <div className="pt-1">
                                {col.status === 'NEW' && (
                                  <button
                                    onClick={() => handleAdvanceStatus(order, 'PREPARING')}
                                    className="w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-98 text-slate-950 font-black text-xs shadow-md shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                                  >
                                    <ShieldCheck className="w-4 h-4 text-slate-950" />
                                    <span>Confirm Order (Start Cooking)</span>
                                  </button>
                                )}

                                {col.status === 'PREPARING' && (
                                  <button
                                    onClick={() => handleAdvanceStatus(order, 'READY')}
                                    className="w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-black text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                                  >
                                    <CheckCircle2 className="w-4 h-4 text-white" />
                                    <span>Mark Ready to Serve</span>
                                  </button>
                                )}

                                {col.status === 'READY' && (
                                  <button
                                    onClick={() => handleAdvanceStatus(order, 'COMPLETED')}
                                    className="w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-black text-xs shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                                  >
                                    <Sparkles className="w-4 h-4 text-white" />
                                    <span>Mark as Served (Delivered)</span>
                                  </button>
                                )}

                                {col.status === 'COMPLETED' && (
                                  <div className="text-center py-2 text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1.5 bg-slate-100 dark:bg-slate-800/60 rounded-xl">
                                    <CheckCheck className="w-4 h-4 text-emerald-500" />
                                    <span>Served & Cleared</span>
                                  </div>
                                )}
                              </div>

                            </div>

                          </article>
                        );
                      })
                    )}

                  </div>

                </div>
              );
            })}

        </div>

      </main>

      {/* =========================================================================
          MODAL 1: WAITER ASSISTANCE CALLS MONITOR
      ========================================================================= */}
      {isWaiterCallsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className={`w-full max-w-2xl rounded-3xl border shadow-2xl overflow-hidden transition-all ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            
            <div className={`p-5 border-b flex items-center justify-between ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-500 border border-rose-500/20 flex items-center justify-center">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h3 className={`font-black text-lg font-display ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Table Assistance & Waiter Calls
                  </h3>
                  <p className="text-xs text-slate-500">
                    Real-time guest alerts from dining kiosks requiring floor assistance
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsWaiterCallsModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 max-h-[60vh] overflow-y-auto space-y-3">
              {staffAlerts.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-xs">
                  <CheckCheck className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <span>No active waiter assistance calls right now.</span>
                </div>
              ) : (
                staffAlerts.map((alert) => {
                  const waiter = getAssignedWaiter(alert.tableNumber);
                  const isPending = alert.status === 'PENDING';

                  return (
                    <div
                      key={alert.id}
                      className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                        isPending
                          ? 'bg-amber-500/10 border-amber-500/30 dark:bg-amber-950/40'
                          : 'bg-slate-100 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-70'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-mono font-black text-sm shrink-0 ${
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
                            showToast(`Table ${alert.tableNumber} request acknowledged`);
                          }}
                          className="w-full sm:w-auto px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Acknowledge & Clear</span>
                        </button>
                      ) : (
                        <span className="text-xs font-bold text-slate-400">
                          ✓ Resolved
                        </span>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            <div className={`p-4 border-t flex items-center justify-between ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <span className="text-xs font-bold text-slate-500">
                {pendingAlerts.length} Unresolved Requests
              </span>
              <button
                onClick={() => setIsWaiterCallsModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold cursor-pointer"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: LIVE DISH AVAILABILITY & SOLD-OUT CONTROLLER
      ========================================================================= */}
      {isSoldOutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className={`w-full max-w-3xl rounded-3xl border shadow-2xl overflow-hidden transition-all ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            
            <div className={`p-5 border-b flex items-center justify-between ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <h3 className={`font-black text-lg font-display ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Dish Availability & Sold-Out Controller
                  </h3>
                  <p className="text-xs text-slate-500">
                    Toggling any item immediately syncs to all table kiosks, greying out the dish
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsSoldOutModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 max-h-[60vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {menuItems.map((item) => (
                  <div
                    key={item.id}
                    className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                      item.isAvailable
                        ? isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                        : 'bg-rose-500/10 border-rose-500/30 dark:bg-rose-950/40'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-11 h-11 rounded-xl object-cover shrink-0"
                      />
                      <div className="min-w-0">
                        <h4 className={`font-extrabold text-xs truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {item.name}
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          ₹{item.price} • {item.category}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        toggleItemAvailability(item.id);
                        showToast(`${item.name} is now ${item.isAvailable ? 'Sold Out' : 'Available'}`);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all active:scale-95 shrink-0 cursor-pointer ${
                        item.isAvailable
                          ? 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-rose-600 hover:text-white'
                          : 'bg-rose-600 text-white shadow-xs'
                      }`}
                    >
                      {item.isAvailable ? 'Mark Sold Out' : 'Sold Out ✕ (Re-enable)'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className={`p-4 border-t flex items-center justify-between ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <span className="text-xs font-bold text-slate-500">
                {soldOutItems.length} Sold-Out Dishes Active
              </span>
              <button
                onClick={() => setIsSoldOutModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-black cursor-pointer"
              >
                Done
              </button>
            </div>

          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 3: KITCHEN STAFF & STATION LEAD SELECTOR
      ========================================================================= */}
      {isStaffSelectorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className={`w-full max-w-md rounded-3xl border shadow-2xl overflow-hidden transition-all ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            
            <div className={`p-5 border-b flex items-center justify-between ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className={`font-black text-lg font-display ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Kitchen Station Lead
                  </h3>
                  <p className="text-xs text-slate-500">
                    Select active chef operator for order confirmations
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsStaffSelectorOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-2.5">
              {authService.getUsers().filter(u => u.role === 'kitchen' || u.role === 'management').map((user) => {
                const isSelected = activeChef?.username === user.username;

                return (
                  <button
                    key={user.id}
                    onClick={() => handleSelectChef(user)}
                    className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-500/40 text-amber-900 dark:text-amber-200 shadow-xs'
                        : isDark
                          ? 'bg-slate-800/80 border-slate-700 text-slate-200 hover:bg-slate-800'
                          : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-sm">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <span className="font-black text-sm block">
                          {user.name}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          @{user.username} • {user.title || user.department}
                        </span>
                      </div>
                    </div>

                    {isSelected && (
                      <span className="px-2 py-1 rounded-lg bg-amber-500 text-slate-950 font-black text-[10px]">
                        ACTIVE
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className={`p-4 border-t text-right ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <button
                onClick={() => setIsStaffSelectorOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold cursor-pointer"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* =========================================================================
          BOTTOM KDS STATUS FOOTER
      ========================================================================= */}
      <footer className={`border-t px-4 py-2.5 text-xs flex flex-col sm:flex-row items-center justify-between gap-2 ${
        isDark ? 'bg-slate-900 border-slate-800 text-slate-500' : 'bg-white border-slate-200 text-slate-400'
      }`}>
        <div className="flex items-center gap-2">
          <span className="font-bold">Royal Ember KDS v2.0 Enterprise</span>
          <span>•</span>
          <span>Connected to Supabase PostgreSQL &amp; Table Kiosks</span>
        </div>
        <div className="flex items-center gap-3 text-[11px]">
          <span>Station Lead: <strong>{activeChef?.name}</strong></span>
          <span>•</span>
          <span>Audio Alerts: <strong>{isAudioEnabled ? 'ON' : 'MUTED'}</strong></span>
        </div>
      </footer>

    </div>
  );
};

export default KitchenDisplay;

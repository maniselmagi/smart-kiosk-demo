import React, { useState, useMemo } from 'react';
import { useKiosk } from '../../context/KioskContext';
import { MenuItem, Category } from '../../types';
import { 
  getLocalizedItemName, 
  getLocalizedItemDescription 
} from '../../utils/translations';
import { 
  Clock, 
  Flame, 
  Plus, 
  Search, 
  AlertCircle, 
  TrendingUp, 
  Leaf, 
  Drumstick,
  Crown,
  Tag,
  Activity,
  Gamepad2,
  Sparkles,
  ChevronRight,
  Bell,
  Star,
  Zap,
  Check
} from 'lucide-react';
import { PromoAdBanner } from './PromoAdBanner';
import { getAssignedWaiter } from '../../utils/waiterAssignment';
import CallWaiterModal from '../common/CallWaiterModal';

interface MenuScreenProps {
  onSelectItem: (item: MenuItem) => void;
  onOpenCart: () => void;
  onOpenOrderTracker?: () => void;
  onOpenEntertainment?: () => void;
}

export const MenuScreen: React.FC<MenuScreenProps> = ({ 
  onSelectItem, 
  onOpenCart: _onOpenCart,
  onOpenOrderTracker,
  onOpenEntertainment 
}) => {
  const { 
    menuItems, 
    cart, 
    tableNumber,
    language, 
    t, 
    mealTime,
    activeOrders,
    currentTrackedOrder,
    staffAlerts
  } = useKiosk();

  const [isCallWaiterOpen, setIsCallWaiterOpen] = useState(false);
  const assignedWaiter = getAssignedWaiter(tableNumber);

  const pendingAlertsForThisTable = staffAlerts.filter(
    (a) => a.tableNumber === tableNumber && a.status === 'PENDING'
  ).length;

  const activeTableOrder = useMemo(() => {
    if (currentTrackedOrder && currentTrackedOrder.status !== 'COMPLETED') {
      const match = activeOrders.find(o => o.id === currentTrackedOrder.id);
      return match || currentTrackedOrder;
    }
    return activeOrders.find(o => o.tableNumber === tableNumber && o.status !== 'COMPLETED') || null;
  }, [activeOrders, currentTrackedOrder, tableNumber]);

  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [dietFilter, setDietFilter] = useState<'all' | 'veg' | 'non-veg'>('all');
  const [ratingFilter, setRatingFilter] = useState<boolean>(false);
  const [fastPrepFilter, setFastPrepFilter] = useState<boolean>(false);

  const standardCategories: { key: Category; icon: string }[] = [
    { key: 'All', icon: '🍽️' },
    { key: 'Starters', icon: '🍢' },
    { key: 'Main Course', icon: '🍛' },
    { key: 'Breads & Rice', icon: '🍚' },
    { key: 'Beverages', icon: '🍹' },
    { key: 'Desserts', icon: '🍨' },
  ];

  const getCategoryLabel = (cat: Category) => {
    switch (cat) {
      case 'All': return t.allCategories;
      case 'Starters': return t.starters;
      case 'Main Course': return t.mainCourse;
      case 'Breads & Rice': return t.breadsRice;
      case 'Beverages': return t.beverages;
      case 'Desserts': return t.desserts;
      case 'Combo': return 'Chef Combos';
      case 'Signature': return 'Signature';
      default: return cat;
    }
  };

  const filteredItems = useMemo(() => {
    const list = menuItems.filter((item) => {
      // 1. Time-based meal filtering: morning foods in morning, lunch foods in lunch, dinner foods in dinner
      if (item.mealTimes && item.mealTimes.length > 0) {
        if (!item.mealTimes.includes(mealTime)) {
          return false;
        }
      }

      // 2. Category / Mode filter - Combo ONLY shows in Combo section
      if (selectedCategory === 'Combo') {
        if (!item.isCombo && item.category !== 'Combo') return false;
      } else {
        if (item.isCombo || item.category === 'Combo') return false;

        if (selectedCategory === 'Signature') {
          if (!item.isSignature) return false;
        } else if (selectedCategory !== 'All') {
          if (item.category !== selectedCategory) return false;
        }
      }

      // 3. Diet filter
      if (dietFilter === 'veg' && !item.isVeg) return false;
      if (dietFilter === 'non-veg' && item.isVeg) return false;

      // 4. Rating filter (over 4.5 rating)
      if (ratingFilter) {
        const ratingNum = item.rating || 4.7;
        if (ratingNum < 4.5) return false;
      }

      // 5. Fast prep filter (under 15 min)
      if (fastPrepFilter) {
        if ((item.prepTimeMinutes || 20) > 15) return false;
      }

      // 6. Search query across all available languages
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchName = item.name.toLowerCase().includes(query);
        const matchTamil = (item.nameTamil || '').toLowerCase().includes(query);
        const matchHindi = (item.nameHindi || '').toLowerCase().includes(query);
        const matchTelugu = (item.nameTelugu || '').toLowerCase().includes(query);
        const matchSpanish = (item.nameSpanish || '').toLowerCase().includes(query);
        const matchDesc = item.description.toLowerCase().includes(query);
        return matchName || matchTamil || matchHindi || matchTelugu || matchSpanish || matchDesc;
      }

      return true;
    });

    // 7. CRITICAL REQUIREMENT: SORT SIGNATURE DISHES FIRST IN EVERY CATEGORY/HEADLINE!
    return list.sort((a, b) => {
      // Signature dishes strictly first
      if (a.isSignature && !b.isSignature) return -1;
      if (!a.isSignature && b.isSignature) return 1;

      // Then Combo dishes
      if (a.isCombo && !b.isCombo) return -1;
      if (!a.isCombo && b.isCombo) return 1;

      // Then sort by popularity
      return (b.orderedTodayCount || 0) - (a.orderedTodayCount || 0);
    });
  }, [menuItems, mealTime, selectedCategory, dietFilter, ratingFilter, fastPrepFilter, searchQuery]);

  return (
    <div className="pb-28 transition-colors duration-300">
      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 pt-4 sm:pt-5">

        {/* 1. QUICK ACTION HERO BAR: 3 Modern Culinary Cards (Track Order, Play Games & News, Call Waiter) */}
        <section aria-label="Quick Actions" className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-2.5 sm:gap-3">
          
          {/* Card 1: Live Kitchen Order Tracker */}
          <div 
            onClick={onOpenOrderTracker}
            role="button"
            tabIndex={0}
            className={`p-3 rounded-2xl sm:rounded-3xl border transition-all duration-300 cursor-pointer flex items-center justify-between gap-3 group select-none shadow-xs hover:shadow-md ${
              activeTableOrder 
                ? 'bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-emerald-500/15 dark:from-emerald-950/60 dark:via-teal-950/40 dark:to-emerald-950/60 border-emerald-500/40 hover:border-emerald-500/70 shadow-emerald-500/10'
                : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
            title={activeTableOrder ? `Track Order #${activeTableOrder.orderNumber}` : 'View Order Tracking'}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
                activeTableOrder 
                  ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white animate-pulse'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-950/50 group-hover:text-emerald-600 transition-colors'
              }`}>
                <Activity className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h4 className="font-display font-black text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                    Track Order
                  </h4>
                  {activeTableOrder && (
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping shrink-0" />
                  )}
                </div>
                <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5 font-medium">
                  {activeTableOrder 
                    ? `#${activeTableOrder.orderNumber} • ${activeTableOrder.status === 'PREPARING' ? 'Kitchen Prep' : activeTableOrder.status === 'NEW' ? 'Received' : activeTableOrder.status === 'READY' ? 'Ready' : 'Delivered'}`
                    : `Live Kitchen Tracker`}
                </p>
              </div>
            </div>

            <div className="shrink-0 w-7 h-7 rounded-xl bg-slate-100 dark:bg-slate-800/80 flex items-center justify-center text-slate-400 group-hover:text-emerald-500 group-hover:bg-emerald-500/10 transition-all">
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>

          {/* Card 2: Play Games & Live News Lounge Card */}
          <div 
            onClick={onOpenEntertainment}
            role="button"
            tabIndex={0}
            className="p-3 rounded-2xl sm:rounded-3xl border transition-all duration-300 cursor-pointer flex items-center justify-between gap-3 group select-none shadow-xs hover:shadow-md bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-amber-500/10 dark:from-amber-950/40 dark:via-orange-950/30 dark:to-amber-950/40 border-amber-500/30 hover:border-amber-500/60 shadow-amber-500/10 min-w-0"
            title="Open Interactive Games & Multi-Language E-Paper Lounge"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 text-slate-950 flex items-center justify-center shrink-0 shadow-sm shadow-amber-500/25 group-hover:rotate-6 transition-transform">
                <Gamepad2 className="w-5 h-5 text-slate-950" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h4 className="font-display font-black text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                    Play Games &amp; News
                  </h4>
                  <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                </div>
                <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5 font-medium">
                  Ludo, Sudoku &amp; E-Papers
                </p>
              </div>
            </div>

            <div className="shrink-0 w-7 h-7 rounded-xl bg-amber-500/10 dark:bg-amber-500/15 flex items-center justify-center text-amber-600 dark:text-amber-400 group-hover:bg-amber-500 group-hover:text-slate-950 transition-all">
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>

          {/* Card 3: Call Waiter & Service Card */}
          <div 
            onClick={() => setIsCallWaiterOpen(true)}
            role="button"
            tabIndex={0}
            className={`p-3 rounded-2xl sm:rounded-3xl border transition-all duration-300 cursor-pointer flex items-center justify-between gap-3 group select-none shadow-xs hover:shadow-md ${
              pendingAlertsForThisTable > 0
                ? 'bg-gradient-to-r from-amber-500/25 via-orange-500/20 to-rose-500/25 dark:from-amber-950/60 dark:via-orange-950/50 dark:to-rose-950/60 border-amber-500/60 hover:border-amber-500 shadow-amber-500/20 animate-pulse'
                : 'bg-gradient-to-r from-rose-500/10 via-amber-500/10 to-orange-500/10 dark:from-rose-950/40 dark:via-amber-950/30 dark:to-orange-950/40 border-amber-500/30 hover:border-amber-500/60 hover:shadow-amber-500/10'
            }`}
            title={`Call dedicated waiter (${assignedWaiter.fullName}) to Table ${tableNumber}`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
                pendingAlertsForThisTable > 0
                  ? 'bg-gradient-to-br from-amber-500 to-rose-600 text-white animate-bounce'
                  : 'bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 text-white shadow-sm shadow-amber-500/20 group-hover:rotate-12 transition-transform'
              }`}>
                <Bell className="w-5 h-5 text-white" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h4 className="font-display font-black text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                    Call Waiter
                  </h4>
                  {pendingAlertsForThisTable > 0 && (
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping shrink-0" />
                  )}
                </div>
                <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5 font-medium">
                  {pendingAlertsForThisTable > 0 ? 'Alert Sent • Arriving' : `Waiter: ${assignedWaiter.fullName}`}
                </p>
              </div>
            </div>

            <div className="shrink-0 w-7 h-7 rounded-xl bg-rose-500/10 dark:bg-rose-500/15 flex items-center justify-center text-rose-600 dark:text-rose-400 group-hover:bg-rose-500 group-hover:text-white transition-all">
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </section>

        {/* 2. AUTOMATED TIME-BASED MENU BANNER */}
        <section aria-label="Meal Time Status" className="mb-5 p-3.5 sm:p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-2xl shadow-sm shrink-0 ${
              mealTime === 'morning' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/70 dark:text-amber-300' :
              mealTime === 'lunch' ? 'bg-orange-100 text-orange-700 dark:bg-orange-950/70 dark:text-orange-300' :
              'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300'
            }`}>
              {mealTime === 'morning' && '🌅'}
              {mealTime === 'lunch' && '☀️'}
              {mealTime === 'dinner' && '🌙'}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-display font-black text-base sm:text-lg text-slate-900 dark:text-white">
                  {mealTime === 'morning' && t.morningBreakfast}
                  {mealTime === 'lunch' && t.lunchAfternoon}
                  {mealTime === 'dinner' && t.dinnerEvening}
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-black bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5 border border-emerald-200/60 dark:border-emerald-800/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {t.autoTimeBadge}
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {mealTime === 'morning' && `${t.morningHours} • Morning breakfast dishes automatically served`}
                {mealTime === 'lunch' && `${t.lunchHours} • Lunch dishes automatically served`}
                {mealTime === 'dinner' && `${t.dinnerHours} • Dinner dishes automatically served`}
              </p>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold border border-slate-200/70 dark:border-slate-700 shadow-xs shrink-0">
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            <span>Time-Based Active</span>
          </div>
        </section>

        {/* 3. VIBRANT PROMOTIONAL BANNER CARDS (DelishDrop Theme Inspired) */}
        <PromoAdBanner onSelectCategory={(cat) => setSelectedCategory(cat)} />

        {/* 4. SEARCH & FILTER PILLS BAR (Inspired by Image 2 White Napkin Gourmet Theme) */}
        <section aria-label="Search and Filter Controls" className="mb-6 space-y-3">
          
          {/* Capsule Search Bar */}
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder="Search for delicious dishes, curries, tandoors, biryanis..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-20 py-3 rounded-full bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-sm font-medium text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/25 focus:border-amber-500 shadow-sm transition-all"
            />
            {searchQuery && (
              <button 
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md"
              >
                Clear
              </button>
            )}
          </div>

          {/* Horizontal Scrollable Filter Pill Chips (Image 2 Style) */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            
            {/* Pill: All Diet */}
            <button
              type="button"
              onClick={() => setDietFilter('all')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap shadow-xs active:scale-95 ${
                dietFilter === 'all'
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-black'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              All Items
            </button>

            {/* Pill: Vegetarian Chip (Green Dot/Leaf) */}
            <button
              type="button"
              onClick={() => setDietFilter(dietFilter === 'veg' ? 'all' : 'veg')}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap shadow-xs active:scale-95 border ${
                dietFilter === 'veg'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-emerald-500/20'
                  : 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 border-emerald-200/80 dark:border-emerald-900/60 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
              }`}
            >
              <Leaf className="w-3.5 h-3.5 fill-emerald-500" />
              <span>{t.veg}</span>
            </button>

            {/* Pill: Non-Vegetarian Chip (Rose Dot/Drumstick) */}
            <button
              type="button"
              onClick={() => setDietFilter(dietFilter === 'non-veg' ? 'all' : 'non-veg')}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap shadow-xs active:scale-95 border ${
                dietFilter === 'non-veg'
                  ? 'bg-rose-600 text-white border-rose-600 shadow-rose-500/20'
                  : 'bg-white dark:bg-slate-900 text-rose-700 dark:text-rose-400 border-rose-200/80 dark:border-rose-900/60 hover:bg-rose-50 dark:hover:bg-rose-950/40'
              }`}
            >
              <Drumstick className="w-3.5 h-3.5" />
              <span>{t.nonVeg}</span>
            </button>

            {/* Pill: Rating Over 4.5 Filter */}
            <button
              type="button"
              onClick={() => setRatingFilter(!ratingFilter)}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap shadow-xs active:scale-95 border ${
                ratingFilter
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-amber-500/20 font-black'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200/80 dark:border-slate-800 hover:border-amber-300'
              }`}
            >
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
              <span>Over 4.5 ⭐</span>
            </button>

            {/* Pill: Fast Prep (< 15 Min) */}
            <button
              type="button"
              onClick={() => setFastPrepFilter(!fastPrepFilter)}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap shadow-xs active:scale-95 border ${
                fastPrepFilter
                  ? 'bg-cyan-600 text-white border-cyan-500 shadow-cyan-500/20 font-black'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200/80 dark:border-slate-800 hover:border-cyan-300'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-cyan-500" />
              <span>Fast Prep (&lt;15m)</span>
            </button>

          </div>
        </section>

        {/* 5. CATEGORY TABS ROW (DelishDrop & White Napkin rounded capsule design) */}
        <nav aria-label="Food Categories" className="flex items-center gap-2.5 overflow-x-auto no-scrollbar pb-3 mb-6 -mx-3 px-3 sm:mx-0 sm:px-0">
          
          {/* Standard categories with food emojis */}
          {standardCategories.map((cat) => (
            <button
              key={cat.key}
              type="button"
              onClick={() => setSelectedCategory(cat.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all duration-200 border active:scale-95 cursor-pointer shadow-xs ${
                selectedCategory === cat.key
                  ? 'bg-emerald-900 dark:bg-emerald-800 text-white border-emerald-900 dark:border-emerald-700 shadow-md scale-102 font-black'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span className="text-base">{cat.icon}</span>
              <span>{getCategoryLabel(cat.key)}</span>
            </button>
          ))}

          {/* HIGHLIGHTED COMBO BUTTON (Vibrant Emerald Theme) */}
          <button
            type="button"
            onClick={() => setSelectedCategory('Combo')}
            className={`px-4 py-2.5 rounded-2xl font-black text-xs sm:text-sm whitespace-nowrap transition-all duration-200 border-2 active:scale-95 flex items-center gap-1.5 shadow-sm cursor-pointer ${
              selectedCategory === 'Combo'
                ? 'bg-emerald-500 text-white border-emerald-400 shadow-lg shadow-emerald-500/25 scale-105'
                : 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-900 dark:text-emerald-300 border-emerald-400/80 hover:bg-emerald-200 dark:hover:bg-emerald-900/60'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>Chef Combos</span>
          </button>

          {/* HIGHLIGHTED SIGNATURE BUTTON (Royal Gold Signature Theme) */}
          <button
            type="button"
            onClick={() => setSelectedCategory('Signature')}
            className={`px-4 py-2.5 rounded-2xl font-black text-xs sm:text-sm whitespace-nowrap transition-all duration-200 border-2 active:scale-95 flex items-center gap-1.5 shadow-sm cursor-pointer ${
              selectedCategory === 'Signature'
                ? 'bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 border-amber-300 shadow-lg shadow-amber-500/35 scale-105'
                : 'bg-amber-100 dark:bg-amber-950/70 text-amber-950 dark:text-amber-200 border-amber-400/80 hover:bg-amber-200 dark:hover:bg-amber-900/60'
            }`}
          >
            <Crown className="w-4 h-4 text-amber-600 dark:text-amber-300" />
            <span>Signature</span>
          </button>

        </nav>

        {/* 6. SECTION HEADER ("Our Top Picks" Style from Image 1) */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <h2 className="font-display font-black text-xl sm:text-2xl text-slate-900 dark:text-white">
              {selectedCategory === 'All' && 'Our Top Picks & Specials'}
              {selectedCategory === 'Starters' && 'Starters & Artisanal Appetizers'}
              {selectedCategory === 'Main Course' && 'Main Course Gourmet Curries'}
              {selectedCategory === 'Breads & Rice' && 'Breads & Slow-Dum Biryanis'}
              {selectedCategory === 'Beverages' && 'Signature Beverages & Coolers'}
              {selectedCategory === 'Desserts' && 'Royal Confections & Desserts'}
              {selectedCategory === 'Combo' && '🍱 Chef Value Combos'}
              {selectedCategory === 'Signature' && '👑 Royal Ember Signature Dishes'}
            </h2>
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
              {filteredItems.length}
            </span>
          </div>

          {selectedCategory !== 'Signature' && selectedCategory !== 'Combo' && (
            <span className="text-xs text-amber-600 dark:text-amber-400 font-bold hidden sm:flex items-center gap-1">
              <Crown className="w-3.5 h-3.5 text-amber-500" />
              <span>Signature dishes served first</span>
            </span>
          )}
        </div>

        {/* 7. FOOD ITEMS GRID: Modern DelishDrop & White Napkin Cards */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 p-8 shadow-xs">
            <AlertCircle className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <h4 className="font-display text-lg font-bold text-slate-700 dark:text-slate-200 mb-1">
              No dishes found
            </h4>
            <p className="text-xs text-slate-400 dark:text-slate-500 mb-4 max-w-sm mx-auto">
              Try adjusting your search query, dietary filter, or choose another category.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setDietFilter('all');
                setRatingFilter(false);
                setFastPrepFilter(false);
              }}
              className="px-5 py-2.5 rounded-full bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black transition-colors cursor-pointer shadow-md"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {filteredItems.map((item) => {
              const inCartItems = cart.filter((c) => c.menuItemId === item.id);
              const inCartCount = inCartItems.reduce((acc, c) => acc + c.quantity, 0);
              const inCartTotal = inCartItems.reduce((acc, c) => acc + c.price * c.quantity, 0);

              const localizedName = getLocalizedItemName(item, language);
              const localizedDesc = getLocalizedItemDescription(item, language);
              const itemRating = item.rating || (item.isSignature ? 4.9 : 4.8);

              return (
                <div
                  key={item.id}
                  onClick={() => item.isAvailable && onSelectItem(item)}
                  className={`group relative rounded-3xl transition-all duration-300 overflow-hidden flex flex-col justify-between cursor-pointer border ${
                    !item.isAvailable
                      ? 'opacity-65 border-slate-200 dark:border-slate-800 grayscale-[0.4] bg-white dark:bg-slate-900'
                      : item.isSignature
                      ? 'bg-white dark:bg-slate-900 border-2 border-amber-400/90 dark:border-amber-400/80 shadow-md hover:shadow-xl hover:-translate-y-1'
                      : item.isCombo
                      ? 'bg-white dark:bg-slate-900 border-2 border-emerald-500/90 dark:border-emerald-500/80 shadow-md hover:shadow-xl hover:-translate-y-1'
                      : 'bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm hover:shadow-xl hover:-translate-y-1'
                  }`}
                >
                  
                  {/* Top Distinct Ribbon for Signature and Combo Cards */}
                  {item.isSignature && (
                    <div className="bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 px-4 py-1.5 flex items-center justify-between font-black text-[11px] tracking-wider uppercase shadow-xs">
                      <div className="flex items-center gap-1.5">
                        <Crown className="w-3.5 h-3.5 text-slate-950" />
                        <span>Chef's Signature Dish</span>
                      </div>
                      <span className="text-[10px] font-black bg-slate-950/15 px-2 py-0.5 rounded-full">
                        Royal Special
                      </span>
                    </div>
                  )}

                  {item.isCombo && (
                    <div className="bg-emerald-600 text-white px-4 py-1.5 flex items-center justify-between font-black text-[11px] tracking-wider uppercase shadow-xs">
                      <div className="flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5" />
                        <span>Chef Value Combo</span>
                      </div>
                      <span className="text-[10px] font-black bg-white/20 px-2 py-0.5 rounded-full">
                        Save Up To ₹120
                      </span>
                    </div>
                  )}

                  {/* Food Image Container */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img
                      src={item.image}
                      alt={item.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-500 ease-out"
                    />

                    {/* Gradient Overlay for badges */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/25 pointer-events-none" />

                    {/* Top Left Badges: Veg/Non-Veg Authentic Symbol + Spicy */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
                      {/* Authentic Square Symbol with Dot */}
                      <span className={`w-5 h-5 rounded-md flex items-center justify-center p-0.5 border shadow-sm ${
                        item.isVeg 
                          ? 'bg-white border-emerald-600 text-emerald-600' 
                          : 'bg-white border-rose-600 text-rose-600'
                      }`}>
                        <span className={`w-2 h-2 rounded-full ${item.isVeg ? 'bg-emerald-600' : 'bg-rose-600'}`} />
                      </span>

                      {item.isSpicy && (
                        <span className="flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-rose-500/95 text-white text-[10px] font-bold shadow-sm backdrop-blur-xs">
                          <Flame className="w-3 h-3" />
                          <span>Spicy</span>
                        </span>
                      )}
                    </div>

                    {/* Top Right: Rating Pill + Prep Time Pill (Image 2 White Napkin Style) */}
                    <div className="absolute top-3 right-3 flex items-center gap-1.5">
                      <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-amber-300 text-xs font-black shadow-sm border border-white/10">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>{itemRating}</span>
                      </div>

                      <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-semibold shadow-sm border border-white/10">
                        <Clock className="w-3 h-3 text-white/80" />
                        <span>{item.prepTimeMinutes}m</span>
                      </div>
                    </div>

                    {/* Bottom overlay: Popularity tag */}
                    <div className="absolute bottom-2.5 left-3 flex items-center gap-1 text-[11px] font-bold text-white drop-shadow-md">
                      <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
                      <span>{item.popularityText || 'Customer Favorite'}</span>
                    </div>

                    {/* Sold out overlay if unavailable */}
                    {!item.isAvailable && (
                      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center">
                        <span className="px-4 py-1.5 rounded-xl bg-red-600 text-white font-black text-sm uppercase tracking-wider shadow-lg">
                          {t.soldOut}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Food Content Card */}
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Name & Price Row */}
                      <div className="flex items-baseline justify-between gap-2 mb-1.5">
                        <h3 className="font-display font-black text-base sm:text-lg text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors line-clamp-1">
                          {localizedName}
                        </h3>
                        
                        <div className="text-right shrink-0">
                          <span className="font-display font-black text-lg sm:text-xl text-slate-950 dark:text-amber-400">
                            {inCartCount > 1 ? `₹${inCartTotal}` : `₹${item.price}`}
                          </span>
                          {inCartCount > 1 && (
                            <span className="block text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                              ({inCartCount} in cart)
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Appetizing Short Description */}
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4 font-normal">
                        {localizedDesc}
                      </p>
                    </div>

                    {/* Bottom Action Bar: Calories & Pill Add Button */}
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800/80 mt-auto">
                      <div className="text-[11px] font-semibold text-slate-400 dark:text-slate-500">
                        {item.calories} kcal • {item.allergens.join(', ')}
                      </div>

                      {item.isAvailable ? (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectItem(item);
                          }}
                          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-black transition-all active:scale-95 cursor-pointer shadow-md ${
                            inCartCount > 0
                              ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700'
                              : 'bg-emerald-900 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white shadow-emerald-900/20'
                          }`}
                        >
                          {inCartCount > 0 ? (
                            <>
                              <Check className="w-3.5 h-3.5 stroke-[3] text-amber-600 dark:text-amber-400" />
                              <span>{inCartCount} in cart</span>
                            </>
                          ) : (
                            <>
                              <Plus className="w-3.5 h-3.5 stroke-[3]" />
                              <span>{t.add}</span>
                            </>
                          )}
                        </button>
                      ) : (
                        <span className="text-xs font-bold text-slate-400 dark:text-slate-500">
                          Unavailable
                        </span>
                      )}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Call Waiter Modal */}
      <CallWaiterModal 
        isOpen={isCallWaiterOpen} 
        onClose={() => setIsCallWaiterOpen(false)} 
      />

    </div>
  );
};

export default MenuScreen;

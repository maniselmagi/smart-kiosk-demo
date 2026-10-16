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
  ChevronRight
} from 'lucide-react';
import { PromoAdBanner } from './PromoAdBanner';
import { getAssignedWaiter } from '../../utils/waiterAssignment';

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
    guestCount,
    customerName,
    language, 
    t, 
    mealTime,
    activeOrders,
    currentTrackedOrder
  } = useKiosk();

  const assignedWaiter = getAssignedWaiter(tableNumber);

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

  const standardCategories: Category[] = [
    'All',
    'Starters',
    'Main Course',
    'Breads & Rice',
    'Beverages',
    'Desserts',
  ];

  const getCategoryLabel = (cat: Category) => {
    switch (cat) {
      case 'All': return t.allCategories;
      case 'Starters': return t.starters;
      case 'Main Course': return t.mainCourse;
      case 'Breads & Rice': return t.breadsRice;
      case 'Beverages': return t.beverages;
      case 'Desserts': return t.desserts;
      case 'Combo': return 'Combo';
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

      // 4. Search query across all available languages
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

    // 5. CRITICAL REQUIREMENT: SORT SIGNATURE DISHES FIRST IN EVERY CATEGORY/HEADLINE!
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
  }, [menuItems, mealTime, selectedCategory, dietFilter, searchQuery]);

  return (
    <div className="pb-28">
      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-5">
        {/* Responsive Quick Action Hero Bar: Track Order & Play Games / News (Replaces old clipped Welcome card for tablets) */}
        <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 animate-fade-in">
          {/* Card 1: Live Track Order */}
          <div 
            onClick={onOpenOrderTracker}
            role="button"
            tabIndex={0}
            className={`p-3.5 sm:p-4 rounded-3xl border transition-all duration-200 cursor-pointer flex items-center justify-between gap-3 group select-none shadow-xs hover:shadow-md ${
              activeTableOrder 
                ? 'bg-gradient-to-r from-cyan-500/15 via-teal-500/10 to-emerald-500/15 dark:from-cyan-950/50 dark:via-teal-950/40 dark:to-emerald-950/50 border-cyan-500/40 hover:border-cyan-500/70 shadow-cyan-500/10'
                : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
            title={activeTableOrder ? `Track Order #${activeTableOrder.orderNumber}` : 'View Order Tracking'}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
                activeTableOrder 
                  ? 'bg-gradient-to-br from-cyan-500 to-teal-600 text-white animate-pulse'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
              }`}>
                <Activity className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                  <h4 className="font-black text-sm sm:text-base text-slate-900 dark:text-white font-display truncate">
                    {activeTableOrder 
                      ? `Track Order #${activeTableOrder.orderNumber}`
                      : 'Live Order Tracker'}
                  </h4>
                  {activeTableOrder ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1 shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                      {activeTableOrder.status === 'NEW' && 'Received'}
                      {activeTableOrder.status === 'PREPARING' && 'In Kitchen'}
                      {activeTableOrder.status === 'READY' && 'Ready to Serve'}
                      {activeTableOrder.status === 'COMPLETED' && 'Delivered'}
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 shrink-0">
                      Table {tableNumber}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                  {activeTableOrder 
                    ? `Est. prep: ${activeTableOrder.estimatedPrepTime || 15} mins • Click for live kitchen countdown`
                    : `Real-time cooking status & delivery countdown for Table ${tableNumber}`}
                </p>
              </div>
            </div>

            <button
              type="button"
              className={`shrink-0 px-3 py-2 rounded-xl text-xs font-black flex items-center gap-1 transition-transform group-hover:translate-x-0.5 cursor-pointer ${
                activeTableOrder
                  ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
              }`}
            >
              <span>{activeTableOrder ? 'Track' : 'View'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 2: Play Games & Live News Lounge */}
          <div 
            onClick={onOpenEntertainment}
            role="button"
            tabIndex={0}
            className="p-3.5 sm:p-4 rounded-3xl border transition-all duration-200 cursor-pointer flex items-center justify-between gap-3 group select-none shadow-xs hover:shadow-md bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-600/15 dark:from-amber-950/50 dark:via-orange-950/40 dark:to-amber-950/50 border-amber-500/40 hover:border-amber-500/70 shadow-amber-500/10"
            title="Open Interactive Games & Multi-Language E-Paper Lounge"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 text-slate-950 flex items-center justify-center shrink-0 shadow-md shadow-amber-500/25 group-hover:rotate-6 transition-transform">
                <Gamepad2 className="w-5 h-5 sm:w-6 sm:h-6 text-slate-950" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                  <h4 className="font-black text-sm sm:text-base text-slate-900 dark:text-white font-display truncate">
                    Play Games & News
                  </h4>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-500/30 flex items-center gap-1 shrink-0">
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    Lounge
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                  Ludo, Sudoku, Snakes & Ladders & live e-Papers
                </p>
              </div>
            </div>

            <button
              type="button"
              className="shrink-0 px-3 py-2 rounded-xl text-xs font-black flex items-center gap-1 transition-transform group-hover:translate-x-0.5 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-xs cursor-pointer"
            >
              <span>Play</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Automated Time-Based Menu Banner */}
        <div className="mb-5 p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
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
                <h3 className="font-black text-lg md:text-xl text-slate-900 dark:text-white">
                  {mealTime === 'morning' && t.morningBreakfast}
                  {mealTime === 'lunch' && t.lunchAfternoon}
                  {mealTime === 'dinner' && t.dinnerEvening}
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5 border border-emerald-200/60 dark:border-emerald-800/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {t.autoTimeBadge}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {mealTime === 'morning' && `${t.morningHours} • Morning breakfast dishes automatically served`}
                {mealTime === 'lunch' && `${t.lunchHours} • Lunch dishes automatically served`}
                {mealTime === 'dinner' && `${t.dinnerHours} • Dinner dishes automatically served`}
              </p>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold border border-slate-200/70 dark:border-slate-700 shadow-xs">
            <Clock className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
            <span>Automatic Time-Based Menu</span>
          </div>
        </div>

        {/* ADVERTISEMENT PORTION: Combo, Festival Offer & Today's Specials */}
        <PromoAdBanner onSelectCategory={(cat) => setSelectedCategory(cat)} />

        {/* Search & Dietary Filters Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 mb-5">
          
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder={t.searchMenu}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-sm font-medium text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 shadow-sm transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          {/* Veg / Non-Veg Quick Toggles */}
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-850 p-1 rounded-2xl border border-slate-200/60 dark:border-slate-800 self-start md:self-auto">
            <button
              onClick={() => setDietFilter('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                dietFilter === 'all'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setDietFilter('veg')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                dietFilter === 'veg'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
              }`}
            >
              <Leaf className="w-3.5 h-3.5" />
              <span>{t.veg}</span>
            </button>
            <button
              onClick={() => setDietFilter('non-veg')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                dietFilter === 'non-veg'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40'
              }`}
            >
              <Drumstick className="w-3.5 h-3.5" />
              <span>{t.nonVeg}</span>
            </button>
          </div>

        </div>

        {/* CATEGORY TABS: All, Starters, Main Course, Breads & Rice, Beverages, Desserts + [COMBO] + [SIGNATURE] */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-6 -mx-4 px-4 md:mx-0 md:px-0">
          
          {/* Standard categories */}
          {standardCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 md:px-5 py-2.5 rounded-2xl font-bold text-sm whitespace-nowrap transition-all duration-200 border active:scale-95 cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-slate-900 dark:bg-brand-600 text-white border-slate-900 dark:border-brand-600 shadow-md'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white shadow-sm'
              }`}
            >
              {getCategoryLabel(cat)}
            </button>
          ))}

          {/* HIGHLIGHTED COMBO BUTTON (Green Theme as in mockup) */}
          <button
            onClick={() => setSelectedCategory('Combo')}
            className={`px-5 py-2.5 rounded-2xl font-black text-sm whitespace-nowrap transition-all duration-200 border-2 active:scale-95 flex items-center gap-1.5 shadow-sm cursor-pointer ${
              selectedCategory === 'Combo'
                ? 'bg-emerald-500 text-white border-emerald-400 shadow-lg shadow-emerald-500/25 scale-105'
                : 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-900 dark:text-emerald-300 border-emerald-400/80 hover:bg-emerald-200 dark:hover:bg-emerald-900/60'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>Combo</span>
          </button>

          {/* HIGHLIGHTED SIGNATURE BUTTON (Cyan Signature Theme as in mockup) */}
          <button
            onClick={() => setSelectedCategory('Signature')}
            className={`px-5 py-2.5 rounded-2xl font-black text-sm whitespace-nowrap transition-all duration-200 border-2 active:scale-95 flex items-center gap-1.5 shadow-sm cursor-pointer ${
              selectedCategory === 'Signature'
                ? 'bg-cyan-400 text-slate-950 border-cyan-300 shadow-lg shadow-cyan-400/35 scale-105'
                : 'bg-cyan-100 dark:bg-cyan-950/70 text-cyan-950 dark:text-cyan-200 border-cyan-400/80 hover:bg-cyan-200 dark:hover:bg-cyan-900/60'
            }`}
          >
            <Crown className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>Signature</span>
          </button>

        </div>

        {/* Active Category Header Feedback */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-slate-900 dark:text-white">
              {selectedCategory === 'All' && 'All Dishes'}
              {selectedCategory === 'Starters' && 'Starters & Appetizers'}
              {selectedCategory === 'Main Course' && 'Main Course Curries'}
              {selectedCategory === 'Breads & Rice' && 'Breads & Dum Biryani'}
              {selectedCategory === 'Beverages' && 'Beverages & Drinks'}
              {selectedCategory === 'Desserts' && 'Royal Desserts'}
              {selectedCategory === 'Combo' && '🍱 Chef Value Combos'}
              {selectedCategory === 'Signature' && '👑 Royal Ember Signature Dishes'}
            </h2>
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500">
              ({filteredItems.length} items)
            </span>
          </div>

          {selectedCategory !== 'Signature' && selectedCategory !== 'Combo' && (
            <span className="text-xs text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1">
              <Crown className="w-3.5 h-3.5 text-cyan-500" />
              <span className="hidden sm:inline">Signature dishes served first</span>
            </span>
          )}
        </div>

        {/* Food Items Grid - Signature dishes appear FIRST */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 p-8">
            <AlertCircle className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <h4 className="text-lg font-bold text-slate-700 dark:text-slate-200 mb-1">
              No dishes found
            </h4>
            <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">
              Try adjusting your search query, dietary filter, or choose another category.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setDietFilter('all');
              }}
              className="px-4 py-2 rounded-xl bg-brand-500 text-white text-xs font-bold hover:bg-brand-600 transition-colors cursor-pointer"
            >
              Reset Filters
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

              return (
                <div
                  key={item.id}
                  onClick={() => item.isAvailable && onSelectItem(item)}
                  className={`group relative rounded-3xl transition-all duration-300 overflow-hidden flex flex-col justify-between cursor-pointer border ${
                    !item.isAvailable
                      ? 'opacity-65 border-slate-200 dark:border-slate-800 grayscale-[0.4] bg-white dark:bg-slate-900'
                      : item.isSignature
                      ? 'bg-gradient-to-b from-cyan-50/90 via-cyan-50/40 to-white dark:from-cyan-950/40 dark:via-slate-900 dark:to-slate-900 border-2 border-cyan-400 dark:border-cyan-400 ring-2 ring-cyan-400/25 shadow-lg shadow-cyan-400/15 hover:shadow-cyan-400/30 hover:-translate-y-1'
                      : item.isCombo
                      ? 'bg-gradient-to-b from-emerald-50/90 via-emerald-50/40 to-white dark:from-emerald-950/40 dark:via-slate-900 dark:to-slate-900 border-2 border-emerald-500 dark:border-emerald-500 ring-2 ring-emerald-500/25 shadow-lg shadow-emerald-500/15 hover:shadow-emerald-500/30 hover:-translate-y-1'
                      : 'bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-brand-400/80 dark:hover:border-brand-500/80 hover:shadow-kiosk hover:-translate-y-0.5'
                  }`}
                >
                  
                  {/* Top Distinct Ribbon for Signature and Combo Cards */}
                  {item.isSignature && (
                    <div className="bg-cyan-400 text-slate-950 px-4 py-1.5 flex items-center justify-between font-black text-xs tracking-wider uppercase shadow-xs">
                      <div className="flex items-center gap-1.5">
                        <Crown className="w-3.5 h-3.5 fill-amber-700 text-amber-900" />
                        <span>Chef's Signature Dish</span>
                      </div>
                      <span className="text-[10px] font-extrabold bg-slate-950/15 px-2 py-0.5 rounded-full">
                        Royal Special
                      </span>
                    </div>
                  )}

                  {item.isCombo && (
                    <div className="bg-emerald-500 text-white px-4 py-1.5 flex items-center justify-between font-black text-xs tracking-wider uppercase shadow-xs">
                      <div className="flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5" />
                        <span>Chef Value Combo</span>
                      </div>
                      <span className="text-[10px] font-extrabold bg-white/20 px-2 py-0.5 rounded-full">
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
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Gradient Overlay for badges */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

                    {/* Top Left Badges: Veg/Non-Veg, Spice & Signature/Combo */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
                      <span className={`w-5 h-5 rounded-md flex items-center justify-center p-0.5 border shadow-sm ${
                        item.isVeg 
                          ? 'bg-white border-emerald-600 text-emerald-600' 
                          : 'bg-white border-rose-600 text-rose-600'
                      }`}>
                        <span className={`w-2 h-2 rounded-full ${item.isVeg ? 'bg-emerald-600' : 'bg-rose-600'}`} />
                      </span>

                      {/* SIGNATURE THEME BADGE (Cyan Theme as in mockup) */}
                      {item.isSignature && (
                        <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-cyan-400 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-sm">
                          <Crown className="w-3 h-3 text-amber-900" />
                          <span>Signature</span>
                        </span>
                      )}

                      {/* COMBO THEME BADGE (Green Theme as in mockup) */}
                      {item.isCombo && (
                        <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-black uppercase tracking-wider shadow-sm">
                          <Tag className="w-3 h-3" />
                          <span>Combo</span>
                        </span>
                      )}

                      {item.isSpicy && (
                        <span className="flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-rose-500/90 text-white text-[10px] font-bold shadow-sm backdrop-blur-xs">
                          <Flame className="w-3 h-3" />
                          <span>Spicy</span>
                        </span>
                      )}
                    </div>

                    {/* Top Right: Preparation Time Badge */}
                    <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-xl bg-black/65 backdrop-blur-md text-white text-xs font-semibold shadow-sm">
                      <Clock className="w-3.5 h-3.5 text-amber-300" />
                      <span>{item.prepTimeMinutes} {t.min}</span>
                    </div>

                    {/* Bottom overlay: Popularity tag */}
                    <div className="absolute bottom-2.5 left-3 flex items-center gap-1 text-[11px] font-bold text-white drop-shadow-md">
                      <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
                      <span>{item.popularityText}</span>
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
                  <div className="p-4 md:p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-baseline justify-between gap-2 mb-1">
                        <h3 className={`font-extrabold text-base md:text-lg transition-colors ${
                          item.isSignature 
                            ? 'text-cyan-950 dark:text-cyan-100 group-hover:text-cyan-600 dark:group-hover:text-cyan-300' 
                            : item.isCombo
                            ? 'text-emerald-950 dark:text-emerald-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-300'
                            : 'text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400'
                        }`}>
                          {localizedName}
                        </h3>
                        <div className="text-right shrink-0">
                          <span className={`font-extrabold text-lg md:text-xl font-display ${
                            item.isSignature 
                              ? 'text-cyan-700 dark:text-cyan-300' 
                              : item.isCombo 
                              ? 'text-emerald-700 dark:text-emerald-400' 
                              : 'text-brand-600 dark:text-brand-400'
                          }`}>
                            {inCartCount > 1 ? `₹${inCartTotal}` : `₹${item.price}`}
                          </span>
                          {inCartCount > 1 && (
                            <span className="block text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                              ({inCartCount} in cart)
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4">
                        {localizedDesc}
                      </p>
                    </div>

                    {/* Bottom Action Bar */}
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 mt-auto">
                      <div className="text-[11px] font-semibold text-slate-400 dark:text-slate-500">
                        {item.calories} kcal • {item.allergens.join(', ')}
                      </div>

                      {item.isAvailable ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectItem(item);
                          }}
                          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black transition-all active:scale-95 cursor-pointer ${
                            inCartCount > 0
                              ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-200 border border-amber-300 dark:border-amber-700 shadow-sm'
                              : item.isSignature
                              ? 'bg-cyan-400 hover:bg-cyan-300 text-slate-950 shadow-md shadow-cyan-400/30 border border-cyan-300'
                              : item.isCombo
                              ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-md shadow-emerald-500/30 border border-emerald-400'
                              : 'bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-500/20'
                          }`}
                        >
                          <Plus className="w-3.5 h-3.5 stroke-[3]" />
                          <span>{inCartCount > 0 ? `${inCartCount} in cart • ₹${inCartTotal}` : t.add}</span>
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

    </div>
  );
};

export default MenuScreen;

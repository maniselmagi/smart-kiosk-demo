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
  Minus,
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
  Heart,
  UtensilsCrossed
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
  onOpenCart,
  onOpenOrderTracker,
  onOpenEntertainment 
}) => {
  const { 
    menuItems, 
    cart, 
    addToCart,
    updateCartQuantity,
    tableNumber,
    language, 
    t, 
    mealTime,
    activeOrders,
    currentTrackedOrder,
    staffAlerts
  } = useKiosk();

  const [isCallWaiterOpen, setIsCallWaiterOpen] = useState(false);
  const [favoriteItemIds, setFavoriteItemIds] = useState<Record<string, boolean>>({});
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

  // Modern Categories with Food Icons matching Reference Image ("Chicken Grill House" style)
  const categoriesList: { key: Category; label: string; icon: string; countLabel: string }[] = [
    { key: 'All', label: 'All Items', icon: '🍽️', countLabel: 'All' },
    { key: 'Starters', label: 'Starters', icon: '🍗', countLabel: 'Appetizers' },
    { key: 'Main Course', label: 'Main Course', icon: '🍛', countLabel: 'Curries' },
    { key: 'Breads & Rice', label: 'Breads & Rice', icon: '🍚', countLabel: 'Naan & Biryani' },
    { key: 'Beverages', label: 'Beverages', icon: '🍹', countLabel: 'Coolers & Tea' },
    { key: 'Desserts', label: 'Desserts', icon: '🍰', countLabel: 'Sweets' },
    { key: 'Combo', label: 'Chef Combos', icon: '🍱', countLabel: 'Value Deals' },
    { key: 'Signature', label: 'Signature', icon: '👑', countLabel: 'Royal Special' },
  ];

  const toggleFavorite = (itemId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavoriteItemIds(prev => ({ ...prev, [itemId]: !prev[itemId] }));
  };

  // Quick Direct Add / Quantity change from card button
  const handleQuickAdd = (item: MenuItem, e: React.MouseEvent) => {
    e.stopPropagation();
    // If item has customizable options, open detail modal for full choice
    if (item.customizationOptions && item.customizationOptions.length > 0) {
      onSelectItem(item);
    } else {
      addToCart(item, item.isSpicy ? 'Medium' : 'Mild', [], '', 1);
    }
  };

  const handleQuickQuantity = (item: MenuItem, delta: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const existingInCart = cart.find(c => c.menuItemId === item.id);
    if (existingInCart) {
      updateCartQuantity(existingInCart.cartItemId, delta);
    } else if (delta > 0) {
      addToCart(item, item.isSpicy ? 'Medium' : 'Mild', [], '', 1);
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

    // 7. Sort signature dishes strictly first, then combos, then popularity
    return list.sort((a, b) => {
      if (a.isSignature && !b.isSignature) return -1;
      if (!a.isSignature && b.isSignature) return 1;
      if (a.isCombo && !b.isCombo) return -1;
      if (!a.isCombo && b.isCombo) return 1;
      return (b.orderedTodayCount || 0) - (a.orderedTodayCount || 0);
    });
  }, [menuItems, mealTime, selectedCategory, dietFilter, ratingFilter, fastPrepFilter, searchQuery]);

  return (
    <div className={`pb-28 transition-colors duration-300 ${
      mealTime === 'dinner' 
        ? 'bg-slate-950 text-white' 
        : 'bg-slate-50/60 dark:bg-slate-950 text-slate-900 dark:text-slate-100'
    }`}>
      
      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 pt-4 sm:pt-5 space-y-6">

        {/* 1. TIME-BASED MEAL BANNER (Shows active Dinner / Lunch / Breakfast status cleanly) */}
        <div className="p-3.5 sm:p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-2xl shadow-sm shrink-0 ${
              mealTime === 'morning' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/70 dark:text-amber-300' :
              mealTime === 'lunch' ? 'bg-orange-100 text-orange-700 dark:bg-orange-950/70 dark:text-orange-300' :
              'bg-indigo-950 text-amber-400 border border-amber-500/30'
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
                  {mealTime === 'dinner' && `${t.dinnerEvening} — Night Mode Active`}
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-black bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5 border border-emerald-200/60 dark:border-emerald-800/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {t.autoTimeBadge}
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {mealTime === 'morning' && `${t.morningHours} • Morning breakfast dishes automatically served`}
                {mealTime === 'lunch' && `${t.lunchHours} • Lunch dishes automatically served`}
                {mealTime === 'dinner' && `${t.dinnerHours} • Dinner sizzlers & tandoori platters served hot`}
              </p>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold border border-slate-200/70 dark:border-slate-700 shadow-xs shrink-0">
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            <span>Time-Synchronized Menu</span>
          </div>
        </div>

        {/* 2. PROMOTIONAL OFFER CARDS IN SLIDE BAR DESIGN (Time-Based Offers, Combos & Signatures) */}
        <PromoAdBanner onSelectCategory={(cat) => setSelectedCategory(cat)} />

        {/* 3. CATEGORIES SECTION (Reference Image "Chicken Grill House" Theme) */}
        <section aria-label="Menu Categories" className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-amber-500 text-base">🌿</span>
              <h3 className="font-display font-black text-lg sm:text-xl text-slate-900 dark:text-white">
                Categories
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setSelectedCategory('All')}
              className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
            >
              <span>View All Menu</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Clean Rounded-2xl Category Cards (matching the reference image) */}
          <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-8 gap-2.5 sm:gap-3">
            {categoriesList.map((cat) => {
              const isActive = selectedCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  type="button"
                  onClick={() => setSelectedCategory(cat.key)}
                  className={`p-3 rounded-2xl sm:rounded-3xl flex flex-col items-center justify-center text-center transition-all duration-200 cursor-pointer border active:scale-95 group ${
                    isActive
                      ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-lg shadow-amber-400/25 scale-103 font-black'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200/80 dark:border-slate-800 hover:border-amber-300 dark:hover:border-slate-700 shadow-xs hover:shadow-md'
                  }`}
                >
                  {/* Category Circular Emoji Badge */}
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl mb-2 transition-transform group-hover:scale-110 ${
                    isActive 
                      ? 'bg-slate-950 text-amber-400 shadow-sm' 
                      : 'bg-amber-50 dark:bg-slate-800'
                  }`}>
                    {cat.icon}
                  </div>
                  
                  {/* Category Name */}
                  <span className={`text-xs font-extrabold truncate w-full ${isActive ? 'text-slate-950 font-black' : 'text-slate-900 dark:text-white'}`}>
                    {cat.label}
                  </span>
                  <span className={`text-[10px] mt-0.5 truncate w-full ${isActive ? 'text-slate-800 font-bold' : 'text-slate-400 dark:text-slate-500 font-medium'}`}>
                    {cat.countLabel}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* 4. CAPSULE SEARCH BAR & FILTER PILL CHIPS */}
        <section aria-label="Search and Filter Controls" className="space-y-3">
          
          {/* Capsule Search Bar (Reference Image Style) */}
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
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full"
              >
                Clear
              </button>
            )}
          </div>

          {/* Horizontal Scrollable Filter Pill Chips */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
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

        {/* 5. POPULAR DISHES SECTION HEADER (Reference Image "Popular Dishes" Style) */}
        <div className="flex items-center justify-between pt-2">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display font-black text-2xl sm:text-3xl text-slate-900 dark:text-white tracking-tight">
                Popular Dishes
              </h2>
              <span className="text-amber-500 font-display font-black text-lg">~</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
              Freshly prepared artisanal meals served straight to Table {tableNumber}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700 shadow-xs">
              {filteredItems.length} Dishes
            </span>
          </div>
        </div>

        {/* 6. FOOD ITEMS GRID: CURRENT TREND MODERN CARDS (Exactly like the Reference Image!) */}
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
              className="px-5 py-2.5 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black transition-colors cursor-pointer shadow-md"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {filteredItems.map((item) => {
              const inCartItems = cart.filter((c) => c.menuItemId === item.id);
              const inCartCount = inCartItems.reduce((acc, c) => acc + c.quantity, 0);

              const localizedName = getLocalizedItemName(item, language);
              const localizedDesc = getLocalizedItemDescription(item, language);
              const itemRating = item.rating || (item.isSignature ? 4.9 : 4.8);
              const reviewCount = item.orderedTodayCount ? item.orderedTodayCount * 3 : 85;
              const isFav = !!favoriteItemIds[item.id];

              return (
                <div
                  key={item.id}
                  onClick={() => item.isAvailable && onSelectItem(item)}
                  className={`group relative rounded-3xl transition-all duration-300 overflow-hidden flex flex-col justify-between cursor-pointer border p-3.5 sm:p-4 ${
                    !item.isAvailable
                      ? 'opacity-65 border-slate-200 dark:border-slate-800 grayscale-[0.4] bg-white dark:bg-slate-900'
                      : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800/90 shadow-[0_4px_25px_rgba(0,0,0,0.05)] hover:shadow-xl hover:-translate-y-1.5'
                  }`}
                >
                  
                  {/* TOP FOOD PRESENTATION CONTAINER */}
                  <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-amber-50/40 dark:bg-slate-850 flex items-center justify-center">
                    
                    {/* Food Image with Smooth Hover Zoom */}
                    <img
                      src={item.image}
                      alt={item.name}
                      loading="lazy"
                      className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500 ease-out"
                    />

                    {/* Gradient Overlay for contrast */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />

                    {/* Top-Left: Authentic Veg / Non-Veg Indicator */}
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 z-10">
                      <span className={`w-5 h-5 rounded-md flex items-center justify-center p-0.5 border shadow-sm ${
                        item.isVeg 
                          ? 'bg-white border-emerald-600 text-emerald-600' 
                          : 'bg-white border-rose-600 text-rose-600'
                      }`}>
                        <span className={`w-2 h-2 rounded-full ${item.isVeg ? 'bg-emerald-600' : 'bg-rose-600'}`} />
                      </span>

                      {item.isSpicy && (
                        <span className="flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-bold shadow-xs">
                          <Flame className="w-3 h-3" />
                          <span>Spicy</span>
                        </span>
                      )}
                    </div>

                    {/* Top-Right: Favorite Heart Toggle + Prep Time */}
                    <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 z-10">
                      <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-md text-white text-[10px] font-semibold border border-white/10">
                        <Clock className="w-2.5 h-2.5 text-amber-300" />
                        <span>{item.prepTimeMinutes}m</span>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => toggleFavorite(item.id, e)}
                        className={`w-7 h-7 rounded-full flex items-center justify-center backdrop-blur-md transition-all active:scale-90 ${
                          isFav 
                            ? 'bg-rose-500 text-white shadow-sm' 
                            : 'bg-black/40 hover:bg-black/60 text-white'
                        }`}
                        title="Add to Favorites"
                        aria-label="Add to Favorites"
                      >
                        <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-white' : ''}`} />
                      </button>
                    </div>

                    {/* Signature / Combo Bottom-Left Badge */}
                    {item.isSignature && (
                      <div className="absolute bottom-2 left-2 px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-sm flex items-center gap-1">
                        <Crown className="w-3 h-3 text-slate-950" />
                        <span>Signature</span>
                      </div>
                    )}

                    {item.isCombo && (
                      <div className="absolute bottom-2 left-2 px-2.5 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-black uppercase tracking-wider shadow-sm flex items-center gap-1">
                        <Tag className="w-3 h-3 text-white" />
                        <span>Combo</span>
                      </div>
                    )}

                    {/* Sold out overlay if unavailable */}
                    {!item.isAvailable && (
                      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center">
                        <span className="px-3.5 py-1 rounded-full bg-red-600 text-white font-black text-xs uppercase tracking-wider shadow-lg">
                          {t.soldOut}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* DISH DETAILS SECTION (Current Trend Clean Layout) */}
                  <div className="pt-3 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Dish Title */}
                      <h3 className="font-display font-black text-base sm:text-lg text-slate-900 dark:text-white group-hover:text-amber-500 transition-colors line-clamp-1 leading-snug">
                        {localizedName}
                      </h3>

                      {/* Star Rating & Reviews (Image Style: e.g. 4.8 (120)) */}
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                        <span className="text-xs font-black text-slate-800 dark:text-slate-200">
                          {itemRating}
                        </span>
                        <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                          ({reviewCount})
                        </span>
                      </div>

                      {/* Subtle Short Description */}
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mt-1 font-normal">
                        {localizedDesc}
                      </p>
                    </div>

                    {/* BOTTOM ROW: BOLD PRICE ON LEFT, YELLOW CIRCULAR '+' BUTTON ON RIGHT (Current Trend) */}
                    <div className="flex items-center justify-between pt-3 mt-2 border-t border-slate-100 dark:border-slate-800/80">
                      
                      {/* Price Tag */}
                      <div className="flex flex-col">
                        <span className="font-display font-black text-lg sm:text-xl text-slate-950 dark:text-amber-400 leading-none">
                          ₹{item.price}
                        </span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium mt-0.5">
                          {item.calories} kcal
                        </span>
                      </div>

                      {/* Trending Yellow Circular '+' Button (or Quantity Modifier Pill when in Cart) */}
                      {item.isAvailable ? (
                        inCartCount > 0 ? (
                          <div 
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-amber-400 text-slate-950 font-black text-xs shadow-md shadow-amber-400/25"
                          >
                            <button
                              type="button"
                              onClick={(e) => handleQuickQuantity(item, -1, e)}
                              className="w-6 h-6 rounded-full bg-white/70 hover:bg-white text-slate-950 flex items-center justify-center font-black active:scale-90 transition-transform cursor-pointer"
                              title="Decrease Quantity"
                              aria-label="Decrease Quantity"
                            >
                              <Minus className="w-3 h-3 stroke-[3]" />
                            </button>
                            <span className="text-xs font-black min-w-3 text-center">{inCartCount}</span>
                            <button
                              type="button"
                              onClick={(e) => handleQuickQuantity(item, 1, e)}
                              className="w-6 h-6 rounded-full bg-slate-950 hover:bg-slate-800 text-white flex items-center justify-center font-black active:scale-90 transition-transform cursor-pointer"
                              title="Increase Quantity"
                              aria-label="Increase Quantity"
                            >
                              <Plus className="w-3 h-3 stroke-[3]" />
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={(e) => handleQuickAdd(item, e)}
                            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 flex items-center justify-center font-black shadow-md shadow-amber-400/25 hover:scale-108 active:scale-95 transition-all cursor-pointer group/btn"
                            title="Add to Cart"
                            aria-label={`Add ${item.name} to cart`}
                          >
                            <Plus className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5] group-hover/btn:rotate-90 transition-transform duration-300" />
                          </button>
                        )
                      ) : (
                        <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500">
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

      {/* 7. FLOATING QUICK ACTION DOCK (Bottom-Right Floating Pill - Takes ZERO space from main menu layout!) */}
      <aside aria-label="Quick Actions Dock" className="fixed bottom-6 right-6 z-30 flex items-center gap-2 p-1.5 rounded-full bg-slate-900/90 dark:bg-slate-800/90 backdrop-blur-md border border-slate-700/80 shadow-2xl animate-fade-in select-none">
        
        {/* Track Order Floating Button */}
        {onOpenOrderTracker && (
          <button
            type="button"
            onClick={onOpenOrderTracker}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold transition-all active:scale-95 cursor-pointer ${
              activeTableOrder 
                ? 'bg-emerald-500 text-white animate-pulse shadow-md shadow-emerald-500/30' 
                : 'text-slate-200 hover:bg-slate-800'
            }`}
            title={activeTableOrder ? `Track Order #${activeTableOrder.orderNumber}` : 'Track Kitchen Order'}
          >
            <Activity className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Track</span>
            {activeTableOrder && (
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
            )}
          </button>
        )}

        {/* Games & News Floating Button */}
        {onOpenEntertainment && (
          <button
            type="button"
            onClick={onOpenEntertainment}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold text-amber-300 hover:bg-slate-800 transition-all active:scale-95 cursor-pointer"
            title="Play Games & Read E-Papers"
          >
            <Gamepad2 className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Games</span>
          </button>
        )}

        {/* Call Waiter Floating Button */}
        <button
          type="button"
          onClick={() => setIsCallWaiterOpen(true)}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold transition-all active:scale-95 cursor-pointer ${
            pendingAlertsForThisTable > 0
              ? 'bg-rose-500 text-white animate-bounce shadow-md shadow-rose-500/30'
              : 'text-rose-300 hover:bg-slate-800'
          }`}
          title={`Call waiter (${assignedWaiter.fullName}) to Table ${tableNumber}`}
        >
          <Bell className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Waiter</span>
        </button>

      </aside>

      {/* Call Waiter Modal */}
      <CallWaiterModal 
        isOpen={isCallWaiterOpen} 
        onClose={() => setIsCallWaiterOpen(false)} 
      />

    </div>
  );
};

export default MenuScreen;

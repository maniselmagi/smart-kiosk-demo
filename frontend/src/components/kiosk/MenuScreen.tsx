import React, { useState, useMemo } from 'react';
import { useKiosk } from '../../context/KioskContext';
import { MenuItem, Category, ComboRecommendation } from '../../types';
import { INITIAL_COMBOS } from '../../data/initialData';
import { 
  getLocalizedItemName, 
  getLocalizedItemDescription, 
  getLocalizedComboTitle 
} from '../../utils/translations';
import { 
  Clock, 
  Flame, 
  Plus, 
  Search, 
  Sparkles, 
  AlertCircle, 
  TrendingUp, 
  Leaf, 
  Drumstick 
} from 'lucide-react';

interface MenuScreenProps {
  onSelectItem: (item: MenuItem) => void;
  onOpenCart: () => void;
  onOpenOrderTracker?: () => void;
}

export const MenuScreen: React.FC<MenuScreenProps> = ({ 
  onSelectItem, 
  onOpenCart,
  onOpenOrderTracker 
}) => {
  const { 
    menuItems, 
    cart, 
    addToCart, 
    language, 
    t, 
    currentTrackedOrder,
    mealTime,
    setMealTime,
    isAutoMealTime,
    setIsAutoMealTime
  } = useKiosk();

  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [dietFilter, setDietFilter] = useState<'all' | 'veg' | 'non-veg'>('all');

  const categories: Category[] = [
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
      default: return cat;
    }
  };

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      // 1. Time-based meal filtering: morning foods in morning, lunch foods in lunch, dinner foods in dinner
      if (item.mealTimes && item.mealTimes.length > 0) {
        if (!item.mealTimes.includes(mealTime)) {
          return false;
        }
      }

      // 2. Category filter
      if (selectedCategory !== 'All' && item.category !== selectedCategory) {
        return false;
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
  }, [menuItems, mealTime, selectedCategory, dietFilter, searchQuery]);

  // Filter combos to those matching the active meal time
  const relevantCombos = useMemo(() => {
    return INITIAL_COMBOS.filter((combo) => {
      const matched = menuItems.filter((m) => combo.itemIds.includes(m.id));
      return matched.some((m) => m.mealTimes && m.mealTimes.includes(mealTime));
    });
  }, [menuItems, mealTime]);

  // Handle adding combo deal to cart
  const handleAddCombo = (combo: ComboRecommendation) => {
    const itemsToAdd = menuItems.filter((m) => combo.itemIds.includes(m.id));
    itemsToAdd.forEach((item) => {
      addToCart(item, 'Medium', ['Combo Special'], 'Served together', 1);
    });
  };

  return (
    <div className="pb-28">
      
      {/* Active Order Notice Banner (if kitchen is cooking an active order) */}
      {currentTrackedOrder && currentTrackedOrder.status !== 'COMPLETED' && (
        <div className="max-w-7xl mx-auto px-4 md:px-8 pt-4">
          <div 
            onClick={onOpenOrderTracker}
            className="cursor-pointer bg-gradient-to-r from-brand-600 to-amber-600 rounded-2xl p-3 md:p-4 text-white shadow-lg flex items-center justify-between gap-4 hover:shadow-xl transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center font-bold text-sm">
                #{currentTrackedOrder.orderNumber}
              </div>
              <div>
                <div className="font-extrabold text-sm md:text-base flex items-center gap-2">
                  <span>{t.orderProgress}:</span>
                  <span className="px-2 py-0.5 rounded-full bg-white text-brand-700 text-xs font-black uppercase tracking-wider">
                    {currentTrackedOrder.status === 'NEW' && t.statusReceived}
                    {currentTrackedOrder.status === 'PREPARING' && t.statusPreparing}
                    {currentTrackedOrder.status === 'READY' && t.statusReady}
                  </span>
                </div>
                <p className="text-xs text-white/90">
                  Estimated kitchen prep: ~{currentTrackedOrder.estimatedPrepTime} {t.min} • Tap to view live progress
                </p>
              </div>
            </div>
            <button className="px-4 py-2 rounded-xl bg-white text-brand-700 font-extrabold text-xs shadow-sm hover:bg-brand-50 transition-colors shrink-0">
              Track Order →
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-6">
        
        {/* Interactive Meal Time Bar: Morning (Breakfast) | Lunch | Dinner */}
        <div className="mb-6 p-4 md:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-sm shrink-0 ${
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
                  {isAutoMealTime ? t.autoTimeBadge : 'Demo Selected'}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {mealTime === 'morning' && `${t.morningHours} • Showing only morning dishes (Dosas, Idli-Vada, Poori, Coffee & Chai)`}
                {mealTime === 'lunch' && `${t.lunchHours} • Showing only lunch dishes (Grand Meals Thali, Biryani, Naan & Lassi)`}
                {mealTime === 'dinner' && `${t.dinnerHours} • Showing only dinner dishes (Butter Chicken, Tandoori Tikka, Biryani & Desserts)`}
              </p>
            </div>
          </div>

          {/* Time Slot Switcher Buttons (allows testing morning, lunch, and dinner anytime) */}
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-2xl border border-slate-200/60 dark:border-slate-700 w-full lg:w-auto overflow-x-auto">
            <button
              onClick={() => setMealTime('morning')}
              className={`flex-1 lg:flex-initial px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer ${
                mealTime === 'morning'
                  ? 'bg-amber-500 text-white shadow-md shadow-amber-500/25 scale-[1.02]'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-700'
              }`}
            >
              <span>🌅</span>
              <span>{t.morningBreakfast}</span>
            </button>

            <button
              onClick={() => setMealTime('lunch')}
              className={`flex-1 lg:flex-initial px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer ${
                mealTime === 'lunch'
                  ? 'bg-orange-500 text-white shadow-md shadow-orange-500/25 scale-[1.02]'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-700'
              }`}
            >
              <span>☀️</span>
              <span>{t.lunchAfternoon}</span>
            </button>

            <button
              onClick={() => setMealTime('dinner')}
              className={`flex-1 lg:flex-initial px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer ${
                mealTime === 'dinner'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25 scale-[1.02]'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-700'
              }`}
            >
              <span>🌙</span>
              <span>{t.dinnerEvening}</span>
            </button>
          </div>
        </div>

        {/* Recommended AI Combo Pairing Card (Filtered to active meal time) */}
        {relevantCombos.length > 0 && (
          <div className="mb-6 bg-gradient-to-r from-amber-500/10 via-brand-500/10 to-orange-500/10 dark:from-slate-900 dark:via-slate-850 dark:to-slate-900 border border-brand-200/80 dark:border-brand-900/40 rounded-3xl p-4 md:p-5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-3.5 w-full md:w-auto">
              <div className="w-12 h-12 rounded-2xl bg-brand-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-brand-500/30">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase tracking-wider text-brand-700 dark:text-brand-300 bg-brand-100/80 dark:bg-brand-950/80 px-2 py-0.5 rounded-md border border-brand-200/60 dark:border-brand-800/60">
                    {t.recommendedForYou}
                  </span>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200/60 dark:border-emerald-800/60">
                    {t.saveDiscount} ₹{relevantCombos[0].savings}
                  </span>
                </div>
                <h4 className="text-base md:text-lg font-black text-slate-900 dark:text-white mt-1">
                  {getLocalizedComboTitle(relevantCombos[0], language)}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Curated chef pairing for {mealTime === 'morning' ? 'breakfast' : mealTime === 'lunch' ? 'lunch' : 'dinner'} dining
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto justify-end">
              <div className="text-right">
                <span className="text-xs text-slate-400 dark:text-slate-500 line-through mr-1.5">
                  ₹{relevantCombos[0].originalPrice}
                </span>
                <span className="text-xl font-black text-brand-600 dark:text-brand-400 font-display">
                  ₹{relevantCombos[0].comboPrice}
                </span>
              </div>
              <button
                onClick={() => handleAddCombo(relevantCombos[0])}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-700 hover:to-brand-600 text-white font-extrabold text-xs shadow-md shadow-brand-500/25 active:scale-95 transition-all flex items-center gap-1.5 shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>{t.addCombo}</span>
              </button>
            </div>
          </div>
        )}

        {/* Search & Dietary Filters Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 mb-6">
          
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder={t.searchMenu}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-sm font-medium text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 shadow-sm transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                Clear
              </button>
            )}
          </div>

          {/* Veg / Non-Veg Quick Toggles */}
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-850 p-1 rounded-2xl border border-slate-200/60 dark:border-slate-800 self-start md:self-auto">
            <button
              onClick={() => setDietFilter('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                dietFilter === 'all'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setDietFilter('veg')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
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
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
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

        {/* Horizontal Category Pill Tabs (Tablet scrollable) */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-6 -mx-4 px-4 md:mx-0 md:px-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 rounded-2xl font-bold text-sm whitespace-nowrap transition-all duration-200 border active:scale-95 ${
                selectedCategory === cat
                  ? 'bg-slate-900 dark:bg-brand-600 text-white border-slate-900 dark:border-brand-600 shadow-md'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white shadow-sm'
              }`}
            >
              {getCategoryLabel(cat)}
            </button>
          ))}
        </div>

        {/* Food Items Grid - Optimized for Tablets & Desktops */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 p-8">
            <AlertCircle className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <h4 className="text-lg font-bold text-slate-700 dark:text-slate-200 mb-1">
              No dishes found
            </h4>
            <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">
              Try adjusting your search query or dietary filter.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setDietFilter('all');
              }}
              className="px-4 py-2 rounded-xl bg-brand-500 text-white text-xs font-bold hover:bg-brand-600 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {filteredItems.map((item) => {
              const inCartCount = cart
                .filter((c) => c.menuItemId === item.id)
                .reduce((acc, c) => acc + c.quantity, 0);

              const localizedName = getLocalizedItemName(item, language);
              const localizedDesc = getLocalizedItemDescription(item, language);

              return (
                <div
                  key={item.id}
                  onClick={() => item.isAvailable && onSelectItem(item)}
                  className={`group relative bg-white dark:bg-slate-900 rounded-3xl border transition-all duration-300 overflow-hidden flex flex-col justify-between cursor-pointer ${
                    !item.isAvailable
                      ? 'opacity-65 border-slate-200 dark:border-slate-800 grayscale-[0.4]'
                      : 'border-slate-200/80 dark:border-slate-800 hover:border-brand-400/80 dark:hover:border-brand-500/80 hover:shadow-kiosk hover:-translate-y-0.5'
                  }`}
                >
                  
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

                    {/* Top Badges: Veg/Non-Veg & Spice */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className={`w-5 h-5 rounded-md flex items-center justify-center p-0.5 border shadow-sm ${
                        item.isVeg 
                          ? 'bg-white border-emerald-600 text-emerald-600' 
                          : 'bg-white border-rose-600 text-rose-600'
                      }`}>
                        <span className={`w-2 h-2 rounded-full ${item.isVeg ? 'bg-emerald-600' : 'bg-rose-600'}`} />
                      </span>

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
                      <TrendingUp className="w-3.5 h-3.5 text-brand-400" />
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
                        <h3 className="font-extrabold text-base md:text-lg text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                          {localizedName}
                        </h3>
                        <span className="font-extrabold text-lg md:text-xl text-brand-600 dark:text-brand-400 font-display shrink-0">
                          ₹{item.price}
                        </span>
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
                          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-extrabold transition-all active:scale-95 ${
                            inCartCount > 0
                              ? 'bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800 hover:bg-brand-100'
                              : 'bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-500/20'
                          }`}
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>{inCartCount > 0 ? `${inCartCount} in cart` : t.add}</span>
                        </button>
                      ) : (
                        <span className="text-xs font-bold text-red-500 px-3 py-1 rounded-lg bg-red-50 dark:bg-red-950/50">
                          {t.soldOut}
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

      {/* Floating Bottom Cart Bar for Tablet Quick Access */}
      {cart.length > 0 && (
        <div className="fixed bottom-4 left-4 right-4 max-w-lg mx-auto z-30 animate-in slide-in-from-bottom-4 duration-300">
          <div 
            onClick={onOpenCart}
            className="cursor-pointer bg-slate-950 dark:bg-slate-900 text-white rounded-3xl p-3.5 px-5 shadow-2xl border border-slate-800 flex items-center justify-between hover:bg-slate-900 dark:hover:bg-slate-800 transition-all active:scale-98"
          >
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-brand-500 text-white font-extrabold flex items-center justify-center text-xs shadow-md">
                {cart.reduce((a, b) => a + b.quantity, 0)}
              </span>
              <div>
                <span className="text-xs text-slate-400 uppercase font-semibold">{t.cart}</span>
                <p className="text-sm font-extrabold text-white">
                  {cart.length} {cart.length === 1 ? 'Dish' : 'Dishes'} Selected
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-base font-extrabold text-white font-display">
                ₹{cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)}
              </span>
              <button className="px-4 py-2 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-md transition-colors">
                {t.proceedToCheckout} →
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default MenuScreen;

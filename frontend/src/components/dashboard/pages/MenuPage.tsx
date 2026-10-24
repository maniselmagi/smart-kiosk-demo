import React, { useState, useMemo } from 'react';
import { useKiosk } from '../../../context/KioskContext';
import { MenuItem, Category } from '../../../types';
import { 
  UtensilsCrossed, 
  Search, 
  Plus, 
  Check, 
  X, 
  Flame, 
  Star, 
  TrendingUp, 
  DollarSign, 
  Filter, 
  Clock,
  Sparkles,
  Edit2
} from 'lucide-react';

export const MenuPage: React.FC = () => {
  const { menuItems, toggleItemAvailability, showToast } = useKiosk();

  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDishForEdit, setSelectedDishForEdit] = useState<MenuItem | null>(null);

  const categories: (Category | 'All')[] = [
    'All',
    'Starters',
    'Main Course',
    'Breads & Rice',
    'Beverages',
    'Desserts',
    'Signature',
  ];

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchCat = selectedCategory === 'All' || item.category === selectedCategory || (selectedCategory === 'Signature' && item.isSignature);
      const q = searchQuery.trim().toLowerCase();
      const matchSearch = !q || item.name.toLowerCase().includes(q) || item.description.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [menuItems, selectedCategory, searchQuery]);

  const availableCount = menuItems.filter(i => i.isAvailable).length;
  const soldOutCount = menuItems.filter(i => !i.isAvailable).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Header Summary */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white font-display">
              Menu Engineering &amp; Catalog Management
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200 text-xs font-bold">
              {menuItems.length} Dishes
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Configure pricing, food photography, availability toggles, and kiosk live ordering status
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => showToast('New menu item creator opened')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Dish</span>
          </button>
        </div>
      </div>

      {/* Quick KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 text-xs font-bold">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-slate-400 block mb-1">Total Active Items</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-display">
            {menuItems.length}
          </div>
          <span className="text-[10px] text-emerald-600 mt-1 block">100% with high-res photos</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-slate-400 block mb-1">Available to Diners</span>
          <div className="text-2xl font-black text-emerald-600 font-display">
            {availableCount}
          </div>
          <span className="text-[10px] text-emerald-600 mt-1 block">Live on table kiosks</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-slate-400 block mb-1">Marked Sold Out</span>
          <div className="text-2xl font-black text-amber-500 font-display">
            {soldOutCount}
          </div>
          <span className="text-[10px] text-amber-600 mt-1 block">Hidden or locked on kiosks</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-slate-400 block mb-1">Average Profit Margin</span>
          <div className="text-2xl font-black text-blue-600 font-display">
            48.2%
          </div>
          <span className="text-[10px] text-blue-600 mt-1 block">COGS vs selling price</span>
        </div>
      </div>

      {/* Filter and Category Pills */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-xs font-extrabold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search menu items..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Visual Menu Item Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filteredItems.map((dish) => (
          <div
            key={dish.id}
            className={`bg-white dark:bg-slate-900 rounded-2xl border overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group ${
              dish.isAvailable 
                ? 'border-slate-200/80 dark:border-slate-800' 
                : 'border-amber-300 dark:border-amber-800/80 opacity-75'
            }`}
          >
            <div>
              {/* Food Image with Veg Badge & Margin */}
              <div className="relative h-44 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                <img
                  src={dish.image}
                  alt={dish.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Top Badges */}
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                  <span className={`w-5 h-5 rounded-md flex items-center justify-center border shadow-xs ${
                    dish.isVeg 
                      ? 'bg-white border-emerald-600 text-emerald-600' 
                      : 'bg-white border-rose-600 text-rose-600'
                  }`}>
                    <span className={`w-2 h-2 rounded-full ${dish.isVeg ? 'bg-emerald-600' : 'bg-rose-600'}`} />
                  </span>

                  {dish.isSignature && (
                    <span className="px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 font-black text-[9px] uppercase tracking-wider flex items-center gap-0.5 shadow-xs">
                      <Star className="w-2.5 h-2.5 fill-current" /> Signature
                    </span>
                  )}
                </div>

                {/* Margin Badge */}
                <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-white text-[10px] font-mono font-bold">
                  {dish.marginPercent}% Margin
                </div>

                {/* Availability status overlay if sold out */}
                {!dish.isAvailable && (
                  <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center">
                    <span className="px-3 py-1 rounded-full bg-red-600 text-white font-black text-xs uppercase tracking-wider shadow-lg">
                      Sold Out
                    </span>
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white leading-tight">
                    {dish.name}
                  </h3>
                  <span className="font-black text-base text-blue-600 dark:text-blue-400 font-display shrink-0">
                    ₹{dish.price}
                  </span>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-3">
                  {dish.description}
                </p>

                {/* Metadata Pills */}
                <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" /> {dish.prepTimeMinutes} mins
                  </span>
                  <span>•</span>
                  <span>Cost: ₹{dish.costPrice}</span>
                  <span>•</span>
                  <span className="text-amber-500 font-semibold">{dish.rating} ★</span>
                </div>
              </div>
            </div>

            {/* Bottom Controls: Toggle Availability & Edit */}
            <div className="p-3 bg-slate-50/70 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
              <button
                onClick={() => setSelectedDishForEdit(dish)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                title="Edit Price & Details"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>

              {/* Instant Available Toggle Button */}
              <button
                onClick={() => {
                  toggleItemAvailability(dish.id);
                  showToast(`${dish.name} is now ${dish.isAvailable ? 'Sold Out' : 'Available'}`);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  dish.isAvailable
                    ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300'
                    : 'bg-red-100 hover:bg-red-200 text-red-800 dark:bg-red-950/70 dark:text-red-300'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${dish.isAvailable ? 'bg-emerald-500' : 'bg-red-500'}`} />
                <span>{dish.isAvailable ? 'Available' : 'Sold Out'}</span>
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* Edit Dish Price Modal */}
      {selectedDishForEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 text-slate-800 dark:text-slate-100">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
              <h3 className="font-extrabold text-base font-display">Edit Menu Item</h3>
              <button onClick={() => setSelectedDishForEdit(null)} className="p-1 rounded-lg text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-500 block mb-1">Dish Name</label>
                <input
                  type="text"
                  defaultValue={selectedDishForEdit.name}
                  className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-500 block mb-1">Selling Price (₹)</label>
                  <input
                    type="number"
                    defaultValue={selectedDishForEdit.price}
                    className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-blue-600"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-500 block mb-1">Cost Price (₹)</label>
                  <input
                    type="number"
                    defaultValue={selectedDishForEdit.costPrice}
                    className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-500 block mb-1">Estimated Prep Time (Mins)</label>
                <input
                  type="number"
                  defaultValue={selectedDishForEdit.prepTimeMinutes}
                  className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setSelectedDishForEdit(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  showToast(`Changes saved for ${selectedDishForEdit.name}`);
                  setSelectedDishForEdit(null);
                }}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-sm"
              >
                Save Updates
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default MenuPage;

import React, { useState } from 'react';
import { useKiosk } from '../../context/KioskContext';
import { MenuItem, SpiceLevel } from '../../types';
import { getLocalizedItemName, getLocalizedItemDescription } from '../../utils/translations';
import { 
  getSpicePrice, 
  getSpicePriceLabel, 
  getCustomizationPrice, 
  getCustomizationCleanLabel, 
  calculateItemUnitPrice 
} from '../../utils/pricingUtils';
import { 
  X, 
  Clock, 
  Flame, 
  Plus, 
  Minus, 
  Check,
  Sparkles
} from 'lucide-react';

interface FoodDetailModalProps {
  item: MenuItem | null;
  onClose: () => void;
}

export const FoodDetailModal: React.FC<FoodDetailModalProps> = ({ item, onClose }) => {
  const { addToCart, language, t } = useKiosk();

  const [spiceLevel, setSpiceLevel] = useState<SpiceLevel>('Medium');
  const [selectedCustomizations, setSelectedCustomizations] = useState<string[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [quantity, setQuantity] = useState(1);

  if (!item) return null;

  const spiceOptions: SpiceLevel[] = ['Mild', 'Medium', 'Hot', 'Extra Hot'];

  const getSpiceLabel = (s: SpiceLevel) => {
    switch (s) {
      case 'Mild': return t.mild;
      case 'Medium': return t.medium;
      case 'Hot': return t.hot;
      case 'Extra Hot': return t.extraHot;
    }
  };

  const getSpiceFlameCount = (s: SpiceLevel) => {
    switch (s) {
      case 'Mild': return 1;
      case 'Medium': return 2;
      case 'Hot': return 3;
      case 'Extra Hot': return 4;
    }
  };

  const toggleCustomization = (option: string) => {
    setSelectedCustomizations((prev) => 
      prev.includes(option) ? prev.filter((o) => o !== option) : [...prev, option]
    );
  };

  // Dynamic cost calculation based on selected spice level and customization add-ons
  const { basePrice, spiceCost, customizationCost, extraCost, unitPrice } = calculateItemUnitPrice(
    item.price,
    spiceLevel,
    selectedCustomizations
  );

  const totalPrice = unitPrice * quantity;
  const localizedName = getLocalizedItemName(item, language);
  const localizedDesc = getLocalizedItemDescription(item, language);

  const handleAddToCart = () => {
    addToCart(item, spiceLevel, selectedCustomizations, specialInstructions, quantity, unitPrice);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header Image Container */}
        <div className="relative aspect-[16/9] w-full bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/30" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors shadow-lg active:scale-95 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Dish Title & Price over Image with dynamic live breakdown */}
          <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between text-white">
            <div className="pr-4 min-w-0">
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className={`w-5 h-5 rounded-md flex items-center justify-center p-0.5 border bg-white ${
                  item.isVeg ? 'border-emerald-600 text-emerald-600' : 'border-rose-600 text-rose-600'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${item.isVeg ? 'bg-emerald-600' : 'bg-rose-600'}`} />
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-black/50 backdrop-blur-xs">
                  {item.category}
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-500/80 backdrop-blur-xs flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {item.prepTimeMinutes} {t.min}
                </span>
                {item.isSignature && (
                  <span className="text-xs font-black px-2 py-0.5 rounded bg-cyan-400 text-slate-950 flex items-center gap-1 shadow-xs">
                    <Sparkles className="w-3 h-3" /> Signature
                  </span>
                )}
              </div>
              <h2 className="text-2xl md:text-3xl font-black font-display tracking-tight text-white drop-shadow truncate">
                {localizedName}
              </h2>
            </div>
            
            {/* Dynamic Price Display inside Card (Multiplied by Quantity) */}
            <div className="text-right shrink-0">
              <div className="flex items-baseline gap-2 justify-end">
                <span className="text-2xl md:text-3xl font-black text-amber-300 font-display">
                  ₹{totalPrice}
                </span>
                {extraCost > 0 && (
                  <span className="text-xs md:text-sm font-semibold text-white/60 line-through">
                    ₹{basePrice * quantity}
                  </span>
                )}
              </div>
              <div className="mt-0.5 flex flex-col items-end gap-1">
                {quantity > 1 && (
                  <span className="text-[11px] font-black text-amber-200 bg-black/60 px-2 py-0.5 rounded-full border border-amber-300/30">
                    ₹{unitPrice} × {quantity}
                  </span>
                )}
                {extraCost > 0 ? (
                  <div className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-300 bg-black/60 px-2 py-0.5 rounded-full border border-amber-400/30">
                    <span>+₹{extraCost * quantity} add-ons</span>
                  </div>
                ) : quantity === 1 ? (
                  <span className="text-[11px] text-white/70 block">
                    Standard Price
                  </span>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Customization Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Description & Calories */}
          <div>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {localizedDesc}
            </p>
            <div className="flex items-center gap-4 mt-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
              <span>{item.calories} kcal per serving</span>
              <span>•</span>
              <span>Allergens: {item.allergens.join(', ')}</span>
            </div>
          </div>

          {/* Spice Level Selector with Dynamic Pricing */}
          <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700">
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                <span>{t.spiceLevel}</span>
              </label>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-brand-600 dark:text-brand-400">
                  {getSpiceLabel(spiceLevel)}
                </span>
                {spiceCost > 0 && (
                  <span className="text-[11px] font-black px-2 py-0.5 rounded-full bg-brand-100 dark:bg-brand-950/80 text-brand-700 dark:text-brand-300 border border-brand-300/60 dark:border-brand-800">
                    +₹{spiceCost}
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {spiceOptions.map((level) => {
                const flames = getSpiceFlameCount(level);
                const isSelected = spiceLevel === level;
                const price = getSpicePrice(level);
                const badge = getSpicePriceLabel(level);

                return (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setSpiceLevel(level)}
                    className={`py-3 px-2 rounded-xl text-center transition-all duration-200 border flex flex-col items-center justify-center gap-1 active:scale-95 cursor-pointer ${
                      isSelected
                        ? 'bg-brand-600 text-white border-brand-600 shadow-md shadow-brand-500/20 font-bold'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300 font-medium'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-0.5">
                      {Array.from({ length: flames }).map((_, idx) => (
                        <Flame 
                          key={idx} 
                          className={`w-3 h-3 ${isSelected ? 'text-amber-200 fill-amber-200' : 'text-slate-400 dark:text-slate-500'}`} 
                        />
                      ))}
                    </div>
                    <span className="text-xs">{getSpiceLabel(level)}</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                      isSelected 
                        ? 'bg-white/20 text-white' 
                        : price > 0 
                        ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300' 
                        : 'text-slate-400 dark:text-slate-500'
                    }`}>
                      {badge}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Customization Options with Dynamic Pricing */}
          {item.customizationOptions.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  {t.customization}
                </label>
                {customizationCost > 0 && (
                  <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                    +₹{customizationCost} add-ons
                  </span>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {item.customizationOptions.map((opt) => {
                  const isChecked = selectedCustomizations.includes(opt);
                  const price = getCustomizationPrice(opt);
                  const cleanLabel = getCustomizationCleanLabel(opt);

                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => toggleCustomization(opt)}
                      className={`flex items-center justify-between p-3 rounded-xl border text-left text-xs font-semibold transition-all cursor-pointer ${
                        isChecked
                          ? 'bg-brand-50/90 dark:bg-brand-950/80 border-brand-500 text-brand-950 dark:text-brand-200 shadow-xs ring-1 ring-brand-500/25'
                          : 'bg-white dark:bg-slate-800 border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-750'
                      }`}
                    >
                      <div className="flex-1 pr-2 min-w-0">
                        <span className="block truncate font-bold text-slate-800 dark:text-slate-100">
                          {cleanLabel}
                        </span>
                        <span className={`text-[11px] font-extrabold inline-block mt-0.5 ${
                          price > 0 
                            ? isChecked 
                              ? 'text-brand-600 dark:text-brand-400' 
                              : 'text-amber-700 dark:text-amber-400' 
                            : 'text-slate-400 dark:text-slate-500 font-medium'
                        }`}>
                          {price > 0 ? `+₹${price}` : 'Free'}
                        </span>
                      </div>
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors shrink-0 ${
                        isChecked 
                          ? 'bg-brand-600 border-brand-600 text-white' 
                          : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900'
                      }`}>
                        {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Special Instructions Note */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              {t.specialInstructions}
            </label>
            <input
              type="text"
              placeholder={t.specialInstructionsPlaceholder}
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
            />
          </div>

        </div>

        {/* Modal Bottom Sticky Action Bar */}
        <div className="p-4 md:p-6 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 shrink-0">
          
          {/* Quantity Stepper & Unit Price Indicator */}
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700 p-1 shadow-sm">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1}
                className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-transparent transition-colors active:scale-95 cursor-pointer"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-10 text-center font-black text-base text-slate-800 dark:text-slate-100">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors active:scale-95 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="hidden sm:block text-left">
              <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                {quantity > 1 ? `Unit (×${quantity})` : 'Unit Price'}
              </div>
              <div className="text-sm font-black text-slate-800 dark:text-slate-100 font-display">
                ₹{unitPrice}
              </div>
            </div>
          </div>

          {/* Add to Cart Button with Live Calculated Total */}
          <button
            onClick={handleAddToCart}
            className="flex-1 py-4 px-6 rounded-2xl bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-700 hover:to-brand-600 text-white font-extrabold text-sm md:text-base shadow-xl shadow-brand-500/25 active:scale-98 transition-all flex items-center justify-between cursor-pointer"
          >
            <span>{t.addToCart}</span>
            <div className="flex items-baseline gap-1.5 font-display">
              <span className="text-xs font-normal opacity-80">Total:</span>
              <span className="font-black text-lg md:text-xl">
                ₹{totalPrice}
              </span>
            </div>
          </button>

        </div>

      </div>
    </div>
  );
};

export default FoodDetailModal;

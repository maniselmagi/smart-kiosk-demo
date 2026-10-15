import React, { useState } from 'react';
import { useKiosk } from '../../context/KioskContext';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  Flame,
  ArrowUpDown,
  Check,
  GripVertical,
  ChevronUp,
  ChevronDown,
  ListOrdered,
  Sparkles
} from 'lucide-react';
import { getSpicePrice, getCustomizationCleanLabel, getCustomizationPrice } from '../../utils/pricingUtils';

interface CartDrawerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProceedToCheckout: () => void;
}

export const CartDrawerModal: React.FC<CartDrawerModalProps> = ({ 
  isOpen, 
  onClose, 
  onProceedToCheckout 
}) => {
  const { 
    cart, 
    updateCartQuantity, 
    removeFromCart, 
    clearCart, 
    reorderCart,
    cartSubtotal, 
    cartTax, 
    cartGrandTotal, 
    t, 
    tableNumber 
  } = useKiosk();

  const [isArrangeMode, setIsArrangeMode] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  // Move item up or down in priority
  const moveItem = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= cart.length) return;

    const newCart = [...cart];
    const [movedItem] = newCart.splice(index, 1);
    newCart.splice(targetIndex, 0, movedItem);
    reorderCart(newCart);
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', `${index}`);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (draggedIndex !== null && draggedIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== dropIndex) {
      const newCart = [...cart];
      const [draggedItem] = newCart.splice(draggedIndex, 1);
      newCart.splice(dropIndex, 0, draggedItem);
      reorderCart(newCart);
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md h-full bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300 border-l border-slate-100 dark:border-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold shadow-xs">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white font-display">
                {t.yourCart}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Table {tableNumber} • {cart.reduce((a, b) => a + b.quantity, 0)} Items
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="text-xs font-bold text-slate-400 hover:text-rose-600 px-2 py-1 rounded transition-colors cursor-pointer"
                title="Clear all items"
              >
                Clear
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* HIGHLIGHTED SERVING PRIORITY & REARRANGE BANNER */}
        {cart.length > 0 && (
          <div className="mx-5 mt-4 p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-brand-500/15 dark:from-amber-950/40 dark:via-orange-950/40 dark:to-brand-950/40 border border-amber-300/80 dark:border-amber-700/80 shadow-sm shrink-0">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-start gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <ListOrdered className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-black text-xs text-amber-950 dark:text-amber-200 uppercase tracking-wider">
                      Serving Priority
                    </span>
                    <span className="text-[10px] font-black px-1.5 py-0.2 rounded-full bg-amber-500 text-white">
                      1st, 2nd, 3rd...
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5 leading-snug">
                    {isArrangeMode ? (
                      <span className="text-emerald-700 dark:text-emerald-300 font-bold flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> Drag & drop or use arrows to set serving sequence!
                      </span>
                    ) : (
                      'You can rearrange the order to decide which dish comes first, second, third, etc.!'
                    )}
                  </p>
                </div>
              </div>

              {/* Arrange / Prior Button */}
              {cart.length > 1 && (
                <button
                  onClick={() => setIsArrangeMode(!isArrangeMode)}
                  className={`px-3.5 py-2 rounded-xl font-black text-xs transition-all active:scale-95 flex items-center gap-1.5 shrink-0 cursor-pointer shadow-md ${
                    isArrangeMode
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/30 ring-2 ring-emerald-400 animate-pulse'
                      : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-amber-500/30'
                  }`}
                >
                  {isArrangeMode ? (
                    <>
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>Done</span>
                    </>
                  ) : (
                    <>
                      <ArrowUpDown className="w-3.5 h-3.5" />
                      <span>Arrange</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3.5">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4 text-slate-300 dark:text-slate-600">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h4 className="text-base font-bold text-slate-700 dark:text-slate-200 mb-1">
                {t.emptyCart}
              </h4>
              <p className="text-xs text-slate-400 dark:text-slate-500 max-w-xs mb-6">
                {t.emptyCartSubtitle}
              </p>
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-extrabold shadow-md shadow-brand-500/20 transition-colors cursor-pointer"
              >
                {t.exploreMenu}
              </button>
            </div>
          ) : (
            cart.map((item, index) => {
              const isFirst = index === 0;
              const isSecond = index === 1;
              const isThird = index === 2;

              return (
                <div
                  key={item.cartItemId}
                  draggable={isArrangeMode}
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDrop={(e) => handleDrop(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`relative p-3.5 rounded-2xl transition-all duration-200 flex items-center gap-3 border ${
                    dragOverIndex === index
                      ? 'border-2 border-dashed border-amber-500 bg-amber-50/70 dark:bg-amber-950/40 scale-102 shadow-lg'
                      : isArrangeMode
                      ? 'animate-jiggle-shake bg-white dark:bg-slate-850 border-2 border-amber-400/90 dark:border-amber-500/90 shadow-md ring-2 ring-amber-400/20 cursor-grab active:cursor-grabbing'
                      : 'bg-slate-50 dark:bg-slate-800/70 border-slate-200/80 dark:border-slate-700'
                  }`}
                >
                  
                  {/* Circled Sequence Badge (1, 2, 3, 4...) */}
                  <div className="flex flex-col items-center justify-center shrink-0 w-8">
                    <div 
                      className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-xs transition-all shadow-sm ${
                        isFirst 
                          ? 'bg-amber-500 text-white ring-2 ring-amber-400/50' 
                          : isSecond 
                          ? 'bg-blue-600 text-white ring-2 ring-blue-400/40' 
                          : isThird 
                          ? 'bg-teal-600 text-white ring-2 ring-teal-400/40' 
                          : 'bg-slate-700 text-white'
                      }`}
                    >
                      {index + 1}
                    </div>
                    <span className="text-[9px] font-black uppercase text-slate-500 dark:text-slate-400 mt-0.5 tracking-tighter">
                      {isFirst ? '1st' : isSecond ? '2nd' : isThird ? '3rd' : `${index + 1}th`}
                    </span>
                  </div>

                  {/* Item Thumbnail */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-14 h-14 rounded-xl object-cover shrink-0 shadow-2xs"
                  />

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between gap-1 mb-1">
                      <h4 className="font-extrabold text-sm text-slate-900 dark:text-white truncate">
                        {item.name}
                      </h4>
                      <div className="text-right shrink-0">
                        <span className="font-black text-sm text-slate-900 dark:text-brand-400 font-display">
                          ₹{item.price * item.quantity}
                        </span>
                        {item.quantity > 1 && (
                          <span className="block text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                            (₹{item.price} each)
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Spice and Customization meta */}
                    <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 mb-2">
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-100/80 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 font-bold">
                        <Flame className="w-2.5 h-2.5 text-brand-600 dark:text-brand-400" />
                        <span>{item.spiceLevel}</span>
                        {getSpicePrice(item.spiceLevel) > 0 && (
                          <span className="text-[10px] opacity-80">(+₹{getSpicePrice(item.spiceLevel)})</span>
                        )}
                      </span>
                      {item.customizations.map((c) => {
                        const optPrice = getCustomizationPrice(c);
                        const optLabel = getCustomizationCleanLabel(c);
                        return (
                          <span key={c} className="px-1.5 py-0.5 rounded bg-slate-200/70 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium flex items-center gap-1">
                            <span>{optLabel}</span>
                            {optPrice > 0 && (
                              <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold">+₹{optPrice}</span>
                            )}
                          </span>
                        );
                      })}
                      {item.specialInstructions && (
                        <span className="italic text-slate-400 dark:text-slate-400 block w-full text-[10px]">
                          "{item.specialInstructions}"
                        </span>
                      )}
                    </div>

                    {/* Stepper & Delete / Arrange Controls */}
                    <div className="flex items-center justify-between">
                      {!isArrangeMode ? (
                        <>
                          <div className="flex items-center bg-white dark:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-600 p-0.5 shadow-2xs">
                            <button
                              onClick={() => updateCartQuantity(item.cartItemId, -1)}
                              className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors cursor-pointer"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-7 text-center font-bold text-xs text-slate-800 dark:text-white">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateCartQuantity(item.cartItemId, 1)}
                              className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <button
                            onClick={() => removeFromCart(item.cartItemId)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                            title="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <div className="w-full flex items-center justify-between bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 rounded-xl border border-amber-300/60 dark:border-amber-800/60">
                          <span className="text-[11px] font-extrabold text-amber-900 dark:text-amber-200 flex items-center gap-1">
                            <GripVertical className="w-3.5 h-3.5 text-amber-600" />
                            <span>Drag or use buttons</span>
                          </span>

                          {/* Quick Up/Down Buttons for touch or keyboard users */}
                          <div className="flex items-center gap-1">
                            <button
                              disabled={index === 0}
                              onClick={() => moveItem(index, 'up')}
                              className="w-6 h-6 rounded-md bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 flex items-center justify-center disabled:opacity-25 hover:bg-amber-500 hover:text-white transition-colors cursor-pointer"
                              title="Move to earlier serving"
                            >
                              <ChevronUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              disabled={index === cart.length - 1}
                              onClick={() => moveItem(index, 'down')}
                              className="w-6 h-6 rounded-md bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 flex items-center justify-center disabled:opacity-25 hover:bg-amber-500 hover:text-white transition-colors cursor-pointer"
                              title="Move to later serving"
                            >
                              <ChevronDown className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Drawer Footer Billing Summary */}
        {cart.length > 0 && (
          <div className="p-5 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 space-y-3 shrink-0">
            
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                <span>{t.subtotal}</span>
                <span className="font-semibold text-slate-700 dark:text-slate-200">₹{cartSubtotal}</span>
              </div>
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                <span>{t.taxGst}</span>
                <span className="font-semibold text-slate-700 dark:text-slate-200">₹{cartTax}</span>
              </div>
              <div className="flex items-center justify-between text-base font-black text-slate-900 dark:text-white pt-1.5 border-t border-slate-200 dark:border-slate-800">
                <span>{t.total}</span>
                <span className="text-xl text-brand-600 dark:text-brand-400 font-display">₹{cartGrandTotal}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={onClose}
                className="py-3 px-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                {t.continueOrdering}
              </button>
              <button
                onClick={() => {
                  onClose();
                  onProceedToCheckout();
                }}
                className="py-3 px-4 rounded-2xl bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-700 hover:to-brand-600 text-white text-xs font-extrabold shadow-lg shadow-brand-500/25 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>{t.proceedToCheckout}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default CartDrawerModal;

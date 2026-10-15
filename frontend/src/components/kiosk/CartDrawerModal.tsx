import React from 'react';
import { useKiosk } from '../../context/KioskContext';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  Flame 
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
    cartSubtotal, 
    cartTax, 
    cartGrandTotal, 
    t, 
    tableNumber 
  } = useKiosk();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md h-full bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300 border-l border-slate-100 dark:border-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold">
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
                className="text-xs font-bold text-slate-400 hover:text-rose-600 px-2 py-1 rounded transition-colors"
                title="Clear all items"
              >
                Clear
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
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
                className="px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-extrabold shadow-md shadow-brand-500/20 transition-colors"
              >
                {t.exploreMenu}
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.cartItemId}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700 flex items-start gap-3 transition-all"
              >
                {/* Item Thumbnail */}
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 rounded-xl object-cover shrink-0"
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
                  <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 mb-2.5">
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

                  {/* Stepper & Delete */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center bg-white dark:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-600 p-0.5 shadow-2xs">
                      <button
                        onClick={() => updateCartQuantity(item.cartItemId, -1)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-7 text-center font-bold text-xs text-slate-800 dark:text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.cartItemId, 1)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.cartItemId)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer Billing Summary */}
        {cart.length > 0 && (
          <div className="p-5 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 space-y-3">
            
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
                className="py-3 px-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                {t.continueOrdering}
              </button>
              <button
                onClick={() => {
                  onClose();
                  onProceedToCheckout();
                }}
                className="py-3 px-4 rounded-2xl bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-700 hover:to-brand-600 text-white text-xs font-extrabold shadow-lg shadow-brand-500/25 active:scale-95 transition-all flex items-center justify-center gap-1.5"
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

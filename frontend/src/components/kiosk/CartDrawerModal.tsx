import React from 'react';
import { useKiosk } from '../../context/KioskContext';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  Sparkles, 
  Flame, 
  Receipt 
} from 'lucide-react';

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
        className="w-full max-w-md h-full bg-white shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-slate-900 font-display">
                {t.yourCart}
              </h3>
              <p className="text-xs text-slate-500">
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
              className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4 text-slate-300">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h4 className="text-base font-bold text-slate-700 mb-1">
                {t.emptyCart}
              </h4>
              <p className="text-xs text-slate-400 max-w-xs mb-6">
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
                className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3 transition-all"
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
                    <h4 className="font-extrabold text-sm text-slate-900 truncate">
                      {item.name}
                    </h4>
                    <span className="font-black text-sm text-slate-900 shrink-0 font-display">
                      ₹{item.price * item.quantity}
                    </span>
                  </div>

                  {/* Spice and Customization meta */}
                  <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500 mb-2.5">
                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-amber-100/80 text-amber-800 font-bold">
                      <Flame className="w-2.5 h-2.5 text-brand-600" />
                      {item.spiceLevel}
                    </span>
                    {item.customizations.map((c) => (
                      <span key={c} className="px-1.5 py-0.5 rounded bg-slate-200/70 text-slate-700 font-medium">
                        {c}
                      </span>
                    ))}
                    {item.specialInstructions && (
                      <span className="italic text-slate-400 block w-full text-[10px]">
                        "{item.specialInstructions}"
                      </span>
                    )}
                  </div>

                  {/* Stepper & Delete */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center bg-white rounded-xl border border-slate-200 p-0.5 shadow-2xs">
                      <button
                        onClick={() => updateCartQuantity(item.cartItemId, -1)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-7 text-center font-bold text-xs text-slate-800">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.cartItemId, 1)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.cartItemId)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
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
          <div className="p-5 bg-slate-50 border-t border-slate-200 space-y-3">
            
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-slate-500">
                <span>{t.subtotal}</span>
                <span className="font-semibold text-slate-700">₹{cartSubtotal}</span>
              </div>
              <div className="flex items-center justify-between text-slate-500">
                <span>{t.taxGst}</span>
                <span className="font-semibold text-slate-700">₹{cartTax}</span>
              </div>
              <div className="flex items-center justify-between text-base font-black text-slate-900 pt-1.5 border-t border-slate-200">
                <span>{t.total}</span>
                <span className="text-xl text-brand-600 font-display">₹{cartGrandTotal}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={onClose}
                className="py-3 px-3 rounded-2xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
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

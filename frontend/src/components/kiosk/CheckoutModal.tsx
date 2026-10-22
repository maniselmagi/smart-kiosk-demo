import React, { useState } from 'react';
import { useKiosk } from '../../context/KioskContext';
import { Order } from '../../types';
import { 
  X, 
  CreditCard, 
  QrCode, 
  Wallet, 
  ShieldCheck, 
  Loader2, 
  UtensilsCrossed
} from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderSuccess: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ 
  isOpen, 
  onClose, 
  onOrderSuccess 
}) => {
  const { 
    cart, 
    cartSubtotal, 
    cartTax, 
    cartGrandTotal, 
    tableNumber, 
    placeOrder, 
    t 
  } = useKiosk();

  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card' | 'Wallet'>('UPI');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen || cart.length === 0) return null;

  const handlePay = () => {
    setIsProcessing(true);

    setTimeout(() => {
      // Direct payment for table order (split bill removed)
      const order = placeOrder(paymentMethod, 0, undefined);
      setIsProcessing(false);
      onOrderSuccess(order);
    }, 1500); // 1.5s realistic mock transaction
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Checkout Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 text-xs font-black uppercase tracking-wider border border-amber-500/30">
                Table {tableNumber}
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                {cart.reduce((a, b) => a + b.quantity, 0)} Items
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs font-extrabold text-amber-500 dark:text-amber-400">
                Total ₹{cartGrandTotal}
              </span>
            </div>
            <h3 className="font-black text-xl text-slate-900 dark:text-white font-display mt-1">
              Review &amp; Pay
            </h3>
          </div>

          <button
            onClick={onClose}
            disabled={isProcessing}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors disabled:opacity-30 cursor-pointer"
            aria-label="Close Checkout"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 md:p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Order Summary & Itemized Dishes */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <UtensilsCrossed className="w-4 h-4 text-amber-500" />
                <span>Order Summary (Table {tableNumber})</span>
              </label>
              <span className="text-xs font-bold text-slate-400">
                {cart.reduce((a, b) => a + b.quantity, 0)} Dishes
              </span>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden max-h-56 overflow-y-auto bg-slate-50/60 dark:bg-slate-850/60">
              {cart.map((item) => (
                <div key={item.cartItemId} className="p-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <img src={item.image} alt={item.name} className="w-10 h-10 rounded-xl object-cover" />
                    <div>
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {item.quantity}× {item.name}
                      </span>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500">
                        {item.spiceLevel} spice {item.customizations.length > 0 && `• ${item.customizations.join(', ')}`}
                      </p>
                    </div>
                  </div>
                  <span className="font-bold text-slate-900 dark:text-slate-100 font-display">
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            {/* Bill Breakdown Card */}
            <div className="p-3.5 rounded-2xl bg-slate-100/70 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-500 dark:text-slate-400">
                <span>Subtotal</span>
                <span>₹{cartSubtotal}</span>
              </div>
              <div className="flex justify-between text-slate-500 dark:text-slate-400">
                <span>Restaurant GST (5%)</span>
                <span>₹{cartTax}</span>
              </div>
              <div className="flex justify-between items-baseline pt-2 border-t border-slate-200 dark:border-slate-700 text-sm font-black text-slate-900 dark:text-white">
                <span>Table Grand Total</span>
                <span className="text-xl font-black text-amber-500 dark:text-amber-400 font-display">
                  ₹{cartGrandTotal}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2.5">
              {t.paymentMethod}
            </label>

            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('UPI')}
                className={`p-3.5 rounded-2xl border text-center flex flex-col items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer ${
                  paymentMethod === 'UPI'
                    ? 'bg-amber-500/10 dark:bg-amber-500/15 border-amber-500 text-amber-900 dark:text-amber-300 shadow-sm font-bold ring-2 ring-amber-500/20'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-750'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center">
                  <QrCode className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold">UPI QR Code</span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-normal">GPay / PhonePe</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('Card')}
                className={`p-3.5 rounded-2xl border text-center flex flex-col items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer ${
                  paymentMethod === 'Card'
                    ? 'bg-amber-500/10 dark:bg-amber-500/15 border-amber-500 text-amber-900 dark:text-amber-300 shadow-sm font-bold ring-2 ring-amber-500/20'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-750'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <CreditCard className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold">Credit / Debit</span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-normal">Tap / Chip POS</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('Wallet')}
                className={`p-3.5 rounded-2xl border text-center flex flex-col items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer ${
                  paymentMethod === 'Wallet'
                    ? 'bg-amber-500/10 dark:bg-amber-500/15 border-amber-500 text-amber-900 dark:text-amber-300 shadow-sm font-bold ring-2 ring-amber-500/20'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-750'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                  <Wallet className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold">Digital Wallet</span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-normal">Paytm / Amazon</span>
              </button>
            </div>

            {/* Dynamic UPI QR Code Preview */}
            {paymentMethod === 'UPI' && (
              <div className="mt-3.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 flex items-center gap-3.5 animate-in fade-in duration-200">
                <div className="w-20 h-20 bg-white p-1 rounded-xl border border-slate-200 shrink-0 flex items-center justify-center shadow-xs">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(
                      `upi://pay?pa=orderease.demo@bank&pn=OrderEase%20Table${tableNumber}&am=${cartGrandTotal}&cu=INR`
                    )}`}
                    alt="Demo UPI QR"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      Scan with PhonePe, GPay, Paytm or CRED
                    </span>
                    <span className="text-[10px] font-black text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/80 px-2 py-0.5 rounded border border-amber-300 dark:border-amber-800">
                      ₹{cartGrandTotal}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Amount is pre-encoded in QR code. Scan with your camera or UPI app to pay.
                  </p>
                  <span className="inline-block mt-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200/60 dark:border-emerald-800/60">
                    Instant Auto-Verification • Table {tableNumber}
                  </span>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Sticky Payment Total & CTA */}
        <div className="p-5 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
          
          <div className="w-full sm:w-auto">
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span>Subtotal ₹{cartSubtotal}</span>
              <span>+</span>
              <span>5% GST ₹{cartTax}</span>
              <span>=</span>
              <span className="font-bold text-slate-700 dark:text-slate-300">Total ₹{cartGrandTotal}</span>
            </div>
            
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-xs uppercase font-extrabold text-slate-400 dark:text-slate-500">
                TOTAL TO PAY:
              </span>
              <span className="text-2xl font-black text-amber-500 dark:text-amber-400 font-display">
                ₹{cartGrandTotal}
              </span>
            </div>
          </div>

          <button
            onClick={handlePay}
            disabled={isProcessing || cartGrandTotal <= 0}
            className="w-full sm:w-auto min-w-[220px] py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-black text-base shadow-xl shadow-amber-500/25 active:scale-98 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-slate-950" />
                <span>Processing Payment...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-5 h-5 text-slate-950" />
                <span>{t.payNow} (₹{cartGrandTotal})</span>
              </>
            )}
          </button>

        </div>

      </div>
    </div>
  );
};

export default CheckoutModal;

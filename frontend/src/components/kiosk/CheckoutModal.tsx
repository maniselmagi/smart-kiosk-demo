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
  UtensilsCrossed,
  Sparkles,
  ArrowRight,
  Receipt,
  Check
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
      <div 
        className="w-full max-w-2xl bg-slate-900/95 text-slate-100 rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.85)] border border-white/10 overflow-hidden flex flex-col max-h-[94vh] animate-in zoom-in-95 duration-300 relative backdrop-blur-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/4 right-1/4 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent blur-[2px]" />

        {/* CHECKOUT HEADER */}
        <div className="p-5 sm:p-6 bg-gradient-to-b from-slate-850 to-slate-900 border-b border-white/[0.08] flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-400/15 text-amber-400 text-xs font-black uppercase tracking-wider border border-amber-400/30">
                Table {tableNumber}
              </span>
              <span className="text-xs text-slate-500">•</span>
              <span className="text-xs font-semibold text-slate-300">
                {cart.reduce((a, b) => a + b.quantity, 0)} Items
              </span>
              <span className="text-xs text-slate-500">•</span>
              <span className="text-xs font-black text-amber-400 font-display">
                Total ₹{cartGrandTotal}
              </span>
            </div>
            <h3 className="font-black text-xl text-white font-display mt-1 tracking-tight flex items-center gap-2">
              <span>Review Order &amp; Pay</span>
            </h3>
          </div>

          <button
            onClick={onClose}
            disabled={isProcessing}
            className="w-10 h-10 rounded-2xl bg-white/[0.05] hover:bg-white/[0.12] text-slate-400 hover:text-white transition-all flex items-center justify-center cursor-pointer border border-white/5 active:scale-95 disabled:opacity-30"
            aria-label="Close Checkout"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* SCROLLABLE BODY */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
          
          {/* Order Summary & Itemized Dishes */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <UtensilsCrossed className="w-4 h-4 text-amber-400" />
                <span>Selected Artisanal Dishes ({cart.length})</span>
              </label>
              <span className="text-xs font-bold text-slate-400">
                Cooking for Table {tableNumber}
              </span>
            </div>

            <div className="divide-y divide-white/[0.06] border border-white/[0.08] rounded-2xl overflow-hidden max-h-52 overflow-y-auto bg-slate-850/60 custom-scrollbar">
              {cart.map((item) => (
                <div key={item.cartItemId} className="p-3 sm:p-3.5 flex items-center justify-between text-xs hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-center gap-3">
                    <img src={item.image} alt={item.name} className="w-11 h-11 rounded-xl object-cover border border-white/10 shrink-0" />
                    <div>
                      <span className="font-bold text-slate-100 block">
                        {item.quantity}× {item.name}
                      </span>
                      <p className="text-[11px] text-slate-400">
                        {item.spiceLevel} spice {item.customizations.length > 0 && `• ${item.customizations.join(', ')}`}
                      </p>
                    </div>
                  </div>
                  <span className="font-black text-amber-400 font-display text-sm">
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            {/* Bill Breakdown Voucher Card */}
            <div className="p-4 rounded-2xl bg-slate-850/70 border border-white/[0.08] space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Kitchen Subtotal</span>
                <span className="font-semibold text-slate-200">₹{cartSubtotal}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Restaurant GST (5%)</span>
                <span className="font-semibold text-slate-200">₹{cartTax}</span>
              </div>
              <div className="flex justify-between items-baseline pt-2.5 border-t border-white/[0.08] text-sm font-black text-white">
                <span>Table Grand Total</span>
                <span className="text-2xl font-black text-amber-400 font-display">
                  ₹{cartGrandTotal}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-3">
            <label className="block text-xs font-black uppercase tracking-wider text-slate-300">
              Select Payment Method
            </label>

            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('UPI')}
                className={`p-3.5 sm:p-4 rounded-2xl border text-center flex flex-col items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer relative ${
                  paymentMethod === 'UPI'
                    ? 'bg-gradient-to-b from-amber-400/20 via-slate-850 to-slate-900 border-amber-400 text-amber-300 shadow-lg shadow-amber-500/20 ring-2 ring-amber-400/30'
                    : 'bg-slate-850/50 border-white/[0.08] text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {paymentMethod === 'UPI' && (
                  <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </span>
                )}
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-transform ${
                  paymentMethod === 'UPI' ? 'bg-amber-400 text-slate-950 scale-105' : 'bg-slate-800 text-amber-400'
                }`}>
                  <QrCode className="w-5 h-5" />
                </div>
                <span className="text-xs font-black text-slate-200">UPI QR Code</span>
                <span className="text-[10px] text-slate-400 font-normal">GPay / PhonePe</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('Card')}
                className={`p-3.5 sm:p-4 rounded-2xl border text-center flex flex-col items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer relative ${
                  paymentMethod === 'Card'
                    ? 'bg-gradient-to-b from-blue-500/20 via-slate-850 to-slate-900 border-blue-400 text-blue-300 shadow-lg shadow-blue-500/20 ring-2 ring-blue-400/30'
                    : 'bg-slate-850/50 border-white/[0.08] text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {paymentMethod === 'Card' && (
                  <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-blue-400 text-slate-950 flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </span>
                )}
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-transform ${
                  paymentMethod === 'Card' ? 'bg-blue-500 text-white scale-105' : 'bg-slate-800 text-blue-400'
                }`}>
                  <CreditCard className="w-5 h-5" />
                </div>
                <span className="text-xs font-black text-slate-200">Credit / Debit</span>
                <span className="text-[10px] text-slate-400 font-normal">Tap &amp; Pay POS</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('Wallet')}
                className={`p-3.5 sm:p-4 rounded-2xl border text-center flex flex-col items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer relative ${
                  paymentMethod === 'Wallet'
                    ? 'bg-gradient-to-b from-purple-500/20 via-slate-850 to-slate-900 border-purple-400 text-purple-300 shadow-lg shadow-purple-500/20 ring-2 ring-purple-400/30'
                    : 'bg-slate-850/50 border-white/[0.08] text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {paymentMethod === 'Wallet' && (
                  <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-purple-400 text-slate-950 flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </span>
                )}
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-transform ${
                  paymentMethod === 'Wallet' ? 'bg-purple-500 text-white scale-105' : 'bg-slate-800 text-purple-400'
                }`}>
                  <Wallet className="w-5 h-5" />
                </div>
                <span className="text-xs font-black text-slate-200">Digital Wallet</span>
                <span className="text-[10px] text-slate-400 font-normal">Paytm / Amazon</span>
              </button>
            </div>

            {/* Dynamic UPI QR Code Scanner Card */}
            {paymentMethod === 'UPI' && (
              <div className="p-4 rounded-3xl bg-slate-850/90 border border-amber-400/30 flex flex-col sm:flex-row items-center gap-4 animate-in fade-in duration-300 shadow-xl">
                <div className="relative p-2 rounded-2xl bg-white border border-slate-200 shrink-0 shadow-lg">
                  {/* Targeting corner frames */}
                  <div className="absolute top-1 left-1 w-3 h-3 border-t-2 border-l-2 border-amber-500" />
                  <div className="absolute top-1 right-1 w-3 h-3 border-t-2 border-r-2 border-amber-500" />
                  <div className="absolute bottom-1 left-1 w-3 h-3 border-b-2 border-l-2 border-amber-500" />
                  <div className="absolute bottom-1 right-1 w-3 h-3 border-b-2 border-r-2 border-amber-500" />
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(
                      `upi://pay?pa=orderease.demo@bank&pn=OrderEase%20Table${tableNumber}&am=${cartGrandTotal}&cu=INR`
                    )}`}
                    alt="Demo UPI QR"
                    className="w-24 h-24 object-contain"
                  />
                </div>

                <div className="flex-1 text-center sm:text-left space-y-1.5">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <span className="text-sm font-black text-white">
                      Scan with PhonePe, GPay, Paytm or CRED
                    </span>
                    <span className="text-xs font-black text-amber-950 bg-amber-400 px-2 py-0.5 rounded-full font-mono">
                      ₹{cartGrandTotal}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 leading-snug">
                    Amount &amp; Table {tableNumber} is pre-encoded. Point your camera or UPI scanner to complete settlement.
                  </p>

                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Instant Auto-Verification • Table {tableNumber}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* STICKY PAYMENT BAR */}
        <div className="p-5 sm:p-6 bg-slate-900 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
          <div className="w-full sm:w-auto text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 text-xs text-slate-400">
              <span>Subtotal ₹{cartSubtotal}</span>
              <span>+</span>
              <span>5% GST ₹{cartTax}</span>
              <span>=</span>
              <span className="font-bold text-slate-200">Total ₹{cartGrandTotal}</span>
            </div>
            
            <div className="flex items-baseline justify-center sm:justify-start gap-2 mt-0.5">
              <span className="text-xs uppercase font-extrabold text-slate-400">
                FINAL TOTAL:
              </span>
              <span className="text-2xl font-black text-amber-400 font-display">
                ₹{cartGrandTotal}
              </span>
            </div>
          </div>

          <button
            onClick={handlePay}
            disabled={isProcessing || cartGrandTotal <= 0}
            className="w-full sm:w-auto min-w-[240px] py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-base shadow-xl shadow-amber-500/25 active:scale-98 transition-all flex items-center justify-center gap-2.5 disabled:opacity-50 cursor-pointer"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-slate-950" />
                <span>Authorizing Payment...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-5 h-5 text-slate-950" />
                <span>{t.payNow} (₹{cartGrandTotal})</span>
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};

export default CheckoutModal;


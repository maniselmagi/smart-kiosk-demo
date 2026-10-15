import React, { useState } from 'react';
import { useKiosk } from '../../context/KioskContext';
import { Order } from '../../types';
import { 
  X, 
  CreditCard, 
  QrCode, 
  Wallet, 
  Users, 
  CheckCircle2, 
  ShieldCheck, 
  Loader2, 
  HeartHandshake 
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
  const [isSplitBill, setIsSplitBill] = useState(false);
  const [splitType, setSplitType] = useState<'equally' | 'items'>('equally');
  const [guestCount, setGuestCount] = useState(2);
  const [tipOption, setTipOption] = useState<'0' | '5' | '10' | '15' | 'custom'>('0');
  const [customTipAmount, setCustomTipAmount] = useState(30);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen || cart.length === 0) return null;

  // Calculate tip amount
  const tipAmount = (() => {
    switch (tipOption) {
      case '0': return 0;
      case '5': return Math.round(cartSubtotal * 0.05);
      case '10': return Math.round(cartSubtotal * 0.10);
      case '15': return Math.round(cartSubtotal * 0.15);
      case 'custom': return customTipAmount;
      default: return 0;
    }
  })();

  const grandTotal = cartSubtotal + cartTax + tipAmount;
  const perGuestShare = Math.round(grandTotal / guestCount);

  const handlePay = () => {
    setIsProcessing(true);

    setTimeout(() => {
      const splitDetails = isSplitBill ? {
        type: splitType,
        guestCount,
        amountPerGuest: perGuestShare
      } : undefined;

      const order = placeOrder(paymentMethod, tipAmount, splitDetails);
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
              <span className="px-2 py-0.5 rounded-md bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 text-xs font-bold uppercase tracking-wider border border-brand-200/50 dark:border-brand-800/50">
                Table {tableNumber}
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                {cart.reduce((a, b) => a + b.quantity, 0)} Items
              </span>
            </div>
            <h3 className="font-black text-xl text-slate-900 dark:text-white font-display mt-0.5">
              {t.checkout}
            </h3>
          </div>

          <button
            onClick={onClose}
            disabled={isProcessing}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors disabled:opacity-30"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 md:p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Order Items Preview */}
          <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-700">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-2">
              Order Summary Review
            </span>
            <div className="divide-y divide-slate-200/60 dark:divide-slate-700 max-h-40 overflow-y-auto pr-1">
              {cart.map((item, idx) => (
                <div key={item.cartItemId} className="py-2 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center font-black text-[10px] shrink-0" title={`Serving #${item.servingPriority || idx + 1}`}>
                      #{item.servingPriority || idx + 1}
                    </span>
                    <span className="font-extrabold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950 w-5 h-5 rounded flex items-center justify-center">
                      {item.quantity}×
                    </span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 truncate max-w-[180px] md:max-w-xs">
                      {item.name}
                    </span>
                    <span className="text-[10px] text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950 px-1.5 py-0.5 rounded">
                      {item.spiceLevel}
                    </span>
                  </div>
                  <span className="font-extrabold text-slate-900 dark:text-slate-100 font-display">
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Split Bill Accordion */}
          <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  {t.splitBill}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsSplitBill(!isSplitBill)}
                className={`text-xs font-bold px-3 py-1 rounded-xl transition-all ${
                  isSplitBill 
                    ? 'bg-brand-600 text-white' 
                    : 'bg-white dark:bg-slate-850 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {isSplitBill ? 'Active ✓' : 'Enable Split'}
              </button>
            </div>

            {isSplitBill && (
              <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 space-y-3 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">Number of Diners:</span>
                  <div className="flex items-center gap-2">
                    {[2, 3, 4, 5].map((cnt) => (
                      <button
                        key={cnt}
                        onClick={() => setGuestCount(cnt)}
                        className={`w-8 h-8 rounded-xl text-xs font-bold transition-all ${
                          guestCount === cnt
                            ? 'bg-brand-600 text-white'
                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                        }`}
                      >
                        {cnt}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-brand-50/80 dark:bg-brand-950/80 border border-brand-200/60 dark:border-brand-800/60 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-brand-900 dark:text-brand-200">
                      {t.splitEqually} across {guestCount} {t.guests}
                    </span>
                    <p className="text-[11px] text-brand-700 dark:text-brand-400">
                      Each person pays their portion directly
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-black text-brand-700 dark:text-brand-300 font-display">
                      ₹{perGuestShare}
                    </span>
                    <span className="block text-[10px] text-brand-600 dark:text-brand-400 font-medium">
                      / person
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Optional Tipping Section */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <HeartHandshake className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                <span>Optional Server Tip</span>
              </label>
              {tipAmount > 0 && (
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  + ₹{tipAmount}
                </span>
              )}
            </div>

            <div className="grid grid-cols-5 gap-2">
              {(['0', '5', '10', '15', 'custom'] as const).map((opt) => {
                const label = opt === '0' ? t.noTip : opt === 'custom' ? t.customTip : `${opt}%`;
                const isSelected = tipOption === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setTipOption(opt)}
                    className={`py-2 px-1 rounded-xl text-center text-xs font-bold transition-all border ${
                      isSelected
                        ? 'bg-slate-900 dark:bg-brand-600 text-white border-slate-900 dark:border-brand-600 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            {tipOption === 'custom' && (
              <div className="mt-2.5 flex items-center gap-2">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Amount: ₹</span>
                <input
                  type="number"
                  min="0"
                  max="1000"
                  value={customTipAmount}
                  onChange={(e) => setCustomTipAmount(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-24 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-100"
                />
              </div>
            )}
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
                className={`p-3.5 rounded-2xl border text-center flex flex-col items-center justify-center gap-2 transition-all active:scale-95 ${
                  paymentMethod === 'UPI'
                    ? 'bg-brand-50 dark:bg-brand-950/70 border-brand-500 text-brand-900 dark:text-brand-300 shadow-sm font-bold ring-2 ring-brand-500/20'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-750'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-brand-100 dark:bg-brand-900/60 text-brand-600 dark:text-brand-300 flex items-center justify-center">
                  <QrCode className="w-5 h-5" />
                </div>
                <span className="text-xs">UPI QR Code</span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-normal">GPay / PhonePe</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('Card')}
                className={`p-3.5 rounded-2xl border text-center flex flex-col items-center justify-center gap-2 transition-all active:scale-95 ${
                  paymentMethod === 'Card'
                    ? 'bg-brand-50 dark:bg-brand-950/70 border-brand-500 text-brand-900 dark:text-brand-300 shadow-sm font-bold ring-2 ring-brand-500/20'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-750'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <CreditCard className="w-5 h-5" />
                </div>
                <span className="text-xs">Credit / Debit</span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-normal">Tap / Chip POS</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('Wallet')}
                className={`p-3.5 rounded-2xl border text-center flex flex-col items-center justify-center gap-2 transition-all active:scale-95 ${
                  paymentMethod === 'Wallet'
                    ? 'bg-brand-50 dark:bg-brand-950/70 border-brand-500 text-brand-900 dark:text-brand-300 shadow-sm font-bold ring-2 ring-brand-500/20'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-750'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                  <Wallet className="w-5 h-5" />
                </div>
                <span className="text-xs">Digital Wallet</span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-normal">Paytm / Amazon</span>
              </button>
            </div>

            {/* UPI QR Code Preview if UPI selected */}
            {paymentMethod === 'UPI' && (
              <div className="mt-3.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 flex items-center gap-3.5">
                <div className="w-16 h-16 bg-white p-1 rounded-xl border border-slate-200 shrink-0 flex items-center justify-center">
                  <img
                    src="https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=upi%3A%2F%2Fpay%3Fpa%3Dorderease.demo%40bank%26pn%3DOrderEase%20Kiosk"
                    alt="Demo UPI QR"
                    className="w-full h-full"
                  />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">
                    Scan with any UPI app on phone
                  </span>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Supports Google Pay, PhonePe, Paytm, CRED & BHIM
                  </p>
                  <span className="inline-block mt-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200/60 dark:border-emerald-800/60">
                    Demo Mode • Auto-verified
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
              <span>{t.subtotal} ₹{cartSubtotal}</span>
              <span>+</span>
              <span>GST ₹{cartTax}</span>
              {tipAmount > 0 && <span>+ Tip ₹{tipAmount}</span>}
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xs uppercase font-extrabold text-slate-400 dark:text-slate-500">{t.total}:</span>
              <span className="text-2xl font-black text-slate-900 dark:text-white font-display">
                ₹{grandTotal}
              </span>
              {isSplitBill && (
                <span className="text-xs text-brand-600 dark:text-brand-400 font-bold">
                  (₹{perGuestShare} per diner)
                </span>
              )}
            </div>
          </div>

          <button
            onClick={handlePay}
            disabled={isProcessing}
            className="w-full sm:w-auto min-w-[200px] py-4 px-6 rounded-2xl bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-700 hover:to-brand-600 text-white font-extrabold text-base shadow-xl shadow-brand-500/30 active:scale-98 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-white" />
                <span>Processing Payment...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-5 h-5 text-amber-200" />
                <span>{t.payNow} (₹{grandTotal})</span>
              </>
            )}
          </button>

        </div>

      </div>
    </div>
  );
};

export default CheckoutModal;

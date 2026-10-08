import React, { useState } from 'react';
import { useKiosk } from '../../context/KioskContext';
import { Order } from '../../types';
import { 
  CheckCircle2, 
  Send, 
  Printer, 
  X, 
  Clock, 
  Star 
} from 'lucide-react';

interface DigitalReceiptModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onTrackOrder: () => void;
  onOpenFeedback: () => void;
}

export const DigitalReceiptModal: React.FC<DigitalReceiptModalProps> = ({ 
  order, 
  isOpen, 
  onClose, 
  onTrackOrder,
  onOpenFeedback 
}) => {
  const { t } = useKiosk();
  const [recipient, setRecipient] = useState('');
  const [sentSuccess, setSentSuccess] = useState(false);

  if (!isOpen || !order) return null;

  const handleSendReceipt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipient.trim()) return;
    setSentSuccess(true);
    setTimeout(() => {
      setSentSuccess(false);
      setRecipient('');
    }, 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Success Banner */}
        <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 p-6 text-white text-center relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-3 text-white shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <h3 className="text-2xl font-black font-display tracking-tight text-white mb-1">
            {t.paymentSuccessful}
          </h3>
          <p className="text-xs text-emerald-100">
            Order confirmed and routed straight to the kitchen display
          </p>

          <div className="mt-4 inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-black/20 text-xs font-bold text-emerald-100 border border-white/10">
            <span>Order #{order.orderNumber}</span>
            <span>•</span>
            <span>Table {order.tableNumber}</span>
          </div>
        </div>

        {/* Printable Receipt Paper Container */}
        <div id="printable-receipt" className="p-6 overflow-y-auto flex-1 space-y-5 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100">
          
          {/* Restaurant Header */}
          <div className="text-center pb-4 border-b border-dashed border-slate-300 dark:border-slate-700">
            <h4 className="font-extrabold text-lg text-slate-900 dark:text-white font-display">
              OrderEase Bistro & Bar
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Table {order.tableNumber} • {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
            <span className="text-[11px] text-slate-400 dark:text-slate-500">
              Receipt #{order.id}
            </span>
          </div>

          {/* Itemized Dish Breakdown */}
          <div className="space-y-2.5 text-xs">
            {order.items.map((item) => (
              <div key={item.cartItemId} className="flex justify-between items-start">
                <div>
                  <div className="font-bold text-slate-800 dark:text-slate-200">
                    {item.quantity}× {item.name}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">
                    Spice: {item.spiceLevel} {item.customizations.length > 0 && `• ${item.customizations.join(', ')}`}
                  </div>
                </div>
                <span className="font-extrabold text-slate-900 dark:text-slate-100 font-display">
                  ₹{item.price * item.quantity}
                </span>
              </div>
            ))}
          </div>

          {/* Totals Breakdown */}
          <div className="pt-3 border-t border-dashed border-slate-300 dark:border-slate-700 space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-500 dark:text-slate-400">
              <span>{t.subtotal}</span>
              <span>₹{order.subtotal}</span>
            </div>
            <div className="flex justify-between text-slate-500 dark:text-slate-400">
              <span>{t.taxGst}</span>
              <span>₹{order.tax}</span>
            </div>
            {order.tip > 0 && (
              <div className="flex justify-between text-slate-500 dark:text-slate-400">
                <span>Staff Gratuity / Tip</span>
                <span>₹{order.tip}</span>
              </div>
            )}
            <div className="flex justify-between items-baseline pt-2 border-t border-slate-200 dark:border-slate-700 text-sm font-black text-slate-900 dark:text-white">
              <span>{t.total}</span>
              <span className="text-xl text-brand-600 dark:text-brand-400 font-display">
                ₹{order.total}
              </span>
            </div>

            {order.splitBillDetails && (
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 text-[11px] text-slate-600 dark:text-slate-300 font-medium">
                Split Bill: {order.splitBillDetails.guestCount} Diners (₹{order.splitBillDetails.amountPerGuest} each)
              </div>
            )}

            <div className="text-[11px] text-slate-400 dark:text-slate-500 pt-1">
              Method: {order.paymentMethod} (Demo Transaction)
            </div>
          </div>

          {/* Send Receipt to Phone / Email */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              {t.sendReceipt}
            </label>
            {sentSuccess ? (
              <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold text-center border border-emerald-200 dark:border-emerald-800">
                ✓ {t.receiptSentSuccess}
              </div>
            ) : (
              <form onSubmit={handleSendReceipt} className="flex gap-2">
                <input
                  type="text"
                  placeholder={t.phoneNumberOrEmail}
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-brand-600 hover:bg-slate-800 dark:hover:bg-brand-700 text-white text-xs font-bold transition-colors shrink-0 flex items-center gap-1"
                >
                  <Send className="w-3 h-3" />
                  <span>{t.send}</span>
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Action Buttons */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 shrink-0">
          <button
            onClick={handlePrint}
            className="px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span className="hidden sm:inline">Print Receipt</span>
          </button>

          <button
            onClick={() => {
              onClose();
              onOpenFeedback();
            }}
            className="px-3.5 py-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 hover:bg-amber-100 text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>Rate Dining</span>
          </button>

          <button
            onClick={() => {
              onClose();
              onTrackOrder();
            }}
            className="flex-1 py-3 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-black shadow-md shadow-brand-500/25 active:scale-95 transition-all flex items-center justify-center gap-1.5"
          >
            <Clock className="w-4 h-4" />
            <span>Live Kitchen Status →</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default DigitalReceiptModal;

import React, { useState, useMemo } from 'react';
import { useKiosk } from '../../context/KioskContext';
import { Order } from '../../types';
import { 
  X, 
  CreditCard, 
  QrCode, 
  Wallet, 
  Users, 
  User,
  ShieldCheck, 
  Loader2, 
  Minus,
  Plus,
  Check,
  Receipt,
  Info
} from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderSuccess: (order: Order) => void;
}

type SplitMode = 'full' | 'equal' | 'items';

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

  const [splitMode, setSplitMode] = useState<SplitMode>('full');
  const [guestCount, setGuestCount] = useState(2);
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>(() => cart.map(i => i.cartItemId));
  const [payOnlyMyShare, setPayOnlyMyShare] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card' | 'Wallet'>('UPI');
  const [isProcessing, setIsProcessing] = useState(false);

  // Synchronize selected items if cart changes
  React.useEffect(() => {
    if (cart.length > 0 && selectedItemIds.length === 0) {
      setSelectedItemIds(cart.map(i => i.cartItemId));
    }
  }, [cart]);

  if (!isOpen || cart.length === 0) return null;

  // Split equally calculations
  const perGuestShare = Math.ceil(cartGrandTotal / guestCount);

  // Split by items calculations
  const itemizedSubtotal = useMemo(() => {
    return cart
      .filter(item => selectedItemIds.includes(item.cartItemId))
      .reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }, [cart, selectedItemIds]);

  const itemizedTax = Math.round(itemizedSubtotal * 0.05); // 5% GST
  const itemizedTotal = itemizedSubtotal + itemizedTax;
  const itemizedRemaining = Math.max(0, cartGrandTotal - itemizedTotal);

  // Active payment amount based on current split mode
  const activePaymentAmount = useMemo(() => {
    if (splitMode === 'equal') {
      return payOnlyMyShare ? perGuestShare : cartGrandTotal;
    }
    if (splitMode === 'items') {
      return itemizedTotal > 0 ? itemizedTotal : cartGrandTotal;
    }
    return cartGrandTotal;
  }, [splitMode, payOnlyMyShare, perGuestShare, cartGrandTotal, itemizedTotal]);

  const toggleItemSelection = (cartItemId: string) => {
    setSelectedItemIds(prev => 
      prev.includes(cartItemId) 
        ? prev.filter(id => id !== cartItemId)
        : [...prev, cartItemId]
    );
  };

  const selectAllItems = () => {
    setSelectedItemIds(cart.map(i => i.cartItemId));
  };

  const deselectAllItems = () => {
    setSelectedItemIds([]);
  };

  const handlePay = () => {
    setIsProcessing(true);

    setTimeout(() => {
      const splitDetails = splitMode === 'equal' ? {
        type: 'equally' as const,
        guestCount,
        amountPerGuest: perGuestShare
      } : splitMode === 'items' ? {
        type: 'items' as const,
        guestCount: selectedItemIds.length,
        amountPerGuest: itemizedTotal
      } : undefined;

      // tipAmount is 0 since Optional Server Tip section has been removed
      const order = placeOrder(paymentMethod, 0, splitDetails);
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
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs font-extrabold text-brand-600 dark:text-brand-400">
                Total ₹{cartGrandTotal}
              </span>
            </div>
            <h3 className="font-black text-xl text-slate-900 dark:text-white font-display mt-0.5">
              Review & Pay
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
          
          {/* PROFESSIONAL SPLIT BILL SECTION */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                <span>Bill Payment & Split Options</span>
              </label>
              <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500">
                Choose how your table pays
              </span>
            </div>

            {/* Split Mode Selector Tabs */}
            <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 dark:bg-slate-800/90 rounded-2xl border border-slate-200/70 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setSplitMode('full')}
                className={`py-2.5 px-2 rounded-xl text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all ${
                  splitMode === 'full'
                    ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-md font-extrabold ring-1 ring-slate-200 dark:ring-slate-700'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" />
                  <span>Pay Full Bill</span>
                </div>
                <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500">
                  ₹{cartGrandTotal} Total
                </span>
              </button>

              <button
                type="button"
                onClick={() => setSplitMode('equal')}
                className={`py-2.5 px-2 rounded-xl text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all ${
                  splitMode === 'equal'
                    ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-md font-extrabold ring-1 ring-slate-200 dark:ring-slate-700'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" />
                  <span>Split Equally</span>
                </div>
                <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500">
                  ₹{perGuestShare} / person
                </span>
              </button>

              <button
                type="button"
                onClick={() => setSplitMode('items')}
                className={`py-2.5 px-2 rounded-xl text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all ${
                  splitMode === 'items'
                    ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-md font-extrabold ring-1 ring-slate-200 dark:ring-slate-700'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Receipt className="w-3.5 h-3.5" />
                  <span>Split by Items</span>
                </div>
                <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500">
                  Select your dishes
                </span>
              </button>
            </div>

            {/* TAB CONTENT: PAY FULL BILL */}
            {splitMode === 'full' && (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200 block">
                    Single Payer • Table Total
                  </span>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    One diner pays the full bill of ₹{cartGrandTotal} (Subtotal ₹{cartSubtotal} + 5% GST ₹{cartTax}).
                  </p>
                </div>
                <div className="text-right shrink-0 ml-3">
                  <span className="text-xs uppercase font-bold text-slate-400 dark:text-slate-500 block">Total</span>
                  <span className="text-lg font-black text-brand-600 dark:text-brand-400 font-display">
                    ₹{cartGrandTotal}
                  </span>
                </div>
              </div>
            )}

            {/* TAB CONTENT: SPLIT EQUALLY */}
            {splitMode === 'equal' && (
              <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/70 dark:border-amber-900/40 space-y-4 animate-in fade-in duration-200">
                {/* Guest Counter Stepper */}
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200 block">
                      Number of Guests Sharing:
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      Total ₹{cartGrandTotal} divided equally
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setGuestCount(Math.max(2, guestCount - 1))}
                      disabled={guestCount <= 2}
                      className="w-8 h-8 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-300 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-750 transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    
                    <span className="w-8 text-center font-black text-sm text-slate-900 dark:text-white font-display">
                      {guestCount}
                    </span>

                    <button
                      type="button"
                      onClick={() => setGuestCount(Math.min(10, guestCount + 1))}
                      disabled={guestCount >= 10}
                      className="w-8 h-8 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-300 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-750 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Quick Presets */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 mr-1">Quick:</span>
                  {[2, 3, 4, 5, 6, 8].map(cnt => (
                    <button
                      key={cnt}
                      type="button"
                      onClick={() => setGuestCount(cnt)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                        guestCount === cnt
                          ? 'bg-brand-600 text-white shadow-sm'
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-750'
                      }`}
                    >
                      {cnt} Guests
                    </button>
                  ))}
                </div>

                {/* Share Summary Card */}
                <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-amber-200/80 dark:border-amber-800/60 flex items-center justify-between shadow-sm">
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      Equal Share per Person
                    </span>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      ₹{cartGrandTotal} ÷ {guestCount} Diners
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-black text-brand-600 dark:text-brand-400 font-display">
                      ₹{perGuestShare}
                    </span>
                    <span className="text-[10px] text-slate-400 block font-medium">/ diner</span>
                  </div>
                </div>

                {/* Split Payment Selection */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setPayOnlyMyShare(true)}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold border transition-all text-center ${
                      payOnlyMyShare 
                        ? 'bg-brand-50 dark:bg-brand-950/60 border-brand-500 text-brand-800 dark:text-brand-300 ring-1 ring-brand-500'
                        : 'bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Pay My Share (₹{perGuestShare})
                  </button>
                  <button
                    type="button"
                    onClick={() => setPayOnlyMyShare(false)}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold border transition-all text-center ${
                      !payOnlyMyShare 
                        ? 'bg-brand-50 dark:bg-brand-950/60 border-brand-500 text-brand-800 dark:text-brand-300 ring-1 ring-brand-500'
                        : 'bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Pay Table Total (₹{cartGrandTotal})
                  </button>
                </div>
              </div>
            )}

            {/* TAB CONTENT: SPLIT BY ITEMS */}
            {splitMode === 'items' && (
              <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200/70 dark:border-blue-900/40 space-y-3.5 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200 block">
                      Select the dishes you are paying for:
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      Tap any item to include or exclude from your share
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={selectAllItems}
                      className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Select All
                    </button>
                    <span className="text-slate-300 dark:text-slate-700">•</span>
                    <button
                      type="button"
                      onClick={deselectAllItems}
                      className="text-[11px] font-bold text-slate-500 hover:underline"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                {/* Items Checklist */}
                <div className="max-h-48 overflow-y-auto space-y-2 pr-1 divide-y divide-slate-200/60 dark:divide-slate-800">
                  {cart.map((item) => {
                    const isSelected = selectedItemIds.includes(item.cartItemId);
                    const itemTotal = item.price * item.quantity;
                    return (
                      <button
                        key={item.cartItemId}
                        type="button"
                        onClick={() => toggleItemSelection(item.cartItemId)}
                        className={`w-full pt-2 first:pt-0 flex items-center justify-between text-left p-2 rounded-xl transition-all ${
                          isSelected
                            ? 'bg-white dark:bg-slate-850 border border-blue-200 dark:border-blue-800/70 shadow-xs'
                            : 'opacity-60 hover:opacity-100 bg-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${
                            isSelected
                              ? 'bg-blue-600 text-white'
                              : 'border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'
                          }`}>
                            {isSelected && <Check className="w-3.5 h-3.5" />}
                          </div>

                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                                {item.quantity}× {item.name}
                              </span>
                              <span className="text-[10px] text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950 px-1 py-0.2 rounded font-medium">
                                {item.spiceLevel}
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-400 block">
                              ₹{item.price} each
                            </span>
                          </div>
                        </div>

                        <span className={`text-xs font-black font-display ${
                          isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'
                        }`}>
                          ₹{itemTotal}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Itemized Calculation Summary */}
                <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-blue-200/80 dark:border-blue-800/60 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block">
                      Your Selected Portion
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      Items ₹{itemizedSubtotal} + 5% GST ₹{itemizedTax}
                    </span>
                    {itemizedRemaining > 0 && (
                      <span className="text-[10px] text-amber-600 dark:text-amber-400 block font-semibold mt-0.5">
                        Table balance remaining: ₹{itemizedRemaining}
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-black text-blue-600 dark:text-blue-400 font-display">
                      ₹{itemizedTotal}
                    </span>
                    <span className="text-[10px] text-slate-400 block font-medium">to pay now</span>
                  </div>
                </div>
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

            {/* Dynamic UPI QR Code Preview with exact share amount */}
            {paymentMethod === 'UPI' && (
              <div className="mt-3.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 flex items-center gap-3.5 animate-in fade-in duration-200">
                <div className="w-20 h-20 bg-white p-1 rounded-xl border border-slate-200 shrink-0 flex items-center justify-center shadow-xs">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(
                      `upi://pay?pa=orderease.demo@bank&pn=OrderEase%20Table${tableNumber}&am=${activePaymentAmount}&cu=INR`
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
                    <span className="text-[10px] font-black text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950 px-2 py-0.5 rounded border border-brand-200/60 dark:border-brand-800/60">
                      ₹{activePaymentAmount}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Amount is pre-encoded in QR code. Scan with your camera or UPI app to pay your portion.
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
                {splitMode === 'full' ? 'TOTAL TO PAY:' : 'PAYING NOW:'}
              </span>
              <span className="text-2xl font-black text-brand-600 dark:text-brand-400 font-display">
                ₹{activePaymentAmount}
              </span>
              {splitMode === 'equal' && payOnlyMyShare && (
                <span className="text-xs text-slate-500 font-medium">
                  (1 of {guestCount} guests • Table: ₹{cartGrandTotal})
                </span>
              )}
              {splitMode === 'items' && itemizedRemaining > 0 && (
                <span className="text-xs text-slate-500 font-medium">
                  (Remaining: ₹{itemizedRemaining})
                </span>
              )}
            </div>
          </div>

          <button
            onClick={handlePay}
            disabled={isProcessing || activePaymentAmount <= 0}
            className="w-full sm:w-auto min-w-[220px] py-4 px-6 rounded-2xl bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-700 hover:to-brand-600 text-white font-extrabold text-base shadow-xl shadow-brand-500/30 active:scale-98 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-white" />
                <span>Processing Payment...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-5 h-5 text-amber-200" />
                <span>{t.payNow} (₹{activePaymentAmount})</span>
              </>
            )}
          </button>

        </div>

      </div>
    </div>
  );
};

export default CheckoutModal;

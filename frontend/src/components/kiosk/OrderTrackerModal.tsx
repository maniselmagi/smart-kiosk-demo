import React, { useState, useEffect } from 'react';
import { useKiosk } from '../../context/KioskContext';
import { Order, OrderStatus, CartItem } from '../../types';
import { 
  CheckCircle2, 
  ChefHat, 
  UtensilsCrossed, 
  Sparkles, 
  X, 
  Receipt,
  Bell,
  Timer,
  Gamepad2,
  Flame,
  ArrowRight,
  Star,
  Zap,
  Gift,
  Clock,
  Plus,
  AlertTriangle,
  AlertCircle,
  Layers
} from 'lucide-react';
import { getAssignedWaiter } from '../../utils/waiterAssignment';
import { CustomerFeedbackModal } from './CustomerFeedbackModal';

export const COMPLIMENTARY_SNACKS = [
  {
    id: 'comp-papad',
    name: 'Masala Roasted Papad',
    desc: 'Crispy lentil wafer with roasted cumin, chaat masala & fresh cilantro',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=300&q=80',
    tag: 'Quick 2-Min Side',
    originalPrice: 49
  },
  {
    id: 'comp-garlic-toast',
    name: 'Garlic Butter Herb Toast',
    desc: 'Golden toasted bread infused with aromatic garlic butter & herbs',
    image: 'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?auto=format&fit=crop&w=300&q=80',
    tag: 'Tandoor Fresh',
    originalPrice: 79
  },
  {
    id: 'comp-mint-cooler',
    name: 'Chilled Mint Lime Fizz',
    desc: 'Refreshing hand-squeezed lime with crushed garden mint and sparkling soda',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=300&q=80',
    tag: 'Cooling Drink',
    originalPrice: 89
  },
  {
    id: 'comp-gulab-jamun',
    name: 'Warm Mini Gulab Jamun',
    desc: 'Two melt-in-mouth golden dumplings steeped in cardamom rose syrup',
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=300&q=80',
    tag: 'Sweet Delight',
    originalPrice: 69
  }
];

interface OrderTrackerModalProps {
  order: Order | null;
  orders?: Order[];
  isOpen: boolean;
  onClose: () => void;
  onOpenReceipt: () => void;
  onOpenEntertainment?: () => void;
  onOpenFinishMeal?: () => void;
  onOpenFeedback?: () => void;
}

export const OrderTrackerModal: React.FC<OrderTrackerModalProps> = ({ 
  order, 
  orders,
  isOpen, 
  onClose, 
  onOpenReceipt, 
  onOpenEntertainment,
  onOpenFeedback
}) => {
  const { t, callWaiter, updateOrder, showToast } = useKiosk();
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  // Consolidated multi-orders for this table
  const allOrders = (orders && orders.length > 0) ? orders : (order ? [order] : []);
  const [selectedOrderId, setSelectedOrderId] = useState<string>(order?.id || allOrders[0]?.id || '');

  // Keep selected order in sync when switching or receiving new orders
  useEffect(() => {
    if (order?.id && !allOrders.some(o => o.id === selectedOrderId)) {
      setSelectedOrderId(order.id);
    } else if (!selectedOrderId && allOrders.length > 0) {
      setSelectedOrderId(allOrders[0].id);
    }
  }, [order?.id, allOrders, selectedOrderId]);

  const activeOrder = allOrders.find(o => o.id === selectedOrderId) || order || allOrders[0];

  // Complimentary snack choice state for delayed preparation
  const [selectedCompSnack, setSelectedCompSnack] = useState<typeof COMPLIMENTARY_SNACKS[0] | null>(null);
  const [isCompClaimed, setIsCompClaimed] = useState<boolean>(false);

  // Active delivery countdown timer running in real-time
  const [secondsLeft, setSecondsLeft] = useState<number>(() => {
    if (!activeOrder) return 0;
    const target = new Date(activeOrder.createdAt).getTime() + (activeOrder.estimatedPrepTime * 60 * 1000);
    return Math.max(0, Math.floor((target - Date.now()) / 1000));
  });

  useEffect(() => {
    if (!activeOrder) return;
    const calculateSeconds = () => {
      if (activeOrder.status === 'COMPLETED') return 0;
      const target = new Date(activeOrder.createdAt).getTime() + (activeOrder.estimatedPrepTime * 60 * 1000);
      return Math.max(0, Math.floor((target - Date.now()) / 1000));
    };

    setSecondsLeft(calculateSeconds());
    const interval = setInterval(() => {
      setSecondsLeft(calculateSeconds());
    }, 1000);

    return () => clearInterval(interval);
  }, [activeOrder?.createdAt, activeOrder?.estimatedPrepTime, activeOrder?.status, activeOrder?.id]);

  if (!isOpen || !activeOrder) return null;

  // Add extra preparation minutes when food is taking longer
  const handleAddExtraMinutes = (extraMins: number = 5) => {
    const newPrepTime = (activeOrder.estimatedPrepTime || 12) + extraMins;
    updateOrder(activeOrder.id, {
      estimatedPrepTime: newPrepTime,
      createdAt: new Date().toISOString()
    });
    setSecondsLeft(extraMins * 60);
    showToast(`+${extraMins} extra preparation minutes added. Chef notified!`);
  };

  // Claim free small food compensation (100% Free / ₹0)
  const handleClaimComplimentarySnack = (snack: typeof COMPLIMENTARY_SNACKS[0]) => {
    const compItem: CartItem = {
      cartItemId: `comp-${Date.now()}-${snack.id}`,
      menuItemId: snack.id,
      name: `🎁 ${snack.name} (Complimentary Delay Treat)`,
      price: 0,
      basePrice: 0,
      customizationTotal: 0,
      quantity: 1,
      spiceLevel: 'Mild',
      customizations: ['Free Delay Apology', 'Chef Special Treat'],
      specialInstructions: 'Prepared immediately on priority - ₹0 Free of Charge',
      image: snack.image,
      isVeg: true
    };

    const updatedItems = [...activeOrder.items, compItem];
    const extraMins = 5;
    const newPrepTime = (activeOrder.estimatedPrepTime || 12) + extraMins;

    updateOrder(activeOrder.id, {
      items: updatedItems,
      estimatedPrepTime: newPrepTime,
      createdAt: new Date().toISOString()
    });

    setSecondsLeft(extraMins * 60);
    setIsCompClaimed(true);
    showToast(`🎉 Complimentary ${snack.name} added to your order for ₹0!`);
  };

  const waiter = getAssignedWaiter(activeOrder.tableNumber);

  // Formatting countdown mm:ss
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const formattedCountdown = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  // Food status conditions
  const isFoodReady = activeOrder.status === 'READY' || activeOrder.status === 'COMPLETED';
  const isDelayed = secondsLeft === 0 && !isFoodReady;
  const isTimeUp = secondsLeft === 0 || isFoodReady;

  // Progress percentage (elapsed vs total prep time)
  const totalPrepSeconds = Math.max(60, (activeOrder.estimatedPrepTime || 12) * 60);
  const elapsedSeconds = Math.max(0, totalPrepSeconds - secondsLeft);
  const progressPercent = activeOrder.status === 'COMPLETED'
    ? 100
    : activeOrder.status === 'READY'
    ? 95
    : isDelayed
    ? 92
    : Math.min(88, Math.max(12, Math.round((elapsedSeconds / totalPrepSeconds) * 100)));

  // SVG Radar circle calculation (radius 54 -> circumference ~339.29)
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  const steps: { key: OrderStatus; label: string; icon: React.ReactNode; desc: string; tag: string }[] = [
    {
      key: 'NEW',
      label: t.statusReceived,
      icon: <CheckCircle2 className="w-5 h-5" />,
      desc: `Confirmed by Floor Supervisor & Waiter ${waiter.name}`,
      tag: 'Step 1 • Ticket Queued',
    },
    {
      key: 'PREPARING',
      label: t.statusPreparing,
      icon: <ChefHat className="w-5 h-5" />,
      desc: 'Chef cooking on fire line • Fresh ingredients simmering',
      tag: 'Step 2 • On the Fire',
    },
    {
      key: 'READY',
      label: t.statusReady,
      icon: <UtensilsCrossed className="w-5 h-5" />,
      desc: `Plated hot with garnishes • Waiter ${waiter.name} bringing to Table ${activeOrder.tableNumber}`,
      tag: 'Step 3 • Dispatched',
    },
    {
      key: 'COMPLETED',
      label: t.statusServed,
      icon: <Sparkles className="w-5 h-5" />,
      desc: 'Dishes delivered directly to your table. Bon Appétit!',
      tag: 'Step 4 • Meal Served',
    },
  ];

  const getStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'NEW': return 0;
      case 'PREPARING': return 1;
      case 'READY': return 2;
      case 'COMPLETED': return 3;
      default: return 0;
    }
  };

  const currentIndex = getStepIndex(activeOrder.status);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
      <div 
        className="w-full max-w-xl bg-slate-900/95 text-slate-100 rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.85)] border border-white/10 overflow-hidden flex flex-col max-h-[94vh] animate-in zoom-in-95 duration-300 relative backdrop-blur-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/4 right-1/4 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent blur-[2px]" />

        {/* TRACKER HEADER: Modern Luxury Minimal */}
        <div className="p-5 sm:p-6 bg-gradient-to-b from-slate-850 to-slate-900 border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400/20 via-orange-500/20 to-amber-600/30 text-amber-400 flex items-center justify-center font-black text-base border border-amber-400/40 shadow-inner">
                #{activeOrder.orderNumber}
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] uppercase tracking-wider font-extrabold text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/30">
                  Table {activeOrder.tableNumber}
                </span>
                <span className="text-xs text-slate-500">•</span>
                <span className="text-xs font-semibold text-slate-300">
                  {activeOrder.items.reduce((a, b) => a + b.quantity, 0)} Items
                </span>
                {allOrders.length > 1 && (
                  <span className="text-[10px] font-bold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30">
                    {allOrders.length} Active Orders
                  </span>
                )}
              </div>
              <h3 className="text-xl font-black font-display text-white mt-0.5 tracking-tight flex items-center gap-2">
                <span>Live Kitchen Tracker</span>
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-2xl bg-white/[0.05] hover:bg-white/[0.12] text-slate-400 hover:text-white transition-all flex items-center justify-center cursor-pointer border border-white/5 active:scale-95"
            aria-label="Close Tracker"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* MULTI-ORDER SELECTOR BAR: Shows when table has placed multiple orders */}
        {allOrders.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto p-3 sm:px-6 bg-slate-850/90 border-b border-white/[0.08] custom-scrollbar">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider shrink-0">
              Your Orders:
            </span>
            <div className="flex items-center gap-2">
              {allOrders.map((ord, idx) => {
                const isSelected = ord.id === activeOrder.id;
                const itemCount = ord.items.reduce((s, i) => s + i.quantity, 0);
                return (
                  <button
                    key={ord.id}
                    type="button"
                    onClick={() => {
                      setSelectedOrderId(ord.id);
                      setIsCompClaimed(false);
                    }}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 border ${
                      isSelected
                        ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-md shadow-amber-400/25 scale-[1.02]'
                        : 'bg-white/[0.05] hover:bg-white/[0.12] text-slate-300 border-white/10'
                    }`}
                  >
                    <span>Order #{ord.orderNumber}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-extrabold ${
                      isSelected ? 'bg-slate-950/20 text-slate-950' : 'bg-white/10 text-amber-300'
                    }`}>
                      {itemCount} items • ₹{ord.total}
                    </span>
                    <span className={`text-[9px] uppercase px-1.5 py-0.2 rounded font-semibold ${
                      ord.status === 'READY' ? 'bg-emerald-500/30 text-emerald-300' : 'bg-slate-700/50 text-slate-300'
                    }`}>
                      {ord.status}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* SCROLLABLE TRACKER BODY */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
          
          {/* CIRCULAR RADAR COUNTDOWN HERO CARD */}
          <div className="relative p-5 rounded-3xl bg-gradient-to-br from-slate-800/80 via-slate-850/90 to-slate-900/90 border border-white/10 shadow-2xl overflow-hidden">
            {/* Ambient Backlight */}
            <div className="absolute -right-8 -top-8 w-44 h-44 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
            <div className="absolute -left-8 -bottom-8 w-44 h-44 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

            <div className="flex flex-col sm:flex-row items-center justify-between gap-5 relative z-10">
              
              {/* Animated SVG Circular Progress Radar */}
              <div className="relative flex items-center justify-center shrink-0">
                <svg className="w-32 h-32 -rotate-90 transform">
                  {/* Background Track */}
                  <circle
                    cx="64"
                    cy="64"
                    r={radius}
                    className="text-slate-800 stroke-current"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  {/* Progress Glow Track */}
                  <circle
                    cx="64"
                    cy="64"
                    r={radius}
                    className={`stroke-current transition-all duration-1000 ease-out ${
                      isDelayed ? 'text-amber-500 animate-pulse' : 'text-amber-400'
                    }`}
                    strokeWidth="8"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>

                {/* Radar Center Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  {activeOrder.status === 'COMPLETED' ? (
                    <>
                      <Sparkles className="w-7 h-7 text-emerald-400 animate-bounce" />
                      <span className="text-[11px] font-black text-emerald-300 uppercase tracking-wider mt-0.5">Ready!</span>
                    </>
                  ) : activeOrder.status === 'READY' ? (
                    <>
                      <UtensilsCrossed className="w-7 h-7 text-emerald-400 animate-pulse" />
                      <span className="text-[11px] font-black text-emerald-300 uppercase tracking-wider mt-0.5">Dispatched!</span>
                    </>
                  ) : isDelayed ? (
                    <>
                      <AlertCircle className="w-7 h-7 text-amber-400 animate-pulse" />
                      <span className="text-[10px] font-black text-amber-300 uppercase tracking-wider mt-0.5">Finishing...</span>
                    </>
                  ) : (
                    <>
                      <span className="text-2xl font-black text-white font-mono tracking-tight leading-none">
                        {formattedCountdown}
                      </span>
                      <span className="text-[10px] text-amber-400/90 font-black uppercase tracking-wider mt-1">
                        Est. Time
                      </span>
                      <button
                        type="button"
                        onClick={() => setSecondsLeft(0)}
                        title="Simulate countdown completion"
                        className="mt-1 text-[9px] text-amber-400/70 hover:text-amber-300 flex items-center gap-0.5 underline font-medium cursor-pointer"
                      >
                        <Zap className="w-2.5 h-2.5" />
                        <span>Test Delay</span>
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Status Meta */}
              <div className="flex-1 text-center sm:text-left space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-black">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Real-Time Kitchen Sync Active</span>
                </div>

                <h4 className="text-lg font-black text-white font-display">
                  {activeOrder.status === 'COMPLETED'
                    ? 'Dishes Served at Your Table!'
                    : activeOrder.status === 'READY'
                    ? `Waiter ${waiter.name} is Delivering to Table ${activeOrder.tableNumber}`
                    : isDelayed
                    ? 'Finishing Touches on the Fire Line'
                    : 'Artisanal Dishes Being Cooked Fresh'}
                </h4>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {isDelayed
                    ? 'Our chef is ensuring precision seasoning and heat before dispatching.'
                    : `Total kitchen prep window: ${activeOrder.estimatedPrepTime || 12} minutes. Cooked fresh to order.`}
                </p>

                {/* Progress Mini Bar */}
                <div className="pt-1 space-y-1">
                  <div className="flex justify-between text-[11px] font-bold text-slate-400">
                    <span>Kitchen Completion</span>
                    <span className="text-amber-400 font-mono font-black">{progressPercent}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden p-0.5">
                    <div 
                      className="h-full rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-emerald-400 transition-all duration-1000 ease-out shadow-[0_0_12px_rgba(245,158,11,0.5)]"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              </div>

            </div>

            {/* REQUIREMENT 1: CHEF DELAY NOTIFICATION & COMPLIMENTARY FOOD (₹0 FREE) */}
            {isDelayed && (
              <div className="mt-4 pt-4 border-t border-amber-400/30 space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/15 via-orange-500/10 to-amber-950/30 border border-amber-400/30 shadow-lg">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-400/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-400/40 mt-0.5">
                      <Clock className="w-5 h-5 animate-spin" />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                          <AlertCircle className="w-3.5 h-3.5" />
                          Food Still Being Prepared
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleAddExtraMinutes(3)}
                            className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-amber-200 text-[11px] font-bold transition-all border border-white/10 active:scale-95 cursor-pointer"
                          >
                            +3 Mins
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAddExtraMinutes(5)}
                            className="px-2.5 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 text-[11px] font-black transition-all shadow-xs active:scale-95 cursor-pointer flex items-center gap-1"
                          >
                            <Plus className="w-3 h-3" />
                            <span>+5 Mins Delay</span>
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                        Your gourmet order is taking slightly longer to achieve authentic flavors and piping-hot plating. As our heartfelt apology, <strong>please choose any complimentary snack below on the house (₹0 Free of Charge)!</strong>
                      </p>
                    </div>
                  </div>

                  {/* COMPLIMENTARY SMALL FOOD PICKER */}
                  {!isCompClaimed ? (
                    <div className="mt-3 pt-3 border-t border-amber-400/20">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-black uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                          <Gift className="w-3.5 h-3.5 text-amber-400" />
                          Choose Free Delay Compensation Bite (₹0 Charge):
                        </span>
                        <span className="text-[10px] text-emerald-400 font-bold bg-emerald-400/10 px-2 py-0.5 rounded-full border border-emerald-400/30">
                          100% Free
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {COMPLIMENTARY_SNACKS.map((snack) => (
                          <div
                            key={snack.id}
                            className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/80 border border-white/10 hover:border-amber-400/50 transition-all group"
                          >
                            <div className="flex items-center gap-2.5">
                              <img
                                src={snack.image}
                                alt={snack.name}
                                className="w-10 h-10 rounded-lg object-cover border border-white/10 shrink-0"
                              />
                              <div>
                                <span className="text-xs font-bold text-white block group-hover:text-amber-300 transition-colors">
                                  {snack.name}
                                </span>
                                <div className="flex items-center gap-1.5">
                                  <span className="text-[10px] line-through text-slate-500 font-bold">
                                    ₹{snack.originalPrice}
                                  </span>
                                  <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/20 px-1.5 py-0.2 rounded font-mono">
                                    ₹0 Free
                                  </span>
                                </div>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleClaimComplimentarySnack(snack)}
                              className="px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-[11px] shadow-sm transition-all active:scale-95 cursor-pointer whitespace-nowrap"
                            >
                              Select Free
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="mt-3 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center gap-2.5 text-xs text-emerald-300">
                      <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>
                        <strong>Complimentary treat selected!</strong> Chef is rushing this free bite to your table with +5 extra minutes prep time.
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* FOOD READY / DELIVERED FEEDBACK BANNER (Only when food is actually READY or COMPLETED) */}
            {isFoodReady && (
              <div className="mt-4 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-2xl bg-white/[0.03] border border-amber-400/25 animate-in fade-in duration-300">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center shrink-0 border border-amber-400/20">
                    <Star className="w-4 h-4 fill-amber-400/40 text-amber-400" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">
                      Dishes Delivered • How Was Everything?
                    </span>
                    <p className="text-[11px] text-slate-300">
                      Rate your meal and service by <strong className="text-amber-300 font-medium">Waiter {waiter.fullName}</strong>.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (onOpenFeedback) onOpenFeedback();
                    setIsFeedbackOpen(true);
                  }}
                  className="w-full sm:w-auto py-2 px-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-xs active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
                >
                  <Star className="w-3.5 h-3.5 fill-slate-950" />
                  <span>Rate Experience</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Play Games & Digital News Lounge CTA Banner */}
            {onOpenEntertainment && (
              <div className="mt-4 pt-4 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
                    <Gamepad2 className="w-4 h-4 animate-pulse" />
                  </div>
                  <span className="text-xs font-bold text-slate-200">
                    Bored waiting? Play <span className="text-amber-400 font-extrabold">Ludo, Sudoku</span> or Read Live News!
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenEntertainment();
                  }}
                  className="w-full sm:w-auto py-2 px-4 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-xs shadow-md shadow-amber-500/25 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
                >
                  <span>Play Games Lounge</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-950" />
                </button>
              </div>
            )}
          </div>

          {/* ASSIGNED WAITER CONCIERGE CARD */}
          <div className="p-4 rounded-2xl bg-slate-850/70 border border-white/[0.08] flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black text-sm shadow-md ${waiter.avatarBg} text-white border border-white/20`}>
                {waiter.initial}
              </div>
              <div>
                <span className="text-[10px] uppercase font-black text-amber-400/90 block tracking-wider">
                  Assigned Floor Attendant
                </span>
                <span className="text-sm font-black text-white">
                  {waiter.fullName} <span className="font-normal text-xs text-slate-400">({waiter.zone})</span>
                </span>
                <p className="text-[11px] text-slate-400">
                  Dedicated to Table {activeOrder.tableNumber} for prompt service
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => callWaiter('Need Assistance')}
              className="px-3 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-xs font-bold text-slate-200 hover:text-white flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 shrink-0"
            >
              <Bell className="w-3.5 h-3.5 text-amber-400" />
              <span>Call Waiter</span>
            </button>
          </div>

          {/* HIGH-TECH INTERACTIVE TIMELINE */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>Order Preparation Timeline</span>
            </h4>

            <div className="relative pl-6 space-y-6 before:absolute before:left-[1.85rem] before:top-3 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-amber-400 before:via-emerald-400 before:to-slate-800">
              {steps.map((step, idx) => {
                const isPast = idx < currentIndex;
                const isCurrent = idx === currentIndex;

                return (
                  <div key={step.key} className="relative flex items-start gap-4">
                    {/* Status Node Icon */}
                    <div className={`relative z-10 w-9 h-9 rounded-2xl flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                      isCurrent
                        ? 'bg-gradient-to-tr from-amber-400 to-amber-500 text-slate-950 shadow-lg shadow-amber-500/40 ring-4 ring-amber-400/20 scale-110'
                        : isPast
                        ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30'
                        : 'bg-slate-800 text-slate-500 border border-white/10'
                    }`}>
                      {step.icon}
                    </div>

                    {/* Step Description Card */}
                    <div className={`p-3.5 rounded-2xl border transition-all flex-1 ${
                      isCurrent
                        ? 'bg-slate-800/90 border-amber-400/40 shadow-lg'
                        : isPast
                        ? 'bg-slate-850/50 border-white/5 opacity-90'
                        : 'bg-slate-900/30 border-white/5 opacity-50'
                    }`}>
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-xs font-black ${
                          isCurrent ? 'text-amber-400' : isPast ? 'text-slate-200' : 'text-slate-400'
                        }`}>
                          {step.label}
                        </span>
                        
                        {isCurrent && (
                          <span className="text-[10px] font-black uppercase tracking-wider text-amber-950 bg-amber-400 px-2 py-0.5 rounded-full shadow-xs">
                            Active Step
                          </span>
                        )}
                        {isPast && (
                          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded-full border border-emerald-500/30">
                            Completed ✓
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-400 mt-1 leading-snug">
                        {step.desc}
                      </p>
                      
                      <span className="text-[10px] text-slate-500 font-mono block mt-1.5">
                        {step.tag}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ORDERED DISHES MINIATURES FOR THIS TICKET */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                Dishes in Order #{activeOrder.orderNumber} ({activeOrder.items.length})
              </span>
              <span className="text-xs font-bold text-amber-400 font-display">
                Total ₹{activeOrder.total}
              </span>
            </div>

            <div className="divide-y divide-white/[0.06] border border-white/[0.08] rounded-2xl overflow-hidden bg-slate-850/50">
              {activeOrder.items.map((item) => (
                <div key={item.cartItemId} className="p-3 flex items-center justify-between text-xs hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-center gap-3">
                    <img src={item.image} alt={item.name} className="w-11 h-11 rounded-xl object-cover border border-white/10" />
                    <div>
                      <span className="font-bold text-slate-200 block">
                        {item.quantity}× {item.name}
                      </span>
                      <p className="text-[11px] text-slate-400">
                        {item.spiceLevel} spice {item.customizations.length > 0 && `• ${item.customizations.join(', ')}`}
                      </p>
                      {item.price === 0 && (
                        <span className="text-[10px] font-extrabold text-emerald-400 bg-emerald-500/20 px-1.5 py-0.2 rounded mt-0.5 inline-block">
                          ₹0 Free Delay Apology
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="font-black text-amber-400 font-display text-sm">
                    {item.price === 0 ? 'FREE' : `₹${item.price * item.quantity}`}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ALL ORDERS SUMMARY IF MULTIPLE EXIST */}
          {allOrders.length > 1 && (
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-xs font-black text-slate-300">
                <span>Total For All Placed Orders (Table {activeOrder.tableNumber})</span>
                <span className="text-amber-400 font-display text-sm">
                  ₹{allOrders.reduce((sum, o) => sum + o.total, 0)}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                You have {allOrders.length} active tickets submitted to the kitchen during this table session.
              </p>
            </div>
          )}

        </div>

        {/* MODAL BOTTOM BAR */}
        <div className="p-4 sm:p-5 bg-slate-900 border-t border-white/[0.08] flex items-center justify-between gap-2.5 sm:gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-3 rounded-2xl bg-white/[0.06] hover:bg-white/[0.12] text-slate-300 hover:text-white text-xs font-bold transition-all cursor-pointer border border-white/10 active:scale-95"
          >
            Close Tracker
          </button>

          {/* Feedback Button once Food is Ready */}
          {isFoodReady && (
            <button
              type="button"
              onClick={() => {
                if (onOpenFeedback) onOpenFeedback();
                setIsFeedbackOpen(true);
              }}
              className="flex-1 py-3 px-4 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold shadow-sm active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Star className="w-4 h-4 fill-slate-950" />
              <span>Feedback & Ratings</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenReceipt();
            }}
            className={`py-3 px-4 rounded-2xl text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer border ${
              isFoodReady
                ? 'bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 border-white/10 active:scale-95'
                : 'flex-1 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold shadow-sm active:scale-95'
            }`}
          >
            <Receipt className="w-4 h-4" />
            <span>View Receipt</span>
          </button>
        </div>

      </div>

      {/* Customer Rating & Feedback Modal with Celebratory Thank You Card */}
      <CustomerFeedbackModal
        order={activeOrder}
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
        onOpenReceipt={() => {
          setIsFeedbackOpen(false);
          onClose();
          onOpenReceipt();
        }}
        onReturnToMenu={() => {
          setIsFeedbackOpen(false);
          onClose();
        }}
      />
    </div>
  );
};

export default OrderTrackerModal;


import React, { useState, useEffect } from 'react';
import { useKiosk } from '../../context/KioskContext';
import { Order, OrderStatus } from '../../types';
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
  ArrowRight
} from 'lucide-react';
import { getAssignedWaiter } from '../../utils/waiterAssignment';

interface OrderTrackerModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenReceipt: () => void;
  onOpenEntertainment?: () => void;
  onOpenFinishMeal?: () => void;
}

export const OrderTrackerModal: React.FC<OrderTrackerModalProps> = ({ 
  order, 
  isOpen, 
  onClose, 
  onOpenReceipt, 
  onOpenEntertainment
}) => {
  const { t, callWaiter } = useKiosk();

  // Active delivery countdown timer running in real-time
  const [secondsLeft, setSecondsLeft] = useState<number>(() => {
    if (!order) return 0;
    const target = new Date(order.createdAt).getTime() + (order.estimatedPrepTime * 60 * 1000);
    return Math.max(0, Math.floor((target - Date.now()) / 1000));
  });

  useEffect(() => {
    if (!order) return;
    const calculateSeconds = () => {
      if (order.status === 'COMPLETED') return 0;
      const target = new Date(order.createdAt).getTime() + (order.estimatedPrepTime * 60 * 1000);
      return Math.max(0, Math.floor((target - Date.now()) / 1000));
    };

    setSecondsLeft(calculateSeconds());
    const interval = setInterval(() => {
      setSecondsLeft(calculateSeconds());
    }, 1000);

    return () => clearInterval(interval);
  }, [order?.createdAt, order?.estimatedPrepTime, order?.status]);

  if (!isOpen || !order) return null;

  const waiter = getAssignedWaiter(order.tableNumber);

  // Formatting countdown mm:ss
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const formattedCountdown = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  // Progress percentage (elapsed vs total prep time)
  const totalPrepSeconds = Math.max(60, order.estimatedPrepTime * 60);
  const elapsedSeconds = Math.max(0, totalPrepSeconds - secondsLeft);
  const progressPercent = order.status === 'COMPLETED'
    ? 100
    : order.status === 'READY'
    ? 90
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
      desc: `Plated hot with garnishes • Waiter ${waiter.name} bringing to Table ${order.tableNumber}`,
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

  const currentIndex = getStepIndex(order.status);

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
                #{order.orderNumber}
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] uppercase tracking-wider font-extrabold text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/30">
                  Table {order.tableNumber}
                </span>
                <span className="text-xs text-slate-500">•</span>
                <span className="text-xs font-semibold text-slate-300">
                  {order.items.reduce((a, b) => a + b.quantity, 0)} Items
                </span>
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
                    className="text-amber-400 stroke-current transition-all duration-1000 ease-out"
                    strokeWidth="8"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>

                {/* Radar Center Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  {order.status === 'COMPLETED' ? (
                    <>
                      <Sparkles className="w-7 h-7 text-emerald-400 animate-bounce" />
                      <span className="text-[11px] font-black text-emerald-300 uppercase tracking-wider mt-0.5">Ready!</span>
                    </>
                  ) : order.status === 'READY' ? (
                    <>
                      <UtensilsCrossed className="w-7 h-7 text-amber-400 animate-pulse" />
                      <span className="text-[11px] font-black text-amber-300 uppercase tracking-wider mt-0.5">Plated</span>
                    </>
                  ) : (
                    <>
                      <span className="text-2xl font-black text-white font-mono tracking-tight leading-none">
                        {formattedCountdown}
                      </span>
                      <span className="text-[10px] text-amber-400/90 font-black uppercase tracking-wider mt-1">
                        Est. Time
                      </span>
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
                  {order.status === 'COMPLETED'
                    ? 'Dishes Served at Your Table!'
                    : order.status === 'READY'
                    ? `Waiter ${waiter.name} is Delivering to Table ${order.tableNumber}`
                    : 'Artisanal Dishes Being Cooked Fresh'}
                </h4>

                <p className="text-xs text-slate-400 leading-relaxed">
                  Total kitchen prep window: <strong className="text-slate-200">{order.estimatedPrepTime} minutes</strong>. Every dish is cooked to order with hot plating.
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
                  Dedicated to Table {order.tableNumber} for prompt service
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

          {/* ORDERED DISHES MINIATURES */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                Dishes in This Ticket ({order.items.length})
              </span>
              <span className="text-xs font-bold text-amber-400 font-display">
                Total ₹{order.total}
              </span>
            </div>

            <div className="divide-y divide-white/[0.06] border border-white/[0.08] rounded-2xl overflow-hidden bg-slate-850/50">
              {order.items.map((item) => (
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
                    </div>
                  </div>
                  <span className="font-black text-amber-400 font-display text-sm">
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* MODAL BOTTOM BAR */}
        <div className="p-4 sm:p-5 bg-slate-900 border-t border-white/[0.08] flex items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-3 rounded-2xl bg-white/[0.06] hover:bg-white/[0.12] text-slate-300 hover:text-white text-xs font-bold transition-all cursor-pointer border border-white/10 active:scale-95"
          >
            Close Tracker
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenReceipt();
            }}
            className="flex-1 py-3 px-5 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-slate-950 text-xs font-black shadow-lg shadow-amber-500/25 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Receipt className="w-4 h-4 text-slate-950" />
            <span>View Digital Receipt</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default OrderTrackerModal;


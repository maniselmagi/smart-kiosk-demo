import React, { useState, useEffect, useMemo } from 'react';
import { useKiosk } from '../../context/KioskContext';
import { Order, OrderStatus } from '../../types';
import { 
  CheckCircle2, 
  Clock, 
  ChefHat, 
  UtensilsCrossed, 
  Sparkles, 
  X, 
  Star, 
  Receipt,
  User,
  Bell,
  Timer
} from 'lucide-react';
import { getAssignedWaiter } from '../../utils/waiterAssignment';

interface OrderTrackerModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenReceipt: () => void;
  onOpenFeedback: () => void;
}

export const OrderTrackerModal: React.FC<OrderTrackerModalProps> = ({ 
  order, 
  isOpen, 
  onClose, 
  onOpenReceipt, 
  onOpenFeedback 
}) => {
  const { t, updateOrderStatus, callWaiter } = useKiosk();

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
    : Math.min(85, Math.max(10, Math.round((elapsedSeconds / totalPrepSeconds) * 100)));

  const steps: { key: OrderStatus; label: string; icon: React.ReactNode; desc: string }[] = [
    {
      key: 'NEW',
      label: t.statusReceived,
      icon: <CheckCircle2 className="w-5 h-5" />,
      desc: `Confirmed by Supervisor & Waiter ${waiter.name} (${waiter.initial})`,
    },
    {
      key: 'PREPARING',
      label: t.statusPreparing,
      icon: <ChefHat className="w-5 h-5" />,
      desc: 'Chef cooking on line • Delivery timer actively ticking',
    },
    {
      key: 'READY',
      label: t.statusReady,
      icon: <UtensilsCrossed className="w-5 h-5" />,
      desc: `Plated hot • Waiter ${waiter.name} delivering to Table ${order.tableNumber}`,
    },
    {
      key: 'COMPLETED',
      label: t.statusServed,
      icon: <Sparkles className="w-5 h-5" />,
      desc: 'Dishes served at table • Enjoy your meal!',
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Tracker Header */}
        <div className="p-6 bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 text-white flex items-center justify-between border-b border-slate-700/60">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-brand-500/20 text-brand-400 flex items-center justify-center font-black text-base border border-brand-500/30 shadow-inner">
              #{order.orderNumber}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider font-extrabold text-brand-400">
                  Table {order.tableNumber}
                </span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs text-slate-300">
                  {order.items.reduce((a, b) => a + b.quantity, 0)} Items
                </span>
              </div>
              <h3 className="text-xl font-black font-display text-white">
                Live Kitchen Progress
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-700/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Synchronized Kitchen Stepper */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          
          {/* ASSIGNED WAITER INFO HEADER CHIP */}
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs ${waiter.avatarBg}`}>
                {waiter.initial}
              </div>
              <div>
                <span className="text-[10px] uppercase font-black text-slate-400 block tracking-wider">
                  Assigned Table Waiter
                </span>
                <span className="text-xs font-black text-slate-900 dark:text-white">
                  {waiter.fullName} <span className="font-normal text-slate-400">({waiter.zone})</span>
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => callWaiter('Need Assistance')}
              className="px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-[11px] font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Bell className="w-3 h-3 text-amber-500" />
              <span>Call Waiter {waiter.initial}</span>
            </button>
          </div>

          {/* REAL-TIME DELIVER TIME COUNTDOWN CARD */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/15 via-brand-500/10 to-emerald-500/10 border border-amber-500/30 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center">
                  <Timer className="w-5 h-5 animate-spin-slow" />
                </div>
                <div>
                  <span className="text-[10px] font-black text-amber-800 dark:text-amber-400 uppercase tracking-wider block">
                    Live Delivery Time Countdown
                  </span>
                  <div className="flex items-baseline gap-1.5">
                    {order.status === 'COMPLETED' ? (
                      <span className="text-xl font-black text-emerald-600 dark:text-emerald-400 font-display">
                        Delivered & Served!
                      </span>
                    ) : order.status === 'READY' ? (
                      <span className="text-xl font-black text-emerald-600 dark:text-emerald-400 font-display">
                        Plated & Dispatched!
                      </span>
                    ) : (
                      <>
                        <span className="text-2xl font-black text-slate-900 dark:text-white font-mono tracking-tight">
                          {formattedCountdown}
                        </span>
                        <span className="text-xs text-slate-500 font-bold">remaining</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 text-[11px] font-black">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Live Sync
                </span>
                <span className="block text-[10px] text-slate-400 mt-1 font-medium">
                  Est. {order.estimatedPrepTime}m total
                </span>
              </div>
            </div>

            {/* Dynamic Real-Time Progress Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-bold text-slate-500 dark:text-slate-400">
                <span>Cooking Progress</span>
                <span>{progressPercent}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-amber-500 via-brand-500 to-emerald-500 transition-all duration-1000 ease-out"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Stepper Timeline */}
          <div className="relative pl-6 space-y-6 before:absolute before:left-[1.85rem] before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
            {steps.map((step, idx) => {
              const isPast = idx < currentIndex;
              const isCurrent = idx === currentIndex;

              return (
                <div key={step.key} className="relative flex items-start gap-4">
                  {/* Status Node Icon */}
                  <div className={`relative z-10 w-9 h-9 rounded-2xl flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                    isCurrent
                      ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/30 ring-4 ring-brand-100 dark:ring-brand-950 animate-pulse'
                      : isPast
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700'
                  }`}>
                    {step.icon}
                  </div>

                  {/* Step Description */}
                  <div className="pt-0.5 flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className={`text-sm font-black transition-colors ${
                        isCurrent
                          ? 'text-brand-600 dark:text-brand-400'
                          : isPast
                          ? 'text-slate-900 dark:text-slate-100'
                          : 'text-slate-400 dark:text-slate-500'
                      }`}>
                        {step.label}
                      </h4>
                      {isCurrent && (
                        <span className="text-[11px] font-black uppercase text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950 px-2 py-0.5 rounded-full border border-brand-200/50 dark:border-brand-800/50">
                          In Progress
                        </span>
                      )}
                      {isPast && (
                        <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                          Done ✓
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Presenter Quick Kitchen Simulator Buttons */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Presenter Demo Simulator Control:
              </span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500">
                (Simulates Kitchen KDS button clicks)
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => updateOrderStatus(order.id, 'PREPARING')}
                className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all border ${
                  order.status === 'PREPARING'
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-750'
                }`}
              >
                Cook Preparing
              </button>
              <button
                onClick={() => updateOrderStatus(order.id, 'READY')}
                className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all border ${
                  order.status === 'READY'
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-750'
                }`}
              >
                Food Ready
              </button>
              <button
                onClick={() => updateOrderStatus(order.id, 'COMPLETED')}
                className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all border ${
                  order.status === 'COMPLETED'
                    ? 'bg-slate-900 dark:bg-brand-600 text-white border-slate-900 dark:border-brand-600'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-750'
                }`}
              >
                Meal Served
              </button>
            </div>
          </div>

          {/* Ordered Dishes List */}
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-2">
              Cooking for Table {order.tableNumber}:
            </span>
            <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden">
              {order.items.map((item) => (
                <div key={item.cartItemId} className="p-3 bg-white dark:bg-slate-850 flex items-center justify-between text-xs">
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
                  <span className="font-bold text-slate-700 dark:text-slate-200 font-display">
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Modal Bottom Actions */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 shrink-0">
          <button
            onClick={() => {
              onClose();
              onOpenReceipt();
            }}
            className="px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Receipt className="w-4 h-4 text-slate-500" />
            <span>Digital Receipt</span>
          </button>

          <button
            onClick={() => {
              onClose();
              onOpenFeedback();
            }}
            className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-700 hover:to-brand-600 text-white text-xs font-black shadow-md shadow-brand-500/25 active:scale-95 transition-all flex items-center justify-center gap-1.5"
          >
            <Star className="w-4 h-4 text-amber-200 fill-amber-200" />
            <span>Leave Guest Feedback →</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default OrderTrackerModal;

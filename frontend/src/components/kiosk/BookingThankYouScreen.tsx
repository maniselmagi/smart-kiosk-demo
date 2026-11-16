import React, { useEffect, useState } from 'react';
import { useKiosk } from '../../context/KioskContext';
import { allocateTableForGuests } from '../../utils/tableAllocation';
import { HotelBrand } from '../common/HotelBrand';
import royalEmberLogo from '../../assets/royal_ember_logo.jpg';
import { 
  CheckCircle2, 
  Sparkles, 
  Users, 
  User, 
  Phone, 
  MapPin, 
  Clock, 
  ArrowRight, 
  RotateCcw,
  Crown,
  ShieldCheck,
  UtensilsCrossed
} from 'lucide-react';

interface BookingThankYouScreenProps {
  onDone: () => void;
}

export const BookingThankYouScreen: React.FC<BookingThankYouScreenProps> = ({ onDone }) => {
  const { 
    guestCount, 
    customerName, 
    customerPhone, 
    tableNumber,
    isAccessibilityMode,
    t,
    theme
  } = useKiosk();

  // Auto-reset countdown: 15 seconds
  const [countdown, setCountdown] = useState<number>(15);

  const allocation = allocateTableForGuests(guestCount || 4);
  const assignedTable = tableNumber || allocation.tableNumber;
  const assignedWaiter = allocation.waiter;

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onDone();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onDone]);

  return (
    <div 
      className={`min-h-[100dvh] w-full flex flex-col justify-between p-4 sm:p-6 md:p-10 relative overflow-hidden transition-colors duration-300 select-none ${
        isAccessibilityMode
          ? 'bg-slate-950 text-white'
          : 'bg-[#080B11] text-slate-100'
      }`}
    >
      {/* 1. LUXURIOUS AMBIENT LIGHTING BACKGROUND */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-45"
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% 0%, rgba(245, 158, 11, 0.3) 0%, rgba(217, 119, 6, 0.12) 40%, transparent 70%),
            radial-gradient(circle at 15% 90%, rgba(16, 185, 129, 0.15) 0%, transparent 45%),
            radial-gradient(circle at 85% 85%, rgba(217, 119, 6, 0.15) 0%, transparent 45%)
          `
        }}
      />

      {/* Decorative Golden Ambient Sparks */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* 2. TOP HEADER BRANDING */}
      <header className="relative z-10 w-full max-w-4xl mx-auto flex items-center justify-between pb-4 border-b border-white/10">
        <HotelBrand size="md" />

        {/* Auto-Reset Pill Timer */}
        <div className="flex items-center gap-2.5 bg-slate-900/80 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-amber-500/20 text-xs sm:text-sm font-semibold text-amber-300">
          <Clock className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
          <span>{t.resettingInSeconds || 'Screen resetting in'}: <strong className="text-white text-base font-bold">{countdown}s</strong></span>
        </div>
      </header>

      {/* 3. CENTRAL CELEBRATION & TABLE CONFIRMATION CARD */}
      <main className="relative z-10 w-full max-w-3xl mx-auto my-auto py-6 sm:py-8 flex flex-col items-center text-center">
        {/* Glowing Success Badge */}
        <div className="relative mb-5">
          <div className="absolute inset-0 bg-emerald-500/30 rounded-full blur-xl scale-125 animate-pulse" />
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-emerald-600 via-emerald-500 to-amber-400 p-[3px] shadow-2xl shadow-emerald-500/30">
            <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12 text-emerald-400 stroke-[2.5]" />
            </div>
          </div>
          <div className="absolute -top-1 -right-1 bg-amber-500 text-slate-950 p-1.5 rounded-full shadow-lg">
            <Crown className="w-4 h-4 fill-slate-950" />
          </div>
        </div>

        {/* Multilingual Headline */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-2 leading-tight">
          {t.thankYouBookingTitle || 'Thank You for Your Booking!'}
        </h1>
        <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto font-medium mb-8">
          {t.thankYouBookingSubtitle || 'Your table reservation is confirmed. We are excited to serve you a royal dining experience.'}
        </p>

        {/* PRIMARY HIGHLIGHT: ASSIGNED TABLE CARD */}
        <div className="w-full bg-gradient-to-b from-slate-900/90 to-slate-950/95 backdrop-blur-xl rounded-3xl border-2 border-amber-500/40 p-6 sm:p-8 shadow-2xl shadow-amber-500/10 mb-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 border-b border-white/10">
            {/* Table Number with Royal Glow */}
            <div className="flex items-center gap-5 text-left">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 flex flex-col items-center justify-center text-slate-950 shadow-xl shadow-amber-500/30 font-black">
                <span className="text-[10px] tracking-widest uppercase font-extrabold text-slate-900/80">TABLE</span>
                <span className="text-3xl sm:text-4xl leading-none">#{assignedTable}</span>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-bold tracking-wider uppercase">
                    {allocation.category}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                  <span>{allocation.ambienceBadge}</span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 flex items-center gap-1.5 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>{allocation.zoneDescription}</span>
                </p>
              </div>
            </div>

            {/* Guest Count Pill */}
            <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl px-5 py-3 text-center sm:text-right shrink-0">
              <div className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-0.5">
                {t.partyGuestsLabel || 'Party Size'}
              </div>
              <div className="text-xl sm:text-2xl font-extrabold text-amber-400 flex items-center justify-center sm:justify-end gap-1.5">
                <Users className="w-5 h-5" />
                <span>{guestCount || 4} Guests</span>
              </div>
            </div>
          </div>

          {/* GUEST & WAITER DETAILS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 text-left">
            {/* Guest Name */}
            <div className="bg-slate-900/60 border border-white/5 rounded-2xl p-4">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                <User className="w-3.5 h-3.5 text-amber-400" />
                <span>{t.primaryGuestLabel || 'Primary Guest'}</span>
              </div>
              <div className="text-base font-bold text-white truncate">
                {customerName || 'Valued Royal Guest'}
              </div>
            </div>

            {/* Phone */}
            <div className="bg-slate-900/60 border border-white/5 rounded-2xl p-4">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <span>{t.contactNumberLabel || 'Contact Mobile'}</span>
              </div>
              <div className="text-base font-bold text-white font-mono">
                {customerPhone || '+91 98765 43210'}
              </div>
            </div>

            {/* Assigned Floor Attendant */}
            <div className="bg-slate-900/60 border border-white/5 rounded-2xl p-4">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>{t.assignedFloorServerLabel || 'Assigned Floor Attendant'}</span>
              </div>
              <div className="flex items-center gap-2">
                {assignedWaiter.avatarUrl ? (
                  <img 
                    src={assignedWaiter.avatarUrl} 
                    alt={assignedWaiter.name} 
                    className="w-7 h-7 rounded-full object-cover border border-amber-400/40"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-400 font-bold text-xs flex items-center justify-center border border-amber-400/40">
                    {assignedWaiter.initial}
                  </div>
                )}
                <span className="text-base font-bold text-white truncate">
                  {assignedWaiter.fullName || assignedWaiter.name}
                </span>
              </div>
            </div>
          </div>

          {/* Notice to Customer */}
          <div className="mt-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs sm:text-sm text-amber-200/90 flex items-center justify-center gap-2.5">
            <UtensilsCrossed className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{t.proceedToTablePrompt || 'Please proceed to your allocated table. Your attendant will welcome you immediately.'}</span>
          </div>
        </div>
      </main>

      {/* 4. BOTTOM ACTION BUTTONS */}
      <footer className="relative z-10 w-full max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10">
        <button
          type="button"
          onClick={onDone}
          className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-slate-700/50 flex items-center justify-center gap-2 font-bold text-sm transition-all active:scale-95 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>{t.bookAnotherTable || 'Book Another Table'}</span>
        </button>

        <button
          type="button"
          onClick={onDone}
          className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-base flex items-center justify-center gap-2.5 shadow-xl shadow-amber-500/25 transition-all active:scale-95 cursor-pointer"
        >
          <span>{t.doneNextGuestBtn || 'Done / Next Guest'}</span>
          <ArrowRight className="w-5 h-5 stroke-[2.5]" />
        </button>
      </footer>
    </div>
  );
};

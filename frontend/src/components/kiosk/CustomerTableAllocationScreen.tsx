import React, { useState, useEffect } from 'react';
import { useKiosk } from '../../context/KioskContext';
import { HotelBrand } from '../common/HotelBrand';
import { allocateTableForGuests } from '../../utils/tableAllocation';
import { 
  Users, 
  User, 
  Phone, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  ArrowLeft, 
  Check, 
  Compass, 
  ShieldCheck,
  Plus,
  Minus
} from 'lucide-react';

interface CustomerTableAllocationScreenProps {
  onBackToLanguage: () => void;
  onConfirmAllocation: () => void;
}

export const CustomerTableAllocationScreen: React.FC<CustomerTableAllocationScreenProps> = ({
  onBackToLanguage,
  onConfirmAllocation,
}) => {
  const { 
    guestCount, 
    setGuestCount, 
    customerName, 
    setCustomerName, 
    customerPhone, 
    setCustomerPhone,
    setTableNumber,
    isAccessibilityMode,
    showToast
  } = useKiosk();

  // Local state for interactive editing before confirmation
  const [localCount, setLocalCount] = useState<number>(guestCount || 4);
  const [localName, setLocalName] = useState<string>(customerName || '');
  const [localPhone, setLocalPhone] = useState<string>(customerPhone || '');
  const [isAllocatingAnimation, setIsAllocatingAnimation] = useState<boolean>(false);

  // Compute table allocation based on local count
  const allocation = allocateTableForGuests(localCount);

  // Quick preset options
  const countPresets = [
    { count: 2, label: '1-2 Duo', sub: 'Couple / Solo', icon: '👥' },
    { count: 4, label: '3-4 Family', sub: 'Standard Family', icon: '👨‍👩‍👧‍👦' },
    { count: 6, label: '5-6 Large', sub: 'Gathering', icon: '👨‍👩‍👧‍👦👨‍👧' },
    { count: 8, label: '7-8 Feast', sub: 'Celebration', icon: '👑👨‍👩‍👦‍👦' },
    { count: 10, label: '10+ Royal', sub: 'Banquet Group', icon: '🎉👑' }
  ];

  const handleCountChange = (newCount: number) => {
    const clamped = Math.max(1, Math.min(16, newCount));
    if (clamped !== localCount) {
      setIsAllocatingAnimation(true);
      setLocalCount(clamped);
      setTimeout(() => setIsAllocatingAnimation(false), 250);
    }
  };

  const handleProceed = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    // Save details to context
    setGuestCount(localCount);
    setCustomerName(localName.trim() || 'Valued Guest');
    setCustomerPhone(localPhone.trim());
    setTableNumber(allocation.tableNumber);

    showToast(`Table ${allocation.tableNumber} allocated for your party of ${localCount}!`);
    onConfirmAllocation();
  };

  return (
    <div 
      className={`min-h-[calc(100vh-45px)] flex flex-col justify-between p-4 sm:p-6 md:p-8 relative overflow-hidden transition-colors duration-300 ${
        isAccessibilityMode
          ? 'bg-slate-950 text-white'
          : 'bg-gradient-to-b from-amber-50/50 via-white to-amber-100/20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-slate-900 dark:text-slate-100'
      }`}
    >
      {/* Background Glow Accents */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[350px] bg-amber-500/10 dark:bg-amber-400/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* TOP BAR: Brand & Step Indicator */}
      <div className="w-full max-w-5xl mx-auto flex items-center justify-between pb-4 border-b border-slate-200/80 dark:border-slate-800 z-10">
        <button
          onClick={onBackToLanguage}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 active:scale-95 transition-all cursor-pointer shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Change Language</span>
        </button>

        <HotelBrand size="sm" align="center" showTagline={false} showDescriptor={false} />

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-400 text-xs font-black">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Step 2 of 2: Table Allocation</span>
        </div>
      </div>

      {/* CENTER CONTENT CONTAINER */}
      <div className="w-full max-w-5xl mx-auto my-auto py-4 z-10">
        
        {/* Header Title & Subtitle */}
        <div className="text-center mb-6 space-y-1">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs font-black uppercase tracking-wider">
            <Compass className="w-3.5 h-3.5 text-amber-600" />
            <span>Smart Family Seating Assistant</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black font-display tracking-tight text-slate-900 dark:text-white">
            Guest Details & Table Allocation
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium max-w-xl mx-auto">
            Select how many guests are dining so our intelligent system can allocate the best-suited table and dedicated section attendant for your family.
          </p>
        </div>

        {/* 2-COLUMN GRID: Left = Input & Person Count | Right = Live Allocated Table Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          
          {/* LEFT: CUSTOMER INFO & GUEST COUNT SELECTOR (7 Cols) */}
          <div className="lg:col-span-7 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-5 flex flex-col justify-between">
            
            {/* 1. Guest Information Inputs */}
            <div className="space-y-3">
              <span className="text-xs font-black uppercase tracking-wider text-slate-400 block flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-amber-500" />
                <span>1. Guest / Family Contact (Optional)</span>
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                    Your Name / Family Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={localName}
                      onChange={(e) => setLocalName(e.target.value)}
                      placeholder="e.g. Rajesh Kumar / Mani"
                      className="w-full pl-9 pr-3 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                    Mobile / WhatsApp (For Digital Bill)
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      value={localPhone}
                      onChange={(e) => setLocalPhone(e.target.value)}
                      placeholder="e.g. 98765 43210"
                      className="w-full pl-9 pr-3 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Interactive Person Count Selector */}
            <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-amber-500" />
                  <span>2. How Many Persons are Dining?</span>
                </span>
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                  {allocation.ambienceBadge}
                </span>
              </div>

              {/* Main Stepper Control */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-brand-500/10 to-orange-500/10 border-2 border-amber-500/30 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl select-none">{allocation.familyIcon}</span>
                  <div>
                    <span className="font-black text-lg text-slate-900 dark:text-white font-display block">
                      {localCount} {localCount === 1 ? 'Person' : 'Guests / Persons'}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      {allocation.suitableFor}
                    </span>
                  </div>
                </div>

                {/* Plus / Minus Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleCountChange(localCount - 1)}
                    disabled={localCount <= 1}
                    className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-bold text-lg hover:bg-slate-100 dark:hover:bg-slate-700 active:scale-95 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer shadow-xs"
                    aria-label="Decrease guest count"
                  >
                    <Minus className="w-4 h-4" />
                  </button>

                  <span className="w-10 text-center font-black text-xl font-mono text-amber-600 dark:text-amber-400">
                    {localCount}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleCountChange(localCount + 1)}
                    disabled={localCount >= 16}
                    className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 font-bold text-lg hover:bg-amber-400 active:scale-95 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer flex items-center justify-center shadow-md shadow-amber-500/30"
                    aria-label="Increase guest count"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Quick Preset Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
                {countPresets.map((preset) => {
                  const isSelected = 
                    (preset.count === 2 && localCount <= 2) ||
                    (preset.count === 4 && localCount >= 3 && localCount <= 4) ||
                    (preset.count === 6 && localCount >= 5 && localCount <= 6) ||
                    (preset.count === 8 && localCount >= 7 && localCount <= 8) ||
                    (preset.count === 10 && localCount >= 9);

                  return (
                    <button
                      key={preset.count}
                      type="button"
                      onClick={() => handleCountChange(preset.count)}
                      className={`p-2.5 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md scale-102 font-black'
                          : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-base">{preset.icon}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                      <span className="text-xs font-black leading-tight block">
                        {preset.label}
                      </span>
                      <span className={`text-[10px] block opacity-80 ${isSelected ? 'text-slate-950' : 'text-slate-400'}`}>
                        {preset.sub}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* RIGHT: SMART TABLE ALLOCATION DECISION CARD (5 Cols) */}
          <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950 text-white rounded-3xl p-5 sm:p-6 border-2 border-amber-500/40 shadow-2xl flex flex-col justify-between relative overflow-hidden">
            
            {/* Top Pill: Live Allocation Decision */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-400">
                  Allocated Decision Live
                </span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-amber-300 text-[10px] font-bold">
                Capacity: {allocation.capacity} Seats
              </span>
            </div>

            {/* Main Table Allocation Highlight */}
            <div className={`py-4 space-y-3 transition-transform duration-200 ${isAllocatingAnimation ? 'scale-98 opacity-75' : 'scale-100 opacity-100'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block">
                    Assigned Dining Table
                  </span>
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-4xl sm:text-5xl font-black font-display text-amber-400 tracking-tight drop-shadow-md">
                      TABLE {allocation.tableNumber}
                    </h3>
                  </div>
                </div>

                <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex flex-col items-center justify-center text-center shadow-inner">
                  <span className="text-2xl">{allocation.familyIcon}</span>
                  <span className="text-[10px] font-black text-amber-300 uppercase mt-0.5">{localCount} Guests</span>
                </div>
              </div>

              {/* Table Category & Location */}
              <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-1">
                <span className="font-extrabold text-xs text-white block">
                  {allocation.category}
                </span>
                <p className="text-[11px] text-slate-300 flex items-center gap-1">
                  <Compass className="w-3 h-3 text-amber-400 shrink-0" />
                  <span>{allocation.zoneDescription}</span>
                </p>
              </div>

              {/* Assigned Section Waiter Card */}
              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs shadow-md ${allocation.waiter.avatarBg}`}>
                    {allocation.waiter.initial}
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-amber-400 block">
                      Dedicated Table Attendant
                    </span>
                    <span className="font-black text-xs text-white">
                      {allocation.waiter.fullName}
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      {allocation.waiter.zone} • {allocation.waiter.role}
                    </span>
                  </div>
                </div>

                <div className="px-2 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 text-[10px] font-black border border-emerald-500/30 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>On Duty</span>
                </div>
              </div>

              {/* Features List */}
              <div className="grid grid-cols-2 gap-1.5 pt-1">
                {allocation.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 text-[11px] text-slate-300 font-medium">
                    <CheckCircle2 className="w-3 h-3 text-amber-400 shrink-0" />
                    <span className="truncate">{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Confirm Table & Start Ordering CTA */}
            <div className="pt-3 border-t border-slate-800 space-y-2">
              <button
                type="button"
                onClick={handleProceed}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <span>Confirm Table {allocation.tableNumber} & Start Ordering</span>
                <ArrowRight className="w-5 h-5 stroke-[2.5]" />
              </button>

              <p className="text-[10px] text-center text-slate-400">
                You will proceed directly to the gourmet menu at Table {allocation.tableNumber}.
              </p>
            </div>

          </div>

        </div>

      </div>

      {/* FOOTER */}
      <div className="w-full max-w-5xl mx-auto flex items-center justify-between text-xs text-slate-400 dark:text-slate-500 pt-3 border-t border-slate-200/60 dark:border-slate-800 z-10">
        <span>Royal Ember Smart Table-Side Self-Ordering Kiosk</span>
        <span>Table Allocation Engine v2.4</span>
      </div>
    </div>
  );
};

export default CustomerTableAllocationScreen;

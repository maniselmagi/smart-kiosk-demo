import React, { useState } from 'react';
import { useKiosk } from '../../context/KioskContext';
import { HotelBrand } from '../common/HotelBrand';
import { allocateTableForGuests } from '../../utils/tableAllocation';
import royalEmberLogo from '../../assets/royal_ember_logo.jpg';
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
  Minus,
  Crown
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
      setTimeout(() => setIsAllocatingAnimation(false), 200);
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
          : 'bg-[#080B11] text-slate-100'
      }`}
    >
      {/* 1. LUXURIOUS RADIAL AMBIENT LIGHTING */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% -10%, rgba(245, 158, 11, 0.28) 0%, rgba(217, 119, 6, 0.12) 35%, transparent 70%),
            radial-gradient(circle at 15% 90%, rgba(234, 88, 12, 0.15) 0%, transparent 45%),
            radial-gradient(circle at 85% 85%, rgba(217, 119, 6, 0.15) 0%, transparent 45%)
          `
        }}
      />

      {/* Subtle Luxury Dot Texture */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage: `radial-gradient(rgba(245, 158, 11, 0.8) 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }}
      />

      {/* 2. TOP BAR: Back button & Stepper */}
      <div className="w-full max-w-5xl mx-auto flex items-center justify-between pb-4 border-b border-slate-800 z-10">
        <button
          onClick={onBackToLanguage}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-xs font-bold text-slate-300 hover:text-white hover:border-amber-400/60 active:scale-95 transition-all cursor-pointer shadow-xs"
        >
          <ArrowLeft className="w-4 h-4 text-amber-400" />
          <span>Change Language</span>
        </button>

        {/* Small Centered Brand Emblem */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl overflow-hidden border border-amber-400/60 shadow-sm bg-black">
            <img src={royalEmberLogo} alt="Royal Ember" className="w-full h-full object-cover" />
          </div>
          <span className="font-royal text-sm font-black tracking-widest uppercase text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-yellow-400">
            Royal Ember
          </span>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-xs font-black shadow-[0_0_15px_rgba(245,158,11,0.15)]">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Step 2 of 2: Table Allocation</span>
        </div>
      </div>

      {/* 3. CENTER CONTENT CONTAINER */}
      <div className="w-full max-w-5xl mx-auto my-auto py-4 z-10">
        
        {/* Header Title & Subtitle */}
        <div className="text-center mb-6 space-y-1.5">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-black uppercase tracking-wider">
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span>Intelligent Family Seating Concierge</span>
          </div>
          
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black font-display tracking-tight text-white">
            Guest Details &amp; Smart Table Allocation
          </h2>
          
          <p className="text-xs sm:text-sm text-slate-400 font-medium max-w-xl mx-auto">
            Tell us how many guests are dining so our concierge allocates the most suitable dining table and dedicated section attendant for your family.
          </p>
        </div>

        {/* 2-COLUMN SHOWCASE: Left = Guest Inputs & Stepper | Right = Live Decision Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          
          {/* LEFT: CUSTOMER INFO & GUEST COUNT (7 Cols) */}
          <div className="lg:col-span-7 bg-slate-900/80 backdrop-blur-2xl rounded-3xl p-5 sm:p-6 border-2 border-amber-500/30 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8),0_0_30px_rgba(245,158,11,0.08)] space-y-5 flex flex-col justify-between">
            
            {/* 1. Guest Information Inputs */}
            <div className="space-y-3">
              <span className="text-xs font-black uppercase tracking-wider text-amber-400 block flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                <span>1. Guest / Family Information (Optional)</span>
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                    Your Name / Family Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={localName}
                      onChange={(e) => setLocalName(e.target.value)}
                      placeholder="e.g. Mani S. / Rajesh Kumar"
                      className="w-full pl-9 pr-3 py-2.5 rounded-2xl bg-slate-800/80 border border-slate-700 text-xs font-bold text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                    Mobile / WhatsApp (For Digital Bill)
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      value={localPhone}
                      onChange={(e) => setLocalPhone(e.target.value)}
                      placeholder="e.g. 98765 43210"
                      className="w-full pl-9 pr-3 py-2.5 rounded-2xl bg-slate-800/80 border border-slate-700 text-xs font-bold text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Interactive Person Count Selector */}
            <div className="space-y-3 pt-3 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" />
                  <span>2. How Many Persons are Dining?</span>
                </span>
                <span className="text-xs font-bold text-amber-300 px-2 py-0.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  {allocation.ambienceBadge}
                </span>
              </div>

              {/* Main Stepper Control */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-amber-600/10 to-slate-900 border-2 border-amber-500/30 flex items-center justify-between gap-3 shadow-inner">
                <div className="flex items-center gap-3">
                  <span className="text-3xl select-none drop-shadow-sm">{allocation.familyIcon}</span>
                  <div>
                    <span className="font-black text-xl text-white font-display block">
                      {localCount} {localCount === 1 ? 'Person' : 'Guests / Persons'}
                    </span>
                    <span className="text-[11px] text-slate-300">
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
                    className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-600 flex items-center justify-center font-bold text-lg active:scale-95 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer shadow-xs"
                    aria-label="Decrease guest count"
                  >
                    <Minus className="w-4 h-4" />
                  </button>

                  <span className="w-10 text-center font-black text-2xl font-mono text-amber-400">
                    {localCount}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleCountChange(localCount + 1)}
                    disabled={localCount >= 16}
                    className="w-10 h-10 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black text-lg hover:from-amber-300 hover:to-yellow-400 active:scale-95 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer flex items-center justify-center shadow-md shadow-amber-500/30"
                    aria-label="Increase guest count"
                  >
                    <Plus className="w-4 h-4 stroke-[3]" />
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
                          ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 border-amber-300 shadow-lg shadow-amber-500/30 scale-102 font-black ring-2 ring-amber-400/50'
                          : 'bg-slate-800/60 text-slate-300 border-slate-700/80 hover:bg-slate-800 hover:border-amber-400/40'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-base">{preset.icon}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3.5]" />}
                      </div>
                      <span className="text-xs font-black leading-tight block">
                        {preset.label}
                      </span>
                      <span className={`text-[10px] block ${isSelected ? 'text-slate-900 font-bold' : 'text-slate-400'}`}>
                        {preset.sub}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* RIGHT: SMART TABLE ALLOCATION DECISION CARD (5 Cols) */}
          <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/80 text-white rounded-3xl p-5 sm:p-6 border-2 border-amber-400/50 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.9),0_0_35px_rgba(245,158,11,0.2)] flex flex-col justify-between relative overflow-hidden">
            
            {/* Top Pill: Live Allocation Decision */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-400">
                  Allocated Decision Live
                </span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-amber-300 text-[10px] font-bold border border-amber-400/20">
                Capacity: {allocation.capacity} Seats
              </span>
            </div>

            {/* Main Table Allocation Highlight */}
            <div className={`py-4 space-y-3 transition-transform duration-200 ${isAllocatingAnimation ? 'scale-98 opacity-75' : 'scale-100 opacity-100'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-amber-400/90 uppercase tracking-widest block">
                    Assigned Dining Table
                  </span>
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-4xl sm:text-5xl font-black font-display text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-400 tracking-tight drop-shadow-[0_2px_15px_rgba(245,158,11,0.4)]">
                      TABLE {allocation.tableNumber}
                    </h3>
                  </div>
                </div>

                <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border-2 border-amber-400/50 flex flex-col items-center justify-center text-center shadow-inner">
                  <span className="text-2xl">{allocation.familyIcon}</span>
                  <span className="text-[10px] font-black text-amber-300 uppercase mt-0.5">{localCount} Guests</span>
                </div>
              </div>

              {/* Table Category & Location */}
              <div className="p-3 rounded-2xl bg-slate-800/90 border border-slate-700/80 space-y-1">
                <span className="font-extrabold text-xs text-white block">
                  {allocation.category}
                </span>
                <p className="text-[11px] text-slate-300 flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>{allocation.zoneDescription}</span>
                </p>
              </div>

              {/* Assigned Section Waiter Card */}
              <div className="p-3 rounded-2xl bg-amber-500/15 border border-amber-400/40 flex items-center justify-between">
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
                  <span>Ready</span>
                </div>
              </div>

              {/* Features List */}
              <div className="grid grid-cols-2 gap-1.5 pt-1">
                {allocation.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 text-[11px] text-slate-300 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
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
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-sm shadow-[0_10px_35px_rgba(245,158,11,0.4)] hover:shadow-[0_15px_45px_rgba(245,158,11,0.6)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2.5 cursor-pointer group"
              >
                <span>Confirm Table {allocation.tableNumber} &amp; Start Ordering</span>
                <ArrowRight className="w-5 h-5 stroke-[2.5] group-hover:translate-x-1 transition-transform" />
              </button>

              <p className="text-[10px] text-center text-slate-400">
                Proceed directly to the gourmet menu at Table {allocation.tableNumber}.
              </p>
            </div>

          </div>

        </div>

      </div>

      {/* 4. FOOTER */}
      <div className="w-full max-w-5xl mx-auto flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-800/80 z-10">
        <span>Royal Ember Smart Table-Side Self-Ordering Kiosk</span>
        <span>Table Allocation Concierge v2.4</span>
      </div>
    </div>
  );
};

export default CustomerTableAllocationScreen;

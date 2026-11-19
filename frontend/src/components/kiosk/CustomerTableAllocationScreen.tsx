import React, { useState, useEffect, useMemo } from 'react';
import { useKiosk } from '../../context/KioskContext';
import { HotelBrand } from '../common/HotelBrand';
import { getLocalizedTableAllocation } from '../../utils/tableAllocation';
import { getLocalizedWaiterName } from '../../utils/waiterAssignment';
import { tableBookingService, AVAILABLE_TIME_SLOTS, TimeSlotConfig } from '../../services/tableBookingService';
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
  Crown,
  Clock,
  Calendar,
  Ticket,
  AlertTriangle,
  Lock,
  Flame,
  CheckCheck,
  Database
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
    bookingTicket,
    setBookingTicket,
    selectedTimeSlot,
    setSelectedTimeSlot,
    selectedBookingDate,
    setSelectedBookingDate,
    isAccessibilityMode,
    language,
    showToast,
    t
  } = useKiosk();

  // Local state for interactive editing before confirmation
  const [localCount, setLocalCount] = useState<number>(guestCount || 4);
  const [localName, setLocalName] = useState<string>(customerName || '');
  const [localPhone, setLocalPhone] = useState<string>(customerPhone || '');
  const [localSlot, setLocalSlot] = useState<string>(selectedTimeSlot || '07:45 PM');
  
  // Date options: Today vs Tomorrow
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const tomorrowStr = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  }, []);
  const [localDate, setLocalDate] = useState<string>(selectedBookingDate || todayStr);

  // Meal Category Filter for Slots: 'all' | 'lunch' | 'tea' | 'dinner'
  const [activeMealFilter, setActiveMealFilter] = useState<'all' | 'lunch' | 'tea' | 'dinner'>('all');

  // Form validation errors
  const [nameError, setNameError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [collisionWarning, setCollisionWarning] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [ticketNumber, setTicketNumber] = useState<string>(bookingTicket || 'RE-TB-7241');

  // Generate ticket number if needed
  useEffect(() => {
    if (!bookingTicket || bookingTicket === 'RE-TB-7241') {
      const generated = tableBookingService.generateTicketNumber();
      setTicketNumber(generated);
      setBookingTicket(generated);
    } else {
      setTicketNumber(bookingTicket);
    }
  }, [bookingTicket, setBookingTicket]);

  // Compute table allocation based on local count and active language
  const allocation = getLocalizedTableAllocation(localCount, language);
  const currentTableNum = allocation.tableNumber;

  // Real-time table booking collision check (like cinema / movie ticket booking)
  const slotCollisionStatus = useMemo(() => {
    const statusMap: Record<string, { isBooked: boolean; customerName?: string }> = {};
    AVAILABLE_TIME_SLOTS.forEach((slot) => {
      const check = tableBookingService.isSlotBooked(currentTableNum, localDate, slot.time);
      statusMap[slot.time] = {
        isBooked: check.isBooked,
        customerName: check.existingBooking?.customerName
      };
    });
    return statusMap;
  }, [currentTableNum, localDate]);

  // Quick preset count options
  const countPresets = [
    { count: 2, label: t.coupleDuo || '1-2 Duo', sub: t.coupleDuoSub || 'Couple / Solo', icon: '👥' },
    { count: 4, label: t.standardFamily || '3-4 Family', sub: t.standardFamilySub || 'Standard Family', icon: '👨‍👩‍👧‍👦' },
    { count: 6, label: t.largeGroup || '5-6 Large', sub: t.gatheringSub || 'Gathering', icon: '👨‍👩‍👧‍👦👨‍👧' },
    { count: 8, label: t.celebrationFeast || '7-8 Feast', sub: t.celebrationSub || 'Celebration', icon: '👑👨‍👩‍👦‍👦' },
    { count: 10, label: t.royalBanquet || '10+ Royal', sub: t.royalBanquetSub || 'Banquet Group', icon: '🎉👑' }
  ];

  const handleCountChange = (newCount: number) => {
    const clamped = Math.max(1, Math.min(16, newCount));
    setLocalCount(clamped);
    setCollisionWarning(null);
  };

  // Select a time slot with movie-ticket collision check
  const handleSelectSlot = (slot: TimeSlotConfig) => {
    const collision = slotCollisionStatus[slot.time];
    if (collision?.isBooked) {
      const alertMsg = (t.slotAlreadyBookedAlert || 'This timing slot is already booked for Table {table}. Please select another timing!')
        .replace('{table}', `#${currentTableNum}`);
      setCollisionWarning(`${slot.time} - ${alertMsg}`);
      showToast(`⚠️ ${slot.time} is already booked for Table #${currentTableNum}!`);
      return;
    }

    setCollisionWarning(null);
    setLocalSlot(slot.time);
  };

  // Validate form fields
  const validateForm = (): boolean => {
    let isValid = true;
    setNameError(null);
    setPhoneError(null);
    setCollisionWarning(null);

    const trimmedName = localName.trim();
    if (!trimmedName) {
      setNameError(t.nameRequiredError || 'Please enter your full name to reserve a table.');
      isValid = false;
    }

    const cleanPhone = localPhone.replace(/\D/g, '');
    if (!cleanPhone) {
      setPhoneError(t.phoneRequiredError || 'Mobile number is required for booking confirmation.');
      isValid = false;
    } else if (cleanPhone.length < 10) {
      setPhoneError(t.phoneLengthError || 'Please enter a valid 10-digit mobile number.');
      isValid = false;
    }

    // Check if currently chosen slot is booked
    if (slotCollisionStatus[localSlot]?.isBooked) {
      setCollisionWarning(`⚠️ ${localSlot} is already booked. Please choose an available timing!`);
      isValid = false;
    }

    return isValid;
  };

  const handleProceed = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // 1. Save to context
      setGuestCount(localCount);
      setCustomerName(localName.trim());
      setCustomerPhone(localPhone.trim());
      setTableNumber(currentTableNum);
      setSelectedTimeSlot(localSlot);
      setSelectedBookingDate(localDate);
      setBookingTicket(ticketNumber);

      // 2. Persist booking to Cloud PostgreSQL & LocalStorage via TableBookingService
      const slotConfig = AVAILABLE_TIME_SLOTS.find((s) => s.time === localSlot);
      const result = await tableBookingService.createBooking({
        customerName: localName.trim(),
        customerPhone: localPhone.trim(),
        tableNumber: currentTableNum,
        guestCount: localCount,
        bookingDate: localDate,
        timeSlot: localSlot,
        mealType: slotConfig?.meal || 'dinner',
        assignedServer: getLocalizedWaiterName(allocation.waiter.name, language),
        sectionLabel: allocation.category,
        ticketNumber: ticketNumber
      });

      if (!result.success) {
        if (result.error === 'SLOT_ALREADY_BOOKED') {
          setCollisionWarning(`⚠️ ${localSlot} was just booked by another customer! Please select another timing.`);
          showToast(`This timing is already booked. Please choose another.`);
          setIsSubmitting(false);
          return;
        }
      }

      showToast(`🎉 Ticket #${ticketNumber} confirmed! Table #${currentTableNum} reserved for ${localSlot}.`);
      onConfirmAllocation();
    } catch (err) {
      console.warn('Booking save error:', err);
      onConfirmAllocation();
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filtered list of time slots
  const filteredSlots = useMemo(() => {
    if (activeMealFilter === 'all') return AVAILABLE_TIME_SLOTS;
    return AVAILABLE_TIME_SLOTS.filter((s) => s.meal === activeMealFilter);
  }, [activeMealFilter]);

  return (
    <div 
      className={`min-h-[100dvh] w-full flex flex-col justify-between p-4 sm:p-6 md:p-8 relative overflow-hidden transition-colors duration-300 select-none ${
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

      {/* Decorative ambient blurred orbs */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* 2. TOP VIP HEADER WITH STEP INDICATOR & LIVE TICKET NUMBER */}
      <header className="relative z-10 w-full max-w-6xl mx-auto flex items-center justify-between pb-4 border-b border-white/10 gap-4">
        {/* Back Button */}
        <button
          type="button"
          onClick={onBackToLanguage}
          className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 text-xs sm:text-sm font-bold transition-all active:scale-95 cursor-pointer shadow-sm"
          title={t.changeLanguageBtn || 'Change Language'}
        >
          <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
          <span className="hidden sm:inline">{t.changeLanguageBtn || 'Change Language'}</span>
        </button>

        {/* Center Brand Crest */}
        <div className="flex items-center gap-3">
          <HotelBrand size="sm" showDescriptor={false} />
        </div>

        {/* Right: Booking Ticket Badge */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-gradient-to-r from-amber-500/20 to-amber-600/30 border border-amber-500/40 shadow-lg shadow-amber-500/10">
            <Ticket className="w-4 h-4 text-amber-400" />
            <div className="text-left">
              <span className="text-[10px] uppercase font-bold text-slate-400 block leading-none">
                {t.bookingTicketNumber || 'Booking Ticket'}
              </span>
              <span className="text-xs sm:text-sm font-extrabold text-amber-300 font-mono tracking-wider">
                #{ticketNumber}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* 3. MAIN INTERACTIVE CONTENT GRID */}
      <main className="relative z-10 w-full max-w-6xl mx-auto my-auto py-5 flex flex-col gap-6">
        
        {/* Page Title & Subtitle */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.stepTableAllocation || 'Step 2 of 2: Table & Timing Reservation'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">
            {t.tableBookingTitle || 'Guest Details & Smart Table Allocation'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto mt-1 font-medium">
            {t.tableBookingSubtitle || 'Reserve your luxury dining table, select preferred showtime timing, and receive your instant booking ticket.'}
          </p>
        </div>

        {/* Collision Warning Banner if booked slot is clicked */}
        {collisionWarning && (
          <div className="w-full bg-rose-500/20 border-2 border-rose-500/60 text-rose-200 px-4 py-3 rounded-2xl flex items-center justify-between gap-3 text-xs sm:text-sm animate-in shake duration-300">
            <div className="flex items-center gap-2.5 font-bold">
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
              <span>{collisionWarning}</span>
            </div>
            <button
              onClick={() => setCollisionWarning(null)}
              className="text-rose-400 hover:text-white font-black text-xs uppercase px-2 py-1 rounded bg-rose-950/60"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* TWO-COLUMN LAYOUT: Left (Inputs & Timing) | Right (Assigned Table Ticket Card) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT COLUMN (7 Cols): Guest Details, Party Size, Movie-style Timing */}
          <div className="lg:col-span-7 flex flex-col gap-5">
            
            {/* 1. MANDATORY GUEST DETAILS FORM */}
            <div className="bg-slate-900/80 backdrop-blur-md rounded-3xl border border-white/10 p-5 sm:p-6 shadow-xl">
              <div className="flex items-center gap-2 mb-4">
                <User className="w-4 h-4 text-amber-400" />
                <h2 className="text-sm sm:text-base font-bold text-white uppercase tracking-wider">
                  {t.guestAndContactTitle || '1. Primary Guest Details (Mandatory)'}
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name Input */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1">
                    <span>{t.customerNameLabel || 'Your Full Name'}</span>
                    <span className="text-amber-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={localName}
                      onChange={(e) => {
                        setLocalName(e.target.value);
                        if (nameError) setNameError(null);
                      }}
                      placeholder={t.customerNamePlaceholder || 'e.g. Anand Kumar'}
                      className={`w-full bg-slate-950/80 border rounded-2xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none transition-all ${
                        nameError 
                          ? 'border-rose-500 focus:ring-2 focus:ring-rose-500/30' 
                          : 'border-white/15 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20'
                      }`}
                    />
                    <User className="w-4 h-4 text-slate-500 absolute right-3.5 top-3.5 pointer-events-none" />
                  </div>
                  {nameError && (
                    <p className="text-xs text-rose-400 mt-1 font-semibold flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      <span>{nameError}</span>
                    </p>
                  )}
                </div>

                {/* Mobile Number Input */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1">
                    <span>{t.customerPhoneLabel || 'Mobile Number (For Digital Ticket)'}</span>
                    <span className="text-amber-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={localPhone}
                      maxLength={14}
                      onChange={(e) => {
                        setLocalPhone(e.target.value);
                        if (phoneError) setPhoneError(null);
                      }}
                      placeholder={t.customerPhonePlaceholder || 'e.g. 98765 43210'}
                      className={`w-full bg-slate-950/80 border rounded-2xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none transition-all font-mono ${
                        phoneError 
                          ? 'border-rose-500 focus:ring-2 focus:ring-rose-500/30' 
                          : 'border-white/15 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20'
                      }`}
                    />
                    <Phone className="w-4 h-4 text-slate-500 absolute right-3.5 top-3.5 pointer-events-none" />
                  </div>
                  {phoneError && (
                    <p className="text-xs text-rose-400 mt-1 font-semibold flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      <span>{phoneError}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* 2. MOVIE-TICKET STYLE SHOWTIME / DINING TIMING SELECTOR */}
            <div className="bg-slate-900/80 backdrop-blur-md rounded-3xl border border-white/10 p-5 sm:p-6 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <div>
                    <h2 className="text-sm sm:text-base font-bold text-white uppercase tracking-wider">
                      {t.selectDiningTimeSlot || '2. Select Dining Timing Slot'}
                    </h2>
                    <p className="text-[11px] text-slate-400">
                      {t.diningTimeSlotDesc || 'Movie-ticket style live reservation. Booked slots are blocked in real-time.'}
                    </p>
                  </div>
                </div>

                {/* Date Tabs (Today vs Tomorrow) */}
                <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-2xl border border-white/10">
                  <button
                    type="button"
                    onClick={() => {
                      setLocalDate(todayStr);
                      setCollisionWarning(null);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      localDate === todayStr 
                        ? 'bg-amber-500 text-slate-950 font-black shadow' 
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {t.todayDateLabel || 'Today'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLocalDate(tomorrowStr);
                      setCollisionWarning(null);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      localDate === tomorrowStr 
                        ? 'bg-amber-500 text-slate-950 font-black shadow' 
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {t.tomorrowDateLabel || 'Tomorrow'}
                  </button>
                </div>
              </div>

              {/* Meal Filter Category Pills */}
              <div className="flex items-center gap-1.5 mb-4 overflow-x-auto pb-1 text-xs">
                <button
                  type="button"
                  onClick={() => setActiveMealFilter('all')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                    activeMealFilter === 'all'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-transparent'
                  }`}
                >
                  {t.allCategories || 'All Slots'}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveMealFilter('lunch')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                    activeMealFilter === 'lunch'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-transparent'
                  }`}
                >
                  {t.lunchSlots || 'Lunch Service'}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveMealFilter('tea')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                    activeMealFilter === 'tea'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-transparent'
                  }`}
                >
                  {t.teaSlots || 'Evening Tea'}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveMealFilter('dinner')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                    activeMealFilter === 'dinner'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-transparent'
                  }`}
                >
                  {t.dinnerSlots || 'Royal Dinner'}
                </button>
              </div>

              {/* SHOWTIME SLOTS GRID (Visual Movie Ticket Buttons) */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                {filteredSlots.map((slot) => {
                  const isCollision = slotCollisionStatus[slot.time]?.isBooked;
                  const isSelected = localSlot === slot.time && !isCollision;

                  return (
                    <button
                      key={slot.time}
                      type="button"
                      disabled={isCollision}
                      onClick={() => handleSelectSlot(slot)}
                      className={`relative p-3 rounded-2xl border transition-all text-left flex flex-col justify-between cursor-pointer ${
                        isCollision
                          ? 'bg-rose-950/40 border-rose-900/60 opacity-60 cursor-not-allowed hover:border-rose-700'
                          : isSelected
                            ? 'bg-gradient-to-br from-amber-500/30 via-slate-900 to-amber-600/20 border-amber-400 shadow-lg shadow-amber-500/20 scale-[1.02]'
                            : 'bg-slate-950/70 border-white/10 hover:border-amber-400/50 hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className={`text-sm font-black font-mono ${
                          isCollision 
                            ? 'text-rose-400 line-through' 
                            : isSelected 
                              ? 'text-amber-300 font-extrabold' 
                              : 'text-white'
                        }`}>
                          {slot.time}
                        </span>

                        {/* Status Icon */}
                        {isCollision ? (
                          <Lock className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                        ) : isSelected ? (
                          <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                        ) : (
                          <div className="w-2 h-2 rounded-full bg-emerald-400" />
                        )}
                      </div>

                      {/* Period & Availability Badge */}
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-slate-400 truncate">
                          {slot.meal === 'lunch' ? (t.lunchSlots || slot.periodLabel) : slot.meal === 'tea' ? (t.teaSlots || slot.periodLabel) : (t.dinnerSlots || slot.periodLabel)}
                        </span>

                        {isCollision ? (
                          <span className="text-[9px] font-black uppercase text-rose-400 bg-rose-950 px-1.5 py-0.5 rounded border border-rose-800">
                            {t.slotBooked || 'Booked'}
                          </span>
                        ) : slot.popularBadge ? (
                          <span className="text-[9px] font-bold text-amber-300 bg-amber-500/20 px-1.5 py-0.5 rounded border border-amber-500/30">
                            {t.slotFillingFast || 'Filling Fast'}
                          </span>
                        ) : (
                          <span className="text-[9px] font-bold text-emerald-300 bg-emerald-500/10 px-1 py-0.5 rounded">
                            {t.slotAvailable || 'Available'}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. GUEST COUNT & FAMILY SIZE STEPPER */}
            <div className="bg-slate-900/80 backdrop-blur-md rounded-3xl border border-white/10 p-5 sm:p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-amber-400" />
                  <h2 className="text-sm sm:text-base font-bold text-white uppercase tracking-wider">
                    {t.howManyGuestsTitle || '3. How many guests are dining today?'}
                  </h2>
                </div>

                {/* Interactive Stepper */}
                <div className="flex items-center gap-2 bg-slate-950/80 p-1 rounded-2xl border border-white/10">
                  <button
                    type="button"
                    onClick={() => handleCountChange(localCount - 1)}
                    disabled={localCount <= 1}
                    className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-white flex items-center justify-center transition-all cursor-pointer"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-10 text-center font-extrabold text-amber-300 text-base font-mono">
                    {localCount}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCountChange(localCount + 1)}
                    disabled={localCount >= 16}
                    className="w-8 h-8 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center justify-center transition-all font-bold cursor-pointer"
                  >
                    <Plus className="w-4 h-4 stroke-[3]" />
                  </button>
                </div>
              </div>

              {/* Quick Preset Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                {countPresets.map((preset) => {
                  const isMatch = (localCount <= 2 && preset.count === 2) ||
                                  (localCount > 2 && localCount <= 4 && preset.count === 4) ||
                                  (localCount > 4 && localCount <= 6 && preset.count === 6) ||
                                  (localCount > 6 && localCount <= 8 && preset.count === 8) ||
                                  (localCount > 8 && preset.count === 10);

                  return (
                    <button
                      key={preset.count}
                      type="button"
                      onClick={() => handleCountChange(preset.count)}
                      className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-between ${
                        isMatch
                          ? 'bg-amber-500/20 border-amber-400 text-white shadow-md shadow-amber-500/10'
                          : 'bg-slate-950/60 border-white/10 text-slate-400 hover:border-white/30 hover:text-white'
                      }`}
                    >
                      <span className="text-xl mb-1">{preset.icon}</span>
                      <span className="text-xs font-black text-amber-300 block">{preset.label}</span>
                      <span className="text-[10px] text-slate-400 block truncate w-full">{preset.sub}</span>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN (5 Cols): HIGH-END VIP TABLE TICKET CARD */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            
            <div className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 rounded-3xl border-2 border-amber-500/40 p-6 shadow-2xl shadow-amber-500/15 relative overflow-hidden">
              
              {/* Gold Ambient Shimmer in Card */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/15 rounded-full blur-2xl pointer-events-none" />

              {/* Top Card Badge */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <span className="text-[10px] uppercase font-black tracking-widest text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/30 flex items-center gap-1.5">
                  <Crown className="w-3 h-3 text-amber-400" />
                  <span>{t.allocatedDecisionLive || 'ALLOCATED TABLE SUMMARY'}</span>
                </span>
                <span className="text-xs font-bold text-slate-400">
                  {allocation.capacity} {t.capacitySeats || 'Seats'}
                </span>
              </div>

              {/* TABLE NUMBER HERO */}
              <div className="py-5 flex items-center gap-4">
                <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 flex flex-col items-center justify-center text-slate-950 shadow-xl shadow-amber-500/30 shrink-0 font-black">
                  <span className="text-[10px] font-extrabold tracking-widest uppercase text-slate-900/80">{t.table}</span>
                  <span className="text-3xl sm:text-4xl leading-none">#{currentTableNum}</span>
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-white leading-tight">
                    {allocation.category}
                  </h3>
                  <div className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 text-xs font-bold border border-amber-500/30">
                    {allocation.ambienceBadge}
                  </div>
                  <p className="text-xs text-slate-400 mt-1.5 flex items-center gap-1">
                    <Compass className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>{allocation.zoneDescription}</span>
                  </p>
                </div>
              </div>

              {/* ASSIGNED FLOOR SERVER */}
              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-white/10 flex items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  {allocation.waiter.avatarUrl ? (
                    <img 
                      src={allocation.waiter.avatarUrl} 
                      alt={allocation.waiter.name} 
                      className="w-10 h-10 rounded-full object-cover border border-amber-400/40"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-400 font-bold text-sm flex items-center justify-center border border-amber-400/40">
                      {allocation.waiter.initial}
                    </div>
                  )}
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      {t.dedicatedTableAttendant || 'Dedicated Floor Attendant'}
                    </span>
                    <span className="text-sm font-bold text-white">
                      {getLocalizedWaiterName(allocation.waiter.name, language)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-emerald-400 text-xs font-bold bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/20">
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>{t.onDuty || 'On Duty'}</span>
                </div>
              </div>

              {/* TICKET DETAILS PREVIEW */}
              <div className="bg-slate-950/60 rounded-2xl p-4 border border-white/10 text-xs space-y-2 mb-5 font-medium">
                <div className="flex justify-between pb-2 border-b border-white/5">
                  <span className="text-slate-400">{t.bookingTicketNumber || 'Ticket #'}</span>
                  <span className="font-mono font-bold text-amber-300">#{ticketNumber}</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-white/5">
                  <span className="text-slate-400">{t.dateAndSlot || 'Date & Slot'}</span>
                  <span className="font-bold text-white">{localDate === todayStr ? (t.todayDateLabel || 'Today') : (t.tomorrowDateLabel || 'Tomorrow')} • {localSlot}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">{t.partySize || 'Party Size'}</span>
                  <span className="font-bold text-amber-300">{localCount} {t.guestsCountLabel || 'Guests'}</span>
                </div>
              </div>

              {/* TABLE HIGHLIGHTS CHECKLIST */}
              <div className="space-y-1.5 mb-6 text-xs text-slate-300">
                {allocation.features.map((feat, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              {/* PROCEED ACTION BUTTON */}
              <button
                type="button"
                onClick={handleProceed}
                disabled={isSubmitting}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-black text-base flex items-center justify-center gap-2.5 shadow-xl shadow-amber-500/30 transition-all active:scale-95 cursor-pointer disabled:opacity-60"
              >
                <span>{t.proceedToMenuBtn || 'Confirm Table & Get Ticket'}</span>
                <ArrowRight className="w-5 h-5 stroke-[2.5]" />
              </button>

              <p className="text-[11px] text-center text-slate-400 mt-2 font-medium">
                {t.proceedToTablePrompt || 'Your reserved table will be prepared for prompt service.'}
              </p>
            </div>

          </div>

        </div>

      </main>

    </div>
  );
};

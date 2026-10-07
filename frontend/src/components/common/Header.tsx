import React, { useState } from 'react';
import { useKiosk } from '../../context/KioskContext';
import { 
  Bell, 
  ShoppingBag, 
  Globe, 
  Eye, 
  UtensilsCrossed, 
  ArrowLeft 
} from 'lucide-react';
import CallWaiterModal from './CallWaiterModal';

interface HeaderProps {
  onBackToWelcome?: () => void;
  onOpenCart?: () => void;
  showBack?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ 
  onBackToWelcome, 
  onOpenCart, 
  showBack = false 
}) => {
  const { 
    tableNumber, 
    setTableNumber,
    language, 
    setLanguage, 
    isAccessibilityMode, 
    toggleAccessibility, 
    cartTotalQuantity, 
    cartGrandTotal,
    t,
    staffAlerts,
    currentTrackedOrder,
    setView
  } = useKiosk();

  const [isWaiterModalOpen, setIsWaiterModalOpen] = useState(false);
  const [isTableSelectOpen, setIsTableSelectOpen] = useState(false);

  const pendingAlertsForThisTable = staffAlerts.filter(
    (a) => a.tableNumber === tableNumber && a.status === 'PENDING'
  ).length;

  return (
    <>
      <header className={`sticky top-0 z-30 transition-all duration-200 border-b ${
        isAccessibilityMode 
          ? 'bg-slate-900 text-white border-slate-700 py-4 px-6' 
          : 'bg-white/95 backdrop-blur-md text-slate-800 border-slate-200/80 shadow-sm py-3.5 px-4 md:px-8'
      }`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          
          {/* Left Brand & Table Identifier */}
          <div className="flex items-center gap-3">
            {showBack && onBackToWelcome && (
              <button
                onClick={onBackToWelcome}
                className="p-2.5 rounded-xl hover:bg-slate-100 transition-colors text-slate-600 active:scale-95"
                title="Back to Welcome Screen"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}

            <div 
              onClick={() => setView('hub')}
              className="flex items-center gap-2.5 cursor-pointer group"
              title="Return to Demo Hub"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <div className="leading-tight">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold tracking-tight text-lg md:text-xl font-display text-slate-900 group-hover:text-brand-600 transition-colors">
                    OrderEase
                  </span>
                  <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-brand-100 text-brand-700">
                    Kiosk
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 hidden md:block">
                  Smart Table-Side Experience
                </p>
              </div>
            </div>

            {/* Table Number Badge */}
            <div className="relative ml-1 md:ml-4">
              <button
                onClick={() => setIsTableSelectOpen(!isTableSelectOpen)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-sm transition-all border ${
                  isAccessibilityMode
                    ? 'bg-amber-400 text-slate-950 border-amber-300'
                    : 'bg-brand-50 text-brand-700 border-brand-200/80 hover:bg-brand-100 active:scale-95'
                }`}
                title="Tap to switch Table Number"
              >
                <span className="text-xs uppercase font-medium text-slate-500">Table</span>
                <span className="text-base text-brand-600 font-extrabold">{tableNumber}</span>
                <span className="text-[10px] text-slate-400 ml-0.5">▼</span>
              </button>

              {/* Quick Table Switcher Dropdown */}
              {isTableSelectOpen && (
                <div className="absolute left-0 mt-2 w-48 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Select Kiosk Table
                  </div>
                  <div className="grid grid-cols-4 gap-1 p-2">
                    {[1, 2, 4, 6, 8, 12, 14, 16].map((num) => (
                      <button
                        key={num}
                        onClick={() => {
                          setTableNumber(num);
                          setIsTableSelectOpen(false);
                        }}
                        className={`py-2 rounded-lg text-sm font-bold transition-colors ${
                          tableNumber === num
                            ? 'bg-brand-600 text-white'
                            : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2 md:gap-3">
            
            {/* Language Switcher */}
            <div className="flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200/60">
              <button
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  language === 'en'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Switch to English"
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('ta')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  language === 'ta'
                    ? 'bg-white text-brand-700 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                title="தமிழுக்கு மாற்றவும் (Tamil)"
              >
                தமிழ்
              </button>
            </div>

            {/* Accessibility Toggle */}
            <button
              onClick={toggleAccessibility}
              className={`p-2.5 rounded-xl border transition-all flex items-center gap-1.5 text-xs font-semibold ${
                isAccessibilityMode
                  ? 'bg-amber-400 text-slate-950 border-amber-500 shadow-md font-bold'
                  : 'bg-slate-100 text-slate-700 border-slate-200/60 hover:bg-slate-200/70'
              }`}
              title="Toggle Accessibility High-Contrast & Larger Text"
            >
              <Eye className="w-4 h-4" />
              <span className="hidden lg:inline">A11y</span>
            </button>

            {/* Call Waiter Button */}
            <button
              onClick={() => setIsWaiterModalOpen(true)}
              className={`relative px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 border ${
                pendingAlertsForThisTable > 0
                  ? 'bg-amber-500 text-white border-amber-600 animate-pulse'
                  : 'bg-slate-100 text-slate-700 border-slate-200/60 hover:bg-slate-200'
              }`}
            >
              <Bell className="w-4 h-4" />
              <span className="hidden sm:inline">{t.callWaiter}</span>
              {pendingAlertsForThisTable > 0 && (
                <span className="w-2 h-2 rounded-full bg-white animate-ping" />
              )}
            </button>

            {/* Cart Trigger Button */}
            {onOpenCart && (
              <button
                onClick={onOpenCart}
                className="relative flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 text-white font-bold shadow-md shadow-brand-500/25 hover:from-brand-700 hover:to-brand-600 active:scale-95 transition-all"
              >
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden sm:inline text-xs font-medium">{t.cart}</span>
                {cartTotalQuantity > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-white text-brand-700 text-xs font-black">
                    {cartTotalQuantity}
                  </span>
                )}
                {cartGrandTotal > 0 && (
                  <span className="text-xs font-extrabold border-l border-white/20 pl-2 hidden md:inline">
                    ₹{cartGrandTotal}
                  </span>
                )}
              </button>
            )}

          </div>
        </div>
      </header>

      {/* Waiter modal */}
      <CallWaiterModal 
        isOpen={isWaiterModalOpen} 
        onClose={() => setIsWaiterModalOpen(false)} 
      />
    </>
  );
};

export default Header;

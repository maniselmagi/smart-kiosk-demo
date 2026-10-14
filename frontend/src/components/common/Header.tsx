import React, { useState, useRef, useEffect } from 'react';
import { useKiosk } from '../../context/KioskContext';
import { 
  Bell, 
  ShoppingBag, 
  Globe, 
  Eye, 
  UtensilsCrossed, 
  ArrowLeft,
  Sun,
  Moon,
  ChevronDown
} from 'lucide-react';
import { AVAILABLE_LANGUAGES } from '../../utils/translations';
import CallWaiterModal from './CallWaiterModal';
import { HotelBrand } from './HotelBrand';

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
    theme,
    toggleTheme,
    isAccessibilityMode, 
    toggleAccessibility, 
    cartTotalQuantity, 
    cartGrandTotal,
    t,
    staffAlerts,
    setView,
    isStandaloneRole,
    setIsLanguageModalOpen
  } = useKiosk();

  const [isWaiterModalOpen, setIsWaiterModalOpen] = useState(false);
  const [isTableSelectOpen, setIsTableSelectOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  const langMenuRef = useRef<HTMLDivElement>(null);
  const tableMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(e.target as Node)) {
        setIsLangMenuOpen(false);
      }
      if (tableMenuRef.current && !tableMenuRef.current.contains(e.target as Node)) {
        setIsTableSelectOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const pendingAlertsForThisTable = staffAlerts.filter(
    (a) => a.tableNumber === tableNumber && a.status === 'PENDING'
  ).length;

  const currentLangObj = AVAILABLE_LANGUAGES.find((l) => l.code === language) || AVAILABLE_LANGUAGES[0];

  return (
    <>
      <header className={`sticky top-0 z-30 transition-colors duration-200 border-b ${
        isAccessibilityMode 
          ? 'bg-slate-900 text-white border-slate-700 py-4 px-4 md:px-6' 
          : 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-md text-slate-800 dark:text-slate-100 border-slate-200/80 dark:border-slate-800 shadow-sm py-3 px-3 md:px-8'
      }`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 md:gap-3">
          
          {/* Left Brand & Table Identifier */}
          <div className="flex items-center gap-2 md:gap-3">
            {showBack && onBackToWelcome && (
              <button
                onClick={onBackToWelcome}
                className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-300 active:scale-95"
                title="Back to Welcome Screen"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}

            <div 
              onClick={() => {
                if (showBack && onBackToWelcome) {
                  onBackToWelcome();
                } else if (!isStandaloneRole) {
                  setView('hub');
                }
              }}
              className="cursor-pointer group flex items-center"
              title="Royal Ember Restaurant & Banquet"
            >
              <HotelBrand size="sm" align="left" showTagline={false} showDescriptor={false} />
            </div>

            {/* Table Number Badge */}
            <div className="relative ml-0.5 md:ml-3" ref={tableMenuRef}>
              <button
                onClick={() => setIsTableSelectOpen(!isTableSelectOpen)}
                className={`flex items-center gap-1.5 px-2.5 md:px-3 py-1.5 rounded-xl font-bold text-xs md:text-sm transition-all border ${
                  isAccessibilityMode
                    ? 'bg-amber-400 text-slate-950 border-amber-300'
                    : 'bg-brand-50 dark:bg-slate-800 text-brand-700 dark:text-brand-400 border-brand-200/80 dark:border-slate-700 hover:bg-brand-100 dark:hover:bg-slate-700 active:scale-95'
                }`}
                title="Tap to switch Table Number"
              >
                <span className="text-[10px] md:text-xs uppercase font-medium text-slate-500 dark:text-slate-400">Table</span>
                <span className="text-sm md:text-base text-brand-600 dark:text-brand-400 font-extrabold">{tableNumber}</span>
                <ChevronDown className="w-3 h-3 text-slate-400 ml-0.5" />
              </button>

              {/* Quick Table Switcher Dropdown */}
              {isTableSelectOpen && (
                <div className="absolute left-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-1.5 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
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
                            : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700'
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
          <div className="flex items-center gap-1.5 md:gap-2.5">
            
            {/* Multi-Language Dropdown */}
            <div className="relative" ref={langMenuRef}>
              <button
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all border bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-200/70 dark:border-slate-700 active:scale-95 shadow-sm"
                title="Change Language"
              >
                <Globe className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
                <span>{currentLangObj.flag}</span>
                <span className="hidden sm:inline font-semibold">{currentLangObj.short}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isLangMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                    Choose Language
                  </div>
                  <div className="p-1 space-y-0.5">
                    {AVAILABLE_LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code);
                          setIsLangMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                          language === lang.code
                            ? 'bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 font-bold'
                            : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className="text-base">{lang.flag}</span>
                          <span>{lang.nativeLabel}</span>
                        </span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono uppercase">
                          {lang.code}
                        </span>
                      </button>
                    ))}
                    <button
                      onClick={() => {
                        setIsLangMenuOpen(false);
                        setIsLanguageModalOpen(true);
                      }}
                      className="w-full mt-1 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center justify-center gap-1.5 py-1"
                    >
                      <Globe className="w-3 h-3" />
                      <span>{t.changeLanguage} →</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Dark Mode / Light Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 md:p-2.5 rounded-xl border transition-all flex items-center justify-center text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-amber-400 border-slate-200/70 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 shadow-sm"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400 animate-in spin-in-180 duration-200" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600 animate-in spin-in-180 duration-200" />
              )}
            </button>

            {/* Accessibility Toggle */}
            <button
              onClick={toggleAccessibility}
              className={`p-2 md:p-2.5 rounded-xl border transition-all flex items-center gap-1.5 text-xs font-semibold ${
                isAccessibilityMode
                  ? 'bg-amber-400 text-slate-950 border-amber-500 shadow-md font-bold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200/70 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
              title="Toggle Accessibility High-Contrast & Larger Text"
            >
              <Eye className="w-4 h-4" />
              <span className="hidden xl:inline">A11y</span>
            </button>

            {/* Call Waiter Button */}
            <button
              onClick={() => setIsWaiterModalOpen(true)}
              className={`relative px-2.5 md:px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 border ${
                pendingAlertsForThisTable > 0
                  ? 'bg-amber-500 text-white border-amber-600 animate-pulse'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200/70 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <Bell className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span className="hidden sm:inline">{t.callWaiter}</span>
              {pendingAlertsForThisTable > 0 && (
                <span className="w-2 h-2 rounded-full bg-white animate-ping" />
              )}
            </button>

            {/* Cart Trigger Button */}
            {onOpenCart && (
              <button
                onClick={onOpenCart}
                className="relative flex items-center gap-1.5 md:gap-2 px-3 md:px-3.5 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 text-white font-bold shadow-md shadow-brand-500/25 hover:from-brand-700 hover:to-brand-600 active:scale-95 transition-all"
              >
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden sm:inline text-xs font-medium">{t.cart}</span>
                {cartTotalQuantity > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-white text-brand-700 text-xs font-black">
                    {cartTotalQuantity}
                  </span>
                )}
                {cartGrandTotal > 0 && (
                  <span className="text-xs font-extrabold border-l border-white/20 pl-1.5 md:pl-2 hidden md:inline">
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

import React, { useState, useEffect } from 'react';
import { useKiosk } from '../../context/KioskContext';
import { 
  ShoppingBag, 
  Clock, 
  ArrowLeft,
  Sun,
  Moon
} from 'lucide-react';
import { HotelBrand } from './HotelBrand';
import { getAssignedWaiter } from '../../utils/waiterAssignment';

interface HeaderProps {
  onBackToWelcome?: () => void;
  onOpenCart?: () => void;
  onOpenTrackOrder?: () => void;
  onOpenEntertainment?: () => void;
  showBack?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ 
  onBackToWelcome, 
  onOpenCart, 
  showBack = false 
}) => {
  const { 
    tableNumber, 
    theme, 
    toggleTheme, 
    isAccessibilityMode, 
    cartTotalQuantity, 
    cartGrandTotal, 
    t 
  } = useKiosk();

  const [currentTime, setCurrentTime] = useState<string>('');

  // Live dynamic clock updating every second
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Assigned server/waiter based on table zone
  const assignedWaiter = getAssignedWaiter(tableNumber);

  return (
    <>
      <header className={`sticky top-0 z-30 transition-colors duration-200 border-b ${
        isAccessibilityMode 
          ? 'bg-slate-900 text-white border-slate-700 py-3.5 px-3 md:px-6' 
          : 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-md text-slate-800 dark:text-slate-100 border-slate-200/80 dark:border-slate-800 shadow-sm py-2.5 px-3 md:px-8'
      }`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 md:gap-3">
          
          {/* LEFT: Hotel Name & Fixed Table Number */}
          <div className="flex items-center gap-2 md:gap-3">
            {showBack && onBackToWelcome && (
              <button
                onClick={onBackToWelcome}
                className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-300 active:scale-95 cursor-pointer"
                title="Back to Welcome Screen"
                aria-label="Back to Welcome Screen"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}

            {/* Hotel Name & Logo */}
            <div 
              onClick={onBackToWelcome}
              className="cursor-pointer group flex items-center"
              title="Royal Ember Restaurant & Banquet"
            >
              <HotelBrand size="sm" align="left" showTagline={false} showDescriptor={false} />
            </div>

            {/* FIXED TABLE NUMBER BADGE (Not a dropdown as requested) */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 dark:bg-amber-400/10 text-amber-800 dark:text-amber-300 border border-amber-300/70 dark:border-amber-700/70 font-black text-xs md:text-sm shadow-xs select-none">
              <span className="text-[10px] md:text-xs uppercase font-bold text-slate-500 dark:text-slate-400">TABLE</span>
              <span className="text-sm md:text-base text-amber-600 dark:text-amber-400 font-black">{tableNumber}</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse ml-0.5" />
            </div>
          </div>

          {/* RIGHT: Clock, Waiter Name, Cart, Mode Toggle (Placed Last) */}
          <div className="flex items-center gap-1.5 md:gap-2.5">
            
            {/* Live Clock */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-mono font-bold border border-slate-200/80 dark:border-slate-700 shadow-xs">
              <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>{currentTime || '--:--'}</span>
            </div>

            {/* Waiter Name Badge (Strictly matches KDS and receipts) */}
            <div className="flex items-center gap-1.5 px-2.5 md:px-3 py-1.5 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-950 dark:text-amber-200 text-xs font-bold border border-amber-300/80 dark:border-amber-700/80 shadow-xs">
              <span className="text-sm">🧑‍🍳</span>
              <span className="hidden lg:inline text-[10px] uppercase font-bold text-amber-700 dark:text-amber-400">Waiter:</span>
              <span className="font-black text-amber-950 dark:text-amber-100">{assignedWaiter.fullName}</span>
            </div>

            {/* Cart Trigger Button */}
            {onOpenCart && (
              <button
                onClick={onOpenCart}
                className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-brand-600 via-amber-500 to-amber-600 text-white font-bold text-xs shadow-md shadow-brand-500/25 hover:from-brand-700 hover:to-amber-700 active:scale-95 transition-all cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden sm:inline font-bold">{t.cart}</span>
                {cartTotalQuantity > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-white text-brand-700 text-xs font-black">
                    {cartTotalQuantity}
                  </span>
                )}
                {cartGrandTotal > 0 && (
                  <span className="text-xs font-black border-l border-white/20 pl-1.5 hidden md:inline">
                    ₹{cartGrandTotal}
                  </span>
                )}
              </button>
            )}

            {/* Dark/Light Mode Quick Toggle (Placed Last as requested) */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl border transition-all flex items-center justify-center text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-amber-400 border-slate-200/70 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 shadow-xs cursor-pointer"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600" />
              )}
            </button>

          </div>
        </div>
      </header>
    </>
  );
};

export default Header;

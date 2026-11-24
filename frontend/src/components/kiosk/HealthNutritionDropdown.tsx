import React, { useRef, useEffect } from 'react';
import { useKiosk } from '../../context/KioskContext';
import { HEALTH_NUTRITION_FILTERS } from '../../utils/nutritionFilters';
import { HealthFilterOption } from '../../types';
import { 
  HeartPulse, 
  ChevronDown, 
  Check, 
  X, 
  Sparkles,
  SlidersHorizontal
} from 'lucide-react';

interface HealthNutritionDropdownProps {
  variant?: 'header' | 'inline';
  className?: string;
}

export const HealthNutritionDropdown: React.FC<HealthNutritionDropdownProps> = ({
  variant = 'header',
  className = ''
}) => {
  const { 
    selectedHealthFilters, 
    toggleHealthFilter, 
    clearHealthFilters,
    isHealthDropdownOpen,
    setIsHealthDropdownOpen
  } = useKiosk();

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click or Escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsHealthDropdownOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsHealthDropdownOpen(false);
      }
    };

    if (isHealthDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isHealthDropdownOpen, setIsHealthDropdownOpen]);

  const activeCount = selectedHealthFilters.length;

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      
      {/* 1. SINGLE DROPDOWN TRIGGER BUTTON */}
      <button
        type="button"
        onClick={() => setIsHealthDropdownOpen(!isHealthDropdownOpen)}
        aria-haspopup="true"
        aria-expanded={isHealthDropdownOpen}
        aria-label="Health & Nutrition Filter Menu"
        className={`group flex items-center gap-1.5 sm:gap-2 rounded-full font-bold transition-all cursor-pointer select-none active:scale-95 shadow-sm ${
          variant === 'header'
            ? activeCount > 0
              ? 'px-3 sm:px-3.5 py-1.5 sm:py-2 bg-gradient-to-r from-emerald-500/25 via-teal-500/20 to-emerald-500/25 border-2 border-emerald-400 text-emerald-300 ring-2 ring-emerald-400/20'
              : 'px-3 sm:px-3.5 py-1.5 sm:py-2 bg-slate-900/90 hover:bg-slate-800 border border-emerald-500/40 hover:border-emerald-400 text-slate-100'
            : activeCount > 0
            ? 'px-4 py-2 bg-emerald-600 text-white border border-emerald-500 shadow-md shadow-emerald-600/25'
            : 'px-4 py-2 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-slate-200/90 dark:border-slate-800 hover:border-emerald-500'
        }`}
      >
        <HeartPulse className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 transition-transform group-hover:scale-110 ${
          activeCount > 0 ? 'text-emerald-400 animate-pulse' : 'text-emerald-400'
        }`} />
        
        <span className="text-xs sm:text-xs font-black tracking-tight whitespace-nowrap">
          Health &amp; Nutrition
        </span>

        {/* Counter Badge */}
        {activeCount > 0 && (
          <span className="w-5 h-5 rounded-full bg-emerald-400 text-slate-950 text-[11px] font-black flex items-center justify-center shrink-0 shadow-xs">
            {activeCount}
          </span>
        )}

        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-transform duration-200 shrink-0 ${
          isHealthDropdownOpen ? 'rotate-180 text-emerald-400' : ''
        }`} />
      </button>

      {/* 2. SINGLE DROPDOWN PANEL (Floating Luxury Dialog) */}
      {isHealthDropdownOpen && (
        <div 
          className="absolute right-0 sm:right-auto sm:left-0 top-full mt-2.5 w-[310px] sm:w-[420px] max-w-[92vw] rounded-3xl bg-slate-950/95 text-slate-100 border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.85)] backdrop-blur-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
          role="dialog"
          aria-label="Health & Nutrition Options"
        >
          {/* Top Amber Ambient Glow */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500" />

          {/* Header Strip with Title & Clear All */}
          <div className="p-4 sm:p-4.5 bg-slate-900/90 border-b border-white/[0.08] flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
                <HeartPulse className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-black text-white font-display flex items-center gap-1.5">
                  <span>Health &amp; Nutrition</span>
                  {activeCount > 0 && (
                    <span className="text-[10px] px-2 py-0.2 rounded-full bg-emerald-400 text-slate-950 font-black">
                      {activeCount} Active
                    </span>
                  )}
                </h4>
                <p className="text-[10px] text-slate-400 font-medium">
                  Multi-select standards • Applied with AND logic
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {activeCount > 0 && (
                <button
                  type="button"
                  onClick={clearHealthFilters}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-bold text-slate-300 hover:text-white bg-white/[0.06] hover:bg-white/[0.12] transition-colors cursor-pointer"
                >
                  Clear All
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsHealthDropdownOpen(false)}
                className="w-7 h-7 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close dropdown"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Scrollable Single Dropdown Multi-Select List */}
          <div className="p-3 sm:p-3.5 max-h-[380px] overflow-y-auto space-y-1.5 custom-scrollbar">
            {HEALTH_NUTRITION_FILTERS.map((filter) => {
              const isChecked = selectedHealthFilters.includes(filter.key);

              return (
                <button
                  key={filter.key}
                  type="button"
                  onClick={() => toggleHealthFilter(filter.key)}
                  className={`w-full text-left p-2.5 sm:p-3 rounded-2xl flex items-center justify-between gap-3 transition-all cursor-pointer border ${
                    isChecked
                      ? 'bg-gradient-to-r from-emerald-500/20 via-teal-500/10 to-transparent border-emerald-500/70 text-white shadow-xs'
                      : 'bg-white/[0.02] hover:bg-white/[0.06] border-white/[0.04] hover:border-white/10 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Custom Touch Checkbox */}
                    <div className={`w-5 h-5 rounded-lg flex items-center justify-center border transition-colors shrink-0 ${
                      isChecked
                        ? 'bg-emerald-400 border-emerald-400 text-slate-950 shadow-xs'
                        : 'border-slate-600 bg-slate-900/60'
                    }`}>
                      {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs sm:text-sm font-bold truncate ${
                          isChecked ? 'text-white' : 'text-slate-200'
                        }`}>
                          {filter.label}
                        </span>
                        <span className="text-[10px] font-black px-1.5 py-0.2 rounded-md bg-white/[0.06] text-emerald-400 font-mono border border-white/5">
                          {filter.badge}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 line-clamp-1 leading-snug mt-0.5">
                        {filter.description}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Footer Action Bar */}
          <div className="p-3 bg-slate-900/90 border-t border-white/[0.08] flex items-center justify-between gap-2">
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>FSSAI verified food standards</span>
            </span>

            <button
              type="button"
              onClick={() => setIsHealthDropdownOpen(false)}
              className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs shadow-md transition-all active:scale-95 cursor-pointer"
            >
              Done ({activeCount})
            </button>
          </div>

        </div>
      )}

    </div>
  );
};

export default HealthNutritionDropdown;


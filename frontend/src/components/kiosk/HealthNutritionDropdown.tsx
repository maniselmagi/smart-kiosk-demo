import React, { useRef, useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useKiosk } from '../../context/KioskContext';
import { HEALTH_NUTRITION_FILTERS } from '../../utils/nutritionFilters';
import { 
  HeartPulse, 
  ChevronDown, 
  Check, 
  X, 
  Sparkles
} from 'lucide-react';

interface HealthNutritionDropdownProps {
  className?: string;
}

export const HealthNutritionDropdown: React.FC<HealthNutritionDropdownProps> = ({
  className = ''
}) => {
  const { 
    selectedHealthFilters, 
    toggleHealthFilter, 
    clearHealthFilters,
    isHealthDropdownOpen,
    setIsHealthDropdownOpen
  } = useKiosk();

  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const [coords, setCoords] = useState<{ top: number; left: number; width: number } | null>(null);

  const updatePosition = useCallback(() => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const dropdownWidth = Math.min(420, window.innerWidth - 24);

    let left = rect.left;
    if (left + dropdownWidth > window.innerWidth - 12) {
      left = window.innerWidth - dropdownWidth - 12;
    }
    if (left < 12) left = 12;

    setCoords({
      top: rect.bottom + 8,
      left,
      width: dropdownWidth,
    });
  }, []);

  // Update position on open, resize or scroll
  useEffect(() => {
    if (!isHealthDropdownOpen) return;

    updatePosition();

    const handleScrollOrResize = () => {
      updatePosition();
    };

    window.addEventListener('resize', handleScrollOrResize);
    window.addEventListener('scroll', handleScrollOrResize, true);

    return () => {
      window.removeEventListener('resize', handleScrollOrResize);
      window.removeEventListener('scroll', handleScrollOrResize, true);
    };
  }, [isHealthDropdownOpen, updatePosition]);

  // Close dropdown on outside click or Escape key
  useEffect(() => {
    if (!isHealthDropdownOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        panelRef.current && 
        !panelRef.current.contains(target) &&
        buttonRef.current &&
        !buttonRef.current.contains(target)
      ) {
        setIsHealthDropdownOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsHealthDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isHealthDropdownOpen, setIsHealthDropdownOpen]);

  const activeCount = selectedHealthFilters.length;

  return (
    <div className={`relative inline-block shrink-0 ${className}`}>
      
      {/* 1. SINGLE HEALTH & NUTRITION DROPDOWN TRIGGER PILL */}
      <button
        ref={buttonRef}
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsHealthDropdownOpen(!isHealthDropdownOpen);
        }}
        aria-haspopup="dialog"
        aria-expanded={isHealthDropdownOpen}
        aria-label="Health & Nutrition Filter Menu"
        className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap shadow-xs active:scale-95 border ${
          activeCount > 0
            ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 text-white border-emerald-400 shadow-md shadow-emerald-600/30 font-black ring-2 ring-emerald-400/30'
            : isHealthDropdownOpen
            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-400 ring-2 ring-emerald-400/20'
            : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200/80 dark:border-slate-800 hover:border-emerald-500 hover:text-emerald-500'
        }`}
      >
        <HeartPulse className={`w-3.5 h-3.5 shrink-0 transition-transform ${
          activeCount > 0 ? 'text-white animate-pulse' : 'text-emerald-500'
        }`} />
        
        <span>Health &amp; Nutrition</span>

        {/* Counter Badge */}
        {activeCount > 0 && (
          <span className="w-4 h-4 rounded-full bg-white text-emerald-700 text-[10px] font-black flex items-center justify-center shrink-0 shadow-xs">
            {activeCount}
          </span>
        )}

        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 shrink-0 ${
          isHealthDropdownOpen ? 'rotate-180 text-emerald-400' : 'text-slate-400'
        }`} />
      </button>

      {/* 2. SINGLE FLOATING DROPDOWN PORTAL (Never clipped by parent scroll container) */}
      {isHealthDropdownOpen && coords && typeof document !== 'undefined' && createPortal(
        <div 
          ref={panelRef}
          style={{
            position: 'fixed',
            top: `${coords.top}px`,
            left: `${coords.left}px`,
            width: `${coords.width}px`,
            maxHeight: 'calc(100vh - 120px)',
            zIndex: 9999
          }}
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
          className="rounded-3xl bg-slate-950/95 text-slate-100 border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.85)] backdrop-blur-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col"
          role="dialog"
          aria-label="Health & Nutrition Options"
        >
          {/* Top Ambient Glow Strip */}
          <div className="h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 shrink-0" />

          {/* Header Strip with Title & Clear All */}
          <div className="p-3.5 sm:p-4 bg-slate-900/90 border-b border-white/[0.08] flex items-center justify-between gap-2 shrink-0">
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
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    clearHealthFilters();
                  }}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-bold text-slate-300 hover:text-white bg-white/[0.06] hover:bg-white/[0.12] transition-colors cursor-pointer"
                >
                  Clear All
                </button>
              )}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsHealthDropdownOpen(false);
                }}
                className="w-7 h-7 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close dropdown"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Scrollable Multi-Select Option List */}
          <div className="p-3 sm:p-3.5 overflow-y-auto space-y-1.5 custom-scrollbar flex-1 max-h-[360px]">
            {HEALTH_NUTRITION_FILTERS.map((filter) => {
              const isChecked = selectedHealthFilters.includes(filter.key);

              return (
                <div
                  key={filter.key}
                  role="button"
                  tabIndex={0}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleHealthFilter(filter.key);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      toggleHealthFilter(filter.key);
                    }
                  }}
                  className={`w-full text-left p-2.5 sm:p-3 rounded-2xl flex items-center justify-between gap-3 transition-all cursor-pointer border select-none ${
                    isChecked
                      ? 'bg-gradient-to-r from-emerald-500/20 via-teal-500/10 to-transparent border-emerald-500/70 text-white shadow-xs'
                      : 'bg-white/[0.02] hover:bg-white/[0.06] border-white/[0.04] hover:border-white/10 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Checkbox Icon Indicator */}
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
                </div>
              );
            })}
          </div>

          {/* Footer Action Bar */}
          <div className="p-3 bg-slate-900/90 border-t border-white/[0.08] flex items-center justify-between gap-2 shrink-0">
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>FSSAI verified standards</span>
            </span>

            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsHealthDropdownOpen(false);
              }}
              className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs shadow-md transition-all active:scale-95 cursor-pointer"
            >
              Done ({activeCount})
            </button>
          </div>

        </div>,
        document.body
      )}

    </div>
  );
};

export default HealthNutritionDropdown;

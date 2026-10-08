import React, { useState } from 'react';
import { useKiosk } from '../../context/KioskContext';
import { 
  Bell, 
  Droplet, 
  Receipt, 
  HelpCircle, 
  X, 
  CheckCircle2, 
  Sparkles 
} from 'lucide-react';

interface CallWaiterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CallWaiterModal: React.FC<CallWaiterModalProps> = ({ isOpen, onClose }) => {
  const { tableNumber, callWaiter, t } = useKiosk();
  const [submittedType, setSubmittedType] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSelect = (type: 'Need Assistance' | 'Need Water' | 'Need Bill' | 'Other') => {
    callWaiter(type);
    setSubmittedType(type);
    setTimeout(() => {
      setSubmittedType(null);
      onClose();
    }, 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden transform transition-all p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white font-display">
                {t.callWaiter}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t.staffHelpPrompt} <span className="font-bold text-slate-800 dark:text-slate-200">#{tableNumber}</span>?
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submittedType ? (
          <div className="py-8 text-center animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
              {t.staffNotified}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
              Request logged for Table {tableNumber}: <span className="font-semibold text-slate-700 dark:text-slate-200">{submittedType}</span>
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold border border-emerald-200/60 dark:border-emerald-800/60">
              <Sparkles className="w-3.5 h-3.5" /> A staff member has been dispatched
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3.5 py-6">
            <button
              onClick={() => handleSelect('Need Assistance')}
              className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 hover:border-brand-500 hover:bg-brand-50/50 dark:hover:bg-brand-950/40 transition-all text-center group active:scale-95"
            >
              <div className="w-12 h-12 rounded-2xl bg-brand-100 dark:bg-brand-900/60 text-brand-600 dark:text-brand-400 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
                <HelpCircle className="w-6 h-6" />
              </div>
              <span className="font-bold text-sm text-slate-800 dark:text-slate-200 group-hover:text-brand-700 dark:group-hover:text-brand-300">
                {t.needAssistance}
              </span>
              <span className="text-[11px] text-slate-400 mt-0.5">Ask questions / menu help</span>
            </button>

            <button
              onClick={() => handleSelect('Need Water')}
              className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-950/40 transition-all text-center group active:scale-95"
            >
              <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
                <Droplet className="w-6 h-6" />
              </div>
              <span className="font-bold text-sm text-slate-800 dark:text-slate-200 group-hover:text-blue-700 dark:group-hover:text-blue-300">
                {t.needWater}
              </span>
              <span className="text-[11px] text-slate-400 mt-0.5">Cold or warm water</span>
            </button>

            <button
              onClick={() => handleSelect('Need Bill')}
              className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/40 transition-all text-center group active:scale-95"
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
                <Receipt className="w-6 h-6" />
              </div>
              <span className="font-bold text-sm text-slate-800 dark:text-slate-200 group-hover:text-emerald-700 dark:group-hover:text-emerald-300">
                {t.needBill}
              </span>
              <span className="text-[11px] text-slate-400 mt-0.5">Printed tax invoice</span>
            </button>

            <button
              onClick={() => handleSelect('Other')}
              className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 hover:border-purple-500 hover:bg-purple-50/50 dark:hover:bg-purple-950/40 transition-all text-center group active:scale-95"
            >
              <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-900/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
                <Bell className="w-6 h-6" />
              </div>
              <span className="font-bold text-sm text-slate-800 dark:text-slate-200 group-hover:text-purple-700 dark:group-hover:text-purple-300">
                {t.other}
              </span>
              <span className="text-[11px] text-slate-400 mt-0.5">Napkins, cutlery, etc.</span>
            </button>
          </div>
        )}

        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors"
          >
            {t.cancel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CallWaiterModal;

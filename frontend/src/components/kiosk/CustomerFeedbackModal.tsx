import React, { useState } from 'react';
import { useKiosk } from '../../context/KioskContext';
import { Order } from '../../types';
import { getAssignedWaiter } from '../../utils/waiterAssignment';
import { 
  Star, 
  X, 
  Check, 
  Utensils, 
  Heart,
  Receipt
} from 'lucide-react';

interface CustomerFeedbackModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenReceipt?: () => void;
  onReturnToMenu?: () => void;
}

export const CustomerFeedbackModal: React.FC<CustomerFeedbackModalProps> = ({
  order,
  isOpen,
  onClose,
  onOpenReceipt,
  onReturnToMenu,
}) => {
  const { tableNumber, submitFeedback, updateOrderStatus, showToast } = useKiosk();

  const targetTable = order?.tableNumber || tableNumber || 12;
  const waiter = getAssignedWaiter(targetTable);

  // 3 Essential Ratings
  const [mealRating, setMealRating] = useState<number>(5);
  const [hoverMealRating, setHoverMealRating] = useState<number>(0);

  const [waiterRating, setWaiterRating] = useState<number>(5);
  const [hoverWaiterRating, setHoverWaiterRating] = useState<number>(0);

  const [ambianceRating, setAmbianceRating] = useState<number>(5);
  const [hoverAmbianceRating, setHoverAmbianceRating] = useState<number>(0);

  // Curated, non-cluttered compliment tags
  const [selectedTags, setSelectedTags] = useState<string[]>([
    'Delicious Food',
    'Attentive Waiter'
  ]);

  const [comment, setComment] = useState('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  if (!isOpen) return null;

  const quickPraiseTags = [
    'Delicious Food',
    'Hot & Fresh',
    'Attentive Waiter',
    'Quick Service',
    'Pleasant Ambiance'
  ];

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const overallRating = Math.round((mealRating + waiterRating + ambianceRating) / 3);
    const feedbackComment = comment.trim()
      ? `${comment.trim()} [Waiter: ${waiter.fullName} • Table ${targetTable}]`
      : `Splendid dining at Table ${targetTable}. Hospitality by Waiter ${waiter.fullName} and delicious meal.`;

    submitFeedback(overallRating, selectedTags, feedbackComment);

    if (order?.id) {
      updateOrderStatus(order.id, 'COMPLETED');
    }

    setIsSubmitted(true);
    showToast(`Thank you! Feedback recorded for Waiter ${waiter.name}.`);
  };

  const handleReturn = () => {
    onClose();
    if (onReturnToMenu) {
      onReturnToMenu();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-slate-900 text-slate-100 rounded-3xl shadow-2xl border border-white/10 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle Warm Accent Bar */}
        <div className="h-1 bg-gradient-to-r from-amber-400/40 via-amber-400 to-amber-400/40" />

        {/* CLEAN, CALM HEADER */}
        <div className="px-6 py-4 border-b border-white/[0.08] flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold tracking-wider text-amber-400 uppercase">
              Table {targetTable} {order && `• Order #${order.orderNumber}`}
            </span>
            <h3 className="text-lg font-bold text-white tracking-tight mt-0.5">
              {isSubmitted ? 'Thank You' : 'How Was Your Dining Experience?'}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-slate-400 hover:text-white transition-colors flex items-center justify-center cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* CONTENT */}
        {isSubmitted ? (
          /* ==============================================================
             ELEGANT, MINIMALIST THANK YOU CARD
             ============================================================== */
          <div className="p-8 text-center space-y-6 my-auto animate-in zoom-in-95 duration-200">
            {/* Gentle Warm Heart Emblem */}
            <div className="w-16 h-16 rounded-2xl bg-amber-400/10 border border-amber-400/30 text-amber-400 mx-auto flex items-center justify-center shadow-lg shadow-amber-500/10">
              <Heart className="w-8 h-8 fill-amber-400/30 text-amber-400" />
            </div>

            {/* Gratitude Message */}
            <div className="space-y-2">
              <h4 className="text-2xl font-bold text-white tracking-tight">
                Thank You for Dining with Us!
              </h4>
              <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
                Your ratings and compliments have been shared with{' '}
                <strong className="text-amber-300 font-semibold">Waiter {waiter.fullName}</strong>{' '}
                and our kitchen team.
              </p>
            </div>

            {/* Clean Summary Pill */}
            <div className="p-3 rounded-2xl bg-slate-800/60 border border-white/5 flex items-center justify-around text-center max-w-sm mx-auto">
              <div>
                <span className="text-[10px] uppercase font-medium text-slate-400 block">Food</span>
                <span className="text-xs font-bold text-amber-300">⭐ {mealRating}.0</span>
              </div>
              <div className="w-px h-6 bg-white/10" />
              <div>
                <span className="text-[10px] uppercase font-medium text-slate-400 block">Waiter {waiter.name}</span>
                <span className="text-xs font-bold text-amber-300">⭐ {waiterRating}.0</span>
              </div>
              <div className="w-px h-6 bg-white/10" />
              <div>
                <span className="text-[10px] uppercase font-medium text-slate-400 block">Ambiance</span>
                <span className="text-xs font-bold text-amber-300">⭐ {ambianceRating}.0</span>
              </div>
            </div>

            {/* Respectful Hospitality Note */}
            <p className="text-xs text-slate-400 italic">
              “It was a pleasure serving you at Royal Ember. We hope to welcome you back soon!”
            </p>

            {/* Primary Action Button */}
            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleReturn}
                className="py-3 px-6 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-md shadow-amber-400/20 active:scale-95 transition-all cursor-pointer"
              >
                Return to Table Menu
              </button>

              {onOpenReceipt && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenReceipt();
                  }}
                  className="py-3 px-4 rounded-2xl bg-white/[0.06] hover:bg-white/[0.12] text-slate-300 hover:text-white border border-white/10 font-medium text-xs active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Receipt className="w-3.5 h-3.5 text-slate-400" />
                  <span>View Receipt</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          /* ==============================================================
             CALM, CLEAN & NON-IRRITATING RATING FORM
             ============================================================== */
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            
            {/* 1. MEAL RATING ROW */}
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-amber-400">
                  <Utensils className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Meal & Food Quality</h4>
                  <span className="text-[11px] text-slate-400">Taste, freshness & temperature</span>
                </div>
              </div>

              {/* 5 Stars */}
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => {
                  const isFilled = (hoverMealRating || mealRating) >= star;
                  return (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverMealRating(star)}
                      onMouseLeave={() => setHoverMealRating(0)}
                      onClick={() => setMealRating(star)}
                      className="p-1 hover:scale-110 active:scale-95 transition-transform cursor-pointer"
                      aria-label={`Rate food ${star} stars`}
                    >
                      <Star
                        className={`w-6 h-6 transition-colors ${
                          isFilled
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-700'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. PROMINENT WAITER RATING ROW */}
            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-amber-400/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${waiter.avatarBg} text-white shrink-0`}>
                  {waiter.initial}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                      Assigned Waiter
                    </span>
                  </div>
                  {/* PROMINENT WAITER NAME */}
                  <h4 className="text-sm font-bold text-white tracking-tight">
                    Waiter {waiter.fullName}
                  </h4>
                  <span className="text-[11px] text-slate-400">
                    Floor Service • Zone {waiter.zone}
                  </span>
                </div>
              </div>

              {/* 5 Stars for Waiter */}
              <div className="flex items-center gap-1 self-end sm:self-center">
                {[1, 2, 3, 4, 5].map((star) => {
                  const isFilled = (hoverWaiterRating || waiterRating) >= star;
                  return (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverWaiterRating(star)}
                      onMouseLeave={() => setHoverWaiterRating(0)}
                      onClick={() => setWaiterRating(star)}
                      className="p-1 hover:scale-110 active:scale-95 transition-transform cursor-pointer"
                      aria-label={`Rate waiter ${star} stars`}
                    >
                      <Star
                        className={`w-6 h-6 transition-colors ${
                          isFilled
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-700'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. RESTAURANT AMBIANCE ROW */}
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div>
                <h4 className="text-xs font-bold text-white">Restaurant Ambiance</h4>
                <span className="text-[11px] text-slate-400">Atmosphere, cleanliness & music</span>
              </div>

              {/* 5 Stars */}
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => {
                  const isFilled = (hoverAmbianceRating || ambianceRating) >= star;
                  return (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverAmbianceRating(star)}
                      onMouseLeave={() => setHoverAmbianceRating(0)}
                      onClick={() => setAmbianceRating(star)}
                      className="p-1 hover:scale-110 active:scale-95 transition-transform cursor-pointer"
                      aria-label={`Rate ambiance ${star} stars`}
                    >
                      <Star
                        className={`w-6 h-6 transition-colors ${
                          isFilled
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-700'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* QUICK COMPLIMENT PILLS (CLEAN & SUBTLE) */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-medium text-slate-400 block">
                Quick Compliments (Optional):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {quickPraiseTags.map((tag) => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1 rounded-xl text-xs font-medium transition-colors cursor-pointer border ${
                        isSelected
                          ? 'bg-amber-400 text-slate-950 border-amber-400 font-semibold'
                          : 'bg-white/[0.04] text-slate-300 border-white/10 hover:bg-white/[0.08]'
                      }`}
                    >
                      {tag} {isSelected && '✓'}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* COMPACT COMMENT BOX */}
            <div className="space-y-1">
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={`Leave a note for Waiter ${waiter.name} or the Chef (optional)...`}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
              />
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-md shadow-amber-400/20 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Submit Feedback</span>
            </button>

          </form>
        )}

      </div>
    </div>
  );
};

export default CustomerFeedbackModal;

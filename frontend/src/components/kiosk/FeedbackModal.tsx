import React, { useState } from 'react';
import { useKiosk } from '../../context/KioskContext';
import { 
  Star, 
  X, 
  CheckCircle2, 
  Sparkles, 
  Heart, 
  MessageSquare 
} from 'lucide-react';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
  const { t, submitFeedback, tableNumber, currentTrackedOrder } = useKiosk();

  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [selectedTags, setSelectedTags] = useState<string[]>(['Food Quality', 'Speed of Service']);
  const [comment, setComment] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const tagOptions = [
    'Food Quality',
    'Speed of Service',
    'Kiosk Ease of Use',
    'Food Temperature',
    'Staff Courtesy',
    'Value for Money'
  ];

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => 
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitFeedback(
      rating,
      selectedTags,
      comment.trim() || 'Great food and effortless table ordering experience!'
    );
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <span className="text-xs uppercase font-extrabold text-brand-600 tracking-wider">
              Table {tableNumber} Experience
            </span>
            <h3 className="font-black text-xl text-slate-900 font-display">
              {t.feedbackTitle}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="py-12 text-center animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-black text-slate-900 mb-1">
              {t.feedbackThankYou}
            </h4>
            <p className="text-xs text-slate-500 mb-4">
              Your feedback is now visible on the Management Analytics Dashboard.
            </p>
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" /> Synchronized to Restaurant HQ
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="py-4 space-y-5">
            
            {/* Interactive Stars */}
            <div className="flex flex-col items-center justify-center pt-2">
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => {
                  const isFilled = (hoverRating || rating) >= star;
                  return (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="p-1 text-slate-200 hover:scale-110 active:scale-95 transition-all"
                    >
                      <Star
                        className={`w-9 h-9 transition-colors ${
                          isFilled
                            ? 'text-amber-400 fill-amber-400 drop-shadow-sm'
                            : 'text-slate-200'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
              <span className="text-xs font-bold text-slate-600 mt-2">
                {rating === 5 && 'Excellent! Exceeded expectations'}
                {rating === 4 && 'Very Good dining experience'}
                {rating === 3 && 'Average service'}
                {rating === 2 && 'Needs improvement'}
                {rating === 1 && 'Disappointing visit'}
              </span>
            </div>

            {/* Quick Tag Pills */}
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-600 mb-2">
                What did you like most?
              </label>
              <div className="flex flex-wrap gap-1.5">
                {tagOptions.map((tag) => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                        isSelected
                          ? 'bg-brand-50 border-brand-500 text-brand-900 shadow-2xs'
                          : 'bg-slate-50 border-slate-200/80 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {tag} {isSelected && '✓'}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Comment Area */}
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-600 mb-1.5">
                Detailed Feedback (Optional)
              </label>
              <textarea
                rows={3}
                placeholder={t.feedbackCommentPlaceholder}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 resize-none transition-all"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-700 hover:to-brand-600 text-white font-extrabold text-sm shadow-xl shadow-brand-500/25 active:scale-98 transition-all flex items-center justify-center gap-2"
            >
              <span>{t.submitFeedback}</span>
              <Sparkles className="w-4 h-4 text-amber-200" />
            </button>

          </form>
        )}

      </div>
    </div>
  );
};

export default FeedbackModal;

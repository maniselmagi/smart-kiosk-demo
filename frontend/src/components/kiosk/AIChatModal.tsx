import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useKiosk } from '../../context/KioskContext';
import { MenuItem, Order } from '../../types';
import { 
  Sparkles, 
  Send, 
  X, 
  RotateCcw, 
  Clock, 
  Crown, 
  Star, 
  Bell, 
  ShoppingBag, 
  ChefHat, 
  Plus, 
  Check, 
  Bot, 
  ArrowRight,
  HelpCircle,
  Flame,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Radio
} from 'lucide-react';
import { 
  processCustomerQuery, 
  AIResponse, 
  AVAILABLE_QUESTION_PROMPTS 
} from '../../services/aiConciergeService';
import { getAssignedWaiter, getLocalizedWaiterName } from '../../utils/waiterAssignment';
import { getLocalizedItemName, getLocalizedItemDescription } from '../../utils/translations';
import { getEntertainmentText } from '../../utils/entertainmentTranslations';
import {
  getVoiceConfig,
  createSpeechRecognition,
  speakWithVoice,
  stopSpeech,
  isSpeechRecognitionSupported,
  IBrowserSpeechRecognition
} from '../../services/voiceChatService';

interface AIChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenItemDetail?: (item: MenuItem) => void;
  onOpenOrderTracker?: () => void;
  onCallWaiterModal?: () => void;
}

export const AIChatModal: React.FC<AIChatModalProps> = ({
  isOpen,
  onClose,
  onOpenItemDetail,
  onOpenOrderTracker,
  onCallWaiterModal
}) => {
  const { 
    menuItems, 
    tableNumber, 
    addToCart, 
    showToast, 
    activeOrders, 
    currentTrackedOrder,
    callWaiter,
    language = 'en',
    t
  } = useKiosk();

  const assignedWaiter = getAssignedWaiter(tableNumber);
  const activeOrder: Order | null = currentTrackedOrder || activeOrders.find(o => o.tableNumber === tableNumber && o.status !== 'COMPLETED') || null;

  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [addedItemIds, setAddedItemIds] = useState<Record<string, boolean>>({});

  // Voice Chat State
  const [isListening, setIsListening] = useState(false);
  const [interimSpeechText, setInterimSpeechText] = useState('');
  const [autoVoiceReply, setAutoVoiceReply] = useState(true);
  const recognitionRef = useRef<IBrowserSpeechRecognition | null>(null);

  const voiceConfig = useMemo(() => getVoiceConfig(language), [language]);

  // Localized welcome greeting factory
  const initialGreeting = useMemo<AIResponse>(() => {
    const rawGreeting = t.aiChatGreeting || "Namaste & Welcome to Table {table}! I am Kio, your dedicated AI dining concierge at Royal Ember. You can ask me about our Signature dishes, top ratings, opening hours, spice customizations, or call your waiter. How may I assist you today?";
    const text = rawGreeting.replace('{table}', tableNumber.toString());

    return {
      id: 'welcome-1',
      sender: 'ai',
      text,
      suggestedQuestions: [
        `👑 ${t.aiChatQuickSignatures || 'Signature Foods'}`,
        `⭐ ${t.aiChatQuickTopRated || 'Top Rated (4.8★+)'}`,
        `🕒 ${t.aiChatQuickTimings || 'Shop Timings'}`,
        `🌿 ${t.aiChatQuickVeg || 'Pure Veg'}`,
        `🔔 ${t.aiChatQuickCallWaiter || 'Call Waiter'}`
      ],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  }, [language, tableNumber, t]);

  const [messages, setMessages] = useState<AIResponse[]>([initialGreeting]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const prevLangRef = useRef(language);

  // Update initial message and reset chat when language changes
  useEffect(() => {
    if (prevLangRef.current !== language) {
      prevLangRef.current = language;
      setMessages([initialGreeting]);
      stopSpeech();
      if (recognitionRef.current) {
        recognitionRef.current.abort();
        setIsListening(false);
      }
    } else {
      setMessages(prev => {
        if (prev.length <= 1) {
          return [initialGreeting];
        }
        return prev;
      });
    }
  }, [language, initialGreeting]);

  // Cleanup voice on unmount or close
  useEffect(() => {
    return () => {
      stopSpeech();
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  // Auto-scroll to bottom of conversation
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isTyping, isOpen, interimSpeechText]);

  // Voice Chat: Start Speech Recognition
  const startListening = () => {
    if (!isSpeechRecognitionSupported()) {
      showToast(voiceConfig.unsupportedText);
      return;
    }

    stopSpeech();

    try {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
      }

      const rec = createSpeechRecognition(language);
      if (!rec) {
        showToast(voiceConfig.unsupportedText);
        return;
      }

      rec.onstart = () => {
        setIsListening(true);
        setInterimSpeechText('');
      };

      rec.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const item = event.results[i];
          const transcriptPart = item[0]?.transcript || '';
          if (item.isFinal) {
            finalTranscript += transcriptPart;
          } else {
            interimTranscript += transcriptPart;
          }
        }

        const currentText = (finalTranscript || interimTranscript).trim();
        if (currentText) {
          setInterimSpeechText(currentText);
        }

        if (finalTranscript.trim()) {
          setIsListening(false);
          setInterimSpeechText('');
          try {
            rec.stop();
          } catch {
            // ignore
          }
          handleSendMessage(finalTranscript.trim(), true);
        }
      };

      rec.onerror = (err: any) => {
        console.warn('Speech recognition warning:', err);
        setIsListening(false);
        if (err?.error === 'not-allowed' || err?.error === 'service-not-allowed') {
          showToast(voiceConfig.micDeniedText);
        }
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
      rec.start();
    } catch (err) {
      console.error('Speech recognition start failed:', err);
      setIsListening(false);
    }
  };

  // Voice Chat: Stop Speech Recognition
  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
    }
    setIsListening(false);
    if (interimSpeechText.trim()) {
      handleSendMessage(interimSpeechText.trim(), true);
    }
    setInterimSpeechText('');
  };

  const handleToggleVoice = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  if (!isOpen) return null;

  // Handle sending a message
  const handleSendMessage = (textToSend?: string, wasVoiceInput: boolean = false) => {
    const query = (textToSend || inputMessage).trim();
    if (!query) return;

    const userMessage: AIResponse = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Natural assistant thinking delay (350ms - 550ms)
    setTimeout(() => {
      const response = processCustomerQuery(
        query,
        menuItems,
        tableNumber,
        getLocalizedWaiterName(assignedWaiter.name, language),
        activeOrder,
        language
      );
      setMessages(prev => [...prev, response]);
      setIsTyping(false);

      // Auto Speak Response if Voice Reply is enabled or user spoke query
      if (autoVoiceReply || wasVoiceInput) {
        speakWithVoice(response.text, language);
      }
    }, 450);
  };

  // Quick add item to cart from AI recommendation
  const handleQuickAdd = (item: MenuItem, e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(item, 'Mild', [], 'Ordered via Kio AI', 1);
    setAddedItemIds(prev => ({ ...prev, [item.id]: true }));
    const localizedName = getLocalizedItemName(item, language);
    showToast(`✨ ${localizedName} (₹${item.price}) ${t.added}`);

    setTimeout(() => {
      setAddedItemIds(prev => ({ ...prev, [item.id]: false }));
    }, 2500);
  };

  // Execute AI action button
  const handleActionClick = (action: NonNullable<AIResponse['action']>) => {
    if (action.type === 'call_waiter') {
      callWaiter('Need Assistance');
      if (onCallWaiterModal) {
        onCallWaiterModal();
      } else {
        showToast(`🔔 ${getLocalizedWaiterName(assignedWaiter.name, language)} - ${t.staffNotified || 'Staff Notified'}!`);
      }
    } else if (action.type === 'track_order') {
      if (onOpenOrderTracker) {
        stopSpeech();
        onClose();
        onOpenOrderTracker();
      }
    } else if (action.type === 'open_cart') {
      stopSpeech();
      onClose();
    }
  };

  // Reset conversation to fresh start
  const handleResetChat = () => {
    stopSpeech();
    setMessages([initialGreeting]);
    showToast('🔄 Kio conversation reset.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl h-[88vh] max-h-[800px] bg-slate-900/95 text-slate-100 rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.85)] border border-amber-500/30 overflow-hidden flex flex-col relative backdrop-blur-2xl animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/4 right-1/4 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent blur-[2px]" />

        {/* 1. CHATBOX HEADER: Branded Name & Status */}
        <div className="bg-gradient-to-b from-amber-950/40 via-slate-900 to-slate-900 p-4 sm:p-5 border-b border-white/[0.08] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            {/* High-Tech AI Bot Avatar Badge */}
            <div className="relative">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-amber-400 text-white flex items-center justify-center shadow-lg shadow-violet-500/30 border border-violet-400/40">
                <Bot className="w-6 h-6 stroke-[2.5]" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-slate-900" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                {/* Official Chatbox Name */}
                <h3 className="font-display font-black text-base sm:text-lg text-white tracking-tight flex items-center gap-2">
                  <span>{getEntertainmentText(language).kioAiLabel}</span>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-gradient-to-r from-violet-500/20 to-amber-500/20 text-amber-300 border border-amber-400/40">
                    {t.aiChatLabel || 'AI Chatbox'}
                  </span>
                </h3>

                {/* Active Speech Language Pill */}
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-bold">
                  <Mic className="w-2.5 h-2.5 text-purple-400" />
                  <span>{voiceConfig.flag} {voiceConfig.nativeName} ({voiceConfig.code})</span>
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                <span className="flex items-center gap-1 text-emerald-400 font-semibold text-[11px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {t.aiChatLiveAssistant || 'Live Table Assistant'}
                </span>
                <span>•</span>
                <span className="text-amber-300/90 font-medium text-[11px]">{t.table} {tableNumber}</span>
                <span>•</span>
                <span className="text-slate-400 text-[11px]">{t.serverLabel || 'Server'}: {getLocalizedWaiterName(assignedWaiter.name, language, false)}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Auto Voice Reply Toggle */}
            <button
              type="button"
              onClick={() => {
                const next = !autoVoiceReply;
                setAutoVoiceReply(next);
                if (!next) stopSpeech();
                showToast(next ? `🔊 Voice Reply Enabled (${voiceConfig.nativeName})` : '🔇 Voice Reply Muted');
              }}
              className={`w-9 h-9 rounded-2xl transition-all flex items-center justify-center cursor-pointer border active:scale-95 ${
                autoVoiceReply
                  ? 'bg-amber-500/20 text-amber-300 border-amber-400/40 shadow-sm'
                  : 'bg-white/[0.05] hover:bg-white/[0.12] text-slate-400 border-white/5'
              }`}
              title={autoVoiceReply ? 'Mute AI Voice Reply' : 'Enable AI Voice Reply'}
              aria-label="Toggle AI Voice Reply"
            >
              {autoVoiceReply ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
            </button>

            {/* Reset Chat */}
            <button
              type="button"
              onClick={handleResetChat}
              className="w-9 h-9 rounded-2xl bg-white/[0.05] hover:bg-white/[0.12] text-slate-400 hover:text-white transition-all flex items-center justify-center cursor-pointer border border-white/5 active:scale-95"
              title="Clear & Restart Chat"
              aria-label="Clear Chat"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Close */}
            <button
              type="button"
              onClick={() => {
                stopSpeech();
                if (recognitionRef.current) {
                  try {
                    recognitionRef.current.abort();
                  } catch {
                    // ignore
                  }
                }
                onClose();
              }}
              className="w-9 h-9 rounded-2xl bg-white/[0.05] hover:bg-white/[0.12] text-slate-400 hover:text-white transition-all flex items-center justify-center cursor-pointer border border-white/5 active:scale-95"
              aria-label="Close Chatbox"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 2. PERSISTENT QUICK SHORTCUT CHIPS */}
        <div className="px-4 py-2 bg-slate-950/60 border-b border-white/[0.06] overflow-x-auto custom-scrollbar flex items-center gap-2 shrink-0 select-none">
          <span className="text-[10px] uppercase font-bold text-amber-400/80 tracking-wider shrink-0 flex items-center gap-1">
            <HelpCircle className="w-3 h-3" /> Quick:
          </span>
          <button
            type="button"
            onClick={() => handleSendMessage(t.aiChatQuickSignatures || 'Signature Foods')}
            className="px-2.5 py-1 rounded-full bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[11px] font-bold shrink-0 transition-all active:scale-95 cursor-pointer flex items-center gap-1"
          >
            <Crown className="w-3 h-3" /> {t.aiChatQuickSignatures || 'Signature Foods'}
          </button>
          <button
            type="button"
            onClick={() => handleSendMessage(t.aiChatQuickTopRated || 'Top Rated (4.8★+)')}
            className="px-2.5 py-1 rounded-full bg-yellow-400/10 hover:bg-yellow-400/20 text-yellow-300 border border-yellow-400/30 text-[11px] font-bold shrink-0 transition-all active:scale-95 cursor-pointer flex items-center gap-1"
          >
            <Star className="w-3 h-3" /> {t.aiChatQuickTopRated || 'Top Rated (4.8★+)'}
          </button>
          <button
            type="button"
            onClick={() => handleSendMessage(t.aiChatQuickTimings || 'Shop Timings')}
            className="px-2.5 py-1 rounded-full bg-emerald-400/10 hover:bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 text-[11px] font-bold shrink-0 transition-all active:scale-95 cursor-pointer flex items-center gap-1"
          >
            <Clock className="w-3 h-3" /> {t.aiChatQuickTimings || 'Shop Timings'}
          </button>
          <button
            type="button"
            onClick={() => handleSendMessage(t.aiChatQuickVeg || 'Pure Veg')}
            className="px-2.5 py-1 rounded-full bg-teal-400/10 hover:bg-teal-400/20 text-teal-300 border border-teal-400/30 text-[11px] font-bold shrink-0 transition-all active:scale-95 cursor-pointer flex items-center gap-1"
          >
            🌿 {t.aiChatQuickVeg || 'Pure Veg'}
          </button>
          <button
            type="button"
            onClick={() => handleSendMessage(t.aiChatQuickMild || 'Mild for Kids')}
            className="px-2.5 py-1 rounded-full bg-sky-400/10 hover:bg-sky-400/20 text-sky-300 border border-sky-400/30 text-[11px] font-bold shrink-0 transition-all active:scale-95 cursor-pointer flex items-center gap-1"
          >
            🌶️ {t.aiChatQuickMild || 'Mild for Kids'}
          </button>
          <button
            type="button"
            onClick={() => handleSendMessage(t.aiChatQuickCallWaiter || 'Call Waiter')}
            className="px-2.5 py-1 rounded-full bg-rose-400/10 hover:bg-rose-400/20 text-rose-300 border border-rose-400/30 text-[11px] font-bold shrink-0 transition-all active:scale-95 cursor-pointer flex items-center gap-1"
          >
            <Bell className="w-3 h-3" /> {t.aiChatQuickCallWaiter || 'Call Waiter'}
          </button>
        </div>

        {/* 3. CHAT MESSAGES SCROLL AREA */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 custom-scrollbar">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';

            return (
              <div 
                key={msg.id} 
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'} animate-in fade-in duration-200`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 flex items-center justify-center shrink-0 shadow-md shadow-amber-500/20 border border-amber-300/40">
                    <Bot className="w-4 h-4 stroke-[2.5]" />
                  </div>
                )}

                <div className={`max-w-[85%] sm:max-w-[78%] space-y-3 ${isUser ? 'items-end' : 'items-start'}`}>
                  {/* Message Bubble */}
                  <div 
                    className={`p-3.5 sm:p-4 rounded-3xl text-xs sm:text-sm leading-relaxed ${
                      isUser 
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-semibold rounded-tr-xs shadow-md shadow-amber-500/20' 
                        : 'bg-slate-800/90 text-slate-200 border border-white/10 rounded-tl-xs shadow-md'
                    }`}
                  >
                    <div className="whitespace-pre-line prose prose-invert prose-xs max-w-none">
                      {msg.text.split('\n').map((line, idx) => {
                        if (line.startsWith('👑 ') || line.startsWith('⭐ ') || line.startsWith('🕒 ') || line.startsWith('🌿 ') || line.startsWith('🌶️ ') || line.startsWith('🔔 ') || line.startsWith('💳 ') || line.startsWith('🍳 ') || line.startsWith('📋 ') || line.startsWith('🌧️ ') || line.startsWith('🎉 ') || line.startsWith('💪 ') || line.startsWith('📶 ') || line.startsWith('📍 ') || line.startsWith('🤖 ')) {
                          return (
                            <h4 key={idx} className="font-display font-black text-amber-300 text-sm mb-1 mt-0.5">
                              {line.replace(/\*\*/g, '')}
                            </h4>
                          );
                        }
                        return <p key={idx} className="my-0.5">{line}</p>;
                      })}
                    </div>

                    {/* Timestamp & Listen Button */}
                    <div className="flex items-center justify-between text-[10px] text-slate-500 mt-2 pt-1.5 border-t border-white/5">
                      <span>{msg.timestamp}</span>
                      {!isUser && (
                        <button
                          type="button"
                          onClick={() => speakWithVoice(msg.text, language)}
                          className="flex items-center gap-1 text-slate-400 hover:text-amber-300 transition-colors cursor-pointer px-1.5 py-0.5 rounded-md hover:bg-white/5 font-semibold"
                          title="Listen to this message"
                        >
                          <Volume2 className="w-3 h-3 text-amber-400" />
                          <span>Listen ({voiceConfig.name})</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* RECOMMENDED FOOD CARDS */}
                  {msg.highlightItems && msg.highlightItems.length > 0 && (
                    <div className="grid grid-cols-1 gap-2 pt-1 w-full">
                      {msg.highlightItems.map((item: MenuItem) => {
                        const isAdded = addedItemIds[item.id];
                        const localizedName = getLocalizedItemName(item, language);
                        const localizedDesc = getLocalizedItemDescription(item, language);

                        return (
                          <div 
                            key={item.id}
                            onClick={() => onOpenItemDetail && onOpenItemDetail(item)}
                            className="p-2.5 rounded-2xl bg-slate-800/80 hover:bg-slate-750 border border-white/10 hover:border-amber-400/40 transition-all flex items-center justify-between gap-3 group cursor-pointer shadow-md"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-white/10 shadow-xs">
                                <img 
                                  src={item.image} 
                                  alt={localizedName}
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                                {item.isSignature && (
                                  <span className="absolute top-0.5 left-0.5 p-0.5 rounded-md bg-amber-500 text-slate-950 shadow-xs">
                                    <Crown className="w-2.5 h-2.5" />
                                  </span>
                                )}
                              </div>

                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <span className={`w-2 h-2 rounded-full shrink-0 ${item.isVeg ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                                  <h5 className="font-bold text-xs text-white truncate group-hover:text-amber-300 transition-colors">
                                    {localizedName}
                                  </h5>
                                </div>
                                <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                                  {localizedDesc}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <span className="font-mono font-black text-amber-400 text-xs">
                                ₹{item.price}
                              </span>

                              <button
                                type="button"
                                onClick={(e) => handleQuickAdd(item, e)}
                                className={`px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all active:scale-90 cursor-pointer ${
                                  isAdded 
                                    ? 'bg-emerald-500 text-slate-950 font-black' 
                                    : 'bg-amber-400 hover:bg-amber-300 text-slate-950 font-black shadow-xs'
                                }`}
                                title="Add to order"
                              >
                                {isAdded ? (
                                  <>
                                    <Check className="w-3 h-3 stroke-[3]" />
                                    <span>{t.aiChatQuickAdded || 'Added'}</span>
                                  </>
                                ) : (
                                  <>
                                    <Plus className="w-3 h-3 stroke-[3]" />
                                    <span>{t.aiChatQuickAdd || 'Add'} ₹{item.price}</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* ACTION TRIGGER BUTTON */}
                  {msg.action && (
                    <button
                      type="button"
                      onClick={() => handleActionClick(msg.action!)}
                      className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 text-slate-950 text-xs font-black shadow-md shadow-amber-500/20 hover:from-amber-400 hover:to-yellow-300 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                    >
                      <span>{msg.action.label}</span>
                      <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                    </button>
                  )}

                  {/* SUGGESTED FOLLOW-UP CHIPS */}
                  {msg.suggestedQuestions && msg.suggestedQuestions.length > 0 && (
                    <div className="space-y-1.5 pt-1 w-full">
                      {msg.isFallback && (
                        <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400/90 block">
                          {t.recommendedForYou || 'Suggested Topics'}:
                        </span>
                      )}
                      <div className="flex flex-wrap gap-1.5">
                        {msg.suggestedQuestions.map((q, qIdx) => (
                          <button
                            key={qIdx}
                            type="button"
                            onClick={() => handleSendMessage(q)}
                            className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-amber-300 border border-white/10 hover:border-amber-400/30 text-[11px] font-medium transition-all cursor-pointer text-left active:scale-95 shadow-xs"
                          >
                            {q}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-3 items-center animate-in fade-in duration-200">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 flex items-center justify-center shrink-0 shadow-md">
                <Bot className="w-4 h-4 stroke-[2.5]" />
              </div>
              <div className="px-4 py-3 rounded-2xl bg-slate-800/90 border border-white/10 text-xs text-amber-300 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                <span className="text-[11px] text-slate-400 ml-1 font-medium">{t.aiChatThinking || 'Kio is thinking...'}</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* 4. LIVE SPEECH LISTENING BANNER */}
        {isListening && (
          <div className="px-4 py-2.5 bg-gradient-to-r from-red-950/80 via-slate-900 to-amber-950/80 border-t border-red-500/30 flex items-center justify-between text-xs text-amber-300 animate-in slide-in-from-bottom-2 shrink-0">
            <div className="flex items-center gap-2.5 truncate">
              <span className="relative flex h-3 w-3 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
              </span>
              <span className="font-black text-[11px] text-amber-400 uppercase tracking-wide shrink-0">
                {voiceConfig.flag} {voiceConfig.nativeName} ({voiceConfig.code}):
              </span>
              <span className="truncate text-slate-200 font-semibold italic">
                {interimSpeechText ? `"${interimSpeechText}"` : voiceConfig.speakingPrompt}
              </span>
            </div>
            <button
              type="button"
              onClick={stopListening}
              className="text-[10px] font-black px-2.5 py-1 rounded-lg bg-red-500/20 text-red-300 border border-red-500/40 hover:bg-red-500/30 transition-colors shrink-0 cursor-pointer ml-2 active:scale-95"
            >
              {voiceConfig.tapToStop}
            </button>
          </div>
        )}

        {/* 5. CHAT INPUT BAR WITH MICROPHONE BUTTON */}
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-3 sm:p-4 bg-slate-950/90 border-t border-white/[0.08] flex items-center gap-2.5 shrink-0"
        >
          {/* Dedicated Voice Chat Button */}
          <button
            type="button"
            onClick={handleToggleVoice}
            className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all cursor-pointer shrink-0 active:scale-95 border ${
              isListening
                ? 'bg-red-500/20 text-red-400 border-red-500 shadow-lg shadow-red-500/30 animate-pulse'
                : 'bg-slate-900 hover:bg-slate-800 text-amber-400 border-amber-400/40 hover:border-amber-400 shadow-md'
            }`}
            title={isListening ? voiceConfig.tapToStop : voiceConfig.speakToKio}
            aria-label="Voice Chat"
          >
            {isListening ? (
              <span className="relative flex items-center justify-center">
                <MicOff className="w-5 h-5 text-red-400" />
              </span>
            ) : (
              <Mic className="w-5 h-5" />
            )}
          </button>

          {/* Text Input */}
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={isListening ? voiceConfig.listeningText : (t.aiChatPlaceholder || "Ask Kio (e.g. Signature foods, top ratings, opening hours)...")}
            className="flex-1 bg-slate-900 border border-white/10 focus:border-amber-400/60 rounded-2xl px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-hidden focus:ring-1 focus:ring-amber-400/40 transition-all"
          />

          {/* Send Button */}
          <button
            type="submit"
            disabled={!inputMessage.trim()}
            className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all cursor-pointer shrink-0 active:scale-95 ${
              inputMessage.trim() 
                ? 'bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 shadow-lg shadow-amber-500/25' 
                : 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-60'
            }`}
            aria-label="Send message"
          >
            <Send className="w-4 h-4 stroke-[2.5]" />
          </button>
        </form>

      </div>
    </div>
  );
};

export default AIChatModal;

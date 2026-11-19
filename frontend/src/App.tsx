import React, { useState, useEffect, useMemo } from 'react';
import { Capacitor } from '@capacitor/core';
import { KioskProvider, useKiosk } from './context/KioskContext';
import { DemoNavigation } from './components/common/DemoNavigation';
import { Header } from './components/common/Header';
import { LandingHub } from './components/hub/LandingHub';
import { WelcomeScreen } from './components/kiosk/WelcomeScreen';
import { MenuScreen } from './components/kiosk/MenuScreen';
import { FoodDetailModal } from './components/kiosk/FoodDetailModal';
import { CartDrawerModal } from './components/kiosk/CartDrawerModal';
import { CheckoutModal } from './components/kiosk/CheckoutModal';
import { DigitalReceiptModal } from './components/kiosk/DigitalReceiptModal';
import { OrderTrackerModal } from './components/kiosk/OrderTrackerModal';
import { FeedbackModal } from './components/kiosk/FeedbackModal';
import { CustomerEntertainmentModal } from './components/kiosk/CustomerEntertainmentModal';
import { FinishMealModal } from './components/kiosk/FinishMealModal';
import { KitchenDisplay } from './components/kitchen/KitchenDisplay';
import { ManagementDashboard } from './components/dashboard/ManagementDashboard';
import { LanguageSelectionModal } from './components/kiosk/LanguageSelectionModal';
import { LanguageEntryScreen } from './components/kiosk/LanguageEntryScreen';
import { CustomerTableAllocationScreen } from './components/kiosk/CustomerTableAllocationScreen';
import { BookingThankYouScreen } from './components/kiosk/BookingThankYouScreen';
import CallWaiterModal from './components/common/CallWaiterModal';
import { AIChatModal } from './components/kiosk/AIChatModal';
import { StaffLoginModal, StaffUser } from './components/auth/StaffLoginModal';
import { authService } from './services/authService';
import { MenuItem, Order } from './types';

const MainAppContent: React.FC = () => {
  const { 
    view, 
    setView, 
    toastMessage, 
    showToast,
    activeOrders,
    currentTrackedOrder, 
    setCurrentTrackedOrder,
    tableNumber,
    completeAllTableOrders,
    isLanguageModalOpen,
    setIsLanguageModalOpen,
    language,
    t
  } = useKiosk();

  // Kiosk inner sub-screen state: Step 1 (welcome) -> Step 2 (language) -> Step 3 (allocation) -> Step 4 (thankyou / menu)
  const [kioskSubScreen, setKioskSubScreen] = useState<'welcome' | 'language' | 'allocation' | 'menu' | 'thankyou'>('welcome');

  // Check if running in dedicated 4-screen Table Booking Kiosk mode (APK or ?mode=booking)
  const isBookingKioskApp = React.useMemo(() => {
    if (Capacitor.isNativePlatform()) return true;
    if (import.meta.env.VITE_APP_MODE === 'booking') return true;
    if (typeof window !== 'undefined') {
      const search = window.location.search.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      const pathname = window.location.pathname.toLowerCase();
      if (search.includes('booking') || hash.includes('booking') || pathname.includes('booking')) return true;
    }
    return false;
  }, []);

  // Unified Staff Login state (Kitchen & Management)
  const [isStaffLoginOpen, setIsStaffLoginOpen] = useState(false);
  const [staffLoginTargetRole, setStaffLoginTargetRole] = useState<'kitchen' | 'management'>('kitchen');

  const handleOpenStaffLogin = (role: 'kitchen' | 'management') => {
    setStaffLoginTargetRole(role);
    setIsStaffLoginOpen(true);
  };

  // Sync with Cloud PostgreSQL database on initial startup
  useEffect(() => {
    authService.syncWithCloud().catch((err) => console.warn('Cloud sync on startup:', err));
  }, []);

  const handleStaffLoginSuccess = (role: 'kitchen' | 'management', staffUser: StaffUser) => {
    setIsStaffLoginOpen(false);
    authService.setCurrentUser(staffUser);
    if (role === 'kitchen') {
      setView('kitchen');
      showToast(`Welcome back ${staffUser.name}! Logged into Kitchen KDS as @${staffUser.username}.`);
    } else {
      setView('dashboard');
      showToast(`Welcome back ${staffUser.name}! Logged into Management Portal as @${staffUser.username}.`);
    }
  };

  // Modals state
  const [selectedItemForDetail, setSelectedItemForDetail] = useState<MenuItem | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isEntertainmentOpen, setIsEntertainmentOpen] = useState(false);
  const [isFinishMealOpen, setIsFinishMealOpen] = useState(false);
  const [isCallWaiterOpen, setIsCallWaiterOpen] = useState(false);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [activeCompletedOrder, setActiveCompletedOrder] = useState<Order | null>(null);

  // All active orders for this specific table (for multi-order tracking)
  const allActiveTableOrders = React.useMemo(() => {
    return activeOrders.filter((o) => o.tableNumber === tableNumber && o.status !== 'COMPLETED');
  }, [activeOrders, tableNumber]);

  // Fresh reactive order from activeOrders so supervisor/waiter status updates sync live
  const liveTrackedOrder = React.useMemo(() => {
    const targetId = activeCompletedOrder?.id || currentTrackedOrder?.id;
    if (targetId) {
      const match = activeOrders.find((o) => o.id === targetId);
      if (match) return match;
    }
    return activeCompletedOrder || currentTrackedOrder || allActiveTableOrders[0] || null;
  }, [activeOrders, activeCompletedOrder, currentTrackedOrder, allActiveTableOrders]);

  const handleOrderSuccess = (newOrder: Order) => {
    setActiveCompletedOrder(newOrder);
    setIsCheckoutOpen(false);
    setIsReceiptOpen(true);
  };

  // Localized helper text for top banner
  const topBarText = useMemo(() => {
    const TOP_BAR_LOCALIZED: Record<string, { downloadApk: string; exitToHub: string; bookingTitle: string }> = {
      en: { downloadApk: 'Download APK (24 MB)', exitToHub: 'Exit to Web Hub', bookingTitle: 'Table Booking & Dining Kiosk' },
      ta: { downloadApk: 'APK பதிவிறக்கு (24 MB)', exitToHub: 'இணைய மையத்திற்குச் செல்', bookingTitle: 'மேஜை முன்பதிவு & உணவு கியோஸ்க்' },
      hi: { downloadApk: 'APK डाउनलोड करें (24 MB)', exitToHub: 'वेब हब पर वापस जाएं', bookingTitle: 'टेबल बुकिंग और भोजन कियोस्क' },
      te: { downloadApk: 'APK డౌన్‌లోడ్ చేయండి (24 MB)', exitToHub: 'వెబ్ హబ్‌కి వెళ్లండి', bookingTitle: 'టేబుల్ బుకింగ్ & డైనింగ్ కియోస్క్' },
      kn: { downloadApk: 'APK ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ (24 MB)', exitToHub: 'ವೆಬ್ ಹಬ್‌ಗೆ ಹಿಂತಿರುಗಿ', bookingTitle: 'ಟೇಬಲ್ ಬುಕಿಂಗ್ ಮತ್ತು ಡೈನಿಂಗ್ ಕಿಯೋಸ್ಕ್' },
      ml: { downloadApk: 'APK ഡൗൺലോഡ് ചെയ്യുക (24 MB)', exitToHub: 'വെബ് ഹബ്ബിലേക്ക് പോകുക', bookingTitle: 'ടേബിൾ ബുക്കിംഗ് & ഡൈനിംഗ് കിയോസ്ക്' },
      mr: { downloadApk: 'APK डाउनलोड करा (24 MB)', exitToHub: 'वेब हबवर परत जा', bookingTitle: 'टेबल बुकिंग आणि डायनिंग कियोस्क' },
      ar: { downloadApk: 'تحميل APK (24 ميجابايت)', exitToHub: 'العودة إلى مركز الويب', bookingTitle: 'كشك حجز الطاولات وتناول الطعام' },
      ko: { downloadApk: 'APK 다운로드 (24 MB)', exitToHub: '웹 허브로 이동', bookingTitle: '테이블 예약 & 다이닝 키오스크' },
      es: { downloadApk: 'Descargar APK (24 MB)', exitToHub: 'Volver al Hub Web', bookingTitle: 'Kiosco de Reserva de Mesas y Comida' },
      fr: { downloadApk: "Télécharger l'APK (24 MB)", exitToHub: 'Quitter vers le Hub Web', bookingTitle: 'Kiosque de Réservation de Table et Repas' },
      de: { downloadApk: 'APK herunterladen (24 MB)', exitToHub: 'Zurück zum Web-Hub', bookingTitle: 'Tischreservierung & Dining Kiosk' }
    };
    return TOP_BAR_LOCALIZED[language] || TOP_BAR_LOCALIZED['en'];
  }, [language]);

  // DEDICATED TABLE BOOKING KIOSK APP FLOW: Welcome -> Allocation -> Digital Menu -> Cart -> Pay & Generate Order -> Live Kitchen
  if (isBookingKioskApp) {
    return (
      <div className="min-h-screen flex flex-col bg-[#080B11] text-white relative">
        {/* Helper bar when previewing in browser (hidden on native APK) */}
        {!Capacitor.isNativePlatform() && (
          <div className="bg-slate-950/95 border-b border-amber-500/20 px-4 py-2 flex items-center justify-between text-xs z-50">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-bold text-amber-300">
                {t.brandName || 'Royal Ember'} • {topBarText.bookingTitle}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <a
                href="./RoyalEmber-TableBooking-Kiosk.apk"
                download="RoyalEmber-TableBooking-Kiosk.apk"
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black shadow transition-all cursor-pointer"
              >
                <span>{topBarText.downloadApk}</span>
              </a>
              <button
                type="button"
                onClick={() => {
                  window.location.href = window.location.pathname;
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition-all cursor-pointer"
              >
                {topBarText.exitToHub}
              </button>
            </div>
          </div>
        )}

        {kioskSubScreen === 'welcome' && (
          <WelcomeScreen
            onStart={() => setKioskSubScreen('allocation')}
            onOpenLanguage={() => setKioskSubScreen('welcome')}
            onOpenStaffLogin={() => handleOpenStaffLogin('kitchen')}
          />
        )}

        {kioskSubScreen === 'language' && (
          <LanguageEntryScreen 
            onBack={() => setKioskSubScreen('welcome')}
            onContinue={() => setKioskSubScreen('allocation')} 
          />
        )}

        {kioskSubScreen === 'allocation' && (
          <CustomerTableAllocationScreen
            onBackToLanguage={() => setKioskSubScreen('welcome')}
            onConfirmAllocation={() => setKioskSubScreen('menu')}
          />
        )}

        {kioskSubScreen === 'menu' && (
          <div className="flex-1 flex flex-col">
            <Header
              showBack={true}
              onBackToWelcome={() => setKioskSubScreen('allocation')}
              onOpenCart={() => setIsCartOpen(true)}
              onOpenTrackOrder={() => setIsTrackerOpen(true)}
              onOpenEntertainment={() => setIsEntertainmentOpen(true)}
              onCallWaiter={() => setIsCallWaiterOpen(true)}
              onOpenAIChat={() => setIsAIChatOpen(true)}
            />

            <MenuScreen
              onSelectItem={(item) => setSelectedItemForDetail(item)}
              onOpenCart={() => setIsCartOpen(true)}
              onOpenOrderTracker={() => setIsTrackerOpen(true)}
              onOpenEntertainment={() => setIsEntertainmentOpen(true)}
              onOpenAIChat={() => setIsAIChatOpen(true)}
            />
          </div>
        )}

        {kioskSubScreen === 'thankyou' && (
          <BookingThankYouScreen
            onDone={() => setKioskSubScreen('welcome')}
          />
        )}

        {/* Floating Toast Notification */}
        {toastMessage && (
          <div className="fixed top-6 right-6 z-50 animate-in slide-in-from-top-2 fade-in duration-200">
            <div className="bg-slate-900/95 backdrop-blur-md text-white text-xs font-bold py-2.5 px-4 rounded-2xl shadow-xl border border-amber-500/30 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span>{toastMessage}</span>
            </div>
          </div>
        )}

        {/* Kiosk Interactive Modals Suite for Full Food Ordering & Checkout Flow */}
        <FoodDetailModal
          item={selectedItemForDetail}
          onClose={() => setSelectedItemForDetail(null)}
        />

        <CartDrawerModal
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          onProceedToCheckout={() => setIsCheckoutOpen(true)}
        />

        <CheckoutModal
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          onOrderSuccess={handleOrderSuccess}
        />

        <DigitalReceiptModal
          order={liveTrackedOrder}
          isOpen={isReceiptOpen}
          onClose={() => setIsReceiptOpen(false)}
          onTrackOrder={() => {
            if (liveTrackedOrder) {
              setActiveCompletedOrder(liveTrackedOrder);
              setCurrentTrackedOrder(liveTrackedOrder);
            }
            setIsReceiptOpen(false);
            setIsTrackerOpen(true);
          }}
          onOpenFeedback={() => setIsFinishMealOpen(true)}
        />

        <OrderTrackerModal
          order={liveTrackedOrder}
          orders={allActiveTableOrders}
          isOpen={isTrackerOpen}
          onClose={() => setIsTrackerOpen(false)}
          onOpenReceipt={() => setIsReceiptOpen(true)}
          onOpenEntertainment={() => setIsEntertainmentOpen(true)}
          onOpenFinishMeal={() => setIsFinishMealOpen(true)}
        />

        <CustomerEntertainmentModal
          isOpen={isEntertainmentOpen}
          onClose={() => setIsEntertainmentOpen(false)}
          order={liveTrackedOrder}
          onOpenTracker={() => setIsTrackerOpen(true)}
          onFinishMeal={() => setIsFinishMealOpen(true)}
        />

        <FinishMealModal
          order={liveTrackedOrder}
          isOpen={isFinishMealOpen}
          onClose={() => setIsFinishMealOpen(false)}
          onFinishDiningSuccess={() => {
            setIsTrackerOpen(false);
            setIsReceiptOpen(false);
            setIsEntertainmentOpen(false);
            setActiveCompletedOrder(null);
            completeAllTableOrders(tableNumber);
            setKioskSubScreen('welcome');
          }}
        />

        <FeedbackModal
          isOpen={isFeedbackOpen}
          onClose={() => setIsFeedbackOpen(false)}
        />

        <CallWaiterModal
          isOpen={isCallWaiterOpen}
          onClose={() => setIsCallWaiterOpen(false)}
        />

        <AIChatModal
          isOpen={isAIChatOpen}
          onClose={() => setIsAIChatOpen(false)}
          onOpenItemDetail={(item) => setSelectedItemForDetail(item)}
          onOpenOrderTracker={() => setIsTrackerOpen(true)}
          onCallWaiterModal={() => setIsCallWaiterOpen(true)}
        />

        <LanguageSelectionModal
          isOpen={isLanguageModalOpen}
          onClose={() => setIsLanguageModalOpen(false)}
          onConfirm={() => setIsLanguageModalOpen(false)}
        />

        <StaffLoginModal
          isOpen={isStaffLoginOpen}
          initialRole={staffLoginTargetRole}
          onClose={() => setIsStaffLoginOpen(false)}
          onLoginSuccess={handleStaffLoginSuccess}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      
      {/* Presentation Demo Navigator (sticky on top) */}
      <DemoNavigation />

      {/* Main View Router */}
      <main className="flex-1 flex flex-col">
        {view === 'hub' && (
          <LandingHub 
            onStartCustomer={() => {
              setView('kiosk');
              setKioskSubScreen('welcome');
            }}
            onOpenStaffLogin={handleOpenStaffLogin}
          />
        )}

        {view === 'kitchen' && <KitchenDisplay />}

        {view === 'dashboard' && <ManagementDashboard />}

        {view === 'kiosk' && (
          <div className="flex-1 flex flex-col">
            {kioskSubScreen === 'welcome' && (
              <WelcomeScreen
                onStart={() => setKioskSubScreen('menu')}
                onOpenLanguage={() => setKioskSubScreen('welcome')}
                onOpenStaffLogin={() => handleOpenStaffLogin('kitchen')}
              />
            )}

            {kioskSubScreen === 'language' && (
              <LanguageEntryScreen 
                onBack={() => setKioskSubScreen('welcome')}
                onContinue={() => setKioskSubScreen('menu')} 
              />
            )}

            {kioskSubScreen === 'menu' && (
              <div className="flex-1 flex flex-col">
                <Header
                  showBack={true}
                  onBackToWelcome={() => setKioskSubScreen('welcome')}
                  onOpenCart={() => setIsCartOpen(true)}
                  onOpenTrackOrder={() => setIsTrackerOpen(true)}
                  onOpenEntertainment={() => setIsEntertainmentOpen(true)}
                  onCallWaiter={() => setIsCallWaiterOpen(true)}
                  onOpenAIChat={() => setIsAIChatOpen(true)}
                />

                <MenuScreen
                  onSelectItem={(item) => setSelectedItemForDetail(item)}
                  onOpenCart={() => setIsCartOpen(true)}
                  onOpenOrderTracker={() => setIsTrackerOpen(true)}
                  onOpenEntertainment={() => setIsEntertainmentOpen(true)}
                  onOpenAIChat={() => setIsAIChatOpen(true)}
                />
              </div>
            )}
          </div>
        )}
      </main>


      {/* Toast Notification Popup */}
      {toastMessage && (
        <div className="fixed top-14 right-4 z-50 animate-in slide-in-from-top-2 fade-in duration-200">
          <div className="bg-slate-900/95 backdrop-blur-md text-white text-xs font-bold py-2.5 px-4 rounded-2xl shadow-xl border border-slate-700/60 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Kiosk Modals */}
      <FoodDetailModal
        item={selectedItemForDetail}
        onClose={() => setSelectedItemForDetail(null)}
      />

      <CartDrawerModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderSuccess={handleOrderSuccess}
      />

      <DigitalReceiptModal
        order={liveTrackedOrder}
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
        onTrackOrder={() => {
          if (liveTrackedOrder) {
            setActiveCompletedOrder(liveTrackedOrder);
            setCurrentTrackedOrder(liveTrackedOrder);
          }
          setIsReceiptOpen(false);
          setIsTrackerOpen(true);
        }}
        onOpenFeedback={() => setIsFinishMealOpen(true)}
      />

      <OrderTrackerModal
        order={liveTrackedOrder}
        orders={allActiveTableOrders}
        isOpen={isTrackerOpen}
        onClose={() => setIsTrackerOpen(false)}
        onOpenReceipt={() => setIsReceiptOpen(true)}
        onOpenEntertainment={() => setIsEntertainmentOpen(true)}
        onOpenFinishMeal={() => setIsFinishMealOpen(true)}
      />

      {/* Table-Side Entertainment Lounge (Ludo, Sudoku, Snakes & Ladders, News Shorts, Music) */}
      <CustomerEntertainmentModal
        isOpen={isEntertainmentOpen}
        onClose={() => setIsEntertainmentOpen(false)}
        order={liveTrackedOrder}
        onOpenTracker={() => setIsTrackerOpen(true)}
        onFinishMeal={() => setIsFinishMealOpen(true)}
      />

      {/* Final Dining Experience & Waiter Tip Modal */}
      <FinishMealModal
        order={liveTrackedOrder}
        isOpen={isFinishMealOpen}
        onClose={() => setIsFinishMealOpen(false)}
        onFinishDiningSuccess={() => {
          setIsTrackerOpen(false);
          setIsReceiptOpen(false);
          setIsEntertainmentOpen(false);
          setActiveCompletedOrder(null);
          completeAllTableOrders(tableNumber);
        }}
      />

      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
      />

      <CallWaiterModal
        isOpen={isCallWaiterOpen}
        onClose={() => setIsCallWaiterOpen(false)}
      />

      {/* Ember AI Concierge Dining Assistant Modal */}
      <AIChatModal
        isOpen={isAIChatOpen}
        onClose={() => setIsAIChatOpen(false)}
        onOpenItemDetail={(item) => setSelectedItemForDetail(item)}
        onOpenOrderTracker={() => setIsTrackerOpen(true)}
        onCallWaiterModal={() => setIsCallWaiterOpen(true)}
      />

      <LanguageSelectionModal
        isOpen={isLanguageModalOpen}
        onClose={() => setIsLanguageModalOpen(false)}
        onConfirm={() => setIsLanguageModalOpen(false)}
      />

      {/* Unified Kitchen & Management Staff Login Modal */}
      <StaffLoginModal
        isOpen={isStaffLoginOpen}
        initialRole={staffLoginTargetRole}
        onClose={() => setIsStaffLoginOpen(false)}
        onLoginSuccess={handleStaffLoginSuccess}
      />

    </div>
  );
};

export const App: React.FC = () => {
  return (
    <KioskProvider>
      <MainAppContent />
    </KioskProvider>
  );
};

export default App;

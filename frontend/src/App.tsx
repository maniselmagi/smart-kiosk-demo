import React, { useState } from 'react';
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
import { MenuItem, Order } from './types';

const MainAppContent: React.FC = () => {
  const { 
    view, 
    setView, 
    toastMessage, 
    activeOrders,
    currentTrackedOrder, 
    setCurrentTrackedOrder,
    isLanguageModalOpen,
    setIsLanguageModalOpen
  } = useKiosk();

  // Kiosk inner sub-screen state: Step 1 (language) -> Step 2 (allocation) -> Step 3 (menu)
  const [kioskSubScreen, setKioskSubScreen] = useState<'language' | 'allocation' | 'menu'>('language');

  // Modals state
  const [selectedItemForDetail, setSelectedItemForDetail] = useState<MenuItem | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isEntertainmentOpen, setIsEntertainmentOpen] = useState(false);
  const [isFinishMealOpen, setIsFinishMealOpen] = useState(false);
  const [activeCompletedOrder, setActiveCompletedOrder] = useState<Order | null>(null);

  // Fresh reactive order from activeOrders so supervisor/waiter status updates sync live
  const liveTrackedOrder = React.useMemo(() => {
    const targetId = activeCompletedOrder?.id || currentTrackedOrder?.id;
    if (targetId) {
      const match = activeOrders.find((o) => o.id === targetId);
      if (match) return match;
    }
    return activeCompletedOrder || currentTrackedOrder;
  }, [activeOrders, activeCompletedOrder, currentTrackedOrder]);

  const handleOrderSuccess = (newOrder: Order) => {
    setActiveCompletedOrder(newOrder);
    setIsCheckoutOpen(false);
    setIsReceiptOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      
      {/* Presentation Demo Navigator (sticky on top) */}
      <DemoNavigation />

      {/* Main View Router */}
      <main className="flex-1 flex flex-col">
        {view === 'hub' && <LandingHub />}

        {view === 'kitchen' && <KitchenDisplay />}

        {view === 'dashboard' && <ManagementDashboard />}

        {view === 'kiosk' && (
          <div className="flex-1 flex flex-col">
            {kioskSubScreen === 'language' && (
              <LanguageEntryScreen 
                onContinue={() => setKioskSubScreen('allocation')} 
              />
            )}

            {kioskSubScreen === 'allocation' && (
              <CustomerTableAllocationScreen
                onBackToLanguage={() => setKioskSubScreen('language')}
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
                />

                <MenuScreen
                  onSelectItem={(item) => setSelectedItemForDetail(item)}
                  onOpenCart={() => setIsCartOpen(true)}
                  onOpenOrderTracker={() => setIsTrackerOpen(true)}
                />
              </div>
            )}
          </div>
        )}
      </main>

      {/* Floating "Continue Game" Action Pill (docked at bottom right as requested in user mockup) */}
      {liveTrackedOrder && liveTrackedOrder.status !== 'COMPLETED' && !isEntertainmentOpen && view === 'kiosk' && kioskSubScreen === 'menu' && (
        <div className="fixed bottom-6 right-6 z-40 animate-in bounce-in duration-300">
          <button
            onClick={() => setIsEntertainmentOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs shadow-2xl shadow-amber-500/40 border-2 border-white/40 flex items-center gap-2 cursor-pointer transition-all active:scale-95 group"
          >
            <span className="text-base group-hover:rotate-12 transition-transform">🎮</span>
            <span className="font-extrabold tracking-wide">Continue Game</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          </button>
        </div>
      )}

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
        onTrackOrder={() => setIsTrackerOpen(true)}
        onOpenFeedback={() => setIsFinishMealOpen(true)}
      />

      <OrderTrackerModal
        order={liveTrackedOrder}
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
        }}
      />

      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
      />

      <LanguageSelectionModal
        isOpen={isLanguageModalOpen && view === 'kiosk' && kioskSubScreen === 'menu'}
        onClose={() => setIsLanguageModalOpen(false)}
        onConfirm={() => setIsLanguageModalOpen(false)}
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

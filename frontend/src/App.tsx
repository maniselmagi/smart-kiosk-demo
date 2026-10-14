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
import { KitchenDisplay } from './components/kitchen/KitchenDisplay';
import { ManagementDashboard } from './components/dashboard/ManagementDashboard';
import { LanguageSelectionModal } from './components/kiosk/LanguageSelectionModal';
import { LanguageEntryScreen } from './components/kiosk/LanguageEntryScreen';
import { MenuItem, Order } from './types';

const MainAppContent: React.FC = () => {
  const { 
    view, 
    setView, 
    toastMessage, 
    currentTrackedOrder, 
    setCurrentTrackedOrder,
    isLanguageModalOpen,
    setIsLanguageModalOpen
  } = useKiosk();

  // Kiosk inner sub-screen state: Page 1 (language) -> Page 2 (welcome) -> Page 3 (menu)
  const [kioskSubScreen, setKioskSubScreen] = useState<'language' | 'welcome' | 'menu'>('language');

  // Modals state
  const [selectedItemForDetail, setSelectedItemForDetail] = useState<MenuItem | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [activeCompletedOrder, setActiveCompletedOrder] = useState<Order | null>(null);

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
                onContinue={() => setKioskSubScreen('welcome')} 
              />
            )}

            {kioskSubScreen === 'welcome' && (
              <WelcomeScreen 
                onStart={() => setKioskSubScreen('menu')} 
                onChangeLanguage={() => setKioskSubScreen('language')}
              />
            )}

            {kioskSubScreen === 'menu' && (
              <div className="flex-1 flex flex-col">
                <Header
                  showBack={true}
                  onBackToWelcome={() => setKioskSubScreen('welcome')}
                  onOpenCart={() => setIsCartOpen(true)}
                  onOpenTrackOrder={() => setIsTrackerOpen(true)}
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
        order={activeCompletedOrder || currentTrackedOrder}
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
        onTrackOrder={() => setIsTrackerOpen(true)}
        onOpenFeedback={() => setIsFeedbackOpen(true)}
      />

      <OrderTrackerModal
        order={currentTrackedOrder || activeCompletedOrder}
        isOpen={isTrackerOpen}
        onClose={() => setIsTrackerOpen(false)}
        onOpenReceipt={() => setIsReceiptOpen(true)}
        onOpenFeedback={() => setIsFeedbackOpen(true)}
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

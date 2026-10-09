import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import type { 
  MenuItem, 
  CartItem, 
  Order, 
  StaffAlert, 
  Feedback, 
  SpiceLevel, 
  OrderStatus 
} from '../types';
import { storageService, SyncMessage } from '../services/storageService';
import { translations, Language, TranslationDictionary } from '../utils/translations';

export type ViewType = 'hub' | 'kiosk' | 'kitchen' | 'dashboard';

interface KioskContextType {
  view: ViewType;
  setView: (view: ViewType) => void;
  isStandaloneRole: boolean;
  tableNumber: number;
  setTableNumber: (table: number) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
  isAccessibilityMode: boolean;
  toggleAccessibility: () => void;
  t: TranslationDictionary;
  menuItems: MenuItem[];
  cart: CartItem[];
  cartTotalQuantity: number;
  cartSubtotal: number;
  cartTax: number;
  cartGrandTotal: number;
  addToCart: (
    item: MenuItem, 
    spiceLevel: SpiceLevel, 
    customizations: string[], 
    specialInstructions: string, 
    quantity: number
  ) => void;
  updateCartQuantity: (cartItemId: string, delta: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  activeOrders: Order[];
  currentTrackedOrder: Order | null;
  setCurrentTrackedOrder: (order: Order | null) => void;
  placeOrder: (
    paymentMethod: 'UPI' | 'Card' | 'Wallet',
    tipAmount: number,
    splitBillDetails?: Order['splitBillDetails']
  ) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  toggleItemAvailability: (itemId: string) => void;
  staffAlerts: StaffAlert[];
  callWaiter: (type: StaffAlert['type']) => void;
  resolveStaffAlert: (id: string) => void;
  feedbacks: Feedback[];
  submitFeedback: (rating: number, tags: string[], comment: string) => void;
  resetDemoData: () => void;
  showToast: (msg: string) => void;
  toastMessage: string | null;
}

const KioskContext = createContext<KioskContextType | undefined>(undefined);

const parseRouteFromLocation = (): { view: ViewType; isStandalone: boolean; table: number } => {
  if (typeof window === 'undefined') {
    return { view: 'hub', isStandalone: false, table: 12 };
  }

  const path = window.location.pathname.toLowerCase();
  const hash = window.location.hash.toLowerCase();
  const searchParams = new URLSearchParams(window.location.search);
  const roleParam = (searchParams.get('role') || searchParams.get('view') || searchParams.get('mode') || '').toLowerCase();
  const tableParam = parseInt(searchParams.get('table') || '');
  const demoParam = searchParams.get('demo') === 'true';

  let view: ViewType = 'hub';
  let isStandalone = false;

  if (path.includes('/kiosk') || hash.includes('kiosk') || roleParam === 'kiosk' || roleParam === 'customer') {
    view = 'kiosk';
    isStandalone = !demoParam;
  } else if (path.includes('/kitchen') || path.includes('/kds') || hash.includes('kitchen') || hash.includes('kds') || roleParam === 'kitchen' || roleParam === 'kds') {
    view = 'kitchen';
    isStandalone = !demoParam;
  } else if (path.includes('/management') || path.includes('/admin') || path.includes('/dashboard') || hash.includes('management') || hash.includes('admin') || hash.includes('dashboard') || roleParam === 'management' || roleParam === 'dashboard' || roleParam === 'admin') {
    view = 'dashboard';
    isStandalone = !demoParam;
  } else if (path.includes('/hub') || hash.includes('hub') || roleParam === 'hub') {
    view = 'hub';
    isStandalone = false;
  } else {
    // Default root path: hub
    view = 'hub';
    isStandalone = false;
  }

  const table = tableParam > 0 ? tableParam : 12;
  return { view, isStandalone, table };
};

export const KioskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const initialRoute = useMemo(() => parseRouteFromLocation(), []);

  const [view, setViewState] = useState<ViewType>(initialRoute.view);
  const [isStandaloneRole, setIsStandaloneRole] = useState<boolean>(initialRoute.isStandalone);
  const [tableNumber, setTableNumber] = useState<number>(initialRoute.table);
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = storageService.getLanguage();
    if (saved === 'ta' || saved === 'hi' || saved === 'te' || saved === 'es' || saved === 'en') {
      return saved as Language;
    }
    return 'en';
  });
  const [theme, setThemeState] = useState<'light' | 'dark'>(() => storageService.getTheme());
  const [isAccessibilityMode, setIsAccessibilityMode] = useState<boolean>(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => storageService.getMenuItems());

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    storageService.saveLanguage(lang);
  }, []);

  const setTheme = useCallback((newTheme: 'light' | 'dark') => {
    setThemeState(newTheme);
    storageService.saveTheme(newTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      storageService.saveTheme(next);
      return next;
    });
  }, []);

  // Synchronize HTML element classes for Tailwind dark: variants
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      if (theme === 'dark') {
        root.classList.add('dark');
        root.classList.remove('light');
        root.setAttribute('data-theme', 'dark');
      } else {
        root.classList.remove('dark');
        root.classList.add('light');
        root.setAttribute('data-theme', 'light');
      }
    }
  }, [theme]);

  // Synchronize route if user navigates back/forward or changes hash
  useEffect(() => {
    const handleUrlChange = () => {
      const parsed = parseRouteFromLocation();
      setViewState(parsed.view);
      setIsStandaloneRole(parsed.isStandalone);
      if (parsed.table > 0) setTableNumber(parsed.table);
    };

    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, []);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeOrders, setActiveOrders] = useState<Order[]>(() => storageService.getOrders());
  const [currentTrackedOrderId, setCurrentTrackedOrderId] = useState<string | null>(() => storageService.getLastOrderId());
  const [staffAlerts, setStaffAlerts] = useState<StaffAlert[]>(() => storageService.getStaffAlerts());
  const [feedbacks, setFeedbacks] = useState<Feedback[]>(() => storageService.getFeedback());
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3500);
  }, []);

  // Sync route on popstate (browser back/forward)
  useEffect(() => {
    const handlePopState = () => {
      const route = parseRouteFromLocation();
      setViewState(route.view);
      setIsStandaloneRole(route.isStandalone);
      if (route.table) setTableNumber(route.table);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Update view and browser URL path
  const setView = useCallback((nextView: ViewType) => {
    setViewState(nextView);
    try {
      let path = '/';
      if (nextView === 'kiosk') path = '/kiosk';
      else if (nextView === 'kitchen') path = '/kitchen';
      else if (nextView === 'dashboard') path = '/management';
      else path = '/';

      const currentUrl = new URL(window.location.href);
      currentUrl.pathname = path;
      // remove query param view/role if path matches
      currentUrl.searchParams.delete('view');
      currentUrl.searchParams.delete('role');
      window.history.pushState({}, '', currentUrl.toString());

      // If navigated from Hub, keep standalone flag aligned
      if (nextView !== 'hub') {
        const demoParam = currentUrl.searchParams.get('demo') === 'true';
        setIsStandaloneRole(!demoParam);
      } else {
        setIsStandaloneRole(false);
      }
    } catch (e) {
      console.warn(e);
    }
  }, []);

  // Broadcast & multi-tab synchronization listener
  useEffect(() => {
    const unsubscribe = storageService.subscribe((msg: SyncMessage) => {
      switch (msg.type) {
        case 'MENU_UPDATED':
          setMenuItems(storageService.getMenuItems());
          break;
        case 'ORDER_CREATED':
        case 'ORDER_UPDATED':
          setActiveOrders(storageService.getOrders());
          break;
        case 'ALERT_CREATED':
        case 'ALERT_RESOLVED':
          setStaffAlerts(storageService.getStaffAlerts());
          break;
        case 'FEEDBACK_ADDED':
          setFeedbacks(storageService.getFeedback());
          break;
        case 'THEME_CHANGED':
          if (msg.payload === 'light' || msg.payload === 'dark') {
            setThemeState(msg.payload);
          }
          break;
        case 'LANGUAGE_CHANGED':
          if (typeof msg.payload === 'string') {
            setLanguageState(msg.payload as Language);
          }
          break;
        case 'DATA_RESET':
          setMenuItems(storageService.getMenuItems());
          setActiveOrders(storageService.getOrders());
          setStaffAlerts(storageService.getStaffAlerts());
          setFeedbacks(storageService.getFeedback());
          setCart([]);
          showToast('Demo data was reset across all tabs!');
          break;
      }
    });

    return () => unsubscribe();
  }, [showToast]);

  // Synchronize active order tracked on kiosk
  const currentTrackedOrder = useMemo(() => {
    if (!currentTrackedOrderId) {
      const tableOrder = activeOrders.find((o) => o.tableNumber === tableNumber && o.status !== 'COMPLETED');
      return tableOrder || null;
    }
    return activeOrders.find((o) => o.id === currentTrackedOrderId) || null;
  }, [activeOrders, currentTrackedOrderId, tableNumber]);

  const t = useMemo(() => translations[language], [language]);

  const toggleAccessibility = () => {
    setIsAccessibilityMode((prev) => !prev);
  };

  const addToCart = (
    item: MenuItem,
    spiceLevel: SpiceLevel,
    customizations: string[],
    specialInstructions: string,
    quantity: number
  ) => {
    const existingIndex = cart.findIndex(
      (c) =>
        c.menuItemId === item.id &&
        c.spiceLevel === spiceLevel &&
        JSON.stringify(c.customizations) === JSON.stringify(customizations) &&
        c.specialInstructions.trim() === specialInstructions.trim()
    );

    if (existingIndex > -1) {
      setCart((prev) => {
        const copy = [...prev];
        copy[existingIndex].quantity += quantity;
        return copy;
      });
    } else {
      const newItem: CartItem = {
        cartItemId: `cart-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        menuItemId: item.id,
        name: item.name,
        price: item.price,
        quantity,
        spiceLevel,
        customizations,
        specialInstructions,
        image: item.image,
        isVeg: item.isVeg,
      };
      setCart((prev) => [...prev, newItem]);
    }
    showToast(`Added ${quantity}x ${item.name} to cart`);
  };

  const updateCartQuantity = (cartItemId: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.cartItemId === cartItemId) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotalQuantity = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.quantity, 0);
  }, [cart]);

  const cartSubtotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }, [cart]);

  const cartTax = useMemo(() => {
    return Math.round(cartSubtotal * 0.05); // 5% GST
  }, [cartSubtotal]);

  const cartGrandTotal = useMemo(() => {
    return cartSubtotal + cartTax;
  }, [cartSubtotal, cartTax]);

  const placeOrder = (
    paymentMethod: 'UPI' | 'Card' | 'Wallet',
    tipAmount: number,
    splitBillDetails?: Order['splitBillDetails']
  ) => {
    const nextOrderNumber = (activeOrders[0]?.orderNumber || 1024) + 1;
    const maxPrepTime = cart.reduce((max, c) => {
      const menuItem = menuItems.find((m) => m.id === c.menuItemId);
      return Math.max(max, menuItem?.prepTimeMinutes || 10);
    }, 10);

    const newOrder: Order = {
      id: `ORD-${nextOrderNumber}`,
      orderNumber: nextOrderNumber,
      tableNumber,
      items: [...cart],
      subtotal: cartSubtotal,
      tax: cartTax,
      tip: tipAmount,
      total: cartSubtotal + cartTax + tipAmount,
      status: 'NEW',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      paymentStatus: 'PAID',
      paymentMethod,
      estimatedPrepTime: maxPrepTime,
      splitBillDetails,
    };

    const updated = storageService.addOrder(newOrder);
    setActiveOrders(updated);
    setCurrentTrackedOrderId(newOrder.id);
    setCart([]);
    showToast(`Order #${nextOrderNumber} sent to Kitchen Display!`);
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    const updated = storageService.updateOrderStatus(orderId, status);
    setActiveOrders(updated);
  };

  const toggleItemAvailability = (itemId: string) => {
    const updated = storageService.toggleItemAvailability(itemId);
    setMenuItems(updated);
  };

  const callWaiter = (type: StaffAlert['type']) => {
    const newAlert: StaffAlert = {
      id: `alert-${Date.now()}`,
      tableNumber,
      type,
      timestamp: new Date().toISOString(),
      status: 'PENDING',
    };
    const updated = storageService.addStaffAlert(newAlert);
    setStaffAlerts(updated);
    showToast(`Staff notified: ${type} at Table ${tableNumber}`);
  };

  const resolveStaffAlert = (id: string) => {
    const updated = storageService.resolveStaffAlert(id);
    setStaffAlerts(updated);
  };

  const submitFeedback = (rating: number, tags: string[], comment: string) => {
    const orderNum = currentTrackedOrder?.orderNumber || 1025;
    const newFeedback: Feedback = {
      id: `fb-${Date.now()}`,
      orderNumber: orderNum,
      tableNumber,
      rating,
      tags,
      comment,
      timestamp: 'Just now',
    };
    const updated = storageService.addFeedback(newFeedback);
    setFeedbacks(updated);
    showToast('Feedback submitted to Management Dashboard!');
  };

  const resetDemoData = () => {
    storageService.resetAllData();
    setMenuItems(storageService.getMenuItems());
    setActiveOrders(storageService.getOrders());
    setStaffAlerts(storageService.getStaffAlerts());
    setFeedbacks(storageService.getFeedback());
    setCart([]);
    setCurrentTrackedOrderId(null);
    showToast('Demo reset successfully');
  };

  return (
    <KioskContext.Provider
      value={{
        view,
        setView,
        isStandaloneRole,
        tableNumber,
        setTableNumber,
        language,
        setLanguage,
        theme,
        setTheme,
        toggleTheme,
        isAccessibilityMode,
        toggleAccessibility,
        t,
        menuItems,
        cart,
        cartTotalQuantity,
        cartSubtotal,
        cartTax,
        cartGrandTotal,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        activeOrders,
        currentTrackedOrder,
        setCurrentTrackedOrder: (order) => setCurrentTrackedOrderId(order ? order.id : null),
        placeOrder,
        updateOrderStatus,
        toggleItemAvailability,
        staffAlerts,
        callWaiter,
        resolveStaffAlert,
        feedbacks,
        submitFeedback,
        resetDemoData,
        showToast,
        toastMessage,
      }}
    >
      <div className={isAccessibilityMode ? 'accessibility-mode' : ''}>
        {children}
      </div>
    </KioskContext.Provider>
  );
};

export const useKiosk = () => {
  const context = useContext(KioskContext);
  if (!context) {
    throw new Error('useKiosk must be used within a KioskProvider');
  }
  return context;
};

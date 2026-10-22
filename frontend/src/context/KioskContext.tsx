import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import type { 
  MenuItem, 
  CartItem, 
  Order, 
  StaffAlert, 
  Feedback, 
  SpiceLevel, 
  OrderStatus,
  MealTime
} from '../types';
import { storageService, SyncMessage, STORAGE_KEYS } from '../services/storageService';
import { INITIAL_MENU_ITEMS } from '../data/initialData';
import { translations, Language, TranslationDictionary } from '../utils/translations';

export type ViewType = 'hub' | 'kiosk' | 'kitchen' | 'dashboard';

export const getAutoMealTime = (): MealTime => {
  const now = new Date();
  const hour = now.getHours() + now.getMinutes() / 60;
  // Morning (Breakfast): 6:00 AM - 12:00 PM (12.0)
  // Lunch: 12:00 PM - 5:30 PM (17.5)
  // Dinner: 5:30 PM - 2:00 AM & late night
  if (hour >= 6 && hour < 12.0) {
    return 'morning';
  } else if (hour >= 12.0 && hour < 17.5) {
    return 'lunch';
  } else {
    return 'dinner';
  }
};

interface KioskContextType {
  view: ViewType;
  setView: (view: ViewType) => void;
  isStandaloneRole: boolean;
  tableNumber: number;
  setTableNumber: (table: number) => void;
  guestCount: number;
  setGuestCount: (count: number) => void;
  customerName: string;
  setCustomerName: (name: string) => void;
  customerPhone: string;
  setCustomerPhone: (phone: string) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  isLanguageModalOpen: boolean;
  setIsLanguageModalOpen: (open: boolean) => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
  isAccessibilityMode: boolean;
  toggleAccessibility: () => void;
  mealTime: MealTime;
  setMealTime: (meal: MealTime) => void;
  isAutoMealTime: boolean;
  setIsAutoMealTime: (auto: boolean) => void;
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
    quantity: number,
    customUnitPrice?: number
  ) => void;
  updateCartQuantity: (cartItemId: string, delta: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  reorderCart: (newCart: CartItem[]) => void;
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
  const [tableNumber, setTableNumberState] = useState<number>(initialRoute.table);
  const [guestCount, setGuestCountState] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('royal_ember_guest_count');
      if (saved) return parseInt(saved) || 4;
    }
    return 4;
  });
  const [customerName, setCustomerNameState] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('royal_ember_customer_name') || '';
    }
    return '';
  });
  const [customerPhone, setCustomerPhoneState] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('royal_ember_customer_phone') || '';
    }
    return '';
  });

  const setTableNumber = useCallback((table: number) => {
    setTableNumberState(table);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('table', table.toString());
      window.history.replaceState({}, '', url.toString());
    }
  }, []);

  const setGuestCount = useCallback((count: number) => {
    setGuestCountState(count);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('royal_ember_guest_count', count.toString());
    }
  }, []);

  const setCustomerName = useCallback((name: string) => {
    setCustomerNameState(name);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('royal_ember_customer_name', name);
    }
  }, []);

  const setCustomerPhone = useCallback((phone: string) => {
    setCustomerPhoneState(phone);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('royal_ember_customer_phone', phone);
    }
  }, []);
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = storageService.getLanguage();
    if (saved === 'ta' || saved === 'hi' || saved === 'te' || saved === 'es' || saved === 'en') {
      return saved as Language;
    }
    return 'en';
  });
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState<boolean>(false);
  const [theme, setThemeState] = useState<'light' | 'dark'>(() => storageService.getTheme());
  const [isAccessibilityMode, setIsAccessibilityMode] = useState<boolean>(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    const stored = storageService.getMenuItems();
    if (stored && stored.length >= INITIAL_MENU_ITEMS.length) {
      return stored;
    }
    return INITIAL_MENU_ITEMS;
  });
  const [mealTime, setMealTimeState] = useState<MealTime>(() => getAutoMealTime());
  const [isAutoMealTime, setIsAutoMealTime] = useState<boolean>(true);

  // Ensure menuItems updates immediately if fresh items are present in storage or if old cache was smaller
  useEffect(() => {
    const fresh = storageService.getMenuItems();
    if (!fresh || fresh.length < INITIAL_MENU_ITEMS.length) {
      storageService.saveMenuItems(INITIAL_MENU_ITEMS);
      setMenuItems(INITIAL_MENU_ITEMS);
    } else if (fresh.length !== menuItems.length) {
      setMenuItems(fresh);
    }
  }, []);

  const setMealTime = useCallback((meal: MealTime) => {
    setMealTimeState(meal);
    setIsAutoMealTime(false);
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    storageService.saveLanguage(lang);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('orderease_language_selected_v2', 'true');
    }
  }, []);

  const setTheme = useCallback((newTheme: 'light' | 'dark') => {
    setThemeState(newTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  // Continuously synchronize meal time automatically based on system clock
  useEffect(() => {
    const updateAutoMeal = () => {
      const autoMeal = getAutoMealTime();
      setMealTimeState(autoMeal);
      // Requirement: Dinner menu is night mode theme
      if (autoMeal === 'dinner') {
        setThemeState('dark');
      }
    };

    updateAutoMeal();
    const timer = setInterval(updateAutoMeal, 10000); // Automatically updates menu when time transitions
    return () => clearInterval(timer);
  }, []);

  // Synchronize HTML & Body element classes for Tailwind dark: variants and persist
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      const body = document.body;
      if (theme === 'dark') {
        root.classList.add('dark');
        root.classList.remove('light');
        root.setAttribute('data-theme', 'dark');
        if (body) {
          body.classList.add('dark');
          body.classList.remove('light');
        }
      } else {
        root.classList.remove('dark');
        root.classList.add('light');
        root.setAttribute('data-theme', 'light');
        if (body) {
          body.classList.remove('dark');
          body.classList.add('light');
        }
      }
    }
    storageService.saveTheme(theme);
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
            const incoming = msg.payload as 'light' | 'dark';
            setThemeState((current) => (current !== incoming ? incoming : current));
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

  // Continuous 1-second auto-sync pulse so all screens/tabs update automatically without manual page refresh
  useEffect(() => {
    let lastOrdersRaw = localStorage.getItem(STORAGE_KEYS.ORDERS) || '';
    let lastMenuRaw = localStorage.getItem(STORAGE_KEYS.MENU_ITEMS) || '';
    let lastAlertsRaw = localStorage.getItem(STORAGE_KEYS.STAFF_ALERTS) || '';

    const syncInterval = setInterval(() => {
      try {
        const currentOrdersRaw = localStorage.getItem(STORAGE_KEYS.ORDERS) || '';
        if (currentOrdersRaw && currentOrdersRaw !== lastOrdersRaw) {
          lastOrdersRaw = currentOrdersRaw;
          setActiveOrders(JSON.parse(currentOrdersRaw));
        }

        const currentMenuRaw = localStorage.getItem(STORAGE_KEYS.MENU_ITEMS) || '';
        if (currentMenuRaw && currentMenuRaw !== lastMenuRaw) {
          lastMenuRaw = currentMenuRaw;
          setMenuItems(JSON.parse(currentMenuRaw));
        }

        const currentAlertsRaw = localStorage.getItem(STORAGE_KEYS.STAFF_ALERTS) || '';
        if (currentAlertsRaw && currentAlertsRaw !== lastAlertsRaw) {
          lastAlertsRaw = currentAlertsRaw;
          setStaffAlerts(JSON.parse(currentAlertsRaw));
        }
      } catch (e) {
        // Safe ignore
      }
    }, 1000);

    return () => clearInterval(syncInterval);
  }, []);

  // Synchronize active order tracked on kiosk
  const currentTrackedOrder = useMemo(() => {
    if (!currentTrackedOrderId) {
      const tableOrder = activeOrders.find((o) => o.tableNumber === tableNumber && o.status !== 'COMPLETED');
      return tableOrder || null;
    }
    const found = activeOrders.find((o) => o.id === currentTrackedOrderId);
    if (found) return found;
    return activeOrders.find((o) => o.tableNumber === tableNumber && o.status !== 'COMPLETED') || null;
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
    quantity: number,
    customUnitPrice?: number
  ) => {
    const finalUnitPrice = typeof customUnitPrice === 'number' ? customUnitPrice : item.price;
    const existingIndex = cart.findIndex(
      (c) =>
        c.menuItemId === item.id &&
        c.spiceLevel === spiceLevel &&
        c.price === finalUnitPrice &&
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
        price: finalUnitPrice,
        basePrice: item.price,
        customizationTotal: Math.max(0, finalUnitPrice - item.price),
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

  const reorderCart = (newCart: CartItem[]) => {
    const prioritized = newCart.map((item, idx) => ({
      ...item,
      servingPriority: idx + 1
    }));
    setCart(prioritized);
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
      items: cart.map((c, i) => ({ ...c, servingPriority: c.servingPriority || i + 1 })),
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
        guestCount,
        setGuestCount,
        customerName,
        setCustomerName,
        customerPhone,
        setCustomerPhone,
        language,
        setLanguage,
        isLanguageModalOpen,
        setIsLanguageModalOpen,
        theme,
        setTheme,
        toggleTheme,
        isAccessibilityMode,
        toggleAccessibility,
        mealTime,
        setMealTime,
        isAutoMealTime,
        setIsAutoMealTime,
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
        reorderCart,
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

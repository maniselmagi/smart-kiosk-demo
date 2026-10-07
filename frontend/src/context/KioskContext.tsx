import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { 
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

interface KioskContextType {
  view: 'hub' | 'kiosk' | 'kitchen' | 'dashboard';
  setView: (view: 'hub' | 'kiosk' | 'kitchen' | 'dashboard') => void;
  tableNumber: number;
  setTableNumber: (table: number) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
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

export const KioskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [view, setView] = useState<'hub' | 'kiosk' | 'kitchen' | 'dashboard'>('hub');
  const [tableNumber, setTableNumber] = useState<number>(12);
  const [language, setLanguage] = useState<Language>('en');
  const [isAccessibilityMode, setIsAccessibilityMode] = useState<boolean>(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => storageService.getMenuItems());
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
      // Find latest order for current table if exists
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
        tableNumber,
        setTableNumber,
        language,
        setLanguage,
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

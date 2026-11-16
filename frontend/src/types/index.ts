export type SpiceLevel = 'Mild' | 'Medium' | 'Hot' | 'Extra Hot';

export type MealTime = 'morning' | 'lunch' | 'dinner';

export type Category = 
  | 'All'
  | 'Starters'
  | 'Main Course'
  | 'Breads & Rice'
  | 'Beverages'
  | 'Desserts'
  | 'Combo'
  | 'Signature';

export interface MenuItem {
  id: string;
  name: string;
  nameTamil?: string;
  nameHindi?: string;
  nameTelugu?: string;
  nameSpanish?: string;
  category: Category;
  mealTimes: MealTime[]; // Morning (Breakfast), Lunch, Dinner
  price: number;
  costPrice: number;
  marginPercent: number;
  prepTimeMinutes: number;
  popularityText: string;
  orderedTodayCount: number;
  description: string;
  descriptionTamil?: string;
  descriptionHindi?: string;
  descriptionTelugu?: string;
  descriptionSpanish?: string;
  image: string;
  isVeg: boolean;
  isSpicy: boolean;
  isAvailable: boolean;
  isSignature?: boolean; // Hotel Signature specialty dish
  isCombo?: boolean; // Combo meal set
  rating: number;
  calories: number;
  allergens: string[];
  customizationOptions: string[];
}

export interface CartItem {
  cartItemId: string; // unique per cart row
  menuItemId: string;
  name: string;
  nameTamil?: string;
  nameHindi?: string;
  nameTelugu?: string;
  nameSpanish?: string;
  price: number;
  basePrice?: number;
  customizationTotal?: number;
  quantity: number;
  spiceLevel: SpiceLevel;
  customizations: string[];
  specialInstructions: string;
  image: string;
  isVeg: boolean;
  servingPriority?: number; // 1, 2, 3... order serving sequence
}

export type OrderStatus = 'NEW' | 'PREPARING' | 'READY' | 'COMPLETED';

export type BookingStatus = 'CONFIRMED' | 'SEATED' | 'COMPLETED' | 'CANCELLED';

export interface TableBooking {
  id: string;               // UUID
  ticketNumber: string;     // e.g. "RE-TB-7241"
  customerName: string;
  customerPhone: string;
  tableNumber: number;
  guestCount: number;
  bookingDate: string;      // YYYY-MM-DD
  timeSlot: string;         // e.g. "07:30 PM"
  mealType: 'lunch' | 'dinner' | 'tea';
  assignedServer: string;   // e.g. "Suresh (S)"
  sectionLabel: string;     // e.g. "Zone T(11-15) - Central Amber Pavilion"
  status: BookingStatus;
  createdAt: string;
}

export interface Order {
  id: string; // e.g. "ORD-1025"
  orderNumber: number; // e.g. 1025
  tableNumber: number;
  items: CartItem[];
  subtotal: number;
  tax: number;
  tip: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  paymentStatus: 'PENDING' | 'PAID';
  paymentMethod?: 'UPI' | 'Card' | 'Wallet';
  estimatedPrepTime: number;
  splitBillDetails?: {
    type: 'equally' | 'items';
    guestCount?: number;
    amountPerGuest?: number;
  };
}

export interface StaffAlert {
  id: string;
  tableNumber: number;
  type: 'Need Assistance' | 'Need Water' | 'Need Bill' | 'Other';
  timestamp: string;
  status: 'PENDING' | 'RESOLVED';
}

export interface Feedback {
  id: string;
  orderNumber: number;
  tableNumber: number;
  rating: number;
  tags: string[];
  comment: string;
  timestamp: string;
}

export interface ComboRecommendation {
  id: string;
  title: string;
  titleTamil?: string;
  titleHindi?: string;
  titleTelugu?: string;
  titleSpanish?: string;
  itemIds: string[];
  originalPrice: number;
  comboPrice: number;
  savings: number;
  image: string;
}

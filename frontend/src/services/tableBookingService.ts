import { TableBooking, BookingStatus } from '../types';
import { supabase, DEFAULT_BRANCH_ID } from './supabaseClient';

const STORAGE_KEY = 'royal_ember_table_bookings_v2';
const SYNC_CHANNEL = 'royal_ember_booking_sync_channel';

// Cross-tab broadcast for instant multi-screen sync
let broadcastChannel: BroadcastChannel | null = null;
try {
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    broadcastChannel = new BroadcastChannel(SYNC_CHANNEL);
  }
} catch {
  // Ignore in restricted environments
}

export interface TimeSlotConfig {
  time: string;           // "07:30 PM"
  meal: 'lunch' | 'dinner' | 'tea';
  periodLabel: string;    // "Prime Dinner"
  popularBadge?: string;  // "Fast Filling"
}

export const AVAILABLE_TIME_SLOTS: TimeSlotConfig[] = [
  // Lunch Prime Slots
  { time: '12:00 PM', meal: 'lunch', periodLabel: 'Lunch Opening' },
  { time: '12:45 PM', meal: 'lunch', periodLabel: 'Afternoon Peak', popularBadge: 'Filling Fast' },
  { time: '01:30 PM', meal: 'lunch', periodLabel: 'Executive Lunch' },
  { time: '02:15 PM', meal: 'lunch', periodLabel: 'Late Lunch' },

  // Evening & Sunset Tea
  { time: '04:30 PM', meal: 'tea', periodLabel: 'High Tea & Snacks' },
  { time: '05:30 PM', meal: 'tea', periodLabel: 'Sunset Service' },

  // Royal Dinner Prime Slots
  { time: '07:00 PM', meal: 'dinner', periodLabel: 'Dinner Opening' },
  { time: '07:45 PM', meal: 'dinner', periodLabel: 'Prime Family Hour', popularBadge: 'Filling Fast' },
  { time: '08:30 PM', meal: 'dinner', periodLabel: 'Chef Grand Service', popularBadge: 'Most Popular' },
  { time: '09:15 PM', meal: 'dinner', periodLabel: 'Late Dinner' },
  { time: '10:00 PM', meal: 'dinner', periodLabel: 'Midnight Feast' }
];

// Initial seeded bookings to demonstrate real-time seat/slot collision validation (like movie ticket booking)
const getTodayDateStr = () => new Date().toISOString().split('T')[0];

const INITIAL_BOOKINGS: TableBooking[] = [
  {
    id: 'bkg-seed-01',
    ticketNumber: 'RE-TB-4102',
    customerName: 'Kavitha Sundaram',
    customerPhone: '9840123456',
    tableNumber: 12,
    guestCount: 6,
    bookingDate: getTodayDateStr(),
    timeSlot: '01:30 PM',
    mealType: 'lunch',
    assignedServer: 'Suresh (S)',
    sectionLabel: 'Zone T(11-15) - Central Amber Pavilion',
    status: 'CONFIRMED',
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString()
  },
  {
    id: 'bkg-seed-02',
    ticketNumber: 'RE-TB-4103',
    customerName: 'Rajesh Khanna',
    customerPhone: '9876543210',
    tableNumber: 12,
    guestCount: 6,
    bookingDate: getTodayDateStr(),
    timeSlot: '08:30 PM',
    mealType: 'dinner',
    assignedServer: 'Suresh (S)',
    sectionLabel: 'Zone T(11-15) - Central Amber Pavilion',
    status: 'CONFIRMED',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    id: 'bkg-seed-03',
    ticketNumber: 'RE-TB-4104',
    customerName: 'Anand Mohan',
    customerPhone: '9443215678',
    tableNumber: 8,
    guestCount: 4,
    bookingDate: getTodayDateStr(),
    timeSlot: '07:45 PM',
    mealType: 'dinner',
    assignedServer: 'Bala (B)',
    sectionLabel: 'Zone T(6-10) - Pavilion Wing Booth',
    status: 'CONFIRMED',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString()
  },
  {
    id: 'bkg-seed-04',
    ticketNumber: 'RE-TB-4105',
    customerName: 'Dr. Subramanian',
    customerPhone: '9841098765',
    tableNumber: 3,
    guestCount: 2,
    bookingDate: getTodayDateStr(),
    timeSlot: '12:45 PM',
    mealType: 'lunch',
    assignedServer: 'Vikram (V)',
    sectionLabel: 'Zone T(1-5) - Garden Window',
    status: 'CONFIRMED',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString()
  }
];

class TableBookingService {
  private bookings: TableBooking[] = [];
  private listeners: Array<() => void> = [];

  constructor() {
    this.loadFromStorage();
    this.setupBroadcast();
  }

  private loadFromStorage() {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        this.bookings = JSON.parse(raw);
      } else {
        this.bookings = [...INITIAL_BOOKINGS];
        this.saveToStorage();
      }
    } catch {
      this.bookings = [...INITIAL_BOOKINGS];
    }
  }

  private saveToStorage() {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.bookings));
      broadcastChannel?.postMessage({ type: 'BOOKINGS_UPDATED', timestamp: Date.now() });
    } catch (err) {
      console.warn('Failed to save bookings to localStorage:', err);
    }
  }

  private setupBroadcast() {
    if (!broadcastChannel) return;
    broadcastChannel.onmessage = (event) => {
      if (event.data?.type === 'BOOKINGS_UPDATED') {
        this.loadFromStorage();
        this.notifyListeners();
      }
    };
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach((l) => {
      try {
        l();
      } catch (e) {
        console.error(e);
      }
    });
  }

  public getAllBookings(): TableBooking[] {
    return [...this.bookings];
  }

  public getBookingsForDate(dateStr?: string): TableBooking[] {
    const targetDate = dateStr || getTodayDateStr();
    return this.bookings.filter((b) => b.bookingDate === targetDate && b.status !== 'CANCELLED');
  }

  /**
   * Check if a specific table and time slot is already booked on a date
   * Exactly like cinema / movie ticket booking seat & showtime collision detection
   */
  public isSlotBooked(
    tableNumber: number, 
    dateStr: string, 
    timeSlot: string
  ): { isBooked: boolean; existingBooking?: TableBooking } {
    const match = this.bookings.find(
      (b) =>
        b.tableNumber === tableNumber &&
        b.bookingDate === dateStr &&
        b.timeSlot === timeSlot &&
        b.status !== 'CANCELLED'
    );

    return {
      isBooked: !!match,
      existingBooking: match
    };
  }

  /**
   * Generates a unique Royal Ember booking ticket number
   * Format: RE-TB-####
   */
  public generateTicketNumber(): string {
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    return `RE-TB-${randomDigits}`;
  }

  /**
   * Create a new confirmed booking, save locally and sync to Cloud PostgreSQL
   */
  public async createBooking(params: {
    customerName: string;
    customerPhone: string;
    tableNumber: number;
    guestCount: number;
    bookingDate: string;
    timeSlot: string;
    mealType: 'lunch' | 'dinner' | 'tea';
    assignedServer: string;
    sectionLabel: string;
    ticketNumber?: string;
  }): Promise<{ success: boolean; booking?: TableBooking; error?: string }> {
    // 1. Validate Required Fields
    const trimmedName = (params.customerName || '').trim();
    const cleanPhone = (params.customerPhone || '').replace(/\D/g, '');

    if (!trimmedName) {
      return { success: false, error: 'CUSTOMER_NAME_REQUIRED' };
    }

    if (!cleanPhone || cleanPhone.length < 10) {
      return { success: false, error: 'VALID_PHONE_REQUIRED' };
    }

    // 2. Double-check slot collision (Movie Ticket Style Validation)
    const collisionCheck = this.isSlotBooked(params.tableNumber, params.bookingDate, params.timeSlot);
    if (collisionCheck.isBooked) {
      return {
        success: false,
        error: 'SLOT_ALREADY_BOOKED',
        booking: collisionCheck.existingBooking
      };
    }

    // 3. Construct Booking Object
    const ticketNum = params.ticketNumber || this.generateTicketNumber();
    const newBooking: TableBooking = {
      id: `bkg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      ticketNumber: ticketNum,
      customerName: trimmedName,
      customerPhone: cleanPhone,
      tableNumber: params.tableNumber,
      guestCount: params.guestCount,
      bookingDate: params.bookingDate,
      timeSlot: params.timeSlot,
      mealType: params.mealType,
      assignedServer: params.assignedServer,
      sectionLabel: params.sectionLabel,
      status: 'CONFIRMED',
      createdAt: new Date().toISOString()
    };

    // 4. Save to Local reactive cache first (Instant UI feedback)
    this.bookings.unshift(newBooking);
    this.saveToStorage();
    this.notifyListeners();

    // 5. Push to Cloud Supabase Database (PostgreSQL)
    try {
      await this.pushBookingToCloud(newBooking);
    } catch (err) {
      console.warn('[TableBooking] Cloud sync warning (saved locally):', err);
    }

    return { success: true, booking: newBooking };
  }

  /**
   * Push Booking to Cloud Supabase Database
   */
  public async pushBookingToCloud(booking: TableBooking): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('table_bookings')
        .upsert({
          id: booking.id,
          branch_id: DEFAULT_BRANCH_ID,
          ticket_number: booking.ticketNumber,
          customer_name: booking.customerName,
          customer_phone: booking.customerPhone,
          table_number: booking.tableNumber,
          guest_count: booking.guestCount,
          booking_date: booking.bookingDate,
          time_slot: booking.timeSlot,
          meal_type: booking.mealType,
          assigned_server: booking.assignedServer,
          section_label: booking.sectionLabel,
          status: booking.status,
          created_at: booking.createdAt,
          updated_at: new Date().toISOString()
        }, { onConflict: 'id' });

      if (error) {
        console.warn('[Cloud DB] Table booking table push warning:', error.message);
        return false;
      }

      console.log(`[Cloud DB] Table Booking #${booking.ticketNumber} successfully saved to Cloud!`);
      return true;
    } catch (err) {
      console.warn('[Cloud DB] Cloud booking push bypassed (local-first fallback):', err);
      return false;
    }
  }

  /**
   * Sync and fetch bookings from Supabase Cloud on load
   */
  public async syncWithCloud(dateStr?: string): Promise<void> {
    try {
      const queryDate = dateStr || getTodayDateStr();
      const { data, error } = await supabase
        .from('table_bookings')
        .select('*')
        .eq('booking_date', queryDate);

      if (error) {
        console.warn('[Cloud DB] Sync bookings notice:', error.message);
        return;
      }

      if (data && Array.isArray(data) && data.length > 0) {
        const cloudBookings: TableBooking[] = data.map((row: any) => ({
          id: row.id,
          ticketNumber: row.ticket_number || `RE-TB-${row.id.substring(0, 4)}`,
          customerName: row.customer_name,
          customerPhone: row.customer_phone,
          tableNumber: row.table_number,
          guestCount: row.guest_count,
          bookingDate: row.booking_date,
          timeSlot: row.time_slot,
          mealType: row.meal_type || 'dinner',
          assignedServer: row.assigned_server,
          sectionLabel: row.section_label,
          status: row.status as BookingStatus,
          createdAt: row.created_at || new Date().toISOString()
        }));

        // Merge cloud bookings into local storage without duplicating
        const localMap = new Map(this.bookings.map((b) => [b.id, b]));
        cloudBookings.forEach((cb) => localMap.set(cb.id, cb));
        this.bookings = Array.from(localMap.values());
        this.saveToStorage();
        this.notifyListeners();
      }
    } catch (err) {
      console.warn('[Cloud DB] Sync bookings bypassed:', err);
    }
  }
}

export const tableBookingService = new TableBookingService();


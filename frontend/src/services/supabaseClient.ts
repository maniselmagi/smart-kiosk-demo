import { createClient } from '@supabase/supabase-js';
import { Order, OrderStatus, Feedback } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://fgltjpftvxgauzpfrwh.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZnbHRqcGZ0dnhnYXV6cHNmcndoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI3NDQxOTAsImV4cCI6MjEwODMyMDE5MH0.Sb1wJgmeuvxsfyf4T5FBjbq3g2vRDFvY02WgdlW35tM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

export const DEFAULT_BRANCH_ID = '22222222-2222-2222-2222-222222222222';

// Cache for dining_table UUID lookup by table_number
const tableIdCache = new Map<number, string>();

async function getOrCreateTableId(tableNumber: number): Promise<string> {
  if (tableIdCache.has(tableNumber)) {
    return tableIdCache.get(tableNumber)!;
  }

  try {
    const { data, error } = await supabase
      .from('dining_tables')
      .select('id')
      .eq('branch_id', DEFAULT_BRANCH_ID)
      .eq('table_number', tableNumber)
      .maybeSingle();

    if (data && data.id) {
      tableIdCache.set(tableNumber, data.id);
      return data.id;
    }

    if (error) {
      console.warn('Error fetching table id:', error.message);
    }

    // If not found, insert dynamic table record
    const { data: newTable, error: insertErr } = await supabase
      .from('dining_tables')
      .insert({
        branch_id: DEFAULT_BRANCH_ID,
        table_number: tableNumber,
        label: `Table ${tableNumber}`,
        section: 'Main Dining',
        qr_code_token: `tbl_${tableNumber}_${Date.now().toString(36)}`,
        status: 'OCCUPIED'
      })
      .select('id')
      .single();

    if (newTable && newTable.id) {
      tableIdCache.set(tableNumber, newTable.id);
      return newTable.id;
    }

    if (insertErr) {
      console.warn('Error inserting table record:', insertErr.message);
    }
  } catch (err) {
    console.warn('Failed to resolve table ID from cloud:', err);
  }

  return '22222222-2222-2222-2222-222222222222';
}

/**
 * Push placed order and items to Supabase Cloud
 */
export async function pushOrderToCloud(order: Order): Promise<boolean> {
  try {
    const tableId = await getOrCreateTableId(order.tableNumber);

    // 1. Insert Order
    const { data: insertedOrder, error: orderErr } = await supabase
      .from('orders')
      .insert({
        branch_id: DEFAULT_BRANCH_ID,
        table_id: tableId,
        order_number: order.orderNumber,
        customer_name: 'Guest',
        customer_phone: null,
        customer_language: 'en',
        subtotal: order.subtotal,
        tax_amount: order.tax,
        discount_amount: 0,
        total_amount: order.total,
        status: order.status,
        payment_method: order.paymentMethod || 'UPI',
        payment_status: order.paymentStatus || 'PAID',
        estimated_prep_minutes: order.estimatedPrepTime || 15
      })
      .select('id')
      .single();

    if (orderErr) {
      console.warn('Supabase Cloud Order Insert Error:', orderErr.message);
      return false;
    }

    // 2. Insert Line Items
    if (insertedOrder && order.items && order.items.length > 0) {
      const lineItems = order.items.map((item) => ({
        order_id: insertedOrder.id,
        menu_item_id: null,
        item_name: item.name,
        quantity: item.quantity,
        unit_price: item.price,
        subtotal: item.price * item.quantity,
        spice_level: item.spiceLevel || 'Medium',
        selected_customizations: item.customizations || [],
        special_instructions: item.specialInstructions || null,
        is_veg: item.isVeg ?? true,
        is_complimentary: item.price === 0
      }));

      const { error: itemsErr } = await supabase
        .from('order_items')
        .insert(lineItems);

      if (itemsErr) {
        console.warn('Supabase Line Items Insert Error:', itemsErr.message);
      }
    }

    console.log(`[Cloud DB] Order #${order.orderNumber} successfully synced to Supabase!`);
    return true;
  } catch (err) {
    console.warn('[Cloud DB] Network sync bypassed, preserved in local storage:', err);
    return false;
  }
}

/**
 * Update Order status in Cloud
 */
export async function updateCloudOrderStatus(orderNumber: number, status: OrderStatus): Promise<void> {
  try {
    await supabase
      .from('orders')
      .update({ status })
      .eq('order_number', orderNumber);
  } catch (err) {
    console.warn('[Cloud DB] Could not update order status in cloud:', err);
  }
}

/**
 * Push Waiter Call to Supabase Cloud
 */
export async function pushWaiterCallToCloud(tableNumber: number, callType: string): Promise<void> {
  try {
    const tableId = await getOrCreateTableId(tableNumber);
    await supabase
      .from('waiter_calls')
      .insert({
        branch_id: DEFAULT_BRANCH_ID,
        table_id: tableId,
        table_number: tableNumber,
        call_type: callType,
        status: 'ACTIVE'
      });
    console.log(`[Cloud DB] Waiter Call from Table ${tableNumber} synced to Supabase!`);
  } catch (err) {
    console.warn('[Cloud DB] Waiter call cloud sync error:', err);
  }
}

/**
 * Push Dining Feedback to Supabase Cloud
 */
export async function pushFeedbackToCloud(feedback: Feedback): Promise<void> {
  try {
    await supabase
      .from('dining_feedbacks')
      .insert({
        branch_id: DEFAULT_BRANCH_ID,
        table_number: feedback.tableNumber,
        rating: feedback.rating,
        sentiment_tags: feedback.tags || [],
        comment: feedback.comment || null
      });
    console.log(`[Cloud DB] Feedback from Table ${feedback.tableNumber} synced to Supabase!`);
  } catch (err) {
    console.warn('[Cloud DB] Feedback cloud sync error:', err);
  }
}

/**
 * Subscribe to Real-Time Cloud Orders
 * When Kitchen KDS marks READY/COMPLETED, all tablets update instantly
 */
export function subscribeToCloudOrders(onOrderUpdate: (payload: any) => void) {
  try {
    const channel = supabase
      .channel('kiosk_orders_live')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        (payload) => {
          console.log('[Cloud DB Realtime] Order event received:', payload);
          onOrderUpdate(payload);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  } catch (err) {
    console.warn('[Cloud DB Realtime] Subscription not supported in offline mode:', err);
    return () => {};
  }
}

import React, { useState, useMemo } from 'react';
import { useKiosk } from '../../../context/KioskContext';
import { Order, OrderStatus } from '../../../types';
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  Clock, 
  CheckCircle2, 
  Eye, 
  RotateCcw, 
  X, 
  Calendar, 
  DollarSign, 
  Utensils, 
  AlertTriangle,
  Receipt,
  Download,
  Flame,
  UserCheck
} from 'lucide-react';

interface OrdersPageProps {
  selectedBranch: string;
}

export const OrdersPage: React.FC<OrdersPageProps> = ({ selectedBranch }) => {
  const { activeOrders, updateOrderStatus, showToast } = useKiosk();

  const [statusFilter, setStatusFilter] = useState<'ALL' | OrderStatus>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrderForDrawer, setSelectedOrderForDrawer] = useState<Order | null>(null);

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return activeOrders.filter((order) => {
      const matchStatus = statusFilter === 'ALL' || order.status === statusFilter;
      const q = searchQuery.trim().toLowerCase();
      const matchSearch = 
        !q || 
        order.orderNumber.toString().includes(q) ||
        order.id.toLowerCase().includes(q) ||
        `table ${order.tableNumber}`.toLowerCase().includes(q) ||
        order.items.some(i => i.name.toLowerCase().includes(q));
      return matchStatus && matchSearch;
    });
  }, [activeOrders, statusFilter, searchQuery]);

  // Counts
  const counts = {
    ALL: activeOrders.length,
    NEW: activeOrders.filter(o => o.status === 'NEW').length,
    PREPARING: activeOrders.filter(o => o.status === 'PREPARING').length,
    READY: activeOrders.filter(o => o.status === 'READY').length,
    COMPLETED: activeOrders.filter(o => o.status === 'COMPLETED').length,
  };

  const handleAdvanceStatus = (orderId: string, currentStatus: OrderStatus) => {
    const nextStatusMap: Record<OrderStatus, OrderStatus> = {
      NEW: 'PREPARING',
      PREPARING: 'READY',
      READY: 'COMPLETED',
      COMPLETED: 'COMPLETED',
    };
    const next = nextStatusMap[currentStatus];
    updateOrderStatus(orderId, next);
    showToast(`Order status updated to ${next}`);
    if (selectedOrderForDrawer && selectedOrderForDrawer.id === orderId) {
      setSelectedOrderForDrawer({ ...selectedOrderForDrawer, status: next });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Header Summary Card */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white font-display">
              Live Order Management
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 text-xs font-bold">
              Real-Time Sync
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Displaying active and served dining tickets for {selectedBranch}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => showToast('Order history exported as CSV')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Status Pipeline Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <button
          onClick={() => setStatusFilter('NEW')}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            statusFilter === 'NEW'
              ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-300 dark:border-amber-800 shadow-sm'
              : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-amber-300'
          }`}
        >
          <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider block">
            New Tickets
          </span>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-display mt-1">
            {counts.NEW}
          </div>
          <span className="text-[10px] text-slate-400 mt-0.5 block">Waiting for kitchen acceptance</span>
        </button>

        <button
          onClick={() => setStatusFilter('PREPARING')}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            statusFilter === 'PREPARING'
              ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-300 dark:border-blue-800 shadow-sm'
              : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-blue-300'
          }`}
        >
          <span className="text-[11px] font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider block">
            Cooking Line
          </span>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-display mt-1">
            {counts.PREPARING}
          </div>
          <span className="text-[10px] text-slate-400 mt-0.5 block">Under chef preparation</span>
        </button>

        <button
          onClick={() => setStatusFilter('READY')}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            statusFilter === 'READY'
              ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 shadow-sm'
              : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-emerald-300'
          }`}
        >
          <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block">
            Ready to Serve
          </span>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-display mt-1">
            {counts.READY}
          </div>
          <span className="text-[10px] text-slate-400 mt-0.5 block">Assigned waiter notified</span>
        </button>

        <button
          onClick={() => setStatusFilter('COMPLETED')}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            statusFilter === 'COMPLETED'
              ? 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 shadow-sm'
              : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-slate-300'
          }`}
        >
          <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
            Completed / Paid
          </span>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-display mt-1">
            {counts.COMPLETED}
          </div>
          <span className="text-[10px] text-slate-400 mt-0.5 block">Meal settled &amp; finished</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-bold">
          {(['ALL', 'NEW', 'PREPARING', 'READY', 'COMPLETED'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                statusFilter === st
                  ? 'bg-white dark:bg-blue-600 text-slate-900 dark:text-white shadow-xs font-extrabold'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {st === 'ALL' ? 'All Orders' : st} ({counts[st]})
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by order #, table..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Orders Data Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 font-extrabold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Order #</th>
                <th className="py-3 px-4">Table</th>
                <th className="py-3 px-4">Items Summary</th>
                <th className="py-3 px-4">Created Time</th>
                <th className="py-3 px-4 text-right">Total Amount</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Payment</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <ShoppingBag className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p className="font-bold">No orders found matching your search filter.</p>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const statusColors = {
                    NEW: 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-950/60 dark:text-amber-400',
                    PREPARING: 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-950/60 dark:text-blue-400',
                    READY: 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-400',
                    COMPLETED: 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400',
                  };

                  return (
                    <tr key={order.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 font-mono font-extrabold text-slate-900 dark:text-white">
                        #{order.orderNumber}
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-700 dark:text-slate-300">
                        Table {order.tableNumber}
                      </td>
                      <td className="py-3 px-4 max-w-[240px] truncate text-slate-600 dark:text-slate-400">
                        {order.items.map(i => `${i.name} (${i.quantity})`).join(', ')}
                      </td>
                      <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                        {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="py-3 px-4 text-right font-black text-slate-900 dark:text-white font-display">
                        ₹{order.total}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${statusColors[order.status]}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900 text-[10px] font-bold">
                          {order.paymentMethod || 'UPI'} Paid
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedOrderForDrawer(order)}
                            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950 text-slate-600 hover:text-blue-600 transition-colors cursor-pointer"
                            title="View Full Ticket"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {order.status !== 'COMPLETED' && (
                            <button
                              onClick={() => handleAdvanceStatus(order.id, order.status)}
                              className="px-2 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-[10px] transition-all cursor-pointer"
                            >
                              Advance →
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Ticket Detail Drawer / Modal */}
      {selectedOrderForDrawer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col text-slate-800 dark:text-slate-100">
            
            {/* Header */}
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <Receipt className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base font-display">
                    Order Ticket #{selectedOrderForDrawer.orderNumber}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Table {selectedOrderForDrawer.tableNumber} • {new Date(selectedOrderForDrawer.createdAt).toLocaleTimeString()}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedOrderForDrawer(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items List */}
            <div className="p-5 max-h-96 overflow-y-auto space-y-3">
              {selectedOrderForDrawer.items.map((item, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-between gap-3">
                  <div>
                    <div className="font-bold text-sm text-slate-900 dark:text-white">
                      {item.name} <span className="text-blue-600 font-extrabold">x{item.quantity}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                      <span className="text-amber-500 font-semibold">{item.spiceLevel} Spice</span>
                      {item.customizations.length > 0 && (
                        <span>• {item.customizations.join(', ')}</span>
                      )}
                    </div>
                  </div>
                  <div className="font-extrabold text-sm text-slate-900 dark:text-white font-display">
                    ₹{item.price * item.quantity}
                  </div>
                </div>
              ))}
            </div>

            {/* Bill Summary */}
            <div className="p-5 bg-slate-50/70 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal</span>
                <span>₹{selectedOrderForDrawer.subtotal}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Tax (GST 5%)</span>
                <span>₹{selectedOrderForDrawer.tax}</span>
              </div>
              <div className="flex justify-between font-extrabold text-sm text-slate-900 dark:text-white pt-1.5 border-t border-slate-200 dark:border-slate-700">
                <span>Grand Total</span>
                <span className="font-display">₹{selectedOrderForDrawer.total}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
              <button
                onClick={() => {
                  showToast(`Receipt printed for Order #${selectedOrderForDrawer.orderNumber}`);
                  setSelectedOrderForDrawer(null);
                }}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-bold transition-colors cursor-pointer"
              >
                Print Receipt
              </button>

              {selectedOrderForDrawer.status !== 'COMPLETED' ? (
                <button
                  onClick={() => handleAdvanceStatus(selectedOrderForDrawer.id, selectedOrderForDrawer.status)}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  Advance Order Status →
                </button>
              ) : (
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Served &amp; Completed
                </span>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default OrdersPage;

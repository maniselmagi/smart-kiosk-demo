import React, { useState } from 'react';
import { useKiosk } from '../../../context/KioskContext';
import { 
  CreditCard, 
  DollarSign, 
  TrendingUp, 
  Download, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  ArrowUpRight, 
  RotateCcw,
  Receipt,
  Wallet
} from 'lucide-react';

export const PaymentsPage: React.FC = () => {
  const { showToast } = useKiosk();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMethod, setFilterMethod] = useState<'ALL' | 'UPI' | 'Card' | 'Wallet'>('ALL');

  const transactions = [
    { txnId: 'TXN-9021-UPI', orderNum: 1025, table: 12, method: 'UPI', gateway: 'Razorpay UPI', amount: 890, status: 'CAPTURED', time: '10:45 AM', customer: 'Ananya S.' },
    { txnId: 'TXN-9020-CARD', orderNum: 1024, table: 4, method: 'Card', gateway: 'HDFC EDC Terminal', amount: 1450, status: 'CAPTURED', time: '10:32 AM', customer: 'Rahul Verma' },
    { txnId: 'TXN-9019-UPI', orderNum: 1023, table: 8, method: 'UPI', gateway: 'PhonePe QR', amount: 620, status: 'CAPTURED', time: '10:15 AM', customer: 'Deepak Rao' },
    { txnId: 'TXN-9018-UPI', orderNum: 1022, table: 16, method: 'UPI', gateway: 'Google Pay', amount: 1120, status: 'CAPTURED', time: '09:58 AM', customer: 'Meera Iyer' },
    { txnId: 'TXN-9017-WALLET', orderNum: 1021, table: 6, method: 'Wallet', gateway: 'Paytm Wallet', amount: 380, status: 'CAPTURED', time: '09:42 AM', customer: 'Karthik N.' },
    { txnId: 'TXN-9016-CARD', orderNum: 1020, table: 2, method: 'Card', gateway: 'ICICI POS Pin', amount: 2340, status: 'CAPTURED', time: '09:20 AM', customer: 'Sunil Kumar' },
    { txnId: 'TXN-9015-UPI', orderNum: 1019, table: 11, method: 'UPI', gateway: 'BHIM UPI', amount: 480, status: 'REFUNDED', time: '08:55 AM', customer: 'Pooja Hegde' },
  ];

  const filteredTxns = transactions.filter(t => {
    const matchMethod = filterMethod === 'ALL' || t.method === filterMethod;
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || t.txnId.toLowerCase().includes(q) || t.orderNum.toString().includes(q) || t.customer.toLowerCase().includes(q);
    return matchMethod && matchSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Header */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white font-display">
              Payments, UPI &amp; Batch Settlements
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 text-xs font-bold">
              Gateway Active
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time transaction reconciliation across QR UPI, Card swipe, and Digital Receipts
          </p>
        </div>

        <button
          onClick={() => showToast('Batch settlement export downloaded (₹48,620)')}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download Daily Settlement</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-bold">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-slate-400 block mb-1">Today's Settlement</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-display">₹48,620</div>
          <span className="text-[10px] text-emerald-600 mt-1 block">+18.4% vs yesterday</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-slate-400 block mb-1">UPI Payments</span>
          <div className="text-2xl font-black text-blue-600 font-display">₹33,060</div>
          <span className="text-[10px] text-blue-600 mt-1 block">68% of dining sales</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-slate-400 block mb-1">Credit / Debit Cards</span>
          <div className="text-2xl font-black text-purple-600 font-display">₹11,670</div>
          <span className="text-[10px] text-purple-600 mt-1 block">24% of dining sales</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-slate-400 block mb-1">Next Bank Payout</span>
          <div className="text-2xl font-black text-emerald-600 font-display">Tomorrow</div>
          <span className="text-[10px] text-slate-400 mt-1 block">Scheduled at 06:00 AM</span>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-bold">
          {(['ALL', 'UPI', 'Card', 'Wallet'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setFilterMethod(m)}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                filterMethod === m 
                  ? 'bg-white dark:bg-blue-600 text-slate-900 dark:text-white shadow-xs font-extrabold' 
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {m === 'ALL' ? 'All Gateways' : m}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search txn ID or customer..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 font-extrabold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Transaction ID</th>
                <th className="py-3 px-4">Order #</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Gateway</th>
                <th className="py-3 px-4">Time</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredTxns.map((tx) => (
                <tr key={tx.txnId} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">
                    {tx.txnId}
                  </td>
                  <td className="py-3 px-4 font-mono font-semibold text-blue-600 dark:text-blue-400">
                    #{tx.orderNum} (T{tx.table})
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-700 dark:text-slate-300">
                    {tx.customer}
                  </td>
                  <td className="py-3 px-4 text-slate-500">
                    {tx.gateway}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-400 text-[11px]">
                    {tx.time}
                  </td>
                  <td className="py-3 px-4 text-right font-black text-slate-900 dark:text-white font-display">
                    ₹{tx.amount}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase border ${
                      tx.status === 'CAPTURED'
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-400'
                        : 'bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-950/60 dark:text-rose-400'
                    }`}>
                      {tx.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => showToast(`Receipt downloaded for ${tx.txnId}`)}
                      className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                      title="Download Tax Receipt"
                    >
                      <Receipt className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default PaymentsPage;

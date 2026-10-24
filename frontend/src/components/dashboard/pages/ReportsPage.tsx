import React, { useState } from 'react';
import { useKiosk } from '../../../context/KioskContext';
import { 
  BarChart3, 
  TrendingUp, 
  Calendar, 
  Download, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  DollarSign,
  PieChart,
  Layers
} from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const { showToast } = useKiosk();
  const [selectedRange, setSelectedRange] = useState<'today' | 'week' | 'month'>('today');

  const hourlyData = [
    { hour: '10 AM', orders: 6, sales: 1840, isPeak: false },
    { hour: '11 AM', orders: 14, sales: 4420, isPeak: false },
    { hour: '12 PM', orders: 28, sales: 9180, isPeak: true },
    { hour: '1 PM', orders: 36, sales: 12240, isPeak: true },
    { hour: '2 PM', orders: 18, sales: 5860, isPeak: false },
    { hour: '3 PM', orders: 8, sales: 2450, isPeak: false },
    { hour: '4 PM', orders: 7, sales: 2120, isPeak: false },
    { hour: '5 PM', orders: 12, sales: 3890, isPeak: false },
    { hour: '6 PM', orders: 19, sales: 6200, isPeak: false },
    { hour: '7 PM', orders: 32, sales: 10450, isPeak: true },
    { hour: '8 PM', orders: 42, sales: 14120, isPeak: true },
    { hour: '9 PM', orders: 26, sales: 8640, isPeak: false },
  ];

  const maxHourlyOrders = Math.max(...hourlyData.map(d => d.orders));

  const profitabilityDishes = [
    { name: 'Cold Coffee Frappé', price: 140, cost: 58, margin: 58, category: 'Beverage', rating: 'High Profit' },
    { name: 'Crispy Masala Dosa', price: 160, cost: 72, margin: 55, category: 'Main', rating: 'High Profit' },
    { name: 'Veg Dum Biryani', price: 240, cost: 117, margin: 51, category: 'Main', rating: 'Healthy' },
    { name: 'Chicken Dum Biryani', price: 310, cost: 175, margin: 44, category: 'Main', rating: 'Popular' },
    { name: 'Paneer Tikka', price: 280, cost: 162, margin: 42, category: 'Starter', rating: 'Popular' },
    { name: 'Butter Chicken', price: 320, cost: 198, margin: 38, category: 'Main', rating: 'Volume Leader' },
  ];

  const categoryBreakdown = [
    { name: 'Main Course', percent: 38, revenue: '₹18,475', color: 'bg-blue-600' },
    { name: 'Starters & Tandoor', percent: 26, revenue: '₹12,640', color: 'bg-amber-500' },
    { name: 'Rice & Breads', percent: 18, revenue: '₹8,750', color: 'bg-emerald-500' },
    { name: 'Beverages & Mocktails', percent: 12, revenue: '₹5,830', color: 'bg-purple-600' },
    { name: 'Desserts & Sweets', percent: 6, revenue: '₹2,925', color: 'bg-rose-500' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Header */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white font-display">
              Executive Analytics &amp; Menu Profitability
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200 text-xs font-bold">
              Business Intelligence
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Dining hour load distribution, recipe margin analysis, and category revenue performance
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Time range pills */}
          <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold flex items-center">
            {(['today', 'week', 'month'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setSelectedRange(r)}
                className={`px-3 py-1.5 rounded-lg capitalize transition-all cursor-pointer ${
                  selectedRange === r
                    ? 'bg-white dark:bg-blue-600 text-slate-900 dark:text-white shadow-xs font-extrabold'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          <button
            onClick={() => showToast('Full monthly analytics report generated (PDF)')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Hourly Rush Bar Chart Section */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h3 className="text-base font-extrabold font-display text-slate-900 dark:text-white">
              Hourly Dining Rush &amp; Kitchen Load Distribution
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Orders per hour from 10:00 AM to 10:00 PM highlighting staff scheduling needs
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-bold">
            <span className="flex items-center gap-1.5 text-slate-500">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700" /> Normal Volume
            </span>
            <span className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600" /> Rush Peak Hour
            </span>
          </div>
        </div>

        {/* Bar Chart Visualization */}
        <div className="h-56 flex items-end gap-2 sm:gap-4 pt-6 pb-2 border-b border-slate-100 dark:border-slate-800">
          {hourlyData.map((slot) => {
            const heightPercent = Math.round((slot.orders / maxHourlyOrders) * 100);
            return (
              <div key={slot.hour} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <span className="text-[10px] font-bold text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  {slot.orders}
                </span>
                <div
                  style={{ height: `${heightPercent}%` }}
                  className={`w-full rounded-t-xl transition-all duration-300 relative ${
                    slot.isPeak
                      ? 'bg-gradient-to-t from-blue-600 to-indigo-500 shadow-sm shadow-blue-500/20'
                      : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {slot.isPeak && (
                    <span className="absolute -top-5 left-1/2 -translate-x-1/2 px-1 py-0.2 rounded text-[8px] font-black bg-blue-600 text-white whitespace-nowrap">
                      PEAK
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-bold text-slate-400 truncate w-full text-center">
                  {slot.hour}
                </span>
              </div>
            );
          })}
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>Primary Lunch Rush: <strong className="text-slate-800 dark:text-slate-200">12:00 PM – 2:00 PM</strong> (64 orders)</span>
          <span>Primary Dinner Rush: <strong className="text-slate-800 dark:text-slate-200">7:30 PM – 9:00 PM</strong> (74 orders)</span>
        </div>
      </div>

      {/* 2-Column: Menu Profitability vs Category Revenue */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Dish Margin Profitability Table (Spans 2 cols) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-base font-extrabold font-display text-slate-900 dark:text-white">
                Dish Profitability &amp; Recipe Margin Analysis
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Menu engineering metrics: Selling Price vs Ingredient COGS
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 font-extrabold uppercase tracking-wider text-[10px]">
                  <th className="pb-3 pl-2">Dish</th>
                  <th className="pb-3 text-right">Price</th>
                  <th className="pb-3 text-right">Cost (COGS)</th>
                  <th className="pb-3 text-right">Gross Margin %</th>
                  <th className="pb-3 text-right pr-2">Classification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {profitabilityDishes.map((dish) => (
                  <tr key={dish.name} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 pl-2 font-extrabold text-slate-900 dark:text-white">
                      {dish.name}
                    </td>
                    <td className="py-3 text-right font-bold text-slate-800 dark:text-slate-200">
                      ₹{dish.price}
                    </td>
                    <td className="py-3 text-right text-slate-400">
                      ₹{dish.cost}
                    </td>
                    <td className="py-3 text-right font-black text-emerald-600 font-display">
                      {dish.margin}%
                    </td>
                    <td className="py-3 text-right pr-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                        dish.margin >= 50
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-200 dark:bg-emerald-950/60'
                          : 'bg-amber-50 text-amber-600 border border-amber-200 dark:bg-amber-950/60'
                      }`}>
                        {dish.rating}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 p-3 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/40 text-xs text-blue-900 dark:text-blue-200 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
            <span><strong>Recommendation:</strong> Promote Cold Coffee &amp; Masala Dosa via combo prompts to raise average diner margins to 52%.</span>
          </div>
        </div>

        {/* Category Revenue Breakdown (Spans 1 col) */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="pb-3 mb-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-extrabold font-display text-slate-900 dark:text-white">
                Category Contribution
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Sales share across menu categories
              </p>
            </div>

            <div className="space-y-4">
              {categoryBreakdown.map((cat) => (
                <div key={cat.name} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                    <span>{cat.name}</span>
                    <span className="font-mono">{cat.revenue} ({cat.percent}%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div style={{ width: `${cat.percent}%` }} className={`h-full ${cat.color} rounded-full`} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400 text-center">
            Total Dine-In Revenue: <strong className="text-slate-800 dark:text-white">₹48,620</strong>
          </div>
        </div>

      </div>

    </div>
  );
};

export default ReportsPage;

import React, { useState } from 'react';
import { useKiosk } from '../../context/KioskContext';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Star, 
  Clock, 
  ArrowUpRight, 
  ArrowDownRight, 
  Calendar, 
  UtensilsCrossed, 
  ShieldCheck, 
  Lock, 
  MessageSquare, 
  Sparkles, 
  CheckCircle2 
} from 'lucide-react';

export const ManagementDashboard: React.FC = () => {
  const { feedbacks, menuItems, activeOrders, setView, tableNumber } = useKiosk();

  // Authentication demo toggle
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [username, setUsername] = useState('admin_demo');
  const [password, setPassword] = useState('demo123');

  // Time range selector
  const [selectedRange, setSelectedRange] = useState<'today' | 'week' | 'month'>('today');

  // Realistic Hourly Peak Data (10 AM to 10 PM)
  const hourlyData = [
    { hour: '10 AM', orders: 6, sales: 1840, isPeak: false },
    { hour: '11 AM', orders: 14, sales: 4420, isPeak: false },
    { hour: '12 PM', orders: 28, sales: 9180, isPeak: true },
    { hour: '1 PM', orders: 36, sales: 12240, isPeak: true }, // Lunch rush
    { hour: '2 PM', orders: 18, sales: 5860, isPeak: false },
    { hour: '3 PM', orders: 8, sales: 2450, isPeak: false },
    { hour: '4 PM', orders: 7, sales: 2120, isPeak: false },
    { hour: '5 PM', orders: 12, sales: 3890, isPeak: false },
    { hour: '6 PM', orders: 19, sales: 6200, isPeak: false },
    { hour: '7 PM', orders: 32, sales: 10450, isPeak: true },
    { hour: '8 PM', orders: 42, sales: 14120, isPeak: true }, // Dinner rush peak
    { hour: '9 PM', orders: 26, sales: 8640, isPeak: false },
  ];

  // Max orders for scaling bar height
  const maxHourlyOrders = Math.max(...hourlyData.map((d) => d.orders));

  // Compute average rating from feedbacks
  const avgRating = (
    feedbacks.reduce((acc, f) => acc + f.rating, 0) / (feedbacks.length || 1)
  ).toFixed(1);

  // Profitability dishes matching proposal
  const profitabilityDishes = [
    { name: 'Cold Coffee Frappé', price: 140, cost: 58, margin: 58, category: 'Beverage', rating: 'High Profit' },
    { name: 'Crispy Masala Dosa', price: 160, cost: 72, margin: 55, category: 'Main', rating: 'High Profit' },
    { name: 'Veg Dum Biryani', price: 240, cost: 117, margin: 51, category: 'Main', rating: 'Healthy' },
    { name: 'Paneer Tikka', price: 280, cost: 162, margin: 42, category: 'Starter', rating: 'Balanced' },
    { name: 'Butter Chicken', price: 320, cost: 198, margin: 38, category: 'Main', rating: 'Volume Driver' },
  ];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl">
          <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-4">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 font-display mb-1">
            Manager Access
          </h2>
          <p className="text-xs text-slate-500 mb-6">
            Demo credentials pre-filled for customer presentation
          </p>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-600">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full mt-1 p-3 rounded-xl border border-slate-200 text-xs font-medium"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mt-1 p-3 rounded-xl border border-slate-200 text-xs font-medium"
              />
            </div>
            <button
              onClick={() => setIsAuthenticated(true)}
              className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md transition-colors"
            >
              Sign In to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-4 md:p-8">
      
      {/* Top Header */}
      <div className="max-w-7xl mx-auto pb-8 border-b border-slate-200 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black shadow-lg shadow-indigo-600/20">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl md:text-3xl font-black font-display tracking-tight text-slate-900">
                  Restaurant Executive Dashboard
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                  Synced Live
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Data insights powered by OrderEase Table Kiosks • Dining Room 1
              </p>
            </div>
          </div>
        </div>

        {/* Range Selector & Role */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <div className="bg-white p-1 rounded-2xl border border-slate-200 shadow-xs flex items-center">
            {(['today', 'week', 'month'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setSelectedRange(r)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                  selectedRange === r
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          <button
            onClick={() => setView('kiosk')}
            className="px-4 py-2 rounded-xl bg-brand-50 border border-brand-200 text-brand-700 text-xs font-bold hover:bg-brand-100 transition-colors"
          >
            Switch to Kiosk (T{tableNumber}) →
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 space-y-8">
        
        {/* Top 4 KPI Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          {/* KPI 1: Today's Sales */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                Today's Sales
              </span>
              <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                <DollarSign className="w-4 h-4" />
              </span>
            </div>
            <div>
              <div className="text-3xl font-black text-slate-900 font-display">
                ₹48,620
              </div>
              <div className="flex items-center gap-1.5 mt-2 text-xs text-emerald-600 font-bold">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>+18.4% vs yesterday</span>
              </div>
            </div>
          </div>

          {/* KPI 2: Total Orders */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                Total Orders
              </span>
              <span className="p-2 rounded-xl bg-blue-50 text-blue-600">
                <UtensilsCrossed className="w-4 h-4" />
              </span>
            </div>
            <div>
              <div className="text-3xl font-black text-slate-900 font-display">
                148
              </div>
              <div className="flex items-center gap-1.5 mt-2 text-xs text-blue-600 font-bold">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>+12 orders from kiosk upsells</span>
              </div>
            </div>
          </div>

          {/* KPI 3: Average Order Value (AOV) */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                Average Order Value
              </span>
              <span className="p-2 rounded-xl bg-amber-50 text-amber-600">
                <TrendingUp className="w-4 h-4" />
              </span>
            </div>
            <div>
              <div className="text-3xl font-black text-slate-900 font-display">
                ₹328
              </div>
              <div className="flex items-center gap-1.5 mt-2 text-xs text-amber-600 font-bold">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>+24% vs traditional paper menu</span>
              </div>
            </div>
          </div>

          {/* KPI 4: Customer Rating */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                Guest Satisfaction
              </span>
              <span className="p-2 rounded-xl bg-amber-50 text-amber-500">
                <Star className="w-4 h-4 fill-amber-500" />
              </span>
            </div>
            <div>
              <div className="text-3xl font-black text-slate-900 font-display flex items-baseline gap-1.5">
                <span>{avgRating}</span>
                <span className="text-base text-slate-400 font-medium">/ 5.0</span>
              </div>
              <div className="flex items-center gap-1.5 mt-2 text-xs text-emerald-600 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>96% positive sentiment</span>
              </div>
            </div>
          </div>

        </div>

        {/* Section: Peak-Hour Analysis Chart */}
        <div className="p-6 md:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg md:text-xl font-black font-display text-slate-900">
                  Peak-Hour Dining Activity & Kitchen Load
                </h3>
                <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[11px] font-bold">
                  Proposal Req #29
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Hourly order distribution from 10:00 AM to 10:00 PM highlighting staff scheduling needs
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs font-bold">
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-3 h-3 rounded-full bg-slate-300" /> Normal Volume
              </span>
              <span className="flex items-center gap-1.5 text-brand-600">
                <span className="w-3 h-3 rounded-full bg-brand-500" /> Rush Peak Hour
              </span>
            </div>
          </div>

          {/* Bar Chart Visualization */}
          <div className="h-64 flex items-end gap-2 sm:gap-4 pt-8 pb-2 border-b border-slate-200">
            {hourlyData.map((slot) => {
              const heightPercent = Math.round((slot.orders / maxHourlyOrders) * 100);
              return (
                <div key={slot.hour} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <span className="text-[10px] font-bold text-slate-400 group-hover:text-slate-900 transition-colors opacity-0 group-hover:opacity-100">
                    {slot.orders}
                  </span>
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className={`w-full rounded-t-xl transition-all duration-300 relative ${
                      slot.isPeak
                        ? 'bg-gradient-to-t from-brand-600 to-amber-500 shadow-md shadow-brand-500/20'
                        : 'bg-slate-200 hover:bg-slate-300'
                    }`}
                  >
                    {slot.isPeak && (
                      <span className="absolute -top-6 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded text-[9px] font-black bg-brand-600 text-white whitespace-nowrap shadow-xs">
                        PEAK
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] font-bold text-slate-500 truncate w-full text-center">
                    {slot.hour}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between text-xs text-slate-500">
            <span>Primary Lunch Peak: <strong>12:00 PM – 2:00 PM</strong> (64 orders)</span>
            <span>Primary Dinner Rush: <strong>7:30 PM – 9:00 PM</strong> (74 orders)</span>
          </div>
        </div>

        {/* Two-Column Grid: Popular Items vs Item Profitability */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Column 1: Top-Selling Dishes */}
          <div className="p-6 md:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-black font-display text-slate-900">
                    Top-Selling Dishes Today
                  </h3>
                  <p className="text-xs text-slate-500">
                    Ranked by guest popularity & kiosk order frequency
                  </p>
                </div>
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-xl">
                  Proposal Req #26
                </span>
              </div>

              <div className="space-y-3.5">
                {[
                  { rank: 1, name: 'Butter Chicken', count: 48, revenue: 15360, pct: 92 },
                  { rank: 2, name: 'Paneer Tikka', count: 42, revenue: 11760, pct: 81 },
                  { rank: 3, name: 'Veg Dum Biryani', count: 51, revenue: 12240, pct: 88 },
                  { rank: 4, name: 'Crispy Masala Dosa', count: 65, revenue: 10400, pct: 95 },
                  { rank: 5, name: 'Cold Coffee Frappé', count: 58, revenue: 8120, pct: 85 },
                ].map((item) => (
                  <div key={item.rank} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-lg bg-slate-900 text-white text-xs font-black flex items-center justify-center">
                          {item.rank}
                        </span>
                        <span className="font-extrabold text-sm text-slate-900">
                          {item.name}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="font-black text-sm text-slate-900 font-display">
                          ₹{item.revenue.toLocaleString()}
                        </span>
                        <span className="text-[11px] text-slate-400 block">
                          {item.count} orders
                        </span>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${item.pct}%` }}
                        className="h-full bg-brand-500 rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Column 2: Item Profitability & Gross Margin */}
          <div className="p-6 md:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-black font-display text-slate-900">
                    Dish Profitability & Margin Analysis
                  </h3>
                  <p className="text-xs text-slate-500">
                    Menu engineering metrics: Price vs Ingredient COGS
                  </p>
                </div>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-xl">
                  Proposal Req #27
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 font-extrabold uppercase tracking-wider">
                      <th className="pb-3">Dish</th>
                      <th className="pb-3 text-right">Price</th>
                      <th className="pb-3 text-right">Cost</th>
                      <th className="pb-3 text-right">Margin %</th>
                      <th className="pb-3 text-right">Rating</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {profitabilityDishes.map((dish) => (
                      <tr key={dish.name} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 font-extrabold text-slate-900">
                          {dish.name}
                        </td>
                        <td className="py-3 text-right font-bold text-slate-700">
                          ₹{dish.price}
                        </td>
                        <td className="py-3 text-right text-slate-500">
                          ₹{dish.cost}
                        </td>
                        <td className="py-3 text-right font-black text-emerald-600 font-display">
                          {dish.margin}%
                        </td>
                        <td className="py-3 text-right">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                            dish.margin >= 50
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {dish.rating}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 p-4 rounded-2xl bg-indigo-50/80 border border-indigo-100 text-xs text-indigo-900">
                <Sparkles className="w-4 h-4 text-indigo-600 inline mr-1.5" />
                <strong>Recommendation:</strong> Promote Cold Coffee & Masala Dosa via table kiosk combo prompts to lift gross restaurant margins above 52%.
              </div>
            </div>
          </div>

        </div>

        {/* Section: Live Guest Feedback Stream */}
        <div className="p-6 md:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg md:text-xl font-black font-display text-slate-900">
                  Live Guest Feedback Stream
                </h3>
                <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 text-[11px] font-bold">
                  Proposal Req #28
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Direct diner reviews collected via table kiosks after meal settlement
              </p>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800 text-xs font-black border border-amber-200/80">
              <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
              <span>Average {avgRating} / 5.0</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {feedbacks.slice(0, 6).map((fb) => (
              <div
                key={fb.id}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: fb.rating }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="text-[11px] font-bold text-slate-400">
                      Table {fb.tableNumber}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed font-medium mb-3">
                    "{fb.comment}"
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-1 pt-2 border-t border-slate-200/60">
                  {fb.tags.map((tag) => (
                    <span key={tag} className="px-1.5 py-0.5 rounded bg-white text-[10px] font-semibold text-slate-500 border border-slate-200">
                      {tag}
                    </span>
                  ))}
                  <span className="text-[10px] text-slate-400 ml-auto">
                    {fb.timestamp}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

export default ManagementDashboard;

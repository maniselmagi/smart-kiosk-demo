import React, { useState } from 'react';
import { useKiosk } from '../../../context/KioskContext';
import { 
  Settings, 
  Store, 
  DollarSign, 
  Percent, 
  Tablet, 
  Database, 
  Save, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles,
  RefreshCw
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { showToast } = useKiosk();

  const [restaurantName, setRestaurantName] = useState('Royal Ember');
  const [tagline, setTagline] = useState('Restaurant & Grand Banquet');
  const [gstin, setGstin] = useState('29AABCU9603R1ZM');
  const [gstPercent, setGstPercent] = useState('5.0');
  const [serviceCharge, setServiceCharge] = useState('5.0');
  const [kioskTimeout, setKioskTimeout] = useState('180');
  const [currencySymbol, setCurrencySymbol] = useState('₹ (INR)');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Restaurant management settings saved successfully');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Header */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white font-display">
              Restaurant System Preferences &amp; Config
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200 text-xs font-bold">
              Global Settings
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Configure restaurant legal identity, taxes &amp; GST, table kiosk timeouts, and cloud syncing
          </p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Card 1: Restaurant Brand Identity */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
            <Store className="w-5 h-5 text-blue-600" />
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white font-display">
              Restaurant Profile &amp; Legal Identity
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-slate-600 dark:text-slate-400 block mb-1.5">
                Restaurant Display Name
              </label>
              <input
                type="text"
                value={restaurantName}
                onChange={(e) => setRestaurantName(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="font-bold text-slate-600 dark:text-slate-400 block mb-1.5">
                Brand Tagline
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="font-bold text-slate-600 dark:text-slate-400 block mb-1.5">
                GSTIN / Tax Registration Number
              </label>
              <input
                type="text"
                value={gstin}
                onChange={(e) => setGstin(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono font-bold text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="font-bold text-slate-600 dark:text-slate-400 block mb-1.5">
                Primary Currency
              </label>
              <input
                type="text"
                value={currencySymbol}
                disabled
                className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-slate-500 cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Card 2: Taxes & Service Charge */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
            <Percent className="w-5 h-5 text-emerald-600" />
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white font-display">
              Taxes, GST &amp; Dining Service Charge
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-slate-600 dark:text-slate-400 block mb-1.5">
                Restaurant GST Rate (%)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  value={gstPercent}
                  onChange={(e) => setGstPercent(e.target.value)}
                  className="w-full p-2.5 pr-8 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-slate-900 dark:text-white"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">%</span>
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">CGST 2.5% + SGST 2.5% calculated on diner receipts</span>
            </div>

            <div>
              <label className="font-bold text-slate-600 dark:text-slate-400 block mb-1.5">
                Optional Service Charge (%)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  value={serviceCharge}
                  onChange={(e) => setServiceCharge(e.target.value)}
                  className="w-full p-2.5 pr-8 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-slate-900 dark:text-white"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">%</span>
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">Staff welfare contribution (user-removable on kiosk)</span>
            </div>
          </div>
        </div>

        {/* Card 3: Table Kiosk Behavior */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
            <Tablet className="w-5 h-5 text-purple-600" />
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white font-display">
              Table Kiosk Screen &amp; Heartbeat Rules
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-slate-600 dark:text-slate-400 block mb-1.5">
                Inactivity Reset to Welcome Screen (Seconds)
              </label>
              <input
                type="number"
                value={kioskTimeout}
                onChange={(e) => setKioskTimeout(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-slate-900 dark:text-white"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Default: 180 seconds (3 minutes of idle touch)</span>
            </div>

            <div>
              <label className="font-bold text-slate-600 dark:text-slate-400 block mb-1.5">
                KDS Real-Time Heartbeat Interval
              </label>
              <input
                type="text"
                disabled
                value="1000 ms (1 second active polling + Supabase Realtime)"
                className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-slate-500 cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Card 4: Supabase Cloud Database Status */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
            <div className="flex items-center gap-2.5">
              <Database className="w-5 h-5 text-blue-600" />
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white font-display">
                Cloud Database Integration
              </h3>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 text-xs font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Connected
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs space-y-1.5 font-mono text-slate-600 dark:text-slate-300 border border-slate-200/70 dark:border-slate-700">
            <div>Endpoint: <strong>https://fgltjpftvxgauzpfrwh.supabase.co</strong></div>
            <div>Database Engine: PostgreSQL 15.6 • Multi-tenant branch architecture</div>
            <div>Tables synced: orders, dining_tables, restaurant_profile, menu_items, branches</div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
          >
            Save All Preferences
          </button>
        </div>

      </form>

    </div>
  );
};

export default SettingsPage;

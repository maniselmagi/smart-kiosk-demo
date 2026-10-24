import React, { useState } from 'react';
import { useKiosk } from '../../../context/KioskContext';
import { 
  Store, 
  MapPin, 
  Phone, 
  Clock, 
  Users, 
  CheckCircle2, 
  Plus, 
  Building2, 
  Star, 
  DollarSign, 
  Tablet,
  ExternalLink
} from 'lucide-react';

interface BranchesPageProps {
  selectedBranch: string;
  onSelectBranch: (branch: string) => void;
}

export const BranchesPage: React.FC<BranchesPageProps> = ({ 
  selectedBranch, 
  onSelectBranch 
}) => {
  const { showToast } = useKiosk();

  const branches = [
    {
      id: '22222222-2222-2222-2222-222222222222',
      name: 'Indiranagar Flagship',
      tagline: 'Grand Banquet & Fine Dining',
      address: '100 Feet Road, HAL 2nd Stage, Indiranagar, Bengaluru, KA 560038',
      phone: '+91 80 4123 4567',
      manager: 'Vikram Sharma (General Manager)',
      tableCount: 20,
      kioskCount: 20,
      todayRevenue: '₹32,450',
      activeOrders: 14,
      rating: 4.8,
      hours: '11:00 AM – 11:30 PM',
      status: 'OPEN NOW',
      isPrimary: true
    },
    {
      id: '11111111-1111-1111-1111-111111111111',
      name: 'Whitefield Tech Park',
      tagline: 'Express Bistro & Corporate Dining',
      address: 'ITPL Main Road, Prestige Shantiniketan, Whitefield, Bengaluru, KA 560066',
      phone: '+91 80 4987 6543',
      manager: 'Amit Joshi (Store Lead)',
      tableCount: 16,
      kioskCount: 16,
      todayRevenue: '₹16,170',
      activeOrders: 8,
      rating: 4.7,
      hours: '10:30 AM – 10:30 PM',
      status: 'OPEN NOW',
      isPrimary: false
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Header */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white font-display">
              Multi-Branch Operations &amp; Outlets
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200 text-xs font-bold">
              2 Active Outlets
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Centralized restaurant profile, table allotment, and revenue consolidation across city branches
          </p>
        </div>

        <button
          onClick={() => showToast('New branch onboarding wizard started')}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Outlet</span>
        </button>
      </div>

      {/* Multi-Branch Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {branches.map((b) => {
          const isActive = selectedBranch.toLowerCase().includes(b.name.toLowerCase().split(' ')[0]);

          return (
            <div
              key={b.id}
              className={`bg-white dark:bg-slate-900 rounded-3xl p-6 border shadow-xs transition-all flex flex-col justify-between ${
                isActive 
                  ? 'border-blue-500 ring-4 ring-blue-500/10 shadow-md' 
                  : 'border-slate-200/80 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center font-black">
                      <Store className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-extrabold text-base text-slate-900 dark:text-white font-display">
                          {b.name}
                        </h3>
                        {isActive && (
                          <span className="px-2 py-0.5 rounded-full bg-blue-600 text-white font-bold text-[10px] uppercase tracking-wider">
                            Active Branch
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {b.tagline}
                      </p>
                    </div>
                  </div>

                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900 text-[10px] font-black uppercase">
                    {b.status}
                  </span>
                </div>

                {/* Metrics Row */}
                <div className="grid grid-cols-3 gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-750 my-4 text-center">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Today Sales</span>
                    <span className="text-base font-extrabold text-slate-900 dark:text-white font-display">{b.todayRevenue}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Tables</span>
                    <span className="text-base font-extrabold text-blue-600 font-display">{b.tableCount} Dining</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Rating</span>
                    <span className="text-base font-extrabold text-amber-500 font-display flex items-center justify-center gap-0.5">
                      <Star className="w-3.5 h-3.5 fill-current" /> {b.rating}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <span>{b.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{b.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{b.hours}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>Manager: <strong className="text-slate-800 dark:text-slate-200">{b.manager}</strong></span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400 text-[11px]">
                  Branch ID: {b.id.slice(0, 8)}...
                </span>

                <button
                  onClick={() => {
                    onSelectBranch(b.name);
                    showToast(`Switched active management view to ${b.name}`);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-blue-50 dark:bg-blue-950 text-blue-600 border border-blue-200 dark:border-blue-800'
                      : 'bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 shadow-sm'
                  }`}
                >
                  {isActive ? 'Currently Active' : 'Switch to this Branch'}
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};

export default BranchesPage;

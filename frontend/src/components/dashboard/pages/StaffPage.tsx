import React, { useState } from 'react';
import { useKiosk } from '../../../context/KioskContext';
import { 
  Users, 
  ShieldCheck, 
  ChefHat, 
  UserCheck, 
  Plus, 
  Search, 
  KeyRound, 
  Phone, 
  Mail, 
  CheckCircle2, 
  X,
  Lock
} from 'lucide-react';

export const StaffPage: React.FC = () => {
  const { showToast } = useKiosk();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);

  const staffMembers = [
    { id: 'st-1', name: 'Vikram Sharma', role: 'General Manager', dept: 'Management', pin: '9901', email: 'manager@royalember.com', phone: '+91 98450 12345', shift: 'Active Now', permissions: ['Full Access', 'Price Overrides', 'Refunds', 'Analytics'] },
    { id: 'st-2', name: 'Chef Vikram', role: 'Executive Head Chef', dept: 'Kitchen', pin: '1234', email: 'chef.vikram@royalember.com', phone: '+91 98450 67890', shift: 'Active Now', permissions: ['KDS Line', 'Sold-Out Toggle', 'Prep Times'] },
    { id: 'st-3', name: 'Arjun Nair', role: 'Senior Line Cook', dept: 'Kitchen', pin: '4321', email: 'arjun.nair@royalember.com', phone: '+91 98450 33445', shift: 'Active Now', permissions: ['KDS Orders', 'Mark Ready'] },
    { id: 'st-4', name: 'Raj Kumar', role: 'Floor Operations Lead', dept: 'Dining Floor', pin: '5522', email: 'raj.kumar@royalember.com', phone: '+91 98450 77889', shift: 'Active Now', permissions: ['Waiter Call Assign', 'Table Clear', 'Bill Settle'] },
    { id: 'st-5', name: 'Ravi Teja', role: 'Senior Captain / Waiter', dept: 'Dining Floor', pin: '1101', email: 'ravi.t@royalember.com', phone: '+91 98450 22334', shift: 'Active Now', permissions: ['Tables 1-10 Assist', 'Service Bell'] },
    { id: 'st-6', name: 'Priya Sundaram', role: 'Hospitality Server', dept: 'Dining Floor', pin: '1102', email: 'priya.s@royalember.com', phone: '+91 98450 55667', shift: 'Shift Starts 4PM', permissions: ['Tables 11-20 Assist', 'Service Bell'] },
  ];

  const filteredStaff = staffMembers.filter(s =>
    !searchQuery || 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.dept.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Header */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white font-display">
              Staff Directory, PINs &amp; Access Roles
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200 text-xs font-bold">
              {staffMembers.length} Team Members
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage 4-digit touchscreen station login PINs, department shift rosters, and permission boundaries
          </p>
        </div>

        <button
          onClick={() => setIsAddStaffOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Staff Member</span>
        </button>
      </div>

      {/* Quick Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-bold">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-slate-400 block mb-1">Active on Shift</span>
          <div className="text-2xl font-black text-emerald-600 font-display">5 Members</div>
          <span className="text-[10px] text-emerald-600 mt-1 block">Kitchen &amp; Floor covered</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-slate-400 block mb-1">Kitchen Brigade</span>
          <div className="text-2xl font-black text-amber-500 font-display">2 Chefs</div>
          <span className="text-[10px] text-amber-600 mt-1 block">Live KDS station access</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-slate-400 block mb-1">Service Floor Waiters</span>
          <div className="text-2xl font-black text-blue-600 font-display">2 Captains</div>
          <span className="text-[10px] text-blue-600 mt-1 block">10 Tables assigned each</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-slate-400 block mb-1">Security PIN Status</span>
          <div className="text-2xl font-black text-slate-800 dark:text-white font-display">100% Set</div>
          <span className="text-[10px] text-emerald-600 mt-1 block">Encrypted 4-digit PINs</span>
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search staff by name, role or department..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredStaff.map((staff) => (
          <div key={staff.id} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-extrabold text-sm flex items-center justify-center shrink-0 border border-slate-200/80 dark:border-slate-700">
                    {staff.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900 dark:text-white leading-tight">
                      {staff.name}
                    </h3>
                    <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold block">
                      {staff.role}
                    </span>
                  </div>
                </div>

                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  staff.shift === 'Active Now'
                    ? 'bg-emerald-50 text-emerald-600 border border-emerald-200 dark:bg-emerald-950/60'
                    : 'bg-slate-100 text-slate-500 dark:bg-slate-800'
                }`}>
                  {staff.shift}
                </span>
              </div>

              {/* Contact Info */}
              <div className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400 py-3 border-y border-slate-100 dark:border-slate-800 my-3">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{staff.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate">{staff.email}</span>
                </div>
              </div>

              {/* Permissions list */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                  Assigned Capabilities
                </span>
                <div className="flex flex-wrap gap-1">
                  {staff.permissions.map(p => (
                    <span key={p} className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-semibold border border-slate-200/60 dark:border-slate-700">
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Station PIN Badge */}
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <KeyRound className="w-3.5 h-3.5 text-amber-500" />
                <span>Station PIN:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-1.5 py-0.2 rounded border border-slate-200/60 dark:border-slate-700">
                  {staff.pin}
                </span>
              </div>

              <button
                onClick={() => showToast(`PIN reset link sent to ${staff.name}`)}
                className="text-[11px] font-bold text-blue-600 hover:underline cursor-pointer"
              >
                Reset PIN
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Staff Modal */}
      {isAddStaffOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 text-slate-800 dark:text-slate-100">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
              <h3 className="font-extrabold text-base font-display">Add Staff Team Member</h3>
              <button onClick={() => setIsAddStaffOpen(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-500 block mb-1">Full Name</label>
                <input type="text" placeholder="e.g. Suresh Varma" className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-500 block mb-1">Role</label>
                  <select className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold">
                    <option>Line Cook</option>
                    <option>Dining Captain</option>
                    <option>Floor Supervisor</option>
                    <option>Cashier</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-500 block mb-1">4-Digit PIN</label>
                  <input type="password" placeholder="••••" maxLength={4} className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono font-bold text-center" />
                </div>
              </div>
              <div>
                <label className="font-bold text-slate-500 block mb-1">Phone Number</label>
                <input type="text" placeholder="+91 98450 00000" className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700" />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button onClick={() => setIsAddStaffOpen(false)} className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold">
                Cancel
              </button>
              <button
                onClick={() => {
                  showToast('Staff member added successfully');
                  setIsAddStaffOpen(false);
                }}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-sm"
              >
                Save Member
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default StaffPage;

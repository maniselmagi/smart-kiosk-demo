import React, { useState, useEffect } from 'react';
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
  Lock,
  Eye,
  EyeOff,
  BarChart3,
  Trash2,
  Edit2,
  Sparkles,
  Info,
  Check,
  AlertCircle
} from 'lucide-react';
import { authService, UserCredential } from '../../../services/authService';

export const StaffPage: React.FC = () => {
  const { showToast } = useKiosk();
  const [activeTab, setActiveTab] = useState<'credentials' | 'roster'>('credentials');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Credentials state
  const [userCredentials, setUserCredentials] = useState<UserCredential[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserCredential | null>(null);
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});

  // New User Form State
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    role: 'management' as 'management' | 'kitchen',
    title: '',
    pin: '',
    department: '',
    phone: '',
    email: '',
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [showFormPassword, setShowFormPassword] = useState(false);

  // Load user credentials
  const refreshUsers = () => {
    setUserCredentials(authService.getUsers());
  };

  useEffect(() => {
    refreshUsers();
    const handleUpdate = () => refreshUsers();
    window.addEventListener('auth_users_updated', handleUpdate);
    return () => window.removeEventListener('auth_users_updated', handleUpdate);
  }, []);

  const togglePasswordVisibility = (userId: string) => {
    setVisiblePasswords(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  const handleOpenCreateModal = () => {
    setFormData({
      name: '',
      username: '',
      password: '',
      role: 'management',
      title: '',
      pin: '9901',
      department: 'Management',
      phone: '',
      email: '',
    });
    setFormError(null);
    setShowFormPassword(false);
    setIsCreateModalOpen(true);
  };

  const handleSaveNewUser = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const result = authService.createUser(formData);
    if (result.success && result.user) {
      refreshUsers();
      setIsCreateModalOpen(false);
      showToast(`User @${result.user.username} created successfully for ${result.user.role === 'management' ? 'Management Dashboard' : 'Kitchen KDS'}!`);
    } else {
      setFormError(result.error || 'Failed to create user.');
    }
  };

  const handleDeleteUser = (user: UserCredential) => {
    if (user.isDefault || user.username.toLowerCase() === 'admin') {
      showToast('The default admin account is protected and cannot be deleted.');
      return;
    }

    if (window.confirm(`Are you sure you want to delete login account @${user.username} (${user.name})?`)) {
      const result = authService.deleteUser(user.id);
      if (result.success) {
        refreshUsers();
        showToast(`User @${user.username} deleted.`);
      } else {
        showToast(result.error || 'Failed to delete user.');
      }
    }
  };

  // Staff Directory members
  const staffMembers = [
    { id: 'st-1', name: 'Vikram Sharma', role: 'General Manager', dept: 'Management', pin: '9901', email: 'manager@royalember.com', phone: '+91 98450 12345', shift: 'Active Now', permissions: ['Full Access', 'Price Overrides', 'Refunds', 'Analytics'] },
    { id: 'st-2', name: 'Chef Vikram', role: 'Executive Head Chef', dept: 'Kitchen', pin: '1234', email: 'chef.vikram@royalember.com', phone: '+91 98450 67890', shift: 'Active Now', permissions: ['KDS Line', 'Sold-Out Toggle', 'Prep Times'] },
    { id: 'st-3', name: 'Arjun Nair', role: 'Senior Line Cook', dept: 'Kitchen', pin: '4321', email: 'arjun.nair@royalember.com', phone: '+91 98450 33445', shift: 'Active Now', permissions: ['KDS Orders', 'Mark Ready'] },
    { id: 'st-4', name: 'Raj Kumar', role: 'Floor Operations Lead', dept: 'Dining Floor', pin: '5522', email: 'raj.kumar@royalember.com', phone: '+91 98450 77889', shift: 'Active Now', permissions: ['Waiter Call Assign', 'Table Clear', 'Bill Settle'] },
    { id: 'st-5', name: 'Ravi Teja', role: 'Senior Captain / Waiter', dept: 'Dining Floor', pin: '1101', email: 'ravi.t@royalember.com', phone: '+91 98450 22334', shift: 'Active Now', permissions: ['Tables 1-10 Assist', 'Service Bell'] },
    { id: 'st-6', name: 'Priya Sundaram', role: 'Hospitality Server', dept: 'Dining Floor', pin: '1102', email: 'priya.s@royalember.com', phone: '+91 98450 55667', shift: 'Shift Starts 4PM', permissions: ['Tables 11-20 Assist', 'Service Bell'] },
  ];

  const filteredCredentials = userCredentials.filter(u => 
    !searchQuery ||
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (u.title && u.title.toLowerCase().includes(searchQuery.toLowerCase()))
  );

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
              User Access &amp; Staff Management
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 text-xs font-bold">
              {userCredentials.length} System Accounts
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Create and manage username/password credentials for Management and Kitchen users with role permissions.
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-sm transition-all cursor-pointer active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Create User Credential</span>
        </button>
      </div>

      {/* Tabs Switcher: Credentials vs Floor Roster */}
      <div className="flex items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-2">
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('credentials')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'credentials'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Login Credentials &amp; Accounts ({userCredentials.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('roster')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'roster'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Staff Roster &amp; Shift Schedule</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={activeTab === 'credentials' ? "Search username or name..." : "Search staff roster..."}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 shadow-xs"
          />
        </div>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: SYSTEM USER CREDENTIALS & LOGIN ACCOUNTS          */}
      {/* ========================================================= */}
      {activeTab === 'credentials' && (
        <div className="space-y-6">
          
          {/* Default Credentials Notice Callout */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50/80 via-indigo-50/50 to-slate-50 dark:from-blue-950/30 dark:via-indigo-950/20 dark:to-slate-900 border border-blue-200/80 dark:border-blue-800/60 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>Default System Credentials Configured</span>
                  <span className="px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold">
                    Active &amp; Ready
                  </span>
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  You can sign in with default accounts, or create unlimited new credentials for Management and Kitchen staff.
                </p>
                <div className="flex flex-wrap gap-3 mt-2 text-xs font-mono">
                  <div className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200">
                    👔 <b>Management:</b> <span className="text-blue-600 dark:text-blue-400 font-bold">admin</span> / <span className="text-slate-500">admin123</span>
                  </div>
                  <div className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200">
                    👨‍🍳 <b>Kitchen KDS:</b> <span className="text-amber-600 dark:text-amber-400 font-bold">kitchen</span> / <span className="text-slate-500">kitchen123</span>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={handleOpenCreateModal}
              className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-blue-300 dark:border-blue-700 text-blue-600 dark:text-blue-400 text-xs font-bold hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors shrink-0 shadow-xs"
            >
              + Add New User
            </button>
          </div>

          {/* User Credentials Table */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Active User Credentials Directory
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Authorized accounts that can log into the kiosk stations
                </p>
              </div>
              <span className="text-xs font-bold text-slate-500">
                {filteredCredentials.length} of {userCredentials.length} accounts
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50/70 dark:bg-slate-800/40 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-100 dark:border-slate-800">
                    <th className="py-3 px-4">User</th>
                    <th className="py-3 px-4">Username</th>
                    <th className="py-3 px-4">Assigned Role</th>
                    <th className="py-3 px-4">Password</th>
                    <th className="py-3 px-4">Touch PIN</th>
                    <th className="py-3 px-4">Department / Title</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredCredentials.map((user) => {
                    const isPassVisible = visiblePasswords[user.id] || false;
                    return (
                      <tr key={user.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                        
                        {/* Name & Avatar */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                              user.role === 'management'
                                ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
                                : 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
                            }`}>
                              {user.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                                <span>{user.name}</span>
                                {user.isDefault && (
                                  <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                                    Default
                                  </span>
                                )}
                              </div>
                              <div className="text-[10px] text-slate-400">
                                {user.email || `${user.username}@royalember.com`}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Username */}
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-white">
                          <span className="text-blue-600 dark:text-blue-400">@</span>{user.username}
                        </td>

                        {/* Role */}
                        <td className="py-3.5 px-4">
                          {user.role === 'management' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800 text-[11px] font-bold">
                              <BarChart3 className="w-3 h-3" />
                              <span>Management</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 text-[11px] font-bold">
                              <ChefHat className="w-3 h-3" />
                              <span>Kitchen KDS</span>
                            </span>
                          )}
                        </td>

                        {/* Password with Eye Toggle */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200/80 dark:border-slate-700">
                              {isPassVisible ? user.password : '••••••••'}
                            </span>
                            <button
                              onClick={() => togglePasswordVisibility(user.id)}
                              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                              title={isPassVisible ? "Hide password" : "Show password"}
                            >
                              {isPassVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </td>

                        {/* Touch PIN */}
                        <td className="py-3.5 px-4 font-mono text-slate-600 dark:text-slate-400 font-bold">
                          {user.pin}
                        </td>

                        {/* Department / Title */}
                        <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">
                          <div className="font-medium">{user.title}</div>
                          <div className="text-[10px] text-slate-400">{user.department}</div>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {user.isDefault ? (
                              <span className="text-[10px] text-slate-400 italic">Protected</span>
                            ) : (
                              <button
                                onClick={() => handleDeleteUser(user)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors cursor-pointer"
                                title="Delete user credential"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: STAFF ROSTER & SHIFT DIRECTORY                    */}
      {/* ========================================================= */}
      {activeTab === 'roster' && (
        <div className="space-y-6">
          
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
                    onClick={() => showToast(`Station PIN reset link sent to ${staff.name}`)}
                    className="text-[11px] font-bold text-blue-600 hover:underline cursor-pointer"
                  >
                    Reset PIN
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: CREATE USER CREDENTIAL                             */}
      {/* ========================================================= */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 text-slate-800 dark:text-slate-100 overflow-hidden">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-600 dark:text-blue-400 font-display flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Access Provisioning
                </span>
                <h3 className="font-extrabold text-lg text-slate-900 dark:text-white font-display">
                  Create User Login Credential
                </h3>
              </div>
              <button 
                onClick={() => setIsCreateModalOpen(false)} 
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Error Message */}
            {formError && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSaveNewUser} className="space-y-4 text-xs">
              
              {/* Full Name & Username */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Priya Sharma"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 font-medium"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Username *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono">@</span>
                    <input
                      type="text"
                      required
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value.toLowerCase().replace(/\s+/g, '_') })}
                      placeholder="priya_kitchen"
                      className="w-full pl-7 pr-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 font-mono font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* Password & PIN */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300 block">
                      Password *
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowFormPassword(!showFormPassword)}
                      className="text-[10px] text-blue-600 hover:underline cursor-pointer"
                    >
                      {showFormPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                  <input
                    type={showFormPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Min 4 characters"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Touch Station PIN (4-Digit) *
                  </label>
                  <input
                    type="password"
                    maxLength={4}
                    value={formData.pin}
                    onChange={(e) => setFormData({ ...formData, pin: e.target.value.replace(/\D/g, '') })}
                    placeholder="e.g. 5566"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 font-mono font-bold text-center tracking-widest"
                  />
                </div>
              </div>

              {/* Role Selection (Visual Cards) */}
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-2">
                  Assigned Station &amp; Role Access *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  
                  {/* Management Option */}
                  <label className={`p-3 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                    formData.role === 'management'
                      ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 shadow-xs'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}>
                    <input
                      type="radio"
                      name="role"
                      value="management"
                      checked={formData.role === 'management'}
                      onChange={() => setFormData({ 
                        ...formData, 
                        role: 'management', 
                        department: 'Management',
                        pin: formData.pin || '9901'
                      })}
                      className="sr-only"
                    />
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                        <BarChart3 className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-xs text-slate-900 dark:text-white">Management</div>
                        <div className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold">Admin Dashboard</div>
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                      Access to analytics, menu pricing, orders, reports &amp; staff credentials.
                    </p>
                  </label>

                  {/* Kitchen Option */}
                  <label className={`p-3 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                    formData.role === 'kitchen'
                      ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/40 shadow-xs'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}>
                    <input
                      type="radio"
                      name="role"
                      value="kitchen"
                      checked={formData.role === 'kitchen'}
                      onChange={() => setFormData({ 
                        ...formData, 
                        role: 'kitchen', 
                        department: 'Kitchen Brigade',
                        pin: formData.pin || '1234'
                      })}
                      className="sr-only"
                    />
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
                        <ChefHat className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-xs text-slate-900 dark:text-white">Kitchen KDS</div>
                        <div className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold">Order Prep Station</div>
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                      Access to Kitchen Display System, mark orders ready, and 86/sold-out toggles.
                    </p>
                  </label>

                </div>
              </div>

              {/* Title & Department */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Job Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder={formData.role === 'kitchen' ? 'e.g. Senior Sous Chef' : 'e.g. Assistant General Manager'}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Phone Number (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98450 00000"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2.5">
                <button 
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)} 
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all cursor-pointer active:scale-95 flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Save &amp; Activate Credential</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default StaffPage;

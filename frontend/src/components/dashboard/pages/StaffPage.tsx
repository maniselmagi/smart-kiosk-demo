import React, { useState, useEffect } from 'react';
import { useKiosk } from '../../../context/KioskContext';
import { 
  Users, 
  ShieldCheck, 
  ChefHat, 
  Plus, 
  Search, 
  KeyRound, 
  Phone, 
  Mail, 
  X,
  Lock,
  Eye,
  EyeOff,
  BarChart3,
  Trash2,
  Edit2,
  Check,
  AlertCircle,
  Pencil,
  SlidersHorizontal,
  RotateCcw,
  UserCheck,
  LayoutGrid
} from 'lucide-react';
import { authService, UserCredential } from '../../../services/authService';
import { getWaiterZones, saveWaiterZones, WaiterZoneConfig, DEFAULT_WAITER_ZONES } from '../../../utils/waiterAssignment';

export const StaffPage: React.FC = () => {
  const { showToast } = useKiosk();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Credentials state
  const [userCredentials, setUserCredentials] = useState<UserCredential[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  
  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});

  // Create Form State
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    role: 'management' as 'management' | 'kitchen',
    title: '',
    pin: '9901',
    department: 'Management',
    phone: '',
    email: '',
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [showFormPassword, setShowFormPassword] = useState(false);

  // Edit Form State
  const [editFormData, setEditFormData] = useState({
    id: '',
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
  const [editFormError, setEditFormError] = useState<string | null>(null);
  const [showEditPassword, setShowEditPassword] = useState(false);

  // Waiter-Table Allocation Management State
  const [waiterZones, setWaiterZones] = useState<WaiterZoneConfig[]>(getWaiterZones);
  const [editingZone, setEditingZone] = useState<WaiterZoneConfig | null>(null);
  const [isZoneModalOpen, setIsZoneModalOpen] = useState(false);
  const [zoneFormData, setZoneFormData] = useState({
    id: '',
    name: '',
    initial: '',
    minTable: 1,
    maxTable: 5,
    colorStyle: 'blue'
  });

  // Load user credentials
  const refreshUsers = () => {
    const users = authService.getUsers();
    setUserCredentials(users);
    if (users.length > 0 && !selectedUserId) {
      setSelectedUserId(users[0].id);
    }
  };

  useEffect(() => {
    refreshUsers();
    // Fetch live users from Supabase Cloud PostgreSQL so all devices see new credentials
    authService.syncWithCloud().then(() => {
      refreshUsers();
    });

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

  // 1. CREATE ACTION
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
      setSelectedUserId(result.user.id);
      setIsCreateModalOpen(false);
      showToast(`User @${result.user.username} created successfully!`);
    } else {
      setFormError(result.error || 'Failed to create user.');
    }
  };

  // 2. EDIT ACTION
  const handleOpenEditModal = (targetUser?: UserCredential) => {
    const userToEdit = targetUser || userCredentials.find(u => u.id === selectedUserId);
    if (!userToEdit) {
      showToast('Please select a user from the table to edit.');
      return;
    }

    setEditFormData({
      id: userToEdit.id,
      name: userToEdit.name,
      username: userToEdit.username,
      password: userToEdit.password,
      role: userToEdit.role,
      title: userToEdit.title || '',
      pin: userToEdit.pin || (userToEdit.role === 'management' ? '9901' : '1234'),
      department: userToEdit.department || '',
      phone: userToEdit.phone || '',
      email: userToEdit.email || '',
    });
    setEditFormError(null);
    setShowEditPassword(false);
    setIsEditModalOpen(true);
  };

  const handleSaveEditUser = (e: React.FormEvent) => {
    e.preventDefault();
    setEditFormError(null);

    const result = authService.updateUser(editFormData.id, {
      name: editFormData.name.trim(),
      password: editFormData.password.trim(),
      role: editFormData.role,
      title: editFormData.title.trim(),
      pin: editFormData.pin.trim(),
      department: editFormData.department.trim(),
      phone: editFormData.phone.trim(),
      email: editFormData.email.trim(),
    });

    if (result.success && result.user) {
      refreshUsers();
      setIsEditModalOpen(false);
      showToast(`User @${result.user.username} updated successfully!`);
    } else {
      setEditFormError(result.error || 'Failed to update user.');
    }
  };

  // 3. DELETE ACTION
  const handleDeleteSelected = (targetUser?: UserCredential) => {
    const userToDelete = targetUser || userCredentials.find(u => u.id === selectedUserId);
    if (!userToDelete) {
      showToast('Please select a user from the table to delete.');
      return;
    }

    if (userToDelete.isDefault || userToDelete.username.toLowerCase() === 'admin') {
      showToast('The default administrator account is protected and cannot be deleted.');
      return;
    }

    if (window.confirm(`Are you sure you want to delete user @${userToDelete.username} (${userToDelete.name})?`)) {
      const result = authService.deleteUser(userToDelete.id);
      if (result.success) {
        refreshUsers();
        setSelectedUserId(null);
        showToast(`User @${userToDelete.username} deleted.`);
      } else {
        showToast(result.error || 'Failed to delete user.');
      }
    }
  };

  // Filter credentials by search
  const filteredCredentials = userCredentials.filter(u => 
    !searchQuery ||
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (u.pin && u.pin.includes(searchQuery)) ||
    (u.title && u.title.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const selectedUser = userCredentials.find(u => u.id === selectedUserId) || null;

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      
      {/* Top Header Card */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white font-display">
              User Credential Directory
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 text-xs font-bold">
              {userCredentials.length} System Accounts
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage kiosk and station login credentials, 4-digit station PINs, and station roles.
          </p>
        </div>

        {/* 3 TOP ACTION BUTTONS: CREATE, EDIT, DELETE */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Button 1: Create */}
          <button
            onClick={handleOpenCreateModal}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-sm transition-all cursor-pointer active:scale-95"
            title="Create a new login user"
          >
            <Plus className="w-4 h-4" />
            <span>Create User</span>
          </button>

          {/* Button 2: Edit */}
          <button
            onClick={() => handleOpenEditModal()}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-white text-xs font-bold shadow-sm transition-all cursor-pointer active:scale-95"
            title="Edit selected user credential"
          >
            <Pencil className="w-3.5 h-3.5" />
            <span>Edit User</span>
          </button>

          {/* Button 3: Delete */}
          <button
            onClick={() => handleDeleteSelected()}
            disabled={!selectedUser || selectedUser.isDefault || selectedUser.username.toLowerCase() === 'admin'}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold shadow-sm transition-all cursor-pointer active:scale-95"
            title="Delete selected user credential"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete User</span>
          </button>
        </div>
      </div>

      {/* Search & Selected User Bar */}
      <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search username, name, PIN, role..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
          />
        </div>

        {selectedUser && (
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span>Selected:</span>
            <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              {selectedUser.name} (@{selectedUser.username})
            </span>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* USER CREDENTIAL DIRECTORY TABLE (PIN & DATA CLEARLY SHOWN) */}
      {/* ========================================================= */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/70 dark:bg-slate-800/40 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-100 dark:border-slate-800">
                <th className="py-3 px-3 w-10 text-center">Select</th>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Username</th>
                <th className="py-3 px-4">Station PIN</th>
                <th className="py-3 px-4">Station Role</th>
                <th className="py-3 px-4">Password</th>
                <th className="py-3 px-4">Department / Title</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredCredentials.map((user) => {
                const isSelected = selectedUserId === user.id;
                const isPassVisible = visiblePasswords[user.id] || false;
                
                return (
                  <tr 
                    key={user.id} 
                    onClick={() => setSelectedUserId(user.id)}
                    className={`transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50/70 dark:bg-blue-950/40'
                        : 'hover:bg-slate-50/80 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    
                    {/* Radio Select */}
                    <td className="py-3.5 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="radio"
                        name="selected_user"
                        checked={isSelected}
                        onChange={() => setSelectedUserId(user.id)}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                    </td>

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

                    {/* Station PIN (Clearly Highlighted) */}
                    <td className="py-3.5 px-4">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/50 border border-amber-200/80 dark:border-amber-800/60">
                        <KeyRound className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span className="font-mono font-extrabold text-xs text-amber-700 dark:text-amber-300 tracking-wider">
                          {user.pin || '----'}
                        </span>
                      </div>
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
                    <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200/80 dark:border-slate-700">
                          {isPassVisible ? user.password : '••••••••'}
                        </span>
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility(user.id)}
                          className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                          title={isPassVisible ? "Hide password" : "Show password"}
                        >
                          {isPassVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </td>

                    {/* Department / Title */}
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">
                      <div className="font-medium text-slate-800 dark:text-slate-200">{user.title}</div>
                      <div className="text-[10px] text-slate-400">{user.department}</div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEditModal(user)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/50 transition-colors cursor-pointer"
                          title="Edit user"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>

                        {user.isDefault ? (
                          <span className="text-[10px] text-slate-400 italic px-1">Protected</span>
                        ) : (
                          <button
                            onClick={() => handleDeleteSelected(user)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors cursor-pointer"
                            title="Delete user"
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

      {/* ========================================================= */}
      {/* 2. WAITER TABLE ALLOCATION MANAGEMENT                     */}
      {/* ========================================================= */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-5">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold text-sm">
                <UserCheck className="w-4 h-4" />
              </div>
              <h3 className="text-lg font-black font-display text-slate-900 dark:text-white">
                Waiter Table Allocation (Floor Service Coverage)
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-bold">
                {waiterZones.length} Active Waiter Sections
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Admin control: configure how many tables each waiter is allowed to serve. Allocations sync in real time to the Kitchen Display.
            </p>
          </div>

          {/* Quick Presets */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-slate-400">Presets:</span>
            
            {/* 4 Waiters x 5 Tables */}
            <button
              onClick={() => {
                saveWaiterZones(DEFAULT_WAITER_ZONES);
                setWaiterZones(DEFAULT_WAITER_ZONES);
                showToast('Applied Preset: 4 Waiters • 5 Tables Each (Synced to Kitchen Display)');
              }}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
            >
              4 Waiters × 5 Tables
            </button>

            {/* 5 Waiters x 4 Tables */}
            <button
              onClick={() => {
                const zones5x4: WaiterZoneConfig[] = [
                  {
                    id: 'z-1', rangeLabel: 'T(1-4)', minTable: 1, maxTable: 4, specificTables: [1,2,3,4],
                    waiter: { code: 'V', name: 'Vikram', fullName: 'Vikram (V)', initial: 'V', zone: 'T(1-4)', role: 'Section Waiter • Tables 1-4', color: 'bg-blue-500/20 text-blue-400 border-blue-500/40', avatarBg: 'bg-blue-600 text-white' }
                  },
                  {
                    id: 'z-2', rangeLabel: 'T(5-8)', minTable: 5, maxTable: 8, specificTables: [5,6,7,8],
                    waiter: { code: 'B', name: 'Bala', fullName: 'Bala (B)', initial: 'B', zone: 'T(5-8)', role: 'Section Waiter • Tables 5-8', color: 'bg-amber-500/20 text-amber-400 border-amber-500/40', avatarBg: 'bg-amber-600 text-white' }
                  },
                  {
                    id: 'z-3', rangeLabel: 'T(9-12)', minTable: 9, maxTable: 12, specificTables: [9,10,11,12],
                    waiter: { code: 'S', name: 'Suresh', fullName: 'Suresh (S)', initial: 'S', zone: 'T(9-12)', role: 'Section Waiter • Tables 9-12', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40', avatarBg: 'bg-emerald-600 text-white' }
                  },
                  {
                    id: 'z-4', rangeLabel: 'T(13-16)', minTable: 13, maxTable: 16, specificTables: [13,14,15,16],
                    waiter: { code: 'R', name: 'Rajesh', fullName: 'Rajesh (R)', initial: 'R', zone: 'T(13-16)', role: 'Section Waiter • Tables 13-16', color: 'bg-purple-500/20 text-purple-400 border-purple-500/40', avatarBg: 'bg-purple-600 text-white' }
                  },
                  {
                    id: 'z-5', rangeLabel: 'T(17-20)', minTable: 17, maxTable: 20, specificTables: [17,18,19,20],
                    waiter: { code: 'A', name: 'Anand', fullName: 'Anand (A)', initial: 'A', zone: 'T(17-20)', role: 'Section Waiter • Tables 17-20', color: 'bg-rose-500/20 text-rose-400 border-rose-500/40', avatarBg: 'bg-rose-600 text-white' }
                  }
                ];
                saveWaiterZones(zones5x4);
                setWaiterZones(zones5x4);
                showToast('Applied Preset: 5 Waiters • 4 Tables Each (Synced to Kitchen Display)');
              }}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
            >
              5 Waiters × 4 Tables
            </button>

            {/* 2 Waiters x 10 Tables */}
            <button
              onClick={() => {
                const zones2x10: WaiterZoneConfig[] = [
                  {
                    id: 'z-1', rangeLabel: 'T(1-10)', minTable: 1, maxTable: 10,
                    waiter: { code: 'S', name: 'Suresh', fullName: 'Suresh (S)', initial: 'S', zone: 'T(1-10)', role: 'Section Captain • Tables 1-10', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40', avatarBg: 'bg-emerald-600 text-white' }
                  },
                  {
                    id: 'z-2', rangeLabel: 'T(11-20)', minTable: 11, maxTable: 20,
                    waiter: { code: 'B', name: 'Bala', fullName: 'Bala (B)', initial: 'B', zone: 'T(11-20)', role: 'Section Captain • Tables 11-20', color: 'bg-amber-500/20 text-amber-400 border-amber-500/40', avatarBg: 'bg-amber-600 text-white' }
                  }
                ];
                saveWaiterZones(zones2x10);
                setWaiterZones(zones2x10);
                showToast('Applied Preset: 2 Waiters • 10 Tables Each (Synced to Kitchen Display)');
              }}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
            >
              2 Waiters × 10 Tables
            </button>
          </div>
        </div>

        {/* Waiter Allocations Grid / Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200/80 dark:border-slate-800">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800 text-slate-400 font-extrabold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Assigned Waiter</th>
                <th className="py-3 px-4">Dining Tables Served</th>
                <th className="py-3 px-4">Tables Count</th>
                <th className="py-3 px-4">Zone Label</th>
                <th className="py-3 px-4">Kitchen Badge Preview</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {waiterZones.map((zone) => {
                const count = zone.maxTable - zone.minTable + 1;

                return (
                  <tr key={zone.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-7 h-7 rounded-lg ${zone.waiter.avatarBg} font-black text-xs flex items-center justify-center`}>
                          {zone.waiter.initial}
                        </div>
                        <div>
                          <span>{zone.waiter.name}</span>
                          <span className="text-[10px] text-slate-400 block font-normal">{zone.waiter.role}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-mono font-extrabold text-xs text-blue-600 dark:text-blue-400">
                        Table {zone.minTable} to Table {zone.maxTable}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 font-bold text-xs text-slate-700 dark:text-slate-300">
                        {count} Tables
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-bold font-mono text-xs">
                      {zone.rangeLabel}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border inline-flex items-center gap-1.5 ${zone.waiter.color}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        <strong>{zone.rangeLabel}</strong>
                        <span>{zone.waiter.initial} {zone.waiter.name}</span>
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => {
                          setEditingZone(zone);
                          setZoneFormData({
                            id: zone.id,
                            name: zone.waiter.name,
                            initial: zone.waiter.initial,
                            minTable: zone.minTable,
                            maxTable: zone.maxTable,
                            colorStyle: zone.waiter.color.includes('emerald') ? 'emerald' : zone.waiter.color.includes('amber') ? 'amber' : zone.waiter.color.includes('purple') ? 'purple' : 'blue'
                          });
                          setIsZoneModalOpen(true);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 text-blue-600 dark:text-blue-400 font-bold text-xs transition-colors cursor-pointer flex items-center gap-1.5 ml-auto"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        <span>Edit Allocation</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>

      {/* ========================================================= */}
      {/* MODAL: EDIT WAITER TABLE ALLOCATION                       */}
      {/* ========================================================= */}
      {isZoneModalOpen && editingZone && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 text-slate-800 dark:text-slate-100 overflow-hidden">
            
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-display">
                  Table Coverage Config
                </span>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white font-display">
                  Edit Waiter Table Allocation
                </h3>
              </div>
              <button 
                onClick={() => setIsZoneModalOpen(false)} 
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const min = Number(zoneFormData.minTable);
                const max = Number(zoneFormData.maxTable);
                if (min < 1 || max < min) {
                  showToast('Please enter valid table numbers (Min must be <= Max)');
                  return;
                }

                const rangeLabel = `T(${min}-${max})`;
                const colorMap = {
                  blue: { color: 'bg-blue-500/20 text-blue-400 border-blue-500/40', avatarBg: 'bg-blue-600 text-white' },
                  amber: { color: 'bg-amber-500/20 text-amber-400 border-amber-500/40', avatarBg: 'bg-amber-600 text-white' },
                  emerald: { color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40', avatarBg: 'bg-emerald-600 text-white' },
                  purple: { color: 'bg-purple-500/20 text-purple-400 border-purple-500/40', avatarBg: 'bg-purple-600 text-white' }
                }[zoneFormData.colorStyle as 'blue' | 'amber' | 'emerald' | 'purple'] || { color: 'bg-blue-500/20 text-blue-400 border-blue-500/40', avatarBg: 'bg-blue-600 text-white' };

                const updatedZones = waiterZones.map(z => {
                  if (z.id === editingZone.id) {
                    return {
                      ...z,
                      rangeLabel,
                      minTable: min,
                      maxTable: max,
                      waiter: {
                        ...z.waiter,
                        name: zoneFormData.name.trim(),
                        initial: zoneFormData.initial.trim() || zoneFormData.name.charAt(0).toUpperCase(),
                        zone: rangeLabel,
                        role: `Section Waiter • Tables ${min} to ${max}`,
                        ...colorMap
                      }
                    };
                  }
                  return z;
                });

                saveWaiterZones(updatedZones);
                setWaiterZones(updatedZones);
                setIsZoneModalOpen(false);
                showToast(`Waiter ${zoneFormData.name} table allocation updated to Tables ${min}-${max}! Real-time synced to Kitchen.`);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Waiter Name
                </label>
                <input
                  type="text"
                  required
                  value={zoneFormData.name}
                  onChange={(e) => setZoneFormData({ ...zoneFormData, name: e.target.value, initial: e.target.value.charAt(0).toUpperCase() })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Start Table Number
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    required
                    value={zoneFormData.minTable}
                    onChange={(e) => setZoneFormData({ ...zoneFormData, minTable: parseInt(e.target.value) || 1 })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    End Table Number
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    required
                    value={zoneFormData.maxTable}
                    onChange={(e) => setZoneFormData({ ...zoneFormData, maxTable: parseInt(e.target.value) || 1 })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 font-mono font-bold"
                  />
                </div>
              </div>

              {/* Real-time Calculation Summary */}
              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-xs">
                <span className="font-bold text-blue-700 dark:text-blue-400 block">
                  Coverage Summary:
                </span>
                <span className="text-slate-600 dark:text-slate-300">
                  Waiter <strong>{zoneFormData.name || 'Server'}</strong> will serve <strong>{Math.max(0, zoneFormData.maxTable - zoneFormData.minTable + 1)} tables</strong> (Table {zoneFormData.minTable} to Table {zoneFormData.maxTable}).
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Badge Color Style
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'blue', label: 'Blue', color: 'bg-blue-500' },
                    { id: 'amber', label: 'Amber', color: 'bg-amber-500' },
                    { id: 'emerald', label: 'Emerald', color: 'bg-emerald-500' },
                    { id: 'purple', label: 'Purple', color: 'bg-purple-500' },
                  ].map(c => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setZoneFormData({ ...zoneFormData, colorStyle: c.id })}
                      className={`p-2 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer ${
                        zoneFormData.colorStyle === c.id
                          ? 'border-blue-500 ring-2 ring-blue-500/30 font-black'
                          : 'border-slate-200 dark:border-slate-700 hover:border-slate-400'
                      }`}
                    >
                      <span className={`w-2.5 h-2.5 rounded-full ${c.color}`} />
                      <span>{c.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsZoneModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 dark:hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-black rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/20 cursor-pointer"
                >
                  Save &amp; Sync to Kitchen
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 1: CREATE USER CREDENTIAL                           */}
      {/* ========================================================= */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 text-slate-800 dark:text-slate-100 overflow-hidden">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-600 dark:text-blue-400 font-display flex items-center gap-1">
                  <Plus className="w-3.5 h-3.5" /> Provisioning
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

              {/* Password & Station PIN */}
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
                    type="text"
                    maxLength={4}
                    value={formData.pin}
                    onChange={(e) => setFormData({ ...formData, pin: e.target.value.replace(/\D/g, '') })}
                    placeholder="e.g. 5566"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 font-mono font-bold text-center tracking-widest"
                  />
                </div>
              </div>

              {/* Role Selection */}
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-2">
                  Assigned Station &amp; Role Access *
                </label>
                <div className="grid grid-cols-2 gap-3">
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
                      Full access to POS, menus, kiosks, reports &amp; users.
                    </p>
                  </label>

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
                      Access to Kitchen Display System &amp; sold-out items.
                    </p>
                  </label>
                </div>
              </div>

              {/* Title & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Job Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder={formData.role === 'kitchen' ? 'e.g. Sous Chef' : 'e.g. Store Supervisor'}
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

              {/* Buttons */}
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
                  <span>Create User</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: EDIT USER CREDENTIAL                             */}
      {/* ========================================================= */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 text-slate-800 dark:text-slate-100 overflow-hidden">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-500 font-display flex items-center gap-1">
                  <Pencil className="w-3.5 h-3.5" /> Modify Account
                </span>
                <h3 className="font-extrabold text-lg text-slate-900 dark:text-white font-display">
                  Edit User Credential (@{editFormData.username})
                </h3>
              </div>
              <button 
                onClick={() => setIsEditModalOpen(false)} 
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Error Message */}
            {editFormError && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{editFormError}</span>
              </div>
            )}

            <form onSubmit={handleSaveEditUser} className="space-y-4 text-xs">
              
              {/* Full Name & Username */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editFormData.name}
                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 font-medium"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    disabled
                    value={editFormData.username}
                    className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-500 font-mono font-bold cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Password & Station PIN */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300 block">
                      Password *
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowEditPassword(!showEditPassword)}
                      className="text-[10px] text-blue-600 hover:underline cursor-pointer"
                    >
                      {showEditPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                  <input
                    type={showEditPassword ? 'text' : 'password'}
                    required
                    value={editFormData.password}
                    onChange={(e) => setEditFormData({ ...editFormData, password: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Touch Station PIN (4-Digit) *
                  </label>
                  <input
                    type="text"
                    maxLength={4}
                    value={editFormData.pin}
                    onChange={(e) => setEditFormData({ ...editFormData, pin: e.target.value.replace(/\D/g, '') })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 font-mono font-bold text-center tracking-widest"
                  />
                </div>
              </div>

              {/* Role Selection */}
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-2">
                  Assigned Station &amp; Role Access *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label className={`p-3 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                    editFormData.role === 'management'
                      ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 shadow-xs'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}>
                    <input
                      type="radio"
                      name="edit_role"
                      value="management"
                      checked={editFormData.role === 'management'}
                      onChange={() => setEditFormData({ 
                        ...editFormData, 
                        role: 'management',
                        department: editFormData.department || 'Management'
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
                  </label>

                  <label className={`p-3 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                    editFormData.role === 'kitchen'
                      ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/40 shadow-xs'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}>
                    <input
                      type="radio"
                      name="edit_role"
                      value="kitchen"
                      checked={editFormData.role === 'kitchen'}
                      onChange={() => setEditFormData({ 
                        ...editFormData, 
                        role: 'kitchen',
                        department: editFormData.department || 'Kitchen Brigade'
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
                  </label>
                </div>
              </div>

              {/* Title & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Job Title
                  </label>
                  <input
                    type="text"
                    value={editFormData.title}
                    onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={editFormData.phone}
                    onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2.5">
                <button 
                  type="button"
                  onClick={() => setIsEditModalOpen(false)} 
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-white text-xs font-bold shadow-md shadow-amber-500/20 transition-all cursor-pointer active:scale-95 flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Update Credential</span>
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

import React, { useState, useEffect } from 'react';
import { 
  ChefHat, 
  BarChart3, 
  Lock, 
  ShieldCheck, 
  CheckCircle2, 
  X, 
  ArrowLeft, 
  Delete, 
  KeyRound, 
  Sparkles, 
  Crown, 
  User, 
  Check,
  AlertCircle
} from 'lucide-react';

export interface StaffUser {
  id: string;
  name: string;
  role: 'kitchen' | 'management';
  title: string;
  pin: string;
  username: string;
}

export const STAFF_USERS: StaffUser[] = [
  {
    id: 'chef-vikram',
    name: 'Chef Vikram Sharma',
    role: 'kitchen',
    title: 'Executive Head Chef',
    pin: '1234',
    username: 'chef_vikram',
  },
  {
    id: 'cook-arjun',
    name: 'Arjun Nair',
    role: 'kitchen',
    title: 'Senior Line Cook',
    pin: '4321',
    username: 'cook_arjun',
  },
  {
    id: 'mgr-indiranagar',
    name: 'Manager Indiranagar',
    role: 'management',
    title: 'General Store Manager',
    pin: '9901',
    username: 'manager_indiranagar',
  },
  {
    id: 'sup-raj',
    name: 'Raj Kumar',
    role: 'management',
    title: 'Floor Operations Lead',
    pin: '5522',
    username: 'supervisor_raj',
  },
];

interface StaffLoginModalProps {
  isOpen: boolean;
  initialRole?: 'kitchen' | 'management';
  onClose: () => void;
  onLoginSuccess: (role: 'kitchen' | 'management', staffUser: StaffUser) => void;
}

export const StaffLoginModal: React.FC<StaffLoginModalProps> = ({
  isOpen,
  initialRole = 'kitchen',
  onClose,
  onLoginSuccess,
}) => {
  const [selectedRole, setSelectedRole] = useState<'kitchen' | 'management'>(initialRole);
  const [pin, setPin] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [authenticatedStaff, setAuthenticatedStaff] = useState<StaffUser | null>(null);
  const [authMethod, setAuthMethod] = useState<'pin' | 'credentials'>('pin');

  // Username/Password alternative form
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  // Update selectedRole whenever initialRole changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedRole(initialRole);
      setPin('');
      setErrorMessage(null);
      setIsSuccess(false);
      setAuthenticatedStaff(null);
    }
  }, [isOpen, initialRole]);

  // Filter staff by role
  const roleStaff = STAFF_USERS.filter((s) => s.role === selectedRole);

  const handleKeyPress = (num: string) => {
    if (isSuccess) return;
    if (pin.length < 4) {
      const nextPin = pin + num;
      setPin(nextPin);
      setErrorMessage(null);

      // If user typed 4 digits, trigger verification
      if (nextPin.length === 4) {
        verifyPin(nextPin, selectedRole);
      }
    }
  };

  const handleDelete = () => {
    if (isSuccess) return;
    setPin((prev) => prev.slice(0, -1));
    setErrorMessage(null);
  };

  const handleClear = () => {
    if (isSuccess) return;
    setPin('');
    setErrorMessage(null);
  };

  const verifyPin = (inputPin: string, role: 'kitchen' | 'management') => {
    // 1. Direct match with role's staff
    const staffMatch = STAFF_USERS.find(
      (s) => s.role === role && s.pin === inputPin
    );

    // 2. Cross-role match (if user entered a valid management PIN while on kitchen tab or vice-versa)
    const crossMatch = STAFF_USERS.find((s) => s.pin === inputPin);

    // 3. Fallback master demo PINs (1234 for kitchen, 9901 for management, 0000 master)
    let matchedUser: StaffUser | null = staffMatch || null;

    if (!matchedUser && crossMatch) {
      matchedUser = crossMatch;
    } else if (!matchedUser && (inputPin === '1234' || inputPin === '0000')) {
      matchedUser = {
        id: `demo-${role}`,
        name: role === 'kitchen' ? 'Head Chef (Demo)' : 'Manager (Demo)',
        role: role,
        title: role === 'kitchen' ? 'Kitchen Station Lead' : 'Store Supervisor',
        pin: inputPin,
        username: `demo_${role}`,
      };
    }

    if (matchedUser) {
      setIsSuccess(true);
      setAuthenticatedStaff(matchedUser);
      setErrorMessage(null);

      // Play short haptic/animation delay before closing and redirecting
      setTimeout(() => {
        onLoginSuccess(matchedUser!.role, matchedUser!);
      }, 700);
    } else {
      setErrorMessage('Invalid 4-digit PIN. Tap a demo profile below or try again.');
      // Shake effect timeout
      setTimeout(() => {
        setPin('');
      }, 600);
    }
  };

  const handleQuickPreset = (staff: StaffUser) => {
    setSelectedRole(staff.role);
    setPin(staff.pin);
    setErrorMessage(null);
    verifyPin(staff.pin, staff.role);
  };

  const handleFormLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const matched = STAFF_USERS.find(
      (s) =>
        s.role === selectedRole &&
        s.username.toLowerCase() === username.trim().toLowerCase()
    );

    if (matched || (username && password)) {
      const userToUse: StaffUser = matched || {
        id: `staff-${Date.now()}`,
        name: username,
        role: selectedRole,
        title: selectedRole === 'kitchen' ? 'Kitchen Chef' : 'Operations Supervisor',
        pin: '1234',
        username: username,
      };

      setIsSuccess(true);
      setAuthenticatedStaff(userToUse);
      setTimeout(() => {
        onLoginSuccess(selectedRole, userToUse);
      }, 600);
    } else {
      setErrorMessage('Invalid username or password.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 select-none">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col text-white">
        
        {/* Ambient Top Glow Accent */}
        <div 
          className={`absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-32 blur-3xl pointer-events-none transition-colors duration-500 rounded-full ${
            selectedRole === 'kitchen' ? 'bg-amber-500/25' : 'bg-indigo-500/25'
          }`} 
        />

        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors active:scale-95 cursor-pointer"
              title="Return to Welcome Screen"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 font-display flex items-center gap-1">
                <Crown className="w-3 h-3" /> Royal Ember Staff Portal
              </span>
              <h2 className="text-lg font-black tracking-tight font-display text-white">
                Authorized Station Login
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors active:scale-95 cursor-pointer"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Role Selector Tabs: Kitchen vs Management */}
        <div className="p-4 bg-slate-950/60 border-b border-slate-800">
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-900 rounded-2xl border border-slate-800">
            
            {/* Kitchen Station Tab */}
            <button
              type="button"
              onClick={() => {
                setSelectedRole('kitchen');
                setPin('');
                setErrorMessage(null);
              }}
              className={`flex items-center justify-center gap-2.5 py-3 px-3 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                selectedRole === 'kitchen'
                  ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-white shadow-lg shadow-amber-500/20 scale-[1.02]'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <ChefHat className="w-4 h-4 shrink-0" />
              <div className="text-left">
                <div className="font-extrabold leading-tight">Kitchen Station</div>
                <div className="text-[10px] font-normal opacity-85">KDS &amp; Order Line</div>
              </div>
            </button>

            {/* Management Portal Tab */}
            <button
              type="button"
              onClick={() => {
                setSelectedRole('management');
                setPin('');
                setErrorMessage(null);
              }}
              className={`flex items-center justify-center gap-2.5 py-3 px-3 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                selectedRole === 'management'
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-500/20 scale-[1.02]'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <BarChart3 className="w-4 h-4 shrink-0" />
              <div className="text-left">
                <div className="font-extrabold leading-tight">Management Portal</div>
                <div className="text-[10px] font-normal opacity-85">POS &amp; Analytics</div>
              </div>
            </button>

          </div>
        </div>

        {/* Main Body: PIN Pad / Credentials */}
        <div className="p-6 flex flex-col items-center">
          
          {/* Success State Overlay */}
          {isSuccess && authenticatedStaff ? (
            <div className="py-8 flex flex-col items-center justify-center text-center animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mb-4 shadow-xl shadow-emerald-500/20 animate-bounce">
                <Check className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-white font-display">
                Access Granted
              </h3>
              <p className="text-sm font-bold text-amber-400 mt-1">
                {authenticatedStaff.name}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                {authenticatedStaff.title} • Opening {selectedRole === 'kitchen' ? 'Kitchen KDS' : 'Management Dashboard'}...
              </p>
            </div>
          ) : (
            <>
              {/* Method Toggle: Quick PIN vs Username */}
              <div className="w-full flex items-center justify-between mb-4 text-xs">
                <span className="text-slate-400 font-semibold flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                  {authMethod === 'pin' ? 'Enter 4-Digit Station PIN' : 'Sign In with Username'}
                </span>

                <button
                  type="button"
                  onClick={() => {
                    setAuthMethod(authMethod === 'pin' ? 'credentials' : 'pin');
                    setErrorMessage(null);
                  }}
                  className="text-amber-400 hover:text-amber-300 font-bold hover:underline cursor-pointer"
                >
                  {authMethod === 'pin' ? 'Use Username / Password' : 'Use Quick PIN Pad'}
                </button>
              </div>

              {authMethod === 'pin' ? (
                <div className="w-full flex flex-col items-center">
                  
                  {/* PIN Display Indicators (4 Glowing Dots) */}
                  <div className="flex items-center gap-4 mb-4">
                    {[0, 1, 2, 3].map((index) => {
                      const isFilled = pin.length > index;
                      return (
                        <div
                          key={index}
                          className={`w-4 h-4 rounded-full transition-all duration-200 ${
                            isFilled
                              ? selectedRole === 'kitchen'
                                ? 'bg-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.8)] scale-125'
                                : 'bg-indigo-400 shadow-[0_0_12px_rgba(99,102,241,0.8)] scale-125'
                              : 'bg-slate-800 border border-slate-700'
                          }`}
                        />
                      );
                    })}
                  </div>

                  {/* Error Notification */}
                  {errorMessage && (
                    <div className="w-full mb-3 p-2.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs font-semibold flex items-center justify-center gap-2 animate-shake">
                      <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {/* 3x4 Numeric Touchpad */}
                  <div className="grid grid-cols-3 gap-2.5 w-full max-w-xs mb-4">
                    {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                      <button
                        key={digit}
                        type="button"
                        onClick={() => handleKeyPress(digit)}
                        className="h-13 rounded-2xl bg-slate-800/90 hover:bg-slate-700 active:bg-slate-600 text-xl font-bold font-mono text-white transition-all shadow-sm active:scale-95 border border-slate-700/60 cursor-pointer flex items-center justify-center"
                      >
                        {digit}
                      </button>
                    ))}

                    {/* Clear Button */}
                    <button
                      type="button"
                      onClick={handleClear}
                      className="h-13 rounded-2xl bg-slate-800/50 hover:bg-slate-700/70 active:bg-slate-600 text-xs font-bold text-slate-400 hover:text-white transition-all border border-slate-700/40 active:scale-95 cursor-pointer flex items-center justify-center uppercase tracking-wider"
                    >
                      Clear
                    </button>

                    {/* Zero */}
                    <button
                      type="button"
                      onClick={() => handleKeyPress('0')}
                      className="h-13 rounded-2xl bg-slate-800/90 hover:bg-slate-700 active:bg-slate-600 text-xl font-bold font-mono text-white transition-all shadow-sm active:scale-95 border border-slate-700/60 cursor-pointer flex items-center justify-center"
                    >
                      0
                    </button>

                    {/* Backspace Button */}
                    <button
                      type="button"
                      onClick={handleDelete}
                      className="h-13 rounded-2xl bg-slate-800/50 hover:bg-slate-700/70 active:bg-slate-600 text-slate-400 hover:text-white transition-all border border-slate-700/40 active:scale-95 cursor-pointer flex items-center justify-center"
                      title="Backspace"
                    >
                      <Delete className="w-5 h-5" />
                    </button>
                  </div>

                </div>
              ) : (
                /* Form Login */
                <form onSubmit={handleFormLogin} className="w-full space-y-3 mb-4">
                  {errorMessage && (
                    <div className="p-2.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs font-semibold flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div>
                    <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1 block">
                      Username / Staff ID
                    </label>
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder={selectedRole === 'kitchen' ? 'chef_vikram' : 'manager_indiranagar'}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1 block">
                      Password or PIN
                    </label>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className={`w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-white shadow-lg transition-all active:scale-98 cursor-pointer ${
                      selectedRole === 'kitchen'
                        ? 'bg-amber-600 hover:bg-amber-500 shadow-amber-600/30'
                        : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/30'
                    }`}
                  >
                    Authenticate &amp; Open Station
                  </button>
                </form>
              )}

              {/* Quick 1-Tap Demo Staff Profiles */}
              <div className="w-full pt-3 border-t border-slate-800">
                <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2 flex items-center justify-between">
                  <span>Fast Demo Staff Access (1-Tap):</span>
                  <span className="text-amber-400 font-mono">PIN in badge</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {roleStaff.map((staff) => (
                    <button
                      key={staff.id}
                      type="button"
                      onClick={() => handleQuickPreset(staff)}
                      className="flex items-center justify-between p-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 hover:border-amber-500/40 transition-all text-left group cursor-pointer"
                    >
                      <div className="flex items-center gap-2 overflow-hidden">
                        <div className="w-7 h-7 rounded-lg bg-slate-700 flex items-center justify-center text-amber-400 text-xs shrink-0 group-hover:scale-105 transition-transform">
                          {selectedRole === 'kitchen' ? (
                            <ChefHat className="w-4 h-4" />
                          ) : (
                            <ShieldCheck className="w-4 h-4" />
                          )}
                        </div>
                        <div className="truncate">
                          <div className="text-xs font-bold text-slate-200 group-hover:text-white truncate">
                            {staff.name}
                          </div>
                          <div className="text-[10px] text-slate-400 truncate">
                            {staff.title}
                          </div>
                        </div>
                      </div>
                      <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-black/40 text-amber-300 border border-amber-500/30 shrink-0">
                        {staff.pin}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

            </>
          )}

        </div>

        {/* Footer: Direct Customer Kiosk Link */}
        <div className="px-6 py-3.5 bg-slate-950/80 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <span>Are you a customer?</span>
          <button
            type="button"
            onClick={onClose}
            className="text-amber-400 hover:text-amber-300 font-bold hover:underline cursor-pointer flex items-center gap-1"
          >
            <span>Go to Customer Kiosk</span>
            <Sparkles className="w-3 h-3 text-amber-400" />
          </button>
        </div>

      </div>
    </div>
  );
};

export default StaffLoginModal;

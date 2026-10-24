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
  AlertCircle,
  Eye,
  EyeOff,
  LogIn
} from 'lucide-react';
import { authService, UserCredential } from '../../services/authService';

export type StaffUser = UserCredential;

interface StaffLoginModalProps {
  isOpen: boolean;
  initialRole?: 'kitchen' | 'management';
  onClose: () => void;
  onLoginSuccess: (role: 'kitchen' | 'management', staffUser: StaffUser) => void;
}

export const StaffLoginModal: React.FC<StaffLoginModalProps> = ({
  isOpen,
  initialRole = 'management',
  onClose,
  onLoginSuccess,
}) => {
  const [selectedRole, setSelectedRole] = useState<'all' | 'kitchen' | 'management'>('all');
  const [authMethod, setAuthMethod] = useState<'credentials' | 'pin'>('credentials');
  
  // Credentials state
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  
  // PIN state
  const [pin, setPin] = useState<string>('');
  
  // Feedback state
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [authenticatedStaff, setAuthenticatedStaff] = useState<StaffUser | null>(null);
  const [usersList, setUsersList] = useState<UserCredential[]>([]);

  // Load latest users from authService
  useEffect(() => {
    if (isOpen) {
      const users = authService.getUsers();
      setUsersList(users);
      setSelectedRole(initialRole || 'all');
      setUsername('');
      setPassword('');
      setPin('');
      setErrorMessage(null);
      setIsSuccess(false);
      setAuthenticatedStaff(null);
    }
  }, [isOpen, initialRole]);

  // Listen for user updates
  useEffect(() => {
    const handleUpdate = () => {
      setUsersList(authService.getUsers());
    };
    window.addEventListener('auth_users_updated', handleUpdate);
    return () => window.removeEventListener('auth_users_updated', handleUpdate);
  }, []);

  const handleCredentialsLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanUser = username.trim();
    const cleanPass = password.trim();

    if (!cleanUser || !cleanPass) {
      setErrorMessage('Please enter both username and password.');
      return;
    }

    const result = authService.authenticate(cleanUser, cleanPass);

    if (result.success && result.user) {
      // Check if role filter matches (if user specifically clicked Kitchen or Management tab)
      if (selectedRole !== 'all' && result.user.role !== selectedRole) {
        setErrorMessage(
          `This account belongs to ${
            result.user.role === 'management' ? 'Management Dashboard' : 'Kitchen KDS'
          }. Please select the ${result.user.role} tab or Auto-Detect.`
        );
        return;
      }

      triggerLoginSuccess(result.user);
    } else {
      setErrorMessage(result.error || 'Invalid credentials. Default admin: admin / admin123');
    }
  };

  const handlePinDigit = (digit: string) => {
    if (isSuccess) return;
    if (pin.length < 4) {
      const nextPin = pin + digit;
      setPin(nextPin);
      setErrorMessage(null);

      if (nextPin.length === 4) {
        const preferredRole = selectedRole === 'all' ? undefined : selectedRole;
        const result = authService.authenticatePin(nextPin, preferredRole);
        if (result.success && result.user) {
          triggerLoginSuccess(result.user);
        } else {
          setErrorMessage('Invalid 4-digit PIN. Try 9901 for Manager or 1234 for Kitchen.');
          setTimeout(() => setPin(''), 600);
        }
      }
    }
  };

  const triggerLoginSuccess = (user: UserCredential) => {
    setIsSuccess(true);
    setAuthenticatedStaff(user);
    setErrorMessage(null);

    setTimeout(() => {
      onLoginSuccess(user.role, user);
    }, 700);
  };

  const fillQuickPreset = (u: string, p: string, role?: 'management' | 'kitchen') => {
    setUsername(u);
    setPassword(p);
    if (role) setSelectedRole(role);
    setErrorMessage(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 select-none">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col text-white">
        
        {/* Ambient Top Glow Accent */}
        <div 
          className={`absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-32 blur-3xl pointer-events-none transition-colors duration-500 rounded-full ${
            selectedRole === 'kitchen' 
              ? 'bg-amber-500/25' 
              : selectedRole === 'management' 
              ? 'bg-blue-500/25' 
              : 'bg-indigo-500/20'
          }`} 
        />

        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-slate-800">
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

        {/* Role Selector Tabs */}
        <div className="p-3 bg-slate-950/60 border-b border-slate-800">
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-900 rounded-2xl border border-slate-800 text-xs">
            
            {/* Auto Detect Role */}
            <button
              type="button"
              onClick={() => {
                setSelectedRole('all');
                setErrorMessage(null);
              }}
              className={`py-2 px-2 rounded-xl font-bold transition-all text-center cursor-pointer ${
                selectedRole === 'all'
                  ? 'bg-gradient-to-r from-slate-700 to-slate-800 text-white shadow-md border border-slate-600'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <div className="font-extrabold text-[11px] leading-tight">Auto-Detect</div>
              <div className="text-[9px] opacity-75">By Username</div>
            </button>

            {/* Management Portal Tab */}
            <button
              type="button"
              onClick={() => {
                setSelectedRole('management');
                setErrorMessage(null);
              }}
              className={`py-2 px-2 rounded-xl font-bold transition-all text-center cursor-pointer ${
                selectedRole === 'management'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <div className="font-extrabold text-[11px] leading-tight flex items-center justify-center gap-1">
                <BarChart3 className="w-3.5 h-3.5 shrink-0" />
                <span>Management</span>
              </div>
              <div className="text-[9px] opacity-75">Dashboard / POS</div>
            </button>

            {/* Kitchen Station Tab */}
            <button
              type="button"
              onClick={() => {
                setSelectedRole('kitchen');
                setErrorMessage(null);
              }}
              className={`py-2 px-2 rounded-xl font-bold transition-all text-center cursor-pointer ${
                selectedRole === 'kitchen'
                  ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-white shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <div className="font-extrabold text-[11px] leading-tight flex items-center justify-center gap-1">
                <ChefHat className="w-3.5 h-3.5 shrink-0" />
                <span>Kitchen KDS</span>
              </div>
              <div className="text-[9px] opacity-75">Order Prep Line</div>
            </button>

          </div>
        </div>

        {/* Main Body: Username/Password OR PIN Pad */}
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
                {authenticatedStaff.name} (@{authenticatedStaff.username})
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                {authenticatedStaff.title} • Opening {authenticatedStaff.role === 'kitchen' ? 'Kitchen KDS' : 'Management Dashboard'}...
              </p>
            </div>
          ) : (
            <>
              {/* Method Switcher Header */}
              <div className="w-full flex items-center justify-between mb-4 text-xs">
                <span className="text-slate-300 font-bold flex items-center gap-1.5">
                  {authMethod === 'credentials' ? (
                    <>
                      <User className="w-3.5 h-3.5 text-blue-400" />
                      <span>Enter Username &amp; Password</span>
                    </>
                  ) : (
                    <>
                      <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                      <span>Enter 4-Digit Station PIN</span>
                    </>
                  )}
                </span>

                <button
                  type="button"
                  onClick={() => {
                    setAuthMethod(authMethod === 'credentials' ? 'pin' : 'credentials');
                    setErrorMessage(null);
                  }}
                  className="text-amber-400 hover:text-amber-300 font-bold hover:underline cursor-pointer flex items-center gap-1"
                >
                  {authMethod === 'credentials' ? (
                    <>
                      <KeyRound className="w-3 h-3" />
                      <span>Switch to PIN Pad</span>
                    </>
                  ) : (
                    <>
                      <User className="w-3 h-3" />
                      <span>Switch to Username Login</span>
                    </>
                  )}
                </button>
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className="w-full mb-4 p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs font-semibold flex items-center gap-2 animate-shake">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* A. CREDENTIALS FORM (Default Primary Method) */}
              {authMethod === 'credentials' ? (
                <form onSubmit={handleCredentialsLogin} className="w-full space-y-3.5 mb-4">
                  <div>
                    <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1 block">
                      Username
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 font-mono text-sm">@</span>
                      <input
                        type="text"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="e.g. admin or created user"
                        className="w-full pl-8 pr-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                        <span>{showPassword ? 'Hide' : 'Show'}</span>
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors font-mono"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-white shadow-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2 mt-2"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Login &amp; Open Station</span>
                  </button>
                </form>
              ) : (
                /* B. TOUCHSCREEN 4-DIGIT PIN PAD */
                <div className="w-full flex flex-col items-center">
                  
                  {/* PIN Display Indicators */}
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
                                : 'bg-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.8)] scale-125'
                              : 'bg-slate-800 border border-slate-700'
                          }`}
                        />
                      );
                    })}
                  </div>

                  {/* 3x4 Touchpad */}
                  <div className="grid grid-cols-3 gap-2.5 w-full max-w-xs mb-4">
                    {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                      <button
                        key={digit}
                        type="button"
                        onClick={() => handlePinDigit(digit)}
                        className="h-12 rounded-2xl bg-slate-800/90 hover:bg-slate-700 active:bg-slate-600 text-xl font-bold font-mono text-white transition-all shadow-sm active:scale-95 border border-slate-700/60 cursor-pointer flex items-center justify-center"
                      >
                        {digit}
                      </button>
                    ))}

                    <button
                      type="button"
                      onClick={() => setPin('')}
                      className="h-12 rounded-2xl bg-slate-800/50 hover:bg-slate-700/70 text-xs font-bold text-slate-400 hover:text-white transition-all border border-slate-700/40 active:scale-95 cursor-pointer flex items-center justify-center uppercase"
                    >
                      Clear
                    </button>

                    <button
                      type="button"
                      onClick={() => handlePinDigit('0')}
                      className="h-12 rounded-2xl bg-slate-800/90 hover:bg-slate-700 active:bg-slate-600 text-xl font-bold font-mono text-white transition-all shadow-sm active:scale-95 border border-slate-700/60 cursor-pointer flex items-center justify-center"
                    >
                      0
                    </button>

                    <button
                      type="button"
                      onClick={() => setPin(prev => prev.slice(0, -1))}
                      className="h-12 rounded-2xl bg-slate-800/50 hover:bg-slate-700/70 text-slate-400 hover:text-white transition-all border border-slate-700/40 active:scale-95 cursor-pointer flex items-center justify-center"
                    >
                      <Delete className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}

              {/* QUICK DEFAULT CREDENTIALS (1-Tap Fill & Test) */}
              <div className="w-full pt-3.5 border-t border-slate-800">
                <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2 flex items-center justify-between">
                  <span>Fast Demo Login Credentials:</span>
                  <span className="text-amber-400">1-Tap to auto-fill</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-left">
                  {/* Default Admin (Management) */}
                  <button
                    type="button"
                    onClick={() => fillQuickPreset('admin', 'admin123', 'management')}
                    className="p-2.5 rounded-xl bg-blue-950/40 hover:bg-blue-900/50 border border-blue-500/40 transition-all group cursor-pointer"
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                      <span className="text-xs font-extrabold text-blue-300">Default Admin</span>
                    </div>
                    <div className="text-[10px] text-slate-300 font-mono">
                      User: <b className="text-white">admin</b>
                    </div>
                    <div className="text-[10px] text-slate-300 font-mono">
                      Pass: <b className="text-white">admin123</b>
                    </div>
                  </button>

                  {/* Default Kitchen */}
                  <button
                    type="button"
                    onClick={() => fillQuickPreset('kitchen', 'kitchen123', 'kitchen')}
                    className="p-2.5 rounded-xl bg-amber-950/40 hover:bg-amber-900/50 border border-amber-500/40 transition-all group cursor-pointer"
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <ChefHat className="w-3.5 h-3.5 text-amber-400" />
                      <span className="text-xs font-extrabold text-amber-300">Default Kitchen</span>
                    </div>
                    <div className="text-[10px] text-slate-300 font-mono">
                      User: <b className="text-white">kitchen</b>
                    </div>
                    <div className="text-[10px] text-slate-300 font-mono">
                      Pass: <b className="text-white">kitchen123</b>
                    </div>
                  </button>
                </div>

                <p className="text-[10px] text-slate-500 text-center mt-2.5">
                  💡 Once logged in as Admin, create more users under <b>Staff &amp; Roles</b>.
                </p>
              </div>

            </>
          )}

        </div>

        {/* Footer: Direct Customer Kiosk Link */}
        <div className="px-6 py-3.5 bg-slate-950/80 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <span>Are you a guest?</span>
          <button
            type="button"
            onClick={onClose}
            className="text-amber-400 hover:text-amber-300 font-bold hover:underline cursor-pointer flex items-center gap-1"
          >
            <span>Return to Dining Kiosk</span>
            <Sparkles className="w-3 h-3 text-amber-400" />
          </button>
        </div>

      </div>
    </div>
  );
};

export default StaffLoginModal;

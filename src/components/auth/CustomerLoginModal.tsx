import React, { useState, useEffect } from 'react';
import { useCustomerAuth } from '../../context/CustomerAuthContext.js';
import { useAuth } from '../../context/AuthContext.js';
import { useSettings } from '../../context/SettingsContext.js';
import { api } from '../../lib/api.js';
import {
  X,
  Mail,
  Lock,
  User,
  Phone,
  Eye,
  EyeOff,
  LogOut,
  ArrowRight,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

interface CustomerLoginModalProps {
  onNavigate?: (page: string, params?: Record<string, any>) => void;
}

export const CustomerLoginModal: React.FC<CustomerLoginModalProps> = ({ onNavigate }) => {
  const {
    isLoginModalOpen,
    closeLoginModal,
    customer,
    isLoggedIn,
    loginCustomer,
    logoutCustomer,
  } = useCustomerAuth();

  const { login: adminAuthLogin } = useAuth();
  const { settings } = useSettings();

  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Prevent background page scrolling when modal is open
  useEffect(() => {
    if (isLoginModalOpen) {
      document.body.style.overflow = 'hidden';
      setError('');
      setSuccessMsg('');
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isLoginModalOpen]);

  if (!isLoginModalOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }
    if (!password.trim()) {
      setError('Please enter your password');
      return;
    }

    setLoading(true);

    try {
      // Authenticate against backend
      const result = await adminAuthLogin(email.trim(), password);

      // Role-based routing:
      if (result.role === 'admin') {
        // Detected Admin role -> automatically redirect directly to Admin Dashboard
        closeLoginModal();
        if (onNavigate) {
          onNavigate('admin-panel');
        }
      } else {
        // Detected Customer role -> activate customer session on the website
        loginCustomer(result.user.email, result.user.name, result.user.phone);
        closeLoginModal();
      }
    } catch (err: any) {
      setError(err.message || 'Invalid credentials. Please verify your email and password.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!name.trim()) {
      setError('Please enter your full name');
      return;
    }
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email.trim())) {
      setError('Please enter a valid email address');
      return;
    }
    if (!password.trim() || password.length < 4) {
      setError('Password must be at least 4 characters');
      return;
    }

    setLoading(true);

    try {
      const res = await api.register(name.trim(), email.trim(), password, phone.trim());
      loginCustomer(res.user.email, res.user.name, res.user.phone);
      closeLoginModal();
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try a different email.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!email.trim() || !/\S+@\S+\.\S+/.test(email.trim())) {
      setError('Please enter your registered email address');
      return;
    }

    setLoading(true);

    try {
      const res = await api.forgotPassword(email.trim());
      setSuccessMsg(res.message || 'Password reset link sent to your email.');
    } catch (err: any) {
      setError(err.message || 'Failed to process request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto overflow-x-hidden bg-black/65 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 -z-10"
        onClick={closeLoginModal}
        aria-label="Close dialog overlay"
      />

      {/* Main Dialog Card */}
      <div className="bg-[#FDFBF7] rounded-3xl border-2 border-[#D4AF37] max-w-md w-full shadow-2xl overflow-hidden relative my-auto animate-in zoom-in-95 duration-200 text-[#231F20]">
        {/* Luxury Header */}
        <div className="bg-[#722F37] text-white p-5 sm:p-6 flex items-center justify-between relative">
          <div className="space-y-0.5">
            <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-bold block">
              {settings.websiteName}
            </span>
            <h2 className="font-serif-luxury text-xl sm:text-2xl font-bold text-[#FDFBF7]">
              {isLoggedIn
                ? 'Your Account'
                : mode === 'login'
                ? 'Account Login'
                : mode === 'register'
                ? 'Create an Account'
                : 'Reset Password'}
            </h2>
          </div>

          <button
            onClick={closeLoginModal}
            className="p-1.5 rounded-full text-[#F4E8C1] hover:bg-white/10 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 sm:p-7 space-y-4 max-h-[82vh] overflow-y-auto overflow-x-hidden text-xs">
          {/* ALREADY LOGGED IN AS CUSTOMER */}
          {isLoggedIn && customer ? (
            <div className="space-y-4 py-2">
              <div className="p-4 bg-white rounded-2xl border border-[#E8DFC9] flex items-center space-x-3.5">
                <div className="w-12 h-12 rounded-full bg-[#722F37] text-[#D4AF37] flex items-center justify-center font-serif-luxury text-xl font-bold shrink-0">
                  {customer.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-serif-luxury text-sm font-bold text-[#231F20] truncate">
                    {customer.name}
                  </h3>
                  <p className="text-[11px] text-[#8C7654] truncate">{customer.email}</p>
                </div>
              </div>

              <div className="flex flex-col space-y-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    closeLoginModal();
                    if (onNavigate) onNavigate('products');
                  }}
                  className="w-full py-3 px-4 bg-[#722F37] hover:bg-[#501F25] text-[#F4E8C1] font-bold uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center justify-center space-x-1.5"
                >
                  <span>Continue Shopping</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    logoutCustomer();
                    setMode('login');
                  }}
                  className="w-full py-2.5 px-4 text-xs font-semibold text-[#722F37] hover:bg-[#F5EFEB] rounded-xl border border-[#722F37] flex items-center justify-center space-x-1.5 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          ) : (
            /* NOT LOGGED IN */
            <>
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
                  {error}
                </div>
              )}

              {successMsg && (
                <div className="p-3 bg-green-50 border border-green-200 text-green-800 text-xs rounded-xl flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* 1. LOGIN MODE */}
              {mode === 'login' && (
                <form onSubmit={handleLoginSubmit} className="space-y-3.5">
                  <div className="space-y-1">
                    <label className="font-semibold text-[#231F20] block">
                      Email Address *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email..."
                        className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#E8DFC9] rounded-xl text-xs text-[#231F20] focus:outline-none focus:ring-1 focus:ring-[#722F37]"
                      />
                      <Mail className="w-4 h-4 text-[#8C7654] absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="font-semibold text-[#231F20] block">
                        Password *
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setMode('forgot');
                          setError('');
                          setSuccessMsg('');
                        }}
                        className="text-[11px] text-[#722F37] hover:underline font-medium"
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-9 pr-10 py-2.5 bg-white border border-[#E8DFC9] rounded-xl text-xs text-[#231F20] focus:outline-none focus:ring-1 focus:ring-[#722F37]"
                      />
                      <Lock className="w-4 h-4 text-[#8C7654] absolute left-3 top-1/2 -translate-y-1/2" />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="p-1.5 text-[#8C7654] hover:text-[#722F37] absolute right-2.5 top-1/2 -translate-y-1/2"
                        aria-label="Toggle password view"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-[#722F37] hover:bg-[#501F25] text-[#F4E8C1] text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-50 mt-2 flex items-center justify-center space-x-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-[#F4E8C1] border-t-transparent rounded-full animate-spin" />
                        <span>Signing In...</span>
                      </>
                    ) : (
                      <span>Sign In</span>
                    )}
                  </button>

                  <div className="pt-3 border-t border-[#E8DFC9] text-center">
                    <p className="text-xs text-[#5A5550]">
                      Don't have an account?{' '}
                      <button
                        type="button"
                        onClick={() => {
                          setMode('register');
                          setError('');
                          setSuccessMsg('');
                        }}
                        className="text-[#722F37] font-bold hover:underline"
                      >
                        Create an Account
                      </button>
                    </p>
                  </div>
                </form>
              )}

              {/* 2. REGISTER MODE */}
              {mode === 'register' && (
                <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                  <div className="space-y-1">
                    <label className="font-semibold text-[#231F20] block">
                      Full Name *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Fatima Ali"
                        className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#E8DFC9] rounded-xl text-xs text-[#231F20] focus:outline-none focus:ring-1 focus:ring-[#722F37]"
                      />
                      <User className="w-4 h-4 text-[#8C7654] absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-[#231F20] block">
                      Email Address *
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="client@example.com"
                        className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#E8DFC9] rounded-xl text-xs text-[#231F20] focus:outline-none focus:ring-1 focus:ring-[#722F37]"
                      />
                      <Mail className="w-4 h-4 text-[#8C7654] absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-[#231F20] block">
                      Mobile / WhatsApp Number (Optional)
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+92 300 1234567"
                        className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#E8DFC9] rounded-xl text-xs text-[#231F20] focus:outline-none focus:ring-1 focus:ring-[#722F37]"
                      />
                      <Phone className="w-4 h-4 text-[#8C7654] absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-[#231F20] block">
                      Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Minimum 4 characters"
                        className="w-full pl-9 pr-10 py-2.5 bg-white border border-[#E8DFC9] rounded-xl text-xs text-[#231F20] focus:outline-none focus:ring-1 focus:ring-[#722F37]"
                      />
                      <Lock className="w-4 h-4 text-[#8C7654] absolute left-3 top-1/2 -translate-y-1/2" />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="p-1.5 text-[#8C7654] hover:text-[#722F37] absolute right-2.5 top-1/2 -translate-y-1/2"
                        aria-label="Toggle password view"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-[#722F37] hover:bg-[#501F25] text-[#F4E8C1] text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-50 mt-2 flex items-center justify-center space-x-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-[#F4E8C1] border-t-transparent rounded-full animate-spin" />
                        <span>Creating Account...</span>
                      </>
                    ) : (
                      <span>Create Account</span>
                    )}
                  </button>

                  <div className="pt-3 border-t border-[#E8DFC9] text-center">
                    <p className="text-xs text-[#5A5550]">
                      Already have an account?{' '}
                      <button
                        type="button"
                        onClick={() => {
                          setMode('login');
                          setError('');
                          setSuccessMsg('');
                        }}
                        className="text-[#722F37] font-bold hover:underline"
                      >
                        Sign In
                      </button>
                    </p>
                  </div>
                </form>
              )}

              {/* 3. FORGOT PASSWORD MODE */}
              {mode === 'forgot' && (
                <form onSubmit={handleForgotSubmit} className="space-y-3.5">
                  <p className="text-xs text-[#5A5550]">
                    Enter your email address and we will provide password reset instructions.
                  </p>

                  <div className="space-y-1">
                    <label className="font-semibold text-[#231F20] block">
                      Email Address *
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your registered email..."
                        className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#E8DFC9] rounded-xl text-xs text-[#231F20] focus:outline-none focus:ring-1 focus:ring-[#722F37]"
                      />
                      <Mail className="w-4 h-4 text-[#8C7654] absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-[#722F37] hover:bg-[#501F25] text-[#F4E8C1] text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-50 mt-2 flex items-center justify-center space-x-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-[#F4E8C1] border-t-transparent rounded-full animate-spin" />
                        <span>Sending Instructions...</span>
                      </>
                    ) : (
                      <span>Send Reset Link</span>
                    )}
                  </button>

                  <div className="pt-3 border-t border-[#E8DFC9] text-center">
                    <button
                      type="button"
                      onClick={() => {
                        setMode('login');
                        setError('');
                        setSuccessMsg('');
                      }}
                      className="text-xs text-[#722F37] font-bold hover:underline"
                    >
                      ← Back to Login
                    </button>
                  </div>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.js';
import { useSettings } from '../../context/SettingsContext.js';
import { Lock, Mail, Eye, EyeOff, ShieldCheck, ArrowLeft, Sparkles } from 'lucide-react';

interface AdminLoginPageProps {
  onSuccess: () => void;
  onBackToStore: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onSuccess, onBackToStore }) => {
  const { login } = useAuth();
  const { settings } = useSettings();

  const [email, setEmail] = useState('SH Collection@gmail.com');
  const [password, setPassword] = useState('Furqan123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Invalid administrator credentials. Please check and retry.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#2A1215] flex flex-col justify-center items-center p-3 sm:p-6 py-12 sm:py-16 relative overflow-y-auto overflow-x-hidden">
      {/* Background Ornaments */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#722F37]/40 via-[#2A1215] to-black opacity-80" />
      <div className="hidden sm:block absolute inset-4 sm:inset-8 border border-[#D4AF37]/20 pointer-events-none rounded-3xl" />

      {/* Back button */}
      <button
        onClick={onBackToStore}
        className="self-start sm:absolute sm:top-8 sm:left-8 mb-6 sm:mb-0 text-xs font-semibold uppercase tracking-wider text-[#F4E8C1] hover:text-[#D4AF37] flex items-center space-x-1.5 transition-colors z-20"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Customer Store</span>
      </button>

      {/* Main Login Card */}
      <div className="w-full max-w-md bg-[#FDFBF7] rounded-3xl border-2 border-[#D4AF37] p-5 sm:p-8 shadow-2xl relative z-10 space-y-5 my-auto">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto rounded-2xl bg-[#722F37] text-[#D4AF37] flex items-center justify-center shadow-md">
            <ShieldCheck className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#8C7654] font-bold block">
            Executive Portal
          </span>
          <h1 className="font-serif-luxury text-xl sm:text-2xl md:text-3xl font-bold text-[#231F20]">
            {settings.websiteName} Admin
          </h1>
          <p className="text-xs text-[#5A5550]">
            Sign in to manage bridal catalog, customer orders, sales, and atelier settings.
          </p>
        </div>

        {/* Credentials reminder hint */}
        <div className="p-3 bg-[#F5EFEB] rounded-xl border border-[#E8DFC9] text-[11px] text-[#722F37] space-y-0.5">
          <p className="font-bold flex items-center space-x-1">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Default Master Credentials:</span>
          </p>
          <p>Email: <span className="font-mono font-semibold">SH Collection@gmail.com</span></p>
          <p>Password: <span className="font-mono font-semibold">Furqan123</span></p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#231F20] block">
              Administrator Email
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="SH Collection@gmail.com"
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E8DFC9] rounded-xl text-xs text-[#231F20] focus:outline-none focus:ring-1 focus:ring-[#722F37]"
              />
              <Mail className="w-4 h-4 text-[#8C7654] absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#231F20] block">
              Security Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password..."
                className="w-full pl-10 pr-10 py-2.5 bg-white border border-[#E8DFC9] rounded-xl text-xs text-[#231F20] focus:outline-none focus:ring-1 focus:ring-[#722F37]"
              />
              <Lock className="w-4 h-4 text-[#8C7654] absolute left-3 top-1/2 -translate-y-1/2" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="p-1 text-[#8C7654] hover:text-[#722F37] absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#722F37] hover:bg-[#501F25] text-[#F4E8C1] text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center space-x-2 disabled:opacity-50 active:scale-95"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-[#F4E8C1] border-t-transparent rounded-full animate-spin" />
                <span>Authenticating Atelier...</span>
              </>
            ) : (
              <span>Enter Atelier Management</span>
            )}
          </button>
        </form>

        <div className="text-center text-[10px] text-[#8C7654] pt-2 border-t border-[#E8DFC9]">
          Protected Enterprise Administration • Session Encrypted
        </div>
      </div>
    </div>
  );
};

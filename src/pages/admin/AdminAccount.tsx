import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.js';
import { KeyRound, ShieldCheck, CheckCircle2, Eye, EyeOff } from 'lucide-react';

export const AdminAccount: React.FC = () => {
  const { changePassword, adminUser } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (newPassword.length < 6) {
      setError('New password must contain at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New password and confirm password do not match');
      return;
    }

    setSaving(true);

    try {
      await changePassword({
        currentPassword,
        newPassword,
        confirmPassword,
      });
      setSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setSuccess(false), 4000);
    } catch (err: any) {
      setError(err.message || 'Failed to change password. Please verify current password.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div className="bg-white rounded-3xl border border-[#E8DFC9] p-6 sm:p-8 space-y-6 shadow-sm">
        <div>
          <h2 className="font-serif-luxury text-2xl font-bold text-[#231F20]">
            Administrator Account & Security
          </h2>
          <p className="text-xs text-[#5A5550]">
            Update your master authentication credentials. Passwords are encrypted with salt and PBKDF2 cryptography.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-[#FDFBF7] border border-[#E8DFC9] text-xs space-y-1">
          <span className="font-bold text-[#722F37] block">Current Admin Profile:</span>
          <p>Email: <span className="font-mono font-semibold">{adminUser?.email || 'shcollection@gmail.com'}</span></p>
          <p>Role: <span className="font-semibold capitalize">{adminUser?.role?.replace(/_/g, ' ') || 'Super Admin'}</span></p>
        </div>

        {success && (
          <div className="p-3 bg-green-50 border border-green-200 text-green-700 text-xs rounded-xl flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <span>Master administrator password changed successfully!</span>
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-semibold text-[#231F20] block">
              Current Security Password *
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password..."
              className="w-full px-3.5 py-2.5 bg-[#FDFBF7] border border-[#E8DFC9] rounded-xl text-xs"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-[#231F20] block">
              New Password (min 6 characters) *
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password..."
              className="w-full px-3.5 py-2.5 bg-[#FDFBF7] border border-[#E8DFC9] rounded-xl text-xs"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-[#231F20] block">
              Confirm New Password *
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-type new password..."
              className="w-full px-3.5 py-2.5 bg-[#FDFBF7] border border-[#E8DFC9] rounded-xl text-xs"
            />
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-[#8C7654] hover:text-[#722F37] text-xs flex items-center space-x-1"
            >
              {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{showPassword ? 'Hide Passwords' : 'Show Passwords'}</span>
            </button>
          </div>

          <div className="pt-4 border-t border-[#E8DFC9] flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3.5 bg-[#722F37] hover:bg-[#501F25] text-[#F4E8C1] text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-50"
            >
              {saving ? 'Updating Password...' : 'Save New Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

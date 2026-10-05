import React, { useState } from 'react';
import { useSettings } from '../../context/SettingsContext.js';
import { Settings, Save, CheckCircle2 } from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const { settings, updateSettings } = useSettings();
  const [formData, setFormData] = useState({
    websiteName: settings.websiteName || 'SH Collection',
    tagline: settings.tagline || 'Haute Couture & Luxury Bridal Formals',
    businessType: settings.businessType || 'Ladies Bridal & Luxury Formal Dresses',
    description: settings.description || '',
    footerText: settings.footerText || '',
    instagram: settings.socialLinks?.instagram || '',
    facebook: settings.socialLinks?.facebook || '',
    tiktok: settings.socialLinks?.tiktok || '',
    pinterest: settings.socialLinks?.pinterest || '',
  });

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);

    try {
      await updateSettings({
        websiteName: formData.websiteName.trim(),
        tagline: formData.tagline.trim(),
        businessType: formData.businessType.trim(),
        description: formData.description.trim(),
        footerText: formData.footerText.trim(),
        socialLinks: {
          instagram: formData.instagram.trim(),
          facebook: formData.facebook.trim(),
          tiktok: formData.tiktok.trim(),
          pinterest: formData.pinterest.trim(),
        },
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to update website settings:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="bg-white rounded-3xl border border-[#E8DFC9] p-6 sm:p-8 space-y-6 shadow-sm">
        <div>
          <h2 className="font-serif-luxury text-2xl font-bold text-[#231F20]">
            General Atelier & Website Settings
          </h2>
          <p className="text-xs text-[#5A5550]">
            Configure your brand identity and website copy. All changes take effect immediately across customer pages.
          </p>
        </div>

        {success && (
          <div className="p-3 bg-green-50 border border-green-200 text-green-700 text-xs rounded-xl flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <span>Website settings updated successfully! Storefront has been synchronized.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-semibold text-[#231F20] block">
                Brand / Website Name *
              </label>
              <input
                type="text"
                required
                value={formData.websiteName}
                onChange={(e) => setFormData({ ...formData, websiteName: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#FDFBF7] border border-[#E8DFC9] rounded-xl text-xs font-semibold"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-[#231F20] block">
                Business Type
              </label>
              <input
                type="text"
                value={formData.businessType}
                onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#FDFBF7] border border-[#E8DFC9] rounded-xl text-xs"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-[#231F20] block">
              Tagline (Appears beneath logo and on invoice header)
            </label>
            <input
              type="text"
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-[#FDFBF7] border border-[#E8DFC9] rounded-xl text-xs"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-[#231F20] block">
              Brand Mission / About Statement
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-[#FDFBF7] border border-[#E8DFC9] rounded-xl text-xs"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-[#231F20] block">
              Footer Description Copy
            </label>
            <textarea
              rows={2}
              value={formData.footerText}
              onChange={(e) => setFormData({ ...formData, footerText: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-[#FDFBF7] border border-[#E8DFC9] rounded-xl text-xs"
            />
          </div>

          {/* Social Links */}
          <div className="pt-4 border-t border-[#E8DFC9] space-y-4">
            <h3 className="font-serif-luxury text-base font-bold text-[#722F37]">
              Social Media Handles
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-semibold text-[#231F20] block">Instagram URL</label>
                <input
                  type="url"
                  value={formData.instagram}
                  onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                  placeholder="https://instagram.com/shcollection"
                  className="w-full px-3.5 py-2 bg-[#FDFBF7] border border-[#E8DFC9] rounded-xl text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#231F20] block">Facebook URL</label>
                <input
                  type="url"
                  value={formData.facebook}
                  onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                  placeholder="https://facebook.com/shcollection"
                  className="w-full px-3.5 py-2 bg-[#FDFBF7] border border-[#E8DFC9] rounded-xl text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#231F20] block">TikTok URL</label>
                <input
                  type="url"
                  value={formData.tiktok}
                  onChange={(e) => setFormData({ ...formData, tiktok: e.target.value })}
                  placeholder="https://tiktok.com/@shcollection"
                  className="w-full px-3.5 py-2 bg-[#FDFBF7] border border-[#E8DFC9] rounded-xl text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#231F20] block">Pinterest URL</label>
                <input
                  type="url"
                  value={formData.pinterest}
                  onChange={(e) => setFormData({ ...formData, pinterest: e.target.value })}
                  placeholder="https://pinterest.com/shcollection"
                  className="w-full px-3.5 py-2 bg-[#FDFBF7] border border-[#E8DFC9] rounded-xl text-xs"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#E8DFC9] flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3.5 bg-[#722F37] hover:bg-[#501F25] text-[#F4E8C1] text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-50"
            >
              {saving ? 'Updating Settings...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

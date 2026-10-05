import React, { useState } from 'react';
import { useSettings } from '../../context/SettingsContext.js';
import { api } from '../../lib/api.js';
import { Image as ImageIcon, Upload, Trash2, CheckCircle2, Eye } from 'lucide-react';

export const AdminLogoBranding: React.FC = () => {
  const { settings, updateSettings } = useSettings();
  const [logoImage, setLogoImage] = useState(settings.logoImage || '');
  const [logoText, setLogoText] = useState(settings.logoText || settings.websiteName || 'SH Collection');
  const [isUploading, setIsUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      try {
        const res = await api.uploadImage(dataUrl, file.name);
        setLogoImage(res.url);
      } catch (err) {
        setLogoImage(dataUrl);
      } finally {
        setIsUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);

    try {
      await updateSettings({
        logoImage: logoImage.trim(),
        logoText: logoText.trim(),
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to update logo:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveImage = () => {
    setLogoImage('');
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="bg-white rounded-3xl border border-[#E8DFC9] p-6 sm:p-8 space-y-6 shadow-sm">
        <div>
          <h2 className="font-serif-luxury text-2xl font-bold text-[#231F20]">
            Logo & Brand Typography Manager
          </h2>
          <p className="text-xs text-[#5A5550]">
            Customize the SH Collection insignia. You can upload a custom logo graphic or use our imperial bridal serif text logo.
          </p>
        </div>

        {success && (
          <div className="p-3 bg-green-50 border border-green-200 text-green-700 text-xs rounded-xl flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <span>Logo settings updated! Changes are live across the navbar, footer, and PDF slips.</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6 text-xs">
          {/* Text Logo Option */}
          <div className="space-y-2 p-4 bg-[#FDFBF7] rounded-2xl border border-[#E8DFC9]">
            <label className="font-bold text-[#231F20] block">
              Default Text Logo Title:
            </label>
            <input
              type="text"
              value={logoText}
              onChange={(e) => setLogoText(e.target.value)}
              placeholder="SH Collection"
              className="w-full px-3.5 py-2.5 bg-white border border-[#E8DFC9] rounded-xl text-xs font-semibold"
            />
            <p className="text-[11px] text-[#8C7654]">
              Displayed when no graphic logo image is uploaded.
            </p>
          </div>

          {/* Graphic Logo Upload Option */}
          <div className="space-y-3 p-4 bg-[#FDFBF7] rounded-2xl border border-[#E8DFC9]">
            <span className="font-bold text-[#231F20] block">
              Graphic Logo Image (PNG / Transparent SVG Preferred):
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="text-[#8C7654] block">Logo Image URL:</span>
                <input
                  type="url"
                  value={logoImage}
                  onChange={(e) => setLogoImage(e.target.value)}
                  placeholder="https://.../logo.png"
                  className="w-full px-3 py-2 bg-white border border-[#E8DFC9] rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <span className="text-[#8C7654] block">Or Upload Local Image:</span>
                <label className="flex items-center justify-center space-x-2 px-4 py-2 bg-white hover:bg-[#F5EFEB] text-[#722F37] border border-dashed border-[#722F37] rounded-xl cursor-pointer text-xs font-semibold">
                  <Upload className="w-4 h-4" />
                  <span>{isUploading ? 'Uploading...' : 'Choose Image File'}</span>
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                </label>
              </div>
            </div>

            {/* Live Logo Preview Box */}
            <div className="pt-4 border-t border-[#E8DFC9]">
              <span className="font-bold text-[#231F20] block mb-2">Live Logo Preview:</span>
              <div className="p-6 bg-[#2A1215] rounded-2xl flex items-center justify-between">
                <div>
                  {logoImage && logoImage.trim() ? (
                    <img src={logoImage} alt="Logo" className="h-12 w-auto object-contain" />
                  ) : (
                    <div className="flex items-center space-x-2">
                      <span className="font-serif-luxury text-2xl font-bold tracking-wider text-[#F4E8C1]">
                        {logoText || settings.websiteName}
                      </span>
                      <span className="text-[#D4AF37]">✦</span>
                    </div>
                  )}
                </div>

                {logoImage && (
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="px-3 py-1.5 bg-red-600/80 hover:bg-red-600 text-white rounded-lg text-xs font-semibold flex items-center space-x-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Image Logo (Use Text)</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3.5 bg-[#722F37] hover:bg-[#501F25] text-[#F4E8C1] text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-50"
            >
              {saving ? 'Updating Logo...' : 'Apply Logo Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

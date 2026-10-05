import React, { useState } from 'react';
import { useSettings } from '../../context/SettingsContext.js';
import { api } from '../../lib/api.js';
import { Sparkles, Upload, CheckCircle2, RotateCcw, Image as ImageIcon } from 'lucide-react';

export const AdminHero: React.FC = () => {
  const { settings, updateSettings } = useSettings();
  const [heroImage, setHeroImage] = useState(settings.heroImage || '');
  const [heroTitle, setHeroTitle] = useState(settings.heroTitle || 'Regal Elegance for Your Special Day');
  const [heroSubtitle, setHeroSubtitle] = useState(settings.heroSubtitle || '');
  const [heroButtonText, setHeroButtonText] = useState(settings.heroButtonText || 'Explore Bridal Collection');
  const [heroSaleButtonText, setHeroSaleButtonText] = useState(settings.heroSaleButtonText || 'View Festive Sale');

  const [isUploading, setIsUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const defaultHero = 'https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=1920&q=85';

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      try {
        const res = await api.uploadImage(dataUrl, file.name);
        setHeroImage(res.url);
      } catch (err) {
        setHeroImage(dataUrl);
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
        heroImage: heroImage.trim() || defaultHero,
        heroTitle: heroTitle.trim(),
        heroSubtitle: heroSubtitle.trim(),
        heroButtonText: heroButtonText.trim(),
        heroSaleButtonText: heroSaleButtonText.trim(),
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to update hero banner:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="bg-white rounded-3xl border border-[#E8DFC9] p-6 sm:p-8 space-y-6 shadow-sm">
        <div>
          <h2 className="font-serif-luxury text-2xl font-bold text-[#231F20]">
            Home Page Hero Banner & Background Image Manager
          </h2>
          <p className="text-xs text-[#5A5550]">
            Administer the majestic hero section of the storefront. Upload a custom bridal backdrop photo and tailor headlines.
          </p>
        </div>

        {success && (
          <div className="p-3 bg-green-50 border border-green-200 text-green-700 text-xs rounded-xl flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <span>Hero banner updated successfully! Check your home page to admire the new look.</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6 text-xs">
          {/* Image Upload Area */}
          <div className="space-y-3 p-5 bg-[#FDFBF7] rounded-2xl border border-[#E8DFC9]">
            <span className="font-bold text-[#231F20] block">
              Hero Section Background Image:
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="text-[#8C7654] block">Image URL:</span>
                <input
                  type="url"
                  value={heroImage}
                  onChange={(e) => setHeroImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2.5 bg-white border border-[#E8DFC9] rounded-xl text-xs"
                />
              </div>

              <div className="space-y-1">
                <span className="text-[#8C7654] block">Upload From Computer:</span>
                <label className="flex items-center justify-center space-x-2 px-4 py-2.5 bg-white hover:bg-[#F5EFEB] text-[#722F37] border border-dashed border-[#722F37] rounded-xl cursor-pointer text-xs font-semibold">
                  <Upload className="w-4 h-4" />
                  <span>{isUploading ? 'Uploading Hero Image...' : 'Select Backdrop Image'}</span>
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                </label>
              </div>
            </div>

            {/* Live Hero Banner Preview */}
            <div className="pt-2">
              <span className="font-bold text-[#231F20] block mb-2">Live Hero Preview:</span>
              <div
                className="relative h-64 rounded-2xl overflow-hidden bg-cover bg-center border border-[#D4AF37] flex items-center justify-center p-6 text-center shadow-md"
                style={{ backgroundImage: `url('${heroImage || defaultHero}')` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#2A0F14]/90 via-[#40161E]/75 to-black/80" />
                <div className="relative z-10 text-white space-y-2 max-w-lg">
                  <span className="text-[10px] text-[#D4AF37] uppercase tracking-widest font-bold block">
                    The Imperial Bridal Season
                  </span>
                  <h3 className="font-serif-luxury text-2xl font-bold text-[#FDFBF7]">
                    {heroTitle}
                  </h3>
                  <p className="text-[11px] text-[#E8DFC9] line-clamp-2">
                    {heroSubtitle}
                  </p>
                  <div className="pt-2 flex justify-center space-x-2">
                    <span className="px-4 py-1.5 bg-[#722F37] text-[#F4E8C1] rounded-lg text-[10px] font-bold">
                      {heroButtonText}
                    </span>
                    <span className="px-4 py-1.5 bg-white/20 text-[#F4E8C1] rounded-lg text-[10px] font-bold">
                      {heroSaleButtonText}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Hero Headlines & Text */}
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="font-semibold text-[#231F20] block">
                Hero Main Headline *
              </label>
              <input
                type="text"
                required
                value={heroTitle}
                onChange={(e) => setHeroTitle(e.target.value)}
                placeholder="Regal Elegance for Your Special Day"
                className="w-full px-3.5 py-2.5 bg-[#FDFBF7] border border-[#E8DFC9] rounded-xl text-xs font-semibold"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-[#231F20] block">
                Hero Subheading / Tagline Description
              </label>
              <textarea
                rows={2}
                value={heroSubtitle}
                onChange={(e) => setHeroSubtitle(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#FDFBF7] border border-[#E8DFC9] rounded-xl text-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-semibold text-[#231F20] block">
                  Primary Button Label
                </label>
                <input
                  type="text"
                  value={heroButtonText}
                  onChange={(e) => setHeroButtonText(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#FDFBF7] border border-[#E8DFC9] rounded-xl text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#231F20] block">
                  Secondary Sale Button Label
                </label>
                <input
                  type="text"
                  value={heroSaleButtonText}
                  onChange={(e) => setHeroSaleButtonText(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#FDFBF7] border border-[#E8DFC9] rounded-xl text-xs"
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
              {saving ? 'Updating Hero...' : 'Apply Hero Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

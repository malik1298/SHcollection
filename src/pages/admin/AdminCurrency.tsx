import React, { useState } from 'react';
import { useSettings } from '../../context/SettingsContext.js';
import { Coins, CheckCircle2, DollarSign } from 'lucide-react';

export const AdminCurrency: React.FC = () => {
  const { settings, updateSettings, formatPrice } = useSettings();
  const [currencyName, setCurrencyName] = useState(settings.currencyName || 'PKR');
  const [currencySymbol, setCurrencySymbol] = useState(settings.currencySymbol || 'Rs.');
  const [currencyPosition, setCurrencyPosition] = useState<'prefix' | 'suffix'>(
    settings.currencyPosition || 'prefix'
  );

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const presets = [
    { name: 'PKR', symbol: 'Rs.', label: 'Pakistani Rupee (PKR)', pos: 'prefix' },
    { name: 'USD', symbol: '$', label: 'US Dollar (USD)', pos: 'prefix' },
    { name: 'GBP', symbol: '£', label: 'British Pound (GBP)', pos: 'prefix' },
    { name: 'AED', symbol: 'AED', label: 'UAE Dirham (AED)', pos: 'suffix' },
    { name: 'EUR', symbol: '€', label: 'Euro (EUR)', pos: 'prefix' },
    { name: 'SAR', symbol: 'SAR', label: 'Saudi Riyal (SAR)', pos: 'suffix' },
  ];

  const handleApplyPreset = (preset: typeof presets[0]) => {
    setCurrencyName(preset.name);
    setCurrencySymbol(preset.symbol);
    setCurrencyPosition(preset.pos as any);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);

    try {
      await updateSettings({
        currencyName: currencyName.trim(),
        currencySymbol: currencySymbol.trim(),
        currencyPosition,
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to update currency:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="bg-white rounded-3xl border border-[#E8DFC9] p-6 sm:p-8 space-y-6 shadow-sm">
        <div>
          <h2 className="font-serif-luxury text-2xl font-bold text-[#231F20]">
            Store Currency & Pricing Unit Manager
          </h2>
          <p className="text-xs text-[#5A5550]">
            Change the global store currency code and symbol. Product pricing, cart tallies, checkout summaries, and PDF order slips automatically adapt.
          </p>
        </div>

        {success && (
          <div className="p-3 bg-green-50 border border-green-200 text-green-700 text-xs rounded-xl flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <span>Currency updated to {currencyName} ({currencySymbol})! Store prices have synchronized.</span>
          </div>
        )}

        {/* Quick Presets */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-[#231F20] block">
            Select Currency Standard:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {presets.map((p) => (
              <button
                key={p.name}
                type="button"
                onClick={() => handleApplyPreset(p)}
                className={`p-3 rounded-2xl border text-left text-xs transition-all ${
                  currencyName === p.name
                    ? 'border-[#722F37] bg-[#722F37]/5 ring-2 ring-[#722F37]'
                    : 'border-[#E8DFC9] hover:bg-[#FDFBF7]'
                }`}
              >
                <span className="font-bold text-[#722F37] block">{p.name}</span>
                <span className="text-[11px] text-[#5A5550]">{p.label}</span>
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4 text-xs pt-4 border-t border-[#E8DFC9]">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="font-semibold text-[#231F20] block">
                Currency ISO Code *
              </label>
              <input
                type="text"
                required
                value={currencyName}
                onChange={(e) => setCurrencyName(e.target.value.toUpperCase())}
                placeholder="PKR"
                className="w-full px-3.5 py-2.5 bg-[#FDFBF7] border border-[#E8DFC9] rounded-xl text-xs font-mono font-bold"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-[#231F20] block">
                Currency Symbol *
              </label>
              <input
                type="text"
                required
                value={currencySymbol}
                onChange={(e) => setCurrencySymbol(e.target.value)}
                placeholder="Rs."
                className="w-full px-3.5 py-2.5 bg-[#FDFBF7] border border-[#E8DFC9] rounded-xl text-xs font-bold"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-[#231F20] block">
                Symbol Position
              </label>
              <select
                value={currencyPosition}
                onChange={(e) => setCurrencyPosition(e.target.value as any)}
                className="w-full px-3.5 py-2.5 bg-[#FDFBF7] border border-[#E8DFC9] rounded-xl text-xs"
              >
                <option value="prefix">Prefix (e.g. Rs. 245,000)</option>
                <option value="suffix">Suffix (e.g. 245,000 Rs.)</option>
              </select>
            </div>
          </div>

          {/* Live Preview */}
          <div className="p-4 bg-[#F5EFEB] rounded-2xl border border-[#D4AF37] space-y-1">
            <span className="font-bold text-[#722F37] block">Live Storefront Price Preview:</span>
            <div className="flex items-baseline space-x-3">
              <span className="font-serif-luxury text-2xl font-bold text-[#722F37]">
                {currencyPosition === 'prefix'
                  ? `${currencySymbol} 245,000`
                  : `245,000 ${currencySymbol}`}
              </span>
              <span className="line-through text-gray-400 text-xs">
                {currencyPosition === 'prefix'
                  ? `${currencySymbol} 290,000`
                  : `290,000 ${currencySymbol}`}
              </span>
              <span className="bg-[#722F37] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                15% OFF
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-[#E8DFC9] flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3.5 bg-[#722F37] hover:bg-[#501F25] text-[#F4E8C1] text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-50"
            >
              {saving ? 'Updating Currency...' : 'Apply Currency Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

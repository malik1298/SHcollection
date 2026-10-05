import React, { useState, useEffect } from 'react';
import { useSettings } from '../../context/SettingsContext.js';
import {
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Send,
  Sparkles,
  PhoneCall,
  Save
} from 'lucide-react';

export const AdminWhatsAppContact: React.FC = () => {
  const { settings, updateSettings, getWhatsAppUrl } = useSettings();

  const [whatsappNumber, setWhatsappNumber] = useState(settings.whatsappNumber || '+92 300 1234567');
  const [whatsappDefaultMessage, setWhatsappDefaultMessage] = useState(
    settings.whatsappDefaultMessage || 'Hello SH Collection! I am interested in inquiring about bridal outfits.'
  );
  const [phone, setPhone] = useState(settings.phone || '+92 300 1234567');
  const [email, setEmail] = useState(settings.email || 'contact@shcollection.com');
  const [address, setAddress] = useState(
    settings.address || 'Flagship Bridal Studio, MM Alam Road, Gulberg III, Lahore, Pakistan'
  );
  const [businessHours, setBusinessHours] = useState(
    settings.businessHours || 'Mon - Sat: 11:00 AM - 9:00 PM (Appointments Preferred)'
  );

  // Sync state if settings update from server
  useEffect(() => {
    if (settings) {
      setWhatsappNumber(settings.whatsappNumber || '+92 300 1234567');
      setWhatsappDefaultMessage(
        settings.whatsappDefaultMessage || 'Hello SH Collection! I am interested in inquiring about bridal outfits.'
      );
      setPhone(settings.phone || '+92 300 1234567');
      setEmail(settings.email || 'contact@shcollection.com');
      setAddress(settings.address || 'Flagship Bridal Studio, MM Alam Road, Gulberg III, Lahore, Pakistan');
      setBusinessHours(settings.businessHours || 'Mon - Sat: 11:00 AM - 9:00 PM (Appointments Preferred)');
    }
  }, [settings]);

  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Validation function
  const validateForm = (): boolean => {
    setErrorMessage(null);

    // Validate WhatsApp number: should contain digits, at least 7 digits
    const cleanedWa = whatsappNumber.replace(/[^0-9]/g, '');
    if (!cleanedWa || cleanedWa.length < 7) {
      setErrorMessage('Please enter a valid WhatsApp number with country code (at least 7 digits, e.g. +92 300 1234567).');
      return false;
    }

    // Validate Phone number: should contain digits
    const cleanedPhone = phone.replace(/[^0-9]/g, '');
    if (!cleanedPhone || cleanedPhone.length < 7) {
      setErrorMessage('Please enter a valid Website Phone Number (e.g. +92 300 1234567).');
      return false;
    }

    // Validate Email
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email.trim())) {
      setErrorMessage('Please enter a valid email address.');
      return false;
    }

    if (!address.trim()) {
      setErrorMessage('Please provide the atelier street address.');
      return false;
    }

    return true;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSaving(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      await updateSettings({
        whatsappNumber: whatsappNumber.trim(),
        whatsappDefaultMessage: whatsappDefaultMessage.trim(),
        phone: phone.trim(),
        email: email.trim(),
        address: address.trim(),
        businessHours: businessHours.trim(),
      });

      setSuccessMessage(
        `Contact settings updated successfully! WhatsApp number (${whatsappNumber.trim()}) and Website Phone (${phone.trim()}) are now permanently saved and active across all website buttons.`
      );

      // Auto dismiss success notice after 6 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 6000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to update contact settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-5xl space-y-6">
      {/* 1. Current Live Status Overview Banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Active WhatsApp Status Card */}
        <div className="bg-white rounded-2xl border-2 border-[#25D366]/40 p-5 shadow-sm space-y-3 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#25D366]/5 rounded-bl-full pointer-events-none" />
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-xs">
                <MessageCircle className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#8C7654] font-bold block">
                  Active WhatsApp Concierge
                </span>
                <span className="font-mono text-sm sm:text-base font-bold text-[#231F20]">
                  {settings.whatsappNumber || '+92 300 1234567'}
                </span>
              </div>
            </div>
            <span className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-[#25D366]/15 text-[#1b9e4b]">
              <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
              <span>Live on Website</span>
            </span>
          </div>

          <p className="text-[11px] text-[#5A5550]">
            Powers the Floating WhatsApp button, Bridal Inquiry buttons on dresses, and checkout assistance.
          </p>

          <div className="pt-2 border-t border-[#E8DFC9]/60 flex items-center justify-between text-xs">
            <span className="text-[#8C7654]">Test Live Chat:</span>
            <a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noreferrer"
              className="text-[#25D366] hover:underline font-semibold flex items-center space-x-1"
            >
              <span>Open in WhatsApp</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Active Website Phone Status Card */}
        <div className="bg-white rounded-2xl border-2 border-[#722F37]/30 p-5 shadow-sm space-y-3 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#722F37]/5 rounded-bl-full pointer-events-none" />
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-[#722F37] text-[#F4E8C1] flex items-center justify-center shadow-xs">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#8C7654] font-bold block">
                  Active Website Phone / Hotline
                </span>
                <span className="font-mono text-sm sm:text-base font-bold text-[#231F20]">
                  {settings.phone || '+92 300 1234567'}
                </span>
              </div>
            </div>
            <span className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-[#722F37]/10 text-[#722F37]">
              <span className="w-2 h-2 rounded-full bg-[#722F37]" />
              <span>Header & Footer</span>
            </span>
          </div>

          <p className="text-[11px] text-[#5A5550]">
            Displayed on the website header bar, footer inquiries, mobile drawer, and official order invoices.
          </p>

          <div className="pt-2 border-t border-[#E8DFC9]/60 flex items-center justify-between text-xs">
            <span className="text-[#8C7654]">Test Call Link:</span>
            <a
              href={`tel:${(settings.phone || '+923001234567').replace(/[^0-9+]/g, '')}`}
              className="text-[#722F37] hover:underline font-semibold flex items-center space-x-1"
            >
              <span>Dial Hotline</span>
              <PhoneCall className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Notifications */}
      {successMessage && (
        <div className="p-4 bg-green-50 border-2 border-green-500/40 text-green-900 rounded-2xl flex items-start space-x-3 shadow-xs animate-in fade-in duration-200">
          <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <p className="font-bold">Settings Saved Successfully</p>
            <p>{successMessage}</p>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 bg-red-50 border-2 border-red-500/40 text-red-900 rounded-2xl flex items-start space-x-3 shadow-xs animate-in fade-in duration-200">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <p className="font-bold">Validation Error</p>
            <p>{errorMessage}</p>
          </div>
        </div>
      )}

      {/* 2. Management Form */}
      <div className="bg-white rounded-3xl border border-[#E8DFC9] p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="border-b border-[#E8DFC9] pb-4">
          <h2 className="font-serif-luxury text-xl sm:text-2xl font-bold text-[#231F20]">
            Contact Channels & Numbers Management
          </h2>
          <p className="text-xs text-[#5A5550] mt-1">
            Modify the WhatsApp and website contact numbers below. All changes are saved to the database and update automatically on all customer buttons, header, footer, and inquiry widgets.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-6 text-xs">
          {/* SECTION A: WhatsApp Configuration */}
          <div className="p-5 rounded-2xl bg-[#25D366]/5 border-2 border-[#25D366]/30 space-y-4">
            <div className="flex items-center space-x-2 pb-2 border-b border-[#25D366]/20">
              <MessageCircle className="w-4 h-4 text-[#20bd5a]" />
              <h3 className="font-serif-luxury text-base font-bold text-[#231F20]">
                1. WhatsApp Number Settings
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-bold text-[#231F20] block">
                  WhatsApp Number *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    placeholder="+92 300 1234567"
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E8DFC9] rounded-xl font-mono text-xs text-[#231F20] focus:outline-none focus:ring-1 focus:ring-[#25D366]"
                  />
                  <MessageCircle className="w-4 h-4 text-[#25D366] absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
                <span className="text-[11px] text-[#5A5550] block">
                  Include country code (e.g. <span className="font-mono font-semibold">+92 300 1234567</span> or <span className="font-mono font-semibold">03001234567</span>).
                </span>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-[#231F20] block">
                  Default Pre-filled Greeting Message
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={whatsappDefaultMessage}
                    onChange={(e) => setWhatsappDefaultMessage(e.target.value)}
                    placeholder="Hello SH Collection! I am interested in inquiring..."
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E8DFC9] rounded-xl text-xs text-[#231F20] focus:outline-none focus:ring-1 focus:ring-[#25D366]"
                  />
                  <Send className="w-4 h-4 text-[#8C7654] absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
                <span className="text-[11px] text-[#5A5550] block">
                  This greeting automatically appears in the customer's chat when they click the WhatsApp button.
                </span>
              </div>
            </div>
          </div>

          {/* SECTION B: Website Phone & Atelier Channels */}
          <div className="p-5 rounded-2xl bg-[#FDFBF7] border-2 border-[#E8DFC9] space-y-4">
            <div className="flex items-center space-x-2 pb-2 border-b border-[#E8DFC9]">
              <Phone className="w-4 h-4 text-[#722F37]" />
              <h3 className="font-serif-luxury text-base font-bold text-[#231F20]">
                2. Website Phone & Atelier Channels
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-bold text-[#231F20] block">
                  Website Phone / Helpline Number *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+92 300 1234567"
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E8DFC9] rounded-xl font-mono text-xs text-[#231F20] focus:outline-none focus:ring-1 focus:ring-[#722F37]"
                  />
                  <Phone className="w-4 h-4 text-[#722F37] absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
                <span className="text-[11px] text-[#5A5550] block">
                  Displayed in website header, footer, contact page, and order slips.
                </span>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-[#231F20] block">
                  Official Email Address *
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="contact@shcollection.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E8DFC9] rounded-xl text-xs text-[#231F20] focus:outline-none focus:ring-1 focus:ring-[#722F37]"
                  />
                  <Mail className="w-4 h-4 text-[#8C7654] absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
                <span className="text-[11px] text-[#5A5550] block">
                  Primary customer inquiries and consultation inbox.
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-[#231F20] block">
                Flagship Studio Street Address *
              </label>
              <div className="relative">
                <textarea
                  rows={2}
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Flagship Bridal Studio, MM Alam Road, Gulberg III, Lahore, Pakistan"
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E8DFC9] rounded-xl text-xs text-[#231F20] focus:outline-none focus:ring-1 focus:ring-[#722F37]"
                />
                <MapPin className="w-4 h-4 text-[#8C7654] absolute left-3 top-3" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-[#231F20] block">
                Business & Consultation Hours
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={businessHours}
                  onChange={(e) => setBusinessHours(e.target.value)}
                  placeholder="Mon - Sat: 11:00 AM - 9:00 PM (Appointments Preferred)"
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E8DFC9] rounded-xl text-xs text-[#231F20] focus:outline-none focus:ring-1 focus:ring-[#722F37]"
                />
                <Clock className="w-4 h-4 text-[#8C7654] absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-4 border-t border-[#E8DFC9] flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-[11px] text-[#5A5550] flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Changes take effect immediately across all frontend pages & buttons.</span>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full sm:w-auto px-8 py-3.5 bg-[#722F37] hover:bg-[#501F25] text-[#F4E8C1] text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {saving ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-[#F4E8C1] border-t-transparent rounded-full animate-spin" />
                  <span>Saving to Database...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save & Update Numbers</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

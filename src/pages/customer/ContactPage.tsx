import React, { useState } from 'react';
import { useSettings } from '../../context/SettingsContext.js';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageCircle,
  Sparkles,
  Send,
  CheckCircle2,
  Calendar,
  Instagram,
  Facebook
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { settings, getWhatsAppUrl } = useSettings();
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    eventType: 'Barat Bridal',
    eventDate: '',
    budget: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const whatsappInquiry = `Hello SH Collection! I would like to schedule a bridal appointment. Name: ${form.name || 'Client'}, Event: ${form.eventType}, Wedding Date: ${form.eventDate || 'TBD'}.`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs uppercase tracking-[0.2em] text-[#D4AF37] font-semibold">
          Flagship Studio & Concierge
        </span>
        <h1 className="font-serif-luxury text-4xl sm:text-5xl font-bold text-[#231F20]">
          Connect With Our Bridal Atelier
        </h1>
        <p className="text-xs sm:text-sm text-[#5A5550] leading-relaxed">
          Book a private bridal fitting consultation at our flagship Lahore studio, or connect with our international concierge team via WhatsApp for personalized styling and measurements.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Contact Information & Concierge Cards (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Card 1: Studio Details */}
          <div className="bg-white rounded-3xl border border-[#E8DFC9] p-6 sm:p-8 space-y-6 shadow-sm">
            <h2 className="font-serif-luxury text-2xl font-bold text-[#231F20] pb-3 border-b border-[#E8DFC9]">
              Studio Information
            </h2>

            <div className="space-y-4 text-xs text-[#5A5550]">
              <div className="flex items-start space-x-3.5">
                <div className="p-2.5 rounded-xl bg-[#F5EFEB] text-[#722F37] shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-[#231F20] block">Flagship Atelier Location</span>
                  <p className="leading-relaxed mt-0.5">{settings.address}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3.5">
                <div className="p-2.5 rounded-xl bg-[#F5EFEB] text-[#722F37] shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-[#231F20] block">Concierge Telephone</span>
                  <a
                    href={`tel:${(settings.phone || '').replace(/[^0-9+]/g, '')}`}
                    className="mt-0.5 block hover:text-[#722F37] transition-colors font-medium"
                  >
                    {settings.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-3.5">
                <div className="p-2.5 rounded-xl bg-[#F5EFEB] text-[#722F37] shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-[#231F20] block">Atelier Inquiries</span>
                  <a
                    href={`mailto:${settings.email}`}
                    className="mt-0.5 block hover:text-[#722F37] transition-colors font-medium"
                  >
                    {settings.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-3.5">
                <div className="p-2.5 rounded-xl bg-[#F5EFEB] text-[#722F37] shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-[#231F20] block">Consultation Hours</span>
                  <p className="mt-0.5">{settings.businessHours}</p>
                </div>
              </div>
            </div>

            {/* Social links */}
            <div className="pt-4 border-t border-[#E8DFC9] flex items-center space-x-3">
              <span className="text-xs font-semibold text-[#231F20]">Follow Our Creations:</span>
              {settings.socialLinks?.instagram && (
                <a
                  href={settings.socialLinks.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-lg bg-[#F5EFEB] hover:bg-[#722F37] hover:text-white transition-colors text-[#722F37]"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {settings.socialLinks?.facebook && (
                <a
                  href={settings.socialLinks.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-lg bg-[#F5EFEB] hover:bg-[#722F37] hover:text-white transition-colors text-[#722F37]"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Card 2: Instant WhatsApp VIP Consultation */}
          <div className="bg-[#2A1215] text-[#F9F6F0] rounded-3xl border-2 border-[#D4AF37] p-6 sm:p-8 space-y-4 shadow-xl">
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
              <span>Instant Video Consultation</span>
            </div>
            <h3 className="font-serif-luxury text-2xl font-bold text-[#F4E8C1]">
              WhatsApp Bridal Concierge
            </h3>
            <p className="text-xs text-[#E8DFC9] leading-relaxed">
              Overseas or planning from out of city? Our senior stylist provides video walkthroughs of bridal fabrics, swatch close-ups, and live sizing consultation.
            </p>
            <a
              href={getWhatsAppUrl(whatsappInquiry)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center space-x-2 w-full py-3.5 bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-95"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat with Stylist Now</span>
            </a>
          </div>
        </div>

        {/* Right Form: Interactive Booking / Message Form (7 cols) */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-3xl border border-[#E8DFC9] p-6 sm:p-10 space-y-6 shadow-sm">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold">
                Private Consultation
              </span>
              <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#231F20] mt-1">
                Request an Atelier Appointment
              </h2>
            </div>

            {submitted ? (
              <div className="p-8 text-center space-y-4 bg-[#FDFBF7] rounded-2xl border border-[#D4AF37]">
                <CheckCircle2 className="w-12 h-12 text-[#25D366] mx-auto" />
                <h3 className="font-serif-luxury text-2xl font-bold text-[#231F20]">
                  Appointment Request Received
                </h3>
                <p className="text-xs text-[#5A5550] max-w-md mx-auto leading-relaxed">
                  Thank you for reaching out to SH Collection. Our bridal coordinator will review your preferred date and reach out via WhatsApp / phone within 12 hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-2.5 bg-[#722F37] text-[#F4E8C1] text-xs font-bold uppercase tracking-wider rounded-xl"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#231F20] block">
                      Client Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="e.g. Fatima Tariq"
                      className="w-full px-3.5 py-2.5 bg-[#FDFBF7] border border-[#E8DFC9] rounded-xl text-xs text-[#231F20] focus:outline-none focus:ring-1 focus:ring-[#722F37]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#231F20] block">
                      WhatsApp / Mobile Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="+92 300 0000000"
                      className="w-full px-3.5 py-2.5 bg-[#FDFBF7] border border-[#E8DFC9] rounded-xl text-xs text-[#231F20] focus:outline-none focus:ring-1 focus:ring-[#722F37]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#231F20] block">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="client@example.com"
                      className="w-full px-3.5 py-2.5 bg-[#FDFBF7] border border-[#E8DFC9] rounded-xl text-xs text-[#231F20] focus:outline-none focus:ring-1 focus:ring-[#722F37]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#231F20] block">
                      Event Type
                    </label>
                    <select
                      value={form.eventType}
                      onChange={(e) => setForm({ ...form, eventType: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#FDFBF7] border border-[#E8DFC9] rounded-xl text-xs text-[#231F20] focus:outline-none focus:ring-1 focus:ring-[#722F37]"
                    >
                      <option>Barat Royal Bridal</option>
                      <option>Walima Reception Maxi</option>
                      <option>Mehndi / Mayun Festive</option>
                      <option>Engagement / Nikkah Formal</option>
                      <option>Luxury Wedding Guest Formal</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#231F20] block">
                      Tentative Wedding / Event Date
                    </label>
                    <input
                      type="date"
                      value={form.eventDate}
                      onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#FDFBF7] border border-[#E8DFC9] rounded-xl text-xs text-[#231F20] focus:outline-none focus:ring-1 focus:ring-[#722F37]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#231F20] block">
                      Approximate Budget Range
                    </label>
                    <input
                      type="text"
                      value={form.budget}
                      onChange={(e) => setForm({ ...form, budget: e.target.value })}
                      placeholder="e.g. 150,000 - 300,000 PKR"
                      className="w-full px-3.5 py-2.5 bg-[#FDFBF7] border border-[#E8DFC9] rounded-xl text-xs text-[#231F20] focus:outline-none focus:ring-1 focus:ring-[#722F37]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#231F20] block">
                    Message / Customization Details
                  </label>
                  <textarea
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell us about your preferred color palette, silhouettes you love, or special custom fitting requirements..."
                    className="w-full px-3.5 py-2.5 bg-[#FDFBF7] border border-[#E8DFC9] rounded-xl text-xs text-[#231F20] focus:outline-none focus:ring-1 focus:ring-[#722F37]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-[#722F37] hover:bg-[#501F25] text-[#F4E8C1] text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center space-x-2 active:scale-95"
                >
                  <Send className="w-4 h-4 text-[#D4AF37]" />
                  <span>Submit Appointment Booking</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

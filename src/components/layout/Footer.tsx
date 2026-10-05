import React from 'react';
import { useSettings } from '../../context/SettingsContext.js';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Instagram,
  Facebook,
  Sparkles,
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string, params?: Record<string, any>) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { settings, getWhatsAppUrl } = useSettings();

  return (
    <footer className="bg-[#2A1215] text-[#F9F6F0] pt-16 pb-12 border-t-2 border-[#D4AF37]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Column 1: Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <span className="font-serif-luxury text-2xl font-bold tracking-wider text-[#F4E8C1]">
                {settings.websiteName}
              </span>
              <span className="text-[#D4AF37]">✦</span>
            </div>
            <p className="text-xs text-[#E8DFC9] leading-relaxed">
              {settings.footerText || settings.description}
            </p>
            <div className="pt-2 flex items-center space-x-3 text-[#D4AF37]">
              {settings.socialLinks?.instagram && (
                <a
                  href={settings.socialLinks.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 bg-[#3D1A1F] hover:bg-[#D4AF37] hover:text-[#2A1215] rounded-full transition-colors"
                  title="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {settings.socialLinks?.facebook && (
                <a
                  href={settings.socialLinks.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 bg-[#3D1A1F] hover:bg-[#D4AF37] hover:text-[#2A1215] rounded-full transition-colors"
                  title="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noreferrer"
                className="p-2 bg-[#3D1A1F] hover:bg-[#25D366] hover:text-white rounded-full transition-colors"
                title="WhatsApp VIP Concierge"
              >
                <Sparkles className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h4 className="font-serif-luxury text-base font-semibold tracking-wider text-[#D4AF37] uppercase">
              Boutique Collections
            </h4>
            <ul className="space-y-2.5 text-xs text-[#E8DFC9]">
              <li>
                <button
                  onClick={() => onNavigate('products', { category: 'bridal-couture' })}
                  className="hover:text-[#D4AF37] transition-colors flex items-center space-x-1"
                >
                  <span>Royal Bridal Couture</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('products', { category: 'luxury-formals' })}
                  className="hover:text-[#D4AF37] transition-colors flex items-center space-x-1"
                >
                  <span>Luxury Wedding Formals</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('products', { category: 'royal-velvet-edit' })}
                  className="hover:text-[#D4AF37] transition-colors flex items-center space-x-1"
                >
                  <span>Handcrafted Velvet Edit</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('sale')}
                  className="text-[#D4AF37] font-semibold hover:underline flex items-center space-x-1"
                >
                  <span>Festive Sale (Up to 25% Off)</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('products', { newArrivals: true })}
                  className="hover:text-[#D4AF37] transition-colors flex items-center space-x-1"
                >
                  <span>Latest Bridal Arrivals</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Care & Atelier Services */}
          <div className="space-y-4">
            <h4 className="font-serif-luxury text-base font-semibold tracking-wider text-[#D4AF37] uppercase">
              Client Concierge
            </h4>
            <ul className="space-y-2.5 text-xs text-[#E8DFC9]">
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="hover:text-[#D4AF37] transition-colors"
                >
                  Book Private Bridal Consultation
                </button>
              </li>
              <li>
                <a
                  href={getWhatsAppUrl('Hello! I would like to inquire about custom bridal measurements and fitting appointments.')}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#D4AF37] transition-colors flex items-center space-x-1 text-[#25D366]"
                >
                  <span>Instant WhatsApp Assistance</span>
                </a>
              </li>
              <li>
                <span className="text-[#A89F91]">Complimentary International Courier</span>
              </li>
              <li>
                <span className="text-[#A89F91]">Artisanal Hand-Embroidered Warranty</span>
              </li>
              <li>
                <span className="text-[#A89F91]">Bespoke Bridal Tailoring & Sizing</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Atelier */}
          <div className="space-y-4">
            <h4 className="font-serif-luxury text-base font-semibold tracking-wider text-[#D4AF37] uppercase">
              Studio & Atelier
            </h4>
            <div className="space-y-3 text-xs text-[#E8DFC9]">
              <div className="flex items-start space-x-2.5">
                <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <span>{settings.address}</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Phone className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <a
                  href={`tel:${(settings.phone || '').replace(/[^0-9+]/g, '')}`}
                  className="hover:text-[#F4E8C1] transition-colors"
                >
                  {settings.phone}
                </a>
              </div>
              <div className="flex items-center space-x-2.5">
                <Mail className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <a
                  href={`mailto:${settings.email}`}
                  className="hover:text-[#F4E8C1] transition-colors"
                >
                  {settings.email}
                </a>
              </div>
              <div className="flex items-start space-x-2.5">
                <Clock className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <span>{settings.businessHours}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#3D1A1F] flex flex-col md:flex-row items-center justify-between text-[11px] text-[#A89F91] space-y-4 md:space-y-0">
          <div>
            &copy; {new Date().getFullYear()} {settings.websiteName}. All Rights Reserved. Crafted with haute couture excellence.
          </div>
          <div className="flex items-center space-x-6">
            <span>Bespoke Bridal Tailoring</span>
            <span>✦</span>
            <span>Worldwide Delivery</span>
            <span>✦</span>
            <span>100% Authentic Hand Embroidery</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

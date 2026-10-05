import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { WebsiteSettings } from '../types/index.js';
import { api } from '../lib/api.js';

interface SettingsContextType {
  settings: WebsiteSettings;
  loading: boolean;
  formatPrice: (amount: number) => string;
  getWhatsAppUrl: (customText?: string) => string;
  refreshSettings: () => Promise<void>;
  updateSettings: (partial: Partial<WebsiteSettings>) => Promise<WebsiteSettings>;
}

const defaultSettings: WebsiteSettings = {
  websiteName: 'SH Collection',
  tagline: 'Haute Couture & Luxury Bridal Formals',
  businessType: 'Ladies Bridal & Luxury Formal Dresses',
  logoText: 'SH Collection',
  logoImage: '',
  favicon: '',
  description: 'SH Collection is a luxury bridal and haute couture atelier showcasing exquisite hand-embroidered gowns, traditional lehngas, and bespoke formal wear.',
  heroImage: 'https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=1920&q=85',
  heroTitle: 'Regal Elegance for Your Special Day',
  heroSubtitle: 'Discover handcrafted bridal couture, zardozi masterworks, and ethereal silhouettes meticulously tailored to make your wedding unforgettable.',
  heroButtonText: 'Explore Bridal Collection',
  heroSaleButtonText: 'View Festive Sale',
  primaryColor: '#722F37',
  secondaryColor: '#D4AF37',
  currencyName: 'PKR',
  currencySymbol: 'Rs.',
  currencyPosition: 'prefix',
  whatsappNumber: '+92 300 1234567',
  whatsappDefaultMessage: 'Hello SH Collection! I am interested in inquiring about bridal and luxury formal outfits.',
  phone: '+92 300 1234567',
  email: 'contact@shcollection.com',
  address: 'Flagship Bridal Studio, MM Alam Road, Gulberg III, Lahore, Pakistan',
  businessHours: 'Mon - Sat: 11:00 AM - 9:00 PM (Appointments Preferred)',
  socialLinks: {
    instagram: 'https://instagram.com/shcollection',
    facebook: 'https://facebook.com/shcollection',
    tiktok: 'https://tiktok.com/@shcollection',
    pinterest: 'https://pinterest.com/shcollection',
  },
  footerText: 'SH Collection is a premier luxury fashion atelier celebrating heritage craftsmanship, delicate embroideries, and majestic bridal silhouettes.',
  orderSlip: {
    showLogo: true,
    showWebsiteName: true,
    showCustomerName: true,
    showPhone: true,
    showEmail: true,
    showAddress: true,
    showOrderNumber: true,
    showDate: true,
    showProducts: true,
    showQuantity: true,
    showPrices: true,
    showDiscount: true,
    showShipping: true,
    showTotal: true,
    showNotes: true,
    showWhatsapp: true,
    showEmailContact: true,
    showFooterText: true,
    headerNote: 'OFFICIAL BRIDAL ORDER INVOICE & SPECIFICATION SLIP',
    footerNote: 'Thank you for choosing SH Collection. Each bridal piece is tailored with hand-embroidered artisanal care. For custom fittings or alterations, please contact our concierge via WhatsApp.',
  },
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<WebsiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const data = await api.getSettings();
      if (data && data.websiteName) {
        setSettings(data);
      }
    } catch (err) {
      console.warn('Using default settings fallback:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const formatPrice = (amount: number): string => {
    const formatted = Math.round(amount).toLocaleString('en-US');
    const symbol = settings.currencySymbol || 'Rs.';
    if (settings.currencyPosition === 'suffix') {
      return `${formatted} ${symbol}`;
    }
    return `${symbol} ${formatted}`;
  };

  const getWhatsAppUrl = (customText?: string): string => {
    let rawNumber = (settings.whatsappNumber || '+923001234567').replace(/[^0-9]/g, '');
    // Handle leading zeros (e.g., 03001234567 -> 923001234567)
    if (rawNumber.startsWith('03') && rawNumber.length === 11) {
      rawNumber = '92' + rawNumber.slice(1);
    } else if (rawNumber.startsWith('00')) {
      rawNumber = rawNumber.slice(2);
    }
    const message = encodeURIComponent(customText || settings.whatsappDefaultMessage || 'Hello SH Collection!');
    return `https://wa.me/${rawNumber}?text=${message}`;
  };

  const updateSettings = async (partial: Partial<WebsiteSettings>): Promise<WebsiteSettings> => {
    const updated = await api.updateSettings(partial);
    setSettings(updated);
    return updated;
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        loading,
        formatPrice,
        getWhatsAppUrl,
        refreshSettings: fetchSettings,
        updateSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

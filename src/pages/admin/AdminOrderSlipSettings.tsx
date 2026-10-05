import React, { useState } from 'react';
import { useSettings } from '../../context/SettingsContext.js';
import { generateOrderSlipPDF } from '../../lib/pdf.js';
import { Order } from '../../types/index.js';
import { FileText, CheckCircle2, Download, Eye, Sparkles } from 'lucide-react';

export const AdminOrderSlipSettings: React.FC = () => {
  const { settings, updateSettings } = useSettings();
  const [slip, setSlip] = useState(settings.orderSlip);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const toggleField = (key: keyof typeof slip) => {
    setSlip((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);

    try {
      await updateSettings({
        orderSlip: slip,
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to update order slip settings:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleTestDownload = () => {
    const sampleOrder: Order = {
      id: 'sample-101',
      orderNumber: 'SH-SAMPLE-999',
      customerName: 'Aiman Farooq',
      phone: '+92 300 9876543',
      email: 'aiman.f@example.com',
      address: 'House 14, Royal Palm Residences',
      city: 'Lahore',
      province: 'Punjab',
      postalCode: '54000',
      notes: 'Custom bridal fitting: Blouse length 15.5 inches, high-round neckline with zardozi trim.',
      items: [
        {
          productId: 'sample-prod-1',
          name: 'Noor-e-Jahan Royal Crimson Barat Lehnga',
          sku: 'SH-BR-01',
          price: 208250,
          originalPrice: 245000,
          quantity: 1,
          size: 'Custom Bridal Stitching',
          color: 'Crimson Wine',
          image: '',
        },
      ],
      subtotal: 208250,
      discount: 36750,
      shipping: 0,
      grandTotal: 208250,
      currency: settings.currencyName,
      currencySymbol: settings.currencySymbol,
      status: 'Confirmed',
      paymentMethod: 'Cash on Delivery',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    generateOrderSlipPDF(sampleOrder, {
      ...settings,
      orderSlip: slip,
    });
  };

  const fieldToggles: { key: keyof typeof slip; label: string; desc: string }[] = [
    { key: 'showLogo', label: 'Include Logo / Branding', desc: 'Display logo graphic or brand name in header' },
    { key: 'showWebsiteName', label: 'Display Website Name', desc: 'Print SH Collection title at top left' },
    { key: 'showCustomerName', label: 'Customer Full Name', desc: 'Display buyer name on the slip' },
    { key: 'showPhone', label: 'Customer Telephone', desc: 'Display customer telephone number' },
    { key: 'showEmail', label: 'Customer Email', desc: 'Display customer email address' },
    { key: 'showAddress', label: 'Delivery Address', desc: 'Display customer shipping destination' },
    { key: 'showOrderNumber', label: 'Order Number', desc: 'Display official tracking code (e.g. SH-2026-1001)' },
    { key: 'showDate', label: 'Order Date', desc: 'Display order booking timestamp' },
    { key: 'showProducts', label: 'Products Table', desc: 'Display line items list' },
    { key: 'showQuantity', label: 'Quantities Column', desc: 'Display units column in items table' },
    { key: 'showPrices', label: 'Prices & Line Totals', desc: 'Display unit costs and item total amount' },
    { key: 'showDiscount', label: 'Promotional Discounts', desc: 'Display applied discount row' },
    { key: 'showShipping', label: 'Shipping Charges Row', desc: 'Display courier charges / complimentary status' },
    { key: 'showTotal', label: 'Grand Total Box', desc: 'Display highlighted final total box' },
    { key: 'showNotes', label: 'Custom Fitting Notes', desc: 'Print special client bridal fitting requests' },
    { key: 'showWhatsapp', label: 'Atelier WhatsApp', desc: 'Print store WhatsApp concierge contact' },
    { key: 'showEmailContact', label: 'Atelier Email', desc: 'Print store support email' },
    { key: 'showFooterText', label: 'Footer Note', desc: 'Display bottom terms and thank-you statement' },
  ];

  return (
    <div className="max-w-4xl space-y-6">
      <div className="bg-white rounded-3xl border border-[#E8DFC9] p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-serif-luxury text-2xl font-bold text-[#231F20]">
              PDF Order Slip & Invoice Settings
            </h2>
            <p className="text-xs text-[#5A5550]">
              Control exactly which information elements are rendered on the downloadable PDF order slips.
            </p>
          </div>

          <button
            type="button"
            onClick={handleTestDownload}
            className="px-5 py-2.5 bg-[#F5EFEB] hover:bg-[#E8DFC9] text-[#722F37] border border-[#722F37] text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center space-x-1.5 shrink-0"
          >
            <Download className="w-4 h-4" />
            <span>Test Download PDF Slip</span>
          </button>
        </div>

        {success && (
          <div className="p-3 bg-green-50 border border-green-200 text-green-700 text-xs rounded-xl flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <span>Order slip preferences saved successfully! New downloads will reflect these rules.</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6 text-xs">
          {/* Toggles Grid */}
          <div className="space-y-3">
            <h3 className="font-serif-luxury text-base font-bold text-[#722F37] pb-1 border-b border-[#E8DFC9]">
              Information Visibility Controls
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {fieldToggles.map((item) => {
                const isChecked = Boolean(slip[item.key]);
                return (
                  <label
                    key={item.key}
                    className={`flex items-start space-x-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      isChecked
                        ? 'border-[#722F37] bg-[#722F37]/5'
                        : 'border-[#E8DFC9] hover:bg-[#FDFBF7]'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleField(item.key)}
                      className="mt-0.5 rounded text-[#722F37] focus:ring-[#722F37] w-4 h-4"
                    />
                    <div className="space-y-0.5">
                      <span className="font-bold text-[#231F20] block">{item.label}</span>
                      <p className="text-[10px] text-[#8C7654]">{item.desc}</p>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Notes Customization */}
          <div className="space-y-4 pt-4 border-t border-[#E8DFC9]">
            <h3 className="font-serif-luxury text-base font-bold text-[#722F37]">
              Custom PDF Header & Footer Notes
            </h3>

            <div className="space-y-1">
              <label className="font-semibold text-[#231F20] block">
                Header Badge / Sub-Title Note
              </label>
              <input
                type="text"
                value={slip.headerNote}
                onChange={(e) => setSlip({ ...slip, headerNote: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#FDFBF7] border border-[#E8DFC9] rounded-xl text-xs font-semibold"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-[#231F20] block">
                Footer Terms & Thank You Message
              </label>
              <textarea
                rows={3}
                value={slip.footerNote}
                onChange={(e) => setSlip({ ...slip, footerNote: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#FDFBF7] border border-[#E8DFC9] rounded-xl text-xs"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-[#E8DFC9] flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3.5 bg-[#722F37] hover:bg-[#501F25] text-[#F4E8C1] text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-50"
            >
              {saving ? 'Updating Rules...' : 'Save Slip Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

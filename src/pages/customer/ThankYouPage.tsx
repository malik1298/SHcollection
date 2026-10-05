import React, { useEffect, useState } from 'react';
import { Order } from '../../types/index.js';
import { useSettings } from '../../context/SettingsContext.js';
import { generateOrderSlipPDF } from '../../lib/pdf.js';
import confetti from 'canvas-confetti';
import {
  CheckCircle,
  Download,
  Printer,
  MessageCircle,
  ArrowRight,
  ShoppingBag,
  Sparkles,
  Calendar,
  User,
  MapPin,
  CreditCard
} from 'lucide-react';

interface ThankYouPageProps {
  order: Order | null;
  onNavigate: (page: string, params?: Record<string, any>) => void;
}

export const ThankYouPage: React.FC<ThankYouPageProps> = ({ order, onNavigate }) => {
  const { settings, formatPrice, getWhatsAppUrl } = useSettings();
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  useEffect(() => {
    // Fire celebratory confetti on mount
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#722F37', '#D4AF37', '#F4E8C1', '#25D366'],
      });
    } catch (e) {
      // safe fallback
    }
  }, []);

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif-luxury text-3xl font-bold text-[#231F20]">
          No Order Found
        </h2>
        <p className="text-xs text-[#5A5550]">
          We could not retrieve order details. Please return to the boutique home.
        </p>
        <button
          onClick={() => onNavigate('home')}
          className="px-8 py-3.5 bg-[#722F37] text-[#F4E8C1] text-xs font-bold uppercase tracking-wider rounded-xl"
        >
          Return Home
        </button>
      </div>
    );
  }

  const handleDownloadPDF = () => {
    setIsGeneratingPdf(true);
    try {
      generateOrderSlipPDF(order, settings);
    } catch (err) {
      console.error('PDF Generation failed:', err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const whatsappMessage = `Hello SH Collection! I have just confirmed my order #${order.orderNumber} for ${order.customerName}. Please confirm bridal tailoring & dispatch timeline.`;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Thank You Card */}
      <div className="bg-white rounded-3xl border-2 border-[#D4AF37] p-8 sm:p-12 text-center space-y-6 shadow-xl relative overflow-hidden">
        {/* Top Gold Corner Accent */}
        <div className="w-20 h-20 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mx-auto text-[#722F37]">
          <CheckCircle className="w-12 h-12 text-[#25D366]" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-[#F5EFEB] rounded-full text-xs font-bold text-[#722F37] uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Official Bridal Booking Confirmed</span>
          </div>

          <h1 className="font-serif-luxury text-3xl sm:text-5xl font-bold text-[#231F20]">
            Thank You for Your Order!
          </h1>
          <p className="text-xs sm:text-sm text-[#5A5550] max-w-lg mx-auto">
            Your bridal formal order has been successfully recorded in our atelier ledger. Our senior bridal consultant will contact you via WhatsApp for personal fitting verification.
          </p>
        </div>

        {/* Order Quick Metadata Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-[#FDFBF7] border border-[#E8DFC9] text-left text-xs">
          <div>
            <span className="text-[#8C7654] uppercase tracking-wider block text-[10px] font-semibold">
              Order Number
            </span>
            <span className="font-bold text-[#722F37] text-sm">{order.orderNumber}</span>
          </div>

          <div>
            <span className="text-[#8C7654] uppercase tracking-wider block text-[10px] font-semibold">
              Client Name
            </span>
            <span className="font-bold text-[#231F20] truncate block">{order.customerName}</span>
          </div>

          <div>
            <span className="text-[#8C7654] uppercase tracking-wider block text-[10px] font-semibold">
              Order Date
            </span>
            <span className="font-bold text-[#231F20]">
              {new Date(order.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </div>

          <div>
            <span className="text-[#8C7654] uppercase tracking-wider block text-[10px] font-semibold">
              Total Amount
            </span>
            <span className="font-bold text-[#722F37] text-sm">
              {formatPrice(order.grandTotal)}
            </span>
          </div>
        </div>

        {/* Primary Action: Download Order Slip PDF Button */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={handleDownloadPDF}
            disabled={isGeneratingPdf}
            className="w-full sm:w-auto px-8 py-4 bg-[#722F37] hover:bg-[#501F25] text-[#F4E8C1] border border-[#D4AF37] text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-xl hover:shadow-2xl flex items-center justify-center space-x-2 active:scale-95"
          >
            <Download className="w-4 h-4 text-[#D4AF37]" />
            <span>{isGeneratingPdf ? 'Generating PDF...' : 'Download Order Slip PDF'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="w-full sm:w-auto px-6 py-4 bg-[#F5EFEB] hover:bg-[#E8DFC9] text-[#231F20] text-xs font-semibold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center space-x-2"
          >
            <Printer className="w-4 h-4" />
            <span>Print Invoice</span>
          </button>

          <a
            href={getWhatsAppUrl(whatsappMessage)}
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-auto px-6 py-4 bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center space-x-2 active:scale-95"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Track on WhatsApp</span>
          </a>
        </div>
      </div>

      {/* Printable & Visible Order Summary Dossier */}
      <div id="printable-slip" className="bg-white rounded-3xl border border-[#E8DFC9] p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E8DFC9]">
          <div>
            <span className="font-serif-luxury text-2xl font-bold text-[#722F37]">
              {settings.websiteName}
            </span>
            <p className="text-[11px] text-[#8C7654]">Official Atelier Specification & Order Invoice</p>
          </div>
          <div className="text-right mt-2 sm:mt-0 text-xs">
            <span className="font-bold text-[#231F20] block">Status: {order.status}</span>
            <span className="text-[#8C7654]">Payment: {order.paymentMethod}</span>
          </div>
        </div>

        {/* Client & Studio Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-[#5A5550]">
          <div className="p-4 rounded-xl bg-[#FDFBF7] border border-[#E8DFC9] space-y-1">
            <span className="font-bold text-[#722F37] uppercase tracking-wider block mb-1">
              Client Delivery Address:
            </span>
            <p className="font-semibold text-[#231F20]">{order.customerName}</p>
            <p>{order.phone}</p>
            {order.email && <p>{order.email}</p>}
            <p>{order.address}, {order.city} {order.province && `, ${order.province}`}</p>
          </div>

          <div className="p-4 rounded-xl bg-[#FDFBF7] border border-[#E8DFC9] space-y-1">
            <span className="font-bold text-[#722F37] uppercase tracking-wider block mb-1">
              Atelier & Flagship Studio:
            </span>
            <p className="font-semibold text-[#231F20]">{settings.websiteName} Couture</p>
            <p>{settings.address}</p>
            <p>WhatsApp: {settings.whatsappNumber}</p>
            <p>Email: {settings.email}</p>
          </div>
        </div>

        {/* Items Table */}
        <div className="border border-[#E8DFC9] rounded-2xl overflow-hidden">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#722F37] text-white">
              <tr>
                <th className="p-3">#</th>
                <th className="p-3">Item Specification</th>
                <th className="p-3">Size / Color</th>
                <th className="p-3 text-center">Qty</th>
                <th className="p-3 text-right">Unit Price</th>
                <th className="p-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5EFEB]">
              {order.items.map((item, index) => (
                <tr key={index} className="hover:bg-[#FDFBF7]">
                  <td className="p-3 text-[#8C7654]">{index + 1}</td>
                  <td className="p-3">
                    <div className="font-bold text-[#231F20]">{item.name}</div>
                    <span className="text-[10px] text-[#8C7654]">SKU: {item.sku}</span>
                  </td>
                  <td className="p-3 text-[#5A5550]">
                    {item.size} / {item.color}
                  </td>
                  <td className="p-3 text-center font-bold text-[#231F20]">{item.quantity}</td>
                  <td className="p-3 text-right">{formatPrice(item.price)}</td>
                  <td className="p-3 text-right font-bold text-[#722F37]">
                    {formatPrice(item.price * item.quantity)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Calculation Summary */}
        <div className="flex justify-end text-xs">
          <div className="w-full sm:w-72 space-y-2">
            <div className="flex justify-between text-[#5A5550]">
              <span>Subtotal:</span>
              <span className="font-semibold text-[#231F20]">{formatPrice(order.subtotal)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-[#722F37]">
                <span>Discount Savings:</span>
                <span className="font-semibold">-{formatPrice(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-[#5A5550]">
              <span>White-Glove Courier:</span>
              <span className="font-semibold text-[#25D366]">Complimentary</span>
            </div>
            <div className="pt-2 border-t border-[#E8DFC9] flex justify-between font-bold text-sm text-[#722F37]">
              <span>Grand Total:</span>
              <span>{formatPrice(order.grandTotal)}</span>
            </div>
          </div>
        </div>

        {order.notes && (
          <div className="p-4 rounded-xl bg-[#F5EFEB] text-xs space-y-1">
            <span className="font-bold text-[#722F37] uppercase tracking-wider block">
              Fitting Notes / Customer Request:
            </span>
            <p className="text-[#5A5550]">{order.notes}</p>
          </div>
        )}
      </div>

      <div className="text-center pt-4">
        <button
          onClick={() => onNavigate('products')}
          className="text-xs font-bold uppercase tracking-wider text-[#722F37] hover:underline inline-flex items-center space-x-1"
        >
          <span>Continue Shopping More Bridal Ensembles</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

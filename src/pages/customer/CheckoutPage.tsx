import React, { useState } from 'react';
import { useCart } from '../../context/CartContext.js';
import { useSettings } from '../../context/SettingsContext.js';
import { useCustomerAuth } from '../../context/CustomerAuthContext.js';
import { api } from '../../lib/api.js';
import { Order } from '../../types/index.js';
import {
  ShieldCheck,
  CreditCard,
  Building2,
  Truck,
  ArrowLeft,
  CheckCircle2,
  Lock,
  Sparkles
} from 'lucide-react';

interface CheckoutPageProps {
  initialNotes?: string;
  onNavigate: (page: string, params?: Record<string, any>) => void;
  onOrderSuccess: (order: Order) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  initialNotes = '',
  onNavigate,
  onOrderSuccess,
}) => {
  const { items, subtotal, discountTotal, grandTotal, clearCart } = useCart();
  const { settings, formatPrice } = useSettings();
  const { customer } = useCustomerAuth();

  // Customer form fields
  const [formData, setFormData] = useState({
    customerName: customer?.name || '',
    phone: customer?.phone || '',
    email: customer?.email || '',
    address: customer?.address || '',
    city: customer?.city || '',
    province: 'Punjab',
    postalCode: '',
    notes: initialNotes,
  });

  const [paymentMethod, setPaymentMethod] = useState<string>('Cash on Delivery (Advance Deposit for Custom)');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif-luxury text-3xl font-bold text-[#231F20]">
          Your bag is empty
        </h2>
        <p className="text-xs text-[#5A5550]">
          Please add a bridal or luxury formal ensemble to your shopping bag before proceeding to checkout.
        </p>
        <button
          onClick={() => onNavigate('products')}
          className="px-8 py-3.5 bg-[#722F37] text-[#F4E8C1] text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-[#501F25]"
        >
          Return to Boutique
        </button>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.customerName.trim()) {
      setErrorMessage('Please enter your full name');
      return;
    }
    if (!formData.phone.trim()) {
      setErrorMessage('Please provide your active telephone number for courier coordination');
      return;
    }
    if (!formData.address.trim()) {
      setErrorMessage('Please enter your complete delivery destination address');
      return;
    }
    if (!formData.city.trim()) {
      setErrorMessage('Please provide your city');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderItems = items.map((item) => {
        const effectivePrice =
          item.product.saleEnabled && item.product.salePercentage > 0
            ? item.product.salePrice
            : item.product.price;

        return {
          productId: item.product.id,
          name: item.product.name,
          sku: item.product.sku,
          price: effectivePrice,
          originalPrice: item.product.price,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
          image: item.product.images?.[0] || 'https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=400&q=80',
        };
      });

      const newOrder = await api.createOrder({
        customerName: formData.customerName,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        city: formData.city,
        province: formData.province,
        postalCode: formData.postalCode,
        notes: formData.notes,
        items: orderItems,
        subtotal,
        discount: discountTotal,
        shipping: 0, // Complimentary
        grandTotal,
        paymentMethod,
      });

      clearCart();
      onOrderSuccess(newOrder);
    } catch (err: any) {
      console.error('Failed to submit order:', err);
      setErrorMessage(err.message || 'Failed to place order. Please try again or contact atelier on WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Breadcrumb */}
      <div>
        <button
          onClick={() => onNavigate('cart')}
          className="inline-flex items-center space-x-1.5 text-xs font-semibold uppercase tracking-wider text-[#722F37] hover:underline mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Shopping Bag</span>
        </button>
        <h1 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-[#231F20]">
          Checkout & Atelier Booking
        </h1>
      </div>

      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Form: Customer Details & Payment (7 cols) */}
        <div className="lg:col-span-7 space-y-8">
          {/* Section 1: Client Information */}
          <div className="bg-white rounded-3xl border border-[#E8DFC9] p-6 sm:p-8 space-y-4 shadow-sm">
            <div className="flex items-center space-x-2 pb-3 border-b border-[#E8DFC9]">
              <span className="w-6 h-6 rounded-full bg-[#722F37] text-white text-xs font-bold flex items-center justify-center">
                1
              </span>
              <h2 className="font-serif-luxury text-xl font-bold text-[#231F20]">
                Client & Delivery Details
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs font-semibold text-[#231F20] block">
                  Full Name <span className="text-[#722F37]">*</span>
                </label>
                <input
                  type="text"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Ayesha Khan"
                  className="w-full px-3.5 py-2.5 bg-[#FDFBF7] border border-[#E8DFC9] rounded-xl text-xs text-[#231F20] focus:outline-none focus:ring-1 focus:ring-[#722F37]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#231F20] block">
                  Mobile / WhatsApp Number <span className="text-[#722F37]">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="+92 300 1234567"
                  className="w-full px-3.5 py-2.5 bg-[#FDFBF7] border border-[#E8DFC9] rounded-xl text-xs text-[#231F20] focus:outline-none focus:ring-1 focus:ring-[#722F37]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#231F20] block">
                  Email Address (For Order Slip PDF)
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="ayesha.khan@example.com"
                  className="w-full px-3.5 py-2.5 bg-[#FDFBF7] border border-[#E8DFC9] rounded-xl text-xs text-[#231F20] focus:outline-none focus:ring-1 focus:ring-[#722F37]"
                />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs font-semibold text-[#231F20] block">
                  Street Address & House / Suite # <span className="text-[#722F37]">*</span>
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  placeholder="House 42-B, Sector F-7/2, Street 18"
                  className="w-full px-3.5 py-2.5 bg-[#FDFBF7] border border-[#E8DFC9] rounded-xl text-xs text-[#231F20] focus:outline-none focus:ring-1 focus:ring-[#722F37]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#231F20] block">
                  City <span className="text-[#722F37]">*</span>
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  placeholder="Lahore / Karachi / Islamabad"
                  className="w-full px-3.5 py-2.5 bg-[#FDFBF7] border border-[#E8DFC9] rounded-xl text-xs text-[#231F20] focus:outline-none focus:ring-1 focus:ring-[#722F37]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#231F20] block">
                  Province / State
                </label>
                <input
                  type="text"
                  name="province"
                  value={formData.province}
                  onChange={handleChange}
                  placeholder="Punjab / Sindh / ICT / Overseas"
                  className="w-full px-3.5 py-2.5 bg-[#FDFBF7] border border-[#E8DFC9] rounded-xl text-xs text-[#231F20] focus:outline-none focus:ring-1 focus:ring-[#722F37]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#231F20] block">
                  Postal Code
                </label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  placeholder="54000"
                  className="w-full px-3.5 py-2.5 bg-[#FDFBF7] border border-[#E8DFC9] rounded-xl text-xs text-[#231F20] focus:outline-none focus:ring-1 focus:ring-[#722F37]"
                />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs font-semibold text-[#231F20] block">
                  Custom Measurements or Wedding Date Notes
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Enter your event date, custom bridal measurements, or fitting preferences..."
                  className="w-full px-3.5 py-2.5 bg-[#FDFBF7] border border-[#E8DFC9] rounded-xl text-xs text-[#231F20] focus:outline-none focus:ring-1 focus:ring-[#722F37]"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Payment Options */}
          <div className="bg-white rounded-3xl border border-[#E8DFC9] p-6 sm:p-8 space-y-4 shadow-sm">
            <div className="flex items-center space-x-2 pb-3 border-b border-[#E8DFC9]">
              <span className="w-6 h-6 rounded-full bg-[#722F37] text-white text-xs font-bold flex items-center justify-center">
                2
              </span>
              <h2 className="font-serif-luxury text-xl font-bold text-[#231F20]">
                Payment Arrangement
              </h2>
            </div>

            <div className="space-y-3">
              {/* Option 1: COD / Advance Deposit */}
              <label
                className={`flex items-start space-x-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod.includes('Cash on Delivery')
                    ? 'border-[#722F37] bg-[#722F37]/5 ring-1 ring-[#722F37]'
                    : 'border-[#E8DFC9] hover:bg-[#FDFBF7]'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="Cash on Delivery (Advance Deposit for Custom)"
                  checked={paymentMethod.includes('Cash on Delivery')}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mt-1 text-[#722F37] focus:ring-[#722F37]"
                />
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <Truck className="w-4 h-4 text-[#722F37]" />
                    <span className="text-xs font-bold text-[#231F20]">
                      Cash on Delivery / Partial Advance for Custom Bridal
                    </span>
                  </div>
                  <p className="text-[11px] text-[#5A5550]">
                    Pay cash upon door delivery for ready stock. For bespoke bridal stitched orders, our concierge coordinates a 30% advance deposit.
                  </p>
                </div>
              </label>

              {/* Option 2: Direct Bank Transfer */}
              <label
                className={`flex items-start space-x-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod.includes('Bank Transfer')
                    ? 'border-[#722F37] bg-[#722F37]/5 ring-1 ring-[#722F37]'
                    : 'border-[#E8DFC9] hover:bg-[#FDFBF7]'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="Direct Bank Transfer / Wire"
                  checked={paymentMethod.includes('Bank Transfer')}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mt-1 text-[#722F37] focus:ring-[#722F37]"
                />
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <Building2 className="w-4 h-4 text-[#722F37]" />
                    <span className="text-xs font-bold text-[#231F20]">
                      Official Atelier Bank Wire / Online Transfer
                    </span>
                  </div>
                  <p className="text-[11px] text-[#5A5550]">
                    Transfer directly into SH Collection HBL / Meezan corporate account. Banking details will appear on your generated Order Slip PDF.
                  </p>
                </div>
              </label>

              {/* Option 3: Credit Card */}
              <label
                className={`flex items-start space-x-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod.includes('Credit Card')
                    ? 'border-[#722F37] bg-[#722F37]/5 ring-1 ring-[#722F37]'
                    : 'border-[#E8DFC9] hover:bg-[#FDFBF7]'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="Online Visa / Mastercard Credit Card"
                  checked={paymentMethod.includes('Credit Card')}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mt-1 text-[#722F37] focus:ring-[#722F37]"
                />
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <CreditCard className="w-4 h-4 text-[#722F37]" />
                    <span className="text-xs font-bold text-[#231F20]">
                      Visa / Mastercard / UnionPay Card
                    </span>
                  </div>
                  <p className="text-[11px] text-[#5A5550]">
                    256-bit encrypted card gateway processing.
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary & Confirm Button (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl border border-[#E8DFC9] p-6 sm:p-8 space-y-6 shadow-sm sticky top-28">
            <h2 className="font-serif-luxury text-2xl font-bold text-[#231F20] pb-4 border-b border-[#E8DFC9]">
              Order Summary ({items.length})
            </h2>

            {/* Item Mini Thumbnails */}
            <div className="max-h-60 overflow-y-auto space-y-3 pr-1 divide-y divide-[#F5EFEB]">
              {items.map((item) => {
                const effectivePrice =
                  item.product.saleEnabled && item.product.salePercentage > 0
                    ? item.product.salePrice
                    : item.product.price;

                return (
                  <div key={item.id} className="pt-2 first:pt-0 flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-3">
                      <img
                        src={item.product.images?.[0] || 'https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=100&q=80'}
                        alt=""
                        className="w-12 h-14 object-cover object-top rounded-lg bg-[#F5EFEB]"
                      />
                      <div>
                        <h4 className="font-serif-luxury font-bold text-[#231F20] line-clamp-1">
                          {item.product.name}
                        </h4>
                        <span className="text-[11px] text-[#8C7654]">
                          Qty: {item.quantity} | {item.size}
                        </span>
                      </div>
                    </div>
                    <span className="font-serif-luxury font-bold text-[#722F37]">
                      {formatPrice(effectivePrice * item.quantity)}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Calculations */}
            <div className="pt-4 border-t border-[#E8DFC9] space-y-2 text-xs text-[#5A5550]">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-semibold text-[#231F20]">{formatPrice(subtotal)}</span>
              </div>
              {discountTotal > 0 && (
                <div className="flex justify-between text-[#722F37]">
                  <span>Discount:</span>
                  <span className="font-semibold">-{formatPrice(discountTotal)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>White-Glove Shipping:</span>
                <span className="font-semibold text-[#25D366]">Complimentary</span>
              </div>
              <div className="pt-3 border-t border-[#E8DFC9] flex justify-between items-baseline">
                <span className="font-serif-luxury text-base font-bold text-[#231F20]">
                  Grand Total:
                </span>
                <span className="font-serif-luxury text-2xl font-bold text-[#722F37]">
                  {formatPrice(grandTotal)}
                </span>
              </div>
            </div>

            {/* Confirm Order Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-[#722F37] hover:bg-[#501F25] text-[#F4E8C1] text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center space-x-2 disabled:opacity-50 active:scale-95 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-[#F4E8C1] border-t-transparent rounded-full animate-spin" />
                  <span>Processing Bridal Booking...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-[#D4AF37]" />
                  <span>Confirm Order</span>
                </>
              )}
            </button>

            <div className="space-y-1.5 text-center text-[10px] text-[#8C7654]">
              <p className="flex items-center justify-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Instant Downloadable PDF Order Slip Generated Upon Confirmation</span>
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

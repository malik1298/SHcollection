import React, { useState } from 'react';
import { useCart } from '../../context/CartContext.js';
import { useSettings } from '../../context/SettingsContext.js';
import { Trash2, Plus, Minus, ArrowLeft, ArrowRight, ShoppingBag, Sparkles } from 'lucide-react';

interface CartPageProps {
  onNavigate: (page: string, params?: Record<string, any>) => void;
}

export const CartPage: React.FC<CartPageProps> = ({ onNavigate }) => {
  const { items, updateQuantity, removeFromCart, subtotal, discountTotal, grandTotal } = useCart();
  const { formatPrice } = useSettings();
  const [bridalNotes, setBridalNotes] = useState('');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 border-b border-[#E8DFC9] gap-4">
        <div>
          <button
            onClick={() => onNavigate('products')}
            className="inline-flex items-center space-x-1.5 text-xs font-semibold uppercase tracking-wider text-[#722F37] hover:underline mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Continue Browsing Boutique</span>
          </button>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-[#231F20]">
            Your Bridal Shopping Bag ({items.length} {items.length === 1 ? 'Design' : 'Designs'})
          </h1>
        </div>

        <div className="flex items-center space-x-2 text-xs text-[#722F37] font-semibold bg-[#F5EFEB] px-4 py-2 rounded-xl border border-[#E8DFC9]">
          <Sparkles className="w-4 h-4 text-[#D4AF37]" />
          <span>Complimentary White-Glove Courier & Luxury Packaging</span>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="bg-white rounded-3xl border border-[#E8DFC9] p-16 text-center space-y-4 shadow-sm">
          <div className="w-20 h-20 mx-auto rounded-full bg-[#F5EFEB] flex items-center justify-center text-[#8C7654]">
            <ShoppingBag className="w-10 h-10 opacity-60" />
          </div>
          <h2 className="font-serif-luxury text-2xl font-bold text-[#231F20]">
            Your Bag is Empty
          </h2>
          <p className="text-xs text-[#5A5550] max-w-md mx-auto">
            You have not added any bridal or luxury formal ensembles to your shopping bag yet. Explore our handcrafted collections.
          </p>
          <button
            onClick={() => onNavigate('products')}
            className="px-8 py-3.5 bg-[#722F37] text-[#F4E8C1] text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-[#501F25] transition-all shadow-md"
          >
            Explore Bridal Collection
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Items Table (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white rounded-2xl border border-[#E8DFC9] overflow-hidden shadow-sm">
              <div className="p-4 bg-[#F5EFEB] border-b border-[#E8DFC9] hidden sm:grid grid-cols-12 text-xs font-bold uppercase tracking-wider text-[#8C7654]">
                <span className="col-span-6">Ensemble Description</span>
                <span className="col-span-2 text-center">Quantity</span>
                <span className="col-span-2 text-right">Price</span>
                <span className="col-span-2 text-right">Total</span>
              </div>

              <div className="divide-y divide-[#F5EFEB]">
                {items.map((item) => {
                  const effectivePrice =
                    item.product.saleEnabled && item.product.salePercentage > 0
                      ? item.product.salePrice
                      : item.product.price;

                  return (
                    <div key={item.id} className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                      {/* Product image & Info */}
                      <div className="sm:col-span-6 flex items-start space-x-4">
                        <img
                          src={item.product.images?.[0] || 'https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=200&q=80'}
                          alt={item.product.name}
                          className="w-20 h-24 object-cover object-top rounded-xl bg-[#F5EFEB] shrink-0"
                        />
                        <div className="space-y-1">
                          <span className="text-[10px] text-[#8C7654] uppercase tracking-wider font-semibold block">
                            SKU: {item.product.sku}
                          </span>
                          <h3 className="font-serif-luxury text-base font-bold text-[#231F20]">
                            {item.product.name}
                          </h3>
                          <p className="text-xs text-[#5A5550]">
                            Size: <span className="font-bold text-[#231F20]">{item.size}</span>
                          </p>
                          <p className="text-xs text-[#5A5550]">
                            Color: <span className="font-bold text-[#231F20]">{item.color}</span>
                          </p>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-xs text-[#722F37] hover:underline flex items-center space-x-1 pt-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>

                      {/* Quantity */}
                      <div className="sm:col-span-2 flex sm:justify-center">
                        <div className="inline-flex items-center border border-[#E8DFC9] rounded-xl bg-[#FDFBF7] p-1">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-7 h-7 rounded-lg hover:bg-[#F5EFEB] text-[#722F37] font-bold text-xs flex items-center justify-center transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-3 text-xs font-bold text-[#231F20]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-7 h-7 rounded-lg hover:bg-[#F5EFEB] text-[#722F37] font-bold text-xs flex items-center justify-center transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {/* Unit Price */}
                      <div className="sm:col-span-2 sm:text-right">
                        <span className="font-serif-luxury text-sm font-semibold text-[#231F20]">
                          {formatPrice(effectivePrice)}
                        </span>
                        {item.product.saleEnabled && item.product.salePercentage > 0 && (
                          <span className="block text-[10px] text-[#9E9892] line-through">
                            {formatPrice(item.product.price)}
                          </span>
                        )}
                      </div>

                      {/* Line Total */}
                      <div className="sm:col-span-2 sm:text-right font-serif-luxury text-base font-bold text-[#722F37]">
                        {formatPrice(effectivePrice * item.quantity)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Custom Fitting / Bridal Order Notes */}
            <div className="bg-white rounded-2xl border border-[#E8DFC9] p-6 space-y-3">
              <label className="font-serif-luxury text-base font-bold text-[#231F20] block">
                Custom Bridal Fitting or Special Instructions (Optional)
              </label>
              <textarea
                value={bridalNotes}
                onChange={(e) => setBridalNotes(e.target.value)}
                rows={3}
                placeholder="Specify your wedding date, custom shirt length, sleeve modifications, neckline preferences, or expedited shipping inquiries..."
                className="w-full p-3 bg-[#FDFBF7] border border-[#E8DFC9] rounded-xl text-xs text-[#231F20] focus:outline-none focus:ring-1 focus:ring-[#722F37]"
              />
            </div>
          </div>

          {/* Order Summary Card (4 cols) */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-3xl border border-[#E8DFC9] p-6 sm:p-8 space-y-6 shadow-sm sticky top-28">
              <h2 className="font-serif-luxury text-2xl font-bold text-[#231F20] pb-4 border-b border-[#E8DFC9]">
                Order Summary
              </h2>

              <div className="space-y-3 text-xs text-[#5A5550]">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-semibold text-[#231F20]">{formatPrice(subtotal)}</span>
                </div>

                {discountTotal > 0 && (
                  <div className="flex justify-between text-[#722F37] font-semibold">
                    <span>Promotional Savings:</span>
                    <span>-{formatPrice(discountTotal)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>White-Glove Bridal Courier:</span>
                  <span className="font-semibold text-[#25D366]">Complimentary</span>
                </div>

                <div className="flex justify-between">
                  <span>Bespoke Fitting Concierge:</span>
                  <span className="font-semibold text-[#231F20]">Included</span>
                </div>

                <div className="pt-4 border-t border-[#E8DFC9] flex justify-between items-baseline">
                  <span className="font-serif-luxury text-lg font-bold text-[#231F20]">
                    Total Payable:
                  </span>
                  <span className="font-serif-luxury text-2xl font-bold text-[#722F37]">
                    {formatPrice(grandTotal)}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => onNavigate('checkout', { notes: bridalNotes })}
                  className="w-full py-4 bg-[#722F37] hover:bg-[#501F25] text-[#F4E8C1] text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center space-x-2 active:scale-95"
                >
                  <span>Proceed to Secure Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <p className="text-[11px] text-center text-[#8C7654]">
                  Safe & Secure Checkout • Direct Atelier Confirmation
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

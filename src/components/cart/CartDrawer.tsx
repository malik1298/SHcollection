import React from 'react';
import { useCart } from '../../context/CartContext.js';
import { useSettings } from '../../context/SettingsContext.js';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Sparkles } from 'lucide-react';

interface CartDrawerProps {
  onNavigate: (page: string, params?: Record<string, any>) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onNavigate }) => {
  const { isCartOpen, setIsCartOpen, items, updateQuantity, removeFromCart, subtotal, discountTotal, grandTotal } = useCart();
  const { formatPrice } = useSettings();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FDFBF7] shadow-2xl flex flex-col border-l border-[#D4AF37]/40">
          {/* Header */}
          <div className="p-6 bg-[#722F37] text-[#F9F6F0] flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-[#D4AF37]" />
              <h2 className="font-serif-luxury text-xl font-bold tracking-wide">
                Your Shopping Bag
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-full text-[#F4E8C1] hover:bg-white/10 transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Complimentary Courier Notice */}
          <div className="bg-[#F5EFEB] px-4 py-2 text-center text-xs text-[#722F37] border-b border-[#E8DFC9] flex items-center justify-center space-x-1 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Complimentary White-Glove Bridal Courier Included</span>
          </div>

          {/* Item List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-[#F5EFEB] flex items-center justify-center mb-4 text-[#8C7654]">
                  <ShoppingBag className="w-8 h-8 opacity-60" />
                </div>
                <h3 className="font-serif-luxury text-lg font-bold text-[#231F20] mb-1">
                  Your bag is currently empty
                </h3>
                <p className="text-xs text-[#8C7654] max-w-xs mb-6">
                  Discover our majestic bridal silhouettes and royal handcrafted formal dresses.
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    onNavigate('products');
                  }}
                  className="px-6 py-2.5 bg-[#722F37] text-[#F4E8C1] text-xs font-semibold uppercase tracking-wider rounded-xl hover:bg-[#501F25] transition-all shadow-md"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              items.map((item) => {
                const effectivePrice =
                  item.product.saleEnabled && item.product.salePercentage > 0
                    ? item.product.salePrice
                    : item.product.price;

                return (
                  <div
                    key={item.id}
                    className="flex space-x-4 p-3 bg-white rounded-xl border border-[#E8DFC9] shadow-sm relative group"
                  >
                    {/* Thumbnail */}
                    <img
                      src={item.product.images?.[0] || 'https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=200&q=80'}
                      alt={item.product.name}
                      className="w-20 h-24 object-cover object-top rounded-lg bg-[#F5EFEB]"
                    />

                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between pr-2">
                          <h4 className="font-serif-luxury text-sm font-bold text-[#231F20] line-clamp-1">
                            {item.product.name}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-[#9E9892] hover:text-[#722F37] transition-colors p-1"
                            title="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-[11px] text-[#8C7654] mt-0.5">
                          Size: <span className="font-semibold text-[#231F20]">{item.size}</span> | Color: <span className="font-semibold text-[#231F20]">{item.color}</span>
                        </p>
                      </div>

                      {/* Quantity & Price */}
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#F5EFEB]">
                        <div className="flex items-center border border-[#E8DFC9] rounded-lg bg-[#FDFBF7]">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 hover:bg-[#F5EFEB] text-[#722F37] transition-colors rounded-l"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-semibold text-[#231F20]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 hover:bg-[#F5EFEB] text-[#722F37] transition-colors rounded-r"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="text-right">
                          <span className="font-serif-luxury text-sm font-bold text-[#722F37]">
                            {formatPrice(effectivePrice * item.quantity)}
                          </span>
                          {item.product.saleEnabled && item.product.salePercentage > 0 && (
                            <span className="block text-[10px] text-[#9E9892] line-through">
                              {formatPrice(item.product.price * item.quantity)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Totals & Checkout */}
          {items.length > 0 && (
            <div className="p-6 bg-white border-t border-[#E8DFC9] space-y-4 shadow-lg">
              <div className="space-y-2 text-xs text-[#5A5550]">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-semibold text-[#231F20]">{formatPrice(subtotal)}</span>
                </div>
                {discountTotal > 0 && (
                  <div className="flex justify-between text-[#722F37]">
                    <span>Promotional Savings:</span>
                    <span className="font-semibold">-{formatPrice(discountTotal)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Bridal White-Glove Shipping:</span>
                  <span className="font-semibold text-[#25D366]">Complimentary</span>
                </div>
                <div className="pt-2 border-t border-[#E8DFC9] flex justify-between text-base font-serif-luxury font-bold text-[#231F20]">
                  <span>Estimated Total:</span>
                  <span className="text-[#722F37] text-lg">{formatPrice(grandTotal)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    onNavigate('checkout');
                  }}
                  className="w-full py-3.5 bg-[#722F37] hover:bg-[#501F25] text-[#F4E8C1] text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center space-x-2 active:scale-95"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    onNavigate('cart');
                  }}
                  className="w-full py-2.5 bg-[#F5EFEB] hover:bg-[#E8DFC9] text-[#231F20] text-xs font-semibold uppercase tracking-wider rounded-xl transition-colors"
                >
                  View Full Cart & Sizing Notes
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

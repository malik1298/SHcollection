import React, { useState } from 'react';
import { Product } from '../../types/index.js';
import { useSettings } from '../../context/SettingsContext.js';
import { useCart } from '../../context/CartContext.js';
import { X, ShoppingBag, Check, Heart, MessageCircle, Sparkles } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext.js';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
  onViewDetails: (product: Product) => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  onClose,
  onViewDetails,
}) => {
  const { formatPrice, getWhatsAppUrl } = useSettings();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  if (!product) return null;

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || 'Standard');
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0]?.name || 'Default');
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  const isOnSale = product.saleEnabled && product.salePercentage > 0;
  const currentPrice = isOnSale ? product.salePrice : product.price;
  const isFavorited = isInWishlist(product.id);

  const validImages = (product.images || []).filter((img) => img && typeof img === 'string' && img.trim() !== '');
  const images = validImages.length > 0
    ? validImages
    : ['https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=800&q=80'];

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedSize, selectedColor);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      onClose();
    }, 1200);
  };

  const whatsappInquiryText = `Hello SH Collection! I am inquiring about the ${product.name} (SKU: ${product.sku}) in Size: ${selectedSize}, Color: ${selectedColor}.`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#FDFBF7] border border-[#D4AF37]/50 rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/80 hover:bg-[#722F37] text-[#231F20] hover:text-white rounded-full shadow-md transition-colors"
          aria-label="Close preview"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Gallery Column */}
          <div className="p-6 bg-[#F5EFEB] flex flex-col justify-between">
            <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-md bg-white mb-4">
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover object-top transition-all"
              />
            </div>

            {/* Thumbnail Row */}
            {images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-16 h-20 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                      selectedImage === idx ? 'border-[#722F37] scale-105' : 'border-transparent opacity-70'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Column */}
          <div className="p-6 md:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-[#8C7654] uppercase tracking-wider mb-2 font-semibold">
                <span>SKU: {product.sku}</span>
                <span className="capitalize">{product.category.replace(/-/g, ' ')}</span>
              </div>

              <h2 className="font-serif-luxury text-2xl md:text-3xl font-bold text-[#231F20] mb-3">
                {product.name}
              </h2>

              {/* Price */}
              <div className="flex items-baseline space-x-3 mb-4">
                <span className="font-serif-luxury text-2xl font-bold text-[#722F37]">
                  {formatPrice(currentPrice)}
                </span>
                {isOnSale && (
                  <>
                    <span className="text-base text-[#9E9892] line-through font-normal">
                      {formatPrice(product.price)}
                    </span>
                    <span className="bg-[#722F37] text-[#F4E8C1] text-xs font-bold px-2 py-0.5 rounded-full">
                      {product.salePercentage}% OFF
                    </span>
                  </>
                )}
              </div>

              <p className="text-xs text-[#5A5550] leading-relaxed line-clamp-3 mb-6">
                {product.description}
              </p>

              {/* Size Selector */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#231F20]">
                      Select Size
                    </span>
                    <span className="text-[11px] text-[#722F37] underline cursor-pointer">
                      Custom Fitting Available
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSelectedSize(s)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                          selectedSize === s
                            ? 'bg-[#722F37] text-[#F4E8C1] border-[#722F37]'
                            : 'bg-white text-[#231F20] border-[#E8DFC9] hover:border-[#722F37]'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color Selector */}
              {product.colors && product.colors.length > 0 && (
                <div className="mb-6">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#231F20] block mb-1.5">
                    Color: <span className="text-[#8C7654]">{selectedColor}</span>
                  </span>
                  <div className="flex items-center space-x-2">
                    {product.colors.map((c, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setSelectedColor(c.name)}
                        className={`w-7 h-7 rounded-full border-2 transition-transform ${
                          selectedColor === c.name
                            ? 'border-[#722F37] scale-110 shadow-sm'
                            : 'border-transparent hover:scale-105'
                        }`}
                        style={{ backgroundColor: c.hex }}
                        title={c.name}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-4 border-t border-[#E8DFC9]">
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className={`flex-1 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center space-x-2 ${
                    isAdded
                      ? 'bg-[#25D366] text-white'
                      : 'bg-[#722F37] hover:bg-[#501F25] text-[#F4E8C1]'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Bag</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Shopping Bag</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => toggleWishlist(product)}
                  className={`p-3.5 rounded-xl border transition-colors ${
                    isFavorited
                      ? 'bg-[#722F37] text-white border-[#722F37]'
                      : 'border-[#E8DFC9] text-[#5A5550] hover:text-[#722F37] bg-white'
                  }`}
                  title="Wishlist"
                >
                  <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
                </button>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <button
                  onClick={() => {
                    onClose();
                    onViewDetails(product);
                  }}
                  className="text-[#722F37] font-semibold hover:underline flex items-center space-x-1"
                >
                  <span>View Full Product Dossier</span>
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                </button>

                <a
                  href={getWhatsAppUrl(whatsappInquiryText)}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#25D366] hover:underline flex items-center space-x-1 font-medium"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp Concierge</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

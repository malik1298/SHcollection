import React, { useState } from 'react';
import { Product } from '../../types/index.js';
import { useSettings } from '../../context/SettingsContext.js';
import { useCart } from '../../context/CartContext.js';
import { useWishlist } from '../../context/WishlistContext.js';
import { Heart, Eye, ShoppingBag, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onQuickView?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
  onQuickView,
}) => {
  const { formatPrice } = useSettings();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [isHovered, setIsHovered] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const isFavorited = isInWishlist(product.id);
  const isOnSale = product.saleEnabled && product.salePercentage > 0;
  const currentPrice = isOnSale ? product.salePrice : product.price;

  const defaultFallback = 'https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=800&q=80';
  const validImages = (product.images || []).filter((img) => img && typeof img === 'string' && img.trim() !== '');
  const primaryImage = validImages[0] || defaultFallback;
  const secondaryImage = validImages[1] || primaryImage;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1, product.sizes?.[0], product.colors?.[0]?.name);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1800);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onQuickView) onQuickView(product);
  };

  return (
    <div
      onClick={() => onSelect(product)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative bg-white border border-[#E8DFC9] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer"
    >
      {/* Image Container with Badges */}
      <div className="relative aspect-[3/4] overflow-hidden bg-[#F5EFEB]">
        {/* Primary and secondary hover image */}
        <img
          src={isHovered ? secondaryImage : primaryImage}
          alt={product.name}
          className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {isOnSale && (
            <span className="bg-[#722F37] text-[#F4E8C1] text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md">
              {product.salePercentage}% OFF
            </span>
          )}
          {product.newArrival && (
            <span className="bg-[#D4AF37] text-[#231F20] text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-md">
              New Arrival
            </span>
          )}
          {product.availability === 'made_to_order' && (
            <span className="bg-[#231F20]/80 backdrop-blur-sm text-[#F4E8C1] text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-full">
              Made To Order
            </span>
          )}
        </div>

        {/* Top Right Wishlist Button */}
        <button
          type="button"
          onClick={handleToggleWishlist}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all z-10 ${
            isFavorited
              ? 'bg-[#722F37] text-white shadow-md scale-110'
              : 'bg-white/80 text-[#5A5550] hover:bg-white hover:text-[#722F37]'
          }`}
          title={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
        </button>

        {/* Quick View Floating Action (Desktop) */}
        {onQuickView && (
          <div className="absolute bottom-4 left-4 right-4 hidden md:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-10">
            <button
              type="button"
              onClick={handleQuickView}
              className="w-full py-2.5 bg-white/95 backdrop-blur-md hover:bg-[#722F37] text-[#231F20] hover:text-[#F4E8C1] text-xs font-semibold uppercase tracking-wider rounded-xl shadow-lg flex items-center justify-center space-x-1.5 transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Quick View</span>
            </button>
          </div>
        )}
      </div>

      {/* Product Content Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* SKU & Category */}
          <div className="flex items-center justify-between text-[11px] text-[#8C7654] uppercase tracking-wider mb-1 font-medium">
            <span>{product.sku}</span>
            <span className="capitalize">{product.category.replace(/-/g, ' ')}</span>
          </div>

          {/* Product Title */}
          <h3 className="font-serif-luxury text-base font-bold text-[#231F20] group-hover:text-[#722F37] transition-colors line-clamp-1 mb-1.5">
            {product.name}
          </h3>

          {/* Color Indicators */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex items-center space-x-1 mb-2.5">
              {product.colors.slice(0, 4).map((c, i) => (
                <span
                  key={i}
                  className="w-2.5 h-2.5 rounded-full border border-gray-300"
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                />
              ))}
              {product.colors.length > 4 && (
                <span className="text-[10px] text-[#8C7654]">+{product.colors.length - 4}</span>
              )}
            </div>
          )}
        </div>

        {/* Price & Action Area */}
        <div className="pt-2 border-t border-[#F5EFEB] flex items-center justify-between mt-auto">
          <div>
            <div className="flex items-baseline space-x-2">
              <span className="font-serif-luxury text-base sm:text-lg font-bold text-[#722F37]">
                {formatPrice(currentPrice)}
              </span>
              {isOnSale && (
                <span className="text-xs text-[#9E9892] line-through font-normal">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>
          </div>

          {/* Add to Cart Quick Button */}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`p-2.5 rounded-xl transition-all shadow-sm active:scale-90 flex items-center justify-center ${
              isAdded
                ? 'bg-[#25D366] text-white'
                : product.stock === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-[#722F37] hover:bg-[#501F25] text-[#F4E8C1]'
            }`}
            title={product.stock === 0 ? 'Out of stock' : 'Add to Bag'}
          >
            {isAdded ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};

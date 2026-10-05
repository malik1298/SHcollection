import React, { useState, useEffect } from 'react';
import { Product } from '../../types/index.js';
import { api } from '../../lib/api.js';
import { useSettings } from '../../context/SettingsContext.js';
import { useCart } from '../../context/CartContext.js';
import { useWishlist } from '../../context/WishlistContext.js';
import { ProductCard } from '../../components/common/ProductCard.js';
import {
  ArrowLeft,
  ShoppingBag,
  Heart,
  MessageCircle,
  Truck,
  ShieldCheck,
  Ruler,
  Check,
  Play,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Share2
} from 'lucide-react';

interface ProductDetailPageProps {
  product: Product;
  onBack: () => void;
  onNavigate: (page: string, params?: Record<string, any>) => void;
  onSelectProduct: (product: Product) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  onBack,
  onNavigate,
  onSelectProduct,
}) => {
  const { formatPrice, getWhatsAppUrl } = useSettings();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isVideoActive, setIsVideoActive] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes?.[0] || 'Standard');
  const [selectedColor, setSelectedColor] = useState<string>(product.colors?.[0]?.name || 'Default');
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string>('fabric');
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    setActiveImageIndex(0);
    setIsVideoActive(false);
    setSelectedSize(product.sizes?.[0] || 'Standard');
    setSelectedColor(product.colors?.[0]?.name || 'Default');
    setQuantity(1);

    // Fetch related products
    api
      .getProducts({ category: product.category })
      .then((data) => {
        setRelatedProducts(data.filter((p) => p.id !== product.id && p.published).slice(0, 4));
      })
      .catch((err) => console.error('Failed to load related:', err));

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [product]);

  const validImages = (product.images || []).filter((img) => img && typeof img === 'string' && img.trim() !== '');
  const images = validImages.length > 0
    ? validImages
    : ['https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=1200&q=85'];

  const hasVideo = product.videos && product.videos.length > 0;
  const isOnSale = product.saleEnabled && product.salePercentage > 0;
  const currentPrice = isOnSale ? product.salePrice : product.price;
  const isFavorited = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedSize, selectedColor);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedSize, selectedColor);
    onNavigate('checkout');
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const whatsappMessage = `Hello SH Collection! I am interested in placing an inquiry for:
*${product.name}*
SKU: ${product.sku}
Size: ${selectedSize}
Color: ${selectedColor}
Quantity: ${quantity}
Price: ${formatPrice(currentPrice * quantity)}
Please provide customization and delivery timeline details.`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Top Bar: Back & Breadcrumb */}
      <div className="flex items-center justify-between pb-4 border-b border-[#E8DFC9]">
        <button
          onClick={onBack}
          className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-[#722F37] hover:text-[#501F25] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Collection</span>
        </button>

        <div className="flex items-center space-x-2 text-xs text-[#8C7654]">
          <button onClick={() => onNavigate('home')} className="hover:text-[#722F37]">
            Home
          </button>
          <span>/</span>
          <button onClick={() => onNavigate('products')} className="hover:text-[#722F37]">
            Catalog
          </button>
          <span>/</span>
          <span className="text-[#231F20] font-semibold line-clamp-1 max-w-[200px]">
            {product.name}
          </span>
        </div>
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Interactive Visuals Gallery (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Stage Image / Video */}
          <div className="relative aspect-[3/4] rounded-3xl overflow-hidden bg-[#F5EFEB] border border-[#E8DFC9] shadow-md group">
            {isVideoActive && hasVideo && product.videos[0] ? (
              <video
                src={product.videos[0]}
                controls
                autoPlay
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src={images[activeImageIndex]}
                alt={product.name}
                className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
              />
            )}

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
              {isOnSale && (
                <span className="bg-[#722F37] text-[#F4E8C1] text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-lg">
                  {product.salePercentage}% OFF SALE
                </span>
              )}
              {product.availability === 'made_to_order' && (
                <span className="bg-[#231F20]/80 backdrop-blur-md text-[#F4E8C1] text-xs font-medium uppercase tracking-wider px-3 py-1 rounded-full shadow">
                  Bespoke Bridal Tailoring
                </span>
              )}
            </div>

            {/* Wishlist Floating */}
            <button
              onClick={() => toggleWishlist(product)}
              className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-md shadow-lg transition-transform active:scale-90 ${
                isFavorited
                  ? 'bg-[#722F37] text-white'
                  : 'bg-white/80 text-[#231F20] hover:bg-white'
              }`}
              title="Add to Wishlist"
            >
              <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Thumbnails Row */}
          <div className="flex items-center space-x-3 overflow-x-auto pb-2 scrollbar-none">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setActiveImageIndex(idx);
                  setIsVideoActive(false);
                }}
                className={`w-20 h-24 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                  activeImageIndex === idx && !isVideoActive
                    ? 'border-[#722F37] ring-2 ring-[#722F37]/30 scale-105'
                    : 'border-[#E8DFC9] opacity-75 hover:opacity-100'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover object-top" />
              </button>
            ))}

            {hasVideo && (
              <button
                onClick={() => setIsVideoActive(true)}
                className={`w-20 h-24 rounded-xl border-2 shrink-0 flex flex-col items-center justify-center bg-[#2A1215] text-[#F4E8C1] transition-all ${
                  isVideoActive
                    ? 'border-[#D4AF37] ring-2 ring-[#D4AF37]/40 scale-105'
                    : 'border-[#E8DFC9] opacity-80'
                }`}
              >
                <Play className="w-6 h-6 text-[#D4AF37] fill-[#D4AF37]" />
                <span className="text-[10px] font-bold uppercase mt-1">Video</span>
              </button>
            )}
          </div>
        </div>

        {/* Right Column: Specification & Purchase Controls (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <div className="flex items-center justify-between text-xs text-[#8C7654] uppercase tracking-wider mb-2 font-semibold">
              <span>SKU: {product.sku}</span>
              <span className="capitalize">{product.category.replace(/-/g, ' ')}</span>
            </div>

            <h1 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-[#231F20] leading-tight mb-3">
              {product.name}
            </h1>

            {/* Price Presentation */}
            <div className="flex items-baseline space-x-4 mb-4">
              <span className="font-serif-luxury text-3xl font-bold text-[#722F37]">
                {formatPrice(currentPrice)}
              </span>
              {isOnSale && (
                <>
                  <span className="text-base text-[#9E9892] line-through font-normal">
                    {formatPrice(product.price)}
                  </span>
                  <span className="bg-[#722F37] text-[#F4E8C1] text-xs font-bold px-2.5 py-0.5 rounded-full">
                    Save {formatPrice(product.price - product.salePrice)} ({product.salePercentage}% OFF)
                  </span>
                </>
              )}
            </div>

            {/* Stock / Availability Status */}
            <div className="flex items-center space-x-2 text-xs mb-6">
              <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
              <span className="font-medium text-[#231F20]">
                {product.availability === 'in_stock'
                  ? 'Ready to Dispatch (Flagship Studio Inventory)'
                  : product.availability === 'made_to_order'
                  ? 'Made-to-Measure Bridal Bespoke (3-5 Weeks Handcrafting)'
                  : 'Pre-Order / Upcoming Stitching Slot'}
              </span>
            </div>

            <p className="text-xs text-[#5A5550] leading-relaxed mb-6">
              {product.description}
            </p>
          </div>

          {/* Color Selection */}
          {product.colors && product.colors.length > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-semibold uppercase tracking-wider text-[#231F20]">
                <span>Color Tone: <span className="text-[#722F37]">{selectedColor}</span></span>
              </div>
              <div className="flex items-center space-x-3">
                {product.colors.map((c, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSelectedColor(c.name)}
                    className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl border text-xs transition-all ${
                      selectedColor === c.name
                        ? 'border-[#722F37] bg-[#722F37]/5 text-[#722F37] font-bold shadow-sm'
                        : 'border-[#E8DFC9] text-[#5A5550] hover:border-[#722F37]'
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-black/20"
                      style={{ backgroundColor: c.hex }}
                    />
                    <span>{c.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size Selection & Sizing Guide */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold uppercase tracking-wider text-[#231F20]">
                  Select Sizing:
                </span>
                <button
                  type="button"
                  onClick={() => setShowSizeGuide(true)}
                  className="text-[#722F37] hover:underline font-semibold flex items-center space-x-1"
                >
                  <Ruler className="w-3.5 h-3.5" />
                  <span>Bridal Sizing Chart</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSelectedSize(s)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                      selectedSize === s
                        ? 'bg-[#722F37] text-[#F4E8C1] border-[#722F37] shadow-md'
                        : 'bg-white text-[#231F20] border-[#E8DFC9] hover:border-[#722F37]'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#231F20] block">
              Quantity:
            </span>
            <div className="inline-flex items-center border border-[#E8DFC9] rounded-xl bg-white p-1">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 rounded-lg hover:bg-[#F5EFEB] text-[#722F37] font-bold text-sm flex items-center justify-center transition-colors"
              >
                -
              </button>
              <span className="px-4 text-xs font-bold text-[#231F20]">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 rounded-lg hover:bg-[#F5EFEB] text-[#722F37] font-bold text-sm flex items-center justify-center transition-colors"
              >
                +
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-4 border-t border-[#E8DFC9]">
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={handleAddToCart}
                className={`flex-1 py-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md hover:shadow-lg flex items-center justify-center space-x-2 active:scale-95 ${
                  isAdded
                    ? 'bg-[#25D366] text-white'
                    : 'bg-[#722F37] hover:bg-[#501F25] text-[#F4E8C1]'
                }`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Shopping Bag</span>
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
                onClick={handleBuyNow}
                className="flex-1 py-4 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#231F20] hover:bg-[#3D1A1F] text-[#F4E8C1] transition-all shadow-md active:scale-95 flex items-center justify-center space-x-2"
              >
                <span>Buy Now (Instant Checkout)</span>
              </button>
            </div>

            {/* Direct WhatsApp Consultation Button */}
            <a
              href={getWhatsAppUrl(whatsappMessage)}
              target="_blank"
              rel="noreferrer"
              className="w-full py-3.5 bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center space-x-2 active:scale-95"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Inquire & Customize on WhatsApp</span>
            </a>

            {/* Share link button */}
            <button
              type="button"
              onClick={handleShare}
              className="w-full py-2.5 text-xs text-[#8C7654] hover:text-[#722F37] flex items-center justify-center space-x-1.5 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copiedLink ? 'Link Copied to Clipboard!' : 'Share This Bridal Ensemble'}</span>
            </button>
          </div>

          {/* Accordion Tabs */}
          <div className="pt-4 border-t border-[#E8DFC9] space-y-3">
            {/* Accordion 1: Fabric & Craftsmanship */}
            <div className="border border-[#E8DFC9] rounded-xl overflow-hidden bg-white">
              <button
                type="button"
                onClick={() => setOpenAccordion(openAccordion === 'fabric' ? '' : 'fabric')}
                className="w-full p-4 text-left font-serif-luxury text-sm font-bold text-[#231F20] flex items-center justify-between"
              >
                <span>Fabric & Artisan Craftsmanship</span>
                {openAccordion === 'fabric' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {openAccordion === 'fabric' && (
                <div className="p-4 pt-0 text-xs text-[#5A5550] space-y-2 leading-relaxed border-t border-[#F5EFEB]">
                  <p>• <strong>Shirt/Gown:</strong> Pure 80g raw silk / silk organza hand-embellished with tilla, kora, dabka and micro-swarovski crystals.</p>
                  <p>• <strong>Dupatta:</strong> 3.25-yard pure silk organza with four-sided handcrafted scalloped border and floral spray.</p>
                  <p>• <strong>Pants/Lehnga:</strong> Flared brocade banarsi or pure raw silk lined with silk crepe for ethereal movement.</p>
                  <p>• <strong>Care:</strong> Dry clean only in luxury textile solvents. Preserve in moisture-resistant muslin garment bag.</p>
                </div>
              )}
            </div>

            {/* Accordion 2: Bridal Fittings & Measurements */}
            <div className="border border-[#E8DFC9] rounded-xl overflow-hidden bg-white">
              <button
                type="button"
                onClick={() => setOpenAccordion(openAccordion === 'fitting' ? '' : 'fitting')}
                className="w-full p-4 text-left font-serif-luxury text-sm font-bold text-[#231F20] flex items-center justify-between"
              >
                <span>Custom Stitching & Atelier Concierge</span>
                {openAccordion === 'fitting' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {openAccordion === 'fitting' && (
                <div className="p-4 pt-0 text-xs text-[#5A5550] space-y-2 leading-relaxed border-t border-[#F5EFEB]">
                  <p>When selecting <strong>Custom Bridal Stitching</strong>, our senior master tailor will reach out to you via WhatsApp to collect your exact 14-point body measurements.</p>
                  <p>Neckline depth, sleeve length, gown trailing length, and bridal lining opacity are 100% customizable upon request without supplementary charges.</p>
                </div>
              )}
            </div>

            {/* Accordion 3: Courier & White-Glove Delivery */}
            <div className="border border-[#E8DFC9] rounded-xl overflow-hidden bg-white">
              <button
                type="button"
                onClick={() => setOpenAccordion(openAccordion === 'shipping' ? '' : 'shipping')}
                className="w-full p-4 text-left font-serif-luxury text-sm font-bold text-[#231F20] flex items-center justify-between"
              >
                <span>White-Glove Delivery & Returns</span>
                {openAccordion === 'shipping' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {openAccordion === 'shipping' && (
                <div className="p-4 pt-0 text-xs text-[#5A5550] space-y-2 leading-relaxed border-t border-[#F5EFEB]">
                  <p>• Ready-to-wear pieces dispatch within 2-4 business days.</p>
                  <p>• Bespoke bridal orders require 3-5 weeks tailoring time.</p>
                  <p>• Delivered in our luxury velvet-trimmed SH Collection bridal trunk box with satin hanger.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Sizing Chart Modal */}
      {showSizeGuide && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full border border-[#D4AF37] shadow-2xl relative">
            <button
              onClick={() => setShowSizeGuide(false)}
              className="absolute top-4 right-4 p-2 text-[#722F37] hover:bg-[#F5EFEB] rounded-full"
            >
              ✕
            </button>
            <div className="mb-4">
              <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold">
                Fit & Specification
              </span>
              <h3 className="font-serif-luxury text-2xl font-bold text-[#722F37]">
                Bridal Couture Size Chart (Inches)
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#722F37] text-white">
                  <tr>
                    <th className="p-2.5">Size</th>
                    <th className="p-2.5">Chest</th>
                    <th className="p-2.5">Waist</th>
                    <th className="p-2.5">Hip</th>
                    <th className="p-2.5">Length</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr><td className="p-2.5 font-bold">XS</td><td className="p-2.5">34"</td><td className="p-2.5">26"</td><td className="p-2.5">36"</td><td className="p-2.5">58"</td></tr>
                  <tr><td className="p-2.5 font-bold">S</td><td className="p-2.5">36"</td><td className="p-2.5">28"</td><td className="p-2.5">38"</td><td className="p-2.5">58"</td></tr>
                  <tr><td className="p-2.5 font-bold">M</td><td className="p-2.5">39"</td><td className="p-2.5">31"</td><td className="p-2.5">41"</td><td className="p-2.5">59"</td></tr>
                  <tr><td className="p-2.5 font-bold">L</td><td className="p-2.5">42"</td><td className="p-2.5">34"</td><td className="p-2.5">44"</td><td className="p-2.5">60"</td></tr>
                  <tr><td className="p-2.5 font-bold">XL</td><td className="p-2.5">45"</td><td className="p-2.5">38"</td><td className="p-2.5">48"</td><td className="p-2.5">60"</td></tr>
                  <tr className="bg-[#F5EFEB]"><td className="p-2.5 font-bold text-[#722F37]" colSpan={5}>Custom Stitching: Made to your exact individual body measurements.</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="pt-12 border-t border-[#E8DFC9]">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold">
                Harmonious Pairings
              </span>
              <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#231F20]">
                Related Bridal Formals
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onSelect={onSelectProduct}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

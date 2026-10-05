import React, { useState, useEffect } from 'react';
import { Product, Category } from '../../types/index.js';
import { useSettings } from '../../context/SettingsContext.js';
import { api } from '../../lib/api.js';
import { ProductCard } from '../../components/common/ProductCard.js';
import { QuickViewModal } from '../../components/common/QuickViewModal.js';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Scissors,
  Gem,
  Truck,
  MessageCircle,
  ChevronRight,
  Flame
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: string, params?: Record<string, any>) => void;
  onSelectProduct: (product: Product) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onSelectProduct }) => {
  const { settings, getWhatsAppUrl } = useSettings();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getProducts(), api.getCategories()])
      .then(([prods, cats]) => {
        setProducts(prods);
        setCategories(cats);
      })
      .catch((err) => console.error('Failed to load home data:', err))
      .finally(() => setLoading(false));
  }, []);

  const featuredProducts = products.filter((p) => p.featured && p.published).slice(0, 4);
  const newArrivals = products.filter((p) => p.newArrival && p.published).slice(0, 4);
  const saleProducts = products.filter((p) => (p.isSale || p.saleEnabled) && p.published).slice(0, 4);
  const bridalCouture = products.filter((p) => p.category === 'bridal-couture' && p.published).slice(0, 4);

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] lg:min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Dynamic Background Image (Admin Editable) */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 transform scale-105"
          style={{
            backgroundImage: `url('${settings.heroImage || 'https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=1920&q=85'}')`,
          }}
        />

        {/* Regal Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#2A0F14]/90 via-[#40161E]/75 to-black/80" />

        {/* Gold Border Ornament */}
        <div className="absolute inset-4 sm:inset-8 border border-[#D4AF37]/30 pointer-events-none rounded-3xl" />

        {/* Hero Content */}
        <div className="relative max-w-5xl mx-auto px-6 py-20 text-center text-white space-y-6 z-10">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#722F37]/80 border border-[#D4AF37]/60 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#F4E8C1] font-semibold">
              The Imperial Bridal Season 2026
            </span>
          </div>

          <h1 className="font-serif-luxury text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-[#FDFBF7] leading-[1.15]">
            {settings.heroTitle || 'Regal Elegance for Your Special Day'}
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-[#E8DFC9] font-light leading-relaxed">
            {settings.heroSubtitle ||
              'Discover handcrafted bridal couture, zardozi masterworks, and ethereal silhouettes meticulously tailored to make your wedding unforgettable.'}
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onNavigate('products')}
              className="w-full sm:w-auto px-8 py-4 bg-[#722F37] hover:bg-[#501F25] text-[#F4E8C1] border border-[#D4AF37]/50 text-xs uppercase tracking-widest font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center space-x-2"
            >
              <span>{settings.heroButtonText || 'Explore Bridal Collection'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('sale')}
              className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md text-[#F4E8C1] border border-[#F4E8C1]/40 text-xs uppercase tracking-widest font-semibold rounded-xl transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center space-x-2"
            >
              <Flame className="w-4 h-4 text-[#D4AF37]" />
              <span>{settings.heroSaleButtonText || 'View Festive Sale'}</span>
            </button>
          </div>
        </div>

        {/* Subtle scroll cue */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-2 text-[#D4AF37] opacity-75">
          <span className="text-[10px] uppercase tracking-widest">Scroll To Explore</span>
          <div className="w-4 h-7 border border-[#D4AF37] rounded-full flex justify-center pt-1">
            <div className="w-1 h-2 bg-[#D4AF37] rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* Categories Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs uppercase tracking-[0.2em] text-[#D4AF37] font-semibold">
            Bespoke Portfolios
          </span>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-[#231F20]">
            Explore by Silhouette & Edit
          </h2>
          <div className="w-20 h-0.5 bg-[#D4AF37] mx-auto mt-2" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onNavigate('products', { category: cat.slug })}
              className="group relative rounded-2xl overflow-hidden aspect-[3/4] bg-[#2A1215] shadow-sm hover:shadow-xl transition-all transform hover:-translate-y-1 text-left"
            >
              <img
                src={cat.image || 'https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=400&q=80'}
                alt={cat.name}
                className="w-full h-full object-cover object-top opacity-85 group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent group-hover:from-[#722F37]/90 transition-colors" />

              <div className="absolute bottom-3 left-3 right-3 text-white">
                <span className="text-[10px] text-[#D4AF37] uppercase font-semibold tracking-wider block">
                  {cat.count || 0} Outfits
                </span>
                <h3 className="font-serif-luxury text-sm font-bold leading-tight group-hover:text-[#F4E8C1] transition-colors">
                  {cat.name}
                </h3>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Featured Bridal Ensembles */}
      {featuredProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-[#E8DFC9]">
            <div>
              <span className="text-xs uppercase tracking-[0.2em] text-[#D4AF37] font-semibold">
                Curated Haute Couture
              </span>
              <h2 className="font-serif-luxury text-3xl font-bold text-[#231F20]">
                Featured Masterpieces
              </h2>
            </div>
            <button
              onClick={() => onNavigate('products', { featuredOnly: true })}
              className="mt-3 sm:mt-0 text-xs font-semibold uppercase tracking-wider text-[#722F37] hover:text-[#501F25] flex items-center space-x-1 group"
            >
              <span>View All Featured</span>
              <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((prod) => (
              <ProductCard
                key={prod.id}
                product={prod}
                onSelect={onSelectProduct}
                onQuickView={setQuickViewProduct}
              />
            ))}
          </div>
        </section>
      )}

      {/* Royal Bridal Couture Banner & Section */}
      {bridalCouture.length > 0 && (
        <section className="bg-[#FAF6F0] py-16 border-y border-[#E8DFC9]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-10">
              <div className="space-y-2">
                <span className="text-xs uppercase tracking-[0.2em] text-[#722F37] font-semibold">
                  Imperial Barat & Walima Ensembles
                </span>
                <h2 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-[#231F20]">
                  The Royal Bridal Collection
                </h2>
                <p className="text-xs text-[#5A5550] max-w-xl">
                  Each bridal silhouette represents hundreds of hours of delicate hand-embroidered craftsmanship with resham, dabka, naqshi, and swarovski accents.
                </p>
              </div>
              <button
                onClick={() => onNavigate('products', { category: 'bridal-couture' })}
                className="mt-4 md:mt-0 px-6 py-2.5 bg-[#722F37] text-[#F4E8C1] text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-[#501F25] transition-all shadow-sm"
              >
                Explore All Bridals
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {bridalCouture.map((prod) => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  onSelect={onSelectProduct}
                  onQuickView={setQuickViewProduct}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Sale Highlights Section */}
      {saleProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 rounded-3xl bg-gradient-to-r from-[#722F37] via-[#501F25] to-[#3D141A] text-white shadow-xl mb-10 relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-center md:text-left">
                <span className="inline-block px-3 py-1 rounded-full bg-[#D4AF37] text-[#231F20] text-[10px] font-bold uppercase tracking-wider">
                  Limited Time Bridal Promotion
                </span>
                <h2 className="font-serif-luxury text-3xl md:text-4xl font-bold text-[#FDFBF7]">
                  The Festive Bridal Sale Collection
                </h2>
                <p className="text-xs text-[#F4E8C1] max-w-lg">
                  Enjoy exclusive bridal privileges with complimentary white-glove custom fitting consultations and up to 25% off selected formals.
                </p>
              </div>
              <button
                onClick={() => onNavigate('sale')}
                className="px-8 py-3.5 bg-[#F4E8C1] hover:bg-white text-[#722F37] text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-md shrink-0"
              >
                Shop Sale Gallery
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {saleProducts.map((prod) => (
              <ProductCard
                key={prod.id}
                product={prod}
                onSelect={onSelectProduct}
                onQuickView={setQuickViewProduct}
              />
            ))}
          </div>
        </section>
      )}

      {/* New Arrivals Section */}
      {newArrivals.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-[#E8DFC9]">
            <div>
              <span className="text-xs uppercase tracking-[0.2em] text-[#D4AF37] font-semibold">
                Just Unveiled
              </span>
              <h2 className="font-serif-luxury text-3xl font-bold text-[#231F20]">
                New Bridal Arrivals
              </h2>
            </div>
            <button
              onClick={() => onNavigate('products', { newArrivals: true })}
              className="mt-3 sm:mt-0 text-xs font-semibold uppercase tracking-wider text-[#722F37] hover:text-[#501F25] flex items-center space-x-1 group"
            >
              <span>View All New Drops</span>
              <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newArrivals.map((prod) => (
              <ProductCard
                key={prod.id}
                product={prod}
                onSelect={onSelectProduct}
                onQuickView={setQuickViewProduct}
              />
            ))}
          </div>
        </section>
      )}

      {/* Why Choose SH Collection */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs uppercase tracking-[0.2em] text-[#D4AF37] font-semibold">
            The Atelier Standard
          </span>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-[#231F20]">
            Why Brides Entrust SH Collection
          </h2>
          <div className="w-20 h-0.5 bg-[#D4AF37] mx-auto mt-2" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="p-8 bg-white rounded-3xl border border-[#E8DFC9] shadow-sm hover:shadow-lg transition-all text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-[#F5EFEB] text-[#722F37] flex items-center justify-center shadow-inner">
              <Gem className="w-7 h-7" />
            </div>
            <h3 className="font-serif-luxury text-lg font-bold text-[#231F20]">
              Heritage Hand Embroidery
            </h3>
            <p className="text-xs text-[#5A5550] leading-relaxed">
              Every motif is painstakingly hand-worked by master artisans using authentic zardozi, kora, dabka, and real swarovski crystals.
            </p>
          </div>

          <div className="p-8 bg-white rounded-3xl border border-[#E8DFC9] shadow-sm hover:shadow-lg transition-all text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-[#F5EFEB] text-[#722F37] flex items-center justify-center shadow-inner">
              <Scissors className="w-7 h-7" />
            </div>
            <h3 className="font-serif-luxury text-lg font-bold text-[#231F20]">
              Bespoke Made-To-Measure
            </h3>
            <p className="text-xs text-[#5A5550] leading-relaxed">
              Tailored precisely to your silhouette with custom neckline, sleeve styling, and dupatta drape adjustments for your wedding day.
            </p>
          </div>

          <div className="p-8 bg-white rounded-3xl border border-[#E8DFC9] shadow-sm hover:shadow-lg transition-all text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-[#F5EFEB] text-[#722F37] flex items-center justify-center shadow-inner">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h3 className="font-serif-luxury text-lg font-bold text-[#231F20]">
              100% Pure Silk & Textiles
            </h3>
            <p className="text-xs text-[#5A5550] leading-relaxed">
              We exclusively utilize the finest pure raw silk, organza, silk tissue, and French micro velvet to guarantee heirloom longevity.
            </p>
          </div>

          <div className="p-8 bg-white rounded-3xl border border-[#E8DFC9] shadow-sm hover:shadow-lg transition-all text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-[#F5EFEB] text-[#722F37] flex items-center justify-center shadow-inner">
              <Truck className="w-7 h-7" />
            </div>
            <h3 className="font-serif-luxury text-lg font-bold text-[#231F20]">
              White-Glove Global Shipping
            </h3>
            <p className="text-xs text-[#5A5550] leading-relaxed">
              Complimentary expedited courier with premium bridal garment bag packaging, direct insurance, and door-to-door tracking.
            </p>
          </div>
        </div>
      </section>

      {/* WhatsApp VIP Concierge Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#2A1215] text-[#F9F6F0] rounded-3xl p-8 sm:p-12 border-2 border-[#D4AF37] relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8 shadow-2xl">
          <div className="space-y-3 text-center lg:text-left z-10">
            <div className="inline-flex items-center space-x-2 text-xs font-semibold text-[#D4AF37] uppercase tracking-widest">
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
              <span>Personalized Bridal Stylist Consultation</span>
            </div>
            <h2 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-[#F4E8C1]">
              Need Assistance Selecting Your Bridal Look?
            </h2>
            <p className="text-xs text-[#E8DFC9] max-w-xl">
              Connect directly with our senior bridal consultants on WhatsApp for video consultations, swatch samples, custom colorways, and fitting assistance.
            </p>
          </div>

          <div className="z-10 shrink-0 flex flex-col sm:flex-row gap-3">
            <a
              href={getWhatsAppUrl('Hello SH Collection! I would like to schedule a bridal consultation with your stylist.')}
              target="_blank"
              rel="noreferrer"
              className="px-8 py-4 bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-xl hover:shadow-2xl flex items-center justify-center space-x-2 active:scale-95"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat With Stylist On WhatsApp</span>
            </a>
            <button
              onClick={() => onNavigate('contact')}
              className="px-6 py-4 bg-[#3D1A1F] hover:bg-[#501F25] text-[#F4E8C1] border border-[#D4AF37]/40 text-xs font-semibold uppercase tracking-widest rounded-xl transition-all"
            >
              Visit Flagship Studio
            </button>
          </div>
        </div>
      </section>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onViewDetails={(prod) => {
          setQuickViewProduct(null);
          onSelectProduct(prod);
        }}
      />
    </div>
  );
};

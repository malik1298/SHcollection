import React, { useState, useEffect } from 'react';
import { Product } from '../../types/index.js';
import { api } from '../../lib/api.js';
import { ProductCard } from '../../components/common/ProductCard.js';
import { QuickViewModal } from '../../components/common/QuickViewModal.js';
import { Flame, Sparkles, ArrowRight, Percent } from 'lucide-react';

interface SalePageProps {
  onSelectProduct: (product: Product) => void;
  onNavigate: (page: string, params?: Record<string, any>) => void;
}

export const SalePage: React.FC<SalePageProps> = ({ onSelectProduct, onNavigate }) => {
  const [saleProducts, setSaleProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [discountFilter, setDiscountFilter] = useState<number>(0);

  useEffect(() => {
    api
      .getProducts({ saleOnly: true })
      .then((data) => {
        setSaleProducts(data.filter((p) => p.published && (p.saleEnabled || p.isSale)));
      })
      .catch((err) => console.error('Failed to load sale items:', err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = saleProducts.filter((p) => {
    if (discountFilter === 0) return true;
    return (p.salePercentage || 0) >= discountFilter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#501F25] via-[#722F37] to-[#3D141A] p-8 sm:p-12 text-white border-2 border-[#D4AF37] shadow-xl">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#D4AF37] text-[#231F20] text-xs font-bold uppercase tracking-wider">
            <Flame className="w-3.5 h-3.5" />
            <span>Festive Season Privilege</span>
          </div>

          <h1 className="font-serif-luxury text-4xl sm:text-5xl font-bold tracking-tight text-[#FDFBF7]">
            The Festive Bridal Sale Collection
          </h1>

          <p className="text-xs sm:text-sm text-[#F4E8C1] leading-relaxed">
            Exclusively discounted handcrafted bridal ensembles, embellished velvet ghararas, and luxury raw silk wedding formals with complimentary white-glove custom fitting.
          </p>

          {/* Discount Quick Pills */}
          <div className="pt-2 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-[#F4E8C1] mr-1">Filter Discount:</span>
            {[
              { label: 'All Sale Outfits', value: 0 },
              { label: '10% & Above', value: 10 },
              { label: '15% & Above', value: 15 },
              { label: '20% & Above', value: 20 },
              { label: '25% & Above', value: 25 },
            ].map((tier) => (
              <button
                key={tier.value}
                onClick={() => setDiscountFilter(tier.value)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  discountFilter === tier.value
                    ? 'bg-[#F4E8C1] text-[#722F37] shadow-md'
                    : 'bg-white/10 hover:bg-white/20 text-[#FDFBF7]'
                }`}
              >
                {tier.label}
              </button>
            ))}
          </div>
        </div>

        {/* Decorative Watermark */}
        <div className="absolute -right-12 -bottom-12 opacity-10 pointer-events-none">
          <Percent className="w-96 h-96 text-[#D4AF37]" />
        </div>
      </div>

      {/* Sale Items Grid */}
      <div>
        <div className="flex items-center justify-between mb-8 pb-3 border-b border-[#E8DFC9]">
          <h2 className="font-serif-luxury text-2xl font-bold text-[#231F20]">
            Sale Ensembles ({filtered.length})
          </h2>
          <span className="text-xs text-[#8C7654] uppercase tracking-wider">
            Live Automatic Savings Applied
          </span>
        </div>

        {filtered.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-[#E8DFC9] shadow-sm space-y-4">
            <Flame className="w-12 h-12 text-[#D4AF37] mx-auto opacity-70" />
            <h3 className="font-serif-luxury text-2xl font-bold text-[#231F20]">
              No Sale Outfits in This Discount Tier
            </h3>
            <p className="text-xs text-[#5A5550] max-w-sm mx-auto">
              Please check other discount tiers or browse our entire bridal couture collection.
            </p>
            <button
              onClick={() => setDiscountFilter(0)}
              className="px-6 py-2.5 bg-[#722F37] text-[#F4E8C1] text-xs font-semibold uppercase tracking-wider rounded-xl hover:bg-[#501F25] transition-all"
            >
              Reset Discount Filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filtered.map((prod) => (
              <ProductCard
                key={prod.id}
                product={prod}
                onSelect={onSelectProduct}
                onQuickView={setQuickViewProduct}
              />
            ))}
          </div>
        )}
      </div>

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

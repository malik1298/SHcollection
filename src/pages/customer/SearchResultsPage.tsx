import React, { useState, useEffect } from 'react';
import { Product } from '../../types/index.js';
import { api } from '../../lib/api.js';
import { ProductCard } from '../../components/common/ProductCard.js';
import { QuickViewModal } from '../../components/common/QuickViewModal.js';
import { Search, ArrowLeft } from 'lucide-react';

interface SearchResultsPageProps {
  query: string;
  onSelectProduct: (product: Product) => void;
  onNavigate: (page: string, params?: Record<string, any>) => void;
}

export const SearchResultsPage: React.FC<SearchResultsPageProps> = ({
  query,
  onSelectProduct,
  onNavigate,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(query);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  useEffect(() => {
    setSearchTerm(query);
    api
      .getProducts()
      .then((data) => setProducts(data.filter((p) => p.published)))
      .catch((err) => console.error('Failed to load search products:', err))
      .finally(() => setLoading(false));
  }, [query]);

  const results = products.filter((p) => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q)
    );
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Breadcrumb */}
      <div>
        <button
          onClick={() => onNavigate('home')}
          className="inline-flex items-center space-x-1.5 text-xs font-semibold uppercase tracking-wider text-[#722F37] hover:underline mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </button>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-[#231F20]">
              Search Results
            </h1>
            <p className="text-xs text-[#5A5550] mt-1">
              Found <strong className="text-[#722F37]">{results.length} Outfits</strong> for query "{searchTerm}"
            </p>
          </div>

          <form onSubmit={handleSearchSubmit} className="relative min-w-[280px]">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Refine search..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E8DFC9] rounded-xl text-xs text-[#231F20] focus:outline-none focus:ring-1 focus:ring-[#722F37]"
            />
            <Search className="w-4 h-4 text-[#8C7654] absolute left-3 top-1/2 -translate-y-1/2" />
          </form>
        </div>
      </div>

      {results.length === 0 ? (
        <div className="bg-white rounded-3xl border border-[#E8DFC9] p-16 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 mx-auto rounded-full bg-[#F5EFEB] flex items-center justify-center text-[#8C7654]">
            <Search className="w-8 h-8 opacity-60" />
          </div>
          <h2 className="font-serif-luxury text-2xl font-bold text-[#231F20]">
            No Products Found
          </h2>
          <p className="text-xs text-[#5A5550] max-w-sm mx-auto">
            We could not find any bridal or formal dresses matching "{searchTerm}". Try searching for categories like "Barat", "Lehnga", "Velvet", or "Gown".
          </p>
          <button
            onClick={() => onNavigate('products')}
            className="px-6 py-2.5 bg-[#722F37] text-[#F4E8C1] text-xs font-semibold uppercase tracking-wider rounded-xl hover:bg-[#501F25] transition-all shadow-md"
          >
            Browse Full Bridal Catalog
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {results.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onSelect={onSelectProduct}
              onQuickView={setQuickViewProduct}
            />
          ))}
        </div>
      )}

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

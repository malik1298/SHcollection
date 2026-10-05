import React, { useState, useEffect, useMemo } from 'react';
import { Product, Category, FilterOptions } from '../../types/index.js';
import { api } from '../../lib/api.js';
import { useSettings } from '../../context/SettingsContext.js';
import { useWishlist } from '../../context/WishlistContext.js';
import { ProductCard } from '../../components/common/ProductCard.js';
import { QuickViewModal } from '../../components/common/QuickViewModal.js';
import {
  SlidersHorizontal,
  X,
  Search,
  ChevronDown,
  RotateCcw,
  Sparkles,
  Heart
} from 'lucide-react';

interface ProductsPageProps {
  initialCategory?: string;
  initialSearch?: string;
  initialSaleOnly?: boolean;
  initialNewOnly?: boolean;
  initialWishlistOnly?: boolean;
  onSelectProduct: (product: Product) => void;
  onNavigate: (page: string, params?: Record<string, any>) => void;
}

export const ProductsPage: React.FC<ProductsPageProps> = ({
  initialCategory,
  initialSearch = '',
  initialSaleOnly = false,
  initialNewOnly = false,
  initialWishlistOnly = false,
  onSelectProduct,
  onNavigate,
}) => {
  const { formatPrice } = useSettings();
  const { wishlistIds } = useWishlist();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Filters State
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'all');
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [saleOnly, setSaleOnly] = useState(initialSaleOnly);
  const [newOnly, setNewOnly] = useState(initialNewOnly);
  const [wishlistOnly, setWishlistOnly] = useState(initialWishlistOnly);
  const [selectedSize, setSelectedSize] = useState<string>('all');
  const [selectedColor, setSelectedColor] = useState<string>('all');
  const [selectedAvailability, setSelectedAvailability] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<number>(350000);
  const [sortBy, setSortBy] = useState<FilterOptions['sortBy']>('popular');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  useEffect(() => {
    Promise.all([api.getProducts(), api.getCategories()])
      .then(([prods, cats]) => {
        setProducts(prods);
        setCategories(cats);
      })
      .catch((err) => console.error('Failed to load products:', err))
      .finally(() => setLoading(false));
  }, []);

  // Update initial props when changed externally
  useEffect(() => {
    if (initialCategory) setSelectedCategory(initialCategory);
    if (initialSearch) setSearchQuery(initialSearch);
    if (initialSaleOnly) setSaleOnly(true);
    if (initialNewOnly) setNewOnly(true);
    if (initialWishlistOnly) setWishlistOnly(true);
  }, [initialCategory, initialSearch, initialSaleOnly, initialNewOnly, initialWishlistOnly]);

  const allSizes = ['XS', 'S', 'M', 'L', 'XL', 'Custom Bridal Stitching'];
  const allColors = [
    { name: 'Crimson', hex: '#6B1D2F' },
    { name: 'Gold', hex: '#D4AF37' },
    { name: 'Emerald', hex: '#0B5345' },
    { name: 'Ivory', hex: '#FFFFF0' },
    { name: 'Plum', hex: '#4A154B' },
    { name: 'Rose', hex: '#B76E79' },
  ];

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => p.published)
      .filter((p) => {
        // Category
        if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;

        // Wishlist
        if (wishlistOnly && !wishlistIds.includes(p.id)) return false;

        // Sale
        if (saleOnly && !p.saleEnabled && !p.isSale) return false;

        // New Arrivals
        if (newOnly && !p.newArrival) return false;

        // Availability
        if (selectedAvailability !== 'all' && p.availability !== selectedAvailability) return false;

        // Size
        if (selectedSize !== 'all' && !p.sizes?.includes(selectedSize)) return false;

        // Color
        if (
          selectedColor !== 'all' &&
          !p.colors?.some((c) => c.name.toLowerCase().includes(selectedColor.toLowerCase()))
        ) {
          return false;
        }

        // Price
        const effectivePrice = p.saleEnabled && p.salePercentage > 0 ? p.salePrice : p.price;
        if (effectivePrice > priceRange) return false;

        // Search Query (name, sku, category, description)
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchSku = p.sku.toLowerCase().includes(q);
          const matchCat = p.category.toLowerCase().includes(q);
          const matchDesc = p.description?.toLowerCase().includes(q);
          if (!matchName && !matchSku && !matchCat && !matchDesc) return false;
        }

        return true;
      })
      .sort((a, b) => {
        const aPrice = a.saleEnabled && a.salePercentage > 0 ? a.salePrice : a.price;
        const bPrice = b.saleEnabled && b.salePercentage > 0 ? b.salePrice : b.price;

        if (sortBy === 'price-asc') return aPrice - bPrice;
        if (sortBy === 'price-desc') return bPrice - aPrice;
        if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        if (sortBy === 'sale-discount') return (b.salePercentage || 0) - (a.salePercentage || 0);
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [
    products,
    selectedCategory,
    wishlistOnly,
    wishlistIds,
    saleOnly,
    newOnly,
    selectedAvailability,
    selectedSize,
    selectedColor,
    priceRange,
    searchQuery,
    sortBy,
  ]);

  const resetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setSaleOnly(false);
    setNewOnly(false);
    setWishlistOnly(false);
    setSelectedSize('all');
    setSelectedColor('all');
    setSelectedAvailability('all');
    setPriceRange(350000);
    setSortBy('popular');
  };

  const hasActiveFilters =
    selectedCategory !== 'all' ||
    searchQuery.trim() !== '' ||
    saleOnly ||
    newOnly ||
    wishlistOnly ||
    selectedSize !== 'all' ||
    selectedColor !== 'all' ||
    selectedAvailability !== 'all' ||
    priceRange < 350000;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header & Breadcrumb */}
      <div className="mb-8">
        <div className="flex items-center space-x-2 text-xs text-[#8C7654] uppercase tracking-wider mb-2">
          <button onClick={() => onNavigate('home')} className="hover:text-[#722F37]">
            Home
          </button>
          <span>/</span>
          <span className="text-[#722F37] font-semibold">Bridal & Formal Catalog</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-[#231F20]">
              {wishlistOnly
                ? 'Your Saved Bridal Wishlist'
                : selectedCategory !== 'all'
                ? categories.find((c) => c.slug === selectedCategory)?.name || 'Bridal Collection'
                : 'Exclusive Bridal & Formal Couture'}
            </h1>
            <p className="text-xs text-[#5A5550] mt-1">
              Showing {filteredProducts.length} handcrafted luxury garments
            </p>
          </div>

          {/* Quick Search & Sort */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative min-w-[220px]">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search outfits or SKU..."
                className="w-full pl-9 pr-4 py-2 bg-white border border-[#E8DFC9] rounded-xl text-xs text-[#231F20] focus:outline-none focus:ring-1 focus:ring-[#722F37]"
              />
              <Search className="w-4 h-4 text-[#8C7654] absolute left-3 top-1/2 -translate-y-1/2" />
            </div>

            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="appearance-none bg-white border border-[#E8DFC9] rounded-xl pl-3 pr-8 py-2 text-xs font-semibold text-[#231F20] focus:outline-none focus:ring-1 focus:ring-[#722F37] cursor-pointer"
              >
                <option value="popular">Sort: Featured & Popular</option>
                <option value="newest">Sort: Newest Drops</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="sale-discount">Highest Discount</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-[#8C7654] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden px-3.5 py-2 bg-[#722F37] text-[#F4E8C1] rounded-xl text-xs font-semibold flex items-center space-x-1.5"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
            </button>
          </div>
        </div>
      </div>

      {/* Category Pills Strip */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-4 mb-8 scrollbar-none border-b border-[#E8DFC9]">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            selectedCategory === 'all'
              ? 'bg-[#722F37] text-[#F4E8C1] shadow-sm'
              : 'bg-white text-[#5A5550] border border-[#E8DFC9] hover:border-[#722F37]'
          }`}
        >
          All Collections ({products.filter((p) => p.published).length})
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.slug)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat.slug
                ? 'bg-[#722F37] text-[#F4E8C1] shadow-sm'
                : 'bg-white text-[#5A5550] border border-[#E8DFC9] hover:border-[#722F37]'
            }`}
          >
            {cat.name} ({cat.count || 0})
          </button>
        ))}
      </div>

      {/* Main Layout: Desktop Sidebar Filters + Product Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block space-y-6 bg-white p-6 rounded-2xl border border-[#E8DFC9] shadow-sm h-fit sticky top-28">
          <div className="flex items-center justify-between pb-4 border-b border-[#E8DFC9]">
            <div className="flex items-center space-x-2 font-serif-luxury text-lg font-bold text-[#722F37]">
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters</span>
            </div>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="text-[11px] text-[#8C7654] hover:text-[#722F37] flex items-center space-x-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* Quick Toggles */}
          <div className="space-y-2.5">
            <label className="flex items-center space-x-2.5 text-xs text-[#231F20] cursor-pointer">
              <input
                type="checkbox"
                checked={saleOnly}
                onChange={(e) => setSaleOnly(e.target.checked)}
                className="rounded text-[#722F37] focus:ring-[#722F37] w-4 h-4"
              />
              <span className="font-semibold text-[#722F37]">On Sale / Discounted</span>
            </label>

            <label className="flex items-center space-x-2.5 text-xs text-[#231F20] cursor-pointer">
              <input
                type="checkbox"
                checked={newOnly}
                onChange={(e) => setNewOnly(e.target.checked)}
                className="rounded text-[#722F37] focus:ring-[#722F37] w-4 h-4"
              />
              <span>New Arrivals Only</span>
            </label>

            <label className="flex items-center space-x-2.5 text-xs text-[#231F20] cursor-pointer">
              <input
                type="checkbox"
                checked={wishlistOnly}
                onChange={(e) => setWishlistOnly(e.target.checked)}
                className="rounded text-[#722F37] focus:ring-[#722F37] w-4 h-4"
              />
              <span className="flex items-center space-x-1">
                <span>Wishlist Only</span>
                <Heart className="w-3.5 h-3.5 text-[#722F37] fill-[#722F37]" />
              </span>
            </label>
          </div>

          {/* Price Range */}
          <div className="pt-4 border-t border-[#E8DFC9] space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-[#231F20]">Max Price:</span>
              <span className="font-serif-luxury font-bold text-[#722F37]">
                {formatPrice(priceRange)}
              </span>
            </div>
            <input
              type="range"
              min={50000}
              max={350000}
              step={10000}
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-full accent-[#722F37] cursor-pointer"
            />
          </div>

          {/* Sizes Filter */}
          <div className="pt-4 border-t border-[#E8DFC9] space-y-2">
            <span className="text-xs font-bold text-[#231F20] block">Size Filter:</span>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setSelectedSize('all')}
                className={`px-2.5 py-1 text-[11px] rounded-lg border font-medium ${
                  selectedSize === 'all'
                    ? 'bg-[#722F37] text-white border-[#722F37]'
                    : 'bg-[#FDFBF7] text-[#5A5550] border-[#E8DFC9]'
                }`}
              >
                All
              </button>
              {allSizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(s)}
                  className={`px-2.5 py-1 text-[11px] rounded-lg border font-medium ${
                    selectedSize === s
                      ? 'bg-[#722F37] text-white border-[#722F37]'
                      : 'bg-[#FDFBF7] text-[#5A5550] border-[#E8DFC9]'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Color Palettes */}
          <div className="pt-4 border-t border-[#E8DFC9] space-y-2">
            <span className="text-xs font-bold text-[#231F20] block">Color Tone:</span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedColor('all')}
                className={`px-2.5 py-1 text-[11px] rounded-lg border font-medium ${
                  selectedColor === 'all'
                    ? 'bg-[#722F37] text-white border-[#722F37]'
                    : 'bg-[#FDFBF7] text-[#5A5550] border-[#E8DFC9]'
                }`}
              >
                All
              </button>
              {allColors.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setSelectedColor(c.name)}
                  className={`flex items-center space-x-1.5 px-2 py-1 text-[11px] rounded-lg border ${
                    selectedColor === c.name
                      ? 'border-[#722F37] bg-[#722F37]/5 font-bold text-[#722F37]'
                      : 'border-[#E8DFC9] text-[#5A5550]'
                  }`}
                >
                  <span
                    className="w-3 h-3 rounded-full border border-black/20"
                    style={{ backgroundColor: c.hex }}
                  />
                  <span>{c.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Availability */}
          <div className="pt-4 border-t border-[#E8DFC9] space-y-2">
            <span className="text-xs font-bold text-[#231F20] block">Availability:</span>
            <select
              value={selectedAvailability}
              onChange={(e) => setSelectedAvailability(e.target.value)}
              className="w-full bg-[#FDFBF7] border border-[#E8DFC9] rounded-xl px-3 py-2 text-xs text-[#231F20] focus:outline-none"
            >
              <option value="all">All Outfits</option>
              <option value="in_stock">Ready to Ship (In Stock)</option>
              <option value="made_to_order">Made to Measure / Bridal</option>
            </select>
          </div>
        </aside>

        {/* Product Grid Area */}
        <div className="lg:col-span-3">
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-3xl border border-[#E8DFC9] p-12 text-center space-y-4 shadow-sm">
              <div className="w-16 h-16 mx-auto rounded-full bg-[#F5EFEB] flex items-center justify-center text-[#8C7654]">
                <Search className="w-8 h-8 opacity-60" />
              </div>
              <h3 className="font-serif-luxury text-2xl font-bold text-[#231F20]">
                No Outfits Found
              </h3>
              <p className="text-xs text-[#5A5550] max-w-md mx-auto">
                No bridal or formal pieces matched your selected filter criteria. Try adjusting your filters or search terms.
              </p>
              <button
                onClick={resetFilters}
                className="px-6 py-2.5 bg-[#722F37] text-[#F4E8C1] text-xs font-semibold uppercase tracking-wider rounded-xl hover:bg-[#501F25] transition-all shadow-md"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((prod) => (
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
      </div>

      {/* Mobile Filter Drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-end">
          <div className="bg-white w-4/5 max-w-sm h-full shadow-2xl p-6 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#E8DFC9]">
                <div className="flex items-center space-x-2 font-serif-luxury text-xl font-bold text-[#722F37]">
                  <SlidersHorizontal className="w-5 h-5" />
                  <span>Filter Collection</span>
                </div>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-1.5 text-[#231F20] hover:bg-[#F5EFEB] rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Toggles */}
              <div className="space-y-3">
                <label className="flex items-center space-x-3 text-xs text-[#231F20]">
                  <input
                    type="checkbox"
                    checked={saleOnly}
                    onChange={(e) => setSaleOnly(e.target.checked)}
                    className="rounded text-[#722F37] w-4 h-4"
                  />
                  <span className="font-semibold text-[#722F37]">On Sale / Discounted</span>
                </label>

                <label className="flex items-center space-x-3 text-xs text-[#231F20]">
                  <input
                    type="checkbox"
                    checked={newOnly}
                    onChange={(e) => setNewOnly(e.target.checked)}
                    className="rounded text-[#722F37] w-4 h-4"
                  />
                  <span>New Arrivals Only</span>
                </label>
              </div>

              {/* Price Range */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-[#231F20]">Max Price:</span>
                  <span className="font-serif-luxury font-bold text-[#722F37]">
                    {formatPrice(priceRange)}
                  </span>
                </div>
                <input
                  type="range"
                  min={50000}
                  max={350000}
                  step={10000}
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full accent-[#722F37]"
                />
              </div>

              {/* Size */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-[#231F20] block">Size:</span>
                <div className="flex flex-wrap gap-1.5">
                  {['all', ...allSizes].map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`px-3 py-1.5 text-xs rounded-lg border font-medium ${
                        selectedSize === s
                          ? 'bg-[#722F37] text-white border-[#722F37]'
                          : 'bg-[#FDFBF7] text-[#5A5550] border-[#E8DFC9]'
                      }`}
                    >
                      {s === 'all' ? 'All' : s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-[#E8DFC9] space-y-2">
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full py-3 bg-[#722F37] text-[#F4E8C1] text-xs font-bold uppercase tracking-wider rounded-xl shadow-md"
              >
                Apply Filters ({filteredProducts.length} Results)
              </button>
              <button
                onClick={resetFilters}
                className="w-full py-2 text-xs font-semibold text-[#8C7654] hover:underline"
              >
                Reset All Filters
              </button>
            </div>
          </div>
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

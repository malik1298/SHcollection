import React, { useState, useEffect } from 'react';
import { Product } from '../../types/index.js';
import { api } from '../../lib/api.js';
import { useSettings } from '../../context/SettingsContext.js';
import { Flame, Percent, Check, RefreshCw } from 'lucide-react';

export const AdminSales: React.FC = () => {
  const { formatPrice } = useSettings();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await api.getProducts();
      setProducts(data);
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSale = async (product: Product) => {
    setSavingId(product.id);
    const newEnabled = !product.saleEnabled;
    const newPercentage = newEnabled && product.salePercentage === 0 ? 15 : product.salePercentage;
    const newSalePrice = newEnabled ? Math.round(product.price * (1 - newPercentage / 100)) : product.price;

    try {
      const updated = await api.updateProduct(product.id, {
        saleEnabled: newEnabled,
        salePercentage: newPercentage,
        salePrice: newSalePrice,
      });
      setProducts(products.map((p) => (p.id === product.id ? updated : p)));
    } catch (err) {
      console.error('Failed to update sale:', err);
    } finally {
      setSavingId(null);
    }
  };

  const handlePercentageChange = async (product: Product, percentage: number) => {
    setSavingId(product.id);
    const calcSalePrice = Math.round(product.price * (1 - percentage / 100));

    try {
      const updated = await api.updateProduct(product.id, {
        salePercentage: percentage,
        salePrice: calcSalePrice,
        saleEnabled: percentage > 0,
      });
      setProducts(products.map((p) => (p.id === product.id ? updated : p)));
    } catch (err) {
      console.error('Failed to update sale percentage:', err);
    } finally {
      setSavingId(null);
    }
  };

  const activeSaleProducts = products.filter((p) => p.saleEnabled && p.salePercentage > 0);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl border border-[#E8DFC9] p-6 sm:p-8 space-y-3 shadow-sm">
        <div className="flex items-center space-x-2 text-[#722F37]">
          <Flame className="w-5 h-5 text-[#D4AF37]" />
          <h2 className="font-serif-luxury text-2xl font-bold text-[#231F20]">
            Dedicated Bridal Sale & Promotions Manager
          </h2>
        </div>
        <p className="text-xs text-[#5A5550] max-w-2xl leading-relaxed">
          Quickly toggle sale discounts on or off and configure percentage markdowns. The customer storefront and sale gallery automatically update immediately with recalculated prices and discount tags.
        </p>
        <div className="pt-2 text-xs font-bold text-[#722F37]">
          Currently {activeSaleProducts.length} of {products.length} outfits on active sale.
        </div>
      </div>

      {/* Sale Management Grid */}
      <div className="bg-white rounded-3xl border border-[#E8DFC9] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#2A1215] text-[#F4E8C1]">
              <tr>
                <th className="p-4">Outfit Description</th>
                <th className="p-4">Original Price</th>
                <th className="p-4 text-center">Sale Switch</th>
                <th className="p-4 text-center">Discount %</th>
                <th className="p-4 text-right">Auto-Calculated Sale Price</th>
                <th className="p-4 text-right">Savings For Customer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5EFEB]">
              {products.map((p) => {
                const isOnSale = p.saleEnabled && p.salePercentage > 0;
                const savings = p.price - (p.salePrice || p.price);

                return (
                  <tr key={p.id} className="hover:bg-[#FDFBF7] transition-colors">
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={p.images?.[0] || 'https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=200&q=80'}
                          alt=""
                          className="w-12 h-14 object-cover rounded-lg bg-[#F5EFEB] shrink-0"
                        />
                        <div>
                          <h4 className="font-serif-luxury font-bold text-xs text-[#231F20]">
                            {p.name}
                          </h4>
                          <span className="text-[10px] text-[#8C7654] uppercase">
                            SKU: {p.sku} • {p.category}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="p-4 font-semibold text-[#231F20]">
                      {formatPrice(p.price)}
                    </td>

                    <td className="p-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleSale(p)}
                        disabled={savingId === p.id}
                        className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all ${
                          isOnSale
                            ? 'bg-[#722F37] text-white'
                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        }`}
                      >
                        {isOnSale ? 'Sale ON' : 'Sale OFF'}
                      </button>
                    </td>

                    <td className="p-4 text-center">
                      <div className="inline-flex items-center space-x-1">
                        <select
                          value={p.salePercentage || 0}
                          onChange={(e) => handlePercentageChange(p, Number(e.target.value))}
                          disabled={savingId === p.id}
                          className="bg-[#FDFBF7] border border-[#E8DFC9] rounded-lg px-2 py-1 text-xs font-bold text-[#722F37] cursor-pointer"
                        >
                          <option value={0}>0% Off</option>
                          <option value={5}>5% Off</option>
                          <option value={10}>10% Off</option>
                          <option value={15}>15% Off</option>
                          <option value={20}>20% Off</option>
                          <option value={25}>25% Off</option>
                          <option value={30}>30% Off</option>
                          <option value={40}>40% Off</option>
                          <option value={50}>50% Off</option>
                        </select>
                      </div>
                    </td>

                    <td className="p-4 text-right">
                      <span className={`font-serif-luxury font-bold text-xs ${isOnSale ? 'text-[#722F37]' : 'text-gray-400'}`}>
                        {formatPrice(isOnSale ? p.salePrice : p.price)}
                      </span>
                    </td>

                    <td className="p-4 text-right">
                      {isOnSale ? (
                        <span className="font-bold text-[#25D366] text-xs">
                          Save {formatPrice(savings)}
                        </span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

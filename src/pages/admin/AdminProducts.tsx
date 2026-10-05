import React, { useState, useEffect } from 'react';
import { Product, Category } from '../../types/index.js';
import { api } from '../../lib/api.js';
import { useSettings } from '../../context/SettingsContext.js';
import { ProductFormModal } from './ProductFormModal.js';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Copy,
  Eye,
  EyeOff,
  Flame,
  CheckCircle,
  Star,
  Sparkles,
  Filter
} from 'lucide-react';

interface AdminProductsProps {
  categories: Category[];
  isAddModalOpen?: boolean;
  onCloseAddModal?: () => void;
}

export const AdminProducts: React.FC<AdminProductsProps> = ({
  categories,
  isAddModalOpen = false,
  onCloseAddModal,
}) => {
  const { formatPrice } = useSettings();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(isAddModalOpen);

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    if (isAddModalOpen) {
      setEditingProduct(null);
      setIsModalOpen(true);
    }
  }, [isAddModalOpen]);

  const loadProducts = async () => {
    try {
      // By calling api.getProducts with auth token, server returns all products including unpublished
      const prods = await api.getProducts();
      setProducts(prods);
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePublish = async (prod: Product) => {
    try {
      const updated = await api.updateProduct(prod.id, { published: !prod.published });
      setProducts(products.map((p) => (p.id === prod.id ? updated : p)));
    } catch (err) {
      console.error('Failed to toggle publish:', err);
    }
  };

  const handleDuplicate = async (id: string) => {
    try {
      const duplicated = await api.duplicateProduct(id);
      setProducts([duplicated, ...products]);
    } catch (err) {
      console.error('Failed to duplicate:', err);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${name}"?`)) return;
    try {
      await api.deleteProduct(id);
      setProducts(products.filter((p) => p.id !== id));
    } catch (err) {
      console.error('Failed to delete product:', err);
    }
  };

  const filteredProducts = products.filter((p) => {
    if (categoryFilter !== 'all' && p.category !== categoryFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-2xl border border-[#E8DFC9] shadow-sm">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="relative flex-1 min-w-[200px]">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, SKU, category..."
              className="w-full pl-9 pr-4 py-2.5 bg-[#FDFBF7] border border-[#E8DFC9] rounded-xl text-xs text-[#231F20] focus:outline-none focus:ring-1 focus:ring-[#722F37]"
            />
            <Search className="w-4 h-4 text-[#8C7654] absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2.5 bg-[#FDFBF7] border border-[#E8DFC9] rounded-xl text-xs text-[#231F20] focus:outline-none"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={() => {
            setEditingProduct(null);
            setIsModalOpen(true);
          }}
          className="px-5 py-2.5 bg-[#722F37] hover:bg-[#501F25] text-[#F4E8C1] font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center space-x-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Outfit</span>
        </button>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-[#E8DFC9] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#2A1215] text-[#F4E8C1]">
              <tr>
                <th className="p-4">Outfit / Visual</th>
                <th className="p-4">SKU / Code</th>
                <th className="p-4">Category</th>
                <th className="p-4 text-right">Price</th>
                <th className="p-4 text-center">Sale Status</th>
                <th className="p-4 text-center">Stock Units</th>
                <th className="p-4 text-center">Visibility</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5EFEB]">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-[#8C7654]">
                    No outfits found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const effectivePrice = p.saleEnabled && p.salePercentage > 0 ? p.salePrice : p.price;

                  return (
                    <tr key={p.id} className="hover:bg-[#FDFBF7] transition-colors">
                      {/* Outfit Info */}
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={p.images?.[0] || 'https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=200&q=80'}
                            alt=""
                            className="w-12 h-16 object-cover object-top rounded-lg bg-[#F5EFEB] shrink-0"
                          />
                          <div className="min-w-0">
                            <h4 className="font-serif-luxury font-bold text-xs text-[#231F20] line-clamp-1">
                              {p.name}
                            </h4>
                            <div className="flex items-center space-x-1.5 mt-0.5">
                              {p.featured && (
                                <span className="bg-[#D4AF37]/20 text-[#8C7654] text-[9px] px-1.5 py-0.5 rounded font-bold">
                                  Featured
                                </span>
                              )}
                              {p.newArrival && (
                                <span className="bg-blue-100 text-blue-700 text-[9px] px-1.5 py-0.5 rounded font-bold">
                                  New
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* SKU */}
                      <td className="p-4 font-mono font-semibold text-[#722F37]">
                        {p.sku}
                      </td>

                      {/* Category */}
                      <td className="p-4 capitalize text-[#5A5550]">
                        {p.category.replace(/-/g, ' ')}
                      </td>

                      {/* Price */}
                      <td className="p-4 text-right">
                        <span className="font-serif-luxury font-bold text-[#231F20] block">
                          {formatPrice(effectivePrice)}
                        </span>
                        {p.saleEnabled && p.salePercentage > 0 && (
                          <span className="text-[10px] text-[#8C7654] line-through block">
                            {formatPrice(p.price)}
                          </span>
                        )}
                      </td>

                      {/* Sale Status */}
                      <td className="p-4 text-center">
                        {p.saleEnabled && p.salePercentage > 0 ? (
                          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-[#722F37] text-[#F4E8C1] text-[10px] font-bold">
                            <Flame className="w-3 h-3" />
                            <span>{p.salePercentage}% OFF</span>
                          </span>
                        ) : (
                          <span className="text-[#8C7654] text-[11px]">—</span>
                        )}
                      </td>

                      {/* Stock */}
                      <td className="p-4 text-center font-bold text-[#231F20]">
                        {p.stock}
                      </td>

                      {/* Visibility Toggle */}
                      <td className="p-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleTogglePublish(p)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            p.published
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-400'
                          }`}
                          title={p.published ? 'Published (Click to unpublish)' : 'Unpublished (Click to publish)'}
                        >
                          {p.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingProduct(p);
                              setIsModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg text-[#722F37] hover:bg-[#F5EFEB] transition-colors"
                            title="Edit Outfit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDuplicate(p.id)}
                            className="p-1.5 rounded-lg text-[#8C7654] hover:bg-[#F5EFEB] transition-colors"
                            title="Duplicate Outfit"
                          >
                            <Copy className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(p.id, p.name)}
                            className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                            title="Delete Outfit"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Form Modal */}
      {isModalOpen && (
        <ProductFormModal
          product={editingProduct}
          categories={categories}
          onClose={() => {
            setIsModalOpen(false);
            setEditingProduct(null);
            if (onCloseAddModal) onCloseAddModal();
          }}
          onSaved={(savedProd) => {
            setIsModalOpen(false);
            setEditingProduct(null);
            if (onCloseAddModal) onCloseAddModal();
            loadProducts();
          }}
        />
      )}
    </div>
  );
};

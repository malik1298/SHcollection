import React, { useState } from 'react';
import { Category } from '../../types/index.js';
import { api } from '../../lib/api.js';
import { Plus, Edit2, Trash2, Layers, Check, X } from 'lucide-react';

interface AdminCategoriesProps {
  categories: Category[];
  onRefreshCategories: () => void;
}

export const AdminCategories: React.FC<AdminCategoriesProps> = ({
  categories,
  onRefreshCategories,
}) => {
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [slug, setSlug] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const startEdit = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setDescription(cat.description);
    setImage(cat.image);
    setSlug(cat.slug);
    setIsAdding(false);
  };

  const startAdd = () => {
    setEditingCategory(null);
    setName('');
    setDescription('');
    setImage('https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=800&q=80');
    setSlug('');
    setIsAdding(true);
  };

  const cancel = () => {
    setEditingCategory(null);
    setIsAdding(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSaving(true);
    try {
      if (editingCategory) {
        await api.updateCategory(editingCategory.id, {
          name: name.trim(),
          description: description.trim(),
          image: image.trim(),
          slug: slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        });
      } else {
        await api.createCategory({
          name: name.trim(),
          description: description.trim(),
          image: image.trim(),
          slug: slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        });
      }
      onRefreshCategories();
      cancel();
    } catch (err) {
      console.error('Failed to save category:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete category "${name}"?`)) return;
    try {
      await api.deleteCategory(id);
      onRefreshCategories();
    } catch (err) {
      console.error('Failed to delete category:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif-luxury text-xl font-bold text-[#231F20]">
            Boutique Collections & Categories
          </h2>
          <p className="text-xs text-[#5A5550]">
            Manage bridal portfolios and luxury dress categories.
          </p>
        </div>

        {!isAdding && !editingCategory && (
          <button
            onClick={startAdd}
            className="px-5 py-2.5 bg-[#722F37] text-[#F4E8C1] font-bold text-xs uppercase tracking-wider rounded-xl shadow-md flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>New Category</span>
          </button>
        )}
      </div>

      {/* Add / Edit Form */}
      {(isAdding || editingCategory) && (
        <form onSubmit={handleSave} className="bg-white rounded-3xl border border-[#D4AF37] p-6 shadow-md space-y-4 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#E8DFC9]">
            <h3 className="font-serif-luxury text-base font-bold text-[#722F37]">
              {editingCategory ? `Edit Category: ${editingCategory.name}` : 'Create New Bridal Category'}
            </h3>
            <button type="button" onClick={cancel} className="text-gray-400 hover:text-black">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-semibold text-[#231F20]">Category Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (!editingCategory) {
                    setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                  }
                }}
                className="w-full px-3 py-2 bg-[#FDFBF7] border border-[#E8DFC9] rounded-xl"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-[#231F20]">URL Slug</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full px-3 py-2 bg-[#FDFBF7] border border-[#E8DFC9] rounded-xl font-mono"
              />
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="font-semibold text-[#231F20]">Cover Image URL</label>
              <input
                type="url"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="w-full px-3 py-2 bg-[#FDFBF7] border border-[#E8DFC9] rounded-xl"
              />
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="font-semibold text-[#231F20]">Description</label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 bg-[#FDFBF7] border border-[#E8DFC9] rounded-xl"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={cancel}
              className="px-4 py-2 bg-[#F5EFEB] rounded-xl font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2 bg-[#722F37] text-[#F4E8C1] rounded-xl font-bold"
            >
              {isSaving ? 'Saving...' : 'Save Category'}
            </button>
          </div>
        </form>
      )}

      {/* Grid of Categories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((c) => (
          <div
            key={c.id}
            className="bg-white rounded-3xl border border-[#E8DFC9] overflow-hidden shadow-sm flex flex-col justify-between"
          >
            <div className="h-40 bg-[#2A1215] relative overflow-hidden">
              <img
                src={c.image || 'https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=600&q=80'}
                alt=""
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 text-white">
                <span className="text-[10px] text-[#D4AF37] uppercase font-bold tracking-wider">
                  Slug: {c.slug}
                </span>
                <h3 className="font-serif-luxury text-lg font-bold text-[#FDFBF7]">
                  {c.name}
                </h3>
              </div>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
              <p className="text-xs text-[#5A5550] line-clamp-2">
                {c.description || 'Exclusive handcrafted collection.'}
              </p>

              <div className="pt-3 border-t border-[#F5EFEB] flex items-center justify-between text-xs">
                <span className="font-semibold text-[#8C7654]">
                  {c.count || 0} Outfits Assigned
                </span>

                <div className="flex space-x-1">
                  <button
                    onClick={() => startEdit(c)}
                    className="p-1.5 text-[#722F37] hover:bg-[#F5EFEB] rounded-lg"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(c.id, c.name)}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

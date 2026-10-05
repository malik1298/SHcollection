import React, { useState, useEffect } from 'react';
import { Product, Category, ProductColor } from '../../types/index.js';
import { api } from '../../lib/api.js';
import { useSettings } from '../../context/SettingsContext.js';
import {
  X,
  Plus,
  Trash2,
  Upload,
  ArrowUp,
  ArrowDown,
  Star,
  Check,
  Video,
  Image as ImageIcon,
  Sparkles,
  Percent
} from 'lucide-react';

interface ProductFormModalProps {
  product: Product | null; // null for new product
  categories: Category[];
  onClose: () => void;
  onSaved: (savedProduct: Product) => void;
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  product,
  categories,
  onClose,
  onSaved,
}) => {
  const { formatPrice } = useSettings();

  const [name, setName] = useState(product?.name || '');
  const [sku, setSku] = useState(product?.sku || `SH-BR-${Math.floor(100 + Math.random() * 900)}`);
  const [category, setCategory] = useState(product?.category || (categories[0]?.slug || 'bridal-couture'));
  const [description, setDescription] = useState(product?.description || '');
  const [price, setPrice] = useState<number>(product?.price || 150000);
  const [saleEnabled, setSaleEnabled] = useState(product?.saleEnabled || false);
  const [salePercentage, setSalePercentage] = useState<number>(product?.salePercentage || 0);
  const [salePrice, setSalePrice] = useState<number>(product?.salePrice || 150000);
  const [stock, setStock] = useState<number>(product?.stock !== undefined ? product.stock : 10);
  const [availability, setAvailability] = useState<Product['availability']>(product?.availability || 'in_stock');
  const [featured, setFeatured] = useState(product?.featured || false);
  const [newArrival, setNewArrival] = useState(product?.newArrival || false);
  const [published, setPublished] = useState(product?.published !== undefined ? product.published : true);

  // Sizes & Colors
  const [sizes, setSizes] = useState<string[]>(
    product?.sizes?.length ? product.sizes : ['XS', 'S', 'M', 'L', 'XL', 'Custom Bridal Stitching']
  );
  const [newSizeInput, setNewSizeInput] = useState('');

  const [colors, setColors] = useState<ProductColor[]>(
    product?.colors?.length
      ? product.colors
      : [
          { name: 'Royal Crimson', hex: '#722F37' },
          { name: 'Champagne Gold', hex: '#D4AF37' },
        ]
  );
  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#722F37');

  // Images & Videos
  const [images, setImages] = useState<string[]>(
    product?.images?.length ? product.images : []
  );
  const [newImageUrl, setNewImageUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const [videos, setVideos] = useState<string[]>(product?.videos || []);
  const [newVideoUrl, setNewVideoUrl] = useState('');

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  // Auto-calculate sale price whenever price or salePercentage changes
  useEffect(() => {
    if (saleEnabled && salePercentage > 0) {
      const calculated = Math.round(price * (1 - salePercentage / 100));
      setSalePrice(calculated);
    } else {
      setSalePrice(price);
    }
  }, [price, saleEnabled, salePercentage]);

  // Handlers for sizes
  const handleAddSize = () => {
    if (newSizeInput.trim() && !sizes.includes(newSizeInput.trim())) {
      setSizes([...sizes, newSizeInput.trim()]);
      setNewSizeInput('');
    }
  };

  const handleRemoveSize = (sizeToRemove: string) => {
    setSizes(sizes.filter((s) => s !== sizeToRemove));
  };

  // Handlers for colors
  const handleAddColor = () => {
    if (newColorName.trim()) {
      setColors([...colors, { name: newColorName.trim(), hex: newColorHex }]);
      setNewColorName('');
      setNewColorHex('#722F37');
    }
  };

  const handleRemoveColor = (index: number) => {
    setColors(colors.filter((_, i) => i !== index));
  };

  // Handlers for images
  const handleAddImageUrl = () => {
    if (newImageUrl.trim()) {
      setImages([...images, newImageUrl.trim()]);
      setNewImageUrl('');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        await new Promise((resolve) => {
          reader.onload = async () => {
            const dataUrl = reader.result as string;
            try {
              const res = await api.uploadImage(dataUrl, file.name);
              setImages((prev) => [...prev, res.url]);
            } catch (err) {
              // fallback to dataUrl
              setImages((prev) => [...prev, dataUrl]);
            }
            resolve(true);
          };
          reader.readAsDataURL(file);
        });
      }
    } catch (err) {
      console.error('Image upload failed:', err);
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleMoveImage = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= images.length) return;
    const copy = [...images];
    const temp = copy[index];
    copy[index] = copy[targetIndex];
    copy[targetIndex] = temp;
    setImages(copy);
  };

  const handleSetPrimaryImage = (index: number) => {
    if (index === 0) return;
    const copy = [...images];
    const [selected] = copy.splice(index, 1);
    copy.unshift(selected);
    setImages(copy);
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  // Video handlers
  const handleAddVideo = () => {
    if (newVideoUrl.trim()) {
      setVideos([...videos, newVideoUrl.trim()]);
      setNewVideoUrl('');
    }
  };

  const handleRemoveVideo = (index: number) => {
    setVideos(videos.filter((_, i) => i !== index));
  };

  // Submit Product Form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Product name is required');
      return;
    }
    if (!price || price <= 0) {
      setError('Please provide a valid price');
      return;
    }

    setIsSaving(true);

    try {
      const payload: Partial<Product> = {
        name: name.trim(),
        sku: sku.trim(),
        category,
        description: description.trim(),
        price: Number(price),
        saleEnabled,
        salePercentage: Number(salePercentage),
        salePrice: Number(salePrice),
        sizes,
        colors,
        stock: Number(stock),
        availability,
        featured,
        newArrival,
        isSale: saleEnabled && salePercentage > 0,
        published,
        images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=900&q=85'],
        videos,
      };

      let result: Product;
      if (product) {
        result = await api.updateProduct(product.id, payload);
      } else {
        result = await api.createProduct(payload);
      }

      onSaved(result);
    } catch (err: any) {
      console.error('Failed to save product:', err);
      setError(err.message || 'Failed to save product');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#FDFBF7] border-2 border-[#D4AF37] rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden relative">
        {/* Header */}
        <div className="p-6 bg-[#722F37] text-white flex items-center justify-between shrink-0">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-bold block">
              Atelier Catalog Management
            </span>
            <h2 className="font-serif-luxury text-xl font-bold">
              {product ? `Edit Product: ${product.name}` : 'Add New Bridal / Formal Outfit'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#F4E8C1] hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6 overflow-y-auto flex-1 text-xs">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl">
              {error}
            </div>
          )}

          {/* Section 1: Basic Information */}
          <div className="space-y-4">
            <h3 className="font-serif-luxury text-base font-bold text-[#722F37] pb-1 border-b border-[#E8DFC9]">
              1. General Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2 space-y-1">
                <label className="font-semibold text-[#231F20] block">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Noor-e-Jahan Royal Crimson Barat Lehnga"
                  className="w-full px-3.5 py-2.5 bg-white border border-[#E8DFC9] rounded-xl text-xs text-[#231F20] focus:outline-none focus:ring-1 focus:ring-[#722F37]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#231F20] block">
                  SKU / Code *
                </label>
                <input
                  type="text"
                  required
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  placeholder="SH-BR-01"
                  className="w-full px-3.5 py-2.5 bg-white border border-[#E8DFC9] rounded-xl text-xs text-[#231F20] focus:outline-none focus:ring-1 focus:ring-[#722F37]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="font-semibold text-[#231F20] block">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#E8DFC9] rounded-xl text-xs text-[#231F20] focus:outline-none focus:ring-1 focus:ring-[#722F37]"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#231F20] block">
                  Stock Units
                </label>
                <input
                  type="number"
                  min={0}
                  value={stock}
                  onChange={(e) => setStock(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#E8DFC9] rounded-xl text-xs text-[#231F20] focus:outline-none focus:ring-1 focus:ring-[#722F37]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#231F20] block">
                  Availability
                </label>
                <select
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#E8DFC9] rounded-xl text-xs text-[#231F20] focus:outline-none focus:ring-1 focus:ring-[#722F37]"
                >
                  <option value="in_stock">Ready to Dispatch (In Stock)</option>
                  <option value="made_to_order">Made to Measure Bridal</option>
                  <option value="pre_order">Pre-Order</option>
                  <option value="out_of_stock">Archived / Out of Stock</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-[#231F20] block">
                Detailed Product Description & Craftsmanship Details
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe fabric, embroidery techniques (zardozi, resham, dabka), cut, dupatta and styling instructions..."
                className="w-full px-3.5 py-2.5 bg-white border border-[#E8DFC9] rounded-xl text-xs text-[#231F20] focus:outline-none focus:ring-1 focus:ring-[#722F37]"
              />
            </div>
          </div>

          {/* Section 2: Pricing & Automatic Sale Calculation (Prompt Requirement #11) */}
          <div className="space-y-4 p-5 bg-[#F5EFEB] rounded-2xl border border-[#E8DFC9]">
            <div className="flex items-center justify-between pb-2 border-b border-[#E8DFC9]">
              <div className="flex items-center space-x-2">
                <Percent className="w-4 h-4 text-[#722F37]" />
                <h3 className="font-serif-luxury text-base font-bold text-[#722F37]">
                  2. Pricing & Automatic Sale Calculation
                </h3>
              </div>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={saleEnabled}
                  onChange={(e) => setSaleEnabled(e.target.checked)}
                  className="rounded text-[#722F37] focus:ring-[#722F37] w-4 h-4"
                />
                <span className="font-bold text-[#722F37] text-xs">Enable Sale Discount</span>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="font-semibold text-[#231F20] block">
                  Original Price *
                </label>
                <input
                  type="number"
                  min={0}
                  step={500}
                  required
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#E8DFC9] rounded-xl text-xs text-[#231F20] focus:outline-none focus:ring-1 focus:ring-[#722F37]"
                />
                <span className="text-[10px] text-[#8C7654]">
                  Regular: {formatPrice(price)}
                </span>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#231F20] block">
                  Sale Percentage (%)
                </label>
                <input
                  type="number"
                  min={0}
                  max={95}
                  disabled={!saleEnabled}
                  value={salePercentage}
                  onChange={(e) => setSalePercentage(Number(e.target.value))}
                  placeholder="e.g. 20"
                  className="w-full px-3.5 py-2.5 bg-white border border-[#E8DFC9] rounded-xl text-xs text-[#231F20] focus:outline-none focus:ring-1 focus:ring-[#722F37] disabled:opacity-50"
                />
                <span className="text-[10px] text-[#8C7654]">
                  e.g. 20% OFF
                </span>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#231F20] block">
                  Auto-Calculated Sale Price
                </label>
                <input
                  type="number"
                  min={0}
                  value={salePrice}
                  onChange={(e) => setSalePrice(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-white font-bold text-[#722F37] border border-[#E8DFC9] rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#722F37]"
                />
                <span className="text-[10px] text-[#25D366] font-bold">
                  Effective: {formatPrice(salePrice)}
                </span>
              </div>
            </div>

            {saleEnabled && salePercentage > 0 && (
              <div className="p-3 bg-white rounded-xl border border-[#D4AF37] flex items-center justify-between text-xs">
                <span>Customer Presentation Preview:</span>
                <div className="flex items-center space-x-2">
                  <span className="line-through text-gray-400">{formatPrice(price)}</span>
                  <span className="font-bold text-[#722F37]">{formatPrice(salePrice)}</span>
                  <span className="bg-[#722F37] text-white px-2 py-0.5 rounded-full text-[10px] font-bold">
                    {salePercentage}% OFF
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Sizes & Colors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Sizes */}
            <div className="space-y-3 p-4 bg-white rounded-2xl border border-[#E8DFC9]">
              <span className="font-bold text-[#231F20] block">Sizes Available</span>
              <div className="flex flex-wrap gap-1.5">
                {sizes.map((s) => (
                  <span
                    key={s}
                    className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-[#F5EFEB] text-[#231F20] font-semibold text-xs border border-[#E8DFC9]"
                  >
                    <span>{s}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSize(s)}
                      className="text-gray-400 hover:text-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex space-x-2 pt-2">
                <input
                  type="text"
                  value={newSizeInput}
                  onChange={(e) => setNewSizeInput(e.target.value)}
                  placeholder="e.g. XXL or Custom Fitting"
                  className="flex-1 px-3 py-1.5 bg-[#FDFBF7] border border-[#E8DFC9] rounded-lg text-xs"
                />
                <button
                  type="button"
                  onClick={handleAddSize}
                  className="px-3 py-1.5 bg-[#722F37] text-white text-xs font-semibold rounded-lg"
                >
                  Add Size
                </button>
              </div>
            </div>

            {/* Colors */}
            <div className="space-y-3 p-4 bg-white rounded-2xl border border-[#E8DFC9]">
              <span className="font-bold text-[#231F20] block">Color Swatches</span>
              <div className="flex flex-wrap gap-2">
                {colors.map((c, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-[#F5EFEB] text-[#231F20] font-semibold text-xs border border-[#E8DFC9]"
                  >
                    <span
                      className="w-3 h-3 rounded-full border border-black/20"
                      style={{ backgroundColor: c.hex }}
                    />
                    <span>{c.name}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveColor(i)}
                      className="text-gray-400 hover:text-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="color"
                  value={newColorHex}
                  onChange={(e) => setNewColorHex(e.target.value)}
                  className="w-8 h-8 rounded border border-gray-300 cursor-pointer p-0.5"
                />
                <input
                  type="text"
                  value={newColorName}
                  onChange={(e) => setNewColorName(e.target.value)}
                  placeholder="Color Name (e.g. Wine)"
                  className="flex-1 px-3 py-1.5 bg-[#FDFBF7] border border-[#E8DFC9] rounded-lg text-xs"
                />
                <button
                  type="button"
                  onClick={handleAddColor}
                  className="px-3 py-1.5 bg-[#722F37] text-white text-xs font-semibold rounded-lg"
                >
                  Add Color
                </button>
              </div>
            </div>
          </div>

          {/* Section 4: Unlimited Images Management (Prompt Requirement #12, #37) */}
          <div className="space-y-4 p-5 bg-white rounded-2xl border border-[#E8DFC9]">
            <div className="flex items-center justify-between pb-2 border-b border-[#E8DFC9]">
              <div className="flex items-center space-x-2 font-serif-luxury text-base font-bold text-[#722F37]">
                <ImageIcon className="w-4 h-4" />
                <span>4. Product Images (Unlimited & Reorderable)</span>
              </div>
              <span className="text-[11px] text-[#8C7654]">
                {images.length} {images.length === 1 ? 'image' : 'images'} uploaded
              </span>
            </div>

            {/* Add Image URL or File Upload */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-semibold text-[#231F20] block">
                  Add Image by Web / CDN URL:
                </label>
                <div className="flex space-x-2">
                  <input
                    type="url"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="flex-1 px-3 py-2 bg-[#FDFBF7] border border-[#E8DFC9] rounded-xl text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddImageUrl}
                    className="px-4 py-2 bg-[#722F37] text-white font-semibold rounded-xl text-xs"
                  >
                    Add URL
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-[#231F20] block">
                  Upload Multiple Images from Device:
                </label>
                <label className="flex items-center justify-center space-x-2 px-4 py-2 bg-[#F5EFEB] hover:bg-[#E8DFC9] text-[#722F37] rounded-xl border border-dashed border-[#722F37] cursor-pointer transition-colors text-xs font-semibold">
                  <Upload className="w-4 h-4" />
                  <span>{isUploading ? 'Uploading Files...' : 'Select Files (PNG / JPG)'}</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Image Preview List with Move & Primary Setting */}
            {images.length === 0 ? (
              <p className="text-xs text-[#8C7654] py-4 text-center">
                No images added yet. Add at least one image for display.
              </p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 pt-2">
                {images.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative group rounded-xl overflow-hidden border border-[#E8DFC9] bg-[#F5EFEB] aspect-[3/4]"
                  >
                    <img
                      src={img || 'https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=200&q=80'}
                      alt=""
                      className="w-full h-full object-cover object-top"
                    />

                    {/* Primary Badge */}
                    {idx === 0 && (
                      <span className="absolute top-1.5 left-1.5 bg-[#D4AF37] text-[#231F20] text-[9px] font-bold px-1.5 py-0.5 rounded shadow">
                        Primary Cover
                      </span>
                    )}

                    {/* Action overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                      <div className="flex justify-between">
                        {idx !== 0 && (
                          <button
                            type="button"
                            onClick={() => handleSetPrimaryImage(idx)}
                            className="p-1 bg-[#D4AF37] text-[#231F20] rounded hover:scale-110"
                            title="Set as Primary Cover"
                          >
                            <Star className="w-3 h-3 fill-current" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="p-1 bg-red-600 text-white rounded hover:scale-110 ml-auto"
                          title="Delete image"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="flex justify-center space-x-1">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => handleMoveImage(idx, 'up')}
                          className="p-1 bg-white/80 rounded hover:bg-white disabled:opacity-30"
                          title="Move Left"
                        >
                          <ArrowUp className="w-3 h-3 text-[#231F20] -rotate-90" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === images.length - 1}
                          onClick={() => handleMoveImage(idx, 'down')}
                          className="p-1 bg-white/80 rounded hover:bg-white disabled:opacity-30"
                          title="Move Right"
                        >
                          <ArrowDown className="w-3 h-3 text-[#231F20] -rotate-90" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 5: Product Videos */}
          <div className="space-y-3 p-5 bg-white rounded-2xl border border-[#E8DFC9]">
            <div className="flex items-center space-x-2 font-serif-luxury text-base font-bold text-[#722F37] pb-1 border-b border-[#E8DFC9]">
              <Video className="w-4 h-4" />
              <span>5. Product Videos</span>
            </div>

            <div className="flex space-x-2">
              <input
                type="url"
                value={newVideoUrl}
                onChange={(e) => setNewVideoUrl(e.target.value)}
                placeholder="Video URL (e.g. MP4 link or video embed)..."
                className="flex-1 px-3 py-2 bg-[#FDFBF7] border border-[#E8DFC9] rounded-xl text-xs"
              />
              <button
                type="button"
                onClick={handleAddVideo}
                className="px-4 py-2 bg-[#722F37] text-white font-semibold rounded-xl text-xs"
              >
                Add Video
              </button>
            </div>

            {videos.length > 0 && (
              <div className="space-y-1.5 pt-2">
                {videos.map((vid, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 rounded-lg bg-[#F5EFEB] text-xs"
                  >
                    <span className="truncate max-w-md">{vid}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveVideo(idx)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 6: Visibility & Badges */}
          <div className="p-4 bg-white rounded-2xl border border-[#E8DFC9] flex flex-wrap items-center gap-6">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="rounded text-[#722F37] focus:ring-[#722F37] w-4 h-4"
              />
              <span className="font-bold text-[#231F20]">Published (Visible in Store)</span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="rounded text-[#722F37] focus:ring-[#722F37] w-4 h-4"
              />
              <span className="font-semibold text-[#231F20]">Mark as Featured</span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={newArrival}
                onChange={(e) => setNewArrival(e.target.checked)}
                className="rounded text-[#722F37] focus:ring-[#722F37] w-4 h-4"
              />
              <span className="font-semibold text-[#231F20]">Mark as New Arrival</span>
            </label>
          </div>

          {/* Submit / Cancel Buttons */}
          <div className="pt-4 border-t border-[#E8DFC9] flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-[#F5EFEB] hover:bg-[#E8DFC9] text-[#231F20] font-semibold rounded-xl text-xs uppercase tracking-wider"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-8 py-3 bg-[#722F37] hover:bg-[#501F25] text-[#F4E8C1] font-bold rounded-xl text-xs uppercase tracking-widest transition-all shadow-md active:scale-95 disabled:opacity-50"
            >
              {isSaving ? 'Saving Product...' : product ? 'Update Product' : 'Publish Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

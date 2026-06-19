"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Plus, Search, Edit2, Trash2, X, ImagePlus, Star, EyeOff, Eye } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { addProduct, updateProduct, deleteProduct, toggleHidden, Product } from '@/store/productSlice';

const emptyForm = (defaultCat: string) => ({
  name: '',
  category: defaultCat,
  price: 0,
  originalPrice: 0,
  discount: 0,
  stock: 0,
  status: 'In Stock' as const,
  images: [] as string[],
  rating: 4.5,
  reviews: 0,
  hidden: false,
});

export default function AdminProductsPage() {
  const { items: products } = useAppSelector(state => state.products);
  const { appCategories = [] } = useAppSelector(state => state.site);
  const dispatch = useAppDispatch();

  const defaultCategory = appCategories.length > 0 ? appCategories[0].name : 'Electronics';

  const [modalMode, setModalMode] = useState<'none' | 'add' | 'edit'>('none');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [form, setForm] = useState(emptyForm(defaultCategory));

  // Open ADD modal
  const openAdd = () => {
    setEditingProduct(null);
    setForm(emptyForm(defaultCategory));
    setModalMode('add');
  };

  // Open EDIT modal
  const openEdit = (product: Product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      category: product.category,
      price: product.price,
      originalPrice: product.originalPrice || 0,
      discount: product.discount || 0,
      stock: product.stock,
      status: product.status,
      images: product.images && product.images.length > 0 ? product.images : [product.image],
      rating: product.rating,
      reviews: product.reviews,
      hidden: product.hidden || false,
    });
    setModalMode('edit');
  };

  const closeModal = () => {
    setModalMode('none');
    setEditingProduct(null);
  };

  // ── Multi-image upload ──
  const handleImagesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm(prev => ({ ...prev, images: [...prev.images, reader.result as string] }));
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const handleAddImageUrl = () => {
    const url = prompt('Paste image URL:');
    if (url?.trim()) setForm(prev => ({ ...prev, images: [...prev.images, url.trim()] }));
  };

  const removeImage = (idx: number) =>
    setForm(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }));

  const setAsPrimary = (idx: number) => {
    setForm(prev => {
      const imgs = [...prev.images];
      const [sel] = imgs.splice(idx, 1);
      return { ...prev, images: [sel, ...imgs] };
    });
  };

  // ── Submit ──
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.images.length === 0) { alert('Please add at least one product photo.'); return; }

    const payload = {
      ...form,
      image: form.images[0],
      category: form.category || defaultCategory,
    };

    if (modalMode === 'edit' && editingProduct) {
      dispatch(updateProduct({ ...editingProduct, ...payload }));
    } else {
      dispatch(addProduct(payload));
    }
    closeModal();
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterCategory === '' || p.category === filterCategory)
  );

  const ProductFormModal = () => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h3 className="text-xl font-bold text-gray-800">
            {modalMode === 'edit' ? '✏️ Edit Product' : '➕ Add New Product'}
          </h3>
          <button onClick={closeModal} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
            <input
              required type="text" value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. iPhone 15 Pro Max"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none text-gray-900"
            />
          </div>

          {/* Category + Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none text-gray-900 bg-white"
              >
                {appCategories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
                {appCategories.length === 0 && <option value="Electronics">Electronics</option>}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={form.status}
                onChange={e => setForm({ ...form, status: e.target.value as any })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none text-gray-900 bg-white"
              >
                <option>In Stock</option><option>Low Stock</option><option>Out of Stock</option>
              </select>
            </div>
          </div>

          {/* Price + Original + Discount */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price ($) *</label>
              <input required type="number" min="0" step="0.01" value={form.price}
                onChange={e => setForm({ ...form, price: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none text-gray-900" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Original Price ($)</label>
              <input type="number" min="0" step="0.01" value={form.originalPrice}
                onChange={e => setForm({ ...form, originalPrice: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none text-gray-900" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Discount (%)</label>
              <input type="number" min="0" max="100" value={form.discount}
                onChange={e => setForm({ ...form, discount: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none text-gray-900" />
            </div>
          </div>

          {/* Stock */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity *</label>
            <input required type="number" min="0" value={form.stock}
              onChange={e => setForm({ ...form, stock: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none text-gray-900" />
          </div>

          {/* Hide toggle (edit mode) */}
          {modalMode === 'edit' && (
            <div className="flex items-center justify-between bg-gray-50 border border-gray-100 rounded-xl px-4 py-3">
              <div>
                <p className="text-sm font-medium text-gray-800">Hide from Storefront</p>
                <p className="text-xs text-gray-500">Product won't appear to customers</p>
              </div>
              <button
                type="button"
                onClick={() => setForm({ ...form, hidden: !form.hidden })}
                className={`px-4 py-1.5 rounded-full text-sm font-bold border transition-colors ${
                  form.hidden
                    ? 'bg-gray-700 text-white border-gray-700'
                    : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
                }`}
              >
                {form.hidden ? 'Hidden' : 'Visible'}
              </button>
            </div>
          )}

          {/* Multi-photo upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Photos * <span className="text-gray-400 font-normal">(first = main photo)</span>
            </label>
            <div className="flex gap-2 mb-3">
              <label className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-orange-300 rounded-xl cursor-pointer hover:bg-orange-50 transition-colors text-orange-600 font-medium text-sm">
                <ImagePlus size={18} /> Upload Photos
                <input type="file" accept="image/*" multiple onChange={handleImagesUpload} className="hidden" />
              </label>
              <button type="button" onClick={handleAddImageUrl}
                className="px-4 py-3 border-2 border-dashed border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-gray-500 font-medium text-sm">
                + URL
              </button>
            </div>

            {form.images.length > 0 ? (
              <div className="grid grid-cols-4 gap-2">
                {form.images.map((img, idx) => (
                  <div key={idx} className={`relative group rounded-xl overflow-hidden border-2 aspect-square ${idx === 0 ? 'border-orange-500' : 'border-gray-100'}`}>
                    <Image src={img} alt="" fill className="object-cover" />
                    {idx === 0 && (
                      <div className="absolute top-1 left-1 bg-orange-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">MAIN</div>
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                      {idx !== 0 && (
                        <button type="button" onClick={() => setAsPrimary(idx)} className="p-1 bg-orange-500 text-white rounded-full">
                          <Star size={12} />
                        </button>
                      )}
                      <button type="button" onClick={() => removeImage(idx)} className="p-1 bg-red-500 text-white rounded-full">
                        <X size={12} />
                      </button>
                    </div>
                  </div>
                ))}
                <label className="aspect-square border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 text-gray-400">
                  <Plus size={20} /><span className="text-[10px] mt-1">More</span>
                  <input type="file" accept="image/*" multiple onChange={handleImagesUpload} className="hidden" />
                </label>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-200 rounded-xl py-10 flex flex-col items-center text-gray-400">
                <ImagePlus size={36} className="mb-2 opacity-30" />
                <p className="text-sm">No photos yet — upload or paste URLs</p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="pt-2 flex gap-3 justify-end">
            <button type="button" onClick={closeModal}
              className="px-6 py-2.5 border border-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button type="submit"
              className="px-6 py-2.5 bg-orange-500 text-white rounded-lg font-bold hover:bg-orange-600 transition-colors shadow-sm">
              {modalMode === 'edit' ? 'Save Changes' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 relative">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Products Management</h2>
        <button
          onClick={openAdd}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={18} /> Add New Product
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <div className="relative">
            <input
              type="text" placeholder="Search products..."
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 w-64 md:w-80 text-gray-900"
            />
            <Search size={18} className="text-gray-400 absolute left-3 top-2.5" />
          </div>
          <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}
            className="border border-gray-200 rounded-lg px-4 py-2 focus:outline-none bg-white text-gray-900">
            <option value="">All Categories</option>
            {appCategories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
          </select>
        </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white text-gray-500 text-sm border-b border-gray-100">
              <th className="p-4 font-medium">Product</th>
              <th className="p-4 font-medium">Photos</th>
              <th className="p-4 font-medium">Category</th>
              <th className="p-4 font-medium">Price</th>
              <th className="p-4 font-medium">Stock</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product.id} className={`border-b border-gray-50 transition-colors ${product.hidden ? 'bg-gray-50 opacity-60' : 'hover:bg-orange-50/20'}`}>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 relative bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={product.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=200'}
                        alt={product.name} fill className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm line-clamp-1">{product.name}</p>
                      {product.hidden && (
                        <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded font-medium">Hidden</span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-1">
                    {(product.images && product.images.length > 0 ? product.images : [product.image]).slice(0, 3).map((img, i) => (
                      <div key={i} className="w-8 h-8 rounded border border-gray-100 overflow-hidden bg-gray-50 relative flex-shrink-0">
                        <Image src={img} alt="" fill className="object-cover" />
                      </div>
                    ))}
                    {(product.images?.length || 1) > 3 && (
                      <span className="text-xs text-gray-400 ml-1">+{(product.images?.length || 1) - 3}</span>
                    )}
                  </div>
                </td>
                <td className="p-4 text-gray-500 text-sm">{product.category}</td>
                <td className="p-4">
                  <div className="font-medium text-gray-900 text-sm">${product.price}</div>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <div className="text-xs text-gray-400 line-through">${product.originalPrice}</div>
                  )}
                </td>
                <td className="p-4 text-gray-500 text-sm">{product.stock}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    product.status === 'In Stock' ? 'bg-green-100 text-green-700' :
                    product.status === 'Low Stock' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {product.status}
                  </span>
                </td>

                {/* ── ACTION BUTTONS ── */}
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    {/* EDIT */}
                    <button
                      onClick={() => openEdit(product)}
                      title="Edit product"
                      className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit2 size={17} />
                    </button>

                    {/* HIDE / SHOW */}
                    <button
                      onClick={() => dispatch(toggleHidden(product.id))}
                      title={product.hidden ? 'Show product' : 'Hide from storefront'}
                      className={`p-2 rounded-lg transition-colors ${
                        product.hidden
                          ? 'text-green-500 hover:bg-green-50'
                          : 'text-gray-400 hover:bg-gray-50'
                      }`}
                    >
                      {product.hidden ? <Eye size={17} /> : <EyeOff size={17} />}
                    </button>

                    {/* DELETE */}
                    <button
                      onClick={() => {
                        if (confirm(`Delete "${product.name}"? This cannot be undone.`)) {
                          dispatch(deleteProduct(product.id));
                        }
                      }}
                      title="Delete product"
                      className="p-2 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredProducts.length === 0 && (
              <tr><td colSpan={7} className="p-8 text-center text-gray-400">No products found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modalMode !== 'none' && <ProductFormModal />}
    </div>
  );
}

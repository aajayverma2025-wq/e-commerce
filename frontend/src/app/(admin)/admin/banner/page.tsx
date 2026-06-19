"use client";

import { useState } from 'react';
import { Save, Plus, Trash2, Edit2, MoveUp, MoveDown, CheckCircle, Eye, EyeOff, Image as ImageIcon, Link as LinkIcon, Palette } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateBanners } from '@/store/siteSlice';

interface BannerData {
  title: string;
  subtitle: string;
  buttonText: string;
  isActive: boolean;
  colorFrom: string;
  colorTo: string;
  buttonColor: string;
  backgroundImage?: string;
  link?: string;
}

export default function AdminBannerPage() {
  const { banners = [], appCategories = [] } = useAppSelector((state) => state.site);
  const dispatch = useAppDispatch();

  // Local state for banners list
  const [localBanners, setLocalBanners] = useState<BannerData[]>([...banners]);
  
  // Selected slide index for editing, -1 means adding new, null means none
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // Form State
  const [form, setForm] = useState<BannerData>({
    title: '',
    subtitle: '',
    buttonText: 'Shop Now',
    isActive: true,
    colorFrom: '#1e3a8a',
    colorTo: '#4338ca',
    buttonColor: '#f97316',
    backgroundImage: '',
    link: '',
  });

  const [toastMessage, setToastMessage] = useState('');

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Open Form for Editing
  const handleEditClick = (index: number) => {
    setEditingIndex(index);
    setForm({ ...localBanners[index] });
  };

  // Open Form for Adding
  const handleAddClick = () => {
    setEditingIndex(-1); // -1 signifies new slide
    setForm({
      title: '',
      subtitle: '',
      buttonText: 'Shop Now',
      isActive: true,
      colorFrom: '#1e3a8a',
      colorTo: '#4338ca',
      buttonColor: '#f97316',
      backgroundImage: '',
      link: '',
    });
  };

  // Delete Slide
  const handleDeleteClick = (index: number) => {
    if (confirm('Are you sure you want to delete this banner slide?')) {
      const updated = localBanners.filter((_, i) => i !== index);
      setLocalBanners(updated);
      dispatch(updateBanners(updated));
      triggerToast('Banner slide deleted successfully.');
      if (editingIndex === index) {
        setEditingIndex(null);
      }
    }
  };

  // Save Current Form
  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    let updated = [...localBanners];

    if (editingIndex === -1) {
      // Adding new banner
      updated.push(form);
      triggerToast('New banner slide added.');
    } else if (editingIndex !== null) {
      // Editing existing banner
      updated[editingIndex] = form;
      triggerToast('Banner slide updated.');
    }

    setLocalBanners(updated);
    dispatch(updateBanners(updated));
    setEditingIndex(null);
  };

  // Toggle Active State from List
  const handleToggleActive = (index: number) => {
    const updated = localBanners.map((b, i) => i === index ? { ...b, isActive: !b.isActive } : b);
    setLocalBanners(updated);
    dispatch(updateBanners(updated));
    triggerToast(updated[index].isActive ? 'Banner enabled.' : 'Banner disabled.');
  };

  // Re-ordering: Move Up
  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const updated = [...localBanners];
    const temp = updated[index];
    updated[index] = updated[index - 1];
    updated[index - 1] = temp;
    setLocalBanners(updated);
    dispatch(updateBanners(updated));
    triggerToast('Banners reordered.');
  };

  // Re-ordering: Move Down
  const handleMoveDown = (index: number) => {
    if (index === localBanners.length - 1) return;
    const updated = [...localBanners];
    const temp = updated[index];
    updated[index] = updated[index + 1];
    updated[index + 1] = temp;
    setLocalBanners(updated);
    dispatch(updateBanners(updated));
    triggerToast('Banners reordered.');
  };

  // Handle Image Upload File
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm(prev => ({ ...prev, backgroundImage: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-black text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-2 border border-gray-800 animate-fade-in">
          <CheckCircle size={18} className="text-orange-500" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-gray-800">Banner Slider Manager</h2>
          <p className="text-sm text-gray-500">Configure photo slides, gradients, and custom action links for your homepage.</p>
        </div>
        <button
          onClick={handleAddClick}
          className="bg-black hover:bg-gray-800 text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-md active:scale-95 text-sm"
        >
          <Plus size={16} /> Add New Slide
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Banners List */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
              <span className="text-sm font-bold text-gray-700">Slides & Offers ({localBanners.length})</span>
              <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Drag/reorder using arrows</span>
            </div>

            {localBanners.length === 0 ? (
              <div className="p-12 text-center text-gray-400">
                <ImageIcon size={48} className="mx-auto mb-3 opacity-20" />
                <p className="font-semibold">No banners configured.</p>
                <p className="text-xs mt-1">Click "Add New Slide" to create one.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {localBanners.map((slide, index) => (
                  <div 
                    key={index}
                    className={`p-4 flex items-center gap-4 transition-all duration-200 ${
                      editingIndex === index ? 'bg-orange-50/50 border-l-4 border-orange-500' : 'hover:bg-gray-50'
                    }`}
                  >
                    {/* Index */}
                    <span className="font-mono text-xs font-bold text-gray-400">#{index + 1}</span>

                    {/* Image Preview */}
                    <div className="w-16 h-10 rounded-lg overflow-hidden bg-gray-100 border relative flex-shrink-0 flex items-center justify-center">
                      {slide.backgroundImage ? (
                        <img src={slide.backgroundImage} alt={slide.title} className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon size={14} className="text-gray-400" />
                      )}
                      <div 
                        className="absolute inset-0 opacity-40 mix-blend-multiply"
                        style={{ background: `linear-gradient(to right, ${slide.colorFrom}, ${slide.colorTo})` }}
                      ></div>
                    </div>

                    {/* Title & Subtitle */}
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm text-gray-800 truncate">{slide.title || 'Untitled Slide'}</p>
                      <p className="text-xs text-gray-500 truncate">{slide.subtitle}</p>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center gap-1">
                      {/* Toggle Active */}
                      <button
                        onClick={() => handleToggleActive(index)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          slide.isActive 
                            ? 'text-green-600 bg-green-50 hover:bg-green-100' 
                            : 'text-gray-400 bg-gray-50 hover:bg-gray-100'
                        }`}
                        title={slide.isActive ? 'Disable Slide' : 'Enable Slide'}
                      >
                        {slide.isActive ? <Eye size={16} /> : <EyeOff size={16} />}
                      </button>

                      {/* Re-ordering */}
                      <button
                        onClick={() => handleMoveUp(index)}
                        disabled={index === 0}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-black hover:bg-gray-100 disabled:opacity-30 disabled:pointer-events-none"
                      >
                        <MoveUp size={16} />
                      </button>
                      <button
                        onClick={() => handleMoveDown(index)}
                        disabled={index === localBanners.length - 1}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-black hover:bg-gray-100 disabled:opacity-30 disabled:pointer-events-none"
                      >
                        <MoveDown size={16} />
                      </button>

                      {/* Actions */}
                      <button
                        onClick={() => handleEditClick(index)}
                        className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50"
                        title="Edit Slide"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(index)}
                        className="p-1.5 rounded-lg text-red-500 hover:bg-red-50"
                        title="Delete Slide"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Dynamic Slider Preview of All Slides */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 space-y-3">
            <h3 className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
              <Eye size={16} className="text-gray-500" /> Active Slides Live Preview
            </h3>
            <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
              {localBanners.filter(b => b.isActive).map((b, idx) => (
                <div 
                  key={idx}
                  className="w-64 h-32 rounded-lg flex-shrink-0 relative overflow-hidden flex flex-col justify-end p-3 text-white border shadow-sm"
                >
                  {b.backgroundImage && (
                    <img src={b.backgroundImage} alt="" className="absolute inset-0 w-full h-full object-cover z-0" />
                  )}
                  <div 
                    className="absolute inset-0 mix-blend-multiply opacity-80"
                    style={{ background: `linear-gradient(to right, ${b.colorFrom}, ${b.colorTo})` }}
                  ></div>
                  <div className="absolute inset-0 bg-black/10"></div>
                  
                  <div className="z-10">
                    <span className="text-[8px] uppercase tracking-wider bg-white/20 px-1.5 py-0.5 rounded border border-white/10">Slide #{idx + 1}</span>
                    <h4 className="font-black italic text-sm mt-1 truncate leading-tight uppercase">{b.title}</h4>
                    <p className="text-[10px] text-white/95 truncate leading-tight mb-1.5">{b.subtitle}</p>
                    <span 
                      className="text-[8px] font-black uppercase tracking-wider py-1 px-3.5 rounded-full inline-block"
                      style={{ backgroundColor: b.buttonColor }}
                    >
                      {b.buttonText}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Form / Edit / Add Banner */}
        <div className="lg:col-span-5">
          {editingIndex === null ? (
            <div className="bg-gray-50 rounded-xl border border-dashed border-gray-300 p-12 text-center text-gray-400 h-full flex flex-col justify-center items-center">
              <Edit2 size={32} className="mb-2 opacity-35" />
              <p className="font-semibold text-sm">Select a slide to edit or create a new one to begin editing.</p>
            </div>
          ) : (
            <form onSubmit={handleSaveForm} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
              <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
                <span className="text-sm font-bold text-gray-700">
                  {editingIndex === -1 ? '✨ Add New Slide' : `📝 Edit Slide #${editingIndex + 1}`}
                </span>
                <button
                  type="button"
                  onClick={() => setEditingIndex(null)}
                  className="text-xs text-gray-400 hover:text-black underline"
                >
                  Cancel
                </button>
              </div>

              <div className="p-5 space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Banner Title</label>
                  <input 
                    type="text" 
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    required
                    placeholder="e.g. MEGA ELECTRONICS SALE"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none text-gray-900" 
                  />
                </div>

                {/* Subtitle */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Subtitle / Offer Details</label>
                  <input 
                    type="text" 
                    value={form.subtitle}
                    onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                    placeholder="e.g. Up to 40% off on top brands"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none text-gray-900" 
                  />
                </div>

                {/* Background Image URL / File Upload */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Background Image</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={form.backgroundImage || ''}
                      onChange={(e) => setForm({ ...form, backgroundImage: e.target.value })}
                      placeholder="Image URL" 
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none text-gray-900" 
                    />
                    <label className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs px-3 py-2 rounded-lg cursor-pointer flex items-center justify-center border border-gray-200 transition-colors">
                      Upload
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                  </div>
                </div>

                {/* Button Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Button Text</label>
                    <input 
                      type="text" 
                      value={form.buttonText}
                      onChange={(e) => setForm({ ...form, buttonText: e.target.value })}
                      required
                      placeholder="Shop Now"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none text-gray-900" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Button Color</label>
                    <div className="flex items-center gap-2">
                      <input 
                        type="color" 
                        value={form.buttonColor}
                        onChange={(e) => setForm({ ...form, buttonColor: e.target.value })}
                        className="w-8 h-8 p-0.5 border border-gray-200 rounded cursor-pointer" 
                      />
                      <input 
                        type="text" 
                        value={form.buttonColor}
                        onChange={(e) => setForm({ ...form, buttonColor: e.target.value })}
                        className="flex-1 px-2 py-1.5 border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none font-mono text-gray-900" 
                      />
                    </div>
                  </div>
                </div>

                {/* Redirect Link */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1 flex items-center gap-1">
                    <LinkIcon size={12} /> Banner Redirect Link
                  </label>
                  <input 
                    type="text" 
                    value={form.link || ''}
                    onChange={(e) => setForm({ ...form, link: e.target.value })}
                    placeholder="e.g. /category/Electronics or absolute URL"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none text-gray-900 mb-1.5" 
                  />
                  <div className="flex flex-wrap gap-1">
                    {appCategories.map(cat => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setForm(prev => ({ ...prev, link: `/category/${cat.name.trim()}` }))}
                        className="text-[10px] bg-gray-100 hover:bg-orange-100 hover:text-orange-600 text-gray-600 px-2 py-0.5 rounded transition-all"
                      >
                        +{cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Gradient Colors */}
                <div className="border-t border-gray-100 pt-4 space-y-3">
                  <h4 className="text-xs font-bold text-gray-600 flex items-center gap-1.5">
                    <Palette size={14} className="text-gray-500" /> Gradient Overlay Styling
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-semibold text-gray-500 mb-1">Color Left</label>
                      <div className="flex items-center gap-1">
                        <input 
                          type="color" 
                          value={form.colorFrom}
                          onChange={(e) => setForm({ ...form, colorFrom: e.target.value })}
                          className="w-7 h-7 p-0.5 border border-gray-200 rounded cursor-pointer" 
                        />
                        <input 
                          type="text" 
                          value={form.colorFrom}
                          onChange={(e) => setForm({ ...form, colorFrom: e.target.value })}
                          className="flex-1 px-2 py-1 border border-gray-200 rounded text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none font-mono text-gray-900" 
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-gray-500 mb-1">Color Right</label>
                      <div className="flex items-center gap-1">
                        <input 
                          type="color" 
                          value={form.colorTo}
                          onChange={(e) => setForm({ ...form, colorTo: e.target.value })}
                          className="w-7 h-7 p-0.5 border border-gray-200 rounded cursor-pointer" 
                        />
                        <input 
                          type="text" 
                          value={form.colorTo}
                          onChange={(e) => setForm({ ...form, colorTo: e.target.value })}
                          className="flex-1 px-2 py-1 border border-gray-200 rounded text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none font-mono text-gray-900" 
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Switch to enable */}
                <div className="flex items-center gap-2 pt-2">
                  <input 
                    type="checkbox" 
                    id="formIsActive"
                    checked={form.isActive}
                    onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                    className="w-4 h-4 accent-orange-500 rounded cursor-pointer"
                  />
                  <label htmlFor="formIsActive" className="text-xs font-semibold text-gray-700 cursor-pointer">
                    Enable and Publish this Slide on Storefront
                  </label>
                </div>
              </div>

              {/* Form Footer */}
              <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingIndex(null)}
                  className="bg-white hover:bg-gray-100 border border-gray-200 text-gray-700 px-4 py-2 rounded-xl text-xs font-bold transition-all"
                >
                  Close
                </button>
                <button 
                  type="submit"
                  className="bg-black hover:bg-gray-800 text-white px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md active:scale-95"
                >
                  <Save size={14} /> {editingIndex === -1 ? 'Add Slide' : 'Update Slide'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from 'react';
import { CheckCircle, Image as ImageIcon, LayoutTemplate, Palette } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateTheme, updateBanner, updateTrendsBanner, updateTrendsTabs } from '@/store/siteSlice';

export default function StorefrontBuilderPage() {
  const { theme, banner, trendsBanner, trendsTabs } = useAppSelector((state) => state.site);
  const dispatch = useAppDispatch();
  const [saved, setSaved] = useState(false);

  // Helper: convert trendsTabs array to comma string for display
  const tabsStr = trendsTabs ? trendsTabs.join(', ') : '';

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'banner' | 'trends' | 'logo') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        if (field === 'banner') {
          dispatch(updateBanner({ ...banner, backgroundImage: dataUrl }));
        } else if (field === 'logo') {
          dispatch(updateTheme({ ...theme, logoImage: dataUrl }));
        } else {
          dispatch(updateTrendsBanner({ ...trendsBanner, backgroundImage: dataUrl }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const getTrendsItems = () => {
    const defaultItems = [
      { image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=150&h=150&fit=crop', price: 2.20 },
      { image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=150&h=150&fit=crop', price: 4.40 },
      { image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=150&h=150&fit=crop', price: 6.60 },
      { image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=150&h=150&fit=crop', price: 8.80 }
    ];
    if (!trendsBanner?.items || trendsBanner.items.length < 4) {
      return defaultItems;
    }
    return trendsBanner.items;
  };

  const handleTrendsItemImageUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        const currentItems = [...getTrendsItems()];
        currentItems[index] = {
          ...currentItems[index],
          image: dataUrl
        };
        dispatch(updateTrendsBanner({ ...trendsBanner, items: currentItems }));
      };
      reader.readAsDataURL(file);
    }
  };

  const showSavedToast = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };


  return (
    <div className="space-y-6 max-w-5xl pb-12">
      {/* Toast Notification */}
      {saved && (
        <div className="fixed top-6 right-6 z-50 bg-green-500 text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-pulse">
          <CheckCircle size={18} /> Changes saved & live!
        </div>
      )}

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Storefront Builder</h2>
        <div className="flex items-center gap-3">
          <span className="text-xs text-green-600 bg-green-50 border border-green-200 px-3 py-1 rounded-full font-medium">⚡ Real-time updates ON</span>
          <button 
            onClick={showSavedToast}
            className="bg-black hover:bg-gray-800 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors font-medium shadow-sm"
          >
            <CheckCircle size={18} /> Confirm Save
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Global Identity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
          <div className="p-5 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
            <Palette size={20} className="text-gray-500" />
            <h3 className="text-lg font-bold text-gray-800">Global Identity</h3>
          </div>
          <div className="p-6 space-y-5 flex-1">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Logo Text</label>
              <input 
                type="text" 
                value={theme?.logoText || ''}
                onChange={(e) => dispatch(updateTheme({ ...theme, logoText: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:outline-none text-gray-900" 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Logo Image (Overrides text)</label>
              <div className="flex gap-2 items-center">
                <input 
                  type="text" 
                  value={theme?.logoImage || ''}
                  onChange={(e) => dispatch(updateTheme({ ...theme, logoImage: e.target.value }))}
                  placeholder="Image URL" 
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:outline-none text-gray-900 text-sm" 
                />
                <label className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs px-3 py-2.5 rounded-lg cursor-pointer border border-gray-200 transition-colors flex-shrink-0 font-medium">
                  Upload Logo
                  <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'logo')} className="hidden" />
                </label>
                {theme?.logoImage && (
                  <div className="w-12 h-10 border border-gray-200 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center flex-shrink-0">
                    <img src={theme.logoImage} alt="Logo" className="max-w-full max-h-full object-contain" />
                  </div>
                )}
              </div>
              {theme?.logoImage && (
                <button 
                  type="button" 
                  onClick={() => dispatch(updateTheme({ ...theme, logoImage: '' }))}
                  className="text-xs text-red-500 underline mt-1"
                >
                  Remove logo image
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Primary Color</label>
                <div className="flex items-center gap-2">
                  <input type="color" value={theme?.primaryColor || '#000000'} onChange={(e) => dispatch(updateTheme({ ...theme, primaryColor: e.target.value }))} className="w-10 h-10 p-1 border border-gray-200 rounded cursor-pointer" />
                  <input type="text" value={theme?.primaryColor || ''} onChange={(e) => dispatch(updateTheme({ ...theme, primaryColor: e.target.value }))} className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:outline-none font-mono text-sm text-gray-900" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Accent Color</label>
                <div className="flex items-center gap-2">
                  <input type="color" value={theme?.accentColor || '#ff0000'} onChange={(e) => dispatch(updateTheme({ ...theme, accentColor: e.target.value }))} className="w-10 h-10 p-1 border border-gray-200 rounded cursor-pointer" />
                  <input type="text" value={theme?.accentColor || ''} onChange={(e) => dispatch(updateTheme({ ...theme, accentColor: e.target.value }))} className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:outline-none font-mono text-sm text-gray-900" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Homepage Banner */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
          <div className="p-5 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
            <LayoutTemplate size={20} className="text-gray-500" />
            <h3 className="text-lg font-bold text-gray-800">Homepage Banner</h3>
          </div>
          <div className="p-6 space-y-4 flex-1">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Main Title</label>
              <input type="text" value={banner?.title || ''} onChange={(e) => dispatch(updateBanner({ ...banner, title: e.target.value }))} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:outline-none text-gray-900" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
              <input type="text" value={banner?.subtitle || ''} onChange={(e) => dispatch(updateBanner({ ...banner, subtitle: e.target.value }))} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:outline-none text-gray-900" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
                <input type="text" value={banner?.buttonText || ''} onChange={(e) => dispatch(updateBanner({ ...banner, buttonText: e.target.value }))} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:outline-none text-gray-900" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Background Image</label>
                <div className="flex gap-2">
                  <input type="text" value={banner?.backgroundImage || ''} onChange={(e) => dispatch(updateBanner({ ...banner, backgroundImage: e.target.value }))} placeholder="Image URL" className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:outline-none text-gray-900" />
                  <label className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg cursor-pointer flex items-center justify-center border border-gray-200 transition-colors">
                    Upload
                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'banner')} className="hidden" />
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trends Page Banner */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden md:col-span-2">
          <div className="p-5 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
            <ImageIcon size={20} className="text-gray-500" />
            <h3 className="text-lg font-bold text-gray-800">Trends Page Hero</h3>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title (e.g. # OceanStory)</label>
                <input type="text" value={trendsBanner?.title || ''} onChange={(e) => dispatch(updateTrendsBanner({ ...trendsBanner, title: e.target.value }))} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:outline-none text-gray-900" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Highlight Tag</label>
                  <input type="text" value={trendsBanner?.tag || ''} onChange={(e) => dispatch(updateTrendsBanner({ ...trendsBanner, tag: e.target.value }))} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:outline-none text-gray-900" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle Text</label>
                  <input type="text" value={trendsBanner?.subtitle || ''} onChange={(e) => dispatch(updateTrendsBanner({ ...trendsBanner, subtitle: e.target.value }))} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:outline-none text-gray-900" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category Tabs (comma separated)</label>
                <input type="text" value={tabsStr} onChange={(e) => dispatch(updateTrendsTabs(e.target.value.split(',').map(s => s.trim()).filter(Boolean)))} placeholder="e.g. For You, Women Bags, Men Clothing" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:outline-none text-gray-900" />
                <p className="text-xs text-gray-500 mt-1">These will appear as sub-tabs under the Trends Store section.</p>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Background Image</label>
              <div className="flex gap-2 mb-3">
                <input type="text" value={trendsBanner?.backgroundImage || ''} onChange={(e) => dispatch(updateTrendsBanner({ ...trendsBanner, backgroundImage: e.target.value }))} placeholder="Image URL" className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:outline-none text-gray-900" />
                <label className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg cursor-pointer flex items-center justify-center border border-gray-200 transition-colors">
                  Upload
                  <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'trends')} className="hidden" />
                </label>
              </div>
              
              <div className="w-full h-32 rounded-lg bg-gray-100 overflow-hidden relative border border-gray-200">
                {trendsBanner?.backgroundImage ? (
                  <img src={trendsBanner.backgroundImage} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                )}
                <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                  <span className="bg-white/90 px-3 py-1 rounded text-xs font-bold shadow-sm backdrop-blur-sm">Live Preview</span>
                </div>
              </div>
            </div>

            {/* Featured Products */}
            <div className="md:col-span-2 border-t border-gray-100 pt-5 mt-3">
              <h4 className="text-sm font-bold text-gray-800 mb-3">Featured Products in Banner (4 Max)</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {getTrendsItems().map((item, idx) => {
                  return (
                    <div key={idx} className="p-3 bg-gray-50 rounded-xl border border-gray-100 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-gray-500">Product #{idx + 1}</span>
                      </div>
                      
                      {/* Image Upload/URL */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-semibold text-gray-500">Image</label>
                        <div className="flex gap-1.5">
                          <input 
                            type="text" 
                            value={item.image || ''} 
                            onChange={(e) => {
                              const currentItems = [...getTrendsItems()];
                              currentItems[idx] = { ...currentItems[idx], image: e.target.value };
                              dispatch(updateTrendsBanner({ ...trendsBanner, items: currentItems }));
                            }} 
                            placeholder="Image URL" 
                            className="w-full px-2 py-1 border border-gray-200 rounded text-xs focus:ring-1 focus:ring-black focus:outline-none text-gray-900" 
                          />
                          <label className="bg-gray-200 hover:bg-gray-300 text-gray-700 text-[10px] px-2.5 py-1 rounded cursor-pointer flex items-center justify-center font-medium">
                            Up
                            <input type="file" accept="image/*" onChange={(e) => handleTrendsItemImageUpload(idx, e)} className="hidden" />
                          </label>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-semibold text-gray-500">Price ($)</label>
                        <input 
                          type="number" 
                          step="0.01"
                          value={item.price || 0} 
                          onChange={(e) => {
                            const currentItems = [...getTrendsItems()];
                            currentItems[idx] = { ...currentItems[idx], price: parseFloat(e.target.value) || 0 };
                            dispatch(updateTrendsBanner({ ...trendsBanner, items: currentItems }));
                          }} 
                          className="w-full px-2 py-1 border border-gray-200 rounded text-xs focus:ring-1 focus:ring-black focus:outline-none text-gray-900 font-mono" 
                        />
                      </div>

                      {/* Preview */}
                      <div className="w-full h-12 rounded bg-white overflow-hidden border border-gray-200 flex items-center justify-center relative mt-1">
                        {item.image ? (
                          <img src={item.image} alt="" className="max-w-full max-h-full object-contain" />
                        ) : (
                          <span className="text-[9px] text-gray-400">No Image</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

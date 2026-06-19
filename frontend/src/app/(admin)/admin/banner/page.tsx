"use client";

import { useState } from 'react';
import { Save } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateBanner } from '@/store/siteSlice';

export default function AdminBannerPage() {
  const { banner } = useAppSelector((state) => state.site);
  const dispatch = useAppDispatch();

  const [title, setTitle] = useState(banner.title);
  const [subtitle, setSubtitle] = useState(banner.subtitle);
  const [buttonText, setButtonText] = useState(banner.buttonText);
  const [isActive, setIsActive] = useState(banner.isActive);
  const [colorFrom, setColorFrom] = useState(banner.colorFrom || '#1e3a8a');
  const [colorTo, setColorTo] = useState(banner.colorTo || '#4338ca');
  const [buttonColor, setButtonColor] = useState(banner.buttonColor || '#f97316');

  const handleSave = () => {
    dispatch(updateBanner({ title, subtitle, buttonText, isActive, colorFrom, colorTo, buttonColor }));
    alert('Banner updated! Changes are now live on the storefront.');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <h2 className="text-2xl font-bold text-gray-800">Hero Banner Editor</h2>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-800">Banner Configuration</h3>
          <div className="flex items-center">
            <input 
              type="checkbox" 
              id="isActive"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="mr-2 w-4 h-4 accent-orange-500"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-gray-700">Show Banner on Storefront</label>
          </div>
        </div>
        <div className="p-6 space-y-5">
          {/* Text Fields */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Banner Title</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none text-gray-900" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Banner Subtitle</label>
            <input 
              type="text" 
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none text-gray-900" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
            <input 
              type="text" 
              value={buttonText}
              onChange={(e) => setButtonText(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none text-gray-900" 
            />
          </div>

          {/* Color Pickers */}
          <div className="border-t border-gray-100 pt-5">
            <h4 className="text-sm font-semibold text-gray-700 mb-4">🎨 Banner Colors</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">Background Color (Left)</label>
                <div className="flex items-center gap-3">
                  <input 
                    type="color" 
                    value={colorFrom}
                    onChange={(e) => setColorFrom(e.target.value)}
                    className="w-12 h-10 p-0.5 border border-gray-200 rounded-lg cursor-pointer" 
                  />
                  <input 
                    type="text" 
                    value={colorFrom}
                    onChange={(e) => setColorFrom(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none font-mono text-sm text-gray-900" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">Background Color (Right)</label>
                <div className="flex items-center gap-3">
                  <input 
                    type="color" 
                    value={colorTo}
                    onChange={(e) => setColorTo(e.target.value)}
                    className="w-12 h-10 p-0.5 border border-gray-200 rounded-lg cursor-pointer" 
                  />
                  <input 
                    type="text" 
                    value={colorTo}
                    onChange={(e) => setColorTo(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none font-mono text-sm text-gray-900" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">Button Color</label>
                <div className="flex items-center gap-3">
                  <input 
                    type="color" 
                    value={buttonColor}
                    onChange={(e) => setButtonColor(e.target.value)}
                    className="w-12 h-10 p-0.5 border border-gray-200 rounded-lg cursor-pointer" 
                  />
                  <input 
                    type="text" 
                    value={buttonColor}
                    onChange={(e) => setButtonColor(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none font-mono text-sm text-gray-900" 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Preview */}
      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-4">Live Preview</h3>
        <div 
          className="w-full h-64 rounded-xl flex items-center justify-center text-white relative overflow-hidden shadow-xl"
          style={{ background: `linear-gradient(to right, ${colorFrom}, ${colorTo})` }}
        >
          <div className="text-center z-10 p-6">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-md">{title}</h1>
            <p className="text-lg mb-6 drop-shadow-md">{subtitle}</p>
            <button 
              className="text-white font-bold py-3 px-8 rounded-full shadow-lg"
              style={{ backgroundColor: buttonColor }}
            >
              {buttonText}
            </button>
          </div>
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 skew-x-12 transform origin-bottom-right" style={{ backgroundColor: colorTo }}></div>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button 
          onClick={handleSave}
          className="text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-opacity hover:opacity-90 font-medium shadow"
          style={{ backgroundColor: buttonColor }}
        >
          <Save size={18} /> Save & Publish
        </button>
      </div>
    </div>
  );
}

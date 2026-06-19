"use client";

import { useState, useEffect } from 'react';
import { Save, Plus, Trash2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateTheme, updateNavigation } from '@/store/siteSlice';

export default function AdminThemePage() {
  const { theme, navigation } = useAppSelector((state) => state.site);
  const dispatch = useAppDispatch();
  const rehydrated = useAppSelector((state: any) => state._persist?.rehydrated);

  const [primaryColor, setPrimaryColor] = useState(theme.primaryColor);
  const [accentColor, setAccentColor] = useState(theme.accentColor);
  const [logoText, setLogoText] = useState(theme.logoText);
  const [logoImage, setLogoImage] = useState(theme.logoImage || '');
  const [navLinks, setNavLinks] = useState([...navigation]);

  useEffect(() => {
    if (!rehydrated) return;
    setPrimaryColor(theme.primaryColor);
    setAccentColor(theme.accentColor);
    setLogoText(theme.logoText);
    setLogoImage(theme.logoImage || '');
  }, [rehydrated, theme]);

  useEffect(() => {
    if (!rehydrated) return;
    setNavLinks([...navigation]);
  }, [rehydrated, navigation]);

  const handleSave = () => {
    dispatch(updateTheme({ primaryColor, accentColor, logoText, logoImage }));
    dispatch(updateNavigation(navLinks));
    alert('Theme & UI updated successfully! Changes are live on the storefront.');
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addNavLink = () => {
    const newId = Date.now().toString();
    setNavLinks([...navLinks, { id: newId, label: 'New Link', url: '/' }]);
  };

  const removeNavLink = (id: string) => {
    setNavLinks(navLinks.filter(link => link.id !== id));
  };

  const updateNavLink = (id: string, field: 'label' | 'url', value: string) => {
    setNavLinks(navLinks.map(link => link.id === id ? { ...link, [field]: value } : link));
  };

  return (
    <div className="space-y-6 max-w-4xl pb-12">
      <h2 className="text-2xl font-bold text-gray-800">Theme & UI Builder</h2>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50">
          <h3 className="text-lg font-bold text-gray-800">Global Branding</h3>
        </div>
        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Logo Text</label>
            <input 
              type="text" 
              value={logoText}
              onChange={(e) => setLogoText(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none text-gray-900" 
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Logo Image (Overrides text logo)</label>
            <div className="flex gap-4 items-center">
              <input 
                type="text" 
                value={logoImage}
                onChange={(e) => setLogoImage(e.target.value)}
                placeholder="Paste Image URL or upload a file"
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none text-gray-900 text-sm" 
              />
              <label className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg cursor-pointer border border-gray-200 transition-colors font-medium text-sm flex-shrink-0">
                Upload Logo
                <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
              </label>
              {logoImage && (
                <div className="w-16 h-10 border border-gray-200 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center flex-shrink-0">
                  <img src={logoImage} alt="Logo Preview" className="max-w-full max-h-full object-contain" />
                </div>
              )}
            </div>
            {logoImage && (
              <button 
                type="button" 
                onClick={() => setLogoImage('')}
                className="text-xs text-red-500 underline mt-1.5"
              >
                Remove logo image (Revert to text logo)
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Primary Color (Navbar, Footer)</label>
              <div className="flex items-center gap-3">
                <input 
                  type="color" 
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-12 h-12 p-1 border border-gray-200 rounded cursor-pointer" 
                />
                <input 
                  type="text" 
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none font-mono text-sm text-gray-900" 
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Accent Color (Buttons, Links)</label>
              <div className="flex items-center gap-3">
                <input 
                  type="color" 
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="w-12 h-12 p-1 border border-gray-200 rounded cursor-pointer" 
                />
                <input 
                  type="text" 
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none font-mono text-sm text-gray-900" 
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-800">Navigation Menu</h3>
          <button 
            onClick={addNavLink}
            className="text-sm bg-gray-900 text-white px-3 py-1.5 rounded flex items-center gap-1 hover:bg-gray-800 transition-colors"
          >
            <Plus size={16} /> Add Link
          </button>
        </div>
        <div className="p-6 space-y-4">
          {navLinks.map((link, index) => (
            <div key={link.id} className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
              <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center font-bold text-gray-500 text-sm">
                {index + 1}
              </div>
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-500 mb-1">Label</label>
                <input 
                  type="text" 
                  value={link.label}
                  onChange={(e) => updateNavLink(link.id, 'label', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded focus:ring-2 focus:ring-orange-500 focus:outline-none text-sm text-gray-900" 
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-500 mb-1">URL / Path</label>
                <input 
                  type="text" 
                  value={link.url}
                  onChange={(e) => updateNavLink(link.id, 'url', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded focus:ring-2 focus:ring-orange-500 focus:outline-none font-mono text-sm text-gray-900" 
                />
              </div>
              <button 
                onClick={() => removeNavLink(link.id)}
                className="mt-5 text-red-500 hover:text-red-700 p-2"
                title="Remove Link"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button 
          onClick={handleSave}
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors font-medium"
        >
          <Save size={18} /> Save & Publish UI
        </button>
      </div>
    </div>
  );
}

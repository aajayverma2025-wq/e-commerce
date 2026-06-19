"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateVendor } from '@/store/vendorSlice';
import { addProduct, deleteProduct } from '@/store/productSlice';
import { logout } from '@/store/userSlice';
import { 
  Store, LayoutDashboard, Palette, Package, FileText, LogOut, CheckCircle, 
  Trash2, Plus, Info, RefreshCw, Layers 
} from 'lucide-react';
import Link from 'next/link';

export default function VendorDashboardPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  // Get active session user
  const { user, isAuthenticated } = useAppSelector((state) => state.user);
  const { vendors } = useAppSelector((state) => state.vendors);
  const allProducts = useAppSelector((state) => state.products.items);

  const vendorId = user?.vendorId;
  const currentVendor = vendors.find(v => v.id === vendorId);

  const rehydrated = useAppSelector((state: any) => state._persist?.rehydrated);

  // Redirection checks
  useEffect(() => {
    if (!rehydrated) return;
    if (!isAuthenticated || user?.role !== 'vendor' || !vendorId) {
      router.push('/vendor/login');
    }
  }, [rehydrated, isAuthenticated, user, vendorId, router]);

  // Sidebar Tab State
  const [activeTab, setActiveTab] = useState<'overview' | 'storefront' | 'products'>('overview');
  
  // Toast State
  const [toast, setToast] = useState('');
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };
  const [toastMessage, setToastMessage] = useState('');

  // Storefront Builder State
  const [logo, setLogo] = useState('');
  const [bannerUrl, setBannerUrl] = useState('');
  const [themeColor, setThemeColor] = useState('#1e3a8a');
  const [accentColor, setAccentColor] = useState('#f97316');
  
  // Homepage Sections toggles
  const [showHeroSlider, setShowHeroSlider] = useState(true);
  const [showPromos, setShowPromos] = useState(true);
  const [showCategories, setShowCategories] = useState(true);
  const [showFilterTabs, setShowFilterTabs] = useState(true);

  // About Page details
  const [aboutTitle, setAboutTitle] = useState('');
  const [aboutStory, setAboutStory] = useState('');
  const [aboutMission, setAboutMission] = useState('');

  // Featured Products
  const [featuredProducts, setFeaturedProducts] = useState<string[]>([]);

  // Sync Storefront Builder Form when vendor profile loads
  useEffect(() => {
    if (!rehydrated) return;
    if (currentVendor?.storeConfig) {
      const config = currentVendor.storeConfig;
      setLogo(config.logo || '');
      setBannerUrl(config.banner || '');
      setThemeColor(config.themeColor || '#1e3a8a');
      setAccentColor(config.accentColor || '#f97316');
      setShowHeroSlider(config.showHeroSlider !== false);
      setShowPromos(config.showPromos !== false);
      setShowCategories(config.showCategories !== false);
      setShowFilterTabs(config.showFilterTabs !== false);
      setAboutTitle(config.aboutTitle || currentVendor.businessName);
      setAboutStory(config.aboutStory || '');
      setAboutMission(config.aboutMission || '');
      setFeaturedProducts(config.featuredProducts || []);
    } else if (currentVendor) {
      setAboutTitle(currentVendor.businessName);
    }
  }, [rehydrated, currentVendor]);

  // Filter products by current vendor
  const vendorProducts = allProducts.filter(p => p.vendorId === vendorId);

  // Add Product Form State
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdOriginalPrice, setNewProdOriginalPrice] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('Electronics');
  const [newProdImage, setNewProdImage] = useState('');
  const [newProdStock, setNewProdStock] = useState('50');

  // Handle Logo Upload File
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Banner Upload File
  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Save Storefront Customizations
  const handleSaveStorefront = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendorId) return;

    dispatch(updateVendor({
      id: vendorId,
      storeConfig: {
        logo,
        banner: bannerUrl,
        themeColor,
        accentColor,
        showHeroSlider,
        showPromos,
        showCategories,
        showFilterTabs,
        aboutTitle,
        aboutStory,
        aboutMission,
        featuredProducts,
      }
    }));

    triggerToast('Your storefront settings have been saved & are now live!');
  };

  // Handle Add Product Submit
  const handleAddProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendorId) return;

    const priceNum = parseFloat(newProdPrice);
    const origPriceNum = parseFloat(newProdOriginalPrice) || undefined;
    const stockNum = parseInt(newProdStock) || 0;

    dispatch(addProduct({
      name: newProdName,
      price: priceNum,
      originalPrice: origPriceNum,
      discount: origPriceNum && origPriceNum > priceNum ? Math.round(((origPriceNum - priceNum) / origPriceNum) * 100) : undefined,
      category: newProdCategory,
      image: newProdImage || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=150',
      images: [newProdImage || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=150'],
      stock: stockNum,
      status: stockNum > 10 ? 'In Stock' : stockNum > 0 ? 'Low Stock' : 'Out of Stock',
      rating: 4.5,
      reviews: 1,
      vendorId: vendorId,
    }));

    // Reset Add Form
    setNewProdName('');
    setNewProdPrice('');
    setNewProdOriginalPrice('');
    setNewProdImage('');
    setNewProdStock('50');
    setShowAddProductModal(false);
    
    triggerToast('New product added to your catalog successfully.');
  };

  // Handle Logout
  const handleLogout = () => {
    dispatch(logout());
    router.push('/vendor/login');
  };

  // Toggle selection for featured products
  const handleToggleFeaturedProduct = (prodId: string) => {
    if (featuredProducts.includes(prodId)) {
      setFeaturedProducts(featuredProducts.filter(id => id !== prodId));
    } else {
      if (featuredProducts.length >= 4) {
        alert('You can select a maximum of 4 featured products.');
        return;
      }
      setFeaturedProducts([...featuredProducts, prodId]);
    }
  };

  if (!currentVendor) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col flex-shrink-0">
        <div className="p-6 border-b border-slate-800 flex items-center gap-2">
          <Store className="text-orange-500" size={24} />
          <div>
            <h1 className="font-extrabold text-sm tracking-wide truncate">{currentVendor.businessName}</h1>
            <span className="text-[10px] text-gray-400 font-mono">Vendor Dashboard</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1.5">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold text-sm ${
              activeTab === 'overview' ? 'bg-orange-500 text-white shadow-md' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <LayoutDashboard size={18} /> Overview
          </button>
          <button 
            onClick={() => setActiveTab('storefront')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold text-sm ${
              activeTab === 'storefront' ? 'bg-orange-500 text-white shadow-md' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Palette size={18} /> Store Customizer
          </button>
          <button 
            onClick={() => setActiveTab('products')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold text-sm ${
              activeTab === 'products' ? 'bg-orange-500 text-white shadow-md' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Package size={18} /> My Products ({vendorProducts.length})
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <Link href={`/shop/${vendorId}`} target="_blank">
            <span className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer mb-2">
              <Store size={14} /> View Storefront 🔗
            </span>
          </Link>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-red-600/10 hover:bg-red-600 hover:text-white text-red-500 rounded-lg text-xs font-bold transition-all"
          >
            <LogOut size={14} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-y-auto max-w-5xl">
        {/* Toast Alert */}
        {toastMessage && (
          <div className="fixed top-6 right-6 z-50 bg-green-500 text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-2 border border-green-400 animate-bounce">
            <CheckCircle size={18} /> {toastMessage}
          </div>
        )}

        {/* Title */}
        <div className="flex justify-between items-center mb-8 border-b border-gray-200 pb-4">
          <div>
            <h2 className="text-3xl font-black text-gray-800 capitalize">
              {activeTab === 'overview' && 'Dashboard Overview'}
              {activeTab === 'storefront' && 'Storefront Customizer'}
              {activeTab === 'products' && 'Product Catalog'}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Welcome back, <span className="font-bold text-gray-700">{currentVendor.ownerName}</span>. Manage your shop configs below.
            </p>
          </div>
          <span className="text-xs bg-green-50 border border-green-200 text-green-700 px-3.5 py-1.5 rounded-full font-bold uppercase tracking-wider">
            ● Status: {currentVendor.status}
          </span>
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Active Products</span>
                <span className="text-3xl font-black text-slate-800 mt-2">{vendorProducts.length}</span>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Store Revenue</span>
                <span className="text-3xl font-black text-green-600 mt-2">Rs. {currentVendor.revenue.toLocaleString()}</span>
              </div>
              <span className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Joined Since</span>
                <span className="text-sm font-black text-slate-800 mt-2">{currentVendor.joinedDate}</span>
              </span>
              <span className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Main Category</span>
                <span className="text-sm font-black text-orange-500 mt-2">{currentVendor.category}</span>
              </span>
            </div>

            {/* Quick Profile Summary */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2 border-b border-gray-50 pb-3">
                <Info size={18} className="text-orange-500" /> Account Registration Details
              </h3>
              <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm">
                <div>
                  <span className="text-gray-400 block text-xs">Business Name</span>
                  <span className="font-bold text-gray-800">{currentVendor.businessName}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-xs">Owner Name</span>
                  <span className="font-bold text-gray-800">{currentVendor.ownerName}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-xs">Email Address</span>
                  <span className="font-bold text-gray-800">{currentVendor.email}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-xs">Contact Number</span>
                  <span className="font-bold text-gray-800">{currentVendor.contact}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Storefront Customizer */}
        {activeTab === 'storefront' && (
          <form onSubmit={handleSaveStorefront} className="space-y-6">
            {/* Identity Settings */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-slate-800 border-b border-gray-50 pb-2 flex items-center gap-2">
                <Palette size={18} className="text-orange-500" /> Theme & Branding
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Store Logo */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Store Logo</label>
                  <div className="flex gap-2 items-center">
                    <input 
                      type="text" 
                      value={logo} 
                      onChange={(e) => setLogo(e.target.value)} 
                      placeholder="Image URL" 
                      className="flex-1 px-3.5 py-2 border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-orange-500"
                    />
                    <label className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs px-4 py-2.5 rounded-xl cursor-pointer border font-bold flex-shrink-0 transition-colors">
                      Upload
                      <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                    </label>
                  </div>
                  {logo && (
                    <div className="mt-2 w-16 h-16 rounded-xl border overflow-hidden bg-gray-50 flex items-center justify-center">
                      <img src={logo} alt="Logo" className="max-w-full max-h-full object-contain" />
                    </div>
                  )}
                </div>

                {/* Store Banner */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Store Banner Image</label>
                  <div className="flex gap-2 items-center">
                    <input 
                      type="text" 
                      value={bannerUrl} 
                      onChange={(e) => setBannerUrl(e.target.value)} 
                      placeholder="Image URL" 
                      className="flex-1 px-3.5 py-2 border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-orange-500"
                    />
                    <label className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs px-4 py-2.5 rounded-xl cursor-pointer border font-bold flex-shrink-0 transition-colors">
                      Upload
                      <input type="file" accept="image/*" onChange={handleBannerUpload} className="hidden" />
                    </label>
                  </div>
                  {bannerUrl && (
                    <div className="mt-2 w-32 h-16 rounded-xl border overflow-hidden bg-gray-50">
                      <img src={bannerUrl} alt="Banner" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>

              {/* Theme Colors */}
              <div className="grid grid-cols-2 gap-6 pt-2">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Theme Primary Color</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={themeColor} onChange={(e) => setThemeColor(e.target.value)} className="w-10 h-10 p-0.5 border rounded cursor-pointer" />
                    <input type="text" value={themeColor} onChange={(e) => setThemeColor(e.target.value)} className="flex-1 px-3 py-2 border rounded-xl text-xs font-mono" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Theme Accent Color</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={accentColor} onChange={(e) => setAccentColor(e.target.value)} className="w-10 h-10 p-0.5 border rounded cursor-pointer" />
                    <input type="text" value={accentColor} onChange={(e) => setAccentColor(e.target.value)} className="flex-1 px-3 py-2 border rounded-xl text-xs font-mono" />
                  </div>
                </div>
              </div>
            </div>

            {/* Homepage Sections display toggles */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-slate-800 border-b border-gray-50 pb-2 flex items-center gap-2">
                <Layers size={18} className="text-orange-500" /> Homepage Sections Config
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer border border-gray-100 hover:bg-gray-100/50 transition-colors">
                  <input type="checkbox" checked={showHeroSlider} onChange={(e) => setShowHeroSlider(e.target.checked)} className="w-4 h-4 accent-orange-500" />
                  <div>
                    <span className="text-xs font-bold text-gray-800 block">Show Banner Slider</span>
                    <span className="text-[10px] text-gray-400">Toggles the big slide banner hero at top</span>
                  </div>
                </label>
                <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer border border-gray-100 hover:bg-gray-100/50 transition-colors">
                  <input type="checkbox" checked={showPromos} onChange={(e) => setShowPromos(e.target.checked)} className="w-4 h-4 accent-orange-500" />
                  <div>
                    <span className="text-xs font-bold text-gray-800 block">Show Promo Bar</span>
                    <span className="text-[10px] text-gray-400">Toggles Free Shipping & Flash Sale bar</span>
                  </div>
                </label>
                <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer border border-gray-100 hover:bg-gray-100/50 transition-colors">
                  <input type="checkbox" checked={showCategories} onChange={(e) => setShowCategories(e.target.checked)} className="w-4 h-4 accent-orange-500" />
                  <div>
                    <span className="text-xs font-bold text-gray-800 block">Show Circular Categories</span>
                    <span className="text-[10px] text-gray-400">Displays circles of product category shortcuts</span>
                  </div>
                </label>
                <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer border border-gray-100 hover:bg-gray-100/50 transition-colors">
                  <input type="checkbox" checked={showFilterTabs} onChange={(e) => setShowFilterTabs(e.target.checked)} className="w-4 h-4 accent-orange-500" />
                  <div>
                    <span className="text-xs font-bold text-gray-800 block">Show Filter Navigation Tabs</span>
                    <span className="text-[10px] text-gray-400">Allows customer tabs filtering of products</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Featured Products */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-3">
              <h3 className="text-lg font-bold text-slate-800 border-b border-gray-50 pb-2 flex items-center gap-2">
                <Store size={18} className="text-orange-500" /> Featured Storefront Products (Max 4)
              </h3>
              <p className="text-xs text-gray-400 mb-3">Select the products you want highlighted in your store hero section.</p>
              
              {vendorProducts.length === 0 ? (
                <div className="text-center py-6 text-gray-400 text-xs font-semibold">
                  You have no products listed. Add products in the Product catalog tab to feature them.
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {vendorProducts.map(p => {
                    const isSelected = featuredProducts.includes(p.id);
                    return (
                      <div 
                        key={p.id}
                        onClick={() => handleToggleFeaturedProduct(p.id)}
                        className={`p-3 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between gap-2 bg-gray-50 ${
                          isSelected ? 'border-orange-500 bg-orange-50/20' : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex gap-2">
                          <img src={p.image} className="w-10 h-10 object-contain bg-white rounded border flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="text-[10px] font-bold text-gray-800 truncate">{p.name}</p>
                            <p className="text-[9px] text-gray-400 font-bold">${p.price.toFixed(2)}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${isSelected ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                            {isSelected ? 'Featured' : 'Select'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* About Store Page Configuration */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-slate-800 border-b border-gray-50 pb-2 flex items-center gap-2">
                <FileText size={18} className="text-orange-500" /> About Store Details
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">About Store Title</label>
                  <input 
                    type="text" 
                    value={aboutTitle} 
                    onChange={(e) => setAboutTitle(e.target.value)} 
                    placeholder="e.g. About Tech Solutions Nepal" 
                    className="w-full px-3.5 py-2 border rounded-xl text-xs focus:ring-1 focus:ring-orange-500 text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Our Story / Description</label>
                  <textarea 
                    value={aboutStory} 
                    onChange={(e) => setAboutStory(e.target.value)} 
                    placeholder="Describe your business and history..." 
                    rows={4}
                    className="w-full px-3.5 py-2 border rounded-xl text-xs focus:ring-1 focus:ring-orange-500 text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Our Mission Statement</label>
                  <input 
                    type="text" 
                    value={aboutMission} 
                    onChange={(e) => setAboutMission(e.target.value)} 
                    placeholder="What is your store's core mission?" 
                    className="w-full px-3.5 py-2 border rounded-xl text-xs focus:ring-1 focus:ring-orange-500 text-gray-800"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button 
                type="submit" 
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm px-8 py-3.5 rounded-xl shadow-lg shadow-orange-200 transition-all flex items-center gap-2 active:scale-95 cursor-pointer"
              >
                <CheckCircle size={18} /> Save storefront settings
              </button>
            </div>
          </form>
        )}

        {/* Tab 3: Products */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-4 rounded-xl border shadow-sm">
              <span className="text-xs font-bold text-gray-500">Listed Products catalog: {vendorProducts.length}</span>
              <button 
                onClick={() => setShowAddProductModal(true)} 
                className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow"
              >
                <Plus size={14} /> Add Product
              </button>
            </div>

            {vendorProducts.length === 0 ? (
              <div className="bg-white border rounded-2xl p-16 text-center text-gray-400">
                <Package size={48} className="mx-auto mb-2 opacity-25" />
                <p className="font-semibold text-sm">No products listed under your business.</p>
                <p className="text-xs mt-1">Click "Add Product" above to populate your catalog.</p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider border-b border-gray-100">
                      <th className="p-4">Product Info</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Price</th>
                      <th className="p-4">Stock</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vendorProducts.map(p => (
                      <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img src={p.image} className="w-12 h-12 object-contain bg-white rounded border p-1" />
                            <div>
                              <p className="font-bold text-sm text-gray-900 leading-tight">{p.name}</p>
                              <span className="text-[10px] text-gray-400">ID: {p.id}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-xs font-semibold text-gray-500">{p.category}</td>
                        <td className="p-4 font-mono text-sm font-bold text-gray-800">${p.price.toFixed(2)}</td>
                        <td className="p-4 text-xs font-bold text-gray-600">{p.stock} pcs</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            p.status === 'In Stock' ? 'bg-green-50 text-green-700 border border-green-200' :
                            p.status === 'Low Stock' ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' :
                            'bg-red-50 text-red-700 border border-red-200'
                          }`}>
                            {p.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button 
                            onClick={() => dispatch(deleteProduct(p.id))}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>

      {/* ── ADD PRODUCT MODAL ── */}
      {showAddProductModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border">
            <div className="p-5 bg-gray-50 border-b flex justify-between items-center">
              <span className="font-extrabold text-gray-800">Add Product to Catalog</span>
              <button onClick={() => setShowAddProductModal(false)} className="text-gray-400 hover:text-black">×</button>
            </div>
            
            <form onSubmit={handleAddProductSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Product Name *</label>
                <input 
                  type="text" 
                  value={newProdName} 
                  onChange={(e) => setNewProdName(e.target.value)} 
                  required
                  placeholder="e.g. Wireless Ergonomic Mouse"
                  className="w-full px-3.5 py-2 border rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Sale Price ($) *</label>
                  <input 
                    type="number" 
                    step="0.01"
                    value={newProdPrice} 
                    onChange={(e) => setNewProdPrice(e.target.value)} 
                    required
                    placeholder="29.99"
                    className="w-full px-3.5 py-2 border rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Original Price ($)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    value={newProdOriginalPrice} 
                    onChange={(e) => setNewProdOriginalPrice(e.target.value)} 
                    placeholder="39.99"
                    className="w-full px-3.5 py-2 border rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Category</label>
                  <select 
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value)}
                    className="w-full px-3.5 py-2 border rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  >
                    <option value="Electronics">Electronics</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Shoes">Shoes</option>
                    <option value="Jewelry">Jewelry</option>
                    <option value="Dresses">Dresses</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Stock Qty *</label>
                  <input 
                    type="number" 
                    value={newProdStock} 
                    onChange={(e) => setNewProdStock(e.target.value)} 
                    required
                    className="w-full px-3.5 py-2 border rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Product Image URL</label>
                <input 
                  type="text" 
                  value={newProdImage} 
                  onChange={(e) => setNewProdImage(e.target.value)} 
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2 border rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowAddProductModal(false)}
                  className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-orange-200 transition-all"
                >
                  Add to Store Catalog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

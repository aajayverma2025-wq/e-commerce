"use client";

import { use, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { addToCart } from '@/store/cartSlice';
import { toggleWishlist } from '@/store/userSlice';
import { 
  Store, ShoppingCart, Heart, Flame, LayoutGrid, Info, 
  Mail, Phone, Calendar, Sparkles, AlertCircle 
} from 'lucide-react';

export default function VendorStorefrontPage({ params }: { params: Promise<{ vendorId: string }> }) {
  const resolvedParams = use(params);
  const vendorId = resolvedParams.vendorId;
  const dispatch = useAppDispatch();

  // Redux store selectors
  const { vendors } = useAppSelector((state) => state.vendors);
  const allProducts = useAppSelector((state) => state.products.items).filter(p => !p.hidden);
  const { wishlist = [] } = useAppSelector((state) => state.user);

  // Find vendor profile
  const vendor = vendors.find(v => v.id === vendorId);

  // Storefront configuration defaults
  const config = vendor?.storeConfig || {};
  const themeColor = config.themeColor || '#1e3a8a';
  const accentColor = config.accentColor || '#f97316';
  const bannerImg = config.banner || '';
  const storeLogo = config.logo || '';
  
  const showHeroSlider = config.showHeroSlider !== false;
  const showPromos = config.showPromos !== false;
  const showCategories = config.showCategories !== false;
  const showFilterTabs = config.showFilterTabs !== false;

  const aboutTitle = config.aboutTitle || vendor?.businessName || 'About Store';
  const aboutStory = config.aboutStory || 'Welcome to our store. We offer high-quality products and excellent customer service.';
  const aboutMission = config.aboutMission || 'To provide the best products and value to our customers.';

  // Tab State
  const [activeTab, setActiveTab] = useState<'shop' | 'about'>('shop');
  
  // Filter products by vendorId
  const vendorProducts = allProducts.filter(p => p.vendorId === vendorId);

  // Filter categories from products
  const categories = Array.from(new Set(vendorProducts.map(p => p.category)));
  const [activeCategoryTab, setActiveCategoryTab] = useState('all');

  // Display products filtered by category tab
  const displayProducts = activeCategoryTab === 'all'
    ? vendorProducts
    : vendorProducts.filter(p => p.category === activeCategoryTab);

  // Get featured products
  const featuredIds = config.featuredProducts || [];
  const featuredProducts = vendorProducts.filter(p => featuredIds.includes(p.id));

  if (!vendor) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <AlertCircle size={48} className="text-red-500 mb-3" />
        <h2 className="text-xl font-bold text-gray-800">Store Not Found</h2>
        <p className="text-gray-500 text-sm mt-1">The store ID you are trying to visit does not exist or has been removed.</p>
        <Link href="/" className="mt-6 px-6 py-2.5 bg-black text-white rounded-xl text-xs font-bold shadow hover:bg-gray-800 transition-colors">
          Go Back Home
        </Link>
      </div>
    );
  }

  if (vendor.status !== 'Active') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <AlertCircle size={48} className="text-amber-500 mb-3" />
        <h2 className="text-xl font-bold text-gray-800">Store Temporarily Offline</h2>
        <p className="text-gray-500 text-sm mt-1">This storefront is currently pending approval or suspended.</p>
        <Link href="/" className="mt-6 px-6 py-2.5 bg-black text-white rounded-xl text-xs font-bold shadow hover:bg-gray-800 transition-colors">
          Go Back Home
        </Link>
      </div>
    );
  }

  return (
    <div className="pb-12 bg-gray-50 min-h-screen">
      {/* Dynamic Style injection for Theme Colors */}
      <style jsx global>{`
        .theme-primary-bg { background-color: ${themeColor} !important; }
        .theme-primary-text { color: ${themeColor} !important; }
        .theme-primary-border { border-color: ${themeColor} !important; }
        .theme-accent-bg { background-color: ${accentColor} !important; }
        .theme-accent-text { color: ${accentColor} !important; }
        .theme-accent-ring:focus { --tw-ring-color: ${accentColor} !important; }
      `}</style>

      {/* Store Banner Hero */}
      {showHeroSlider && (
        <div className="relative w-full h-48 md:h-72 text-white overflow-hidden flex items-end">
          {bannerImg ? (
            <img src={bannerImg} alt={vendor.businessName} className="absolute inset-0 w-full h-full object-cover z-0" />
          ) : (
            <div className="absolute inset-0 z-0 theme-primary-bg opacity-90"></div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-0"></div>

          {/* Profile Header Container */}
          <div className="container mx-auto px-4 md:px-8 pb-6 relative z-10 flex flex-col md:flex-row items-center md:items-end gap-4 w-full">
            {/* Store Logo */}
            <div className="w-20 h-20 md:w-28 md:h-28 rounded-full border-4 border-white bg-white overflow-hidden flex items-center justify-center shadow-lg flex-shrink-0">
              {storeLogo ? (
                <img src={storeLogo} alt="Store Logo" className="max-w-full max-h-full object-contain" />
              ) : (
                <Store size={40} className="theme-primary-text" />
              )}
            </div>
            
            {/* Titles */}
            <div className="text-center md:text-left flex-1 min-w-0">
              <h1 className="text-2xl md:text-4xl font-black tracking-tight drop-shadow-md flex items-center justify-center md:justify-start gap-2">
                {vendor.businessName}
                <span className="text-[10px] bg-white/20 backdrop-blur border border-white/20 text-white px-2 py-0.5 rounded-full not-italic tracking-wider uppercase font-mono">
                  {vendor.category}
                </span>
              </h1>
              <p className="text-xs md:text-sm text-gray-200 mt-1 drop-shadow-sm font-medium">
                Store Owner: <span className="font-bold">{vendor.ownerName}</span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation tabs */}
      <div className="bg-white border-b border-gray-100 sticky top-[108px] md:top-[140px] z-30 shadow-sm">
        <div className="container mx-auto px-4 flex justify-center gap-8">
          <button 
            onClick={() => setActiveTab('shop')}
            className={`py-4 font-bold text-sm border-b-2 transition-all ${
              activeTab === 'shop' ? 'border-orange-500 text-orange-500' : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            Store Shop
          </button>
          <button 
            onClick={() => setActiveTab('about')}
            className={`py-4 font-bold text-sm border-b-2 transition-all ${
              activeTab === 'about' ? 'border-orange-500 text-orange-500' : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            About Store
          </button>
        </div>
      </div>

      {activeTab === 'shop' ? (
        <div className="container mx-auto px-4 md:px-8 mt-6 space-y-8">
          {/* Promo highlight bar */}
          {showPromos && (
            <div className="bg-orange-50/50 border border-orange-100 rounded-xl p-4 flex items-center gap-3 text-orange-800 text-xs font-semibold">
              <Sparkles size={16} className="text-orange-500 flex-shrink-0" />
              <span>Welcome to {vendor.businessName}! Check out our catalog below for the best rates in {vendor.category.toLowerCase()}.</span>
            </div>
          )}

          {/* Featured products highlights */}
          {featuredProducts.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-1.5">
                <Sparkles size={18} className="theme-accent-text" /> Featured Store Products
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {featuredProducts.map(p => (
                  <Link href={`/product/${p.id}`} key={p.id} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm flex items-center gap-3 hover:scale-102 transition-transform cursor-pointer">
                    <img src={p.image} className="w-16 h-16 object-contain bg-white rounded border flex-shrink-0 p-1" />
                    <div className="min-w-0">
                      <h4 className="font-bold text-xs text-gray-800 truncate leading-snug">{p.name}</h4>
                      <div className="mt-1 flex items-baseline gap-1">
                        <span className="font-black text-sm theme-accent-text">${p.price.toFixed(2)}</span>
                        {p.originalPrice && p.originalPrice > p.price && (
                          <span className="text-[10px] text-gray-400 line-through">${p.originalPrice.toFixed(2)}</span>
                        )}
                      </div>
                      <span className="inline-block text-[9px] bg-orange-50 text-orange-600 px-2 py-0.5 rounded-full font-bold mt-1 uppercase tracking-wider">Featured</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Category tabs */}
          {showFilterTabs && categories.length > 0 && (
            <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
              <button 
                onClick={() => setActiveCategoryTab('all')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold border whitespace-nowrap transition-all ${
                  activeCategoryTab === 'all' 
                    ? 'theme-primary-bg text-white theme-primary-border shadow-sm'
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}
              >
                All Products
              </button>
              {categories.map((cat, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveCategoryTab(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold border whitespace-nowrap transition-all ${
                    activeCategoryTab === cat
                      ? 'theme-primary-bg text-white theme-primary-border shadow-sm'
                      : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {/* Products grid */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-1.5">
              <LayoutGrid size={18} className="text-gray-400" /> Store Catalog ({displayProducts.length} Items)
            </h3>

            {displayProducts.length === 0 ? (
              <div className="py-16 text-center text-gray-400 bg-white border rounded-2xl">
                <Store size={48} className="mx-auto mb-2 opacity-25" />
                <p className="font-semibold text-sm">No products found in this category.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {displayProducts.map(p => (
                  <Link 
                    href={`/product/${p.id}`} 
                    key={p.id}
                    className="bg-white rounded-lg overflow-hidden flex flex-col shadow-sm relative group cursor-pointer border hover:border-gray-300 transition-colors"
                  >
                    <div className="relative aspect-square w-full bg-gray-50 p-3">
                      <Image src={p.image} alt={p.name} fill className="object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300" />
                      
                      {p.discount && p.discount > 0 ? (
                        <div className="absolute bottom-2 left-2 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded z-10">
                          -{p.discount}%
                        </div>
                      ) : null}

                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          dispatch(toggleWishlist({
                            id: p.id,
                            name: p.name,
                            price: p.price,
                            image: p.image,
                            sold: p.soldCount
                          }));
                        }}
                        className="absolute top-2 right-2 z-10 p-1.5 bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors"
                      >
                        <Heart
                          size={16}
                          className={wishlist.some(w => w.id === p.id) ? "fill-red-500 text-red-500" : "text-gray-400"}
                        />
                      </button>
                    </div>

                    <div className="p-3 flex flex-col flex-grow relative">
                      <h4 className="text-xs font-bold text-gray-800 line-clamp-2 leading-tight mb-1">{p.name}</h4>
                      {p.soldCount && p.soldCount > 0 && (
                        <div className="flex items-center gap-1 text-[9px] text-gray-500 mb-2">
                          <Flame size={10} className="text-orange-500 fill-orange-500" />
                          {p.soldCount}+ sold
                        </div>
                      )}
                      <div className="mt-auto pt-1 flex items-end gap-1">
                        <span className="text-base font-black text-black leading-none theme-accent-text">${p.price.toFixed(2)}</span>
                        {p.originalPrice && p.originalPrice > p.price && (
                          <span className="text-[10px] text-gray-400 line-through leading-none mb-[2px]">${p.originalPrice.toFixed(2)}</span>
                        )}
                      </div>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          dispatch(addToCart({
                            id: p.id,
                            name: p.name,
                            price: p.price,
                            image: p.image
                          }));
                        }}
                        className="absolute bottom-2 right-2 w-7 h-7 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors shadow-md z-20"
                      >
                        <ShoppingCart size={12} />
                      </button>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Tab 2: About Store */
        <div className="container mx-auto px-4 md:px-8 mt-6 max-w-3xl space-y-6">
          {/* Main Story */}
          <div className="bg-white rounded-2xl border p-6 shadow-sm space-y-4">
            <h3 className="text-xl font-bold text-gray-800 border-b pb-3 flex items-center gap-2">
              <Info size={20} className="theme-accent-text" /> {aboutTitle}
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{aboutStory}</p>
          </div>

          {/* Mission statement */}
          <div className="bg-white rounded-2xl border p-6 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Our Mission</h3>
            <blockquote className="border-l-4 theme-primary-border pl-4 italic text-gray-700 text-sm">
              "{aboutMission}"
            </blockquote>
          </div>

          {/* Contacts */}
          <div className="bg-white rounded-2xl border p-6 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-gray-800 border-b pb-3 flex items-center gap-2">
              Contact Business & Support
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center theme-primary-text">
                  <Mail size={16} />
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 block font-bold">Email Address</span>
                  <span className="font-semibold text-gray-800">{vendor.email}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center theme-primary-text">
                  <Phone size={16} />
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 block font-bold">Phone Number</span>
                  <span className="font-semibold text-gray-800">{vendor.contact}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 md:col-span-2">
                <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center theme-primary-text">
                  <Calendar size={16} />
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 block font-bold">Joined Platform Since</span>
                  <span className="font-semibold text-gray-800">{vendor.joinedDate}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

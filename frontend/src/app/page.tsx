"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { addToCart } from '@/store/cartSlice';
import { toggleWishlist } from '@/store/userSlice';
import { Zap, Truck, ShoppingCart, Flame, Heart, LayoutGrid } from 'lucide-react';

export default function Home() {
  const { banner, appCategories = [] } = useAppSelector((state) => state.site);
  const allProducts = useAppSelector((state) => state.products.items).filter(p => !p.hidden);
  const { wishlist = [] } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  // Deduplicate categories for display
  const seenNames = new Set<string>();
  const uniqueCategories = appCategories.filter(c => {
    const key = c.name.trim().toLowerCase();
    if (seenNames.has(key)) return false;
    seenNames.add(key);
    return true;
  });

  // Active tab: 'all' or a category name
  const [activeTab, setActiveTab] = useState('all');

  // Smart match: handles singular/plural and case differences
  const matchCategory = (productCat: string, filterCat: string) => {
    const a = productCat.trim().toLowerCase();
    const b = filterCat.trim().toLowerCase();
    return (
      a === b ||
      a === b + 's' ||
      a + 's' === b ||
      a === b + 'es' ||
      a + 'es' === b ||
      a.startsWith(b) ||
      b.startsWith(a)
    );
  };

  // Filter products by active tab
  const products = activeTab === 'all'
    ? allProducts
    : allProducts.filter(p => matchCategory(p.category, activeTab));

  return (
    <div className="pb-4">
      {/* Hero Banner */}
      {banner.isActive && (
        <div 
          className="relative w-full h-48 md:h-96 flex items-center justify-center text-white overflow-hidden"
          style={{ background: `linear-gradient(to right, ${banner.colorFrom || '#1e3a8a'}, ${banner.colorTo || '#4338ca'})` }}
        >
          <div className="text-center z-10 p-4 w-full">
            <h1 className="text-3xl md:text-6xl font-black italic mb-2 tracking-tighter drop-shadow-md">{banner.title}</h1>
            <p className="text-sm md:text-xl mb-4 drop-shadow-md font-medium">{banner.subtitle}</p>
            <button 
              className="text-white font-bold py-3 px-8 rounded-full shadow-lg hover:opacity-90 transition-opacity"
              style={{ backgroundColor: banner.buttonColor || '#f97316' }}
            >
              {banner.buttonText}
            </button>
          </div>
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 skew-x-12 transform origin-bottom-right" style={{ backgroundColor: banner.colorTo || '#4338ca' }}></div>
        </div>
      )}

      {/* Promos */}
      <div className="flex bg-[#fcf8f2] border-b border-gray-100 divide-x divide-gray-200">
        <div className="flex-1 p-3 flex flex-col justify-center pl-4">
          <div className="flex items-center gap-1 text-[#8b4513] font-bold text-sm">
            <Truck size={16} /> Free Shipping
          </div>
          <div className="text-xs text-gray-500">Buy $129.00 more to get</div>
        </div>
        <div className="flex-1 p-3 flex flex-col justify-center pl-4">
          <div className="flex items-center gap-1 text-[#8b4513] font-bold text-sm">
            <Zap size={16} className="text-red-600 fill-red-600" /> Flash Sale
          </div>
          <div className="text-xs text-gray-500">View more</div>
        </div>
      </div>

      {/* Circular Categories */}
      <div className="grid grid-cols-4 md:flex md:justify-center md:gap-12 gap-y-4 gap-x-2 p-4 bg-white md:py-8">
        {uniqueCategories.map((cat, idx) => (
          <button
            key={idx}
            onClick={() => setActiveTab(cat.name.trim().toLowerCase())}
            className="flex flex-col items-center gap-1 cursor-pointer hover:opacity-80 focus:outline-none"
          >
            <div className={`w-16 h-16 md:w-24 md:h-24 rounded-full overflow-hidden bg-gray-100 border-2 transition-all duration-200 ${
              activeTab === cat.name.trim().toLowerCase()
                ? 'border-orange-500 ring-2 ring-orange-200 scale-110'
                : 'border-gray-100'
            }`}>
              <img src={cat.img} alt={cat.name} className="w-full h-full object-cover" />
            </div>
            <span className={`text-xs md:text-sm font-medium text-center transition-colors ${
              activeTab === cat.name.trim().toLowerCase() ? 'text-orange-500 font-bold' : 'text-gray-800'
            }`}>{cat.name}</span>
          </button>
        ))}
      </div>

      {/* Category Filter Tabs */}
      <div
        className="flex gap-2 p-3 bg-gray-50 overflow-x-auto border-y border-gray-100 md:justify-center md:gap-3 md:py-3 sticky top-[108px] md:top-[140px] z-40"
        style={{ scrollbarWidth: 'none' }}
      >
        {/* ALL tab */}
        <button
          onClick={() => setActiveTab('all')}
          className={`flex items-center gap-1.5 px-4 py-1.5 md:py-2 md:px-5 rounded-full text-sm font-bold whitespace-nowrap border transition-all duration-200 ${
            activeTab === 'all'
              ? 'bg-black text-white border-black shadow-md'
              : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
          }`}
        >
          <LayoutGrid size={14} /> All
        </button>

        {uniqueCategories.map((cat, idx) => (
          <button
            key={idx}
            onClick={() => setActiveTab(cat.name.trim().toLowerCase())}
            className={`px-4 py-1.5 md:py-2 md:px-5 rounded-full text-sm font-bold whitespace-nowrap border transition-all duration-200 ${
              activeTab === cat.name.trim().toLowerCase()
                ? 'bg-orange-500 text-white border-orange-500 shadow-md'
                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Results count */}
      <div className="px-4 py-2 bg-gray-50 text-xs text-gray-500 font-medium flex items-center justify-between">
        <span>
          {activeTab === 'all' ? 'All Products' : `Category: ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`}
          {' — '}
          <span className="text-orange-500 font-bold">{products.length} items</span>
        </span>
        {activeTab !== 'all' && (
          <button onClick={() => setActiveTab('all')} className="text-orange-500 underline text-xs">
            Clear filter
          </button>
        )}
      </div>

      {/* Product Grid */}
      {products.length === 0 ? (
        <div className="py-20 flex flex-col items-center justify-center text-gray-400 bg-gray-50">
          <LayoutGrid size={48} className="mb-3 opacity-20" />
          <p className="font-medium">No products found in this category.</p>
          <button onClick={() => setActiveTab('all')} className="mt-3 text-orange-500 text-sm font-bold underline">
            Show all products
          </button>
        </div>
      ) : (
        <div className="p-2 md:p-6 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-6 bg-gray-50">
          {products.map((product) => (
            <Link
              href={`/product/${product.id}`}
              key={product.id}
              className="bg-white rounded-lg overflow-hidden relative flex flex-col group cursor-pointer shadow-sm block"
            >
              <div className="relative aspect-square w-full bg-gray-100 p-2 md:p-4">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
                />
                {product.isBestseller && (
                  <div className="absolute top-2 left-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-[10px] md:text-xs font-bold px-1.5 md:px-2 py-0.5 md:py-1 rounded z-10 shadow-sm">
                    Bestseller
                  </div>
                )}
                {product.discount && product.discount > 0 ? (
                  <div className="absolute bottom-2 left-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded z-10">
                    -{product.discount}%
                  </div>
                ) : null}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    dispatch(toggleWishlist({
                      id: product.id,
                      name: product.name,
                      price: product.price,
                      image: product.image,
                      sold: product.soldCount
                    }));
                  }}
                  className="absolute top-2 right-2 z-10 p-1.5 bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors"
                >
                  <Heart
                    size={18}
                    className={wishlist.some(w => w.id === product.id) ? "fill-red-500 text-red-500" : "text-gray-400"}
                  />
                </button>
              </div>

              <div className="p-2 flex flex-col flex-grow relative">
                <h3 className="text-xs font-medium text-gray-800 line-clamp-2 leading-tight mb-1">
                  {product.name}
                </h3>
                {product.soldCount && product.soldCount > 0 && (
                  <div className="flex items-center gap-1 text-[10px] text-gray-500 mb-1">
                    <Flame size={10} className="text-orange-500 fill-orange-500" />
                    {product.soldCount}+ sold
                  </div>
                )}
                <div className="mt-auto pt-1 flex items-end gap-1">
                  <span className="text-base md:text-lg font-black text-black leading-none">${product.price.toFixed(2)}</span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-[10px] md:text-xs text-gray-400 line-through leading-none mb-[2px]">${product.originalPrice.toFixed(2)}</span>
                  )}
                </div>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    dispatch(addToCart({
                      id: product.id,
                      name: product.name,
                      price: product.price,
                      image: product.image
                    }));
                  }}
                  className="absolute bottom-2 right-2 md:bottom-4 md:right-4 w-7 h-7 md:w-10 md:h-10 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors shadow-md z-20"
                >
                  <ShoppingCart size={14} className="md:w-5 md:h-5" />
                </button>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

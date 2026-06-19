"use client";

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Heart } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { toggleWishlist } from '@/store/userSlice';

export default function TrendsPage() {
  const { trendsFeed = [], trendsBanner, trendsTabs = [] } = useAppSelector(state => state.site);
  const { wishlist = [] } = useAppSelector(state => state.user);
  const dispatch = useAppDispatch();

  return (
    <div className="pb-4 bg-gray-50 min-h-screen">
      {/* Top Banner */}
      <div className="relative w-full h-48 md:h-72 bg-gradient-to-r from-[#8e7b68] to-[#615143] text-white p-4 md:p-8 flex flex-col justify-end overflow-hidden">
        {trendsBanner?.backgroundImage && <div className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-overlay" style={{ backgroundImage: `url('${trendsBanner.backgroundImage}')` }}></div>}
        <div className="relative z-10 md:max-w-3xl md:mx-auto w-full">
          <h1 className="text-2xl md:text-5xl font-black italic flex items-center gap-2 md:gap-4 mb-1 md:mb-2">
            {trendsBanner?.title} <span className="bg-black text-white text-[10px] md:text-sm px-1.5 md:px-3 py-0.5 md:py-1 rounded not-italic">{trendsBanner?.tag}</span>
          </h1>
          <p className="text-sm md:text-lg opacity-90 mb-4 md:mb-8">{trendsBanner?.subtitle}</p>
          
          <div className="flex gap-3 md:gap-6 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
            {(trendsBanner?.items || []).map((item, i) => (
              <div key={i} className="w-20 md:w-32 h-24 md:h-40 bg-white rounded-md md:rounded-lg flex-shrink-0 p-1 md:p-2 relative shadow-sm">
                <div className="w-full h-16 md:h-28 bg-gray-100 rounded-sm md:rounded mb-1 overflow-hidden">
                  <img src={item.image || 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=150&h=150&fit=crop'} className="w-full h-full object-cover" />
                </div>
                <div className="text-[10px] md:text-sm text-gray-800 text-center font-bold">${(item.price || 0).toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white px-4 border-b border-gray-100 flex justify-center gap-8 pt-4">
        <button className="text-black font-bold border-b-2 border-black pb-2 text-sm">Trending Picks</button>
        <button className="text-gray-500 font-medium pb-2 text-sm">Trends Store</button>
      </div>

      {/* Sub Tabs */}
      <div className="flex gap-2 p-3 bg-white overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
        {trendsTabs.map((tab, idx) => (
          <button 
            key={`${tab}-${idx}`} 
            className={`${idx === 0 ? 'bg-purple-50 text-purple-600 font-bold' : 'bg-gray-100 text-gray-600 font-medium'} px-4 py-1.5 rounded text-xs whitespace-nowrap`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="p-2 md:p-6 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-6">
        {trendsFeed.map((item) => (
          <Link href={`/product/${item.id}`} key={item.id} className="bg-white rounded-lg overflow-hidden flex flex-col shadow-sm cursor-pointer relative group">
            <div className="relative aspect-[4/5] w-full bg-gray-100">
              <Image src={item.img} alt={item.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  dispatch(toggleWishlist({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    image: item.img,
                    sold: item.sold
                  }));
                }}
                className="absolute top-2 right-2 z-10 p-1.5 bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors"
              >
                <Heart 
                  size={16} 
                  className={wishlist.some(w => w.id === item.id) ? "fill-red-500 text-red-500" : "text-gray-400"} 
                />
              </button>
            </div>
            <div className="p-2 md:p-4 flex flex-col flex-grow">
              <div className="text-[10px] md:text-xs text-purple-600 font-bold mb-1 italic">trends <span className="text-gray-400 font-normal ml-1">#TrendingNow &gt;</span></div>
              <h3 className="text-xs md:text-sm font-medium text-gray-800 line-clamp-2 leading-tight mb-1">{item.name}</h3>
              <div className="text-[10px] md:text-xs text-gray-500 mb-2">{item.sold} sold</div>
              <div className="mt-auto flex justify-between items-end">
                <span className="text-base md:text-lg font-black text-black">${item.price.toFixed(2)}</span>
                <button className="w-6 h-6 md:w-8 md:h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50">
                  <ShoppingCart size={14} className="text-gray-700" />
                </button>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

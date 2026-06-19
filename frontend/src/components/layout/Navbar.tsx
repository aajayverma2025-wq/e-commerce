"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Mail, Calendar, Camera, Search, Heart, Menu, ShoppingCart, User } from 'lucide-react';
import { useAppSelector } from '@/store/hooks';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const { totalQuantity } = useAppSelector(state => state.cart);
  const { appCategories = [], theme } = useAppSelector(state => state.site);
  const { user, isAuthenticated } = useAppSelector(state => state.user);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Robust deduplication — normalize to lowercase to catch 'New Category' vs 'new category'
  const seenNames = new Set<string>();
  const uniqueCategories = appCategories.filter(c => {
    const key = c.name.trim().toLowerCase();
    if (seenNames.has(key)) return false;
    seenNames.add(key);
    return true;
  });
  const mobileCategories = ['All', ...uniqueCategories.map(c => c.name.trim())];

  return (
    <header className="bg-white sticky top-0 z-50 shadow-sm border-b border-gray-100">
      {/* Top Utility Bar */}
      <div className="bg-gray-50 border-b border-gray-100 text-gray-500 py-1.5 px-4 md:px-6">
        <div className="w-full md:max-w-7xl mx-auto flex justify-between items-center text-[10px] md:text-xs">
          <span>Welcome to TrendMart!</span>
          <div className="flex items-center gap-2 md:gap-4 font-semibold">
            <Link href="/admin" className="hover:text-black transition-colors">Admin Panel</Link>
            <span className="text-gray-300">|</span>
            {isMounted && isAuthenticated && user?.role === 'vendor' ? (
              <Link href="/vendor/dashboard" className="text-orange-600 hover:text-orange-700 transition-colors font-bold">Vendor Dashboard</Link>
            ) : (
              <Link href="/vendor/login" className="hover:text-black transition-colors">Vendor Portal</Link>
            )}
          </div>
        </div>
      </div>

      <div className="w-full md:max-w-7xl mx-auto">
        
        {/* MOBILE VIEW (< md) */}
        <div className="md:hidden">
          {/* ALL / TRENDS Bar */}
          <div className="flex justify-center items-center pt-3 pb-1 gap-12 bg-white relative">
            <Link 
              href="/" 
              className={`font-black tracking-wide text-[15px] pb-1 ${pathname === '/' ? 'text-[#ff6b00]' : 'text-gray-400'}`}
            >
              ALL
            </Link>
            <Link 
              href="/trends" 
              className={`font-black tracking-wide text-[15px] pb-1 flex items-center gap-0.5 ${pathname === '/trends' ? 'text-[#a800ff]' : 'text-gray-400'}`}
            >
              # TRENDS
            </Link>
          </div>

          <div className="flex items-center px-4 py-2 gap-3 mt-1">
            <Mail size={22} className="text-gray-700 flex-shrink-0" />
            <Calendar size={22} className="text-gray-700 flex-shrink-0" />
            
            <div className="flex-1 relative">
              <input 
                type="text" 
                placeholder="Search..." 
                className="w-full bg-gray-100 rounded-full py-1.5 pl-4 pr-20 text-sm focus:outline-none text-gray-900"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <Camera size={18} className="text-gray-400" />
                <div className="bg-black text-white p-1 rounded-full cursor-pointer">
                  <Search size={14} />
                </div>
              </div>
            </div>
            
            <Heart size={24} className="text-gray-700 flex-shrink-0" />
          </div>

          <div className="relative border-b border-gray-100 flex items-center">
            <div className="flex items-center px-4 pb-2 gap-5 overflow-x-auto flex-1" style={{ scrollbarWidth: 'none' }}>
              {isMounted && mobileCategories.map((cat, idx) => (
                <Link 
                  href={cat.toLowerCase() === 'all' ? '/' : `/category/${cat.toLowerCase()}`}
                  key={idx} 
                  className={`whitespace-nowrap font-bold text-[15px] pb-1 ${
                    (idx === 0 && pathname === '/') || (pathname === `/category/${cat.toLowerCase()}`) ? 'text-black border-b-[3px] border-black rounded-sm' : 'text-gray-500 hover:text-black'
                  }`}
                >
                  {cat}
                </Link>
              ))}
            </div>
            {/* Hamburger Icon on Right Side */}
            <div className="px-3 bg-white pb-2 shadow-[-10px_0_10px_-10px_rgba(0,0,0,0.1)] z-10 flex-shrink-0">
              <Menu size={24} className="text-gray-700" />
            </div>
          </div>
        </div>

        {/* DESKTOP VIEW (>= md) */}
        <div className="hidden md:flex flex-col">
          <div className="flex items-center justify-between px-6 py-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              {isMounted && theme.logoImage && (
                <img 
                  src={theme.logoImage} 
                  alt={theme.logoText || 'Logo'} 
                  className="h-9 w-auto object-contain max-w-[120px]" 
                />
              )}
              <span className="text-2xl font-black tracking-tight italic" style={{ color: isMounted ? theme.primaryColor : '#000' }}>
                {isMounted ? theme.logoText : 'TRENDMART'}
              </span>
            </Link>

            {/* Centered Search */}
            <div className="flex-1 max-w-2xl mx-12 relative">
              <input 
                type="text" 
                placeholder="Search products, trends, and more..." 
                className="w-full bg-gray-100 border border-gray-200 rounded-full py-2.5 pl-6 pr-24 focus:outline-none focus:ring-2 focus:ring-black text-gray-900"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-3">
                <Camera size={20} className="text-gray-500 hover:text-black cursor-pointer" />
                <button className="bg-black text-white px-4 py-1.5 rounded-full font-bold hover:bg-gray-800 transition-colors flex items-center gap-1">
                  <Search size={16} /> Search
                </button>
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-8">
              <Link href="/me" className="flex flex-col items-center gap-1 text-gray-700 hover:text-black transition-colors">
                <User size={24} />
                <span className="text-xs font-bold">
                  {isMounted && isAuthenticated && user ? user.name.split(' ')[0] : 'Sign In'}
                </span>
              </Link>
              
              <Link href="/me" className="flex flex-col items-center gap-1 text-gray-700 hover:text-black transition-colors">
                <Heart size={24} />
                <span className="text-xs font-bold">Wishlist</span>
              </Link>
              
              <Link href="/cart" className="flex flex-col items-center gap-1 text-gray-700 hover:text-black transition-colors relative">
                <ShoppingCart size={24} />
                <span className="text-xs font-bold">Cart</span>
                {isMounted && totalQuantity > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                    {totalQuantity}
                  </span>
                )}
              </Link>
            </div>
          </div>

          {/* Desktop Categories */}
          <nav className="flex items-center justify-center gap-8 py-3 border-t border-gray-100 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
            {/* ALL - always links to homepage */}
            <Link
              href="/"
              className={`font-bold text-sm tracking-wide uppercase transition-colors whitespace-nowrap ${
                pathname === '/' ? 'text-orange-500' : 'text-gray-800 hover:text-orange-500'
              }`}
            >
              ALL
            </Link>
            {isMounted && uniqueCategories.map((cat, idx) => (
              <Link 
                href={`/category/${cat.name.trim().toLowerCase()}`}
                key={idx} 
                className={`font-bold text-sm tracking-wide uppercase transition-colors whitespace-nowrap ${
                  pathname === `/category/${cat.name.trim().toLowerCase()}` ? 'text-orange-500' : 'text-gray-800 hover:text-orange-500'
                }`}
              >
                {cat.name.trim()}
              </Link>
            ))}
            <Link href="/trends" className="font-bold text-sm tracking-wide uppercase text-purple-600 hover:text-purple-800 transition-colors flex items-center gap-1 whitespace-nowrap">
              # Trends
            </Link>
          </nav>
        </div>

      </div>
    </header>
  );
}

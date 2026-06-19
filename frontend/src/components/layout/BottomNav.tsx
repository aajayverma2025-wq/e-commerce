"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, TrendingUp, ShoppingCart, User } from 'lucide-react';
import { useAppSelector } from '@/store/hooks';
import { useEffect, useState } from 'react';

export default function BottomNav() {
  const pathname = usePathname();
  const { totalQuantity } = useAppSelector(state => state.cart);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const tabs = [
    { name: 'Shop', path: '/', icon: Home },
    { name: 'Category', path: '/category', icon: Search },
    { name: 'Trends', path: '/trends', icon: TrendingUp },
    { name: 'Cart', path: '/cart', icon: ShoppingCart, badge: totalQuantity },
    { name: 'Me', path: '/me', icon: User },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 px-2 pb-safe">
      <div className="flex justify-between items-center max-w-md mx-auto h-16">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = pathname === tab.path;
          
          return (
            <Link 
              key={tab.name} 
              href={tab.path}
              className="flex flex-col items-center justify-center w-full h-full relative"
            >
              <Icon 
                size={24} 
                className={`mb-1 transition-colors ${isActive ? 'text-black' : 'text-gray-400'}`} 
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span className={`text-[10px] font-medium ${isActive ? 'text-black' : 'text-gray-500'}`}>
                {tab.name}
              </span>
              
              {isMounted && tab.badge !== undefined && tab.badge > 0 && (
                <span className="absolute top-1 right-2 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {tab.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

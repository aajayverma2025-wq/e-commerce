"use client";

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import BottomNav from './BottomNav';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      {!isAdminRoute && <Navbar />}
      <main className="w-full md:max-w-7xl mx-auto bg-white min-h-screen shadow-sm md:shadow-none">
        {children}
      </main>
      {!isAdminRoute && <BottomNav />}
    </div>
  );
}

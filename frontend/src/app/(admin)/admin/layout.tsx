"use client";

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated } = useAppSelector(state => state.user);
  const router = useRouter();
  const pathname = usePathname();
  const rehydrated = useAppSelector((state: any) => state._persist?.rehydrated);

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (!rehydrated) return;
    
    if (!isLoginPage && (!isAuthenticated || user?.role !== 'admin')) {
      router.push('/admin/login');
    }
  }, [rehydrated, isAuthenticated, user, isLoginPage, router]);

  // If page is the login page, render children directly without sidebar/headers
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Prevent flash of dashboard content before redirecting
  if (!rehydrated || !isAuthenticated || user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-semibold tracking-wider opacity-85">Authenticating...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        {/* Header inside Admin */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-800">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold">
              A
            </div>
          </div>
        </header>
        <main className="p-8 flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

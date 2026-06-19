import Link from 'next/link';
import { LayoutDashboard, ShoppingBag, Users, Store, Settings, Tag, BadgePercent, DollarSign, Truck } from 'lucide-react';

export default function AdminSidebar() {
  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen flex flex-col shadow-lg">
      <div className="p-6 border-b border-gray-800">
        <h2 className="text-2xl font-bold text-orange-500 tracking-tight">Super Admin</h2>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gray-800 text-orange-400 font-medium">
          <LayoutDashboard size={20} />
          Dashboard
        </Link>
        <Link href="/admin/storefront" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 hover:text-orange-400 transition-colors">
          <LayoutDashboard size={20} className="text-gray-400" />
          <span className="font-medium">Storefront Builder</span>
        </Link>
        <Link href="/admin/user-dashboard" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 hover:text-orange-400 transition-colors">
          <Users size={20} className="text-gray-400" />
          <span className="font-medium">User Dashboard Config</span>
        </Link>
        <Link href="/admin/banner" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 hover:text-orange-400 transition-colors">
          <LayoutDashboard size={20} />
          Edit Banner
        </Link>
        <Link href="/admin/theme" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 hover:text-orange-400 transition-colors">
          <Settings size={20} />
          Theme & UI
        </Link>
        <Link href="/admin/products" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 hover:text-orange-400 transition-colors">
          <ShoppingBag size={20} />
          Products
        </Link>
        <Link href="/admin/categories" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 hover:text-orange-400 transition-colors">
          <Tag size={20} />
          App Categories
        </Link>
        <Link href="/admin/trends" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 hover:text-purple-400 transition-colors">
          <Tag size={20} />
          Trends Feed
        </Link>
        <Link href="/admin/discounts" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 hover:text-orange-400 transition-colors">
          <BadgePercent size={20} />
          Discounts & Coupons
        </Link>
        <Link href="/admin/orders" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 hover:text-orange-400 transition-colors">
          <ShoppingBag size={20} />
          Orders
        </Link>
        <Link href="/admin/payments" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 hover:text-orange-400 transition-colors">
          <DollarSign size={20} />
          Payments
        </Link>
        <Link href="/admin/shipping" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 hover:text-orange-400 transition-colors">
          <Truck size={20} />
          Shipping
        </Link>
        <Link href="/admin/customers" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 hover:text-orange-400 transition-colors">
          <Users size={20} />
          Customers
        </Link>
        <Link href="/admin/vendors" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 hover:text-orange-400 transition-colors">
          <Store size={20} />
          Vendors
        </Link>
        <Link href="/admin/settings" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 hover:text-orange-400 transition-colors">
          <Settings size={20} />
          Settings
        </Link>
      </nav>

      <div className="p-4 border-t border-gray-800">
        <Link href="/" className="flex items-center justify-center w-full py-2 bg-gray-800 rounded text-sm hover:bg-gray-700 transition-colors">
          Back to Store
        </Link>
      </div>
    </div>
  );
}

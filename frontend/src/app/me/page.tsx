"use client";

import { useState } from 'react';
import {
  Package, Clock, Truck, MessageSquare, RefreshCcw,
  HeadphonesIcon, CalendarCheck, ShieldCheck,
  ShoppingCart, Heart, LogOut, User, ChevronRight,
  MapPin, CreditCard, Bell, HelpCircle, Settings,
  Ticket, Coins, Wallet, Gift, Star, Edit3, Store
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { toggleWishlist, login, logout } from '@/store/userSlice';
import { addToCart } from '@/store/cartSlice';

export default function MePage() {
  const { user, wishlist = [] } = useAppSelector(state => state.user);
  const { userDashboardConfig } = useAppSelector(state => state.site);
  const allOrders = useAppSelector(state => state.orders.items);
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState<'wishlist' | 'following' | 'history'>('wishlist');

  const orderCounts = {
    unpaid:     allOrders.filter(o => o.status === 'Pending').length,
    processing: allOrders.filter(o => o.status === 'Processing').length,
    shipped:    allOrders.filter(o => o.status === 'Shipped').length,
    delivered:  allOrders.filter(o => o.status === 'Delivered').length,
    cancelled:  allOrders.filter(o => o.status === 'Cancelled').length,
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl">
          <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg">
            <User size={36} className="text-white" />
          </div>
          <h1 className="text-2xl font-black text-white mb-2">Welcome!</h1>
          <p className="text-white/60 text-sm mb-7">Sign in to track orders, manage your wishlist and more.</p>
          <Link href="/login" className="block w-full bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-600 hover:to-orange-500 text-white font-bold py-3.5 rounded-2xl transition-all mb-3 shadow-lg">
            Sign In
          </Link>
          <Link href="/register" className="block w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold py-3.5 rounded-2xl transition-all mb-5">
            Create Account
          </Link>
          <button onClick={() => dispatch(login({ email: 'admin@shop.com', name: 'Ajay Verma', role: 'customer' }))}
            className="text-xs text-white/40 hover:text-white/70 transition-colors">
            Continue as Demo →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── HERO HEADER ─────────────────────────────────── */}
      <div className="relative bg-gradient-to-br from-slate-800 via-slate-900 to-gray-900 pt-8 pb-20 px-5 overflow-hidden">
        {/* decorative blobs */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl pointer-events-none" />

        {/* Top actions */}
        <div className="flex justify-between items-center mb-6 relative z-10">
          <span className="text-white/50 text-xs font-medium uppercase tracking-widest">My Profile</span>
          <div className="flex gap-2">
            <Link href="/account" className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors">
              <Settings size={16} className="text-white" />
            </Link>
            <button onClick={() => dispatch(logout())} className="w-9 h-9 bg-white/10 hover:bg-red-500/30 rounded-full flex items-center justify-center transition-colors">
              <LogOut size={16} className="text-white" />
            </button>
          </div>
        </div>

        {/* Avatar + Info */}
        <div className="flex items-center gap-4 relative z-10">
          <div className="relative flex-shrink-0">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-3xl font-black text-white shadow-xl shadow-orange-900/30">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <button className="absolute -bottom-1.5 -right-1.5 w-7 h-7 bg-orange-500 rounded-full flex items-center justify-center shadow-lg border-2 border-slate-900">
              <Edit3 size={11} className="text-white" />
            </button>
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-black text-white truncate">{user.name}</h1>
            <p className="text-white/50 text-xs truncate mb-2">{user.email}</p>
            <div className="flex gap-2">
              <span className="inline-flex items-center gap-1 bg-yellow-400/20 border border-yellow-400/30 text-yellow-300 text-[10px] font-bold px-2.5 py-1 rounded-full">
                <Star size={9} fill="currentColor" /> Member
              </span>
              <span className="inline-flex items-center bg-orange-500/20 border border-orange-500/30 text-orange-300 text-[10px] font-bold px-2.5 py-1 rounded-full capitalize">
                {user.role}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── FLOATING STATS ──────────────────────────────── */}
      <div className="mx-4 -mt-10 relative z-20">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-4">
            {[
              { icon: <Ticket size={18} />, label: 'Vouchers', value: '3',   grad: 'from-orange-400 to-red-400' },
              { icon: <Coins size={18} />,  label: 'Points',   value: '120', grad: 'from-yellow-400 to-orange-300' },
              { icon: <Wallet size={18} />, label: 'Wallet',   value: '$0',  grad: 'from-blue-400 to-indigo-500' },
              { icon: <Gift size={18} />,   label: 'Gift',     value: '0',   grad: 'from-pink-400 to-rose-500' },
            ].map((s, i, a) => (
              <button key={s.label} className={`py-4 flex flex-col items-center gap-1.5 hover:bg-gray-50 transition-colors ${i < a.length-1 ? 'border-r border-gray-100' : ''}`}>
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${s.grad} flex items-center justify-center text-white shadow-sm`}>
                  {s.icon}
                </div>
                <span className="text-base font-black text-gray-800">{s.value}</span>
                <span className="text-[10px] text-gray-400">{s.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── MY ORDERS ───────────────────────────────────── */}
      {userDashboardConfig?.showMyOrders !== false && (
        <div className="mx-4 mt-4">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-black text-gray-800 text-base">My Orders</h2>
              <Link href="/account/orders" className="flex items-center gap-1 text-xs font-semibold text-orange-500 bg-orange-50 hover:bg-orange-100 px-3 py-1.5 rounded-full transition-colors">
                View all <ChevronRight size={13} />
              </Link>
            </div>
            <div className="grid grid-cols-5 gap-1">
              {[
                { icon: <Package size={22} />,        label: 'Unpaid',     count: orderCounts.unpaid,      color: '#6B7280', bg: '#F3F4F6' },
                { icon: <Clock size={22} />,           label: 'Processing', count: orderCounts.processing,  color: '#3B82F6', bg: '#EFF6FF' },
                { icon: <Truck size={22} />,           label: 'Shipped',    count: orderCounts.shipped,     color: '#8B5CF6', bg: '#F5F3FF' },
                { icon: <MessageSquare size={22} />,   label: 'Review',     count: orderCounts.delivered,   color: '#10B981', bg: '#ECFDF5' },
                { icon: <RefreshCcw size={22} />,      label: 'Returns',    count: orderCounts.cancelled,   color: '#EF4444', bg: '#FEF2F2' },
              ].map(item => (
                <Link key={item.label} href="/account/orders"
                  className="relative flex flex-col items-center gap-2 py-2 rounded-2xl hover:bg-gray-50 transition-colors group">
                  {item.count > 0 && (
                    <span className="absolute -top-0.5 right-1 w-5 h-5 bg-orange-500 text-white text-[9px] font-black rounded-full flex items-center justify-center shadow z-10">
                      {item.count}
                    </span>
                  )}
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform"
                    style={{ backgroundColor: item.bg, color: item.color }}>
                    {item.icon}
                  </div>
                  <span className="text-[10px] text-gray-500 text-center font-medium leading-tight">{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── QUICK ACTIONS ───────────────────────────────── */}
      {userDashboardConfig?.showCustomerService !== false && (
        <div className="mx-4 mt-4">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5">
            <h2 className="font-black text-gray-800 text-base mb-4">Quick Actions</h2>
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: <HeadphonesIcon size={20} />, label: 'Customer\nService', grad: 'from-blue-500 to-indigo-600' },
                { icon: <CalendarCheck size={20} />,  label: 'Daily\nCheck In',   grad: 'from-green-400 to-emerald-600' },
                { icon: <ShieldCheck size={20} />,    label: 'Platform\nPolicy',  grad: 'from-purple-500 to-violet-600' },
              ].map(item => (
                <button key={item.label}
                  className="flex flex-col items-center gap-3 py-5 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-colors group">
                  <div className={`w-12 h-12 bg-gradient-to-br ${item.grad} rounded-2xl flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform`}>
                    {item.icon}
                  </div>
                  <span className="text-[11px] text-gray-600 text-center whitespace-pre-line leading-tight font-semibold">
                    {item.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── ACCOUNT MENU ─────────────────────────────────── */}
      <div className="mx-4 mt-4">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <p className="px-5 pt-5 pb-2 text-xs font-black text-gray-400 uppercase tracking-wider">Account Settings</p>
          {(() => {
            const menuItems = [
              { icon: <MapPin size={16} />,     label: 'My Addresses',      sub: 'Manage delivery addresses',  grad: 'from-orange-400 to-red-400',     href: '/account' },
              { icon: <CreditCard size={16} />, label: 'Payment Methods',   sub: 'Cards & wallets',            grad: 'from-blue-400 to-indigo-500',    href: '/checkout' },
              { icon: <Bell size={16} />,        label: 'Notifications',     sub: 'Alerts & preferences',       grad: 'from-yellow-400 to-orange-400',  href: '/account' },
              { icon: <HelpCircle size={16} />, label: 'Help & Support',    sub: 'FAQs & contact us',          grad: 'from-green-400 to-emerald-500',  href: '/account' },
              { icon: <Settings size={16} />,   label: 'Account Settings',  sub: 'Privacy & security',         grad: 'from-gray-400 to-slate-500',     href: '/account' },
            ];

            if (user?.role === 'vendor') {
              menuItems.unshift({
                icon: <Store size={16} />,
                label: 'Vendor Dashboard',
                sub: 'Manage storefront configurations',
                grad: 'from-orange-500 to-pink-500',
                href: '/vendor/dashboard'
              });
            } else if (user?.role === 'admin') {
              menuItems.unshift({
                icon: <ShieldCheck size={16} />,
                label: 'Admin Panel',
                sub: 'Manage store settings & products',
                grad: 'from-purple-500 to-indigo-600',
                href: '/admin'
              });
            }

            return menuItems.map((item, i, arr) => (
              <Link key={item.label} href={item.href}
                className={`flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50 transition-colors ${i < arr.length-1 ? 'border-b border-gray-50' : 'mb-2'}`}>
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${item.grad} flex items-center justify-center text-white flex-shrink-0 shadow-sm`}>
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-800">{item.label}</p>
                  <p className="text-xs text-gray-400">{item.sub}</p>
                </div>
                <ChevronRight size={16} className="text-gray-300 flex-shrink-0" />
              </Link>
            ));
          })()}
        </div>
      </div>

      {/* ── WISHLIST / FOLLOWING / HISTORY ─────────────────── */}
      <div className="mx-4 mt-4">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Tab Header */}
          <div className="flex border-b border-gray-100">
            {[
              { key: 'wishlist',  label: 'Wishlist',  count: `${wishlist.length}`, show: userDashboardConfig?.showWishlistTab  !== false },
              { key: 'following', label: 'Following', count: '0',                  show: userDashboardConfig?.showFollowingTab !== false },
              { key: 'history',   label: 'History',   count: '0',                  show: userDashboardConfig?.showHistoryTab   !== false },
            ].filter(t => t.show).map(tab => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key as typeof activeTab)}
                className={`flex-1 py-4 flex flex-col items-center transition-all ${activeTab === tab.key ? 'border-b-2 border-orange-500' : 'border-b-2 border-transparent'}`}>
                <span className={`text-lg font-black ${activeTab === tab.key ? 'text-orange-500' : 'text-gray-300'}`}>{tab.count}</span>
                <span className={`text-xs font-semibold ${activeTab === tab.key ? 'text-orange-500' : 'text-gray-400'}`}>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Wishlist */}
          {activeTab === 'wishlist' && (
            <div className="p-3 grid grid-cols-2 gap-3">
              {wishlist.length === 0 ? (
                <div className="col-span-2 py-14 flex flex-col items-center justify-center">
                  <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-4">
                    <Heart size={36} className="text-red-200" />
                  </div>
                  <p className="font-bold text-gray-500">Wishlist is empty</p>
                  <p className="text-xs text-gray-400 mt-1 mb-5">Tap ❤️ on products you love</p>
                  <Link href="/" className="bg-gradient-to-r from-orange-500 to-orange-400 text-white text-sm font-bold px-6 py-2.5 rounded-2xl shadow-lg hover:shadow-orange-200 transition-all">
                    Browse Products
                  </Link>
                </div>
              ) : (
                wishlist.map(item => (
                  <div key={item.id} className="bg-gray-50 rounded-2xl overflow-hidden flex flex-col group border border-gray-100 hover:border-orange-200 transition-colors">
                    <div className="relative aspect-square bg-white">
                      <Image src={item.image} alt={item.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                      <button onClick={() => dispatch(toggleWishlist(item))}
                        className="absolute top-2 right-2 w-7 h-7 bg-white rounded-full shadow flex items-center justify-center hover:scale-110 transition-transform">
                        <Heart size={14} className="fill-red-500 text-red-500" />
                      </button>
                    </div>
                    <div className="p-2.5 flex flex-col flex-grow">
                      <p className="text-xs font-semibold text-gray-700 line-clamp-2 mb-1.5">{item.name}</p>
                      <div className="text-orange-400 text-[10px] mb-2">★★★★★</div>
                      <div className="mt-auto flex items-center justify-between">
                        <span className="font-black text-gray-900">${item.price.toFixed(2)}</span>
                        <button onClick={() => dispatch(addToCart({ id: item.id, name: item.name, price: item.price, image: item.image }))}
                          className="w-7 h-7 bg-gradient-to-br from-orange-500 to-orange-400 rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform">
                          <ShoppingCart size={12} className="text-white" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'following' && (
            <div className="py-14 flex flex-col items-center justify-center">
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                <Heart size={36} className="text-blue-200" />
              </div>
              <p className="font-bold text-gray-500">No stores followed yet</p>
              <p className="text-xs text-gray-400 mt-1">Follow vendors to see their updates</p>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="py-14 flex flex-col items-center justify-center">
              <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center mb-4">
                <Clock size={36} className="text-purple-200" />
              </div>
              <p className="font-bold text-gray-500">No browsing history</p>
              <p className="text-xs text-gray-400 mt-1">Products you view will appear here</p>
            </div>
          )}
        </div>
      </div>

      {/* ── SIGN OUT ─────────────────────────────────────── */}
      <div className="mx-4 mt-4 mb-8">
        <button onClick={() => dispatch(logout())}
          className="w-full bg-white border-2 border-red-100 hover:border-red-300 hover:bg-red-50 text-red-500 font-black py-4 rounded-3xl transition-all flex items-center justify-center gap-2 shadow-sm">
          <LogOut size={18} /> Sign Out
        </button>
      </div>

    </div>
  );
}

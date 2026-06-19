"use client";

import { useState } from 'react';
import { Save, User, LayoutList } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateUserDashboardConfig } from '@/store/siteSlice';

export default function UserDashboardConfigPage() {
  const { userDashboardConfig } = useAppSelector(state => state.site);
  const dispatch = useAppDispatch();

  // Initialize with optional chaining for safety during hydration
  const [showStatsBar, setShowStatsBar] = useState(userDashboardConfig?.showStatsBar ?? true);
  const [showMyOrders, setShowMyOrders] = useState(userDashboardConfig?.showMyOrders ?? true);
  const [showCustomerService, setShowCustomerService] = useState(userDashboardConfig?.showCustomerService ?? true);
  const [showWishlistTab, setShowWishlistTab] = useState(userDashboardConfig?.showWishlistTab ?? true);
  const [showFollowingTab, setShowFollowingTab] = useState(userDashboardConfig?.showFollowingTab ?? true);
  const [showHistoryTab, setShowHistoryTab] = useState(userDashboardConfig?.showHistoryTab ?? true);

  const handleSave = () => {
    dispatch(updateUserDashboardConfig({
      showStatsBar,
      showMyOrders,
      showCustomerService,
      showWishlistTab,
      showFollowingTab,
      showHistoryTab,
    }));
    alert('User Dashboard settings saved successfully! Changes are live on the storefront.');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">User Dashboard Config</h2>
        <button 
          onClick={handleSave}
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors font-medium shadow-sm"
        >
          <Save size={18} /> Save Settings
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
        <div className="p-5 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
          <User size={20} className="text-gray-500" />
          <h3 className="text-lg font-bold text-gray-800">Profile Sections Visibility</h3>
        </div>
        <div className="p-6 space-y-6">
          <p className="text-sm text-gray-500">Toggle the sections that you want to be visible on the customer's "/me" dashboard.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Top Sections */}
            <div className="space-y-4">
              <h4 className="font-bold text-gray-700 pb-2 border-b border-gray-100">Main Areas</h4>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <h5 className="font-medium text-gray-800">Stats Bar</h5>
                  <p className="text-xs text-gray-500">Vouchers, Points, Wallet, Gift Card</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={showStatsBar} onChange={() => setShowStatsBar(!showStatsBar)} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <h5 className="font-medium text-gray-800">My Orders</h5>
                  <p className="text-xs text-gray-500">Unpaid, Processing, Shipped, Review</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={showMyOrders} onChange={() => setShowMyOrders(!showMyOrders)} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <h5 className="font-medium text-gray-800">Customer Service</h5>
                  <p className="text-xs text-gray-500">Service, Check In, Policy links</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={showCustomerService} onChange={() => setShowCustomerService(!showCustomerService)} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                </label>
              </div>
            </div>

            {/* Bottom Tabs */}
            <div className="space-y-4">
              <h4 className="font-bold text-gray-700 pb-2 border-b border-gray-100">Bottom Tabs</h4>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <h5 className="font-medium text-gray-800">Wishlist Tab</h5>
                  <p className="text-xs text-gray-500">Shows saved products</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={showWishlistTab} onChange={() => setShowWishlistTab(!showWishlistTab)} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <h5 className="font-medium text-gray-800">Following Tab</h5>
                  <p className="text-xs text-gray-500">Shows followed stores</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={showFollowingTab} onChange={() => setShowFollowingTab(!showFollowingTab)} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <h5 className="font-medium text-gray-800">History Tab</h5>
                  <p className="text-xs text-gray-500">Shows browsing history</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={showHistoryTab} onChange={() => setShowHistoryTab(!showHistoryTab)} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

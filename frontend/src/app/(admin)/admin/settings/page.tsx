"use client";

import { useState, useEffect } from 'react';
import { Save, CreditCard, Wallet, Truck, ShieldAlert } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updatePaymentSettings } from '@/store/siteSlice';
import { updateAdminCredentials } from '@/store/userSlice';

export default function AdminSettingsPage() {
  const { paymentSettings } = useAppSelector(state => state.site);
  const { adminCredentials, user } = useAppSelector(state => state.user);
  const dispatch = useAppDispatch();
  const rehydrated = useAppSelector((state: any) => state._persist?.rehydrated);

  // Local State for Payment Settings
  const [stripeEnabled, setStripeEnabled] = useState(paymentSettings?.stripeEnabled ?? true);
  const [stripePublicKey, setStripePublicKey] = useState(paymentSettings?.stripePublicKey ?? '');
  
  const [paypalEnabled, setPaypalEnabled] = useState(paymentSettings?.paypalEnabled ?? false);
  const [paypalClientId, setPaypalClientId] = useState(paymentSettings?.paypalClientId ?? '');
  
  const [codEnabled, setCodEnabled] = useState(paymentSettings?.codEnabled ?? true);

  // Local State for Admin Credentials
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  const isSuperAdmin = user?.role === 'admin';

  useEffect(() => {
    if (!rehydrated) return;
    setStripeEnabled(paymentSettings?.stripeEnabled ?? true);
    setStripePublicKey(paymentSettings?.stripePublicKey ?? '');
    setPaypalEnabled(paymentSettings?.paypalEnabled ?? false);
    setPaypalClientId(paymentSettings?.paypalClientId ?? '');
    setCodEnabled(paymentSettings?.codEnabled ?? true);
    setAdminUsername(adminCredentials?.username || 'admin');
  }, [rehydrated, paymentSettings, adminCredentials]);

  const handleSave = () => {
    dispatch(updatePaymentSettings({
      stripeEnabled,
      stripePublicKey,
      paypalEnabled,
      paypalClientId,
      codEnabled
    }));
    alert('Settings saved successfully!');
  };

  const handleSaveCredentials = () => {
    if (!isSuperAdmin) {
      alert('Access Denied: Only Super Admin users can update credentials.');
      return;
    }
    if (!adminUsername.trim()) {
      alert('User ID cannot be empty.');
      return;
    }
    
    dispatch(updateAdminCredentials({
      username: adminUsername,
      ...(adminPassword ? { password: adminPassword } : {})
    }));
    
    setAdminPassword(''); // Clear password field
    alert('Super Admin credentials updated successfully!');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <h2 className="text-2xl font-bold text-gray-800">Platform Settings</h2>

      {/* Super Admin Credentials Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <ShieldAlert className="text-orange-500" size={20} /> Super Admin Credentials
            </h3>
            <p className="text-sm text-gray-500 mt-1">Change the User ID and Password used for Admin Panel access.</p>
          </div>
        </div>
        <div className="p-6 space-y-4">
          {!isSuperAdmin && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-semibold">
              Warning: You are not authorized as a Super Admin to view or change these credentials.
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Super Admin User ID</label>
              <input 
                type="text" 
                value={adminUsername} 
                onChange={(e) => setAdminUsername(e.target.value)} 
                disabled={!isSuperAdmin}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none text-gray-900 disabled:bg-gray-50 disabled:text-gray-400 font-semibold" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password (leave empty to keep current)</label>
              <input 
                type="password" 
                placeholder="••••••••"
                value={adminPassword} 
                onChange={(e) => setAdminPassword(e.target.value)} 
                disabled={!isSuperAdmin}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none text-gray-900 disabled:bg-gray-50 disabled:text-gray-400" 
              />
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <button 
              onClick={handleSaveCredentials}
              disabled={!isSuperAdmin}
              className="bg-gray-900 hover:bg-gray-800 disabled:opacity-50 text-white px-5 py-2.5 rounded-xl font-bold transition-colors text-xs flex items-center gap-1.5 shadow-sm"
            >
              <Save size={14} /> Update Credentials
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-800">General Information</h3>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Platform Name</label>
            <input type="text" defaultValue="MegaMart" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none text-gray-900" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
            <input type="email" defaultValue="support@megamart.com" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none text-gray-900" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-800">Vendor Commissions</h3>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Default Commission Rate (%)</label>
            <input type="number" defaultValue="15" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none text-gray-900" />
          </div>
        </div>
      </div>

      {/* Payment Gateways Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-800">Payment Gateways</h3>
          <p className="text-sm text-gray-500 mt-1">Configure the payment methods available to customers during checkout.</p>
        </div>
        <div className="p-6 space-y-8">
          
          {/* Stripe / Credit Card */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><CreditCard size={24} /></div>
                <div>
                  <h4 className="font-bold text-gray-800">Credit Card (Stripe)</h4>
                  <p className="text-xs text-gray-500">Accept major credit and debit cards.</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={stripeEnabled} onChange={() => setStripeEnabled(!stripeEnabled)} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
              </label>
            </div>
            {stripeEnabled && (
              <div className="ml-14">
                <label className="block text-sm font-medium text-gray-700 mb-1">Stripe Public Key</label>
                <input type="text" value={stripePublicKey} onChange={(e) => setStripePublicKey(e.target.value)} placeholder="pk_test_..." className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none text-gray-900 font-mono text-sm" />
              </div>
            )}
          </div>

          <hr className="border-gray-100" />

          {/* PayPal */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 text-blue-800 rounded-lg"><Wallet size={24} /></div>
                <div>
                  <h4 className="font-bold text-gray-800">PayPal</h4>
                  <p className="text-xs text-gray-500">Allow customers to pay with their PayPal account.</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={paypalEnabled} onChange={() => setPaypalEnabled(!paypalEnabled)} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
              </label>
            </div>
            {paypalEnabled && (
              <div className="ml-14">
                <label className="block text-sm font-medium text-gray-700 mb-1">PayPal Client ID</label>
                <input type="text" value={paypalClientId} onChange={(e) => setPaypalClientId(e.target.value)} placeholder="Enter PayPal Client ID" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none text-gray-900 font-mono text-sm" />
              </div>
            )}
          </div>

          <hr className="border-gray-100" />

          {/* Cash on Delivery */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-50 text-green-600 rounded-lg"><Truck size={24} /></div>
              <div>
                <h4 className="font-bold text-gray-800">Cash on Delivery (COD)</h4>
                <p className="text-xs text-gray-500">Customers pay in cash when the product is delivered.</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={codEnabled} onChange={() => setCodEnabled(!codEnabled)} className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
            </label>
          </div>

        </div>
      </div>

      <div className="flex justify-end">
        <button onClick={handleSave} className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-xl flex items-center gap-2 transition-colors font-bold shadow-sm text-xs">
          <Save size={14} /> Save Platform Settings
        </button>
      </div>
    </div>
  );
}

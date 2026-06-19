"use client";

import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { updateGatewaySettings } from '@/store/paymentSlice';
import { ArrowLeft, Save, CreditCard, Wallet, Truck, DollarSign, Globe } from 'lucide-react';
import Link from 'next/link';

export default function PaymentSettingsPage() {
  const { gatewaySettings } = useAppSelector(state => state.payments);
  const dispatch = useAppDispatch();

  const [settings, setSettings] = useState({ ...gatewaySettings });

  const update = (key: keyof typeof settings, value: string | boolean | number) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    dispatch(updateGatewaySettings(settings));
    alert('Payment settings saved! Active gateways will appear on the checkout page.');
  };

  const Toggle = ({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) => (
    <label className="relative inline-flex items-center cursor-pointer">
      <input type="checkbox" checked={enabled} onChange={onToggle} className="sr-only peer" />
      <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
    </label>
  );

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <Link href="/admin/payments" className="text-gray-400 hover:text-gray-600 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <h2 className="text-2xl font-bold text-gray-800">Payment Gateway Settings</h2>
      </div>

      {/* Currency & Tax */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
          <Globe size={18} className="text-orange-500" />
          <h3 className="font-bold text-gray-800">Global Settings</h3>
        </div>
        <div className="p-6 grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
            <select value={settings.currency} onChange={e => update('currency', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:outline-none text-gray-900">
              <option value="USD">USD — US Dollar ($)</option>
              <option value="EUR">EUR — Euro (€)</option>
              <option value="GBP">GBP — British Pound (£)</option>
              <option value="PKR">PKR — Pakistani Rupee (₨)</option>
              <option value="INR">INR — Indian Rupee (₹)</option>
              <option value="AED">AED — UAE Dirham (د.إ)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tax Rate (%)</label>
            <input type="number" min="0" max="50" value={settings.taxRate}
              onChange={e => update('taxRate', parseFloat(e.target.value))}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:outline-none text-gray-900" />
          </div>
        </div>
      </div>

      {/* Stripe */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <CreditCard size={20} className="text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800">Credit / Debit Card (Stripe)</h3>
              <p className="text-xs text-gray-500">Accept Visa, Mastercard, Amex and more</p>
            </div>
          </div>
          <Toggle enabled={settings.stripeEnabled} onToggle={() => update('stripeEnabled', !settings.stripeEnabled)} />
        </div>
        {settings.stripeEnabled && (
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stripe Publishable Key</label>
              <input type="text" value={settings.stripePublicKey}
                onChange={e => update('stripePublicKey', e.target.value)}
                placeholder="pk_live_..." 
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:outline-none font-mono text-sm text-gray-900" />
            </div>
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-xs text-blue-700">
              💡 Get your keys from <a href="https://dashboard.stripe.com/apikeys" target="_blank" rel="noopener" className="underline font-semibold">dashboard.stripe.com/apikeys</a>. Use <strong>test keys</strong> for development.
            </div>
          </div>
        )}
      </div>

      {/* PayPal */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-sky-100 rounded-xl flex items-center justify-center">
              <Wallet size={20} className="text-sky-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800">PayPal</h3>
              <p className="text-xs text-gray-500">Let customers pay with their PayPal account</p>
            </div>
          </div>
          <Toggle enabled={settings.paypalEnabled} onToggle={() => update('paypalEnabled', !settings.paypalEnabled)} />
        </div>
        {settings.paypalEnabled && (
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">PayPal Client ID</label>
              <input type="text" value={settings.paypalClientId}
                onChange={e => update('paypalClientId', e.target.value)}
                placeholder="AaBbCc..."
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:outline-none font-mono text-sm text-gray-900" />
            </div>
            <div className="bg-sky-50 border border-sky-100 rounded-xl p-3 text-xs text-sky-700">
              💡 Get your Client ID from the <a href="https://developer.paypal.com/dashboard/" target="_blank" rel="noopener" className="underline font-semibold">PayPal Developer Dashboard</a>.
            </div>
          </div>
        )}
      </div>

      {/* COD */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <Truck size={20} className="text-green-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800">Cash on Delivery (COD)</h3>
              <p className="text-xs text-gray-500">Customers pay cash when the product arrives</p>
            </div>
          </div>
          <Toggle enabled={settings.codEnabled} onToggle={() => update('codEnabled', !settings.codEnabled)} />
        </div>
      </div>

      {/* Active Methods Preview */}
      <div className="bg-orange-50 border border-orange-100 rounded-2xl p-5">
        <h4 className="text-sm font-bold text-orange-800 mb-3 flex items-center gap-2"><DollarSign size={16} /> Active Payment Methods on Checkout</h4>
        <div className="flex flex-wrap gap-2">
          {settings.stripeEnabled && <span className="bg-white border border-blue-200 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full">💳 Credit Card</span>}
          {settings.paypalEnabled && <span className="bg-white border border-sky-200 text-sky-700 text-xs font-semibold px-3 py-1.5 rounded-full">🅿️ PayPal</span>}
          {settings.codEnabled && <span className="bg-white border border-green-200 text-green-700 text-xs font-semibold px-3 py-1.5 rounded-full">💵 Cash on Delivery</span>}
          {!settings.stripeEnabled && !settings.paypalEnabled && !settings.codEnabled && (
            <span className="text-red-500 text-xs font-semibold">⚠️ No payment methods enabled! Customers won't be able to checkout.</span>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <button onClick={handleSave}
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-colors shadow-lg shadow-orange-100">
          <Save size={18} /> Save Payment Settings
        </button>
      </div>
    </div>
  );
}

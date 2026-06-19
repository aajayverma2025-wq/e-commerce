"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { login } from '@/store/userSlice';
import { Lock, Store } from 'lucide-react';

export default function VendorLoginPage() {
  const [vendorId, setVendorId] = useState('');
  const [accessKey, setAccessKey] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  const { vendors } = useAppSelector((state) => state.vendors);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      const vId = vendorId.trim().toUpperCase();
      const aKey = accessKey.trim();

      const matchedVendor = vendors.find(v => v.id === vId && v.accessKey === aKey);

      if (!matchedVendor) {
        setError('Invalid Vendor ID or secret Access Key. Please check and try again.');
        setLoading(false);
        return;
      }

      if (matchedVendor.status === 'Suspended') {
        setError('Your vendor account has been suspended. Please contact store administration.');
        setLoading(false);
        return;
      }

      if (matchedVendor.status === 'Pending Approval') {
        setError('Your account is pending approval. You can access the dashboard once approved.');
        setLoading(false);
        return;
      }

      // Log in as vendor
      dispatch(login({
        email: matchedVendor.email,
        name: matchedVendor.businessName,
        phone: matchedVendor.contact,
        role: 'vendor',
        vendorId: matchedVendor.id
      }));

      router.push('/vendor/dashboard');
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-3">
            <Store className="text-orange-600" size={24} />
          </div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Vendor Portal
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your credentials to customize your storefront and manage products.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm font-medium">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="vendor-id" className="sr-only">Vendor ID</label>
              <input
                id="vendor-id"
                name="vendorId"
                type="text"
                value={vendorId}
                onChange={(e) => setVendorId(e.target.value)}
                required
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm uppercase"
                placeholder="Vendor ID (e.g. V001)"
              />
            </div>
            <div>
              <label htmlFor="access-key" className="sr-only">Access Key</label>
              <input
                id="access-key"
                name="accessKey"
                type="password"
                value={accessKey}
                onChange={(e) => setAccessKey(e.target.value)}
                required
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                placeholder="Secret Access Key (VK-XXXXXXXX)"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-orange-500 hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <span className="flex items-center gap-1.5">
                  <Lock size={16} /> Access Portal
                </span>
              )}
            </button>
          </div>
        </form>

        <div className="text-center text-xs text-gray-400">
          Access keys are managed by main store administration. If you forgot your key, please contact support.
        </div>
      </div>
    </div>
  );
}

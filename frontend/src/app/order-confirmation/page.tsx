"use client";

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Package, Home, ShoppingBag } from 'lucide-react';
import { Suspense } from 'react';

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('id') || 'ORD-000000';

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-10 max-w-lg w-full text-center">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center animate-bounce">
            <CheckCircle className="text-green-500" size={52} />
          </div>
        </div>

        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Order Placed! 🎉</h1>
        <p className="text-gray-500 mb-6">Thank you! Your order has been received and is being processed.</p>

        {/* Order ID */}
        <div className="bg-orange-50 border border-orange-100 rounded-2xl px-6 py-4 mb-8 inline-block w-full">
          <p className="text-sm text-orange-600 font-medium mb-1">Your Order ID</p>
          <p className="text-2xl font-black text-orange-500 tracking-wider">{orderId}</p>
        </div>

        {/* Status Steps */}
        <div className="flex justify-between items-center mb-8 px-2">
          {[
            { label: 'Placed', done: true },
            { label: 'Processing', done: false },
            { label: 'Shipped', done: false },
            { label: 'Delivered', done: false },
          ].map((step, i, arr) => (
            <div key={step.label} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                  step.done ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-400'
                }`}>
                  {step.done ? '✓' : i + 1}
                </div>
                <span className={`text-xs mt-1 ${step.done ? 'text-green-600 font-semibold' : 'text-gray-400'}`}>
                  {step.label}
                </span>
              </div>
              {i < arr.length - 1 && (
                <div className={`flex-1 h-0.5 mb-4 ${step.done ? 'bg-green-300' : 'bg-gray-100'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/account/orders"
            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
            <Package size={18} /> Track My Order
          </Link>
          <Link href="/"
            className="flex-1 border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
            <Home size={18} /> Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <OrderConfirmationContent />
    </Suspense>
  );
}

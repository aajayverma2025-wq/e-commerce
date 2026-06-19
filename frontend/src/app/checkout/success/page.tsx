"use client";

import Link from 'next/link';
import { CheckCircle2, ShoppingBag } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const orderNumber = orderId || `ORD-${Math.floor(100000 + Math.random() * 900000)}`;

  return (
    <div className="container mx-auto px-4 py-24 flex items-center justify-center min-h-[70vh]">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 md:p-12 text-center max-w-lg w-full">
        <div className="flex justify-center mb-6">
          <CheckCircle2 className="text-green-500 w-24 h-24" />
        </div>
        
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Order Confirmed!</h1>
        <p className="text-gray-500 mb-8 text-lg">
          Thank you for your purchase. Your order has been received and is currently being processed.
        </p>
        
        <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left">
          <p className="text-sm text-gray-500 mb-1">Order Number</p>
          <p className="text-lg font-bold text-gray-900 font-mono">{orderNumber}</p>
          
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-1">Estimated Delivery</p>
            <p className="font-medium text-gray-900">3 - 5 Business Days</p>
          </div>
        </div>
        
        <Link 
          href="/" 
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-6 rounded-lg shadow-lg flex items-center justify-center gap-2 transition-transform hover:scale-105"
        >
          <ShoppingBag size={20} /> Continue Shopping
        </Link>
      </div>
    </div>
  );
}

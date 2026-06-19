"use client";

import { useAppSelector } from '@/store/hooks';
import Link from 'next/link';
import Image from 'next/image';
import { Package, MapPin, CreditCard, ArrowLeft } from 'lucide-react';
import { use } from 'react';
import { OrderStatus } from '@/store/orderSlice';

const statusStyles: Record<OrderStatus, string> = {
  Pending:    'bg-yellow-100 text-yellow-700 border-yellow-200',
  Processing: 'bg-blue-100 text-blue-700 border-blue-200',
  Shipped:    'bg-purple-100 text-purple-700 border-purple-200',
  Delivered:  'bg-green-100 text-green-700 border-green-200',
  Cancelled:  'bg-red-100 text-red-700 border-red-200',
};

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const allOrders = useAppSelector(state => state.orders.items);
  const order = allOrders.find(o => o.id === id);

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package size={60} className="mx-auto text-gray-200 mb-4" />
          <h2 className="text-xl font-bold text-gray-700 mb-2">Order Not Found</h2>
          <Link href="/account/orders" className="text-orange-500 hover:underline">Back to My Orders</Link>
        </div>
      </div>
    );
  }

  const steps: OrderStatus[] = ['Pending', 'Processing', 'Shipped', 'Delivered'];
  const currentStep = steps.indexOf(order.status);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link href="/account/orders" className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6 transition-colors">
          <ArrowLeft size={18} /> Back to My Orders
        </Link>

        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Order {order.id}</h1>
            <p className="text-gray-500 text-sm mt-1">Placed on {order.date}</p>
          </div>
          <span className={`px-4 py-2 rounded-full text-sm font-bold border ${statusStyles[order.status]}`}>
            {order.status}
          </span>
        </div>

        {/* Status Tracker */}
        {order.status !== 'Cancelled' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
            <h2 className="font-bold text-gray-800 mb-5">Order Tracking</h2>
            <div className="flex items-center">
              {steps.map((step, i) => (
                <div key={step} className="flex items-center flex-1">
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                      i <= currentStep ? 'bg-orange-500 text-white shadow-lg shadow-orange-200' : 'bg-gray-100 text-gray-400'
                    }`}>
                      {i < currentStep ? '✓' : i + 1}
                    </div>
                    <span className={`text-xs mt-2 font-medium ${i <= currentStep ? 'text-orange-600' : 'text-gray-400'}`}>
                      {step}
                    </span>
                  </div>
                  {i < steps.length - 1 && (
                    <div className={`flex-1 h-1 mb-5 rounded-full ${i < currentStep ? 'bg-orange-400' : 'bg-gray-100'}`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Items */}
          <div className="md:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-bold text-gray-800 mb-4">Items Ordered</h2>
            <div className="space-y-4">
              {order.items.map(item => (
                <div key={item.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-white border border-gray-100 flex-shrink-0">
                    <Image src={item.image} alt={item.name} fill className="object-contain p-1" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800">{item.name}</p>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <span className="font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 mt-4 pt-4 text-right">
              <span className="text-xl font-black text-gray-900">Total: {order.total}</span>
            </div>
          </div>

          {/* Info */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2"><MapPin size={16} className="text-orange-500" /> Shipping To</h3>
              <p className="font-semibold text-gray-800">{order.customer}</p>
              <p className="text-sm text-gray-500">{order.address}</p>
              <p className="text-sm text-gray-500">{order.city} {order.postalCode}</p>
              <p className="text-sm text-gray-500">{order.phone}</p>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2"><CreditCard size={16} className="text-orange-500" /> Payment</h3>
              <p className="text-sm text-gray-700 font-medium">{order.paymentMethod}</p>
              <p className="text-sm text-gray-500">{order.email}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

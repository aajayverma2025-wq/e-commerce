"use client";

import { useAppSelector } from '@/store/hooks';
import Link from 'next/link';
import Image from 'next/image';
import { Package, ShoppingBag, ChevronRight } from 'lucide-react';
import { OrderStatus } from '@/store/orderSlice';

const statusStyles: Record<OrderStatus, string> = {
  Pending:    'bg-yellow-100 text-yellow-700',
  Processing: 'bg-blue-100 text-blue-700',
  Shipped:    'bg-purple-100 text-purple-700',
  Delivered:  'bg-green-100 text-green-700',
  Cancelled:  'bg-red-100 text-red-700',
};

const statusIcons: Record<OrderStatus, string> = {
  Pending:    '🕐',
  Processing: '⚙️',
  Shipped:    '🚚',
  Delivered:  '✅',
  Cancelled:  '❌',
};

export default function MyOrdersPage() {
  const allOrders = useAppSelector(state => state.orders.items);
  const { user } = useAppSelector(state => state.user);

  // Show all orders for mock — in production would filter by user email
  const myOrders = allOrders;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          <Package className="text-orange-500" size={28} /> My Orders
        </h1>
        <p className="text-gray-500 mb-8">Track all your orders and their delivery status.</p>

        {myOrders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center">
            <ShoppingBag size={60} className="mx-auto text-gray-200 mb-4" />
            <h2 className="text-xl font-bold text-gray-700 mb-2">No orders yet</h2>
            <p className="text-gray-400 mb-6">Start shopping to see your orders here.</p>
            <Link href="/" className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-xl transition-colors inline-block">
              Shop Now
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {myOrders.map(order => (
              <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 border-b border-gray-50 bg-gray-50">
                  <div className="flex items-center gap-6 flex-wrap">
                    <div>
                      <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Order ID</p>
                      <p className="font-bold text-gray-800">{order.id}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Date</p>
                      <p className="font-medium text-gray-700">{order.date}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Total</p>
                      <p className="font-bold text-gray-900">{order.total}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1.5 rounded-full text-sm font-semibold ${statusStyles[order.status]}`}>
                    {statusIcons[order.status]} {order.status}
                  </span>
                </div>

                {/* Items */}
                <div className="px-6 py-4">
                  <div className="flex flex-wrap gap-4">
                    {order.items.map(item => (
                      <div key={item.id} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3 flex-1 min-w-[200px]">
                        <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-white flex-shrink-0 border border-gray-100">
                          <Image src={item.image} alt={item.name} fill className="object-contain p-1" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
                          <p className="text-xs text-gray-500">Qty: {item.quantity} × ${item.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-3 border-t border-gray-50 flex items-center justify-between">
                  <span className="text-sm text-gray-400">Payment: {order.paymentMethod}</span>
                  <Link href={`/account/orders/${order.id}`}
                    className="text-orange-500 hover:text-orange-600 text-sm font-semibold flex items-center gap-1 transition-colors">
                    View Details <ChevronRight size={16} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

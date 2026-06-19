"use client";

import { useState } from 'react';
import { Search, Eye, TrendingUp, Clock, Truck, CheckCircle, XCircle } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { updateOrderStatus, OrderStatus } from '@/store/orderSlice';
import Link from 'next/link';

const statusStyles: Record<OrderStatus, string> = {
  Pending:    'bg-yellow-100 text-yellow-700',
  Processing: 'bg-blue-100 text-blue-700',
  Shipped:    'bg-purple-100 text-purple-700',
  Delivered:  'bg-green-100 text-green-700',
  Cancelled:  'bg-red-100 text-red-700',
};

const allStatuses: OrderStatus[] = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

export default function AdminOrdersPage() {
  const orders = useAppSelector(state => state.orders.items);
  const dispatch = useAppDispatch();

  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<OrderStatus | 'All'>('All');

  const filtered = orders.filter(o => {
    const matchSearch = o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.toLowerCase().includes(search.toLowerCase()) ||
      o.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'All' || o.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const counts = {
    All: orders.length,
    Pending: orders.filter(o => o.status === 'Pending').length,
    Processing: orders.filter(o => o.status === 'Processing').length,
    Shipped: orders.filter(o => o.status === 'Shipped').length,
    Delivered: orders.filter(o => o.status === 'Delivered').length,
    Cancelled: orders.filter(o => o.status === 'Cancelled').length,
  };

  const revenue = orders
    .filter(o => o.status !== 'Cancelled')
    .reduce((sum, o) => sum + parseFloat(o.total.replace(/[$,]/g, '')), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Order Management</h2>
        <span className="text-sm text-gray-500">{orders.length} total orders</span>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center"><TrendingUp size={20} className="text-blue-600" /></div>
          <div><p className="text-xs text-gray-500">Revenue</p><p className="text-lg font-black text-gray-900">${revenue.toFixed(0)}</p></div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center"><Clock size={20} className="text-yellow-600" /></div>
          <div><p className="text-xs text-gray-500">Pending</p><p className="text-lg font-black text-gray-900">{counts.Pending}</p></div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center"><Truck size={20} className="text-purple-600" /></div>
          <div><p className="text-xs text-gray-500">Shipped</p><p className="text-lg font-black text-gray-900">{counts.Shipped}</p></div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center"><CheckCircle size={20} className="text-green-600" /></div>
          <div><p className="text-xs text-gray-500">Delivered</p><p className="text-lg font-black text-gray-900">{counts.Delivered}</p></div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Filters */}
        <div className="p-4 border-b border-gray-100 bg-gray-50 flex flex-wrap gap-3 items-center justify-between">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by ID, customer, email..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 w-72 text-sm"
            />
            <Search size={16} className="text-gray-400 absolute left-3 top-2.5" />
          </div>
          <div className="flex flex-wrap gap-2">
            {(['All', ...allStatuses] as const).map(status => (
              <button key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  filterStatus === status
                    ? 'bg-orange-500 text-white shadow'
                    : 'bg-white border border-gray-200 text-gray-600 hover:border-orange-300'
                }`}>
                {status} {counts[status] !== undefined ? `(${counts[status]})` : ''}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-500 border-b border-gray-100">
                <th className="p-4 font-medium">Order ID</th>
                <th className="p-4 font-medium">Customer</th>
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium">Items</th>
                <th className="p-4 font-medium">Total</th>
                <th className="p-4 font-medium">Payment</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => (
                <tr key={order.id} className="border-b border-gray-50 hover:bg-orange-50/30 transition-colors">
                  <td className="p-4 font-bold text-gray-800">{order.id}</td>
                  <td className="p-4">
                    <p className="font-medium text-gray-800">{order.customer}</p>
                    <p className="text-xs text-gray-400">{order.email}</p>
                  </td>
                  <td className="p-4 text-gray-500">{order.date}</td>
                  <td className="p-4 text-gray-500">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</td>
                  <td className="p-4 font-bold text-gray-900">{order.total}</td>
                  <td className="p-4 text-gray-500 text-xs">{order.paymentMethod}</td>
                  <td className="p-4">
                    <select
                      value={order.status}
                      onChange={e => dispatch(updateOrderStatus({ id: order.id, status: e.target.value as OrderStatus }))}
                      className={`px-2 py-1 rounded-lg text-xs font-semibold border cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-400 ${statusStyles[order.status]}`}
                    >
                      {allStatuses.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                  <td className="p-4 text-right">
                    <Link href={`/admin/orders/${order.id}`}
                      className="text-orange-500 hover:text-orange-700 p-1.5 rounded-lg hover:bg-orange-50 transition-colors inline-flex" title="View Details">
                      <Eye size={18} />
                    </Link>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-gray-400">
                    <XCircle size={40} className="mx-auto mb-2 text-gray-200" />
                    No orders match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

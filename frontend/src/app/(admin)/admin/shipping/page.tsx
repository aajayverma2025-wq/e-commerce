"use client";

import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { updateShipmentStatus, ShipmentStatus } from '@/store/shippingSlice';
import Link from 'next/link';
import { Search, Package, Truck, CheckCircle, XCircle, Clock, Eye } from 'lucide-react';

const statusStyles: Record<ShipmentStatus, string> = {
  'Pending':          'bg-gray-100 text-gray-600',
  'Picked Up':        'bg-blue-100 text-blue-700',
  'In Transit':       'bg-yellow-100 text-yellow-700',
  'Out for Delivery': 'bg-orange-100 text-orange-700',
  'Delivered':        'bg-green-100 text-green-700',
  'Failed':           'bg-red-100 text-red-700',
};

const statusIcons: Record<ShipmentStatus, string> = {
  'Pending':          '🕐',
  'Picked Up':        '📦',
  'In Transit':       '🚚',
  'Out for Delivery': '🏃',
  'Delivered':        '✅',
  'Failed':           '❌',
};

const allStatuses: ShipmentStatus[] = ['Pending', 'Picked Up', 'In Transit', 'Out for Delivery', 'Delivered', 'Failed'];

export default function AdminShippingPage() {
  const { shipments } = useAppSelector(state => state.shipping);
  const dispatch = useAppDispatch();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<ShipmentStatus | 'All'>('All');

  const filtered = shipments.filter(s => {
    const matchSearch =
      s.id.toLowerCase().includes(search.toLowerCase()) ||
      s.orderId.toLowerCase().includes(search.toLowerCase()) ||
      s.customer.toLowerCase().includes(search.toLowerCase()) ||
      s.trackingNumber.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'All' || s.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const counts = {
    total: shipments.length,
    inTransit: shipments.filter(s => s.status === 'In Transit').length,
    outForDelivery: shipments.filter(s => s.status === 'Out for Delivery').length,
    delivered: shipments.filter(s => s.status === 'Delivered').length,
    failed: shipments.filter(s => s.status === 'Failed').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-bold text-gray-800">Shipping Management</h2>
        <div className="flex gap-2">
          <Link href="/admin/shipping/zones" className="text-sm border border-gray-200 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg transition-colors font-medium">
            🌍 Shipping Zones
          </Link>
          <Link href="/admin/shipping/carriers" className="text-sm bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors font-medium">
            🚚 Carriers
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Total Shipments', value: counts.total, icon: <Package size={18}/>, color: 'from-blue-500 to-blue-600', shadow: 'shadow-blue-100' },
          { label: 'In Transit', value: counts.inTransit, icon: <Truck size={18}/>, color: 'from-yellow-400 to-yellow-500', shadow: 'shadow-yellow-100' },
          { label: 'Out for Delivery', value: counts.outForDelivery, icon: <Clock size={18}/>, color: 'from-orange-400 to-orange-500', shadow: 'shadow-orange-100' },
          { label: 'Delivered', value: counts.delivered, icon: <CheckCircle size={18}/>, color: 'from-green-500 to-green-600', shadow: 'shadow-green-100' },
          { label: 'Failed', value: counts.failed, icon: <XCircle size={18}/>, color: 'from-red-500 to-red-600', shadow: 'shadow-red-100' },
        ].map(stat => (
          <div key={stat.label} className={`bg-gradient-to-br ${stat.color} rounded-2xl p-4 text-white shadow-lg ${stat.shadow}`}>
            <div className="flex items-center gap-2 mb-2 opacity-80">{stat.icon}<span className="text-xs font-medium">{stat.label}</span></div>
            <p className="text-3xl font-black">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50 flex flex-wrap gap-3 items-center justify-between">
          <div className="relative">
            <input type="text" placeholder="Search shipment, order, tracking #..."
              value={search} onChange={e => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 w-72 text-sm" />
            <Search size={16} className="text-gray-400 absolute left-3 top-2.5" />
          </div>
          <div className="flex flex-wrap gap-2">
            {(['All', ...allStatuses] as const).map(s => (
              <button key={s} onClick={() => setFilterStatus(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  filterStatus === s ? 'bg-orange-500 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-orange-300'
                }`}>{s}</button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-500 border-b border-gray-100">
                <th className="p-4 font-medium">Shipment ID</th>
                <th className="p-4 font-medium">Order</th>
                <th className="p-4 font-medium">Customer</th>
                <th className="p-4 font-medium">Carrier & Tracking</th>
                <th className="p-4 font-medium">Destination</th>
                <th className="p-4 font-medium">Est. Delivery</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.id} className="border-b border-gray-50 hover:bg-orange-50/30 transition-colors">
                  <td className="p-4 font-bold text-gray-700 text-xs">{s.id}</td>
                  <td className="p-4">
                    <Link href={`/admin/orders/${s.orderId}`} className="text-orange-500 hover:underline font-semibold text-xs">{s.orderId}</Link>
                  </td>
                  <td className="p-4 font-medium text-gray-800">{s.customer}</td>
                  <td className="p-4">
                    <p className="font-semibold text-gray-800">{s.carrier}</p>
                    <p className="text-xs font-mono text-gray-400">{s.trackingNumber}</p>
                  </td>
                  <td className="p-4">
                    <p className="text-gray-700">{s.city}</p>
                    <p className="text-xs text-gray-400">{s.country}</p>
                  </td>
                  <td className="p-4 text-gray-600 text-xs">{s.estimatedDelivery}</td>
                  <td className="p-4">
                    <select value={s.status}
                      onChange={e => dispatch(updateShipmentStatus({ id: s.id, status: e.target.value as ShipmentStatus, location: s.city }))}
                      className={`px-2 py-1 rounded-lg text-xs font-semibold cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-400 ${statusStyles[s.status]}`}>
                      {allStatuses.map(st => <option key={st} value={st}>{statusIcons[st]} {st}</option>)}
                    </select>
                  </td>
                  <td className="p-4 text-right">
                    <Link href={`/admin/shipping/${s.id}`}
                      className="text-orange-500 hover:text-orange-700 p-1.5 rounded-lg hover:bg-orange-50 transition-colors inline-flex" title="View Shipment">
                      <Eye size={16} />
                    </Link>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="p-12 text-center text-gray-400">
                  <Package size={40} className="mx-auto mb-2 text-gray-200" />No shipments found.
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { toggleCarrier, updateCarrier, addCarrier } from '@/store/shippingSlice';
import Link from 'next/link';
import { ArrowLeft, Plus, Save, Truck } from 'lucide-react';

export default function CarriersPage() {
  const { carriers } = useAppSelector(state => state.shipping);
  const dispatch = useAppDispatch();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<typeof carriers[0] | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newCarrier, setNewCarrier] = useState({ name: '', logo: '📦', trackingUrl: '', avgDeliveryDays: '', costPerKg: 5 });

  const startEdit = (carrier: typeof carriers[0]) => {
    setEditingId(carrier.id);
    setEditData({ ...carrier });
  };

  const saveEdit = () => {
    if (editData) dispatch(updateCarrier(editData));
    setEditingId(null);
  };

  const handleAdd = () => {
    if (!newCarrier.name) return;
    dispatch(addCarrier({ ...newCarrier, id: `c${Date.now()}`, isActive: true }));
    setNewCarrier({ name: '', logo: '📦', trackingUrl: '', avgDeliveryDays: '', costPerKg: 5 });
    setShowAdd(false);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/shipping" className="text-gray-400 hover:text-gray-600 transition-colors"><ArrowLeft size={20} /></Link>
          <h2 className="text-2xl font-bold text-gray-800">Carrier Management</h2>
        </div>
        <button onClick={() => setShowAdd(!showAdd)}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors">
          <Plus size={16} /> Add Carrier
        </button>
      </div>

      {/* Add Carrier Form */}
      {showAdd && (
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6 space-y-4">
          <h3 className="font-bold text-gray-800">New Carrier</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Carrier Name *</label>
              <input value={newCarrier.name} onChange={e => setNewCarrier(p => ({ ...p, name: e.target.value }))}
                placeholder="e.g. FedEx" className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-900" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Emoji / Logo</label>
              <input value={newCarrier.logo} onChange={e => setNewCarrier(p => ({ ...p, logo: e.target.value }))}
                placeholder="📦" className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Avg. Delivery Days</label>
              <input value={newCarrier.avgDeliveryDays} onChange={e => setNewCarrier(p => ({ ...p, avgDeliveryDays: e.target.value }))}
                placeholder="1–3 days" className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-900" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Cost per kg ($)</label>
              <input type="number" value={newCarrier.costPerKg} onChange={e => setNewCarrier(p => ({ ...p, costPerKg: +e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-900" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Tracking URL</label>
              <input value={newCarrier.trackingUrl} onChange={e => setNewCarrier(p => ({ ...p, trackingUrl: e.target.value }))}
                placeholder="https://..." className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-900" />
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={handleAdd} className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1">
              <Plus size={14} /> Add Carrier
            </button>
            <button onClick={() => setShowAdd(false)} className="text-gray-500 text-sm px-3 hover:text-gray-700">Cancel</button>
          </div>
        </div>
      )}

      {/* Carriers List */}
      <div className="grid grid-cols-1 gap-4">
        {carriers.map(carrier => (
          <div key={carrier.id} className={`bg-white rounded-2xl border shadow-sm overflow-hidden ${carrier.isActive ? 'border-gray-100' : 'border-dashed border-gray-200 opacity-70'}`}>
            {editingId === carrier.id && editData ? (
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Name</label>
                    <input value={editData.name} onChange={e => setEditData(p => p ? { ...p, name: e.target.value } : p)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-900" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Avg. Delivery</label>
                    <input value={editData.avgDeliveryDays} onChange={e => setEditData(p => p ? { ...p, avgDeliveryDays: e.target.value } : p)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-900" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Cost per kg ($)</label>
                    <input type="number" value={editData.costPerKg} onChange={e => setEditData(p => p ? { ...p, costPerKg: +e.target.value } : p)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-900" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Tracking URL</label>
                    <input value={editData.trackingUrl} onChange={e => setEditData(p => p ? { ...p, trackingUrl: e.target.value } : p)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-900" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={saveEdit} className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-1">
                    <Save size={14} /> Save
                  </button>
                  <button onClick={() => setEditingId(null)} className="text-gray-500 text-sm px-3">Cancel</button>
                </div>
              </div>
            ) : (
              <div className="p-5 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-2xl border border-gray-100">{carrier.logo}</div>
                  <div>
                    <h3 className="font-bold text-gray-800">{carrier.name}</h3>
                    <p className="text-xs text-gray-500">⏱ {carrier.avgDeliveryDays} · 💰 ${carrier.costPerKg}/kg</p>
                    <p className="text-xs text-blue-500 hover:underline truncate max-w-xs">
                      <a href={carrier.trackingUrl} target="_blank" rel="noopener">{carrier.trackingUrl}</a>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${carrier.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {carrier.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <button onClick={() => startEdit(carrier)} className="text-sm border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors">Edit</button>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={carrier.isActive} onChange={() => dispatch(toggleCarrier(carrier.id))} className="sr-only peer" />
                    <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-orange-500"></div>
                  </label>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

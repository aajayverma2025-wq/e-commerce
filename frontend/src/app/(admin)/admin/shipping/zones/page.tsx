"use client";

import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { toggleZone, updateZone, addZone } from '@/store/shippingSlice';
import Link from 'next/link';
import { ArrowLeft, Plus, Save, Globe } from 'lucide-react';

export default function ShippingZonesPage() {
  const { zones } = useAppSelector(state => state.shipping);
  const dispatch = useAppDispatch();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<typeof zones[0] | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newZone, setNewZone] = useState({ name: '', countries: '', standardRate: 10, expressRate: 25, freeShippingThreshold: 100 });

  const startEdit = (zone: typeof zones[0]) => {
    setEditingId(zone.id);
    setEditData({ ...zone });
  };

  const saveEdit = () => {
    if (editData) dispatch(updateZone(editData));
    setEditingId(null);
  };

  const handleAdd = () => {
    if (!newZone.name) return;
    dispatch(addZone({
      id: `z${Date.now()}`,
      name: newZone.name,
      countries: newZone.countries.split(',').map(c => c.trim()).filter(Boolean),
      standardRate: newZone.standardRate,
      expressRate: newZone.expressRate,
      freeShippingThreshold: newZone.freeShippingThreshold,
      isActive: true,
    }));
    setNewZone({ name: '', countries: '', standardRate: 10, expressRate: 25, freeShippingThreshold: 100 });
    setShowAdd(false);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/shipping" className="text-gray-400 hover:text-gray-600 transition-colors"><ArrowLeft size={20} /></Link>
          <h2 className="text-2xl font-bold text-gray-800">Shipping Zones & Rates</h2>
        </div>
        <button onClick={() => setShowAdd(!showAdd)}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors">
          <Plus size={16} /> Add Zone
        </button>
      </div>

      <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 text-sm text-orange-700">
        <Globe size={16} className="inline mr-2" />
        Shipping zones define the rates charged to customers based on their delivery country. Zones with <strong>Free Shipping Threshold</strong> will waive shipping fees for orders above that amount.
      </div>

      {/* Add Zone */}
      {showAdd && (
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6 space-y-4">
          <h3 className="font-bold text-gray-800">New Shipping Zone</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Zone Name *</label>
              <input value={newZone.name} onChange={e => setNewZone(p => ({ ...p, name: e.target.value }))}
                placeholder="e.g. South Asia" className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-900" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Countries (comma-separated)</label>
              <input value={newZone.countries} onChange={e => setNewZone(p => ({ ...p, countries: e.target.value }))}
                placeholder="India, Bangladesh, Sri Lanka" className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-900" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Standard Rate ($)</label>
              <input type="number" value={newZone.standardRate} onChange={e => setNewZone(p => ({ ...p, standardRate: +e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-900" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Express Rate ($)</label>
              <input type="number" value={newZone.expressRate} onChange={e => setNewZone(p => ({ ...p, expressRate: +e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-900" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Free Shipping Threshold ($)</label>
              <input type="number" value={newZone.freeShippingThreshold} onChange={e => setNewZone(p => ({ ...p, freeShippingThreshold: +e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-900" />
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={handleAdd} className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-orange-600 transition-colors flex items-center gap-1">
              <Plus size={14} /> Create Zone
            </button>
            <button onClick={() => setShowAdd(false)} className="text-gray-500 text-sm px-3 hover:text-gray-700">Cancel</button>
          </div>
        </div>
      )}

      {/* Zones Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-gray-500">
              <th className="p-4 font-medium">Zone</th>
              <th className="p-4 font-medium">Countries</th>
              <th className="p-4 font-medium">Standard Rate</th>
              <th className="p-4 font-medium">Express Rate</th>
              <th className="p-4 font-medium">Free Shipping ≥</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {zones.map(zone => (
              <tr key={zone.id} className={`border-b border-gray-50 ${!zone.isActive ? 'opacity-50' : 'hover:bg-orange-50/20'} transition-colors`}>
                {editingId === zone.id && editData ? (
                  <td colSpan={7} className="p-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Name</label>
                        <input value={editData.name} onChange={e => setEditData(p => p ? { ...p, name: e.target.value } : p)}
                          className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-900" />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Standard ($)</label>
                        <input type="number" value={editData.standardRate} onChange={e => setEditData(p => p ? { ...p, standardRate: +e.target.value } : p)}
                          className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-900" />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Express ($)</label>
                        <input type="number" value={editData.expressRate} onChange={e => setEditData(p => p ? { ...p, expressRate: +e.target.value } : p)}
                          className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-900" />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Free Threshold ($)</label>
                        <input type="number" value={editData.freeShippingThreshold} onChange={e => setEditData(p => p ? { ...p, freeShippingThreshold: +e.target.value } : p)}
                          className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-900" />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={saveEdit} className="bg-orange-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 hover:bg-orange-600">
                        <Save size={12} /> Save
                      </button>
                      <button onClick={() => setEditingId(null)} className="text-gray-500 text-xs px-2">Cancel</button>
                    </div>
                  </td>
                ) : (
                  <>
                    <td className="p-4 font-bold text-gray-800">{zone.name}</td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {zone.countries.map(c => (
                          <span key={c} className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">{c}</span>
                        ))}
                      </div>
                    </td>
                    <td className="p-4 font-semibold text-gray-800">${zone.standardRate}</td>
                    <td className="p-4 font-semibold text-purple-600">${zone.expressRate}</td>
                    <td className="p-4 font-semibold text-green-600">${zone.freeShippingThreshold}</td>
                    <td className="p-4">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${zone.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {zone.isActive ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => startEdit(zone)} className="text-xs border border-gray-200 px-2 py-1 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors">Edit</button>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" checked={zone.isActive} onChange={() => dispatch(toggleZone(zone.id))} className="sr-only peer" />
                          <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-orange-500"></div>
                        </label>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

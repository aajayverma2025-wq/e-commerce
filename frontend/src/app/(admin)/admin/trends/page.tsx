"use client";

import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { updateTrendsFeed, TrendItem } from '@/store/siteSlice';
import { Plus, Trash2, Edit } from 'lucide-react';

export default function AdminTrendsPage() {
  const { trendsFeed = [] } = useAppSelector(state => state.site);
  const dispatch = useAppDispatch();

  const handleDelete = (id: string) => {
    dispatch(updateTrendsFeed(trendsFeed.filter(t => t.id !== id)));
  };

  const handleAdd = () => {
    const newItem: TrendItem = {
      id: Date.now().toString(),
      name: 'New Trending Item',
      price: 10.00,
      img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=400&fit=crop',
      sold: '0+'
    };
    dispatch(updateTrendsFeed([newItem, ...trendsFeed]));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Manage Trends Feed</h2>
        <button 
          onClick={handleAdd}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={18} /> Add Trend Item
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-100">
              <th className="p-4 font-medium">Image</th>
              <th className="p-4 font-medium">Name</th>
              <th className="p-4 font-medium">Price</th>
              <th className="p-4 font-medium">Sold</th>
              <th className="p-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {trendsFeed.map((item) => (
              <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="p-4">
                  <div className="w-12 h-12 rounded bg-gray-100 overflow-hidden">
                    <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                </td>
                <td className="p-4 font-medium text-gray-900">{item.name}</td>
                <td className="p-4 text-gray-500">${item.price.toFixed(2)}</td>
                <td className="p-4 text-gray-500">{item.sold}</td>
                <td className="p-4 text-right">
                  <button className="text-blue-500 hover:text-blue-700 mr-3">
                    <Edit size={18} />
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-700">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {trendsFeed.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">No trending items found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

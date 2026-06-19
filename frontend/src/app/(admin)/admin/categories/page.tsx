"use client";

import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { updateAppCategories, AppCategory } from '@/store/siteSlice';
import { Plus, Trash2, Edit, Save, X } from 'lucide-react';

export default function AdminCategoriesPage() {
  const { appCategories = [] } = useAppSelector(state => state.site);
  const dispatch = useAppDispatch();
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editImg, setEditImg] = useState('');

  const handleDelete = (id: string) => {
    dispatch(updateAppCategories(appCategories.filter(c => c.id !== id)));
  };

  const handleEdit = (category: AppCategory) => {
    setEditingId(category.id);
    setEditName(category.name);
    setEditImg(category.img);
  };

  const handleSave = (id: string) => {
    const updatedCategories = appCategories.map(c => 
      c.id === id ? { ...c, name: editName, img: editImg } : c
    );
    dispatch(updateAppCategories(updatedCategories));
    setEditingId(null);
  };

  const handleAdd = () => {
    const newItem: AppCategory = {
      id: Date.now().toString(),
      name: 'New Category',
      img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=150&h=150&fit=crop',
    };
    dispatch(updateAppCategories([newItem, ...appCategories]));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">App Categories (Mobile Layout)</h2>
        <button 
          onClick={handleAdd}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={18} /> Add Category
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-100">
              <th className="p-4 font-medium">Image</th>
              <th className="p-4 font-medium">Category Name</th>
              <th className="p-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {appCategories.map((category) => (
              <tr key={category.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="p-4">
                  {editingId === category.id ? (
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gray-100 overflow-hidden border border-gray-200 flex-shrink-0">
                        <img src={editImg || category.img} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                      <label className="cursor-pointer bg-white hover:bg-gray-50 text-gray-700 text-xs font-medium px-3 py-1.5 rounded border border-gray-300 transition-colors shadow-sm whitespace-nowrap">
                        Upload
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => setEditImg(reader.result as string);
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-100 overflow-hidden border border-gray-200">
                      <img src={category.img} alt={category.name} className="w-full h-full object-cover" />
                    </div>
                  )}
                </td>
                <td className="p-4 font-medium text-gray-900">
                  {editingId === category.id ? (
                    <input 
                      type="text" 
                      value={editName} 
                      onChange={e => setEditName(e.target.value)} 
                      className="w-full border border-gray-300 rounded p-1.5 text-sm" 
                      placeholder="Category Name" 
                    />
                  ) : (
                    category.name
                  )}
                </td>
                <td className="p-4 text-right whitespace-nowrap">
                  {editingId === category.id ? (
                    <>
                      <button onClick={() => handleSave(category.id)} className="text-green-600 hover:text-green-800 mr-3" title="Save">
                        <Save size={18} />
                      </button>
                      <button onClick={() => setEditingId(null)} className="text-gray-500 hover:text-gray-700" title="Cancel">
                        <X size={18} />
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => handleEdit(category)} className="text-blue-500 hover:text-blue-700 mr-3" title="Edit">
                        <Edit size={18} />
                      </button>
                      <button onClick={() => handleDelete(category.id)} className="text-red-500 hover:text-red-700" title="Delete">
                        <Trash2 size={18} />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
            {appCategories.length === 0 && (
              <tr>
                <td colSpan={3} className="p-8 text-center text-gray-500">No categories found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

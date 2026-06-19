"use client";

import { useState } from 'react';
import {
  Plus, X, Trash2, Edit2, Copy, Tag, Percent, DollarSign,
  Calendar, ToggleLeft, ToggleRight, Search, BadgePercent, Eye
} from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import {
  addDiscount, updateDiscount, deleteDiscount, toggleDiscountStatus, toggleBanner,
  Discount, DiscountType, DiscountStatus, DiscountTarget
} from '@/store/discountSlice';

const emptyForm = (): Omit<Discount, 'id' | 'usedCount'> => ({
  code: '',
  label: '',
  type: 'percentage',
  value: 10,
  minOrder: 0,
  maxUses: 0,
  target: 'all',
  targetValue: '',
  startDate: new Date().toISOString().split('T')[0],
  endDate: '',
  status: 'Active',
  showBanner: false,
  bannerText: '',
});

const STATUS_COLORS: Record<DiscountStatus, string> = {
  Active:    'bg-green-100 text-green-700',
  Scheduled: 'bg-blue-100 text-blue-700',
  Expired:   'bg-gray-100 text-gray-500',
  Disabled:  'bg-red-100 text-red-600',
};

export default function AdminDiscountsPage() {
  const dispatch = useAppDispatch();
  const { discounts } = useAppSelector(state => state.discounts);

  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState<Discount | null>(null);
  const [form, setForm] = useState<Omit<Discount, 'id' | 'usedCount'>>(emptyForm());
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const filtered = discounts.filter(d => {
    const matchSearch =
      d.code.toLowerCase().includes(search.toLowerCase()) ||
      d.label.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'All' || d.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const stats = {
    total: discounts.length,
    active: discounts.filter(d => d.status === 'Active').length,
    scheduled: discounts.filter(d => d.status === 'Scheduled').length,
    totalUses: discounts.reduce((s, d) => s + d.usedCount, 0),
  };

  const openCreate = () => {
    setEditTarget(null);
    setForm(emptyForm());
    setShowModal(true);
  };

  const openEdit = (d: Discount) => {
    setEditTarget(d);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, usedCount, ...rest } = d;
    setForm(rest);
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.code.trim() || !form.label.trim() || !form.endDate) {
      alert('Please fill in Code, Label, and End Date.');
      return;
    }
    if (editTarget) {
      dispatch(updateDiscount({ ...form, id: editTarget.id, usedCount: editTarget.usedCount }));
    } else {
      dispatch(addDiscount(form));
    }
    setShowModal(false);
  };

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Discounts', value: stats.total, color: 'bg-purple-50 text-purple-700 border-purple-100' },
          { label: 'Active Now', value: stats.active, color: 'bg-green-50 text-green-700 border-green-100' },
          { label: 'Scheduled', value: stats.scheduled, color: 'bg-blue-50 text-blue-700 border-blue-100' },
          { label: 'Total Uses', value: stats.totalUses, color: 'bg-orange-50 text-orange-700 border-orange-100' },
        ].map(s => (
          <div key={s.label} className={`rounded-xl border p-4 flex flex-col gap-1 ${s.color}`}>
            <span className="text-2xl font-black">{s.value}</span>
            <span className="text-xs font-medium opacity-80">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Discount & Coupon Manager</h2>
        <button
          onClick={openCreate}
          className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors shadow-sm"
        >
          <Plus size={18} /> Create Discount
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 bg-gray-50">
          <div className="relative">
            <input
              type="text"
              placeholder="Search code or label..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 w-72 text-gray-900"
            />
            <Search size={17} className="text-gray-400 absolute left-3 top-2.5" />
          </div>
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white text-gray-800"
          >
            <option>All</option>
            <option>Active</option>
            <option>Scheduled</option>
            <option>Expired</option>
            <option>Disabled</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-gray-500 text-sm border-b border-gray-100 bg-white">
                <th className="p-4 font-medium">Code</th>
                <th className="p-4 font-medium">Label</th>
                <th className="p-4 font-medium">Discount</th>
                <th className="p-4 font-medium">Min Order</th>
                <th className="p-4 font-medium">Uses</th>
                <th className="p-4 font-medium">Validity</th>
                <th className="p-4 font-medium">Banner</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-10 text-center text-gray-400">
                    <BadgePercent size={40} className="mx-auto mb-2 opacity-20" />
                    No discounts found.
                  </td>
                </tr>
              ) : filtered.map(d => (
                <tr key={d.id} className="border-b border-gray-50 hover:bg-orange-50/30 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded text-sm tracking-widest">
                        {d.code}
                      </span>
                      <button
                        onClick={() => handleCopy(d.code)}
                        className="text-gray-300 hover:text-orange-500 transition-colors"
                        title="Copy Code"
                      >
                        {copiedCode === d.code
                          ? <span className="text-[10px] text-green-500 font-bold">✓</span>
                          : <Copy size={13} />}
                      </button>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-medium text-gray-900 text-sm">{d.label}</div>
                    <div className="text-xs text-gray-400 capitalize">{d.target === 'all' ? 'All products' : `${d.target}: ${d.targetValue}`}</div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1 font-bold text-sm ${d.type === 'percentage' ? 'text-purple-600' : 'text-green-600'}`}>
                      {d.type === 'percentage' ? <Percent size={13} /> : <DollarSign size={13} />}
                      {d.value}{d.type === 'percentage' ? '%' : ' off'}
                    </span>
                  </td>
                  <td className="p-4 text-gray-500 text-sm">
                    {d.minOrder > 0 ? `Min $${d.minOrder}` : <span className="text-gray-300">—</span>}
                  </td>
                  <td className="p-4 text-sm text-gray-600">
                    {d.usedCount}
                    {d.maxUses > 0 && <span className="text-gray-400"> / {d.maxUses}</span>}
                    {d.maxUses === 0 && <span className="text-gray-400"> / ∞</span>}
                  </td>
                  <td className="p-4 text-xs text-gray-500">
                    <div>{d.startDate}</div>
                    <div>→ {d.endDate || '—'}</div>
                  </td>
                  <td className="p-4">
                    <button onClick={() => dispatch(toggleBanner(d.id))}>
                      {d.showBanner
                        ? <ToggleRight size={24} className="text-orange-500" />
                        : <ToggleLeft size={24} className="text-gray-300" />}
                    </button>
                  </td>
                  <td className="p-4">
                    <select
                      value={d.status}
                      onChange={e => dispatch(toggleDiscountStatus({ id: d.id, status: e.target.value as DiscountStatus }))}
                      className={`text-xs font-medium px-2 py-1 rounded-full border-0 outline-none cursor-pointer ${STATUS_COLORS[d.status]}`}
                    >
                      <option>Active</option>
                      <option>Scheduled</option>
                      <option>Expired</option>
                      <option>Disabled</option>
                    </select>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEdit(d)}
                        className="text-gray-400 hover:text-orange-500 transition-colors p-1"
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Delete this discount?')) dispatch(deleteDiscount(d.id));
                        }}
                        className="text-gray-300 hover:text-red-500 transition-colors p-1"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Active Banners Preview */}
      {discounts.filter(d => d.showBanner && d.status === 'Active').length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
            <Eye size={18} className="text-gray-500" />
            <h3 className="font-bold text-gray-800">Live Promo Banners (Storefront Preview)</h3>
          </div>
          <div className="p-4 space-y-2">
            {discounts.filter(d => d.showBanner && d.status === 'Active').map(d => (
              <div key={d.id} className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg px-4 py-3 text-sm font-medium flex items-center gap-2">
                <Tag size={15} />
                {d.bannerText || `Use code ${d.code} for ${d.value}${d.type === 'percentage' ? '%' : '$'} off!`}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── CREATE / EDIT MODAL ── */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <BadgePercent size={20} className="text-orange-500" />
                {editTarget ? 'Edit Discount' : 'Create New Discount'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><X size={22} /></button>
            </div>

            <div className="p-6 space-y-5">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Coupon Code *</label>
                  <input
                    type="text"
                    placeholder="e.g. SUMMER20"
                    value={form.code}
                    onChange={e => setForm({ ...form, code: e.target.value.toUpperCase().replace(/\s/g, '') })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none text-gray-900 font-mono tracking-widest uppercase"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Label / Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Summer Sale"
                    value={form.label}
                    onChange={e => setForm({ ...form, label: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none text-gray-900"
                  />
                </div>
              </div>

              {/* Discount Type & Value */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Discount Type</label>
                  <div className="flex rounded-lg overflow-hidden border border-gray-200">
                    <button
                      onClick={() => setForm({ ...form, type: 'percentage' })}
                      className={`flex-1 py-2 text-sm font-medium flex items-center justify-center gap-1 transition-colors ${form.type === 'percentage' ? 'bg-orange-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                    >
                      <Percent size={14} /> Percentage
                    </button>
                    <button
                      onClick={() => setForm({ ...form, type: 'fixed' })}
                      className={`flex-1 py-2 text-sm font-medium flex items-center justify-center gap-1 transition-colors ${form.type === 'fixed' ? 'bg-orange-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                    >
                      <DollarSign size={14} /> Fixed Amount
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Discount Value {form.type === 'percentage' ? '(%)' : '($)'}
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={form.type === 'percentage' ? 100 : undefined}
                    value={form.value}
                    onChange={e => setForm({ ...form, value: Number(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none text-gray-900"
                  />
                </div>
              </div>

              {/* Min Order & Max Uses */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Min Order Amount ($)</label>
                  <input
                    type="number" min={0}
                    value={form.minOrder}
                    onChange={e => setForm({ ...form, minOrder: Number(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none text-gray-900"
                  />
                  <p className="text-xs text-gray-400 mt-1">Set 0 for no minimum</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Uses (0 = Unlimited)</label>
                  <input
                    type="number" min={0}
                    value={form.maxUses}
                    onChange={e => setForm({ ...form, maxUses: Number(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none text-gray-900"
                  />
                </div>
              </div>

              {/* Target */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Applies To</label>
                  <select
                    value={form.target}
                    onChange={e => setForm({ ...form, target: e.target.value as DiscountTarget, targetValue: '' })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none text-gray-900 bg-white"
                  >
                    <option value="all">All Products</option>
                    <option value="category">Specific Category</option>
                    <option value="product">Specific Product ID</option>
                  </select>
                </div>
                {form.target !== 'all' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {form.target === 'category' ? 'Category Name' : 'Product ID'}
                    </label>
                    <input
                      type="text"
                      placeholder={form.target === 'category' ? 'e.g. Electronics' : 'e.g. P001'}
                      value={form.targetValue}
                      onChange={e => setForm({ ...form, targetValue: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none text-gray-900"
                    />
                  </div>
                )}
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={form.startDate}
                    onChange={e => setForm({ ...form, startDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date *</label>
                  <input
                    type="date"
                    value={form.endDate}
                    onChange={e => setForm({ ...form, endDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none text-gray-900"
                  />
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <div className="flex gap-2 flex-wrap">
                  {(['Active', 'Scheduled', 'Disabled'] as DiscountStatus[]).map(s => (
                    <button
                      key={s}
                      onClick={() => setForm({ ...form, status: s })}
                      className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                        form.status === s
                          ? s === 'Active' ? 'bg-green-500 text-white border-green-500'
                            : s === 'Scheduled' ? 'bg-blue-500 text-white border-blue-500'
                            : 'bg-red-500 text-white border-red-500'
                          : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Promo Banner */}
              <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-800 text-sm">Show Promo Banner</h4>
                    <p className="text-xs text-gray-500">Display an announcement bar on the storefront</p>
                  </div>
                  <button onClick={() => setForm({ ...form, showBanner: !form.showBanner })}>
                    {form.showBanner
                      ? <ToggleRight size={28} className="text-orange-500" />
                      : <ToggleLeft size={28} className="text-gray-300" />}
                  </button>
                </div>
                {form.showBanner && (
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Banner Text</label>
                    <input
                      type="text"
                      placeholder="e.g. Use code SAVE20 for 20% off your order!"
                      value={form.bannerText}
                      onChange={e => setForm({ ...form, bannerText: e.target.value })}
                      className="w-full px-3 py-2 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none text-gray-900 text-sm"
                    />
                    {form.bannerText && (
                      <div className="mt-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg px-3 py-2 text-xs font-medium flex items-center gap-1">
                        <Tag size={12} /> {form.bannerText}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3 p-6 border-t border-gray-100 sticky bottom-0 bg-white">
              <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors font-medium">Cancel</button>
              <button onClick={handleSave} className="flex-1 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-bold transition-colors">
                {editTarget ? 'Save Changes' : 'Create Discount'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

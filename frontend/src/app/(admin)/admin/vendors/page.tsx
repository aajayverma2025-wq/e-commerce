"use client";

import { useState } from 'react';
import { Search, UserCheck, UserX, Eye, Plus, X, RefreshCw, Copy, Trash2, KeyRound, Building2, ChevronDown, ShieldCheck, DollarSign } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { addVendor, updateVendorStatus, updateVendor, deleteVendor, regenerateAccessKey, Vendor, VendorStatus } from '@/store/vendorSlice';

const CATEGORIES = ['Electronics', 'Fashion', 'Food & Organic', 'Home & Living', 'Sports', 'Beauty', 'Books', 'Toys', 'Other'];

export default function AdminVendorsPage() {
  const dispatch = useAppDispatch();
  const { vendors } = useAppSelector(state => state.vendors);

  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [viewVendor, setViewVendor] = useState<Vendor | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // New vendor form state
  const [form, setForm] = useState({
    businessName: '',
    ownerName: '',
    email: '',
    contact: '',
    category: 'Electronics',
    status: 'Pending Approval' as VendorStatus,
  });

  const filtered = vendors.filter(v => {
    const matchSearch = v.businessName.toLowerCase().includes(search.toLowerCase()) ||
      v.id.toLowerCase().includes(search.toLowerCase()) ||
      v.ownerName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'All' || v.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const handleCreate = () => {
    if (!form.businessName || !form.ownerName || !form.email || !form.contact) {
      alert('Please fill in all required fields.');
      return;
    }
    dispatch(addVendor(form));
    setForm({ businessName: '', ownerName: '', email: '', contact: '', category: 'Electronics', status: 'Pending Approval' });
    setShowCreateModal(false);
  };

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleRegenerateKey = (id: string) => {
    if (confirm('Regenerate access key? The old key will stop working immediately.')) {
      dispatch(regenerateAccessKey(id));
      // Update the viewVendor if it's open
      if (viewVendor?.id === id) {
        const updated = vendors.find(v => v.id === id);
        if (updated) setViewVendor({ ...updated });
      }
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to permanently delete this vendor?')) {
      dispatch(deleteVendor(id));
      if (viewVendor?.id === id) setViewVendor(null);
    }
  };

  const stats = {
    total: vendors.length,
    active: vendors.filter(v => v.status === 'Active').length,
    pending: vendors.filter(v => v.status === 'Pending Approval').length,
    suspended: vendors.filter(v => v.status === 'Suspended').length,
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Vendors', value: stats.total, color: 'bg-blue-50 text-blue-700 border-blue-100' },
          { label: 'Active', value: stats.active, color: 'bg-green-50 text-green-700 border-green-100' },
          { label: 'Pending Approval', value: stats.pending, color: 'bg-yellow-50 text-yellow-700 border-yellow-100' },
          { label: 'Suspended', value: stats.suspended, color: 'bg-red-50 text-red-700 border-red-100' },
        ].map(s => (
          <div key={s.label} className={`rounded-xl border p-4 flex flex-col gap-1 ${s.color}`}>
            <span className="text-2xl font-black">{s.value}</span>
            <span className="text-xs font-medium opacity-80">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Header + Actions */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Vendor Management</h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors shadow-sm"
        >
          <Plus size={18} /> Create Vendor
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 bg-gray-50">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name, ID or owner..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 w-72 text-gray-900"
            />
            <Search size={18} className="text-gray-400 absolute left-3 top-2.5" />
          </div>
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white text-gray-800"
          >
            <option>All</option>
            <option>Active</option>
            <option>Pending Approval</option>
            <option>Suspended</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white text-gray-500 text-sm border-b border-gray-100">
                <th className="p-4 font-medium">Vendor ID</th>
                <th className="p-4 font-medium">Business</th>
                <th className="p-4 font-medium">Owner</th>
                <th className="p-4 font-medium">Contact</th>
                <th className="p-4 font-medium">Products</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-400">
                    <Building2 size={40} className="mx-auto mb-2 opacity-20" />
                    No vendors found.
                  </td>
                </tr>
              ) : filtered.map(vendor => (
                <tr key={vendor.id} className="border-b border-gray-50 hover:bg-orange-50/30 transition-colors">
                  <td className="p-4">
                    <span className="font-mono text-sm font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded">{vendor.id}</span>
                  </td>
                  <td className="p-4">
                    <div className="font-medium text-gray-900">{vendor.businessName}</div>
                    <div className="text-xs text-gray-400">{vendor.category}</div>
                  </td>
                  <td className="p-4 text-gray-600">{vendor.ownerName}</td>
                  <td className="p-4 text-gray-500">{vendor.contact}</td>
                  <td className="p-4 text-gray-500">{vendor.products}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      vendor.status === 'Active' ? 'bg-green-100 text-green-700' :
                      vendor.status === 'Pending Approval' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {vendor.status}
                    </span>
                  </td>
                  <td className="p-4 text-right flex items-center justify-end gap-2">
                    <button
                      onClick={() => setViewVendor(vendor)}
                      className="text-gray-500 hover:text-orange-600 p-1 rounded transition-colors"
                      title="View Details"
                    >
                      <Eye size={18} />
                    </button>
                    {vendor.status !== 'Active' ? (
                      <button
                        onClick={() => dispatch(updateVendorStatus({ id: vendor.id, status: 'Active' }))}
                        className="text-green-500 hover:text-green-700 p-1 rounded transition-colors"
                        title="Approve"
                      >
                        <UserCheck size={18} />
                      </button>
                    ) : (
                      <button
                        onClick={() => dispatch(updateVendorStatus({ id: vendor.id, status: 'Suspended' }))}
                        className="text-red-400 hover:text-red-600 p-1 rounded transition-colors"
                        title="Suspend"
                      >
                        <UserX size={18} />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(vendor.id)}
                      className="text-gray-300 hover:text-red-500 p-1 rounded transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── CREATE VENDOR MODAL ── */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">Create New Vendor</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600"><X size={22} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Business Name *</label>
                  <input
                    type="text" placeholder="e.g. Tech Solutions Nepal"
                    value={form.businessName} onChange={e => setForm({ ...form, businessName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Owner Name *</label>
                  <input
                    type="text" placeholder="Full name"
                    value={form.ownerName} onChange={e => setForm({ ...form, ownerName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact *</label>
                  <input
                    type="text" placeholder="Phone number"
                    value={form.contact} onChange={e => setForm({ ...form, contact: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none text-gray-900"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input
                    type="email" placeholder="vendor@email.com"
                    value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none text-gray-900 bg-white"
                  >
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Initial Status</label>
                  <select
                    value={form.status} onChange={e => setForm({ ...form, status: e.target.value as VendorStatus })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none text-gray-900 bg-white"
                  >
                    <option>Active</option>
                    <option>Pending Approval</option>
                    <option>Suspended</option>
                  </select>
                </div>
              </div>
              <p className="text-xs text-gray-400 bg-gray-50 rounded-lg p-3">
                <span className="font-semibold text-gray-600">Auto-generated:</span> A unique Vendor ID (e.g. V005) and a secret Access Key will be created automatically. Share the access key with the vendor so they can log into their dashboard.
              </p>
            </div>
            <div className="flex gap-3 p-6 border-t border-gray-100">
              <button onClick={() => setShowCreateModal(false)} className="flex-1 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={handleCreate} className="flex-1 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors">Create Vendor</button>
            </div>
          </div>
        </div>
      )}

      {/* ── VIEW VENDOR DETAIL MODAL ── */}
      {viewVendor && (() => {
        // Always get the latest data from store
        const latest = vendors.find(v => v.id === viewVendor.id) || viewVendor;
        return (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <Building2 size={20} className="text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{latest.businessName}</h3>
                    <span className="font-mono text-xs text-orange-600 bg-orange-50 px-2 py-0.5 rounded">{latest.id}</span>
                  </div>
                </div>
                <button onClick={() => setViewVendor(null)} className="text-gray-400 hover:text-gray-600"><X size={22} /></button>
              </div>

              <div className="p-6 space-y-5">
                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {[
                    { label: 'Owner', value: latest.ownerName },
                    { label: 'Contact', value: latest.contact },
                    { label: 'Email', value: latest.email },
                    { label: 'Category', value: latest.category },
                    { label: 'Products', value: latest.products },
                    { label: 'Joined', value: latest.joinedDate },
                  ].map(item => (
                    <div key={item.label}>
                      <div className="text-xs text-gray-400 mb-0.5">{item.label}</div>
                      <div className="font-medium text-gray-800">{item.value}</div>
                    </div>
                  ))}
                </div>

                {/* Status Control */}
                <div>
                  <div className="text-xs text-gray-400 mb-2">Status</div>
                  <div className="flex gap-2">
                    {(['Active', 'Pending Approval', 'Suspended'] as VendorStatus[]).map(s => (
                      <button
                        key={s}
                        onClick={() => dispatch(updateVendorStatus({ id: latest.id, status: s }))}
                        className={`flex-1 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                          latest.status === s
                            ? s === 'Active' ? 'bg-green-500 text-white border-green-500'
                              : s === 'Pending Approval' ? 'bg-yellow-400 text-white border-yellow-400'
                              : 'bg-red-500 text-white border-red-500'
                            : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* KYC Verification & Commission */}
                <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-4">
                  <div>
                    <div className="text-xs text-gray-400 mb-1.5 flex items-center gap-1">
                      <ShieldCheck size={12} className="text-orange-500" /> KYC Verification
                    </div>
                    <select
                      value={latest.kycStatus || 'Verified'}
                      onChange={(e) => dispatch(updateVendor({ id: latest.id, kycStatus: e.target.value }))}
                      className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs focus:ring-1 focus:ring-orange-500 bg-white text-gray-800"
                    >
                      <option value="Verified">Verified</option>
                      <option value="Pending">Pending Approval</option>
                      <option value="Not Submitted">Not Submitted</option>
                    </select>
                    <p className="text-[10px] text-gray-400 mt-1">Doc: {latest.kycDocument || 'citizenship_scan.jpg'}</p>
                  </div>

                  <div>
                    <div className="text-xs text-gray-400 mb-1.5 flex items-center gap-1">
                      <DollarSign size={12} className="text-orange-500" /> Platform Commission
                    </div>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        value={latest.commissionRate !== undefined ? latest.commissionRate : 10}
                        onChange={(e) => dispatch(updateVendor({ id: latest.id, commissionRate: parseInt(e.target.value) || 0 }))}
                        className="w-16 px-2 py-1 border border-gray-200 rounded-lg text-xs text-center font-bold text-gray-800"
                        min="0"
                        max="100"
                      />
                      <span className="text-xs font-bold text-gray-500">% fee</span>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1">Fee charged per order</p>
                  </div>
                </div>

                {/* Access Key */}
                <div className="border-t border-gray-100 pt-4">
                  <div className="text-xs text-gray-400 mb-2 flex items-center gap-1">
                    <KeyRound size={12} /> Vendor Access Key
                  </div>
                  <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                    <span className="font-mono text-sm text-gray-800 flex-1 tracking-widest">{latest.accessKey}</span>
                    <button
                      onClick={() => handleCopyKey(latest.accessKey)}
                      className="text-gray-400 hover:text-orange-500 transition-colors"
                      title="Copy Key"
                    >
                      {copiedKey === latest.accessKey ? <span className="text-xs text-green-500 font-medium">Copied!</span> : <Copy size={15} />}
                    </button>
                    <button
                      onClick={() => handleRegenerateKey(latest.id)}
                      className="text-gray-400 hover:text-orange-500 transition-colors"
                      title="Regenerate Key"
                    >
                      <RefreshCw size={15} />
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Share this key with the vendor for dashboard access. Click 🔁 to regenerate.</p>
                </div>
              </div>

              <div className="flex gap-3 p-6 border-t border-gray-100">
                <button
                  onClick={() => handleDelete(latest.id)}
                  className="flex items-center gap-2 px-4 py-2 border border-red-200 text-red-500 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium"
                >
                  <Trash2 size={15} /> Delete Vendor
                </button>
                <button
                  onClick={() => setViewVendor(null)}
                  className="flex-1 py-2 bg-gray-900 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

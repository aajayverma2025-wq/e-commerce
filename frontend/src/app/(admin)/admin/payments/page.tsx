"use client";

import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { updateTransactionStatus, updatePayoutStatus, PaymentStatus } from '@/store/paymentSlice';
import { DollarSign, TrendingUp, CreditCard, Clock, Search, Eye, XCircle, Check, X, ShieldAlert } from 'lucide-react';
import Link from 'next/link';

const statusStyles: Record<PaymentStatus, string> = {
  Paid:     'bg-green-100 text-green-700',
  Pending:  'bg-yellow-100 text-yellow-700',
  Refunded: 'bg-purple-100 text-purple-700',
  Failed:   'bg-red-100 text-red-700',
};

const methodIcons: Record<string, string> = {
  'Credit Card': '💳',
  'PayPal': '🅿️',
  'Cash on Delivery': '💵',
};

export default function AdminPaymentsPage() {
  const { transactions, payoutRequests } = useAppSelector(state => state.payments);
  const safePayoutRequests = payoutRequests || [];
  const dispatch = useAppDispatch();
  const [subTab, setSubTab] = useState<'transactions' | 'payouts'>('transactions');
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [filterMethod, setFilterMethod] = useState('All');

  // Transaction filtering
  const filteredTxns = transactions.filter(t => {
    const matchSearch =
      t.id.toLowerCase().includes(search.toLowerCase()) ||
      t.orderId.toLowerCase().includes(search.toLowerCase()) ||
      t.customer.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'All' || t.status === filterStatus;
    const matchMethod = filterMethod === 'All' || t.method === filterMethod;
    return matchSearch && matchStatus && matchMethod;
  });

  // Payout filtering
  const filteredPayouts = safePayoutRequests.filter(p => {
    const matchSearch =
      p.id.toLowerCase().includes(search.toLowerCase()) ||
      p.businessName.toLowerCase().includes(search.toLowerCase()) ||
      p.bankName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'All' || p.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const totalRevenue = transactions.filter(t => t.status === 'Paid').reduce((s, t) => s + t.amount, 0);
  const totalPendingPayouts = safePayoutRequests.filter(p => p.status === 'Pending').reduce((s, p) => s + p.amount, 0);
  const totalRefunded = transactions.filter(t => t.status === 'Refunded').reduce((s, t) => s + t.amount, 0);
  const successRate = transactions.length ? Math.round((transactions.filter(t => t.status === 'Paid').length / transactions.length) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Payment & Payout Management</h2>
        <div className="flex gap-2">
          <Link href="/admin/payments/refunds" className="text-sm border border-gray-200 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg transition-colors font-medium">
            Refund Requests
          </Link>
          <Link href="/admin/payments/settings" className="text-sm bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors font-medium">
            Gateway Settings
          </Link>
        </div>
      </div>

      {/* Revenue Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-5 text-white shadow-lg shadow-green-100">
          <div className="flex items-center gap-2 mb-2 opacity-80"><DollarSign size={18} /> <span className="text-sm font-medium">Total Revenue</span></div>
          <p className="text-2xl font-black">${totalRevenue.toLocaleString()}</p>
          <p className="text-xs mt-1 opacity-70">{transactions.filter(t => t.status === 'Paid').length} paid transactions</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-2xl p-5 text-white shadow-lg shadow-yellow-100">
          <div className="flex items-center gap-2 mb-2 opacity-80"><Clock size={18} /> <span className="text-sm font-medium">Pending Payouts</span></div>
          <p className="text-2xl font-black">${totalPendingPayouts.toLocaleString()}</p>
          <p className="text-xs mt-1 opacity-70">{safePayoutRequests.filter(p => p.status === 'Pending').length} requests pending</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-5 text-white shadow-lg shadow-purple-100">
          <div className="flex items-center gap-2 mb-2 opacity-80"><TrendingUp size={18} /> <span className="text-sm font-medium">Refunded</span></div>
          <p className="text-2xl font-black">${totalRefunded.toLocaleString()}</p>
          <p className="text-xs mt-1 opacity-70">{transactions.filter(t => t.status === 'Refunded').length} refunds</p>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-5 text-white shadow-lg shadow-blue-100">
          <div className="flex items-center gap-2 mb-2 opacity-80"><CreditCard size={18} /> <span className="text-sm font-medium">Success Rate</span></div>
          <p className="text-2xl font-black">{successRate}%</p>
          <p className="text-xs mt-1 opacity-70">{transactions.length} total transactions</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => { setSubTab('transactions'); setFilterStatus('All'); setSearch(''); }}
          className={`px-6 py-3 text-sm font-bold border-b-2 transition-all ${
            subTab === 'transactions' ? 'border-orange-500 text-orange-500' : 'border-transparent text-gray-500 hover:text-orange-500'
          }`}
        >
          Transactions Log
        </button>
        <button
          onClick={() => { setSubTab('payouts'); setFilterStatus('All'); setSearch(''); }}
          className={`px-6 py-3 text-sm font-bold border-b-2 transition-all ${
            subTab === 'payouts' ? 'border-orange-500 text-orange-500' : 'border-transparent text-gray-500 hover:text-orange-500'
          }`}
        >
          Vendor Payout Requests
        </button>
      </div>

      {/* Table & Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50 flex flex-wrap gap-3 items-center justify-between">
          <div className="relative">
            <input
              type="text"
              placeholder={subTab === 'transactions' ? "Search by ID, order, customer..." : "Search by ID, business, bank..."}
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 w-72 text-sm"
            />
            <Search size={16} className="text-gray-400 absolute left-3 top-2.5" />
          </div>
          <div className="flex flex-wrap gap-2">
            {subTab === 'transactions' ? (
              <>
                {(['All', 'Paid', 'Pending', 'Refunded', 'Failed'] as const).map(s => (
                  <button key={s} onClick={() => setFilterStatus(s)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      filterStatus === s ? 'bg-orange-500 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-orange-300'
                    }`}>{s}</button>
                ))}
                <select value={filterMethod} onChange={e => setFilterMethod(e.target.value)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-gray-200 bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-400">
                  <option value="All">All Methods</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="PayPal">PayPal</option>
                  <option value="Cash on Delivery">Cash on Delivery</option>
                </select>
              </>
            ) : (
              <>
                {(['All', 'Pending', 'Approved', 'Rejected'] as const).map(s => (
                  <button key={s} onClick={() => setFilterStatus(s)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      filterStatus === s ? 'bg-orange-500 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-orange-300'
                    }`}>{s}</button>
                ))}
              </>
            )}
          </div>
        </div>

        {subTab === 'transactions' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-500 border-b border-gray-100">
                  <th className="p-4 font-medium">Transaction ID</th>
                  <th className="p-4 font-medium">Order</th>
                  <th className="p-4 font-medium">Customer</th>
                  <th className="p-4 font-medium">Amount</th>
                  <th className="p-4 font-medium">Method</th>
                  <th className="p-4 font-medium">Date</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Gateway Ref</th>
                  <th className="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTxns.map(txn => (
                  <tr key={txn.id} className="border-b border-gray-50 hover:bg-orange-50/30 transition-colors">
                    <td className="p-4 font-mono text-xs text-gray-600">{txn.id}</td>
                    <td className="p-4">
                      <Link href={`/admin/orders/${txn.orderId}`} className="font-semibold text-orange-500 hover:underline text-xs">
                        {txn.orderId}
                      </Link>
                    </td>
                    <td className="p-4">
                      <p className="font-medium text-gray-800">{txn.customer}</p>
                      <p className="text-xs text-gray-400">{txn.email}</p>
                    </td>
                    <td className="p-4 font-bold text-gray-900">${txn.amount.toLocaleString()}</td>
                    <td className="p-4 text-gray-600">{methodIcons[txn.method]} {txn.method}</td>
                    <td className="p-4 text-gray-500 text-xs">{txn.date}</td>
                    <td className="p-4">
                      <select
                        value={txn.status}
                        onChange={e => dispatch(updateTransactionStatus({ id: txn.id, status: e.target.value as PaymentStatus }))}
                        className={`px-2 py-1 rounded-lg text-xs font-semibold border cursor-pointer focus:outline-none ${statusStyles[txn.status]}`}
                      >
                        {(['Paid', 'Pending', 'Refunded', 'Failed'] as PaymentStatus[]).map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                    <td className="p-4 font-mono text-xs text-gray-400">{txn.gatewayRef}</td>
                    <td className="p-4 text-right">
                      <Link href={`/admin/orders/${txn.orderId}`}
                        className="text-orange-500 hover:text-orange-700 p-1.5 rounded-lg hover:bg-orange-50 transition-colors inline-flex" title="View Order">
                        <Eye size={16} />
                      </Link>
                    </td>
                  </tr>
                ))}
                {filteredTxns.length === 0 && (
                  <tr><td colSpan={9} className="p-12 text-center text-gray-400">
                    <XCircle size={40} className="mx-auto mb-2 text-gray-200" /> No transactions found.
                  </td></tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-500 border-b border-gray-100">
                  <th className="p-4 font-medium">Payout ID</th>
                  <th className="p-4 font-medium">Vendor</th>
                  <th className="p-4 font-medium">Bank Name</th>
                  <th className="p-4 font-medium">Account Number</th>
                  <th className="p-4 font-medium">Amount</th>
                  <th className="p-4 font-medium">Date</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayouts.map(payout => (
                  <tr key={payout.id} className="border-b border-gray-50 hover:bg-orange-50/30 transition-colors">
                    <td className="p-4 font-mono text-xs font-bold text-gray-600">{payout.id}</td>
                    <td className="p-4">
                      <p className="font-semibold text-gray-800">{payout.businessName}</p>
                      <span className="text-[10px] text-gray-400">ID: {payout.vendorId}</span>
                    </td>
                    <td className="p-4 text-gray-600">{payout.bankName}</td>
                    <td className="p-4 font-mono text-xs text-gray-500">{payout.accountNumber}</td>
                    <td className="p-4 font-bold text-gray-900">${payout.amount.toLocaleString()}</td>
                    <td className="p-4 text-gray-500 text-xs">{payout.date}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                        payout.status === 'Approved' ? 'bg-green-100 text-green-700' :
                        payout.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>{payout.status}</span>
                    </td>
                    <td className="p-4 text-right">
                      {payout.status === 'Pending' ? (
                        <div className="flex justify-end gap-1.5">
                          <button
                            onClick={() => dispatch(updatePayoutStatus({ id: payout.id, status: 'Approved' }))}
                            className="bg-green-500 hover:bg-green-600 text-white p-1 rounded-lg transition-colors flex items-center justify-center w-7 h-7"
                            title="Approve Payout"
                          >
                            <Check size={14} />
                          </button>
                          <button
                            onClick={() => dispatch(updatePayoutStatus({ id: payout.id, status: 'Rejected' }))}
                            className="bg-red-500 hover:bg-red-600 text-white p-1 rounded-lg transition-colors flex items-center justify-center w-7 h-7"
                            title="Reject Payout"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">{payout.status}</span>
                      )}
                    </td>
                  </tr>
                ))}
                {filteredPayouts.length === 0 && (
                  <tr><td colSpan={8} className="p-12 text-center text-gray-400">
                    <ShieldAlert size={40} className="mx-auto mb-2 text-gray-200" /> No payout requests found.
                  </td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

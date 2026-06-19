"use client";

import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { updateRefundStatus } from '@/store/paymentSlice';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, XCircle, Clock } from 'lucide-react';

const statusStyles = {
  Pending:  'bg-yellow-100 text-yellow-700 border-yellow-200',
  Approved: 'bg-green-100 text-green-700 border-green-200',
  Rejected: 'bg-red-100 text-red-700 border-red-200',
};

export default function RefundRequestsPage() {
  const { refundRequests } = useAppSelector(state => state.payments);
  const dispatch = useAppDispatch();

  const pending = refundRequests.filter(r => r.status === 'Pending').length;
  const totalRefundAmount = refundRequests
    .filter(r => r.status === 'Approved')
    .reduce((s, r) => s + r.amount, 0);

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/payments" className="text-gray-400 hover:text-gray-600 transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <h2 className="text-2xl font-bold text-gray-800">Refund Requests</h2>
        </div>
        {pending > 0 && (
          <span className="bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full animate-pulse">
            {pending} Pending
          </span>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <p className="text-xs text-gray-500 mb-1">Total Requests</p>
          <p className="text-2xl font-black text-gray-900">{refundRequests.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <p className="text-xs text-gray-500 mb-1">Pending Review</p>
          <p className="text-2xl font-black text-yellow-600">{pending}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <p className="text-xs text-gray-500 mb-1">Total Refunded</p>
          <p className="text-2xl font-black text-purple-600">${totalRefundAmount.toLocaleString()}</p>
        </div>
      </div>

      {/* Refund Cards */}
      <div className="space-y-4">
        {refundRequests.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-400">
            <CheckCircle size={48} className="mx-auto mb-3 text-gray-200" />
            <p>No refund requests at this time.</p>
          </div>
        )}
        {refundRequests.map(req => (
          <div key={req.id} className={`bg-white rounded-2xl border shadow-sm overflow-hidden ${
            req.status === 'Pending' ? 'border-yellow-200' : 'border-gray-100'
          }`}>
            <div className="px-6 py-4 border-b border-gray-50 bg-gray-50 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-xs text-gray-400">Request ID</p>
                  <p className="font-bold text-gray-800">{req.id}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Order</p>
                  <Link href={`/admin/orders/${req.orderId}`} className="font-semibold text-orange-500 hover:underline text-sm">
                    {req.orderId}
                  </Link>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Refund Amount</p>
                  <p className="font-black text-gray-900">${req.amount}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Date</p>
                  <p className="text-sm text-gray-600">{req.date}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1 ${statusStyles[req.status]}`}>
                {req.status === 'Pending' && <Clock size={12} />}
                {req.status === 'Approved' && <CheckCircle size={12} />}
                {req.status === 'Rejected' && <XCircle size={12} />}
                {req.status}
              </span>
            </div>

            <div className="px-6 py-4 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-gray-800">{req.customer}</p>
                <p className="text-sm text-gray-500 mt-1">Reason: <span className="italic">"{req.reason}"</span></p>
                <p className="text-xs text-gray-400 mt-1">Transaction: {req.transactionId}</p>
              </div>
              {req.status === 'Pending' && (
                <div className="flex gap-3">
                  <button
                    onClick={() => dispatch(updateRefundStatus({ id: req.id, status: 'Rejected' }))}
                    className="flex items-center gap-2 border border-red-200 text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                  >
                    <XCircle size={16} /> Reject
                  </button>
                  <button
                    onClick={() => dispatch(updateRefundStatus({ id: req.id, status: 'Approved' }))}
                    className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm"
                  >
                    <CheckCircle size={16} /> Approve Refund
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

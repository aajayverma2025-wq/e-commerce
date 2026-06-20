"use client";

import { useAppSelector } from '@/store/hooks';
import { 
  ShoppingBag, Users, DollarSign, Activity, TrendingUp, AlertTriangle, 
  RefreshCw, Store, Package, Clock, ArrowUpRight, CheckCircle2 
} from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const { items: orders } = useAppSelector(state => state.orders);
  const { vendors } = useAppSelector(state => state.vendors);
  const { items: products } = useAppSelector(state => state.products);
  const { transactions, refundRequests } = useAppSelector(state => state.payments);

  // Calculations
  const totalOrders = orders.length;
  const totalSales = orders.reduce((sum, order) => {
    const amount = parseFloat(order.total.replace(/[^0-9.-]+/g, ""));
    return sum + (isNaN(amount) ? 0 : amount);
  }, 0);
  
  const activeVendors = vendors.filter(v => v.status === 'Active').length;
  const activeCustomersCount = new Set(orders.map(o => o.email)).size + 42; // Dynamic + base mock
  const pendingOrdersCount = orders.filter(o => o.status === 'Pending').length;
  const lowStockProductsCount = products.filter(p => p.stock <= 10).length;
  const pendingRefundsCount = refundRequests.filter(r => r.status === 'Pending').length;

  // Orders by Status
  const orderStatusCounts = {
    Pending: orders.filter(o => o.status === 'Pending').length,
    Processing: orders.filter(o => o.status === 'Processing').length,
    Shipped: orders.filter(o => o.status === 'Shipped').length,
    Delivered: orders.filter(o => o.status === 'Delivered').length,
    Cancelled: orders.filter(o => o.status === 'Cancelled').length,
  };

  // Monthly Growth / Sales Chart Data
  const monthlySalesData = [
    { month: 'Jan', sales: 42000, value: 30 },
    { month: 'Feb', sales: 58000, value: 45 },
    { month: 'Mar', sales: 49000, value: 38 },
    { month: 'Apr', sales: 72000, value: 60 },
    { month: 'May', sales: 95000, value: 85 },
    { month: 'Jun', sales: totalSales || 112000, value: 95 },
  ];

  return (
    <div className="space-y-8">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Total Sales</span>
            <p className="text-2xl font-black text-gray-900">${totalSales.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>
          <div className="bg-orange-100 p-3.5 rounded-2xl text-orange-600">
            <DollarSign size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Total Orders</span>
            <p className="text-2xl font-black text-gray-900">{totalOrders}</p>
          </div>
          <div className="bg-blue-100 p-3.5 rounded-2xl text-blue-600">
            <ShoppingBag size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Active Customers</span>
            <p className="text-2xl font-black text-gray-900">{activeCustomersCount}</p>
          </div>
          <div className="bg-green-100 p-3.5 rounded-2xl text-green-600">
            <Users size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Active Vendors</span>
            <p className="text-2xl font-black text-gray-900">{activeVendors}</p>
          </div>
          <div className="bg-purple-100 p-3.5 rounded-2xl text-purple-600">
            <Store size={24} />
          </div>
        </div>
      </div>

      {/* Analytics & Alerts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Sales Chart */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 lg:col-span-2 p-6 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-extrabold text-gray-800 flex items-center gap-2">
              <TrendingUp className="text-orange-500" size={16} /> Monthly Revenue Growth
            </h3>
            <span className="text-[10px] font-bold bg-green-50 border border-green-200 text-green-700 px-2.5 py-1 rounded-full uppercase">
              +28.4% growth
            </span>
          </div>

          <div className="flex items-end gap-3 h-52 relative mt-4">
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none z-0">
              {[0, 1, 2, 3].map(i => (
                <div key={i} className="w-full border-t border-dashed border-gray-100 h-0"></div>
              ))}
            </div>
            <div className="w-full h-full flex items-end justify-between z-10 px-4">
              {monthlySalesData.map((data, idx) => (
                <div key={idx} className="flex flex-col items-center gap-1.5 w-full group">
                  <div className="relative w-full flex justify-center h-36 items-end">
                    <div className="opacity-0 group-hover:opacity-100 absolute -top-8 bg-gray-900 text-white text-[10px] py-1 px-1.5 rounded pointer-events-none transition-opacity whitespace-nowrap z-20">
                      ${data.sales.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </div>
                    <div 
                      className="w-8 sm:w-12 bg-gradient-to-t from-orange-400 to-orange-500 rounded-t-md hover:opacity-85 cursor-pointer transition-all duration-300 shadow-sm"
                      style={{ height: `${data.value}%` }}
                    ></div>
                  </div>
                  <span className="text-[10px] font-bold text-gray-500">{data.month}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Widgets / Action Items Column */}
        <div className="space-y-4">
          {/* Orders by Status Widget */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-3.5">
            <h4 className="text-xs font-bold text-gray-800 border-b pb-2 flex items-center gap-1.5">
              <ShoppingBag size={14} className="text-blue-500" /> Orders by Status
            </h4>
            <div className="space-y-2 text-xs">
              {Object.entries(orderStatusCounts).map(([status, count]) => {
                const total = orders.length || 1;
                const percentage = Math.round((count / total) * 100);
                return (
                  <div key={status} className="space-y-1">
                    <div className="flex justify-between font-semibold text-gray-700">
                      <span>{status}</span>
                      <span>{count} ({percentage}%)</span>
                    </div>
                    <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          status === 'Delivered' ? 'bg-green-500' :
                          status === 'Pending' ? 'bg-yellow-400' :
                          status === 'Cancelled' ? 'bg-red-500' :
                          'bg-blue-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Critical Alerts */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-2.5">
            <h4 className="text-xs font-bold text-gray-800 border-b pb-2 flex items-center gap-1.5">
              <AlertTriangle className="text-red-500" size={14} /> Attention Required
            </h4>
            <div className="space-y-2 text-xs font-medium">
              <div className="flex justify-between items-center text-yellow-700 bg-yellow-50 px-2.5 py-1.5 rounded-lg border border-yellow-100">
                <span className="flex items-center gap-1"><Clock size={12} /> Pending Orders</span>
                <span className="font-bold">{pendingOrdersCount} orders</span>
              </div>
              <div className="flex justify-between items-center text-red-700 bg-red-50 px-2.5 py-1.5 rounded-lg border border-red-100">
                <span className="flex items-center gap-1"><Package size={12} /> Low Stock Products</span>
                <span className="font-bold">{lowStockProductsCount} items</span>
              </div>
              <div className="flex justify-between items-center text-purple-700 bg-purple-50 px-2.5 py-1.5 rounded-lg border border-purple-100">
                <span className="flex items-center gap-1"><RefreshCw size={12} /> Refund Requests</span>
                <span className="font-bold">{pendingRefundsCount} pending</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lists Section: Top Selling & Top Vendors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Selling Products */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <h3 className="text-sm font-extrabold text-gray-800 mb-4">Top Selling Products</h3>
          <div className="space-y-3">
            {products.slice().sort((a, b) => (b.soldCount || 0) - (a.soldCount || 0)).slice(0, 5).map(p => (
              <div key={p.id} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0 text-xs">
                <div className="flex items-center gap-3">
                  <img src={p.image} className="w-9 h-9 object-contain rounded border bg-white p-0.5" />
                  <div className="min-w-0">
                    <p className="font-bold text-gray-800 truncate max-w-[180px]">{p.name}</p>
                    <span className="text-[10px] text-gray-400 font-bold">{p.category}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-black text-gray-700 block">${p.price.toFixed(2)}</span>
                  <span className="text-[9px] text-orange-500 font-black uppercase tracking-wider">{p.soldCount || 0} sold</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Performing Vendors */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <h3 className="text-sm font-extrabold text-gray-800 mb-4">Top Performing Vendors</h3>
          <div className="space-y-3">
            {vendors.slice().sort((a, b) => b.revenue - a.revenue).slice(0, 5).map(v => (
              <div key={v.id} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-gray-50 border rounded-lg flex items-center justify-center text-gray-500 font-bold">
                    {v.businessName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">{v.businessName}</p>
                    <span className="text-[10px] text-gray-400 font-bold">ID: {v.id}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-black text-green-600 block">${v.revenue.toLocaleString()}</span>
                  <span className="text-[9px] text-gray-400 font-bold uppercase">Revenue</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Transactions List */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-extrabold text-gray-800">Recent Transactions</h3>
          <Link href="/admin/payments" className="text-xs font-bold text-orange-500 hover:underline flex items-center gap-0.5">
            Manage Payments <ArrowUpRight size={14} />
          </Link>
        </div>
        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase">
                <th className="pb-2">Transaction ID</th>
                <th className="pb-2">Customer</th>
                <th className="pb-2">Method</th>
                <th className="pb-2">Amount</th>
                <th className="pb-2 text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.slice(0, 5).map(t => (
                <tr key={t.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                  <td className="py-2.5 font-mono text-[10px] text-gray-500">{t.id}</td>
                  <td className="py-2.5 font-bold text-gray-700">{t.customer}</td>
                  <td className="py-2.5 text-gray-600 font-medium">{t.method}</td>
                  <td className="py-2.5 font-bold font-mono text-gray-800">${t.amount.toLocaleString()}</td>
                  <td className="py-2.5 text-right">
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                      t.status === 'Paid' ? 'bg-green-50 text-green-700' :
                      t.status === 'Pending' ? 'bg-yellow-50 text-yellow-700' :
                      'bg-red-50 text-red-700'
                    }`}>{t.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

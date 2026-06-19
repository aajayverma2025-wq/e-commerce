"use client";

import { ShoppingBag, Users, DollarSign, Activity, TrendingUp } from 'lucide-react';
import { useAppSelector } from '@/store/hooks';

export default function AdminDashboard() {
  const { items: orders } = useAppSelector(state => state.orders);

  // Calculations
  const totalOrders = orders.length;
  
  const totalRevenue = orders.reduce((sum, order) => {
    const amount = parseFloat(order.total.replace(/[^0-9.-]+/g, ""));
    return sum + (isNaN(amount) ? 0 : amount);
  }, 0);

  // Mock chart data
  const chartData = [
    { day: 'Mon', value: 30, amount: '$450' },
    { day: 'Tue', value: 45, amount: '$620' },
    { day: 'Wed', value: 25, amount: '$310' },
    { day: 'Thu', value: 60, amount: '$850' },
    { day: 'Fri', value: 80, amount: '$1,200' },
    { day: 'Sat', value: 95, amount: '$1,500' },
    { day: 'Sun', value: 50, amount: '$700' },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Dashboard Overview</h2>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="bg-blue-100 p-3 rounded-lg text-blue-600">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Revenue</p>
            <p className="text-2xl font-bold text-gray-900">${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="bg-green-100 p-3 rounded-lg text-green-600">
            <ShoppingBag size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Orders</p>
            <p className="text-2xl font-bold text-gray-900">{totalOrders}</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="bg-orange-100 p-3 rounded-lg text-orange-600">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Customers</p>
            <p className="text-2xl font-bold text-gray-900">8,421</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="bg-purple-100 p-3 rounded-lg text-purple-600">
            <Activity size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Active Vendors</p>
            <p className="text-2xl font-bold text-gray-900">124</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 lg:col-span-2 p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <TrendingUp className="text-orange-500" size={20} /> Weekly Sales Performance
            </h3>
            <select className="bg-gray-50 border border-gray-200 text-sm rounded-lg px-3 py-1.5 focus:outline-none">
              <option>This Week</option>
              <option>Last Week</option>
            </select>
          </div>
          
          {/* CSS Bar Chart */}
          <div className="flex-1 flex items-end gap-2 sm:gap-4 h-64 mt-4 relative">
            {/* Y-axis lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none z-0">
              {[0, 1, 2, 3, 4].map(i => (
                <div key={i} className="w-full border-t border-dashed border-gray-200 flex-1 relative">
                </div>
              ))}
            </div>
            
            {/* Bars */}
            <div className="w-full h-full flex items-end justify-between z-10 px-2 sm:px-6">
              {chartData.map((data, i) => (
                <div key={i} className="flex flex-col items-center gap-2 w-full group">
                  <div className="relative w-full flex justify-center h-48 items-end">
                    {/* Tooltip */}
                    <div className="opacity-0 group-hover:opacity-100 absolute -top-10 bg-gray-900 text-white text-xs py-1 px-2 rounded pointer-events-none transition-opacity whitespace-nowrap z-20">
                      {data.amount}
                    </div>
                    {/* Bar Fill */}
                    <div 
                      className="w-8 sm:w-12 bg-gradient-to-t from-orange-400 to-orange-500 rounded-t-md shadow-sm transition-all duration-500 hover:opacity-80 cursor-pointer"
                      style={{ height: `${data.value}%` }}
                    ></div>
                  </div>
                  <span className="text-xs font-medium text-gray-500">{data.day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Orders List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-bold text-gray-800">Recent Orders</h3>
          </div>
          <div className="flex-1 overflow-y-auto max-h-96">
            {orders.length === 0 ? (
              <div className="p-6 text-center text-gray-500 h-full flex items-center justify-center">
                No recent orders to display.
              </div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {orders.slice(0, 6).map(order => (
                  <li key={order.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start mb-1">
                      <p className="font-medium text-gray-900">{order.customer}</p>
                      <p className="font-bold text-gray-800">{order.total}</p>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <p className="text-gray-500">{order.id}</p>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                        order.status === 'Processing' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

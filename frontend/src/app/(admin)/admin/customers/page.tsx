import { Search, Eye, Ban } from 'lucide-react';

export default function AdminCustomersPage() {
  const dummyCustomers = [
    { id: 'C001', name: 'John Doe', email: 'john@example.com', orders: 12, spent: '$1,245.00', status: 'Active' },
    { id: 'C002', name: 'Jane Smith', email: 'jane@example.com', orders: 5, spent: '$340.00', status: 'Active' },
    { id: 'C003', name: 'Mike Johnson', email: 'mike@example.com', orders: 0, spent: '$0.00', status: 'Inactive' },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Customer Management</h2>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search customers..." 
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 w-64 md:w-96"
            />
            <Search size={18} className="text-gray-400 absolute left-3 top-2.5" />
          </div>
        </div>
        
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white text-gray-500 text-sm border-b border-gray-100">
              <th className="p-4 font-medium">Customer</th>
              <th className="p-4 font-medium">Email</th>
              <th className="p-4 font-medium">Total Orders</th>
              <th className="p-4 font-medium">Total Spent</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {dummyCustomers.map((customer) => (
              <tr key={customer.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="p-4 font-medium text-gray-900">{customer.name}</td>
                <td className="p-4 text-gray-500">{customer.email}</td>
                <td className="p-4 text-gray-500">{customer.orders}</td>
                <td className="p-4 text-gray-500">{customer.spent}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    customer.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {customer.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button className="text-blue-500 hover:text-blue-700 mr-3" title="View Profile">
                    <Eye size={18} />
                  </button>
                  <button className="text-red-500 hover:text-red-700" title="Suspend User">
                    <Ban size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

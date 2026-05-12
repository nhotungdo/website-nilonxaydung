const CustomersPage = () => {
  const customers = [
    { id: '1', name: 'Nguyễn Văn A', email: 'vana@gmail.com', phone: '0901234567', totalOrders: 5 },
    { id: '2', name: 'Công ty TNHH B', email: 'contact@companyb.com', phone: '02811223344', totalOrders: 12 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">Customers</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Add Customer
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-sm font-semibold text-slate-700">Name</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-700">Contact</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-700">Phone</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-700">Total Orders</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {customers.map((customer) => (
              <tr key={customer.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-slate-900">{customer.name}</td>
                <td className="px-6 py-4 text-sm text-slate-500">{customer.email}</td>
                <td className="px-6 py-4 text-sm text-slate-700">{customer.phone}</td>
                <td className="px-6 py-4 text-sm font-semibold text-slate-900">{customer.totalOrders}</td>
                <td className="px-6 py-4 text-sm">
                  <button className="text-slate-600 hover:text-blue-600 font-medium">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomersPage;

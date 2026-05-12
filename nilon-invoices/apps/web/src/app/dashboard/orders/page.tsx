const OrdersPage = () => {
  const orders = [
    { id: 'ORD-001', customer: 'Nguyễn Văn A', total: '$1,200', status: 'Completed', date: '2024-05-12' },
    { id: 'ORD-002', customer: 'Công ty TNHH B', total: '$3,500', status: 'Pending', date: '2024-05-11' },
    { id: 'ORD-003', customer: 'Trần Thị C', total: '$450', status: 'Shipping', date: '2024-05-10' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">Orders Management</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Create New Order
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-sm font-semibold text-slate-700">Order ID</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-700">Customer</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-700">Date</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-700">Total</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-700">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-blue-600">{order.id}</td>
                <td className="px-6 py-4 text-sm text-slate-700">{order.customer}</td>
                <td className="px-6 py-4 text-sm text-slate-500">{order.date}</td>
                <td className="px-6 py-4 text-sm font-semibold text-slate-900">{order.total}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    order.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' :
                    order.status === 'Pending' ? 'bg-amber-50 text-amber-600' :
                    'bg-blue-50 text-blue-600'
                  }`}>
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersPage;

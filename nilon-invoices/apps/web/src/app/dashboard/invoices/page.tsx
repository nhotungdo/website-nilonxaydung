const InvoicesPage = () => {
  const invoices = [
    { id: 'INV-2024-001', order: 'ORD-001', customer: 'Nguyễn Văn A', amount: '$1,200', status: 'Paid', date: '2024-05-12' },
    { id: 'INV-2024-002', order: 'ORD-002', customer: 'Công ty TNHH B', amount: '$3,500', status: 'Draft', date: '2024-05-11' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">Invoices</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Generate New Invoice
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-sm font-semibold text-slate-700">Invoice No</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-700">Order</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-700">Customer</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-700">Amount</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-700">Status</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {invoices.map((inv) => (
              <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-slate-900">{inv.id}</td>
                <td className="px-6 py-4 text-sm text-blue-600">{inv.order}</td>
                <td className="px-6 py-4 text-sm text-slate-700">{inv.customer}</td>
                <td className="px-6 py-4 text-sm font-semibold text-slate-900">{inv.amount}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    inv.status === 'Paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {inv.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button className="text-blue-600 hover:underline text-sm font-medium">Download PDF</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InvoicesPage;

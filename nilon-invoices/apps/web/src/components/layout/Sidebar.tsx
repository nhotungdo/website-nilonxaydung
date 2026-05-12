import Link from 'next/link';
import { Home, ShoppingCart, FileText, Users, Settings, Package } from 'lucide-react';

const Sidebar = () => {
  const menuItems = [
    { icon: <Home size={20} />, label: 'Dashboard', href: '/dashboard' },
    { icon: <ShoppingCart size={20} />, label: 'Orders', href: '/dashboard/orders' },
    { icon: <FileText size={20} />, label: 'Invoices', href: '/dashboard/invoices' },
    { icon: <Package size={20} />, label: 'Products', href: '/dashboard/products' },
    { icon: <Users size={20} />, label: 'Customers', href: '/dashboard/customers' },
    { icon: <Settings size={20} />, label: 'Settings', href: '/dashboard/settings' },
  ];

  return (
    <div className="w-64 h-screen bg-slate-900 text-white flex flex-col">
      <div className="p-6 text-2xl font-bold border-b border-slate-800">
        Nilon Invoices
      </div>
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 transition-colors"
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 p-2">
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
            A
          </div>
          <div>
            <div className="text-sm font-medium">Admin User</div>
            <div className="text-xs text-slate-400">admin@nilon.com</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

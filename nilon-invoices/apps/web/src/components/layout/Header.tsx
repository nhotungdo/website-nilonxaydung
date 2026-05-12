import { Bell, Search, User } from 'lucide-react';

const Header = () => {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8">
      <div className="flex items-center gap-4 bg-slate-100 px-4 py-2 rounded-lg w-96">
        <Search size={18} className="text-slate-500" />
        <input
          type="text"
          placeholder="Search for orders, invoices..."
          className="bg-transparent border-none outline-none text-sm w-full"
        />
      </div>
      <div className="flex items-center gap-6">
        <button className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
          <div className="text-right">
            <div className="text-sm font-semibold">Admin</div>
            <div className="text-xs text-slate-500">Super Admin</div>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600">
            <User size={24} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

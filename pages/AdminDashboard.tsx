
import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { getStoreDataSync, updateAdminStatus, getProducts, getOrders } from '../storage';

// Removed React.FC to prevent potential issues with children requirement
const DashboardOverview = () => {
  const [productsCount, setProductsCount] = useState(0);
  const [orders, setOrders] = useState<any[]>([]);
  const [lowStockCount, setLowStockCount] = useState(0);
  const [watching, setWatching] = useState(Math.floor(Math.random() * 50) + 20);

  useEffect(() => {
    // Fetch dashboard stats from Firestore
    const fetchStats = async () => {
      const p = await getProducts();
      const o = await getOrders();
      setProductsCount(p.length);
      setOrders(o);
      setLowStockCount(p.filter(prod => prod.stock > 0 && prod.stock < 5).length);
    };
    fetchStats();

    const interval = setInterval(() => {
      setWatching(prev => Math.max(10, prev + (Math.random() > 0.5 ? 2 : -2)));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const revenue = orders.reduce((acc, o) => acc + (o.total || 0), 0);

  const stats = [
    { label: 'Inventory', value: productsCount, icon: '🛍️', color: 'bg-blue-50 text-blue-600 border-blue-100' },
    { label: 'Total Orders', value: orders.length, icon: '📦', color: 'bg-green-50 text-green-600 border-green-100' },
    { label: 'Low Stock', value: lowStockCount, icon: '⚠️', color: 'bg-orange-50 text-orange-600 border-orange-100' },
    { label: 'Revenue (PKR)', value: revenue.toLocaleString(), icon: '💰', color: 'bg-indigo-50 text-indigo-600 border-indigo-100' },
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <span className="text-blue-600 font-black text-[10px] uppercase tracking-[0.3em] bg-blue-50 px-4 py-2 rounded-full border border-blue-100 mb-4 inline-block">Real-time Metrics</span>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter">Command <span className="text-blue-600">Center</span> 🚀</h1>
          <p className="text-slate-500 mt-2 font-bold text-lg">Your store performance summary at a glance.</p>
        </div>
        <div className="bg-white px-8 py-5 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-6">
           <div className="flex items-center gap-3">
             <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
             <p className="text-sm font-black text-slate-800 uppercase tracking-widest">{watching} Online</p>
           </div>
           <div className="w-px h-8 bg-slate-100"></div>
           <Link to="/shop" className="text-blue-600 font-black text-sm uppercase tracking-widest hover:underline">View Store</Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat) => (
          <div key={stat.label} className={`bg-white p-10 rounded-[3rem] border ${stat.color} shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group`}>
            <div className="text-5xl mb-8 group-hover:scale-110 group-hover:rotate-6 transition-transform inline-block">
              {stat.icon}
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{stat.label}</p>
            <p className="text-4xl font-black text-slate-900 mt-2 tracking-tighter">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-blue-600 rounded-[4rem] p-16 text-white relative overflow-hidden shadow-2xl shadow-blue-100 group">
          <div className="relative z-10 max-w-lg">
            <h3 className="text-4xl font-black mb-6 tracking-tighter leading-tight">Your Signature Collection is Growing! 📈</h3>
            <p className="text-blue-100 text-xl font-medium leading-relaxed mb-10">All systems operational. Orders are being processed efficiently, and customer traffic is trending upwards.</p>
            <Link to="/admin/products" className="inline-flex px-10 py-5 bg-white text-blue-600 font-black rounded-2xl hover:bg-blue-50 transition-all shadow-xl uppercase tracking-widest text-xs">Manage Inventory</Link>
          </div>
          <div className="absolute -bottom-10 -right-10 opacity-10 rotate-12 group-hover:scale-110 transition-transform duration-1000">
             <svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>
          </div>
        </div>

        <div className="bg-slate-900 rounded-[4rem] p-12 text-white flex flex-col justify-center items-center text-center space-y-8">
           <div className="text-5xl">💎</div>
           <div>
             <h4 className="text-2xl font-black tracking-tight">System Status</h4>
             <p className="text-slate-400 font-medium text-sm mt-2">Cloud Synced: Active ✅</p>
           </div>
           <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
             <div className="h-full bg-blue-500 w-[98%] rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>
           </div>
           <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 italic">"Efficiency is the core of luxury."</p>
        </div>
      </div>
    </div>
  );
};

// Removed React.FC to prevent potential issues with children requirement in routing contexts
const AdminDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    updateAdminStatus(false);
    navigate('/');
  };

  const menuItems = [
    { name: 'Overview', path: '/admin/dashboard', icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg> },
    { name: 'Products', path: '/admin/products', icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg> },
    { name: 'Orders', path: '/admin/orders', icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg> },
  ];

  const isBaseAdmin = location.pathname === '/admin' || location.pathname === '/admin/';

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside className="w-80 bg-white border-r border-slate-200 hidden md:flex flex-col fixed inset-y-0 shadow-[40px_0_80px_rgba(0,0,0,0.02)] z-40">
        <div className="p-12 border-b border-slate-100 flex flex-col items-center">
          <Link to="/" className="text-3xl font-black text-blue-600 tracking-tighter mb-1">SCENTSATIONZ</Link>
          <span className="text-[10px] font-black text-slate-400 tracking-[0.4em] uppercase">Control Panel</span>
        </div>
        
        <nav className="flex-grow p-10 space-y-4">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-5 px-6 py-5 rounded-[1.5rem] text-sm font-black transition-all ${
                location.pathname === item.path ? 'bg-blue-600 text-white shadow-2xl shadow-blue-100' : 'text-slate-500 hover:bg-slate-50 hover:text-blue-600'
              }`}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="p-10 border-t border-slate-100">
          <button
            onClick={handleLogout}
            className="flex items-center gap-5 px-6 py-5 rounded-[1.5rem] text-sm font-black text-red-500 hover:bg-red-50 transition-all w-full group"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-1 transition-transform"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            Logout Session
          </button>
        </div>
      </aside>

      <main className="flex-grow md:ml-80 p-12 lg:p-20">
        <div className="max-w-7xl mx-auto">
          {isBaseAdmin ? <DashboardOverview /> : <Outlet />}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;

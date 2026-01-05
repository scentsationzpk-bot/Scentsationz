
import React, { useEffect, useState, createContext, useContext } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminProducts from './pages/AdminProducts';
import AdminOrders from './pages/AdminOrders';
import AdminSpecs from './pages/AdminSpecs';
import AdminBundles from './pages/AdminBundles';
import SpecsList from './pages/SpecsList';
import PerfumeSpecs from './pages/PerfumeSpecs';
import About from './pages/About';
import Toast from './components/Toast';
import WhatsAppWidget from './components/WhatsAppWidget';
import LiveOrdersPopup from './components/LiveOrdersPopup';
import { getStoreDataSync, seedIfEmpty, getProducts, getOrders } from './storage';

interface ToastContextType {
  showToast: (message: string, type?: 'success' | 'error') => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const ProtectedRoute: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const state = getStoreDataSync();
  if (!state.admin.loggedIn) return <Navigate to="/admin-login" replace />;
  return <>{children}</>;
};

const App: React.FC = () => {
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      await seedIfEmpty();
      setReady(true);
    };
    init();
  }, []);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
  };

  if (!ready) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-white space-y-6">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-blue-600 font-black tracking-widest uppercase text-xs">Accessing Secure Vault...</p>
      </div>
    );
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      <HashRouter>
        <ScrollToTop />
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-success/:orderId" element={<OrderSuccess />} />
              <Route path="/specs" element={<SpecsList />} />
              <Route path="/specs/:id" element={<PerfumeSpecs />} />
              <Route path="/about" element={<About />} />
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>}>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<DashboardOverview />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="bundles" element={<AdminBundles />} />
                <Route path="specs/:id" element={<AdminSpecs />} />
              </Route>
            </Routes>
          </main>
          <Footer />
          <WhatsAppWidget />
          <LiveOrdersPopup />
          {toast && (
            <Toast 
              message={toast.message} 
              type={toast.type} 
              onClose={() => setToast(null)} 
            />
          )}
        </div>
      </HashRouter>
    </ToastContext.Provider>
  );
};

const DashboardOverview = () => {
  const [productsCount, setProductsCount] = useState(0);
  const [orders, setOrders] = useState<any[]>([]);
  const [lowStockCount, setLowStockCount] = useState(0);
  const [watching, setWatching] = useState(Math.floor(Math.random() * 50) + 20);

  useEffect(() => {
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

  const revenue = orders.reduce((acc, o) => acc + (Number(o.total) || 0), 0);

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
          <span className="text-blue-600 font-black text-[10px] uppercase tracking-[0.3em] bg-blue-50 px-4 py-2 rounded-full border border-blue-100 mb-4 inline-block">Vault Active</span>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter">Command <span className="text-blue-600">Center</span> 🚀</h1>
          <p className="text-slate-500 mt-2 font-bold text-lg">Real-time cloud registry status.</p>
        </div>
        <div className="bg-white px-8 py-5 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-6">
           <div className="flex items-center gap-3">
             <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
             <p className="text-sm font-black text-slate-800 uppercase tracking-widest">{watching} Online</p>
           </div>
           <div className="w-px h-8 bg-slate-100"></div>
           <Link to="/shop" className="text-blue-600 font-black text-sm uppercase tracking-widest hover:underline">Storefront</Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat) => (
          <div key={stat.label} className={`bg-white p-10 rounded-[3rem] border ${stat.color} shadow-sm hover:shadow-2xl transition-all duration-500 group`}>
            <div className="text-5xl mb-8 group-hover:scale-110 group-hover:rotate-6 transition-transform inline-block">{stat.icon}</div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{stat.label}</p>
            <p className="text-4xl font-black text-slate-900 mt-2 tracking-tighter">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-blue-600 rounded-[4rem] p-16 text-white relative overflow-hidden shadow-2xl shadow-blue-100 group">
          <div className="relative z-10 max-w-lg">
            <h3 className="text-4xl font-black mb-6 tracking-tighter leading-tight">Registry Integrity Confirmed! 📈</h3>
            <p className="text-blue-100 text-xl font-medium leading-relaxed mb-10">All systems are operational. Orders are being processed efficiently from the Firebase Cloud Vault.</p>
            <Link to="/admin/products" className="inline-flex px-10 py-5 bg-white text-blue-600 font-black rounded-2xl hover:bg-blue-50 transition-all shadow-xl uppercase tracking-widest text-xs">Manage Drop</Link>
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
           <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 italic">"Luxury is defined by precision."</p>
        </div>
      </div>
    </div>
  );
};

export default App;

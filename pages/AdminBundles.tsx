
import React, { useState, useEffect } from 'react';
// Corrected imports to match storage.ts exports
import { getStoreDataSync, getProducts, MOCK_BUNDLES } from '../storage';
import { Bundle, Product } from '../types';
import { useToast } from '../App';

const AdminBundles: React.FC = () => {
  const { showToast } = useToast();
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  
  useEffect(() => {
    // Sync helper for bundles (still using mock) and async for products
    // Using getStoreDataSync as getStoreData is not exported
    const data = getStoreDataSync();
    setBundles(data.bundles || MOCK_BUNDLES);
    
    const fetchProducts = async () => {
      try {
        const p = await getProducts();
        setProducts(p);
      } catch (error) {
        console.error("Failed to fetch products for bundles admin:", error);
      }
    };
    
    fetchProducts();
  }, []);

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to remove this bundle offer?')) {
      // Using getStoreDataSync as getStoreData is not exported
      const data = getStoreDataSync();
      data.bundles = (data.bundles || []).filter(b => b.id !== id);
      // setStoreData is not exported from storage.ts, so we only update local state for now
      setBundles(data.bundles);
      showToast('Bundle offer removed 🗑️', 'success');
    }
  };

  return (
    <div className="animate-in fade-in duration-500 pb-20 space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Offer Management 🎁</h1>
          <p className="text-slate-500 mt-1 font-bold">Manage your "Buy More, Save More" bundles and duos.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {bundles.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
             <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">No active bundles found ✨</p>
          </div>
        ) : (
          bundles.map((bundle) => (
            <div key={bundle.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8 group hover:shadow-xl transition-all duration-500">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center text-3xl shadow-inner">
                  🛍️
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-2xl font-black text-slate-900">{bundle.title}</h3>
                    <span className="px-3 py-1 bg-blue-600 text-white text-[8px] font-black uppercase rounded-lg tracking-widest">
                      {bundle.type}
                    </span>
                  </div>
                  <p className="text-blue-600 font-black text-sm italic mt-1">{bundle.discountText}</p>
                  <div className="flex gap-2 mt-3">
                    {bundle.productIds.map(pid => (
                      <span key={pid} className="px-2 py-1 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                        {pid}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-10 w-full md:w-auto border-t md:border-t-0 pt-6 md:pt-0">
                <div className="text-right">
                  <p className="text-2xl font-black text-slate-900 tracking-tighter">Rs. {bundle.bundlePrice.toLocaleString()}</p>
                  <p className="text-xs text-slate-300 line-through font-bold">Rs. {bundle.originalPrice.toLocaleString()}</p>
                </div>
                <button 
                  onClick={() => handleDelete(bundle.id)}
                  className="p-4 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all active:scale-90"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-12 bg-slate-900 rounded-[3.5rem] text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
        <div className="relative z-10 text-center md:text-left">
          <h4 className="text-2xl font-black tracking-tighter mb-2">Drive Higher Average Order Value! 📈</h4>
          <p className="text-slate-400 font-medium">Bundles encourage customers to try more scents while saving money.</p>
        </div>
        <div className="absolute right-0 top-0 opacity-5 -rotate-12 translate-x-12">
          <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L15 8l6 3-6 3-3 6-3-6-6-3 6-3 3-6z"/></svg>
        </div>
      </div>
    </div>
  );
};

export default AdminBundles;

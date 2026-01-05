
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../storage';
import { Product } from '../types';

const SpecsList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch all products to list their specs
    const fetchProducts = async () => {
      try {
        const p = await getProducts();
        setProducts(p);
      } catch (error) {
        console.error("Failed to fetch products for specs list:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-400 font-black uppercase text-xs tracking-widest">Accessing Olfactory Records...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 animate-in fade-in duration-700 space-y-20">
      <div className="text-center space-y-6">
        <h1 className="text-6xl font-black text-slate-900 tracking-tighter">Olfactory Library 🧬</h1>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto font-bold leading-relaxed">
          The technical details behind our signature collections. Explore notes, performance, and more.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {products.map((p) => (
          <div key={p.id} className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col h-full group">
            <div className="flex justify-between items-start mb-8">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 transition-transform">
                🎯
              </div>
              <span className="px-3 py-1 bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-lg">{p.category}</span>
            </div>

            <div className="flex-grow space-y-6">
              <h2 className="text-3xl font-black text-slate-900 tracking-tighter">{p.name}</h2>
              <p className="text-slate-400 font-medium text-sm line-clamp-2">{p.description}</p>
              
              <div className="space-y-4 pt-4">
                <div className="flex items-center gap-3">
                  <span className="text-lg">🌿</span>
                  <div className="flex-grow h-1.5 bg-slate-50 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 w-[70%]" />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg">⏳</span>
                  <div className="flex-grow h-1.5 bg-slate-50 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-400 w-[85%]" />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10">
              <Link 
                to={`/specs/${p.id}`}
                className="w-full inline-flex items-center justify-center py-4 bg-white border-2 border-slate-100 text-slate-900 font-black rounded-2xl hover:border-blue-600 hover:text-blue-600 transition-all group-hover:bg-blue-50"
              >
                Explore Scent Profile
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-slate-900 rounded-[4rem] p-16 text-center text-white relative overflow-hidden">
         <div className="absolute inset-0 opacity-10">
           <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.1"><path d="M12 2l3 6 6 3-6 3-3 6-3-6-6-3 6-3 3-6z"/></svg>
         </div>
         <p className="text-2xl font-black italic relative z-10">"Science meets soul in every drop." 💫</p>
      </div>
    </div>
  );
};

export default SpecsList;


import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getProductById, getProducts, addToCart } from '../storage';
import { Product } from '../types';
import { useToast } from '../App';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState(false);
  
  const [watching] = useState(Math.floor(Math.random() * 108) + 42);

  useEffect(() => {
    const fetch = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const p = await getProductById(id);
        if (!p) {
          navigate('/shop');
          return;
        }
        setProduct(p);
        const all = await getProducts();
        setRelatedProducts(all.filter(item => item.id !== id).slice(0, 3));
      } catch (error) {
        console.error("Error loading product details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id, navigate]);

  const handleBuyNow = () => {
    if (product && product.stock > 0) {
      setBuying(true);
      addToCart(product, quantity);
      navigate('/checkout');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-400 font-black uppercase text-xs tracking-widest">Decoding Scent Profile...</p>
      </div>
    );
  }

  if (!product) return null;

  const specs = product.specifications || {
    topNotes: ['N/A'], middleNotes: ['N/A'], baseNotes: ['N/A'],
    longevity: 70, sillage: 'Moderate', occasions: ['General']
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 md:py-24 space-y-24 md:space-y-48 animate-in fade-in duration-700">
      <div className="flex flex-col lg:grid lg:grid-cols-2 gap-16 md:gap-32 items-start">
        {/* Left Column: Visuals & Trust */}
        <div className="w-full lg:sticky lg:top-36 space-y-12">
           <div className="aspect-[4/5] bg-slate-50 rounded-[4rem] overflow-hidden shadow-[20px_20px_0px_0px_rgba(15,23,42,0.05)] relative group border-4 border-slate-900 flex items-center justify-center">
              <img src={product.imageUrl} alt={product.name} className="w-full h-full object-contain p-8 md:p-16 transition-transform duration-[2s] group-hover:scale-105" />
           </div>
           
           <div className="grid grid-cols-2 gap-6">
              <div className="bg-blue-600 p-8 rounded-3xl text-white flex flex-col items-center text-center shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] border-4 border-slate-900 transition-transform hover:-translate-y-1">
                 <span className="text-4xl mb-2">🔥</span>
                 <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Persistence</p>
                 <p className="text-2xl font-black">14+ Hours</p>
              </div>
              <div className="bg-white p-8 rounded-3xl text-slate-900 flex flex-col items-center text-center shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] border-4 border-slate-900 transition-transform hover:-translate-y-1">
                 <span className="text-4xl mb-2">🧪</span>
                 <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Purity</p>
                 <p className="text-2xl font-black uppercase">Extrait</p>
              </div>
           </div>

           <div className="bg-slate-50 p-10 rounded-[3rem] border-4 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] flex items-center justify-center gap-8 group">
              <span className="text-5xl animate-pulse">👁️</span>
              <div>
                <p className="text-xl font-black text-slate-900 tracking-tighter leading-none">{watching} collectors viewing</p>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 mt-2">Active Vault Item</p>
              </div>
           </div>
        </div>

        {/* Right Column: Information & Purchase */}
        <div className="w-full space-y-16">
          <div className="space-y-6 text-center">
            <div className="inline-block">
              <span className="text-blue-600 font-black text-sm uppercase tracking-[0.6em] bg-blue-50 px-6 py-2 rounded-2xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">{product.category} Series</span>
            </div>
            <h1 className="text-6xl md:text-9xl font-black text-slate-900 tracking-tighter leading-none uppercase">{product.name}</h1>
            <p className="text-2xl md:text-4xl font-bold text-slate-400 italic leading-snug max-w-xl mx-auto">{product.description}</p>
          </div>

          {/* Pricing & Checkout Block */}
          <div className="p-10 md:p-16 bg-white rounded-[4rem] border-4 border-slate-900 shadow-[15px_15px_0px_0px_rgba(15,23,42,1)] space-y-12 flex flex-col items-center">
            <div className="flex flex-col md:flex-row justify-between items-center gap-10 w-full">
               <div className="text-center md:text-left">
                 <p className="text-6xl font-black text-slate-900 tracking-tighter">Rs. {product.price.toLocaleString()}</p>
                 <p className="text-[10px] font-black text-green-600 uppercase tracking-widest mt-2 border-l-4 border-green-600 pl-3">Complimentary Nationwide Shipping 🚚</p>
               </div>
               <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-[2.5rem] border-4 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
                  <button onClick={() => setQuantity(q => Math.max(1, q-1))} className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-slate-900 shadow-lg active:scale-90 font-black border-2 border-slate-900">-</button>
                  <span className="w-12 text-center text-3xl font-black">{quantity}</span>
                  <button onClick={() => setQuantity(q => q+1)} className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-slate-900 shadow-lg active:scale-90 font-black border-2 border-slate-900">+</button>
               </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              <button 
                onClick={() => { addToCart(product, quantity); showToast(`${product.name} secured! 🛍️`); }}
                className="w-full py-7 border-4 border-slate-900 text-slate-900 font-black text-xl rounded-3xl hover:bg-slate-50 transition-all uppercase tracking-widest shadow-[6px_6px_0_0_rgba(15,23,42,1)] active:shadow-none active:translate-x-0.5 active:translate-y-0.5"
              >
                Add To Collection
              </button>
              <button 
                onClick={handleBuyNow}
                disabled={buying}
                className="w-full py-7 bg-blue-600 text-white font-black text-xl rounded-3xl shadow-[0_20px_50px_rgba(37,99,235,0.4)] hover:bg-blue-700 active:scale-95 transition-all border-4 border-slate-900 border-b-[12px] uppercase tracking-widest disabled:opacity-50"
              >
                {buying ? 'Syncing...' : 'Secure Order 🚀'}
              </button>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-10 border-t-4 border-slate-50 w-full">
               <div className="space-y-3">
                  <div className="flex justify-between items-end">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Projection</p>
                    <span className="text-blue-600 font-black text-sm">{specs.sillage}</span>
                  </div>
                  <div className="h-3 bg-slate-50 rounded-full border-2 border-slate-900 p-0.5 overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: specs.sillage === 'Strong' ? '95%' : specs.sillage === 'Moderate' ? '65%' : '35%' }}></div>
                  </div>
               </div>
               <div className="space-y-3">
                  <div className="flex justify-between items-end">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Persistence</p>
                    <span className="text-blue-600 font-black text-sm">{specs.longevity}%</span>
                  </div>
                  <div className="h-3 bg-slate-50 rounded-full border-2 border-slate-900 p-0.5 overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: `${specs.longevity}%` }}></div>
                  </div>
               </div>
            </div>
          </div>

          {/* Scent Journey Vertical Timeline */}
          <div className="space-y-12">
            <h3 className="text-4xl font-black tracking-tighter text-slate-900 uppercase flex items-center justify-center gap-4 text-center">
              The Scent Journey <span className="text-blue-600">🧬</span>
            </h3>
            
            <div className="relative pl-12 space-y-16">
              {/* Vertical Line */}
              <div className="absolute left-[22px] top-4 bottom-4 w-1.5 bg-slate-900 rounded-full"></div>

              {/* Top Notes */}
              <div className="relative group transition-all duration-500">
                <div className="absolute -left-[56px] top-0 w-12 h-12 rounded-full bg-white border-4 border-slate-900 flex items-center justify-center text-2xl shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] z-10 group-hover:scale-125 transition-transform duration-500">🌿</div>
                <div className="bg-slate-50 p-8 rounded-[2.5rem] border-4 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] group-hover:-translate-x-1 transition-transform">
                   <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                      <h4 className="text-2xl font-black uppercase tracking-tighter text-slate-900">Head Phase</h4>
                      <span className="px-4 py-1.5 bg-blue-100 text-blue-700 border-2 border-slate-900 rounded-full font-black text-[10px] uppercase tracking-widest w-fit">The First 30 Mins</span>
                   </div>
                   <p className="text-slate-500 font-bold text-lg leading-relaxed">{specs.topNotes.join(' • ')}</p>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-4">Immediate impact & awakening</p>
                </div>
              </div>

              {/* Heart Notes */}
              <div className="relative group transition-all duration-500">
                <div className="absolute -left-[56px] top-0 w-12 h-12 rounded-full bg-slate-900 border-4 border-slate-900 flex items-center justify-center text-2xl shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] z-10 group-hover:scale-125 transition-transform duration-500">🌸</div>
                <div className="bg-white p-8 rounded-[2.5rem] border-4 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] group-hover:-translate-x-1 transition-transform">
                   <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                      <h4 className="text-2xl font-black uppercase tracking-tighter text-slate-900">Heart Phase</h4>
                      <span className="px-4 py-1.5 bg-blue-600 text-white border-2 border-slate-900 rounded-full font-black text-[10px] uppercase tracking-widest w-fit">Hours 1 - 6</span>
                   </div>
                   <p className="text-slate-900 font-bold text-lg leading-relaxed">{specs.middleNotes.join(' • ')}</p>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-4">The core character & signature</p>
                </div>
              </div>

              {/* Base Notes */}
              <div className="relative group transition-all duration-500">
                <div className="absolute -left-[56px] top-0 w-12 h-12 rounded-full bg-white border-4 border-slate-900 flex items-center justify-center text-2xl shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] z-10 group-hover:scale-125 transition-transform duration-500">🌲</div>
                <div className="bg-slate-900 p-8 rounded-[2.5rem] border-4 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] text-white group-hover:-translate-x-1 transition-transform">
                   <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                      <h4 className="text-2xl font-black uppercase tracking-tighter text-white">Dry-Down Phase</h4>
                      <span className="px-4 py-1.5 bg-slate-800 text-white border-2 border-slate-700 rounded-full font-black text-[10px] uppercase tracking-widest w-fit">Hours 7 - 14+</span>
                   </div>
                   <p className="text-slate-300 font-bold text-lg leading-relaxed">{specs.baseNotes.join(' • ')}</p>
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-4">The lasting soul & legacy</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="space-y-16">
        <h2 className="text-5xl md:text-8xl font-black text-slate-900 tracking-tighter text-center uppercase">Elite Pairings</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-16">
          {relatedProducts.map(p => (
            <Link key={p.id} to={`/product/${p.id}`} className="group bg-white p-12 rounded-[4rem] border-4 border-slate-900 shadow-[10px_10px_0px_0px_rgba(15,23,42,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all text-center flex flex-col items-center">
              <div className="aspect-square bg-slate-50 rounded-[3rem] mb-10 flex items-center justify-center border-2 border-slate-100 overflow-hidden w-full">
                <img src={p.imageUrl} alt={p.name} className="w-full h-full object-contain p-8 group-hover:scale-110 transition-transform duration-1000" />
              </div>
              <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">{p.name}</h3>
              <p className="text-blue-600 font-black text-2xl tracking-tighter mt-2">Rs. {p.price.toLocaleString()}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ProductDetail;

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getProducts, addToCart } from '../storage';
import { Product } from '../types';
import { useToast } from '../App';

const QuickViewModal: React.FC<{ product: Product; onClose: () => void }> = ({ product, onClose }) => {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    showToast(`${product.name} added to bag! 🛍️`, 'success');
    onClose();
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    onClose();
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-4xl rounded-[2.5rem] md:rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in zoom-in duration-300 border-[6px] border-slate-900 max-h-[90vh] overflow-y-auto">
        <div className="w-full md:w-1/2 aspect-[4/5] bg-slate-50 relative flex items-center justify-center border-b-[6px] md:border-b-0 md:border-r-[6px] border-slate-900">
          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-contain p-4" />
          <button onClick={onClose} className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-slate-900">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>
        <div className="w-full md:w-1/2 p-6 md:p-12 flex flex-col justify-between bg-white text-center items-center">
          <div className="space-y-6 flex flex-col items-center">
            <span className="text-blue-600 font-black text-[10px] uppercase tracking-widest bg-blue-50 px-4 py-2 rounded-xl inline-block border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">{product.category} Series</span>
            <h2 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tighter leading-tight uppercase">{product.name}</h2>
            <p className="text-slate-500 text-sm md:text-base leading-relaxed font-medium max-w-xs">{product.description}</p>
            <div className="py-6 border-y-4 border-slate-50 flex items-center justify-between w-full">
              <span className="text-2xl md:text-3xl font-black text-slate-900">Rs. {product.price.toLocaleString()}</span>
              <div className="flex items-center gap-4 bg-slate-50 p-1.5 rounded-2xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
                <button onClick={() => setQuantity(q => Math.max(1, q-1))} className="w-8 h-8 rounded-full bg-white flex items-center justify-center font-black border-2 border-slate-900">-</button>
                <span className="font-black px-2">{quantity}</span>
                <button onClick={() => setQuantity(q => q+1)} className="w-8 h-8 rounded-full bg-white flex items-center justify-center font-black border-2 border-slate-900">+</button>
              </div>
            </div>
          </div>
          <div className="space-y-3 pt-6 w-full">
            <button onClick={handleAddToCart} className="w-full py-4 border-2 border-slate-900 text-slate-900 font-black rounded-2xl hover:bg-slate-50 transition-all uppercase tracking-widest text-[10px]">Add to Bag</button>
            <button onClick={handleBuyNow} className="w-full py-4 bg-blue-600 text-white font-black rounded-2xl shadow-xl hover:bg-blue-700 transition-all uppercase tracking-widest text-[10px] border-b-4 border-blue-900">Express Checkout</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Home: React.FC = () => {
  const { showToast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  useEffect(() => {
    const fetch = async () => {
      const p = await getProducts();
      setProducts(p);
    };
    fetch();
  }, []);

  const categories = [
    { name: 'Bold', icon: '💎', color: 'bg-blue-600', desc: 'Powerful Presence' },
    { name: 'Fresh', icon: '🌊', color: 'bg-teal-500', desc: 'Clean Awakening' },
    { name: 'Warm', icon: '🔥', color: 'bg-orange-500', desc: 'Sultry Sophistication' },
    { name: 'Woody', icon: '🌲', color: 'bg-emerald-700', desc: 'Earthy Foundation' },
  ];

  return (
    <div className="animate-in fade-in duration-700 bg-white">
      {/* Hero Section */}
      <section className="relative min-h-[95vh] flex items-center justify-center overflow-hidden bg-slate-900 px-4">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140vw] h-[140vw] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
        <div className="relative z-10 text-center space-y-12 flex flex-col items-center">
          <div className="inline-block px-4 py-2 border-2 border-blue-500/30 rounded-full mb-4">
            <span className="text-blue-400 font-black text-[10px] uppercase tracking-[0.6em] block">Signature Scent Lab • 2026</span>
          </div>
          <h1 className="text-7xl sm:text-9xl md:text-[14rem] font-black text-white tracking-tighter leading-[0.75] mb-8 uppercase text-center">
            The <span className="text-blue-500 italic">Elite</span> Standard
          </h1>
          <p className="text-slate-400 text-xl md:text-5xl font-medium max-w-5xl mx-auto opacity-90 tracking-tight leading-snug text-center">
            Extrait de Parfum concentrations. <br className="hidden md:block"/> Engineered for the 1%. 🧪
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 pt-10">
            <Link to="/shop" className="group w-full sm:w-auto px-20 py-10 bg-blue-600 text-white font-black rounded-[3rem] text-3xl hover:scale-105 active:scale-95 transition-all shadow-[0_20px_50px_rgba(37,99,235,0.4)] border-4 border-slate-900 border-b-[12px] uppercase tracking-tighter">
              Explore The Vault 🛍️
            </Link>
          </div>
          <div className="pt-6">
            <p className="text-green-400 font-black uppercase tracking-[0.2em] text-sm md:text-xl flex items-center gap-3">
              <span className="animate-pulse">🚚</span> Free Nationwide Delivery Included
            </p>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="max-w-7xl mx-auto px-4 py-32 space-y-24">
        <div className="text-center flex flex-col items-center space-y-4">
            <h2 className="text-5xl md:text-8xl font-black text-slate-900 tracking-tighter uppercase leading-none text-center">The Difference</h2>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs text-center">Why Scentsationz stands alone in the market.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-slate-50 p-12 md:p-20 rounded-[4rem] border-4 border-slate-900 shadow-[12px_12px_0px_0px_rgba(15,23,42,1)] space-y-10 flex flex-col items-center text-center">
                <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Ordinary Brands</h3>
                <ul className="space-y-6 w-full">
                    {['Low oil concentration (10-15%)', 'Synthetic harsh chemicals', 'Fades in 3-4 hours', 'Generic mass-market scents'].map((item, i) => (
                        <li key={i} className="flex items-center justify-center gap-4 text-slate-400 font-bold text-xl line-through">
                            <span className="w-8 h-8 rounded-full border-2 border-slate-200 flex items-center justify-center text-xs shrink-0">✕</span>
                            {item}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="bg-blue-600 p-12 md:p-20 rounded-[4rem] border-4 border-slate-900 shadow-[12px_12px_0px_0px_rgba(15,23,42,1)] space-y-10 text-white flex flex-col items-center text-center">
                <h3 className="text-3xl font-black uppercase tracking-tighter">Scentsationz Elite</h3>
                <ul className="space-y-6 w-full">
                    {['Extrait de Parfum (35-40%)', 'Natural premium absolutes', '14+ hours of active scent', 'Original identity signatures'].map((item, i) => (
                        <li key={i} className="flex items-center justify-center gap-4 font-black text-xl">
                            <span className="w-10 h-10 rounded-full bg-white text-blue-600 flex items-center justify-center text-lg border-4 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] shrink-0">✓</span>
                            {item}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
      </section>

      {/* Featured Vault Drops */}
      <section className="max-w-7xl mx-auto px-4 py-32 space-y-24">
        <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-10">
          <div className="space-y-4">
            <h2 className="text-6xl md:text-9xl font-black text-slate-900 tracking-tighter uppercase text-center md:text-left">Vault <span className="text-blue-600 italic">Favorites</span></h2>
            <p className="text-slate-500 text-xl font-bold text-center md:text-left">Current live batch availability. All priced at Rs. 2,250.</p>
          </div>
          <Link to="/shop" className="px-10 py-4 border-4 border-slate-900 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-900 hover:text-white transition-all shadow-[6px_6px_0px_0px_rgba(15,23,42,1)]">View All Drops</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {products.slice(0, 4).map(product => (
            <div key={product.id} className="group bg-white rounded-[3.5rem] border-4 border-slate-900 shadow-[10px_10px_0px_0px_rgba(15,23,42,1)] overflow-hidden hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all h-full flex flex-col items-center text-center">
              <div className="aspect-[4/5] bg-slate-50 relative flex items-center justify-center border-b-4 border-slate-900 w-full">
                <img src={product.imageUrl} alt={product.name} className="w-full h-full object-contain p-8 group-hover:scale-110 transition-transform duration-[1.5s]" />
                <div className="absolute top-4 left-4 bg-green-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
                  Free Delivery 🚚
                </div>
                <button onClick={() => setQuickViewProduct(product)} className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all">Instant Look</button>
              </div>
              <div className="p-10 space-y-6 w-full flex flex-col items-center">
                <h3 className="text-3xl font-black text-slate-900 leading-none tracking-tighter uppercase text-center">{product.name}</h3>
                <div className="pt-6 border-t-2 border-slate-100 flex items-center justify-between w-full">
                  <span className="text-2xl font-black text-slate-900">Rs. {product.price.toLocaleString()}</span>
                  <button onClick={() => { addToCart(product, 1); showToast(`${product.name} added! 🛍️`); }} className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] active:shadow-none active:translate-x-0.5 active:translate-y-0.5 transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <section className="max-w-7xl mx-auto px-4 py-20 pb-40">
          <div className="bg-slate-900 rounded-[5rem] p-16 md:p-32 text-white border-[10px] border-blue-600 shadow-5xl text-center space-y-12 relative overflow-hidden flex flex-col items-center">
              <div className="absolute top-0 left-0 w-full h-full bg-blue-600/5 animate-pulse pointer-events-none"></div>
              <h2 className="text-5xl md:text-[8rem] font-black tracking-tighter leading-none uppercase relative z-10">Join The <span className="text-blue-500">Registry</span></h2>
              <p className="text-slate-400 text-xl md:text-4xl max-w-3xl font-medium relative z-10">Be the first to know when limited batches drop. Free Nationwide Shipping on every single bottle.</p>
              <div className="flex flex-col sm:flex-row gap-6 w-full max-w-2xl relative z-10">
                 <input type="email" placeholder="Your best email" className="flex-grow bg-slate-800 border-4 border-slate-700 rounded-3xl px-8 py-6 text-xl font-black focus:border-blue-500 outline-none text-center" />
                 <button className="px-12 py-6 bg-blue-600 text-white font-black rounded-3xl text-xl uppercase tracking-widest hover:bg-blue-700 transition-all border-b-8 border-blue-900 active:translate-y-2 active:border-b-0 shadow-2xl">Access</button>
              </div>
          </div>
      </section>

      {quickViewProduct && <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />}
    </div>
  );
};

export default Home;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../storage';
import { Product } from '../types';

const Shop: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  const categories = ['All', 'Bold', 'Fresh', 'Warm', 'Woody', 'Floral'];

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const p = await getProducts();
      setProducts(p);
      setFilteredProducts(p);
      setLoading(false);
    };
    fetch();
  }, []);

  useEffect(() => {
    if (activeCategory === 'All') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter(p => p.category === activeCategory));
    }
  }, [activeCategory, products]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-400 font-black uppercase text-xs tracking-widest">Opening Vault...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 space-y-16 animate-in fade-in duration-700">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10">
        <div className="space-y-4">
          <h1 className="text-6xl md:text-9xl font-black text-slate-900 tracking-tighter">The <span className="text-blue-600 italic">Vault</span></h1>
          <p className="text-slate-500 text-xl font-medium max-w-2xl">Handcrafted, high-longevity, and uniquely you. ✨</p>
        </div>
        <div className="flex flex-wrap gap-2 p-2 bg-slate-50 rounded-3xl border border-slate-100">
          {categories.map((cat) => (
            <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-8 py-3 rounded-2xl text-sm font-black transition-all ${activeCategory === cat ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-white'}`}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
        {filteredProducts.map((product) => (
          <Link key={product.id} to={`/product/${product.id}`} className="group bg-white rounded-[3rem] border-4 border-slate-50 overflow-hidden hover:border-blue-600 transition-all duration-700 h-full flex flex-col shadow-sm">
            <div className="aspect-[3/4] bg-slate-50 relative flex items-center justify-center border-b-2 border-slate-50">
              <img src={product.imageUrl} alt={product.name} className="w-full h-full object-contain p-6 group-hover:scale-110 transition-transform duration-1000" />
            </div>
            <div className="p-8 space-y-4 flex-grow text-center">
              <span className="text-blue-600 font-black text-[10px] uppercase tracking-widest">{product.category} Series</span>
              <h3 className="text-2xl font-black text-slate-900 leading-none">{product.name}</h3>
              <p className="text-3xl font-black text-slate-900 mt-4">Rs. {product.price.toLocaleString()}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Shop;

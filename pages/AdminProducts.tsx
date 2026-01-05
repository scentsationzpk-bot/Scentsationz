
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, addProduct, updateProduct, deleteProduct } from '../storage';
import { Product } from '../types';
import { useToast } from '../App';

const AdminProducts: React.FC = () => {
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    stock: 0,
    description: '',
    category: 'Bold',
    badge: 'None' as Product['badge'],
    imageUrl: ''
  });

  useEffect(() => {
    refreshProducts();
  }, []);

  const refreshProducts = async () => {
    setLoading(true);
    try {
      const cloudProducts = await getProducts();
      setProducts(cloudProducts);
    } catch (e) {
      showToast('Cloud sync failed ❌', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({ name: '', price: '', stock: 0, description: '', category: 'Bold', badge: 'None', imageUrl: '' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setFormData({
      name: p.name,
      price: p.price.toString(),
      stock: p.stock,
      description: p.description,
      category: p.category,
      badge: p.badge || 'None',
      imageUrl: p.imageUrl || ''
    });
    setIsModalOpen(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 800 * 1024) {
        showToast('Image too heavy! 🛑 Limit: 800KB.', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, imageUrl: reader.result as string }));
        showToast('Asset localized! ✨', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload: Product = {
      id: editingProduct?.id || formData.name.toLowerCase().replace(/\s+/g, '-'),
      name: formData.name,
      price: parseFloat(formData.price),
      stock: formData.stock,
      description: formData.description,
      category: formData.category,
      imageUrl: formData.imageUrl,
      badge: formData.badge === 'None' ? undefined : (formData.badge as Product['badge']),
      specifications: editingProduct?.specifications
    };

    try {
      if (editingProduct) {
        await updateProduct(payload);
        showToast('Catalog Updated ✨', 'success');
      } else {
        await addProduct(payload);
        showToast('Entry Added to Cloud 🛍️', 'success');
      }
      setIsModalOpen(false);
      refreshProducts();
    } catch (error: any) {
      showToast('Sync Error ❌', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Erase this product from the vault?')) {
      try {
        await deleteProduct(id);
        showToast('Asset Decommissioned 🗑️', 'success');
        refreshProducts();
      } catch (e) {
        showToast('Erasure failed ❌', 'error');
      }
    }
  };

  if (loading && products.length === 0) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest">Syncing Catalog...</p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">Vault Inventory</h1>
          <p className="text-slate-500 mt-2 font-bold uppercase tracking-widest text-xs">Manage assets across all devices.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-4 bg-blue-600 text-white px-10 py-5 rounded-[2rem] font-black hover:bg-blue-700 transition-all shadow-2xl hover:scale-105 active:scale-95 text-xl uppercase tracking-tighter"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
          Add Drop
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((p) => (
          <div key={p.id} className="bg-white rounded-[3rem] border-[4px] border-slate-50 overflow-hidden hover:border-blue-600 transition-all duration-700 group flex flex-col shadow-sm">
             <div className="aspect-square bg-slate-50 relative overflow-hidden flex items-center justify-center border-b-4 border-slate-50">
                {p.imageUrl ? (
                  <img src={p.imageUrl} alt={p.name} className="w-full h-full object-contain p-8 group-hover:scale-110 transition-transform duration-1000" />
                ) : (
                  <div className="text-6xl grayscale opacity-20">🛍️</div>
                )}
                <div className="absolute top-6 right-6 flex flex-col gap-2">
                   <button onClick={() => handleOpenEdit(p)} className="p-3 bg-white/90 backdrop-blur rounded-xl shadow-lg hover:bg-blue-600 hover:text-white transition-all"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg></button>
                   <button onClick={() => handleDelete(p.id)} className="p-3 bg-white/90 backdrop-blur rounded-xl shadow-lg hover:bg-red-600 hover:text-white transition-all"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg></button>
                </div>
             </div>
             <div className="p-8 space-y-6">
                <div className="flex justify-between items-start">
                   <div>
                      <h3 className="text-2xl font-black text-slate-900 tracking-tighter leading-none">{p.name}</h3>
                      <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] mt-2">{p.category}</p>
                   </div>
                   <p className="text-xl font-black text-slate-900">Rs. {p.price.toLocaleString()}</p>
                </div>
                <div className="flex justify-between items-center pt-6 border-t-2 border-slate-50">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Inventory Status</p>
                   <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border-2 ${p.stock < 5 ? 'bg-orange-50 border-orange-200 text-orange-600' : 'bg-green-50 border-green-200 text-green-600'}`}>
                      {p.stock} units
                   </span>
                </div>
                <Link to={`/admin/specs/${p.id}`} className="block w-full py-4 bg-slate-900 text-white text-center font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-blue-600 transition-all shadow-xl">Detailed Specs 🧬</Link>
             </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-[4rem] shadow-3xl overflow-hidden flex flex-col animate-in zoom-in duration-300 max-h-[95vh] border-[8px] border-white/20">
            <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">
                {editingProduct ? 'Edit Asset' : 'New Asset'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="w-14 h-14 rounded-full bg-white border-4 border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-10 overflow-y-auto space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Label</label>
                  <input required type="text" value={formData.name} onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))} className="w-full px-8 py-5 rounded-[2rem] border-4 border-slate-50 bg-slate-50 focus:bg-white focus:border-blue-600 transition-all font-black text-lg outline-none" />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Series</label>
                  <select value={formData.category} onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))} className="w-full px-8 py-5 rounded-[2rem] border-4 border-slate-50 bg-slate-50 focus:bg-white focus:border-blue-600 transition-all font-black text-lg outline-none uppercase appearance-none text-center">
                    <option value="Bold">Bold</option><option value="Fresh">Fresh</option><option value="Warm">Warm</option><option value="Woody">Woody</option><option value="Floral">Floral</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Value (PKR)</label>
                  <input required type="number" value={formData.price} onChange={e => setFormData(prev => ({ ...prev, price: e.target.value }))} className="w-full px-8 py-5 rounded-[2rem] border-4 border-slate-50 bg-slate-50 focus:bg-white focus:border-blue-600 transition-all font-black text-3xl outline-none text-center" />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Stock Level</label>
                  <input required type="number" value={formData.stock} onChange={e => setFormData(prev => ({ ...prev, stock: parseInt(e.target.value) }))} className="w-full px-8 py-5 rounded-[2rem] border-4 border-slate-50 bg-slate-50 focus:bg-white focus:border-blue-600 transition-all font-black text-3xl outline-none text-center" />
                </div>
              </div>

              <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Cloud Visual Asset</label>
                  <div className="flex items-center gap-8 bg-slate-50 p-6 rounded-[2.5rem] border-4 border-white">
                    <div className="w-32 h-32 bg-white rounded-3xl border-4 border-slate-100 flex items-center justify-center overflow-hidden shrink-0">
                      {formData.imageUrl ? <img src={formData.imageUrl} className="w-full h-full object-contain p-2" /> : <span className="text-4xl">📸</span>}
                    </div>
                    <div className="flex-grow space-y-4">
                      <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
                      <button type="button" onClick={() => fileInputRef.current?.click()} className="w-full py-5 bg-slate-900 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-blue-600 transition-all shadow-xl">Replace Visual</button>
                      <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.2em] text-center">Cloud stability limit: 800KB</p>
                    </div>
                  </div>
              </div>

              <button disabled={saving} type="submit" className="w-full py-8 bg-blue-600 text-white font-black text-4xl rounded-[3rem] shadow-5xl border-b-[16px] border-blue-800 active:border-b-0 active:translate-y-4 transition-all uppercase tracking-tighter disabled:opacity-50">
                {saving ? 'Syncing...' : (editingProduct ? 'Commit Changes' : 'Initialize Asset')}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;

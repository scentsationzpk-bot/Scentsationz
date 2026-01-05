
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getProductById, updateProduct } from '../storage';
import { Product } from '../types';
import { useToast } from '../App';

const AdminSpecs: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    topNotes: '',
    middleNotes: '',
    baseNotes: '',
    longevity: 50,
    sillage: 'Moderate',
    occasions: [] as string[]
  });

  const moodOptions = ['Daily 💼', 'Evening ✨', 'Special Occasion 🎉', 'Summer ☀️', 'Party 🕺', 'Formal 👔', 'Romantic 💖', 'Office', 'Morning 🌞'];

  useEffect(() => {
    // Fetch product details async for admin editing
    const fetchProduct = async () => {
      if (!id) return;
      try {
        const p = await getProductById(id);
        if (!p) {
          navigate('/admin/products');
          return;
        }
        setProduct(p);
        
        if (p.specifications) {
          setFormData({
            topNotes: p.specifications.topNotes.join(', '),
            middleNotes: p.specifications.middleNotes.join(', '),
            baseNotes: p.specifications.baseNotes.join(', '),
            longevity: p.specifications.longevity,
            sillage: p.specifications.sillage,
            occasions: p.specifications.occasions
          });
        }
      } catch (error) {
        console.error("Error fetching product for admin specs:", error);
        navigate('/admin/products');
      }
    };
    
    fetchProduct();
  }, [id, navigate]);

  const handleToggleOccasion = (occ: string) => {
    setFormData(prev => ({
      ...prev,
      occasions: prev.occasions.includes(occ) 
        ? prev.occasions.filter(o => o !== occ)
        : [...prev.occasions, occ]
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || saving) return;

    setSaving(true);

    const updatedProduct: Product = {
      ...product,
      specifications: {
        topNotes: formData.topNotes.split(',').map(s => s.trim()).filter(Boolean),
        middleNotes: formData.middleNotes.split(',').map(s => s.trim()).filter(Boolean),
        baseNotes: formData.baseNotes.split(',').map(s => s.trim()).filter(Boolean),
        longevity: formData.longevity,
        sillage: formData.sillage,
        occasions: formData.occasions
      }
    };

    try {
      await updateProduct(updatedProduct);
      showToast('Specifications Saved ✨', 'success');
      navigate('/admin/products');
    } catch (error) {
      showToast('Save Failed ❌', 'error');
      setSaving(false);
    }
  };

  if (!product) return null;

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Edit Specifications 🎯</h1>
          <p className="text-slate-500 mt-1 font-bold">Refining {product.name} scent profile.</p>
        </div>
        <Link to="/admin/products" className="px-6 py-3 bg-slate-100 text-slate-500 font-bold rounded-2xl hover:bg-slate-200 transition-all">
          Cancel
        </Link>
      </div>

      <form onSubmit={handleSave} className="space-y-10">
        <div className="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-xl shadow-slate-100/50 space-y-10">
          <div className="space-y-8">
            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Fragrance Pyramid 🧬</h3>
            <div className="grid grid-cols-1 gap-8">
              <div className="space-y-3">
                <label className="text-sm font-black uppercase tracking-widest text-slate-400 ml-1">Top Notes (Comma separated)</label>
                <input
                  type="text"
                  disabled={saving}
                  value={formData.topNotes}
                  onChange={e => setFormData(prev => ({ ...prev, topNotes: e.target.value }))}
                  className="w-full px-6 py-5 rounded-2xl border-2 border-slate-50 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 transition-all font-bold text-lg disabled:opacity-50"
                  placeholder="e.g. Jasmine, Citrus, Rose"
                />
              </div>
              <div className="space-y-3">
                <label className="text-sm font-black uppercase tracking-widest text-slate-400 ml-1">Middle Notes (Comma separated)</label>
                <input
                  type="text"
                  disabled={saving}
                  value={formData.middleNotes}
                  onChange={e => setFormData(prev => ({ ...prev, middleNotes: e.target.value }))}
                  className="w-full px-6 py-5 rounded-2xl border-2 border-slate-50 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 transition-all font-bold text-lg disabled:opacity-50"
                  placeholder="e.g. Patchouli, Orchid"
                />
              </div>
              <div className="space-y-3">
                <label className="text-sm font-black uppercase tracking-widest text-slate-400 ml-1">Base Notes (Comma separated)</label>
                <input
                  type="text"
                  disabled={saving}
                  value={formData.baseNotes}
                  onChange={e => setFormData(prev => ({ ...prev, baseNotes: e.target.value }))}
                  className="w-full px-6 py-5 rounded-2xl border-2 border-slate-50 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 transition-all font-bold text-lg disabled:opacity-50"
                  placeholder="e.g. Amber, Musk, Vanilla"
                />
              </div>
            </div>
          </div>

          <div className="pt-10 border-t border-slate-100 space-y-8">
            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Performance Metrics ⏳</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                   <label className="text-sm font-black uppercase tracking-widest text-slate-400 ml-1">Longevity</label>
                   <span className="font-black text-blue-600">{formData.longevity}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  disabled={saving}
                  value={formData.longevity}
                  onChange={e => setFormData(prev => ({ ...prev, longevity: parseInt(e.target.value) }))}
                  className="w-full h-3 bg-slate-100 rounded-full appearance-none cursor-pointer accent-blue-600 disabled:opacity-50"
                />
              </div>
              <div className="space-y-4">
                <label className="text-sm font-black uppercase tracking-widest text-slate-400 ml-1">Sillage Intensity</label>
                <div className="flex gap-2">
                  {['Light', 'Moderate', 'Strong'].map(s => (
                    <button
                      key={s}
                      type="button"
                      disabled={saving}
                      onClick={() => setFormData(prev => ({ ...prev, sillage: s }))}
                      className={`flex-grow py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all border-2 ${
                        formData.sillage === s
                        ? 'bg-blue-600 border-blue-600 text-white shadow-lg'
                        : 'bg-slate-50 border-slate-50 text-slate-400 hover:border-slate-200'
                      } disabled:opacity-50`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-10 border-t border-slate-100 space-y-8">
            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Mood & Occasions 🎭</h3>
            <div className="flex flex-wrap gap-4">
              {moodOptions.map(occ => (
                <button
                  key={occ}
                  type="button"
                  disabled={saving}
                  onClick={() => handleToggleOccasion(occ)}
                  className={`px-6 py-3 rounded-2xl font-black text-sm uppercase tracking-widest transition-all border-2 ${
                    formData.occasions.includes(occ)
                    ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-100'
                    : 'bg-slate-50 border-slate-50 text-slate-400 hover:border-slate-200'
                  } disabled:opacity-50`}
                >
                  {occ}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full py-7 bg-blue-600 text-white font-black text-2xl rounded-[2.5rem] shadow-[0_20px_50px_rgba(37,99,235,0.3)] hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? 'Syncing Profile...' : 'Save Profile Changes ✨'}
        </button>
      </form>
    </div>
  );
};

export default AdminSpecs;

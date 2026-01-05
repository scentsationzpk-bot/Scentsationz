
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getProductById } from '../storage';
import { Product } from '../types';

const PerfumeSpecs: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    // Fetch product specs async from Firestore
    const fetchProduct = async () => {
      if (!id) return;
      try {
        const p = await getProductById(id);
        if (!p) {
          navigate('/specs');
          return;
        }
        setProduct(p);
      } catch (error) {
        console.error("Error fetching product specs:", error);
        navigate('/specs');
      }
    };
    
    fetchProduct();
  }, [id, navigate]);

  if (!product) return null;

  const specs = product.specifications || {
    topNotes: ['N/A'],
    middleNotes: ['N/A'],
    baseNotes: ['N/A'],
    longevity: 50,
    sillage: 'Moderate',
    occasions: ['General']
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 animate-in fade-in duration-700 space-y-20">
      <div className="flex items-center gap-6 mb-12">
        <Link to={`/product/${product.id}`} className="w-14 h-14 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-slate-400 hover:text-blue-600 hover:scale-110 transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </Link>
        <div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter">{product.name} 🎯</h1>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mt-1">Detailed Olfactory Specifications</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
        {/* Fragrance Pyramid Section */}
        <div className="space-y-10">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
             Fragrance Pyramid 🧬
          </h2>
          
          <div className="space-y-6">
            <div className="group bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:border-blue-100 transition-all duration-500 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                  <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L15 8l6 3-6 3-3 6-3-6-6-3 6-3 3-6z"/></svg>
               </div>
               <div className="relative z-10 space-y-8">
                 <div className="space-y-4">
                   <div className="flex items-center gap-3">
                     <span className="text-2xl">🌿</span>
                     <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter">Top Notes</h3>
                   </div>
                   <div className="flex flex-wrap gap-3">
                     {specs.topNotes.map(note => (
                       <span key={note} className="px-5 py-2.5 bg-slate-50 text-slate-600 rounded-2xl text-sm font-bold border border-white group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                         {note}
                       </span>
                     ))}
                   </div>
                 </div>

                 <div className="space-y-4">
                   <div className="flex items-center gap-3">
                     <span className="text-2xl">🌸</span>
                     <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter">Middle Notes</h3>
                   </div>
                   <div className="flex flex-wrap gap-3">
                     {specs.middleNotes.map(note => (
                       <span key={note} className="px-5 py-2.5 bg-slate-50 text-slate-600 rounded-2xl text-sm font-bold border border-white group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                         {note}
                       </span>
                     ))}
                   </div>
                 </div>

                 <div className="space-y-4">
                   <div className="flex items-center gap-3">
                     <span className="text-2xl">🌲</span>
                     <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter">Base Notes</h3>
                   </div>
                   <div className="flex flex-wrap gap-3">
                     {specs.baseNotes.map(note => (
                       <span key={note} className="px-5 py-2.5 bg-slate-50 text-slate-600 rounded-2xl text-sm font-bold border border-white group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                         {note}
                       </span>
                     ))}
                   </div>
                 </div>
               </div>
            </div>
          </div>
        </div>

        {/* Longevity & Sillage Section */}
        <div className="space-y-16">
          <div className="space-y-10">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
               Longevity & Sillage ⏳
            </h2>
            <div className="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-sm space-y-12">
               <div className="space-y-5">
                 <div className="flex justify-between items-end">
                   <div>
                     <p className="text-2xl font-black text-slate-900 tracking-tighter">Longevity</p>
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Typical performance time</p>
                   </div>
                   <span className="text-blue-600 font-black text-2xl">{specs.longevity}%</span>
                 </div>
                 <div className="h-4 bg-slate-50 rounded-full overflow-hidden border border-slate-100 shadow-inner p-0.5">
                   <div className="h-full bg-blue-600 rounded-full shadow-lg shadow-blue-200 transition-all duration-1000" style={{ width: `${specs.longevity}%` }}></div>
                 </div>
                 <p className="text-[10px] font-bold text-slate-400 text-center uppercase tracking-widest">Estimated: {Math.round(specs.longevity / 10)} - {Math.round(specs.longevity / 10) + 2} Hours</p>
               </div>

               <div className="space-y-5">
                 <div className="flex justify-between items-end">
                   <div>
                     <p className="text-2xl font-black text-slate-900 tracking-tighter">Sillage</p>
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Projection & Trail Intensity</p>
                   </div>
                   <span className="text-blue-600 font-black text-2xl">{specs.sillage}</span>
                 </div>
                 <div className="h-4 bg-slate-50 rounded-full overflow-hidden border border-slate-100 shadow-inner p-0.5">
                   <div className="h-full bg-blue-600 rounded-full shadow-lg shadow-blue-200 transition-all duration-1000" style={{ width: specs.sillage === 'Strong' ? '95%' : specs.sillage === 'Moderate' ? '60%' : '30%' }}></div>
                 </div>
                 <p className="text-[10px] font-bold text-slate-400 text-center uppercase tracking-widest">{specs.sillage.toUpperCase()} PROJECTOR ✨</p>
               </div>
            </div>
          </div>

          {/* Mood & Occasion Section */}
          <div className="space-y-8">
             <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
               Mood & Occasion 🎭
            </h2>
            <div className="flex flex-wrap gap-4">
              {specs.occasions.map(occ => (
                <div key={occ} className="px-8 py-5 bg-blue-600 text-white font-black rounded-3xl shadow-xl shadow-blue-100 hover:scale-105 transition-all text-xl cursor-default">
                  {occ}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-50 rounded-[3rem] p-12 text-center border border-slate-100 group relative overflow-hidden shadow-inner">
            <p className="text-2xl font-black text-slate-900 tracking-tighter leading-tight italic relative z-10">
              “Your {product.name} scent will turn heads 💫”
            </p>
          </div>
        </div>
      </div>
      
      <div className="flex justify-center pt-20">
        <Link 
          to={`/product/${product.id}`}
          className="px-16 py-7 bg-blue-600 text-white font-black text-2xl rounded-[2.5rem] shadow-[0_20px_50px_rgba(37,99,235,0.3)] hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all flex items-center gap-4"
        >
          Back to Product
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
        </Link>
      </div>
    </div>
  );
};

export default PerfumeSpecs;

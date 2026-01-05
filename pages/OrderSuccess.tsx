
import React from 'react';
import { useParams, Link } from 'react-router-dom';

const OrderSuccess: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();

  return (
    <div className="max-w-3xl mx-auto px-4 py-32 text-center animate-in zoom-in fade-in duration-700">
      <div className="w-32 h-32 bg-green-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 border-2 border-green-100 shadow-xl shadow-green-100 relative">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-green-600"><path d="M20 6 9 17l-5-5"/></svg>
        <div className="absolute -top-4 -right-4 text-4xl animate-bounce delay-300">🎉</div>
      </div>
      
      <h1 className="text-6xl font-black text-slate-900 mb-6 tracking-tighter">Order Confirmed! 🎉</h1>
      <p className="text-slate-500 text-xl mb-8 font-medium">We've received your request. Our team will verify your details and ship your signature scent shortly.</p>
      
      <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-100 mb-12 inline-block">
        <span className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Reference ID</span>
        <span className="font-mono text-2xl font-black text-blue-600">{orderId}</span>
      </div>
      
      <div className="mb-16">
        <p className="text-blue-600 font-black text-2xl italic leading-tight">“A masterpiece is headed your way. 💫”</p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-6 justify-center">
        <Link to="/shop" className="px-14 py-6 bg-blue-600 text-white font-black rounded-3xl hover:bg-blue-700 transition-all shadow-2xl shadow-blue-100 active:scale-95 text-lg">
          Explore More Scents 🛍️
        </Link>
        <Link to="/" className="px-14 py-6 bg-white text-slate-900 font-black rounded-3xl border-2 border-slate-100 hover:bg-slate-50 transition-all active:scale-95 text-lg">
          Back to Home 🏠
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccess;

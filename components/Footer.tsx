
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 mt-20 relative z-10">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
          <div>
            <span className="text-xl font-bold text-blue-600">Scentsationz</span>
            <p className="mt-2 text-sm text-slate-500">Premium quality for the modern lifestyle. 💫</p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-8">
            <Link to="/" className="text-sm text-slate-600 hover:text-blue-600">Home</Link>
            <Link to="/shop" className="text-sm text-slate-600 hover:text-blue-600">Shop</Link>
            <Link to="/about" className="text-sm text-slate-600 hover:text-blue-600">About Us</Link>
            <Link to="/cart" className="text-sm text-slate-600 hover:text-blue-600">Cart</Link>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
            <p className="text-sm text-slate-400">&copy; 2026 Scentsationz Store. All rights reserved.</p>
            <Link to="/admin-login" className="text-[10px] text-slate-400 hover:text-blue-600 uppercase tracking-[0.2em] font-black transition-all hover:scale-105 active:scale-95 bg-white px-3 py-1.5 rounded-lg border border-slate-100 shadow-sm">
              Admin Access 🔐
            </Link>
          </div>
          <div className="flex gap-4 items-center">
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

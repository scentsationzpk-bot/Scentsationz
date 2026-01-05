
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getStoreDataSync } from '../storage';

const Header: React.FC = () => {
  const location = useLocation();
  const [cartCount, setCartCount] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Using sync helper for cart count
    const data = getStoreDataSync();
    const count = data.cart.reduce((acc, item) => acc + item.quantity, 0);
    setCartCount(count);
    setMobileMenuOpen(false);
  }, [location]);

  const NavLink = ({ to, label }: { to: string; label: string }) => (
    <Link 
      to={to} 
      className={`text-sm font-extrabold uppercase tracking-widest transition-all px-4 py-2 rounded-xl border-2 ${
        location.pathname === to 
          ? 'text-blue-600 border-blue-600 bg-blue-50' 
          : 'text-slate-600 border-transparent hover:border-slate-100 hover:bg-slate-50'
      }`}
    >
      {label}
    </Link>
  );

  return (
    <>
      <header className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg py-2' : 'bg-white border-b border-slate-100 py-4'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <span className="text-2xl sm:text-3xl font-black text-blue-600 tracking-tighter group-hover:scale-105 transition-transform">SCENTSATIONZ</span>
              <span className="w-2 h-2 bg-gold rounded-full animate-pulse hidden sm:block"></span>
            </Link>

            {/* Desktop Navigation - RESTORED */}
            <nav className="hidden lg:flex items-center gap-4">
              <NavLink to="/" label="Home" />
              <NavLink to="/shop" label="Shop" />
              <NavLink to="/specs" label="Scent Specs" />
              <NavLink to="/about" label="Our Story" />
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2 sm:gap-4">
              <Link to="/cart" className="relative p-3 text-slate-600 border-2 border-slate-50 rounded-xl hover:border-blue-600 hover:text-blue-600 transition-all group">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform">
                  <circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/>
                  <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-black text-white shadow ring-2 ring-white">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Mobile Menu Button */}
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-3 border-2 border-slate-50 rounded-xl text-slate-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  {mobileMenuOpen ? <path d="M18 6 6 18M6 6l12 12"/> : <path d="M4 12h16M4 6h16M4 18h16"/>}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-slate-100 p-4 animate-in slide-in-from-top duration-300">
            <nav className="flex flex-col gap-2">
              <Link to="/" className="p-4 font-black text-lg text-slate-900 border-2 border-slate-50 rounded-2xl active:bg-blue-50">HOME</Link>
              <Link to="/shop" className="p-4 font-black text-lg text-slate-900 border-2 border-slate-50 rounded-2xl active:bg-blue-50">SHOP</Link>
              <Link to="/specs" className="p-4 font-black text-lg text-slate-900 border-2 border-slate-50 rounded-2xl active:bg-blue-50">SCENT SPECS</Link>
              <Link to="/about" className="p-4 font-black text-lg text-slate-900 border-2 border-slate-50 rounded-2xl active:bg-blue-50">OUR STORY</Link>
            </nav>
          </div>
        )}
      </header>
      <div className="bg-blue-600 py-2 overflow-hidden">
        <div className="flex whitespace-nowrap animate-marquee">
          {[...Array(10)].map((_, i) => (
            <p key={i} className="text-[10px] font-black text-white uppercase tracking-[0.3em] px-8">
              Free Nationwide Delivery • Premium Fragrance Oils • 12+ Hour Longevity
            </p>
          ))}
        </div>
      </div>
    </>
  );
};

export default Header;

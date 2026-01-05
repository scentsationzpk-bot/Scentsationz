
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getStoreDataSync, removeFromCart, updateCartQuantity } from '../storage';
import { CartItem } from '../types';

const Cart: React.FC = () => {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    // Fetch cart items using sync helper
    setItems(getStoreDataSync().cart);
  }, []);

  const handleUpdateQty = (id: string, qty: number) => {
    updateCartQuantity(id, qty);
    setItems(getStoreDataSync().cart);
  };

  const handleRemove = (id: string) => {
    removeFromCart(id);
    setItems(getStoreDataSync().cart);
  };

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center animate-in fade-in duration-700">
        <div className="w-24 h-24 bg-blue-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
           <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-200"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
        </div>
        <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter">Your cart is empty 🛍️</h2>
        <p className="text-slate-500 mb-10 text-xl font-medium max-w-sm mx-auto">Discover our signature scents and find your perfect match today.</p>
        <Link to="/shop" className="inline-flex items-center px-10 py-5 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 active:scale-95">
          Start Shopping 🛒
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-end gap-4 mb-12">
        <h1 className="text-5xl font-black text-slate-900 tracking-tighter">Shopping Cart</h1>
        <span className="text-2xl">🛍️</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        <div className="lg:col-span-2 space-y-8">
          {items.map((item) => (
            <div key={item.id} className="group flex flex-col sm:flex-row gap-8 p-8 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all duration-500">
              <div className="w-32 h-32 bg-slate-50 rounded-[1.5rem] flex items-center justify-center flex-shrink-0 mx-auto sm:mx-0 group-hover:bg-blue-50 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-300 group-hover:text-blue-200 group-hover:scale-110 transition-all">
                  <path d="M12 2l3 6 6 3-6 3-3 6-3-6-6-3 6-3 3-6z"/>
                </svg>
              </div>
              <div className="flex-grow flex flex-col sm:flex-row justify-between gap-6 text-center sm:text-left">
                <div>
                  <h3 className="font-bold text-2xl text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">{item.name}</h3>
                  <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-3">{item.category}</p>
                  <p className="text-blue-600 font-black text-xl mb-4">Rs. {item.price.toLocaleString()}</p>
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="text-sm font-bold text-red-400 hover:text-red-600 transition-colors flex items-center justify-center sm:justify-start gap-2 group/btn"
                  >
                    <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center group-hover/btn:bg-red-100 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                    </div>
                    Remove Item
                  </button>
                </div>
                <div className="flex items-center justify-center gap-2 h-fit self-center bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                  <button
                    onClick={() => handleUpdateQty(item.id, item.quantity - 1)}
                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-white shadow-sm hover:text-blue-600 hover:shadow-md transition-all active:scale-90"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/></svg>
                  </button>
                  <span className="w-10 text-center font-black text-xl text-slate-900">{item.quantity}</span>
                  <button
                    onClick={() => handleUpdateQty(item.id, item.quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-white shadow-sm hover:text-blue-600 hover:shadow-md transition-all active:scale-90"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white p-10 rounded-[3rem] border border-slate-100 h-fit shadow-2xl shadow-blue-50 sticky top-32">
          <h3 className="text-2xl font-black text-slate-900 mb-8 tracking-tighter">Order Summary</h3>
          <div className="space-y-6 mb-10">
            <div className="flex justify-between text-slate-500 font-bold">
              <span>Subtotal</span>
              <span>Rs. {subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-slate-500 font-bold">
              <span>Shipping</span>
              <span className="text-green-600 bg-green-50 px-3 py-1 rounded-full text-xs font-black">FREE 🚚</span>
            </div>
            <div className="pt-6 border-t border-slate-100 flex justify-between text-2xl font-black text-slate-900 tracking-tighter">
              <span>Total 💰</span>
              <span className="text-blue-600">Rs. {subtotal.toLocaleString()}</span>
            </div>
          </div>
          <Link
            to="/checkout"
            className="w-full inline-flex items-center justify-center py-6 bg-blue-600 text-white font-bold text-xl rounded-2xl hover:bg-blue-700 transition-all shadow-2xl shadow-blue-100 active:scale-95 mb-6"
          >
            Checkout Now 🚀
          </Link>
          <div className="bg-slate-50 rounded-2xl p-6 text-center">
             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">Secure transaction with local persistence. Free delivery on all orders! 💫</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

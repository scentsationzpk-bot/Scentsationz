
import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { getStoreDataSync, addOrder } from '../storage';
import { useToast } from '../App';

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [data, setData] = useState(getStoreDataSync());
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: '',
    address: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setData(getStoreDataSync());
  }, []);

  if (data.cart.length === 0) {
    return <Navigate to="/shop" />;
  }

  const subtotal = data.cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return; // Guard for double clicks

    if (!formData.name || !formData.phone || !formData.address) {
      showToast('Coordinates required! ⚠️', 'error');
      return;
    }

    setLoading(true);
    
    try {
      const orderPayload = {
        customer: {
          name: formData.name,
          phone: formData.phone,
          city: formData.city,
          address: formData.address,
          paymentMethod: 'Cash on Delivery' as const
        },
        items: data.cart,
        total: subtotal,
        status: 'Pending' as const
      };

      const orderId = await addOrder(orderPayload);
      showToast('Order Vaulted! 🎉', 'success');
      navigate(`/order-success/${orderId}`);
    } catch (error) {
      console.error("Checkout Error:", error);
      showToast('Sync Failed. Retry. ❌', 'error');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 animate-in fade-in slide-in-from-bottom-4 duration-700 bg-white min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-8">
        <div>
          <h1 className="text-6xl md:text-[8rem] font-black text-slate-900 tracking-tighter leading-none">Checkout</h1>
          <p className="text-slate-500 mt-4 md:text-3xl font-medium">Finalize your selection. Cloud verified. 💫</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-32">
        <div className="bg-white p-10 md:p-20 rounded-[3.5rem] md:rounded-[6rem] border-[6px] md:border-[12px] border-slate-50 shadow-4xl h-fit">
          <form onSubmit={handleSubmit} className="space-y-12">
            <div className="space-y-10">
              <div className="space-y-4">
                <label className="text-[10px] md:text-xl font-black uppercase tracking-widest text-slate-400 ml-4">Legal Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))} className="w-full px-10 py-6 md:py-10 rounded-[2.5rem] border-4 border-slate-50 bg-slate-50 focus:bg-white focus:border-blue-600 transition-all font-black text-xl md:text-4xl outline-none" placeholder="Enter Full Name" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <label className="text-[10px] md:text-xl font-black uppercase tracking-widest text-slate-400 ml-4">Phone</label>
                  <input required type="tel" value={formData.phone} onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))} className="w-full px-10 py-6 md:py-10 rounded-[2.5rem] border-4 border-slate-50 bg-slate-50 focus:bg-white focus:border-blue-600 transition-all font-black text-xl md:text-4xl outline-none" placeholder="03XX XXXXXXX" />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] md:text-xl font-black uppercase tracking-widest text-slate-400 ml-4">City</label>
                  <input required type="text" value={formData.city} onChange={e => setFormData(prev => ({ ...prev, city: e.target.value }))} className="w-full px-10 py-6 md:py-10 rounded-[2.5rem] border-4 border-slate-50 bg-slate-50 focus:bg-white focus:border-blue-600 transition-all font-black text-xl md:text-4xl outline-none" placeholder="Your City" />
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] md:text-xl font-black uppercase tracking-widest text-slate-400 ml-4">Address</label>
                <textarea required value={formData.address} onChange={e => setFormData(prev => ({ ...prev, address: e.target.value }))} className="w-full px-10 py-6 md:py-10 rounded-[2.5rem] border-4 border-slate-50 bg-slate-50 focus:bg-white focus:border-blue-600 transition-all font-black text-xl md:text-4xl outline-none h-48 md:h-80 resize-none" placeholder="Delivery coordinates..."></textarea>
              </div>

              <div className="p-8 md:p-14 rounded-[3rem] border-[6px] md:border-[12px] border-blue-600 bg-blue-50 text-blue-600 flex items-center gap-8">
                <div className="flex flex-col">
                  <div className="flex items-center gap-4">
                    <span className="text-4xl md:text-6xl">🚚</span>
                    <p className="font-black text-xl md:text-6xl tracking-tighter leading-none">Cash on Delivery</p>
                  </div>
                  <div className="flex items-center gap-2 mt-4 bg-white/50 px-4 py-2 rounded-xl border border-blue-200 w-fit">
                    <span className="text-green-600 font-black text-[10px] uppercase tracking-widest">Free Shipping Included</span>
                  </div>
                </div>
              </div>
            </div>
            
            <button 
              type="submit"
              disabled={loading} 
              className="w-full py-10 md:py-24 bg-blue-600 text-white font-black text-4xl md:text-[10rem] rounded-[4rem] md:rounded-[8rem] shadow-5xl border-b-[16px] md:border-b-[40px] border-blue-800 active:border-b-0 active:translate-y-6 transition-all uppercase tracking-tighter leading-none disabled:opacity-50 disabled:cursor-not-allowed disabled:active:translate-y-0"
            >
              {loading ? 'Vaulting...' : 'Place Order 🔥'}
            </button>
          </form>
        </div>

        <div className="space-y-12">
          <div className="bg-white p-12 md:p-20 rounded-[4rem] md:rounded-[8rem] border-[8px] md:border-[16px] border-slate-50 shadow-4xl">
            <h3 className="text-4xl md:text-[8rem] font-black text-slate-900 mb-12 tracking-tighter">Your Haul</h3>
            <div className="space-y-8 mb-12">
              {data.cart.map((item) => (
                <div key={item.id} className="flex justify-between items-center group bg-slate-50 p-6 rounded-[2rem] border-4 border-white">
                  <div>
                    <span className="font-black text-slate-800 block text-2xl md:text-5xl leading-none">{item.name} x {item.quantity}</span>
                    <span className="text-blue-600 font-black text-sm uppercase tracking-widest mt-2 block">{item.category}</span>
                  </div>
                  <span className="text-slate-900 font-black text-2xl md:text-5xl">Rs. {(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
            
            <div className="pt-12 border-t-[8px] border-slate-50 space-y-8">
              <div className="flex justify-between text-5xl md:text-[12rem] font-black text-slate-900 tracking-tighter leading-none">
                <span className="uppercase">Total</span>
                <span className="text-blue-600">Rs. {subtotal.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

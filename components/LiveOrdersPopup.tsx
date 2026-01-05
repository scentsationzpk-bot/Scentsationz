
import React, { useState, useEffect } from 'react';

const mockOrders = [
  { name: 'Ali', city: 'Lahore', product: 'Starborn 💫' },
  { name: 'Hassan', city: 'Karachi', product: 'Cool Current 🌊' },
  { name: 'Usman', city: 'Islamabad', product: 'Tobacco Trail 🚬' },
  { name: 'Ahmed', city: 'Faisalabad', product: 'Golden Pulse 💰' },
  { name: 'Hamza', city: 'Sialkot', product: 'Starborn 💫' },
  { name: 'Zain', city: 'Rawalpindi', product: 'Cool Current 🌊' },
  { name: 'Irfan', city: 'Multan', product: 'Golden Pulse 💰' },
];

const LiveOrdersPopup: React.FC = () => {
  const [currentOrder, setCurrentOrder] = useState<typeof mockOrders[0] | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const showRandomOrder = () => {
      const order = mockOrders[Math.floor(Math.random() * mockOrders.length)];
      setCurrentOrder(order);
      setVisible(true);

      setTimeout(() => {
        setVisible(false);
      }, 5000);
    };

    const interval = setInterval(() => {
      showRandomOrder();
    }, 25000 + Math.random() * 20000); 

    const initialTimeout = setTimeout(showRandomOrder, 15000);

    return () => {
      clearInterval(interval);
      clearTimeout(initialTimeout);
    };
  }, []);

  if (!currentOrder) return null;

  return (
    <div className={`fixed bottom-24 left-4 sm:left-10 z-[100] transition-all duration-1000 transform ${
      visible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-20 opacity-0 scale-90 pointer-events-none'
    }`}>
      <div className="bg-white/95 backdrop-blur-2xl p-6 rounded-[2rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] flex items-center gap-5 max-w-xs sm:max-w-sm border-2 border-slate-50 animate-in fade-in slide-in-from-left duration-500">
        <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 border-2 border-white shadow-inner">
          📦
        </div>
        <div className="flex-grow">
          <p className="text-sm font-black text-slate-800 tracking-tight leading-none">
            {currentOrder.name} from {currentOrder.city}
          </p>
          <p className="text-[11px] font-bold text-slate-500 mt-1.5 leading-tight">
            Ordered <span className="text-blue-600 font-black">{currentOrder.product}</span>
          </p>
          <div className="flex items-center gap-2 mt-3">
            <span className="flex h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.6)]"></span>
            <span className="text-[9px] text-green-600 font-black uppercase tracking-widest">Just Now ● Live Activity</span>
          </div>
        </div>
        <button onClick={() => setVisible(false)} className="text-slate-300 hover:text-slate-900 p-1.5 hover:bg-slate-50 rounded-lg transition-all">
           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
      </div>
    </div>
  );
};

export default LiveOrdersPopup;


import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getProductById } from '../storage';

const WhatsAppWidget: React.FC = () => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [message, setMessage] = useState("Hello! I want to know more about your perfumes 💫");
  const location = useLocation();
  const number = "+923700162012";

  useEffect(() => {
    // Fetch product details for the current page to customize WhatsApp message
    const fetchProductDetails = async () => {
      const pathParts = location.pathname.split('/');
      if (pathParts[1] === 'product' && pathParts[2]) {
        try {
          const product = await getProductById(pathParts[2]);
          if (product) {
            setMessage(`Hi, I want to know more about ${product.name} 💫`);
          }
        } catch (error) {
          console.error("Failed to fetch product for WhatsApp widget:", error);
        }
      } else {
        setMessage("Hello! I want to know more about your perfumes 💫");
      }
    };
    
    fetchProductDetails();
  }, [location]);

  const url = `https://wa.me/${number.replace('+', '')}?text=${encodeURIComponent(message)}`;

  return (
    <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end gap-3 group">
      <div className={`bg-white px-6 py-4 rounded-[1.5rem] shadow-2xl border border-slate-100 transition-all duration-300 transform ${showTooltip ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-90 pointer-events-none'}`}>
         <div className="flex flex-col gap-1">
           <p className="text-sm font-black text-slate-800 flex items-center gap-2 whitespace-nowrap">
             Chat with us! 💬
             <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
             <span className="text-green-500 text-[10px] uppercase tracking-widest font-black">Online</span>
           </p>
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Typical response: 10 mins</p>
         </div>
      </div>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="w-16 h-16 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 relative overflow-hidden group/btn"
        aria-label="Chat on WhatsApp"
      >
        <div className="absolute inset-0 bg-white opacity-0 group-hover/btn:opacity-10 transition-opacity"></div>
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor" className="group-hover/btn:rotate-12 transition-transform">
          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766 0-3.18-2.587-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.747-2.874-2.512-2.96-2.626-.087-.115-.708-.941-.708-1.792 0-.85.441-1.269.598-1.447.157-.179.346-.224.462-.224.115 0 .231.001.33.006.102.005.24.039.367.346.127.307.435 1.059.473 1.136.038.077.063.167.012.27-.051.103-.077.167-.154.257-.077.09-.161.201-.231.27-.077.077-.158.161-.068.315.09.154.401.662.861 1.071.592.527 1.089.691 1.243.768.154.077.244.064.334-.039.09-.103.385-.449.487-.603.103-.154.205-.128.346-.077.141.051.897.423 1.052.5.154.077.256.115.295.179.039.064.039.372-.105.777z"/>
        </svg>
      </a>
    </div>
  );
};

export default WhatsAppWidget;

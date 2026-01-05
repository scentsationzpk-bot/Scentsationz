
import React, { useEffect } from 'react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error';
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-8 right-8 z-[100] animate-in slide-in-from-right-8 fade-in duration-300">
      <div className={`flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border ${
        type === 'success' ? 'bg-white border-blue-100' : 'bg-red-50 border-red-100'
      }`}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
          type === 'success' ? 'bg-blue-50 text-blue-600' : 'bg-red-100 text-red-600'
        }`}>
          {type === 'success' ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m18 6-12 12"/><path d="m6 6 12 12"/></svg>
          )}
        </div>
        <p className={`font-bold text-sm ${type === 'success' ? 'text-slate-900' : 'text-red-700'}`}>{message}</p>
      </div>
    </div>
  );
};

export default Toast;

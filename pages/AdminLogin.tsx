
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStoreDataSync, updateAdminStatus } from '../storage';
import { useToast } from '../App';

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [key, setKey] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    // Using sync helper for admin credentials
    const data = getStoreDataSync();
    if (key === data.admin.key) {
      updateAdminStatus(true);
      showToast('Welcome back, Admin! 🚀', 'success');
      navigate('/admin');
    } else {
      showToast('Incorrect Key ❌', 'error');
      setKey('');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white p-10 rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-100">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-blue-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-inner">
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Admin Access</h1>
          <p className="text-slate-500 mt-2 font-medium">Enter your secure key to continue</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-3 ml-1">Secure Key</label>
            <input
              autoFocus
              type="password"
              value={key}
              onChange={e => setKey(e.target.value)}
              placeholder="••••••••••••"
              disabled={loading}
              className="w-full px-6 py-5 rounded-2xl border-2 border-slate-50 bg-slate-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 transition-all text-center tracking-widest font-black text-xl disabled:opacity-50"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Verifying...' : 'Enter Dashboard 🚀'}
          </button>
        </form>
        
        <div className="mt-10 pt-8 border-t border-slate-50 text-center">
          <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest leading-relaxed">
            Hint: Key is <span className="text-blue-200">Khazina123</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;


import React, { useState, useEffect } from 'react';
import { getOrders, updateOrderStatus, deleteOrder } from '../storage';
import { Order } from '../types';
import { useToast } from '../App';

const AdminOrders: React.FC = () => {
  const { showToast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    refreshOrders();
  }, []);

  const refreshOrders = async () => {
    setLoading(true);
    try {
      const liveOrders = await getOrders();
      setOrders(liveOrders);
    } catch (e) {
      showToast('Registry sync failed ❌', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: string, status: Order['status']) => {
    try {
      await updateOrderStatus(orderId, status);
      showToast(`Status updated: ${status} ✨`, 'success');
      refreshOrders();
      if (selectedOrder?.orderId === orderId) {
        setSelectedOrder(prev => prev ? { ...prev, status } : null);
      }
    } catch (e) {
      showToast('Update failed ❌', 'error');
    }
  };

  const handleDelete = async (orderId: string) => {
    if (window.confirm('Wipe this record from the Cloud Registry?')) {
      try {
        await deleteOrder(orderId);
        showToast('Record erased 🗑️', 'success');
        refreshOrders();
        if (selectedOrder?.orderId === orderId) setSelectedOrder(null);
      } catch (e) {
        showToast('Erasure failed ❌', 'error');
      }
    }
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest">Accessing Secure Registry...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase">Registry Ledger</h1>
          <p className="text-slate-500 mt-1 font-bold uppercase tracking-widest text-xs">Verified cloud transaction history.</p>
        </div>
        <button onClick={refreshOrders} className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-slate-100 rounded-xl hover:bg-slate-50 transition-all font-black text-[10px] uppercase tracking-widest">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M3 21v-5h5"/></svg>
          Sync Now
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white p-20 text-center rounded-[3rem] border-4 border-dashed border-slate-50">
           <p className="text-slate-400 font-black uppercase tracking-widest text-xs">The Ledger is Empty 🛍️</p>
        </div>
      ) : (
        <div className="bg-white rounded-[3rem] border-4 border-slate-50 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[900px]">
              <thead className="bg-slate-50/50 border-b-4 border-slate-50">
                <tr>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Reference</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Recipient</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Value</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 text-right uppercase tracking-[0.2em]">Access</th>
                </tr>
              </thead>
              <tbody className="divide-y-4 divide-slate-50">
                {orders.map((order) => (
                  <tr key={order.orderId} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="font-black text-blue-600">#{order.orderId.slice(-6).toUpperCase()}</div>
                      <div className="text-[10px] text-slate-400 font-black mt-1 uppercase tracking-widest">
                        {order.date ? new Date(order.date).toLocaleDateString() : 'Pending Sync'}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="font-black text-slate-900 uppercase tracking-tight">{order.customer?.name || 'Unknown'}</div>
                      <div className="text-[10px] text-slate-400 font-black mt-0.5 uppercase tracking-widest">{order.customer?.phone}</div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="font-black text-slate-900">Rs. {Number(order.total).toLocaleString()}</span>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border-2 ${
                        order.status === 'Completed' ? 'bg-green-50 text-green-700 border-green-100' :
                        order.status === 'Cancelled' ? 'bg-red-50 text-red-700 border-red-100' :
                        'bg-orange-50 text-orange-700 border-orange-100 animate-pulse'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="px-6 py-3 bg-slate-900 text-white text-[10px] font-black rounded-xl hover:bg-blue-600 transition-all uppercase tracking-widest"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedOrder && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-[4rem] shadow-3xl overflow-hidden animate-in zoom-in duration-300 flex flex-col max-h-[90vh] border-[8px] border-white/20">
            <div className="p-10 border-b-4 border-slate-50 flex justify-between items-center bg-slate-50/50">
              <div>
                <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none">Order Data</h3>
                <p className="text-[10px] font-black text-slate-400 mt-2 uppercase tracking-widest">UID: {selectedOrder.orderId}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="w-14 h-14 rounded-full bg-white border-4 border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>

            <div className="p-10 overflow-y-auto space-y-10">
               <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Customer Details</p>
                    <p className="text-xl font-black text-slate-900">{selectedOrder.customer.name}</p>
                    <p className="text-sm font-bold text-slate-500">{selectedOrder.customer.phone}</p>
                    <p className="text-xs font-medium text-slate-500 mt-2">{selectedOrder.customer.address}</p>
                  </div>
                  <div className="space-y-2 text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Payment Method</p>
                    <p className="text-lg font-black text-blue-600">{selectedOrder.customer.paymentMethod}</p>
                    <p className="text-4xl font-black text-slate-900 mt-4">Rs. {selectedOrder.total.toLocaleString()}</p>
                  </div>
               </div>

               <div className="space-y-4">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Items Purchased</p>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border-2 border-white">
                        <span className="font-black text-slate-800">{item.name} <span className="text-blue-600">x{item.quantity}</span></span>
                        <span className="font-black text-slate-900">Rs. {(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
               </div>

               <div className="pt-8 border-t-2 border-slate-50 space-y-4">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Update Lifecycle Status</p>
                  <div className="grid grid-cols-3 gap-4">
                    {(['Pending', 'Completed', 'Cancelled'] as Order['status'][]).map(status => (
                      <button
                        key={status}
                        onClick={() => handleStatusChange(selectedOrder.orderId, status)}
                        className={`py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all border-2 ${
                          selectedOrder.status === status
                          ? 'bg-blue-600 border-blue-600 text-white shadow-xl'
                          : 'bg-white border-slate-100 text-slate-400 hover:border-blue-200 hover:text-blue-600'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
               </div>
            </div>

            <div className="p-8 bg-slate-50 border-t-4 border-slate-100 flex gap-4">
               <button 
                 onClick={() => handleDelete(selectedOrder.orderId)}
                 className="flex-grow py-5 bg-white border-2 border-red-100 text-red-500 font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
               >
                 Erase Record 🗑️
               </button>
               <button 
                 onClick={() => setSelectedOrder(null)}
                 className="px-10 py-5 bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-blue-600 transition-all shadow-xl"
               >
                 Close Data View
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;

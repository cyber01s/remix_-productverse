import React from 'react';
import { BarChart, Users, Package, ShoppingCart, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';

export const AdminDashboard = () => {
  const stats = [
    { label: 'Total Clicks', value: '42,904', change: '+12%', icon: BarChart, color: 'text-blue-600' },
    { label: 'Conversions', value: '1,204', change: '+8%', icon: ShoppingCart, color: 'text-emerald-600' },
    { label: 'Total Commissions', value: '$12,402', change: '+15%', icon: TrendingUp, color: 'text-indigo-600' },
    { label: 'EPC (Last 30d)', value: '$0.29', change: '-2%', icon: AlertCircle, color: 'text-orange-600' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-12">
        <h1 className="text-3xl font-bold text-gray-900">Admin Command Center</h1>
        <div className="flex gap-4">
          <button className="bg-white border border-gray-200 px-4 py-2 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors">
            Export Report
          </button>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-indigo-100 transition-all active:scale-95">
            Sync Impact.com
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
             <div className="flex items-center justify-between mb-4">
               <div className={`p-3 rounded-2xl bg-gray-50 ${stat.color}`}>
                 <stat.icon size={20} />
               </div>
               <span className={`text-xs font-bold ${stat.change.startsWith('+') ? 'text-emerald-500' : 'text-red-500'}`}>
                 {stat.change}
               </span>
             </div>
             <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">{stat.label}</p>
             <h3 className="text-2xl font-black text-gray-900">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-[40px] border border-gray-100 p-8 shadow-sm">
           <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
             <Package size={20} className="text-indigo-600" />
             Recent Conversions
           </h3>
           <div className="space-y-4">
              {[
                { product: 'MacBook Air M4', commission: '$49.95', date: '2 min ago', status: 'Completed' },
                { product: 'Sony WH-1000XM5', commission: '$12.40', date: '14 min ago', status: 'Pending' },
                { product: 'iPad Pro 11"', commission: '$32.10', date: '1 hour ago', status: 'Completed' },
              ].map((conv, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 font-bold text-xs uppercase">
                       ID
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-gray-900">{conv.product}</h4>
                      <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mt-0.5">{conv.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="block font-black text-emerald-600">{conv.commission}</span>
                    <span className={`text-[10px] font-bold uppercase tracking-tighter ${conv.status === 'Completed' ? 'text-blue-500' : 'text-orange-500'}`}>
                      {conv.status}
                    </span>
                  </div>
                </div>
              ))}
           </div>
        </div>

        <div className="bg-white rounded-[40px] border border-gray-100 p-8 shadow-sm">
           <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
             <Users size={20} className="text-indigo-600" />
             Review Moderation
           </h3>
           <div className="space-y-6">
              {[
                { user: 'John D.', rating: 5, comment: 'Simply amazing performance...', time: '1h ago' },
                { user: 'Mike S.', rating: 2, comment: 'Shipping was delayed by 3 days...', time: '4h ago' },
              ].map((mod, i) => (
                <div key={i} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm">{mod.user}</span>
                    <span className="text-[10px] text-gray-400 font-bold italic">{mod.time}</span>
                  </div>
                  <p className="text-xs text-gray-500 italic">"{mod.comment}"</p>
                  <div className="flex gap-2">
                    <button className="flex-1 bg-emerald-50 text-emerald-600 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-100 transition-colors flex items-center justify-center gap-1">
                      <CheckCircle size={12} /> Approve
                    </button>
                    <button className="flex-1 bg-red-50 text-red-600 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-100 transition-colors">
                      Reject
                    </button>
                  </div>
                </div>
              ))}
              <button className="w-full text-center text-xs font-bold text-indigo-600 hover:underline pt-4 block">
                 View all pending (42)
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

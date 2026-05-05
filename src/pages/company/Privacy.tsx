import React from 'react';
import { motion } from 'motion/react';
import { Shield, Eye, Lock, FileText } from 'lucide-react';

export const Privacy = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-20">
      <div className="container mx-auto px-6 max-w-4xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <div className="bg-indigo-600 w-16 h-16 rounded-3xl flex items-center justify-center text-white mx-auto mb-8 shadow-2xl shadow-indigo-200">
             <Shield size={32} />
          </div>
          <h1 className="text-6xl font-black text-gray-900 tracking-tighter leading-none mb-6">Privacy <span className="text-indigo-600 italic">Protocols.</span></h1>
          <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-xs">Last Updated: May 2026 | Part of NewForTech Network</p>
        </motion.div>

        <div className="bg-white rounded-[50px] p-8 md:p-16 border border-gray-100 shadow-sm space-y-12">
           <section>
              <h2 className="text-2xl font-black italic tracking-tighter mb-4 flex items-center gap-3">
                 <Eye size={24} className="text-indigo-600" /> Data Collection Philosophy
              </h2>
              <p className="text-gray-600 leading-relaxed font-medium">
                At ProductVerse (a member of the newfortech.com group), we treat your data with architectural precision. We primarily collect usage patterns to optimize the Discovery Engine. This includes device vectors, interaction times, and category pathing. We do NOT sell individual PII to third parties.
              </p>
           </section>

           <section className="bg-gray-50 rounded-3xl p-8 border border-dashed border-gray-200">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-indigo-600 mb-6">Operational Cookies</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="flex gap-4">
                    <div className="bg-white p-3 rounded-xl h-fit shadow-sm"><Lock size={18} className="text-gray-400" /></div>
                    <div>
                       <h4 className="font-bold text-sm mb-1 uppercase tracking-tight">Security Vector</h4>
                       <p className="text-xs text-gray-400 font-medium tracking-tight">Ensures session integrity and prevents automated scraping.</p>
                    </div>
                 </div>
                 <div className="flex gap-4">
                    <div className="bg-white p-3 rounded-xl h-fit shadow-sm"><FileText size={18} className="text-gray-400" /></div>
                    <div>
                       <h4 className="font-bold text-sm mb-1 uppercase tracking-tight">Analytics Mesh</h4>
                       <p className="text-xs text-gray-400 font-medium tracking-tight">Anonymized tracking for feature performance analysis.</p>
                    </div>
                 </div>
              </div>
           </section>

           <section className="space-y-6">
              <h2 className="text-2xl font-black italic tracking-tighter mb-4">Affiliate & Third Party Transmission</h2>
              <p className="text-gray-600 leading-relaxed font-medium">
                When you click "Buy Now" or "Get Asset", you are redirected to our partner networks (Impact.com). These networks place tracking cookies to verify that the traffic originated from our network. For more information, please see <a href="https://newfortech.com/legal" className="text-indigo-600 underline">newfortech.com/legal</a>.
              </p>
           </section>

           <section className="pt-8 border-t border-gray-100">
              <h2 className="text-2xl font-black italic tracking-tighter mb-4">Rights & Portability</h2>
              <p className="text-gray-600 leading-relaxed font-medium mb-8">
                You have the right to request a full dump of all vectorized data associated with your IP address or authenticated session.
              </p>
              <button className="bg-gray-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-600 transition-colors">
                Request Data Snapshot
              </button>
           </section>
        </div>

        <div className="mt-12 text-center text-gray-400">
           <p className="text-[10px] font-black uppercase tracking-[0.2em]">© 2026 ProductVerse by newfortech.com | All Rights Reserved</p>
        </div>
      </div>
    </div>
  );
};

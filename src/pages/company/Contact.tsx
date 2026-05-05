import React from 'react';
import { motion } from 'motion/react';
import { Mail, MapPin, Phone, MessageSquare, Send } from 'lucide-react';

export const Contact = () => {
  return (
    <div className="min-h-screen bg-white pt-32 pb-20">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <span className="bg-indigo-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-[0.2em] italic mb-6 inline-block">
              Communication Matrix
            </span>
            <h1 className="text-6xl md:text-8xl font-black text-gray-900 tracking-tighter leading-[0.9] mb-12">
              Sync with our <span className="text-indigo-600 italic">Network.</span>
            </h1>
            
            <div className="space-y-12">
               <div className="flex gap-6">
                  <div className="bg-gray-900 p-4 rounded-2xl text-white h-fit">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Electronic Mail</h4>
                    <p className="text-xl font-bold tracking-tight">vectors@newfortech.com</p>
                  </div>
               </div>

               <div className="flex gap-6">
                  <div className="bg-gray-900 p-4 rounded-2xl text-white h-fit">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Global HQ</h4>
                    <p className="text-xl font-bold tracking-tight">1200 Innovation Vector,<br/>Silicon Corridor, CA 94025</p>
                  </div>
               </div>

               <div className="flex gap-6">
                  <div className="bg-gray-900 p-4 rounded-2xl text-white h-fit">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Direct Line</h4>
                    <p className="text-xl font-bold tracking-tight">+1 (555) PV-MATRIX</p>
                  </div>
               </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-50 rounded-[50px] p-8 md:p-12 border border-gray-100"
          >
             <h2 className="text-3xl font-black italic tracking-tighter mb-8">Transmit Transmission</h2>
             <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Full Name</label>
                      <input type="text" className="w-full bg-white border border-transparent rounded-2xl p-4 text-sm font-bold focus:border-indigo-600 outline-none transition-all" placeholder="John Matrix" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Email Address</label>
                      <input type="email" className="w-full bg-white border border-transparent rounded-2xl p-4 text-sm font-bold focus:border-indigo-600 outline-none transition-all" placeholder="name@domain.com" />
                   </div>
                </div>
                
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Inquiry Sector</label>
                   <select className="w-full bg-white border border-transparent rounded-2xl p-4 text-sm font-bold focus:border-indigo-600 outline-none transition-all appearance-none">
                      <option>Advertising & Partnerships</option>
                      <option>Technical Support</option>
                      <option>Career Inquiry</option>
                      <option>General Transmission</option>
                   </select>
                </div>

                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">MESSAGE</label>
                   <textarea rows={4} className="w-full bg-white border border-transparent rounded-2xl p-4 text-sm font-bold focus:border-indigo-600 outline-none transition-all resize-none" placeholder="Enter transmission data..."></textarea>
                </div>

                <button className="w-full bg-indigo-600 text-white p-5 rounded-3xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-gray-900 transition-all flex items-center justify-center gap-3 active:scale-95">
                  Execute Transmission <Send size={16} />
                </button>
             </form>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

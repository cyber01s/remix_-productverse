import React from 'react';
import { motion } from 'motion/react';
import { Target, Zap, ShieldCheck, Globe } from 'lucide-react';

export const About = () => {
  return (
    <div className="min-h-screen bg-white pt-32 pb-20">
      <div className="container mx-auto px-6">
        {/* Hero Section */}
        <div className="max-w-4xl mb-24">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-6"
          >
            <span className="bg-indigo-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-[0.2em] italic">
              Legacy & Vision
            </span>
            <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Part of the NewForTech Network</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-black text-gray-900 tracking-tighter leading-[0.9] mb-12"
          >
            Architecting the future of <span className="text-indigo-600 tracking-[-0.05em] italic underline decoration-4 underline-offset-8">Discovery.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-2xl text-gray-500 font-medium leading-relaxed max-w-2xl italic"
          >
            ProductVerse is a specialized high-performance search engine built to decode the technical complexity of modern consumer assets. 
          </motion.p>
        </div>

        {/* Brand Connection */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="bg-gray-900 rounded-[50px] p-12 md:p-20 text-white relative overflow-hidden mb-32"
        >
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
             <div>
                <h3 className="text-4xl font-black italic tracking-tighter mb-6">A <span className="text-indigo-400">newfortech.com</span> Initiative</h3>
                <p className="text-gray-400 text-lg leading-relaxed mb-8">
                  As part of the NewForTech ecosystem, ProductVerse leverages global logistics data and proprietary AI models to provide an unfiltered, technical perspective on products. We don't just review; we analyze vectors of performance, value, and engineering integrity.
                </p>
                <div className="flex gap-4">
                   <div className="flex flex-col">
                      <span className="text-3xl font-black tracking-tighter">12k+</span>
                      <span className="text-[10px] uppercase tracking-widest text-indigo-400 font-bold">Assets Analyzed</span>
                   </div>
                   <div className="w-px h-12 bg-white/10 mx-4"></div>
                   <div className="flex flex-col">
                      <span className="text-3xl font-black tracking-tighter">98.4%</span>
                      <span className="text-[10px] uppercase tracking-widest text-indigo-400 font-bold">Vector Accuracy</span>
                   </div>
                </div>
             </div>
             <div className="grid grid-cols-2 gap-4">
                {[Zap, Globe, Target, ShieldCheck].map((Icon, i) => (
                  <div key={i} className="aspect-square bg-white/5 rounded-3xl flex items-center justify-center border border-white/10 hover:bg-white/10 transition-all">
                    <Icon size={48} className="text-indigo-400" />
                  </div>
                ))}
             </div>
          </div>
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-indigo-600/20 blur-[120px] rounded-full"></div>
        </motion.div>

        {/* Mission Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
           {[
             { title: "Neutral Objectivity", desc: "Our algorithms are isolated from manufacturer influence. We represent the consumer interest through hard data." },
             { title: "Technical Depth", desc: "We go beyond 'unboxing'. We evaluate materials, firmware updates, and long-term sustainability scores." },
             { title: "Speed of Discovery", desc: "Tiktok-style feed logic means you find your perfect product vector in seconds, not hours of reading." }
           ].map((item, i) => (
             <motion.div 
               key={i}
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: i * 0.1 }}
               className="p-8 border border-gray-100 rounded-[40px] hover:border-indigo-100 transition-colors"
             >
                <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-600 mb-4 italic">Core Pillar {i+1}</h4>
                <h3 className="text-2xl font-black text-gray-900 mb-4 tracking-tighter">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed font-medium">{item.desc}</p>
             </motion.div>
           ))}
        </div>
      </div>
    </div>
  );
};

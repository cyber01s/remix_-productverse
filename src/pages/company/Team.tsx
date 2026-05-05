import React from 'react';
import { motion } from 'motion/react';
import { Linkedin, Twitter, Globe, Github } from 'lucide-react';

const TEAM = [
  {
    name: "Alex Sterling",
    role: "Chief Architect",
    specialization: "Predictive Analytics",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop"
  },
  {
    name: "Sarah Vane",
    role: "Director of Integrity",
    specialization: "Material Science",
    img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop"
  },
  {
    name: "Marcus Chen",
    role: "Lead Engineer",
    specialization: "AI Vectoring",
    img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop"
  },
  {
    name: "Elena Rossi",
    role: "UX Strategy",
    specialization: "Discovery Logic",
    img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop"
  },
  {
    name: "David Park",
    role: "Data Infrastructure",
    specialization: "Cloud Matrix",
    img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop"
  },
  {
    name: "Maya Jones",
    role: "Communications",
    specialization: "Brand Logic",
    img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop"
  }
];

export const Team = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-20">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mb-20">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-6xl md:text-8xl font-black text-gray-900 tracking-tighter leading-none mb-8"
          >
            The <span className="text-indigo-600 italic">Architects.</span>
          </motion.h1>
          <p className="text-xl text-gray-500 font-medium max-w-xl italic">
            A collective of data scientists, material engineers, and designers unified by the NewForTech vision of technical transparency.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {TEAM.map((member, i) => (
             <motion.div 
               key={i}
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: i * 0.1 }}
               className="group bg-white rounded-[40px] overflow-hidden border border-gray-100 hover:border-indigo-200 transition-all hover:shadow-2xl hover:shadow-indigo-100/50"
             >
                <div className="aspect-square overflow-hidden relative">
                   <img 
                     src={member.img} 
                     alt={member.name} 
                     className="w-full h-full object-crop grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700" 
                   />
                   <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                   <div className="absolute bottom-6 right-6 flex gap-2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all delay-100">
                      <button className="bg-white/20 backdrop-blur-md p-2 rounded-xl text-white hover:bg-white hover:text-indigo-600 transition-colors">
                        <Twitter size={16} />
                      </button>
                      <button className="bg-white/20 backdrop-blur-md p-2 rounded-xl text-white hover:bg-white hover:text-indigo-600 transition-colors">
                        <Linkedin size={16} />
                      </button>
                   </div>
                </div>
                <div className="p-8">
                   <div className="flex justify-between items-start mb-2">
                      <h3 className="text-2xl font-black tracking-tighter text-gray-900 leading-none">{member.name}</h3>
                      <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg uppercase tracking-widest">{member.role}</span>
                   </div>
                   <p className="text-gray-400 text-xs font-bold uppercase tracking-[0.2em]">{member.specialization}</p>
                </div>
             </motion.div>
           ))}
        </div>

        {/* Global Network Note */}
        <div className="mt-32 p-12 bg-white rounded-[50px] border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-8">
           <div>
              <h4 className="text-2xl font-black tracking-tighter italic mb-2">Building live from the newfortech.com HQ.</h4>
              <p className="text-gray-400 text-sm font-medium">Join a global team redefining how the world discovers hardware.</p>
           </div>
           <button className="bg-indigo-600 text-white px-10 py-5 rounded-3xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:shadow-indigo-300 transition-all active:scale-95">
             Explore Careers
           </button>
        </div>
      </div>
    </div>
  );
};

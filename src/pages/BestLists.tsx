import React from 'react';
import { Trophy, CheckCircle, ArrowRight, ExternalLink, ChevronRight, Zap } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchProductFeed, generateTrackingUrl, logAffiliateClick } from '../lib/impact';
import { enrichProductData } from '../services/enrichmentService';
import { Link } from 'react-router-dom';

export const BestLists = () => {
  const { data: apiProducts, isLoading } = useQuery({
    queryKey: ['impactProducts'],
    queryFn: () => fetchProductFeed(),
  });

  const bestProducts = apiProducts ? apiProducts.slice(0, 5) : [];

  const { data: enrichedData, isLoading: isEnriching } = useQuery({
    queryKey: ['enriched_best_list', bestProducts.map(p => p.Id)],
    queryFn: async () => {
      return await Promise.all(
        bestProducts.map(p => enrichProductData(p.Name, p.Description))
      );
    },
    enabled: bestProducts.length > 0,
    staleTime: Infinity,
  });

  const handleProductClick = (productUrl: string, productId: string) => {
    logAffiliateClick(productId, { source: 'best_lists' });
    window.open(productUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto mb-16">
        <div className="flex items-center gap-3 mb-4">
          <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest italic shadow-lg shadow-indigo-100">Curated Benchmarks</span>
          <span className="text-gray-400 text-sm font-medium">Updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
        </div>
        <h1 className="text-5xl font-black text-gray-900 mb-6 tracking-tight">
          The Definitive <span className="text-indigo-600 underline">2026 Buying Guide</span>
        </h1>
        <p className="text-xl text-gray-500 font-light leading-relaxed">
          Our AI-powered engine cross-references live manufacturer metadata from <span className="font-bold text-gray-900">Impact.com</span> with real-world performance vectors.
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-12">
        {(isLoading || isEnriching) ? (
          <div className="flex flex-col items-center justify-center p-20 bg-white rounded-[40px] border border-gray-100">
            <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-400 font-black uppercase tracking-widest text-[10px]">Analyzing Data Points...</p>
          </div>
        ) : bestProducts.map((item: any, i: number) => {
          const title = item.Name || item.title || `Product ${i+1}`;
          const affiliateUrl = generateTrackingUrl(item.Url || item.link || '#', 'best_lists');
          const itemId = item.Id || item.id || `item-${i}`;
          const enriched = enrichedData?.[i];
          
          return (
            <div key={itemId} className="relative bg-white rounded-[40px] border border-gray-100 p-8 md:p-12 shadow-sm group hover:shadow-2xl hover:border-indigo-100 transition-all duration-500 overflow-hidden">
               <div className="absolute -left-6 top-8 w-14 h-14 bg-gray-900 text-white rounded-2xl flex items-center justify-center text-2xl font-black italic shadow-2xl z-10 transition-transform group-hover:scale-110">
                 #{i + 1}
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
                 <div className="md:col-span-8">
                    <div className="flex items-center gap-3 mb-6">
                       <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                         {i === 0 ? '🏆 Top Editorial Pick' : i === 1 ? '💎 Best Value Proposition' : '⚡ High Performance Asset'}
                       </span>
                    </div>
                    <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight leading-tight group-hover:text-indigo-600 transition-colors">{title}</h2>
                    
                    <div className="bg-indigo-50/50 rounded-3xl p-8 mb-8 border border-indigo-100 relative min-h-[140px]">
                       <Zap className="absolute top-4 right-4 text-indigo-300 opacity-50" size={24} />
                       <h4 className="flex items-center gap-2 text-indigo-900 font-black mb-3 text-[10px] uppercase tracking-widest">
                          Expert Vector Analysis
                       </h4>
                       {isEnriching ? (
                         <div className="space-y-2 animate-pulse">
                            <div className="h-3 bg-indigo-100 rounded w-full"></div>
                            <div className="h-3 bg-indigo-100 rounded w-5/6"></div>
                         </div>
                       ) : (
                         <p className="text-gray-700 text-sm leading-relaxed italic font-medium">
                           "{enriched?.expertReview?.split('.')[0] || 'Analyzing product performance benchmarks...'}. {enriched?.expertReview?.split('.')[1] || 'Technical evaluation in progress.'}."
                         </p>
                       )}
                    </div>

                    <div className="flex flex-wrap gap-2 mb-8">
                       {isEnriching ? (
                         [...Array(3)].map((_, idx) => (
                           <div key={idx} className="w-24 h-8 bg-emerald-50 rounded-full animate-pulse border border-emerald-100"></div>
                         ))
                       ) : (enriched?.pros || ['High Performance', 'Quality Build', 'Expert Pick']).slice(0, 3).map((pro: string, idx: number) => (
                         <span key={idx} className="bg-emerald-50 text-emerald-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 border border-emerald-100">
                           <CheckCircle size={10} /> {pro}
                         </span>
                       ))}
                    </div>

                    <div className="flex items-center gap-6">
                      <button 
                         onClick={() => handleProductClick(affiliateUrl, itemId)}
                         className="bg-gray-900 hover:bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 shadow-2xl shadow-indigo-100 flex items-center gap-2 group-hover:bg-indigo-600">
                         Get Best Price <ExternalLink size={14} />
                      </button>
                      <Link to={`/products/${itemId}`} className="text-gray-400 font-black text-[10px] uppercase tracking-widest hover:text-indigo-600 flex items-center gap-1.5 transition-colors">
                         View Details <ChevronRight size={14} />
                      </Link>
                    </div>
                 </div>

                 <div className="md:col-span-4 flex flex-col justify-center items-center md:items-end gap-8 text-center md:text-right md:border-l border-gray-100 md:pl-12">
                    <div className="w-40 h-40 bg-gray-50 rounded-[40px] p-6 flex items-center justify-center border border-gray-100 group-hover:rotate-2 transition-transform shadow-inner">
                       <img src={item.ImageUrl || item.imageUrl} alt={title} className="max-w-full max-h-full object-contain" />
                    </div>
                    <div>
                      <span className="block text-[10px] uppercase font-black text-gray-400 tracking-widest mb-1">MSRP</span>
                      <span className="text-4xl font-black text-gray-900 italic tracking-tighter">${item.CurrentPrice || item.price || 0}</span>
                    </div>
                    <div className="bg-indigo-600 rounded-3xl p-6 w-full text-white shadow-xl shadow-indigo-100">
                       <span className="block text-[8px] uppercase font-black text-indigo-200 tracking-widest mb-1">Impact Score</span>
                       <span className="text-5xl font-black italic tracking-tighter">{enriched?.scores.overall || (100 - i * 5)}</span>
                    </div>
                 </div>
               </div>
            </div>
          )
        })}
      </div>
    </div>
  );
};

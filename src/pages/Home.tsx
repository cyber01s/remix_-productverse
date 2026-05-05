import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { fetchProductFeed, logAffiliateClick, generateTrackingUrl } from '../lib/impact';
import { enrichProductData } from '../services/enrichmentService';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  ShoppingCart, 
  Zap, 
  ChevronDown, 
  Star, 
  Search,
  LayoutGrid,
  Filter,
  CheckCircle,
  TrendingUp,
  Loader2
} from 'lucide-react';
import { Link } from 'react-router-dom';

const DiscoverSlide: React.FC<{ product: any; isActive: boolean }> = ({ product, isActive }) => {
  const [isLiked, setIsLiked] = useState(false);
  
  const { data: enriched, isLoading: isEnriching } = useQuery({
    queryKey: ['enrich_discover', product.Id || product.id],
    queryFn: () => enrichProductData(product.Name || product.title, product.Description || product.description),
    enabled: isActive,
    staleTime: 1000 * 60 * 30, // 30 mins
  });

  const handleBuy = () => {
    const url = generateTrackingUrl(product.Url || product.link || '#', 'discover_feed');
    logAffiliateClick(product.Id || product.id, { location: 'discover_feed' });
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="h-screen w-full snap-start relative flex flex-col bg-black overflow-hidden select-none">
      {/* Visual Area */}
      <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-black p-6 pb-[35vh] md:pb-0">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={isActive ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative w-full h-full flex items-center justify-center"
        >
          <img 
            src={product.ImageUrl || product.imageUrl || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800"} 
            alt={product.Name} 
            className="max-h-full max-w-full object-contain filter drop-shadow-[0_20px_50px_rgba(255,255,255,0.1)] transition-transform duration-700 hover:scale-105"
          />
          
          <motion.div 
             animate={{ rotate: 360 }}
             transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
             className="absolute -z-10 w-[120%] h-[120%] border border-white/5 rounded-full blur-3xl opacity-20 bg-indigo-500/10"
          />
        </motion.div>
      </div>

      {/* Overlay UI */}
      <div className="absolute inset-0 z-10 flex flex-col justify-end p-6 md:p-12 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 items-end w-full max-w-6xl mx-auto mb-6 md:mb-0 pointer-events-auto">
          
          {/* Main Info */}
          <div className="md:col-span-8 flex flex-col gap-2 md:gap-4">
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={isActive ? { x: 0, opacity: 1 } : { x: -20, opacity: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-2"
            >
              <span className="bg-indigo-600 text-white text-[9px] md:text-[10px] font-black px-2 md:px-3 py-1 rounded-full uppercase tracking-[0.2em] italic flex items-center gap-1.5">
                <TrendingUp size={10} className="md:w-3 md:h-3" /> Trending Pick
              </span>
              <span className="text-white/40 text-[9px] md:text-[10px] font-bold uppercase tracking-widest">{product.Manufacturer || product.Brand || 'Official Asset'}</span>
            </motion.div>

            <motion.h2 
              initial={{ y: 20, opacity: 0 }}
              animate={isActive ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
              transition={{ delay: 0.4 }}
              className="text-3xl md:text-6xl font-black text-white leading-[0.9] tracking-tighter"
            >
              {product.Name || product.title}
            </motion.h2>

            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={isActive ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
              transition={{ delay: 0.5 }}
              className="flex items-center gap-4 py-1 md:py-2"
            >
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={12} className="fill-yellow-400 text-yellow-400 md:w-[14px]" />
                ))}
              </div>
              <span className="text-white/60 text-[10px] md:text-xs font-bold font-mono tracking-widest uppercase">MSRP: <span className="text-white text-base md:text-lg italic tracking-tighter ml-1">${product.CurrentPrice || product.price || 0}</span></span>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={isActive ? { opacity: 1 } : { opacity: 0 }}
              transition={{ delay: 0.6 }}
              className="max-w-xl"
            >
              <p className="text-white/70 text-xs md:text-base leading-relaxed line-clamp-2 md:line-clamp-3 italic font-medium">
                {isEnriching ? "Synthesizing vector benchmarks..." : enriched?.expertReview || product.Description}
              </p>
            </motion.div>

            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={isActive ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
              transition={{ delay: 0.7 }}
              className="flex flex-wrap gap-2 mt-1 md:mt-2"
            >
              {enriched?.pros?.slice(0, 3).map((pro: string, i: number) => (
                <span key={i} className="text-[9px] md:text-[10px] font-black uppercase text-white tracking-[0.1em] md:tracking-[0.2em] border border-white/20 px-2 md:px-3 py-1 md:py-1.5 rounded-xl bg-white/5 backdrop-blur-md flex items-center gap-1.5 shadow-2xl">
                  <CheckCircle size={10} className="text-emerald-400" /> {pro}
                </span>
              ))}
            </motion.div>
          </div>

          {/* Action Sidebar / Right Side Info */}
          <div className="md:col-span-4 flex flex-col md:items-end gap-4 md:gap-6">
            {/* Impact Score Card */}
            <motion.div 
              initial={{ x: 20, opacity: 0 }}
              animate={isActive ? { x: 0, opacity: 1 } : { x: 20, opacity: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-white p-4 md:p-6 rounded-[2rem] md:rounded-[2.5rem] w-full md:max-w-[240px] shadow-[0_20px_50px_rgba(255,255,255,0.05)] border border-white/10"
            >
               <div className="flex justify-between items-start mb-3 md:mb-4">
                  <div className="bg-indigo-50 text-indigo-600 p-1.5 md:p-2 rounded-lg md:rounded-xl">
                    <Zap size={18} className="md:w-5 md:h-5" />
                  </div>
                  <div className="text-right">
                    <span className="text-[8px] md:text-[9px] font-black text-gray-400 uppercase tracking-widest block leading-none mb-1">Score</span>
                    <span className="text-2xl md:text-4xl font-black italic tracking-tighter leading-none">{enriched?.scores?.overall || '96'}</span>
                  </div>
               </div>
               <div className="space-y-2 md:space-y-3">
                  <div className="h-1 md:h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={isActive ? { width: `${enriched?.scores?.performance || 90}%` } : { width: 0 }}
                      className="h-full bg-indigo-600 rounded-full"
                    />
                  </div>
                  <span className="text-[7px] md:text-[8px] font-black uppercase tracking-widest text-gray-400">Engineering Vector Accuracy</span>
               </div>
            </motion.div>

            {/* Interaction Bar */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={isActive ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
              transition={{ delay: 0.9 }}
              className="flex items-center gap-3 md:gap-4 w-full md:justify-end"
            >
               <button 
                 onClick={() => setIsLiked(!isLiked)}
                 className={`p-4 md:p-5 rounded-2xl md:rounded-3xl border transition-all flex items-center justify-center gap-2 ${isLiked ? 'bg-rose-500 border-rose-500 text-white shadow-xl shadow-rose-200' : 'bg-white/10 border-white/20 text-white hover:bg-white/20'}`}
               >
                 <Heart size={20} className={isLiked ? 'fill-white' : ''} />
               </button>
               
               <button 
                 onClick={handleBuy}
                 className="flex-1 md:flex-none bg-white text-black p-4 md:p-5 rounded-2xl md:rounded-3xl font-black text-[10px] md:text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-indigo-600 hover:text-white transition-all active:scale-95 flex items-center justify-center gap-2"
               >
                 Buy Now <ShoppingCart size={16} />
               </button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Swipe Indicator */}
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 text-white/40 flex flex-col items-center gap-1"
      >
        <span className="text-[9px] font-black uppercase tracking-widest">Swipe Up</span>
        <ChevronDown size={18} />
      </motion.div>
    </div>
  );
};

export const Home = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const { 
    data, 
    isLoading, 
    isError,
    error,
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage 
  } = useInfiniteQuery({
    queryKey: ['impactProductsInfinite'],
    queryFn: ({ pageParam = 1 }) => fetchProductFeed({ page: pageParam }),
    getNextPageParam: (lastPage, allPages) => {
      // Impact API doesn't always tell us if there's a next page easily in this proxy
      // We assume if we got items, we can try the next page
      return lastPage && lastPage.length > 0 ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1,
  });

  const products = data?.pages.flatMap(page => page) || [];

  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;
    const { scrollTop, clientHeight, scrollHeight } = containerRef.current;
    
    // Update active slide index
    const index = Math.round(scrollTop / clientHeight);
    if (index !== activeIndex) {
      setActiveIndex(index);
    }

    // Trigger fetch when near the end
    if (scrollTop + clientHeight >= scrollHeight - clientHeight * 2) {
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    }
  }, [activeIndex, fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (isLoading) {
    return (
      <div className="h-screen w-full bg-black flex flex-col items-center justify-center text-white p-8 text-center">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-24 h-24 border-2 border-indigo-600 rounded-full flex items-center justify-center mb-8 shadow-[0_0_50px_rgba(79,70,229,0.3)]"
        >
          <span className="text-2xl font-serif italic">PV</span>
        </motion.div>
        <h2 className="text-4xl font-black tracking-tighter mb-4 italic uppercase leading-none">Initializing Discovery Engine</h2>
        <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em] animate-pulse">Syncing Impact Catalog 2026.04</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[60] bg-black">
      {/* HUD Header */}
      <div className="absolute top-0 left-0 right-0 z-30 p-4 md:p-6 flex justify-between items-center pointer-events-none">
        <Link to="/" className="pointer-events-auto flex items-center gap-2">
          <span className="text-xl md:text-2xl font-black tracking-tighter text-white uppercase italic">
            PV<span className="text-indigo-600">.</span>DISCOVER
          </span>
        </Link>
        <div className="flex gap-2 md:gap-4 pointer-events-auto items-center">
           <a 
             href="https://newfortech.com" 
             target="_blank" 
             rel="noopener noreferrer"
             className="flex items-center gap-1.5 md:gap-2 bg-white/10 backdrop-blur-md text-white px-3 md:px-4 py-2 rounded-full text-[8px] md:text-[9px] font-black uppercase tracking-widest border border-white/10 hover:bg-white hover:text-black transition-all shrink-0"
           >
             <span className="hidden xs:inline">newfortech.com</span>
             <span className="xs:hidden">NFT</span>
           </a>
           <Link to="/products" className="bg-white/10 backdrop-blur-xl p-2 md:p-3 rounded-full text-white border border-white/10 hover:bg-indigo-600 transition-all">
             <Search size={18} className="md:w-5 md:h-5" />
           </Link>
           <Link to="/products" className="bg-white/10 backdrop-blur-xl p-2 md:p-3 rounded-full text-white border border-white/10 hover:bg-indigo-600 transition-all">
             <LayoutGrid size={18} className="md:w-5 md:h-5" />
           </Link>
        </div>
      </div>

      {/* Discovery Feed */}
      <div 
        ref={containerRef}
        onScroll={handleScroll}
        className="h-screen w-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
      >
        {products.map((product: any, index: number) => (
          <DiscoverSlide 
            key={`${product.Id || index}-${index}`} 
            product={product} 
            isActive={index === activeIndex} 
          />
        ))}

        {isFetchingNextPage && (
          <div className="h-screen w-full snap-start flex items-center justify-center bg-black">
             <div className="flex flex-col items-center gap-4">
                <Loader2 size={48} className="text-indigo-500 animate-spin" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 animate-pulse">Streaming Matrix Data...</span>
             </div>
          </div>
        )}

        {isError && (
          <div className="h-screen w-full flex items-center justify-center text-white text-center p-12 bg-rose-950/20">
             <div className="max-w-md">
                <h3 className="text-4xl md:text-5xl font-black italic tracking-tighter mb-4 uppercase text-rose-500">System Error</h3>
                <p className="text-white/40 uppercase text-[10px] md:text-xs font-black tracking-[0.2em] mb-12 leading-relaxed">
                  {error instanceof Error && error.message.includes('Impact API credentials') 
                    ? "Configuration Missing: Please ensure IMPACT_ACCOUNT_SID and IMPACT_AUTH_TOKEN are set in Vercel Environment Variables."
                    : "The discovery engine encountered a vector mismatch. Please re-synchronize your credentials or try again later."}
                </p>
                <Link to="/products" className="inline-block bg-white text-black px-10 py-5 rounded-full font-black text-[10px] uppercase tracking-[0.2em] hover:bg-rose-600 hover:text-white transition-all shadow-2xl">
                  Manual Catalog Override
                </Link>
             </div>
          </div>
        )}

        {!products.length && !isLoading && !isFetchingNextPage && !isError && (
          <div className="h-screen w-full flex items-center justify-center text-white text-center p-12">
             <div className="max-w-md">
                <h3 className="text-4xl md:text-5xl font-black italic tracking-tighter mb-4 uppercase">Feed Exhausted</h3>
                <p className="text-white/40 uppercase text-[10px] md:text-xs font-black tracking-[0.2em] mb-12 leading-relaxed">
                  The discovery engine has reached the end of the available impact feed. Re-index search catalog for more assets.
                </p>
                <Link to="/products" className="inline-block bg-white text-black px-10 py-5 rounded-full font-black text-[10px] uppercase tracking-[0.2em] hover:bg-editorial-orange hover:text-white transition-all shadow-2xl">
                  Go to Matrix Search
                </Link>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

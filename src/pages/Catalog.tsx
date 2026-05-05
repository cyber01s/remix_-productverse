import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { CATEGORIES } from '../constants';
import { 
  Search, 
  Filter, 
  ChevronDown, 
  Star, 
  ExternalLink, 
  AlertCircle, 
  X, 
  SlidersHorizontal,
  LayoutGrid,
  Zap,
  ShieldCheck,
  TrendingUp,
  Cpu,
  Loader2,
  Box
} from 'lucide-react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchProductFeed, generateTrackingUrl, logAffiliateClick } from '../lib/impact';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

export const Catalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const visibleCountDefault = 12;
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const selectedCategory = searchParams.get('cat') || 'all';
  const searchQueryParam = searchParams.get('q') || '';
  const [searchQuery, setSearchQuery] = useState(searchQueryParam);

  useEffect(() => {
    setSearchQuery(searchQueryParam);
  }, [searchQueryParam]);
  
  const { 
    data, 
    isLoading, 
    isFetching,
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage,
    isError, 
    error 
  } = useInfiniteQuery({
    queryKey: ['impactProductsInfinite', searchQueryParam, selectedCategory],
    queryFn: ({ pageParam = 1 }) => fetchProductFeed({ 
      q: searchQueryParam || undefined, 
      category: selectedCategory || undefined,
      page: pageParam
    }),
    getNextPageParam: (lastPage, allPages) => {
      return lastPage && lastPage.length > 0 ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1,
  });

  const allProducts = data?.pages.flatMap(page => page) || [];

  const handleProductClick = (productUrl: string, productId: string) => {
    logAffiliateClick(productId, { source: 'search_engine' });
    window.open(productUrl, '_blank', 'noopener,noreferrer');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newParams: any = {};
    if (searchQuery) newParams.q = searchQuery;
    if (selectedCategory && selectedCategory !== 'all') newParams.cat = selectedCategory;
    setSearchParams(newParams);
  };

  const handleCategoryChange = (catId: string) => {
    const newParams: any = {};
    if (searchQueryParam) newParams.q = searchQueryParam;
    if (catId && catId !== 'all') newParams.cat = catId;
    setSearchParams(newParams);
  };

  const filteredProducts = useMemo(() => {
    return allProducts.filter((product: any) => {
      const price = parseFloat(product.CurrentPrice || product.price || '0');
      if (minPrice && price < parseFloat(minPrice)) return false;
      if (maxPrice && price > parseFloat(maxPrice)) return false;
      return true;
    });
  }, [allProducts, minPrice, maxPrice]);

  // Infinite Scroll Observer
  const observer = useRef<IntersectionObserver | null>(null);
  const lastElementRef = useCallback((node: HTMLDivElement) => {
    if (isLoading || isFetchingNextPage) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasNextPage) {
        fetchNextPage();
      }
    });
    if (node) observer.current.observe(node);
  }, [isLoading, isFetchingNextPage, hasNextPage, fetchNextPage]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pt-16">
      {/* Search Header HUD */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40 px-6 py-6 shadow-sm">
        <div className="container mx-auto">
          <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-4 items-center">
             <div className="relative flex-1 group w-full">
                <Search className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search Asset Matrix..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-12 md:pl-16 pr-6 py-3 md:py-4 text-xs md:text-sm font-bold uppercase tracking-tight focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:bg-white transition-all underline-offset-4"
                />
                <AnimatePresence>
                  {isFetching && !isFetchingNextPage && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute right-6 top-1/2 -translate-y-1/2"
                    >
                      <Loader2 className="text-indigo-600 animate-spin" size={20} />
                    </motion.div>
                  )}
                </AnimatePresence>
             </div>
             
             <button 
               type="button"
               onClick={() => setShowFilters(!showFilters)}
               className={`flex items-center justify-center gap-2 px-6 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-widest transition-all w-full md:w-auto ${showFilters ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' : 'bg-white border border-gray-200 text-gray-600 hover:border-indigo-600'}`}
             >
               <SlidersHorizontal size={14} className="md:w-4 md:h-4" /> {showFilters ? 'Hide Matrix' : 'Filter Sector'}
             </button>
          </form>
          
          {/* Quick Stats Overlay */}
          <div className="flex gap-6 mt-4 overflow-x-auto scrollbar-hide pb-2">
             {[
               { icon: Zap, label: 'High Score', val: '>90' },
               { icon: Cpu, label: 'Performance', val: 'Verified' },
               { icon: ShieldCheck, label: 'Quality', val: 'Enforced' },
               { icon: TrendingUp, label: 'Trending', val: 'Active' },
             ].map((stat, i) => (
               <div key={i} className="flex items-center gap-2 whitespace-nowrap">
                 <stat.icon size={12} className="text-indigo-600" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{stat.label}:</span>
                 <span className="text-[10px] font-bold text-gray-900">{stat.val}</span>
               </div>
             ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12 flex flex-col lg:flex-row gap-12">
        {/* Advanced Filters Drawer */}
        <AnimatePresence>
          {showFilters && (
            <>
              {/* Mobile Overlay */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowFilters(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[50] lg:hidden"
              />
              <motion.aside 
                initial={{ x: -300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                className="fixed lg:sticky top-0 lg:top-52 left-0 h-full lg:h-auto w-[85%] sm:w-80 lg:w-80 flex-shrink-0 z-[60] lg:z-0 overflow-y-auto"
              >
                <div className="bg-white h-full lg:h-auto rounded-r-[40px] lg:rounded-[40px] border-r lg:border border-gray-100 p-8 shadow-2xl shadow-indigo-100/20">
                <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-50">
                   <h2 className="text-xl font-black italic tracking-tighter">Matrix Filters</h2>
                   <button onClick={() => setShowFilters(false)} className="text-gray-400 hover:text-red-500">
                     <X size={20} />
                   </button>
                </div>

                <div className="space-y-10">
                  {/* Category Grid */}
                  <div>
                    <h3 className="text-[10px] uppercase font-black tracking-widest text-gray-400 mb-4">Functional Sector</h3>
                    <div className="grid grid-cols-1 gap-2">
                      <button 
                        onClick={() => handleCategoryChange('all')}
                        className={`text-left px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-tight transition-all ${selectedCategory === 'all' ? 'bg-indigo-600 text-white shadow-lg' : 'hover:bg-gray-50'}`}
                      >
                        All Portfolios
                      </button>
                      {CATEGORIES.slice(0, 8).map(cat => (
                        <button 
                          key={cat.id}
                          onClick={() => handleCategoryChange(cat.id)}
                          className={`text-left px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-tight transition-all ${selectedCategory === cat.id ? 'bg-indigo-600 text-white shadow-lg' : 'hover:bg-gray-50'}`}
                        >
                          {cat.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Price Vector */}
                  <div>
                    <h3 className="text-[10px] uppercase font-black tracking-widest text-gray-400 mb-4">Fiscal Constraints</h3>
                    <div className="grid grid-cols-2 gap-4">
                       <input 
                         type="number" 
                         placeholder="MIN $"
                         value={minPrice}
                         onChange={(e) => setMinPrice(e.target.value)}
                         className="bg-gray-50 border border-transparent rounded-xl px-4 py-3 text-sm focus:bg-white focus:border-indigo-600 outline-none font-bold"
                       />
                       <input 
                         type="number" 
                         placeholder="MAX $"
                         value={maxPrice}
                         onChange={(e) => setMaxPrice(e.target.value)}
                         className="bg-gray-50 border border-transparent rounded-xl px-4 py-3 text-sm focus:bg-white focus:border-indigo-600 outline-none font-bold"
                       />
                    </div>
                  </div>
                </div>
              </div>
            </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Search Results Matrix */}
        <main className="flex-1">
          {isLoading ? (
             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
               {[...Array(6)].map((_, i) => (
                 <div key={i} className="relative overflow-hidden bg-white h-[400px] rounded-[40px] border border-gray-100">
                    <motion.div 
                      animate={{ x: ['-100%', '100%'] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-50 to-transparent"
                    />
                 </div>
               ))}
             </div>
          ) : filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-20 bg-white rounded-[40px] border border-gray-100 text-center shadow-inner">
               <motion.div 
                 animate={{ rotate: 360 }}
                 transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                 className="mb-6 opacity-10"
               >
                 <Box size={80} />
               </motion.div>
               <h3 className="text-3xl font-black italic tracking-tighter mb-2">No Matching Vectors</h3>
               <p className="text-gray-400 text-xs font-black uppercase tracking-[0.2em] max-w-sm">The search query returned an empty set. Adjust fiscal constraints or expand sector filtering.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 pb-20">
               {filteredProducts.map((p: any, i: number) => {
                  const affiliateUrl = generateTrackingUrl(p.Url || p.link || '#', 'search_engine');
                  return (
                    <motion.div 
                      layout
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: (i % 12) * 0.05 }}
                      key={`${p.Id || i}-${i}`} 
                      className="bg-white rounded-[40px] border border-gray-100 p-8 flex flex-col group hover:shadow-2xl hover:border-indigo-100 transition-all duration-500 overflow-hidden relative"
                    >
                       {/* Price Badge */}
                       <div className="absolute top-8 right-8 z-10">
                          <span className="text-2xl font-black italic tracking-tighter">${p.CurrentPrice || p.price || 0}</span>
                       </div>

                       <Link to={`/products/${p.Id || p.id}`} className="flex-1 flex flex-col">
                          <div className="h-48 mb-8 flex items-center justify-center">
                             <img 
                               src={p.ImageUrl || p.imageUrl || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400"} 
                               alt={p.Name} 
                               className="max-h-full max-w-full object-contain filter drop-shadow-xl group-hover:scale-110 transition-transform duration-700"
                             />
                          </div>
                          
                          <div className="space-y-3">
                             <span className="text-[9px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">{p.Category || 'Generic Asset'}</span>
                             <h3 className="text-2xl font-black text-gray-900 tracking-tighter leading-none group-hover:text-indigo-600 transition-colors line-clamp-2">{p.Name || p.title}</h3>
                             <p className="text-gray-400 text-xs line-clamp-2 font-medium italic">{(p.Description || '').split('.')[0]}.</p>
                          </div>
                       </Link>

                       <div className="mt-8 pt-6 border-t border-gray-50 flex items-center justify-between gap-4">
                          <div className="bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest italic shrink-0">
                             VERIFIED ASSET
                          </div>
                          <button 
                            onClick={() => handleProductClick(affiliateUrl, p.Id || p.id)}
                            className="bg-gray-900 text-white hover:bg-indigo-600 px-4 md:px-6 py-2 rounded-xl md:rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all w-full text-center"
                          >
                            Buy <ExternalLink size={10} className="inline ml-1" />
                          </button>
                       </div>
                    </motion.div>
                  );
               })}
               
               {/* Loader Ref Element */}
               <div ref={lastElementRef} className="col-span-full h-20 flex items-center justify-center">
                  {isFetchingNextPage && (
                    <motion.div 
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="flex items-center gap-3 bg-gray-900 text-white px-8 py-3 rounded-full shadow-2xl"
                    >
                      <Loader2 className="animate-spin" size={16} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Hydrating Discovery Matrix...</span>
                    </motion.div>
                  )}
               </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

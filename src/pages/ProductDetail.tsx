import React from 'react';
import { Star, ArrowLeft, ExternalLink, ShieldCheck, Zap, Award, ThumbsUp, ThumbsDown, Info } from 'lucide-react';
import { ReviewSection } from '../components/reviews/ReviewSection';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchProductById, generateTrackingUrl, logAffiliateClick } from '../lib/impact';
import { enrichProductData } from '../services/enrichmentService';

export const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: product, isLoading, isError } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => fetchProductById(slug || ''),
    enabled: !!slug,
  });

  const { data: enriched, isLoading: isEnriching } = useQuery({
    queryKey: ['enriched_product', product?.Name, product?.Description],
    queryFn: () => enrichProductData(product.Name, product.Description),
    enabled: !!product,
    staleTime: Infinity, // Keep AI data cached
  });

  const handleProductClick = (productUrl: string, productId: string) => {
    logAffiliateClick(productId, { source: 'product_detail' });
    window.open(productUrl, '_blank', 'noopener,noreferrer');
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl text-center h-96 flex flex-col justify-center">
        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
        <p className="text-gray-500 mb-6">We couldn't load the details for this product.</p>
        <Link to="/products" className="text-indigo-600 font-medium hover:underline">
          <ArrowLeft size={16} className="inline mr-2" /> Back to Catalog
        </Link>
      </div>
    );
  }

  const title = product.Name || product.title || 'Unknown Product';
  const description = product.Description || product.description || 'No description available.';
  const imageUrl = product.ImageUrl || product.imageUrl || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=600&fit=crop';
  const price = product.CurrentPrice || product.price || 0;
  const originalPrice = product.OriginalPrice || product.price || 0;
  const itemId = product.Id || product.id || slug;
  const affiliateUrl = generateTrackingUrl(product.Url || product.link || '#', 'product_detail');

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/products" className="inline-flex items-center text-gray-500 hover:text-indigo-600 font-medium mb-8 transition-colors">
        <ArrowLeft size={16} className="mr-2" /> Back to Catalog
      </Link>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Gallery */}
        <div className="lg:col-span-7 space-y-8">
          <div className="aspect-[4/3] bg-white rounded-[40px] flex items-center justify-center p-12 overflow-hidden border border-gray-100 shadow-sm relative">
            <img 
              src={imageUrl} 
              className="max-w-full max-h-full object-contain"
              alt={title}
            />
            {enriched && (
              <div className="absolute top-4 md:top-6 left-4 md:left-6 bg-indigo-600 text-white px-3 md:px-4 py-1.5 md:py-2 rounded-xl md:rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-widest shadow-xl">
                 Score: {enriched.scores.overall}/100
              </div>
            )}
          </div>

          {/* AI Enhanced Content */}
          <div className="bg-white rounded-[40px] border border-gray-100 p-8 md:p-12 shadow-sm space-y-12">
            <section>
              <h3 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                <Award className="text-indigo-600" /> Expert Editorial Review
              </h3>
              {isEnriching ? (
                <div className="animate-pulse space-y-3">
                   <div className="h-4 bg-gray-100 rounded w-full"></div>
                   <div className="h-4 bg-gray-100 rounded w-5/6"></div>
                   <div className="h-4 bg-gray-100 rounded w-4/6"></div>
                </div>
              ) : (
                <div className="prose prose-indigo max-w-none">
                  <p className="text-gray-600 leading-relaxed italic text-lg border-l-4 border-indigo-100 pl-6">
                    {enriched?.expertReview}
                  </p>
                </div>
              )}
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="bg-emerald-50/50 rounded-3xl p-6 border border-emerald-100">
                  <h4 className="flex items-center gap-2 text-emerald-700 font-bold mb-4 uppercase text-xs tracking-widest">
                    <ThumbsUp size={16} /> Pros
                  </h4>
                  <ul className="space-y-3">
                    {enriched?.pros.map((pro, i) => (
                      <li key={i} className="text-xs md:text-sm text-gray-700 flex items-start gap-2">
                        <span className="text-emerald-500 mt-1 shrink-0">✓</span> {pro}
                      </li>
                    ))}
                  </ul>
               </div>
               <div className="bg-rose-50/50 rounded-3xl p-6 border border-rose-100">
                  <h4 className="flex items-center gap-2 text-rose-700 font-bold mb-4 uppercase text-xs tracking-widest">
                    <ThumbsDown size={16} /> Cons
                  </h4>
                  <ul className="space-y-2">
                    {enriched?.cons.map((con, i) => (
                      <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                        <span className="text-rose-400 mt-1">✕</span> {con}
                      </li>
                    ))}
                  </ul>
               </div>
            </div>

            <section>
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Info className="text-indigo-600" /> Full Specifications
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 {isEnriching ? (
                   [...Array(4)].map((_, i) => (
                     <div key={i} className="h-14 bg-gray-50 rounded-2xl animate-pulse"></div>
                   ))
                 ) : enriched ? Object.entries(enriched.specs).map(([k, v]) => (
                   <div key={k} className="flex justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{k}</span>
                      <span className="text-sm font-bold text-gray-900">{v}</span>
                   </div>
                 )) : (
                   <div className="col-span-full p-8 text-center bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                      <p className="text-gray-400 text-sm italic">Detailed technical data unavailable for this asset.</p>
                   </div>
                 )}
              </div>
            </section>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="lg:col-span-5 space-y-8">
          <div className="sticky top-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">Impact Catalog</span>
              <span className="text-gray-400 text-sm font-medium">ID: {itemId}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 leading-tight text-balance">{title}</h1>
            <div className="text-base md:text-lg text-gray-500 font-light mb-8 leading-relaxed text-balance" dangerouslySetInnerHTML={{ __html: description }}>
            </div>
            
            <div className="flex flex-wrap items-center gap-4 md:gap-6 mb-8">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star key={s} size={16} className={s < (enriched?.scores.overall / 20 || 5) ? "fill-yellow-400 text-yellow-400 md:w-5 md:h-5" : "text-gray-200"} />
                ))}
                <span className="text-gray-900 font-bold ml-2 text-sm md:text-base">{isEnriching ? "..." : (enriched?.scores.overall / 20 || 5.0).toFixed(1)}</span>
              </div>
              <div className="hidden sm:block h-6 w-px bg-gray-200"></div>
              <a href="#reviews" className="text-indigo-600 text-sm md:text-base font-medium hover:underline tracking-tight">Community Reviews</a>
            </div>

            <div className="bg-gray-900 rounded-[32px] md:rounded-[40px] p-6 md:p-10 text-white shadow-2xl relative overflow-hidden group">
               <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl transition-transform group-hover:scale-110"></div>
               <div className="flex flex-wrap items-center justify-between mb-6 md:mb-8 relative z-10 gap-4">
                  <div className="flex items-baseline gap-2">
                    {price > 0 && <span className="text-3xl md:text-5xl font-black">${typeof price === 'number' ? price.toFixed(2) : price}</span>}
                    {originalPrice > price && price > 0 && (
                      <span className="text-indigo-300/50 line-through font-medium text-base md:text-lg leading-none">${typeof originalPrice === 'number' ? originalPrice.toFixed(2) : originalPrice}</span>
                    )}
                  </div>
                  {originalPrice > price && (
                    <div className="bg-indigo-500 text-white px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest">SAVE ${ (originalPrice - price).toFixed(0) }</div>
                  )}
               </div>
               
               <div className="space-y-4 mb-8 relative z-10">
                  <div className="flex items-center gap-3 text-xs font-bold text-indigo-300">
                     <ShieldCheck size={16} /> Official Manufacturer Warranty
                  </div>
                  <div className="flex items-center gap-3 text-xs font-bold text-indigo-300">
                     <Zap size={16} /> Live Pricing via Impact Network
                  </div>
               </div>

               <button 
                onClick={() => handleProductClick(affiliateUrl, itemId)}
                className="w-full bg-white text-indigo-600 py-5 rounded-3xl text-xl font-black uppercase tracking-widest hover:bg-gray-100 transition-all transform active:scale-95 flex items-center justify-center gap-3 shadow-xl hover:shadow-indigo-500/40"
              >
                Buy Now <ExternalLink size={20} />
              </button>
            </div>

            {isEnriching ? (
              <div className="mt-8 bg-white rounded-3xl border border-gray-100 p-8 shadow-sm space-y-4">
                <div className="h-4 bg-gray-100 rounded w-1/4 animate-pulse"></div>
                <div className="h-2 bg-gray-100 rounded animate-pulse"></div>
                <div className="h-2 bg-gray-100 rounded animate-pulse"></div>
              </div>
            ) : enriched && (
              <div className="mt-8 bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
                 <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-6">Expert Scores</h4>
                 <div className="space-y-4">
                    {[
                      { label: 'Performance', val: enriched.scores.performance, color: 'bg-indigo-600' },
                      { label: 'Value', val: enriched.scores.value, color: 'bg-emerald-500' },
                      { label: 'Build Quality', val: enriched.scores.design, color: 'bg-orange-500' },
                    ].map(s => (
                      <div key={s.label}>
                         <div className="flex justify-between text-xs font-bold mb-2">
                            <span className="text-gray-700">{s.label}</span>
                            <span className="text-gray-900">{s.val}%</span>
                         </div>
                         <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div className={`h-full ${s.color} transition-all duration-1000`} style={{ width: `${s.val}%` }}></div>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Product Details Tabs (Simplified) */}
      <div id="reviews" className="mt-20">
         <ReviewSection productId={itemId} />
      </div>
    </div>
  );
};


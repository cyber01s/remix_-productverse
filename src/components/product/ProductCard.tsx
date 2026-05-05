import React from 'react';
import { Star, Heart, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { Product } from '../../types';

interface ProductCardProps {
  product: Partial<Product>;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, className }) => {
  return (
    <div className={cn(
      "bg-white border border-editorial-black overflow-hidden group hover:editorial-shadow transition-all duration-300",
      className
    )}>
      <div className="aspect-square bg-white relative p-6 border-b border-editorial-black">
        <img 
          src={product.thumbnail || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop"} 
          alt={product.name}
          className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-500"
        />
        
        <div className="absolute top-0 left-0 flex flex-col">
          {product.isTrending && (
            <span className="bg-editorial-black text-white px-2 py-0.5 text-[9px] font-black uppercase tracking-widest">
              Trending
            </span>
          )}
        </div>

        <button className="absolute top-2 right-2 p-1.5 bg-white border border-editorial-black text-editorial-black hover:text-editorial-orange transition-all">
          <Heart size={14} />
        </button>
      </div>

      <div className="p-5">
        <div className="flex items-center gap-1 mb-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star 
              key={i} 
              size={10} 
              className={i < Math.floor(product.rating || 0) ? "fill-editorial-orange text-editorial-orange" : "text-gray-200"} 
            />
          ))}
          <span className="text-[9px] text-gray-400 font-bold ml-2 uppercase tracking-tighter">({product.reviewCount || 0})</span>
        </div>

        <Link to={`/products/${product.slug}`} className="block">
          <h3 className="font-serif italic text-lg text-editorial-black mb-1 leading-tight group-hover:text-editorial-orange transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-4">{product.brand}</p>
        
        <div className="flex items-center justify-between pt-4 border-t border-editorial-black mt-auto">
          <div>
            <span className="text-xl font-serif font-black italic text-editorial-black">${product.price}</span>
          </div>
          <Link 
            to={`/products/${product.slug}`}
            className="border border-editorial-black px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest hover:bg-editorial-black hover:text-white transition-all"
          >
            Shop now
          </Link>
        </div>
      </div>
    </div>
  );
};

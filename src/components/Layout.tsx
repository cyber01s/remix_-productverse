import React, { useState, useEffect } from 'react';
import { Menu, X, Search, Heart, LayoutGrid, Star, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { Link, useNavigate } from 'react-router-dom';

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchValue.trim())}`);
    } else {
      navigate(`/products`);
    }
  };

  const navItems = [
    { name: 'Discover', href: '/', icon: LayoutGrid },
    { name: 'Matrix', href: '/products', icon: Search },
    { name: 'Best Picks', href: '/best', icon: Star },
  ];

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-editorial-black bg-white/90 backdrop-blur-md h-16 flex items-center shadow-sm",
        isScrolled ? "h-14" : "h-16"
      )}
    >
      <div className="container mx-auto px-4 md:px-8 flex items-center justify-between">
        <div className="flex items-center gap-4 md:gap-12">
          <Link to="/" className="flex items-center gap-1.5 translate-y-0.5">
            <span className="text-lg md:text-2xl font-black tracking-tighter uppercase italic font-serif leading-none">
              PV<span className="text-gray-400">.</span><span className="text-editorial-orange">DISCOVER</span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-6 text-[10px] font-black uppercase tracking-widest">
            {navItems.map((item) => (
              <Link 
                key={item.href} 
                to={item.href}
                className="text-editorial-black hover:text-editorial-orange transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <form onSubmit={handleSearch} className="hidden sm:flex items-center border border-editorial-black/10 bg-gray-50 px-3 py-1.5 text-[11px] gap-2 rounded-full">
            <Search size={12} className="text-editorial-black" />
            <input 
              type="text" 
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search..." 
              className="bg-transparent outline-none w-20 md:w-32 font-bold uppercase tracking-tight"
            />
          </form>

          <a 
            href="https://newfortech.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-2 bg-editorial-black text-white px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-editorial-orange transition-all"
          >
            Visit NewForTech <ExternalLink size={10} />
          </a>
          
          <button className="p-2 text-editorial-black hover:text-editorial-orange transition-colors">
            <Heart size={18} />
          </button>

          <button 
            className="lg:hidden p-2 text-editorial-black"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 bg-white border-b border-gray-200 p-6 lg:hidden shadow-2xl flex flex-col gap-6"
          >
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Link 
                  key={item.href} 
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 p-4 rounded-2xl hover:bg-gray-50 text-xs font-black uppercase tracking-[0.2em] transition-all"
                >
                  <item.icon size={16} />
                  {item.name}
                </Link>
              ))}
              <a 
                href="https://newfortech.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 rounded-2xl bg-editorial-black text-white mt-4 text-xs font-black uppercase tracking-[0.2em] shadow-xl"
              >
                <ExternalLink size={16} />
                newfortech.com
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export const AffiliateDisclosure = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-editorial-black text-white py-1">
      <div className="container mx-auto px-8 flex items-center justify-between gap-4">
        <p className="text-[9px] uppercase tracking-[0.2em] font-bold">
          <span className="text-editorial-orange mr-2">Advertising Disclosure:</span>
          We may earn a commission from products purchased through our links.
        </p>
        <button 
          onClick={() => setIsVisible(false)}
          className="text-white/40 hover:text-white transition-colors"
        >
          <X size={10} />
        </button>
      </div>
    </div>
  );
};

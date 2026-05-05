import React, { useState, useEffect } from 'react';
import { Menu, X, Search, Heart, LayoutGrid, Scale, Trophy, Star, ChevronDown } from 'lucide-react';
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
    { name: 'Search Engine', href: '/products', icon: Search },
    { name: 'Best Picks', href: '/best', icon: Star },
  ];

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-editorial-black bg-white h-16 flex items-center shadow-sm",
        isScrolled ? "py-2" : "py-4"
      )}
    >
      <div className="container mx-auto px-8 flex items-center justify-between">
        <div className="flex items-center gap-12">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-black tracking-tighter uppercase italic font-serif">
              Product<span className="text-editorial-orange">Verse</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-[11px] font-bold uppercase tracking-widest">
            {navItems.map((item) => (
              <Link 
                key={item.href} 
                to={item.href}
                className="text-editorial-black hover:text-editorial-orange transition-colors flex items-center gap-1.5"
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <form onSubmit={handleSearch} className="hidden lg:flex items-center border border-editorial-black bg-transparent px-3 py-1 text-[12px] gap-2">
            <Search size={14} className="text-editorial-black" />
            <input 
              type="text" 
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search products..." 
              className="bg-transparent outline-none w-32 font-bold uppercase tracking-tight"
            />
          </form>
          
          <button className="p-2 text-editorial-black hover:text-editorial-orange transition-colors relative">
            <Heart size={18} />
          </button>

          <button 
            className="md:hidden p-2 text-gray-600"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-white border-b border-gray-200 p-4 md:hidden shadow-xl"
          >
            <div className="flex flex-col gap-4">
              {navItems.map((item) => (
                <a 
                  key={item.href} 
                  href={item.href}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-indigo-50 text-gray-700 font-medium"
                >
                  <item.icon size={20} className="text-indigo-600" />
                  {item.name}
                </a>
              ))}
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

import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Zap, Github, Twitter, Linkedin, Facebook, Instagram } from 'lucide-react';
import { Header, AffiliateDisclosure } from './components/Layout';
import { Home } from './pages/Home';
import { Catalog } from './pages/Catalog';
import { ProductDetail } from './pages/ProductDetail';
import { BestLists } from './pages/BestLists';
import { AdminDashboard } from './pages/AdminDashboard';

// Company
import { About } from './pages/company/About';
import { Team } from './pages/company/Team';
import { Contact } from './pages/company/Contact';
import { Privacy } from './pages/company/Privacy';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <AffiliateDisclosure />
        <Header />
        <main className="pt-24 pb-12">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Catalog />} />
            <Route path="/products/:slug" element={<ProductDetail />} />
            <Route path="/best" element={<BestLists />} />
            <Route path="/admin" element={<AdminDashboard />} />
            
            {/* Company */}
            <Route path="/about" element={<About />} />
            <Route path="/team" element={<Team />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<Privacy />} />
          </Routes>
        </main>
        
        <footer className="bg-gray-900 text-white py-20 px-6 border-t border-white/5">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-24">
              <div className="col-span-1 md:col-span-2">
                <div className="flex items-center gap-2 mb-8 group cursor-default">
                  <span className="text-3xl font-black tracking-tighter uppercase italic">
                    PV<span className="text-indigo-600">.</span>DISCOVER
                  </span>
                </div>
                <p className="text-gray-400 max-w-md text-sm leading-relaxed mb-8">
                  Your ultimate guide to the galaxy of consumer products. 
                  We track, analyze, and discover products through an AI-powered lens.
                  Mobile-optimized search engine for the modern shopper.
                  <br /><br />
                  <a href="https://newfortech.com" target="_blank" rel="noopener noreferrer" className="text-indigo-400 font-bold uppercase tracking-widest text-[10px] hover:text-white transition-colors">
                    A newfortech.com Initiative
                  </a>
                </p>
                <div className="flex gap-4">
                  <a href="#" className="p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors"><Twitter size={18} /></a>
                  <a href="#" className="p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors"><Linkedin size={18} /></a>
                  <a href="#" className="p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors"><Github size={18} /></a>
                </div>
              </div>
              
              <div>
                <h4 className="font-bold mb-6 text-sm uppercase tracking-[0.2em] text-indigo-400">Navigation</h4>
                <ul className="space-y-4 text-sm font-medium text-gray-400">
                  <li><Link to="/" className="hover:text-white transition-colors">Discover Feed</Link></li>
                  <li><Link to="/products" className="hover:text-white transition-colors">Search Engine</Link></li>
                  <li><Link to="/best" className="hover:text-white transition-colors">Best Picks</Link></li>
                  <li><Link to="/admin" className="hover:text-white transition-colors">Architect Access</Link></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-bold mb-6 text-sm uppercase tracking-[0.2em] text-indigo-400">Company</h4>
                <ul className="space-y-4 text-sm font-medium text-gray-400">
                  <li><Link to="/about" className="hover:text-white transition-colors">About Mission</Link></li>
                  <li><Link to="/team" className="hover:text-white transition-colors">Technical Team</Link></li>
                  <li><Link to="/contact" className="hover:text-white transition-colors">Contact Matrix</Link></li>
                  <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Protocols</Link></li>
                </ul>
              </div>
            </div>
            <div className="mt-20 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-gray-600 text-center md:text-left">
               <p>© 2026 PRODUCTVERSE. ALL SYSTEMS OPERATIONAL.</p>
               <p>DEPLOYED VIA NEWFORTECH CLOUD</p>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}


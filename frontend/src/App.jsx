// frontend/src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { LanguageProvider, useLanguage } from '@/contexts/LanguageContext';
import { CartProvider, useCart } from '@/contexts/CartContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { ShoppingCart, Menu, X } from 'lucide-react';
import LanguageSelector from '@/components/shop/LanguageSelector';
import CartSlideOver from '@/components/shop/CartSlideOver';
import PromoBanner from '@/components/shop/PromoBanner';
import ExitIntentPopup from '@/components/shop/ExitIntentPopup';

// Pages
import Home from '@/pages/Home';
import Catalog from '@/pages/Catalog';
import ProductDetail from '@/pages/ProductDetail';
import Checkout from '@/pages/Checkout';
import Admin from '@/pages/Admin';
import LegalPage from '@/pages/LegalPage';
import About from '@/pages/About';

// Legal content
import { termsContent, legalNoticeContent, privacyContent, refundContent } from '@/data/legalContent';

function Layout({ children }) {
  const { t } = useLanguage();
  const { itemCount, setIsOpen } = useCart();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showPromo, setShowPromo] = useState(true);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Pas de nav sur les pages admin et checkout/success
  const isAdmin = location.pathname.startsWith('/admin');
  const isCheckoutSuccess = location.pathname.includes('/checkout') && location.search.includes('session_id');
  if (isAdmin) return <>{children}</>;

  const navLinks = [
    { label: t('nav.home'), path: '/' },
    { label: t('nav.catalog'), path: '/catalog' },
    { label: t('nav.about') || 'À propos', path: '/about' },
  ];

  return (
    <>
      {showPromo && !isCheckoutSuccess && <PromoBanner onClose={() => setShowPromo(false)} />}

      <header className={`sticky top-0 z-40 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16 md:h-20">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
              <span className="text-lg">🎨</span>
            </div>
            <span className="text-xl font-extrabold text-gray-900 hidden sm:inline">
              Colori<span className="text-purple-600">Magiques</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  location.pathname === link.path ? 'bg-purple-50 text-purple-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <LanguageSelector />
            <button onClick={() => setIsOpen(true)} className="relative p-2.5 hover:bg-gray-100 rounded-xl transition-colors">
              <ShoppingCart className="w-5 h-5 text-gray-700" />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-gradient-to-r from-purple-600 to-pink-500 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-md">
                  {itemCount}
                </span>
              )}
            </button>
            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2.5 hover:bg-gray-100 rounded-xl">
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden bg-white border-t px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                className={`block px-4 py-2.5 rounded-xl text-sm font-medium ${
                  location.pathname === link.path ? 'bg-purple-50 text-purple-700' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </header>

      <CartSlideOver />
      <ExitIntentPopup />
      {children}
    </>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <LanguageProvider>
          <CartProvider>
            <ScrollToTop />
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/catalog" element={<Catalog />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/checkout/success" element={<Checkout />} />
                <Route path="/about" element={<About />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/legal/terms" element={<LegalPage titleKey="legal.terms" content={termsContent} />} />
                <Route path="/legal/notice" element={<LegalPage titleKey="legal.notice" content={legalNoticeContent} />} />
                <Route path="/legal/privacy" element={<LegalPage titleKey="legal.privacy" content={privacyContent} />} />
                <Route path="/legal/refund" element={<LegalPage titleKey="legal.refund" content={refundContent} />} />
                <Route path="*" element={
                  <div className="min-h-screen flex flex-col items-center justify-center">
                    <span className="text-6xl mb-4">🔍</span>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Page non trouvée</h1>
                    <Link to="/" className="text-purple-600 hover:underline">Retour à l'accueil</Link>
                  </div>
                } />
              </Routes>
            </Layout>
          </CartProvider>
        </LanguageProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

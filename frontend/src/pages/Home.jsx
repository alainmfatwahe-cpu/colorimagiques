// frontend/src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import { ArrowRight, Download, Printer, Palette, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { productsApi } from '@/api/basecolorimag';
import ProductCard from '@/components/shop/ProductCard';
import TrustBadges from '@/components/shop/TrustBadges';
import Testimonials from '@/components/shop/Testimonials';
import Footer from '@/components/shop/Footer';
import SEOHead, { getWebSiteSchema, getOrganizationSchema } from '@/components/SEOHead';
import { motion } from 'framer-motion';

const SITE_URL = window.location.origin;

export default function Home() {
  const { t, lang } = useLanguage();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productsApi.list({ featured: 'true' })
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const benefits = [
    { icon: Download, title: t('benefits.instant'), desc: t('benefits.instantDesc'), gradient: 'from-blue-500 to-cyan-400' },
    { icon: Printer, title: t('benefits.printable'), desc: t('benefits.printableDesc'), gradient: 'from-emerald-500 to-teal-400' },
    { icon: Palette, title: t('benefits.unique'), desc: t('benefits.uniqueDesc'), gradient: 'from-purple-500 to-pink-400' },
    { icon: Sparkles, title: t('benefits.safe'), desc: t('benefits.safeDesc'), gradient: 'from-amber-500 to-orange-400' },
  ];

  const seoJsonLd = [getWebSiteSchema(SITE_URL, lang), getOrganizationSchema(SITE_URL)];

  return (
    <div className="min-h-screen">
      <SEOHead
        title={t('seo.homeTitle')}
        description={t('seo.homeDesc')}
        url={SITE_URL}
        type="website"
        lang={lang}
        jsonLd={seoJsonLd}
      />
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50 py-20 md:py-32 px-4">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-200 rounded-full opacity-20 blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-pink-200 rounded-full opacity-20 blur-3xl" />
        <div className="absolute top-40 right-20 w-48 h-48 bg-yellow-200 rounded-full opacity-30 blur-2xl" />

        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur px-4 py-2 rounded-full text-sm font-medium text-purple-700 shadow-sm mb-8">
              <Sparkles className="w-4 h-4" />
              <span>PDF • 300 DPI • A4</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-gray-900 leading-tight mb-4">
              {t('hero.title')}
              <br />
              <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-amber-500 bg-clip-text text-transparent">
                {t('hero.subtitle')}
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
              {t('hero.description')}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/catalog">
                <button className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white px-8 py-4 rounded-2xl text-lg font-bold shadow-xl shadow-purple-200 hover:shadow-purple-300 transition-all flex items-center gap-2">
                  {t('hero.cta')} <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
            </div>

            <TrustBadges className="mt-12" />
          </motion.div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-10 left-[15%] text-4xl opacity-30 animate-bounce" style={{ animationDelay: '0s' }}>✏️</div>
        <div className="absolute top-32 right-[20%] text-3xl opacity-20 animate-bounce" style={{ animationDelay: '0.5s' }}>🌈</div>
        <div className="absolute bottom-20 left-[25%] text-3xl opacity-25 animate-bounce" style={{ animationDelay: '1s' }}>🎨</div>
        <div className="absolute bottom-32 right-[15%] text-4xl opacity-20 animate-bounce" style={{ animationDelay: '1.5s' }}>⭐</div>
      </section>

      {/* Benefits */}
      <section className="py-16 md:py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((b, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-6 rounded-3xl bg-gray-50 hover:bg-white hover:shadow-xl transition-all duration-300 group border border-transparent hover:border-gray-100"
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${b.gradient} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                  <b.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{b.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{b.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 md:py-24 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('product.featured')} 🌟
            </h2>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="skeleton h-80 rounded-3xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link to="/catalog">
              <button className="px-8 py-3 bg-white border-2 border-purple-200 text-purple-700 rounded-2xl font-bold hover:bg-purple-50 hover:border-purple-300 transition-all">
                {t('catalog.title')} →
              </button>
            </Link>
          </div>
        </div>
      </section>

      <Testimonials />
      <Footer />
    </div>
  );
}

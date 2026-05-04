// frontend/src/pages/Catalog.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { Filter, X, Search } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { productsApi } from '@/api/basecolorimag';
import ProductCard from '@/components/shop/ProductCard';
import Footer from '@/components/shop/Footer';
import SEOHead, { getCollectionSchema } from '@/components/SEOHead';
import { motion, AnimatePresence } from 'framer-motion';

const SITE_URL = window.location.origin;

const AGE_GROUPS = ['3-5', '6-8', '9-10'];
const THEMES = ['animals', 'space', 'dinosaurs', 'princesses', 'nature', 'vehicles', 'fantasy', 'ocean'];

export default function Catalog() {
  const { t, currency, lang } = useLanguage();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [ageFilter, setAgeFilter] = useState('all');
  const [themeFilter, setThemeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    productsApi.list().then(setProducts).catch(console.error).finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let result = [...products];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((p) => p.title?.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q));
    }
    if (ageFilter !== 'all') result = result.filter((p) => p.age_group === ageFilter);
    if (themeFilter !== 'all') result = result.filter((p) => p.theme === themeFilter);

    switch (sortBy) {
      case 'priceLow': result.sort((a, b) => (currency === 'EUR' ? a.price_eur - b.price_eur : a.price_usd - b.price_usd)); break;
      case 'priceHigh': result.sort((a, b) => (currency === 'EUR' ? b.price_eur - a.price_eur : b.price_usd - a.price_usd)); break;
      case 'popular': result.sort((a, b) => (b.download_count || 0) - (a.download_count || 0)); break;
      default: break;
    }
    return result;
  }, [products, search, ageFilter, themeFilter, sortBy, currency]);

  const activeFilters = [ageFilter !== 'all' && ageFilter, themeFilter !== 'all' && themeFilter].filter(Boolean);

  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead
        title={t('seo.catalogTitle')}
        description={t('seo.catalogDesc')}
        url={`${SITE_URL}/catalog`}
        type="website"
        lang={lang}
        jsonLd={getCollectionSchema(filtered, SITE_URL, lang)}
      />
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-amber-500 py-16 px-4 text-center text-white">
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl md:text-5xl font-extrabold mb-4">
          {t('catalog.title')} 🎨
        </motion.h1>
        <p className="text-white/80 max-w-md mx-auto">{filtered.length} {t('catalog.results')}</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search & Sort */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              placeholder={t('nav.search')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-3 rounded-xl border flex items-center gap-2 font-medium text-sm transition-colors ${
              showFilters ? 'bg-purple-50 border-purple-300 text-purple-700' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Filter className="w-4 h-4" />
            {t('catalog.filters')}
            {activeFilters.length > 0 && (
              <span className="bg-purple-600 text-white text-xs px-1.5 py-0.5 rounded-full">{activeFilters.length}</span>
            )}
          </button>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-3 rounded-xl bg-white border border-gray-200 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="newest">{t('catalog.newest')}</option>
            <option value="popular">{t('catalog.mostPopular')}</option>
            <option value="priceLow">{t('catalog.priceLow')}</option>
            <option value="priceHigh">{t('catalog.priceHigh')}</option>
          </select>
        </div>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-6"
            >
              <div className="bg-white rounded-2xl border border-gray-200 p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Age */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t('catalog.age')}</label>
                  <div className="flex flex-wrap gap-2">
                    <button onClick={() => setAgeFilter('all')} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${ageFilter === 'all' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{t('catalog.all')}</button>
                    {AGE_GROUPS.map((age) => (
                      <button key={age} onClick={() => setAgeFilter(age)} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${ageFilter === age ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{age} {t('product.years')}</button>
                    ))}
                  </div>
                </div>
                {/* Theme */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t('catalog.theme')}</label>
                  <div className="flex flex-wrap gap-2">
                    <button onClick={() => setThemeFilter('all')} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${themeFilter === 'all' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{t('catalog.all')}</button>
                    {THEMES.map((th) => (
                      <button key={th} onClick={() => setThemeFilter(th)} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${themeFilter === th ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{t(`themes.${th}`)}</button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Active filters */}
        {activeFilters.length > 0 && (
          <div className="flex items-center gap-2 mb-6">
            {activeFilters.map((f) => (
              <span key={f} className="inline-flex items-center gap-1 bg-purple-100 text-purple-700 text-sm font-medium px-3 py-1 rounded-full">
                {f}
                <button onClick={() => { if (ageFilter === f) setAgeFilter('all'); if (themeFilter === f) setThemeFilter('all'); }}><X className="w-3 h-3" /></button>
              </span>
            ))}
            <button onClick={() => { setAgeFilter('all'); setThemeFilter('all'); setSearch(''); }} className="text-sm text-gray-500 hover:text-red-500 transition-colors">
              Tout effacer
            </button>
          </div>
        )}

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => <div key={i} className="skeleton h-80 rounded-3xl" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <span className="text-6xl mb-4 block">🔍</span>
            <p className="text-xl text-gray-500">{t('catalog.noResults')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filtered.map((product, i) => <ProductCard key={product.id} product={product} index={i} />)}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

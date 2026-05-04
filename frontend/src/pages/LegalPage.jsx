// frontend/src/pages/LegalPage.jsx
// Page générique pour contenu légal (CGV, Mentions, Privacy, Refund) + SEO
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import Footer from '@/components/shop/Footer';
import SEOHead, { getBreadcrumbSchema } from '@/components/SEOHead';
import { ArrowLeft } from 'lucide-react';

const SITE_URL = window.location.origin;

export default function LegalPage({ titleKey, content }) {
  const { t, lang } = useLanguage();
  const location = useLocation();
  const title = t(titleKey);
  const html = typeof content === 'function' ? content(lang) : content[lang] || content.fr;

  const seoTitle = `${title} — ColoriMagiques`;
  const seoDesc = `${title} — ColoriMagiques. E-books de coloriage pour enfants.`;

  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead
        title={seoTitle}
        description={seoDesc}
        url={`${SITE_URL}${location.pathname}`}
        type="article"
        lang={lang}
        jsonLd={getBreadcrumbSchema([
          { name: t('nav.home'), url: '/' },
          { name: title },
        ], SITE_URL)}
      />

      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-2 text-sm text-gray-500">
          <Link to="/" className="hover:text-purple-600">{t('nav.home')}</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">{title}</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-purple-600 mb-6 transition-colors text-sm">
          <ArrowLeft className="w-4 h-4" /> {t('nav.home')}
        </Link>

        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-8">{title}</h1>

        <div
          className="prose prose-gray max-w-none prose-headings:font-display prose-headings:text-gray-900 prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-4 prose-h3:text-lg prose-p:text-gray-600 prose-p:leading-relaxed prose-li:text-gray-600 prose-strong:text-gray-800 prose-a:text-purple-600 hover:prose-a:text-purple-800"
          dangerouslySetInnerHTML={{ __html: html }}
        />

        <div className="mt-12 pt-8 border-t text-sm text-gray-400">
          {t('legal.lastUpdated')}: 16 février 2026
        </div>
      </div>

      <Footer />
    </div>
  );
}

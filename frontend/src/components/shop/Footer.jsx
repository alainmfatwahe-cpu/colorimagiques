// frontend/src/components/shop/Footer.jsx
import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';
import { colorimagiques } from '@/api/basecolorimag';

export default function Footer() {
  const { t, language } = useLanguage();
  const [email, setEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState(null); // 'success' | 'error' | 'already'
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!email || isSubmitting) return;
    setIsSubmitting(true);
    setNewsletterStatus(null);
    try {
      const result = await colorimagiques.newsletter.subscribe(email, language);
      if (result.message === 'already_subscribed') {
        setNewsletterStatus('already');
      } else {
        setNewsletterStatus('success');
        setEmail('');
      }
    } catch {
      setNewsletterStatus('error');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setNewsletterStatus(null), 5000);
    }
  };

  return (
    <footer className="bg-gray-900 text-gray-300 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Logo & description */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-md">
                <span className="text-lg">🎨</span>
              </div>
              <span className="text-xl font-extrabold text-white">
                Colori<span className="text-purple-400">Magiques</span>
              </span>
            </div>
            <p className="text-sm text-gray-400 max-w-sm leading-relaxed mb-6">
              E-books de coloriage pour enfants de 3 à 10 ans. Téléchargement instantané, impression illimitée.
            </p>

            {/* Newsletter */}
            <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('footer.emailPlaceholder')}
                className="flex-1 px-4 py-2.5 bg-gray-800 rounded-xl border border-gray-700 text-sm focus:outline-none focus:border-purple-500 text-white"
                required
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white rounded-xl text-sm font-medium transition-colors"
              >
                {isSubmitting ? '...' : t('footer.subscribe')}
              </button>
            </form>
            {newsletterStatus === 'success' && (
              <p className="text-green-400 text-xs mt-2">✅ {language === 'fr' ? 'Inscription réussie !' : 'Successfully subscribed!'}</p>
            )}
            {newsletterStatus === 'already' && (
              <p className="text-yellow-400 text-xs mt-2">📬 {language === 'fr' ? 'Vous êtes déjà inscrit(e) !' : 'You are already subscribed!'}</p>
            )}
            {newsletterStatus === 'error' && (
              <p className="text-red-400 text-xs mt-2">❌ {language === 'fr' ? 'Erreur, réessayez.' : 'Error, please try again.'}</p>
            )}
          </div>

          {/* Liens */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-purple-400 transition-colors">{t('nav.home')}</Link></li>
              <li><Link to="/catalog" className="hover:text-purple-400 transition-colors">{t('nav.catalog')}</Link></li>
              <li><Link to="/about" className="hover:text-purple-400 transition-colors">{t('nav.about')}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">{t('legal.notice') || 'Légal'}</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/legal/terms" className="hover:text-purple-400 transition-colors">{t('footer.terms')}</Link></li>
              <li><Link to="/legal/notice" className="hover:text-purple-400 transition-colors">{t('legal.notice')}</Link></li>
              <li><Link to="/legal/privacy" className="hover:text-purple-400 transition-colors">{t('footer.privacy')}</Link></li>
              <li><Link to="/legal/refund" className="hover:text-purple-400 transition-colors">{t('footer.refund')}</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} ColoriMagiques — {t('footer.rights')}
          </p>
          <div className="flex items-center gap-4">
            <a href="https://www.instagram.com/colorimagiques" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-pink-400 transition-colors" aria-label="Instagram">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            </a>
            <a href="https://www.facebook.com/colorimagiques" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors" aria-label="Facebook">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
            <a href="https://www.pinterest.com/colorimagiques" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-red-400 transition-colors" aria-label="Pinterest">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12.017 24 18.635 24 24.003 18.633 24.003 12.013 24.003 5.393 18.635.026 12.017.026V0z"/></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

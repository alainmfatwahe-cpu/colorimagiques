// frontend/src/pages/ProductDetail.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { ShoppingCart, Check, FileText, Gift, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { productsApi, reviewsApi } from '@/api/basecolorimag';
import TrustBadges from '@/components/shop/TrustBadges';
import ProductCard from '@/components/shop/ProductCard';
import Footer from '@/components/shop/Footer';
import SEOHead, { getProductSchema, getBreadcrumbSchema } from '@/components/SEOHead';
import { motion } from 'framer-motion';

const SITE_URL = window.location.origin;

export default function ProductDetail() {
  const { id } = useParams();
  const { t, getLocalizedField, formatPrice, getComparePrice, lang, currency } = useLanguage();
  const { addItem, isInCart } = useCart();
  const [product, setProduct] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);
  const [activeTab, setActiveTab] = useState('description');
  const [reviews, setReviews] = useState([]);
  const [reviewForm, setReviewForm] = useState({ author_name: '', customer_email: '', order_number: '', rating: 0, comment: '' });
  const [reviewHover, setReviewHover] = useState(0);
  const [reviewStatus, setReviewStatus] = useState(null); // null | 'success' | 'verified' | 'error' | 'duplicate'
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const inCart = isInCart(parseInt(id));

  useEffect(() => {
    setLoading(true);
    setCurrentImage(0);
    setReviewStatus(null);
    setReviewForm({ author_name: '', customer_email: '', order_number: '', rating: 0, comment: '' });
    productsApi.get(id)
      .then((data) => {
        setProduct(data);
        if (data.id) {
          productsApi.similar(data.id).then(setSimilar).catch(() => {});
          reviewsApi.list(data.id).then(setReviews).catch(() => setReviews(data.reviews || []));
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewForm.rating || !reviewForm.author_name.trim()) return;
    setReviewSubmitting(true);
    setReviewStatus(null);
    try {
      const res = await reviewsApi.create({
        product_id: parseInt(id),
        author_name: reviewForm.author_name.trim(),
        rating: reviewForm.rating,
        comment: reviewForm.comment.trim() || undefined,
        language: lang,
        customer_email: reviewForm.customer_email.trim() || undefined,
        order_number: reviewForm.order_number.trim() || undefined,
      });
      if (res.verified_purchase) {
        setReviewStatus('verified');
        // Recharger les reviews (l'avis vérifié est auto-approuvé)
        reviewsApi.list(parseInt(id)).then(setReviews).catch(() => {});
      } else {
        setReviewStatus('success');
      }
      setReviewForm({ author_name: '', customer_email: '', order_number: '', rating: 0, comment: '' });
    } catch (err) {
      if (err.response?.status === 409) {
        setReviewStatus('duplicate');
      } else {
        setReviewStatus('error');
      }
    } finally {
      setReviewSubmitting(false);
    }
  };

  const allImages = useMemo(() => {
    if (!product) return [];
    const imgs = [];
    if (product.cover_image) imgs.push(product.cover_image);
    if (product.preview_images?.length) imgs.push(...product.preview_images);
    return imgs;
  }, [product]);

  const similarFiltered = similar.filter((p) => p.id !== parseInt(id)).slice(0, 4);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <p className="text-xl text-gray-500">Product not found</p>
        <Link to="/catalog" className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-xl">← {t('nav.catalog')}</Link>
      </div>
    );
  }

  const comparePrice = getComparePrice(product);
  const productTitle = getLocalizedField(product, 'title');
  const seoTitle = t('seo.productTitle').replace('{title}', productTitle);
  const seoDesc = t('seo.productDesc')
    .replace('{title}', productTitle)
    .replace('{pages}', product.page_count || '')
    .replace('{age}', product.age_group || '');
  const seoJsonLd = [
    getProductSchema(product, SITE_URL, currency),
    getBreadcrumbSchema([
      { name: t('nav.home'), url: '/' },
      { name: t('nav.catalog'), url: '/catalog' },
      { name: productTitle },
    ], SITE_URL),
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead
        title={seoTitle}
        description={seoDesc}
        url={`${SITE_URL}/product/${product.id}`}
        image={product.cover_image ? `${SITE_URL}${product.cover_image}` : undefined}
        type="product"
        lang={lang}
        jsonLd={seoJsonLd}
      />
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-2 text-sm text-gray-500">
          <Link to="/" className="hover:text-purple-600">{t('nav.home')}</Link>
          <span>/</span>
          <Link to="/catalog" className="hover:text-purple-600">{t('nav.catalog')}</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium truncate">{getLocalizedField(product, 'title')}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Image Gallery */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
              <div className="relative aspect-[3/4] bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50">
                {allImages.length > 0 ? (
                  <img src={allImages[currentImage]} alt="" className="w-full h-full object-contain p-4" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-8xl">🎨</div>
                )}
                {allImages.length > 1 && (
                  <>
                    <button onClick={() => setCurrentImage((p) => (p - 1 + allImages.length) % allImages.length)} className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur rounded-full shadow-lg flex items-center justify-center hover:bg-white">
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button onClick={() => setCurrentImage((p) => (p + 1) % allImages.length)} className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur rounded-full shadow-lg flex items-center justify-center hover:bg-white">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>
              {allImages.length > 1 && (
                <div className="flex gap-2 p-4 overflow-x-auto">
                  {allImages.map((img, i) => (
                    <button key={i} onClick={() => setCurrentImage(i)} className={`w-16 h-20 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-colors ${currentImage === i ? 'border-purple-500' : 'border-gray-200'}`}>
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col">
            {product.badge && product.badge !== '' && (
              <span className="self-start bg-purple-100 text-purple-700 text-sm font-bold px-3 py-1 rounded-full mb-3">
                {t(`product.${product.badge}`)}
              </span>
            )}

            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
              {getLocalizedField(product, 'title')}
            </h1>

            <div className="flex items-center gap-2 mb-4">
              <div className="flex">{[...Array(5)].map((_, i) => <Star key={i} className={`w-5 h-5 ${i < Math.round(product.average_rating || 5) ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />)}</div>
              <span className="text-sm text-gray-500">({product.review_count || 0} {t('product.reviews').toLowerCase()})</span>
            </div>

            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-4xl font-extrabold text-purple-700">{formatPrice(product)}</span>
              {comparePrice && <span className="text-xl text-gray-400 line-through">{comparePrice}</span>}
            </div>

            {product.short_description && (
              <p className="text-gray-600 mb-6 leading-relaxed">{product.short_description}</p>
            )}

            {/* Specs pills */}
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-xl text-sm font-medium">📄 {product.page_count} {t('product.pages')}</span>
              <span className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-xl text-sm font-medium">🖨️ {product.dpi || 300} DPI</span>
              <span className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-xl text-sm font-medium">👶 {product.age_group} {t('product.years')}</span>
              <span className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-xl text-sm font-medium">📐 A4 PDF</span>
            </div>

            {/* Included */}
            <div className="bg-emerald-50 rounded-2xl p-4 mb-6 border border-emerald-100">
              <h4 className="font-bold text-emerald-800 mb-2">{t('product.included')}</h4>
              <div className="flex items-center gap-2 text-sm text-emerald-700 mb-1">
                <FileText className="w-4 h-4" /> {t('product.mainPdf')} ({product.page_count} {t('product.pages')})
              </div>
              {product.bonus_filename && (
                <div className="flex items-center gap-2 text-sm text-emerald-700">
                  <Gift className="w-4 h-4" /> {t('product.bonusFile')}
                </div>
              )}
            </div>

            {/* Add to cart */}
            <button
              onClick={() => { if (!inCart) addItem(product); }}
              disabled={inCart}
              className={`w-full py-4 rounded-2xl text-lg font-bold transition-all flex items-center justify-center gap-3 ${
                inCart
                  ? 'bg-emerald-100 text-emerald-700 border-2 border-emerald-200'
                  : 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-xl shadow-purple-200 hover:shadow-purple-300 hover:from-purple-700 hover:to-pink-600'
              }`}
            >
              {inCart ? <><Check className="w-5 h-5" /> {t('product.inCart')}</> : <><ShoppingCart className="w-5 h-5" /> {t('product.addToCart')}</>}
            </button>

            <TrustBadges className="mt-6" />
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="mt-16">
          <div className="flex gap-1 border-b mb-6">
            {['description', 'specs', 'reviews'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 ${
                  activeTab === tab ? 'border-purple-600 text-purple-700' : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {t(`product.${tab}`)}
              </button>
            ))}
          </div>

          {activeTab === 'description' && (
            <div className="prose max-w-none text-gray-600 leading-relaxed">
              <p>{getLocalizedField(product, 'description')}</p>
            </div>
          )}

          {activeTab === 'specs' && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-2xl p-4 border"><p className="text-xs text-gray-400 mb-1">{t('product.format')}</p><p className="font-bold">PDF A4</p></div>
              <div className="bg-white rounded-2xl p-4 border"><p className="text-xs text-gray-400 mb-1">{t('product.pages')}</p><p className="font-bold">{product.page_count}</p></div>
              <div className="bg-white rounded-2xl p-4 border"><p className="text-xs text-gray-400 mb-1">DPI</p><p className="font-bold">{product.dpi || 300}</p></div>
              <div className="bg-white rounded-2xl p-4 border"><p className="text-xs text-gray-400 mb-1">{t('product.ageGroup')}</p><p className="font-bold">{product.age_group} {t('product.years')}</p></div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-6">
              {/* Formulaire de soumission d'avis */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h4 className="font-bold text-gray-900 mb-4 text-lg">{t('product.writeReview')}</h4>

                {/* Message de statut */}
                {reviewStatus === 'verified' && (
                  <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm flex items-center gap-2">
                    <Check className="w-4 h-4" /> {t('product.reviewVerified')}
                  </div>
                )}
                {reviewStatus === 'success' && (
                  <div className="mb-4 p-3 bg-blue-50 border border-blue-200 text-blue-800 rounded-xl text-sm">
                    {t('product.reviewSubmitted')}
                  </div>
                )}
                {reviewStatus === 'duplicate' && (
                  <div className="mb-4 p-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-sm">
                    {t('product.reviewAlreadyExists')}
                  </div>
                )}
                {reviewStatus === 'error' && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 rounded-xl text-sm">
                    Une erreur est survenue. Veuillez réessayer.
                  </div>
                )}

                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  {/* Star rating */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">{t('product.starRating')} *</label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star} type="button"
                          onMouseEnter={() => setReviewHover(star)}
                          onMouseLeave={() => setReviewHover(0)}
                          onClick={() => setReviewForm((f) => ({ ...f, rating: star }))}
                          className="p-0.5 transition-transform hover:scale-110"
                        >
                          <Star className={`w-7 h-7 ${(reviewHover || reviewForm.rating) >= star ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Nom */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">{t('product.reviewName')} *</label>
                    <input
                      type="text" required maxLength={100}
                      value={reviewForm.author_name}
                      onChange={(e) => setReviewForm((f) => ({ ...f, author_name: e.target.value }))}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-300 focus:border-purple-400 outline-none text-sm"
                    />
                  </div>

                  {/* Email + N° commande (pour vérification) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">{t('product.reviewEmail')}</label>
                      <input
                        type="email"
                        value={reviewForm.customer_email}
                        onChange={(e) => setReviewForm((f) => ({ ...f, customer_email: e.target.value }))}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-300 focus:border-purple-400 outline-none text-sm"
                        placeholder="exemple@email.com"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">{t('product.reviewOrder')}</label>
                      <input
                        type="text"
                        value={reviewForm.order_number}
                        onChange={(e) => setReviewForm((f) => ({ ...f, order_number: e.target.value }))}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-300 focus:border-purple-400 outline-none text-sm"
                        placeholder="CM-XXXXXX"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 -mt-2">
                    {lang === 'fr' ? 'Fournir votre email et n° de commande permet de vérifier votre achat et publier votre avis immédiatement.' :
                     lang === 'en' ? 'Providing your email and order number verifies your purchase and publishes your review immediately.' :
                     lang === 'es' ? 'Proporcionar su email y n° de pedido verifica su compra y publica su opinión inmediatamente.' :
                     'Ihre E-Mail und Bestellnummer ermöglichen die Verifizierung und sofortige Veröffentlichung Ihrer Bewertung.'}
                  </p>

                  {/* Commentaire */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">{t('product.reviewComment')}</label>
                    <textarea
                      rows={3} maxLength={1000}
                      value={reviewForm.comment}
                      onChange={(e) => setReviewForm((f) => ({ ...f, comment: e.target.value }))}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-300 focus:border-purple-400 outline-none text-sm resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={!reviewForm.rating || !reviewForm.author_name.trim() || reviewSubmitting}
                    className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl font-medium hover:from-purple-700 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    {reviewSubmitting ? '...' : t('product.reviewSubmit')}
                  </button>
                </form>
              </div>

              {/* Liste des avis */}
              {reviews.length === 0 ? (
                <p className="text-gray-500 text-center py-8">{t('product.noReviews')}</p>
              ) : (
                reviews.map((r) => (
                  <div key={r.id} className="bg-white rounded-2xl p-5 border">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <div className="flex">{[...Array(5)].map((_, i) => <Star key={i} className={`w-4 h-4 ${i < r.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />)}</div>
                      <span className="font-medium text-sm text-gray-900">{r.author_name}</span>
                      {r.verified_purchase ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <Check className="w-3 h-3" /> {t('product.verifiedPurchase')}
                        </span>
                      ) : null}
                    </div>
                    {r.comment && <p className="text-gray-600 text-sm">{r.comment}</p>}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Similar Products */}
        {similarFiltered.length > 0 && (
          <div className="mt-16">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">{t('product.similar')}</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {similarFiltered.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

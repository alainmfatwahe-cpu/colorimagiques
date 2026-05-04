// frontend/src/pages/Checkout.jsx
import React, { useState, useEffect } from 'react';
import { ShieldCheck, Lock, ArrowLeft, Loader2, CheckCircle2, Download, Mail } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { ordersApi } from '@/api/basecolorimag';
import TrustBadges from '@/components/shop/TrustBadges';
import { motion } from 'framer-motion';

export default function Checkout() {
  const { t, formatPrice, getRawPrice, currency, lang } = useLanguage();
  const { items, clearCart } = useCart();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [promoStatus, setPromoStatus] = useState(''); // 'valid', 'invalid', ''
  const [isProcessing, setIsProcessing] = useState(false);
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');

  // Vérifier si on revient de Stripe (success ou cancel)
  const sessionId = searchParams.get('session_id');
  const canceled = searchParams.get('canceled');

  useEffect(() => {
    if (sessionId) {
      ordersApi.verify(sessionId)
        .then((data) => {
          if (data.status === 'paid' || data.status === 'delivered') {
            setOrder(data);
            clearCart();
          }
        })
        .catch(console.error);
    }
  }, [sessionId]);

  const subtotal = items.reduce((sum, item) => sum + getRawPrice(item.product), 0);
  const discountAmount = subtotal * (discount / 100);
  const total = subtotal - discountAmount;
  const symbol = currency === 'EUR' ? '€' : '$';

  const applyPromo = async () => {
    if (!promoCode.trim()) return;
    try {
      const result = await ordersApi.validatePromo(promoCode);
      if (result.valid) {
        setDiscount(result.discount);
        setPromoStatus('valid');
      } else {
        setDiscount(0);
        setPromoStatus('invalid');
      }
    } catch {
      setDiscount(0);
      setPromoStatus('invalid');
    }
  };

  const handleCheckout = async () => {
    if (!email || !name) {
      setError('Veuillez remplir tous les champs');
      return;
    }
    setIsProcessing(true);
    setError('');

    try {
      const result = await ordersApi.createCheckout({
        items: items.map((i) => ({ product_id: i.product.id })),
        customerEmail: email,
        customerName: name,
        currency,
        promoCode: promoCode || undefined,
        lang,
      });

      // Rediriger vers Stripe Checkout
      if (result.url) {
        window.location.href = result.url;
      } else {
        setError(t('checkout.stripeConfigError') || 'Erreur de configuration du paiement');
      }
    } catch (err) {
      const serverError = err.response?.data?.error || '';
      if (serverError.includes('Stripe') || serverError.includes('configuration') || err.response?.status === 503) {
        setError(t('checkout.stripeConfigError') || 'Le système de paiement est en cours de configuration. Veuillez réessayer plus tard.');
      } else {
        setError(serverError || t('checkout.genericError') || 'Erreur lors du paiement');
      }
      setIsProcessing(false);
    }
  };

  // ─── Page de confirmation ───
  if (order) {
    const dlLinks = order.download_links || [];
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl shadow-xl max-w-lg w-full p-8 text-center"
        >
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('confirmation.title')}</h1>
          <p className="text-gray-600 mb-2">{t('confirmation.thanks')}</p>
          <p className="text-sm text-gray-500 mb-6">
            {t('confirmation.orderNumber')}: <strong>{order.order_number}</strong>
          </p>

          <div className="bg-purple-50 rounded-2xl p-4 mb-6 text-left">
            <div className="flex items-center gap-2 mb-3">
              <Mail className="w-5 h-5 text-purple-600" />
              <p className="text-sm text-gray-600">{t('confirmation.emailSent')} <strong>{order.customer_email}</strong></p>
            </div>

            {dlLinks.length > 0 && (
              <div className="space-y-2">
                {dlLinks.map((dl, i) => (
                  <a
                    key={i}
                    href={dl.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-white rounded-xl p-3 hover:bg-purple-100 transition-colors"
                  >
                    <Download className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-medium text-purple-700">{dl.product_title || t('confirmation.download')}</span>
                  </a>
                ))}
              </div>
            )}
          </div>

          <Link to="/">
            <button className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white py-3 rounded-2xl font-bold hover:from-purple-700 hover:to-pink-600 transition-all">
              {t('confirmation.backHome')}
            </button>
          </Link>
        </motion.div>
      </div>
    );
  }

  // ─── Panier vide ───
  if (items.length === 0 && !sessionId) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <span className="text-6xl mb-4">🛒</span>
        <p className="text-xl text-gray-500 mb-4">{t('cart.empty')}</p>
        <Link to="/catalog">
          <button className="px-6 py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition-colors">
            {t('cart.continueShopping')}
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Link to="/catalog" className="inline-flex items-center gap-2 text-gray-500 hover:text-purple-600 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> {t('cart.continueShopping')}
        </Link>

        {canceled && (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl p-4 mb-6">
            {t('checkout.canceled')}
          </div>
        )}

        <h1 className="text-3xl font-bold text-gray-900 mb-8">{t('checkout.title')}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Formulaire */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-4">📧 Contact</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('checkout.email')}</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="email@exemple.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('checkout.name')}</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Jean Dupont" />
                </div>
              </div>
            </div>

            {/* Code promo */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-4">🏷️ {t('cart.promoCode')}</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => { setPromoCode(e.target.value); setPromoStatus(''); }}
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 uppercase"
                  placeholder="BIENVENUE"
                />
                <button onClick={applyPromo} className="px-6 py-3 bg-purple-100 text-purple-700 rounded-xl font-medium hover:bg-purple-200 transition-colors">
                  {t('cart.apply')}
                </button>
              </div>
              {promoStatus === 'valid' && <p className="text-emerald-600 text-sm mt-2">✓ -{discount}% appliqué !</p>}
              {promoStatus === 'invalid' && <p className="text-red-500 text-sm mt-2">✗ Code invalide</p>}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4">
                <div className="flex items-start gap-3">
                  <span className="text-xl">⚠️</span>
                  <div>
                    <p className="font-medium">{error}</p>
                    {error.includes('configuration') || error.includes('configuré') || error.includes('configuración') || error.includes('konfiguriert') ? (
                      <p className="text-xs text-red-500 mt-1">
                        {lang === 'fr' ? 'Les clés Stripe doivent être configurées dans le fichier .env du backend.' :
                         lang === 'en' ? 'Stripe keys must be configured in the backend .env file.' :
                         lang === 'es' ? 'Las claves de Stripe deben configurarse en el archivo .env del backend.' :
                         'Stripe-Schlüssel müssen in der .env-Datei des Backends konfiguriert werden.'}
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>
            )}

            {/* Paiement */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <div className="flex items-center gap-2 mb-4">
                <Lock className="w-5 h-5 text-purple-600" />
                <h3 className="font-bold text-gray-900">💳 {t('checkout.secure')}</h3>
              </div>
              <p className="text-sm text-gray-500 mb-4">Vous serez redirigé vers Stripe pour effectuer le paiement de manière sécurisée.</p>
              <button
                onClick={handleCheckout}
                disabled={isProcessing || !email || !name}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white py-4 rounded-2xl font-bold text-lg hover:from-purple-700 hover:to-pink-600 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isProcessing ? <><Loader2 className="w-5 h-5 animate-spin" /> {t('checkout.processing')}</> : <>{t('checkout.pay')} — {total.toFixed(2)}{symbol}</>}
              </button>
            </div>

            <TrustBadges />
          </div>

          {/* Récapitulatif */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-6 border border-gray-200 sticky top-24">
              <h3 className="font-bold text-gray-900 mb-4">{t('checkout.orderSummary')}</h3>
              <div className="space-y-3 mb-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="w-14 h-18 rounded-xl overflow-hidden bg-purple-50 flex-shrink-0">
                      {item.product.cover_image ? <img src={item.product.cover_image} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center">🎨</div>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.product.title}</p>
                      <p className="text-sm text-purple-600 font-bold">{formatPrice(item.product)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm"><span className="text-gray-500">{t('cart.subtotal')}</span><span>{subtotal.toFixed(2)}{symbol}</span></div>
                {discount > 0 && <div className="flex justify-between text-sm text-emerald-600"><span>{t('cart.discount')} (-{discount}%)</span><span>-{discountAmount.toFixed(2)}{symbol}</span></div>}
                <div className="flex justify-between text-lg font-bold border-t pt-2"><span>{t('cart.total')}</span><span className="text-purple-700">{total.toFixed(2)}{symbol}</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

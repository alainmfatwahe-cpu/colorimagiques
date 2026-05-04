// backend/src/services/stripeService.js
// Service Stripe : création de sessions Checkout et gestion webhooks
import stripe from '../config/stripe.js';
import dotenv from 'dotenv';
dotenv.config();

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

/**
 * Crée une session Stripe Checkout pour une commande
 * @param {Object} params - { items, customerEmail, currency, orderId, promoCode, discountPercent, lang }
 * @returns {Object} - { sessionId, url }
 */
export async function createCheckoutSession({
  items,
  customerEmail,
  currency = 'eur',
  orderId,
  promoCode,
  discountPercent,
  lang = 'fr',
}) {
  // Construire les line_items Stripe
  const lineItems = items.map((item) => ({
    price_data: {
      currency: currency.toLowerCase(),
      product_data: {
        name: item.product_title,
        description: `E-book PDF — ${item.page_count || ''} pages`,
        images: item.cover_image ? [`${FRONTEND_URL}${item.cover_image}`] : [],
      },
      unit_amount: Math.round(item.price * 100), // Stripe utilise les centimes
    },
    quantity: 1,
  }));

  // Options de la session
  const sessionParams = {
    payment_method_types: ['card'],
    mode: 'payment',
    customer_email: customerEmail,
    line_items: lineItems,
    success_url: `${FRONTEND_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${FRONTEND_URL}/checkout?canceled=true`,
    metadata: {
      order_id: String(orderId),
      promo_code: promoCode || '',
      discount_percent: String(discountPercent || 0),
      lang,
    },
    locale: lang === 'fr' ? 'fr' : lang === 'es' ? 'es' : lang === 'de' ? 'de' : 'en',
  };

  // Appliquer un coupon Stripe si réduction
  if (discountPercent > 0) {
    // Créer un coupon unique à la volée
    const coupon = await stripe.coupons.create({
      percent_off: discountPercent,
      duration: 'once',
      name: promoCode || `DISCOUNT_${discountPercent}`,
    });
    sessionParams.discounts = [{ coupon: coupon.id }];
  }

  const session = await stripe.checkout.sessions.create(sessionParams);

  return {
    sessionId: session.id,
    url: session.url,
  };
}

/**
 * Récupère les détails d'une session Stripe Checkout
 */
export async function getCheckoutSession(sessionId) {
  return stripe.checkout.sessions.retrieve(sessionId, {
    expand: ['line_items', 'payment_intent'],
  });
}

/**
 * Vérifie la signature d'un webhook Stripe
 */
export function constructWebhookEvent(payload, signature) {
  return stripe.webhooks.constructEvent(
    payload,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET
  );
}

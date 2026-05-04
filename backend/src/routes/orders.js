// backend/src/routes/orders.js
// Routes API Commandes — Stripe Checkout + webhooks + admin
import { Router } from 'express';
import db from '../config/database.js';
import { requireAuth } from '../middleware/auth.js';
import { createCheckoutSession, getCheckoutSession, constructWebhookEvent } from '../services/stripeService.js';
import { generateDownloadLinks, validateDownloadToken } from '../services/downloadService.js';
import { sendOrderConfirmation } from '../services/emailService.js';
import express from 'express';

const router = Router();

/**
 * POST /api/orders/create-checkout
 * Crée une commande en statut "pending" et une session Stripe Checkout
 * Body: { items: [{product_id, quantity}], customerEmail, customerName, currency, promoCode, lang }
 */
router.post('/create-checkout', async (req, res) => {
  try {
    const { items, customerEmail, customerName, currency = 'EUR', promoCode, lang = 'fr' } = req.body;

    if (!items?.length || !customerEmail || !customerName) {
      return res.status(400).json({ error: 'Items, email et nom requis' });
    }

    // Récupérer les produits de la BDD
    const productIds = items.map((i) => i.product_id);
    const products = await db('products').whereIn('id', productIds);

    if (products.length !== items.length) {
      return res.status(400).json({ error: 'Un ou plusieurs produits introuvables' });
    }

    // Vérifier le code promo
    let discountPercent = 0;
    if (promoCode) {
      const promo = await db('promo_codes')
        .where('code', promoCode.toUpperCase())
        .where('is_active', true)
        .first();

      if (promo) {
        if (promo.expires_at && new Date(promo.expires_at) < new Date()) {
          return res.status(400).json({ error: 'Code promo expiré' });
        }
        if (promo.max_uses && promo.use_count >= promo.max_uses) {
          return res.status(400).json({ error: 'Code promo épuisé' });
        }
        discountPercent = parseFloat(promo.discount_percent);
      } else {
        return res.status(400).json({ error: 'Code promo invalide' });
      }
    }

    // Calculer le total
    const priceField = currency === 'EUR' ? 'price_eur' : 'price_usd';
    const orderItems = products.map((p) => ({
      product_id: p.id,
      product_title: p.title,
      price: parseFloat(p[priceField]),
      currency,
      page_count: p.page_count,
      cover_image: p.cover_image,
      pdf_filename: p.pdf_filename,
    }));

    const subtotal = orderItems.reduce((sum, i) => sum + i.price, 0);
    const totalAmount = subtotal * (1 - discountPercent / 100);

    // Créer la commande en BDD (statut: pending)
    const orderNumber = `CM-${Date.now().toString(36).toUpperCase()}`;
    const [orderId] = await db('orders').insert({
      order_number: orderNumber,
      customer_email: customerEmail,
      customer_name: customerName,
      items: JSON.stringify(orderItems),
      total_amount: Math.round(totalAmount * 100) / 100,
      currency,
      status: 'pending',
      promo_code: promoCode || null,
      discount_percent: discountPercent,
      language: lang,
    });

    // Créer la session Stripe Checkout
    const { sessionId, url } = await createCheckoutSession({
      items: orderItems,
      customerEmail,
      currency,
      orderId,
      promoCode,
      discountPercent,
      lang,
    });

    // Sauvegarder le session ID Stripe
    await db('orders').where('id', orderId).update({ stripe_session_id: sessionId });

    res.json({ sessionId, url, orderNumber });
  } catch (err) {
    console.error('Create checkout error:', err);
    
    // Détection d'erreur Stripe spécifique
    if (err.type === 'StripeAuthenticationError' || err.statusCode === 401) {
      return res.status(503).json({ 
        error: 'Stripe non configuré — clé API invalide. Contactez l\'administrateur.',
        code: 'STRIPE_AUTH_ERROR'
      });
    }
    if (err.type?.startsWith('Stripe')) {
      return res.status(502).json({ 
        error: `Erreur Stripe : ${err.message}`,
        code: 'STRIPE_ERROR'
      });
    }
    
    res.status(500).json({ error: 'Erreur création de la session de paiement' });
  }
});

/**
 * POST /api/orders/webhook
 * Webhook Stripe — traite les événements de paiement
 * IMPORTANT : doit recevoir le body brut (raw), pas parsé en JSON
 */
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];

  try {
    const event = constructWebhookEvent(req.body, sig);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const orderId = session.metadata?.order_id;

      if (orderId) {
        // Marquer la commande comme payée
        await db('orders').where('id', orderId).update({
          status: 'paid',
          payment_method: 'stripe',
          stripe_payment_intent: session.payment_intent,
          updated_at: db.fn.now(),
        });

        // Incrémenter l'utilisation du code promo
        const order = await db('orders').where('id', orderId).first();
        if (order?.promo_code) {
          await db('promo_codes').where('code', order.promo_code).increment('use_count', 1);
        }

        // Générer les liens de téléchargement
        const orderItems = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
        const downloadLinks = await generateDownloadLinks(orderId, orderItems);

        // Sauvegarder les liens dans la commande
        await db('orders').where('id', orderId).update({
          download_links: JSON.stringify(downloadLinks),
          status: 'delivered',
        });

        // Envoyer l'email de confirmation
        await sendOrderConfirmation({
          order: { ...order, total_amount: parseFloat(order.total_amount) },
          downloadLinks,
          lang: order.language || 'fr',
        });

        console.log(`✅ Commande ${order.order_number} traitée avec succès`);
      }
    }

    res.json({ received: true });
  } catch (err) {
    console.error('Webhook error:', err.message);
    res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }
});

/**
 * GET /api/orders/verify/:sessionId
 * Vérifie le statut d'un paiement Stripe et retourne les infos commande
 */
router.get('/verify/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const order = await db('orders').where('stripe_session_id', sessionId).first();

    if (!order) return res.status(404).json({ error: 'Commande non trouvée' });

    // Parser les JSON
    order.items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
    order.download_links = typeof order.download_links === 'string'
      ? JSON.parse(order.download_links) : order.download_links || [];

    res.json(order);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

/**
 * POST /api/orders/validate-promo
 * Vérifie un code promo et retourne le pourcentage de réduction
 */
router.post('/validate-promo', async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).json({ error: 'Code requis' });

    const promo = await db('promo_codes')
      .where('code', code.toUpperCase())
      .where('is_active', true)
      .first();

    if (!promo) return res.json({ valid: false, discount: 0 });
    if (promo.expires_at && new Date(promo.expires_at) < new Date()) {
      return res.json({ valid: false, discount: 0, reason: 'expired' });
    }
    if (promo.max_uses && promo.use_count >= promo.max_uses) {
      return res.json({ valid: false, discount: 0, reason: 'exhausted' });
    }

    res.json({ valid: true, discount: parseFloat(promo.discount_percent), code: promo.code });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ─── Routes Admin ───

/**
 * GET /api/orders/admin/all
 * Liste toutes les commandes — Admin uniquement
 */
router.get('/admin/all', requireAuth, async (req, res) => {
  try {
    const orders = await db('orders').orderBy('created_at', 'desc').limit(200);
    res.json(orders.map((o) => ({
      ...o,
      items: typeof o.items === 'string' ? JSON.parse(o.items) : o.items,
      download_links: typeof o.download_links === 'string' ? JSON.parse(o.download_links) : o.download_links || [],
    })));
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

/**
 * GET /api/orders/admin/stats
 * Statistiques des commandes — Admin uniquement
 */
router.get('/admin/stats', requireAuth, async (req, res) => {
  try {
    const totalOrders = await db('orders').count('* as count').first();
    const paidOrders = await db('orders').where('status', 'paid').orWhere('status', 'delivered').count('* as count').first();
    const revenue = await db('orders').where('status', 'delivered').orWhere('status', 'paid').sum('total_amount as total').first();
    const totalProducts = await db('products').count('* as count').first();
    const totalDownloads = await db('products').sum('download_count as total').first();

    res.json({
      totalOrders: totalOrders.count,
      paidOrders: paidOrders.count,
      totalRevenue: parseFloat(revenue.total) || 0,
      totalProducts: totalProducts.count,
      totalDownloads: totalDownloads.total || 0,
    });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;

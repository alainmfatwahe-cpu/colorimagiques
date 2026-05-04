// backend/src/routes/reviews.js
// Routes API Avis clients — avec vérification d'achat et modération admin
import { Router } from 'express';
import db from '../config/database.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

/**
 * GET /api/reviews/:productId
 * Liste les avis approuvés d'un produit (public)
 * Retourne aussi le flag verified_purchase
 */
router.get('/:productId', async (req, res) => {
  try {
    const reviews = await db('reviews')
      .where({ product_id: req.params.productId, is_approved: true })
      .orderBy('created_at', 'desc');
    res.json(reviews);
  } catch (err) {
    console.error('Reviews list error:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

/**
 * POST /api/reviews
 * Créer un avis (public)
 * Body: { product_id, author_name, rating, comment, language, customer_email, order_number }
 *
 * Logique de vérification d'achat :
 * - Si customer_email + order_number fournis → on vérifie en BDD qu'une commande payée/delivered
 *   existe pour cet email et contient ce product_id → si oui: verified_purchase = true, auto-approuvé
 * - Sinon → avis non vérifié, en attente de modération (is_approved = false)
 */
router.post('/', async (req, res) => {
  try {
    const { product_id, author_name, rating, comment, language, customer_email, order_number } = req.body;

    // Validation de base
    if (!product_id || !author_name || !rating) {
      return res.status(400).json({ error: 'product_id, author_name et rating requis' });
    }
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating doit être entre 1 et 5' });
    }

    // Vérifier que le produit existe
    const product = await db('products').where('id', product_id).first();
    if (!product) {
      return res.status(404).json({ error: 'Produit introuvable' });
    }

    let verified_purchase = false;
    let order_id = null;

    // Tentative de vérification d'achat
    if (customer_email && order_number) {
      const order = await db('orders')
        .where('order_number', order_number)
        .where('customer_email', customer_email.toLowerCase().trim())
        .whereIn('status', ['paid', 'delivered'])
        .first();

      if (order) {
        // Vérifier que le produit est dans la commande
        const orderItems = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
        const itemMatch = orderItems.some((i) => i.product_id === product_id || i.product_id === String(product_id));
        
        if (itemMatch) {
          // Vérifier qu'un avis vérifié n'existe pas déjà pour cette commande + produit
          const existingReview = await db('reviews')
            .where({ order_id: order.id, product_id })
            .first();
          
          if (existingReview) {
            return res.status(409).json({ error: 'Vous avez déjà laissé un avis vérifié pour ce produit' });
          }
          
          verified_purchase = true;
          order_id = order.id;
        }
      }
    }

    // Insérer l'avis
    // Avis vérifié → auto-approuvé | Avis non vérifié → modération admin requise
    const [id] = await db('reviews').insert({
      product_id,
      author_name: author_name.trim(),
      rating: Math.round(rating),
      comment: comment?.trim() || null,
      language: language || 'fr',
      customer_email: customer_email?.toLowerCase().trim() || null,
      order_id,
      verified_purchase,
      is_approved: verified_purchase, // Auto-approve uniquement si achat vérifié
    });

    // Recalculer la moyenne du produit (uniquement les avis approuvés)
    await recalculateProductRating(product_id);

    res.status(201).json({
      id,
      verified_purchase,
      is_approved: verified_purchase,
      message: verified_purchase
        ? 'Avis vérifié ajouté avec succès'
        : 'Avis soumis — en attente de modération',
    });
  } catch (err) {
    console.error('Review create error:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ─── Routes Admin ───

/**
 * GET /api/reviews/admin/pending
 * Liste les avis en attente de modération
 */
router.get('/admin/pending', requireAuth, async (req, res) => {
  try {
    const reviews = await db('reviews')
      .where('is_approved', false)
      .orderBy('created_at', 'desc');

    // Enrichir avec le nom du produit
    const productIds = [...new Set(reviews.map((r) => r.product_id))];
    const products = await db('products').whereIn('id', productIds).select('id', 'title', 'slug');
    const productsMap = Object.fromEntries(products.map((p) => [p.id, p]));

    res.json(reviews.map((r) => ({
      ...r,
      product_title: productsMap[r.product_id]?.title || 'Produit inconnu',
      product_slug: productsMap[r.product_id]?.slug || '',
    })));
  } catch (err) {
    console.error('Admin pending reviews error:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

/**
 * GET /api/reviews/admin/all
 * Liste tous les avis (approuvés + en attente) — Admin
 */
router.get('/admin/all', requireAuth, async (req, res) => {
  try {
    const reviews = await db('reviews').orderBy('created_at', 'desc').limit(500);

    const productIds = [...new Set(reviews.map((r) => r.product_id))];
    const products = await db('products').whereIn('id', productIds).select('id', 'title', 'slug');
    const productsMap = Object.fromEntries(products.map((p) => [p.id, p]));

    res.json(reviews.map((r) => ({
      ...r,
      product_title: productsMap[r.product_id]?.title || 'Produit inconnu',
      product_slug: productsMap[r.product_id]?.slug || '',
    })));
  } catch (err) {
    console.error('Admin all reviews error:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

/**
 * PATCH /api/reviews/admin/:id/approve
 * Approuver un avis — Admin
 */
router.patch('/admin/:id/approve', requireAuth, async (req, res) => {
  try {
    const review = await db('reviews').where('id', req.params.id).first();
    if (!review) return res.status(404).json({ error: 'Avis non trouvé' });

    await db('reviews').where('id', req.params.id).update({ is_approved: true });
    await recalculateProductRating(review.product_id);

    res.json({ success: true, message: 'Avis approuvé' });
  } catch (err) {
    console.error('Admin approve review error:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

/**
 * PATCH /api/reviews/admin/:id/reject
 * Rejeter un avis (le supprimer) — Admin
 */
router.patch('/admin/:id/reject', requireAuth, async (req, res) => {
  try {
    const review = await db('reviews').where('id', req.params.id).first();
    if (!review) return res.status(404).json({ error: 'Avis non trouvé' });

    await db('reviews').where('id', req.params.id).del();
    await recalculateProductRating(review.product_id);

    res.json({ success: true, message: 'Avis rejeté et supprimé' });
  } catch (err) {
    console.error('Admin reject review error:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

/**
 * DELETE /api/reviews/admin/:id
 * Supprimer un avis — Admin uniquement
 */
router.delete('/admin/:id', requireAuth, async (req, res) => {
  try {
    const review = await db('reviews').where('id', req.params.id).first();
    if (!review) return res.status(404).json({ error: 'Avis non trouvé' });

    await db('reviews').where('id', req.params.id).del();
    await recalculateProductRating(review.product_id);

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ─── Utilitaire ───

/**
 * Recalcule average_rating et review_count pour un produit
 * Ne prend en compte que les avis approuvés
 */
async function recalculateProductRating(productId) {
  const stats = await db('reviews')
    .where({ product_id: productId, is_approved: true })
    .avg('rating as avg')
    .count('* as count')
    .first();

  await db('products').where('id', productId).update({
    average_rating: stats.avg ? Math.round(stats.avg * 100) / 100 : 5,
    review_count: stats.count || 0,
  });
}

export default router;

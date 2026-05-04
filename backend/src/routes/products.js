// backend/src/routes/products.js
// Routes API Produits (CRUD public + admin)
import { Router } from 'express';
import db from '../config/database.js';
import { requireAuth } from '../middleware/auth.js';
import { uploadProductFiles } from '../middleware/upload.js';

const router = Router();

// ─── IMPORTANT: Routes admin AVANT la route :idOrSlug pour éviter le conflit ───

/**
 * GET /api/products/admin/all
 * Liste TOUS les produits (y compris non publiés) — Admin uniquement
 */
router.get('/admin/all', requireAuth, async (req, res) => {
  try {
    const products = await db('products').orderBy('created_at', 'desc');
    res.json(products.map((p) => ({
      ...p,
      preview_images: typeof p.preview_images === 'string' ? JSON.parse(p.preview_images) : p.preview_images || [],
    })));
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

/**
 * GET /api/products
 * Liste les produits publiés (public)
 * Query params: ?featured=true&theme=animals&age_group=3-5&search=dino&sort=newest&limit=50
 */
router.get('/', async (req, res) => {
  try {
    const { featured, theme, age_group, search, sort, limit } = req.query;

    let query = db('products').where('is_published', true);

    if (featured === 'true') query = query.where('is_featured', true);
    if (theme && theme !== 'all') query = query.where('theme', theme);
    if (age_group && age_group !== 'all') query = query.where('age_group', age_group);
    if (search) {
      query = query.where((qb) => {
        qb.where('title', 'like', `%${search}%`)
          .orWhere('title_en', 'like', `%${search}%`)
          .orWhere('description', 'like', `%${search}%`);
      });
    }

    switch (sort) {
      case 'priceLow': query = query.orderBy('price_eur', 'asc'); break;
      case 'priceHigh': query = query.orderBy('price_eur', 'desc'); break;
      case 'popular': query = query.orderBy('download_count', 'desc'); break;
      default: query = query.orderBy('created_at', 'desc');
    }

    const maxLimit = Math.min(parseInt(limit) || 50, 200);
    const products = await query.limit(maxLimit);

    // Parser les JSON stockés en string
    const parsed = products.map((p) => ({
      ...p,
      preview_images: typeof p.preview_images === 'string' ? JSON.parse(p.preview_images) : p.preview_images || [],
    }));

    res.json(parsed);
  } catch (err) {
    console.error('Products list error:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

/**
 * GET /api/products/:idOrSlug
 * Détail d'un produit par ID ou slug (public)
 */
router.get('/:idOrSlug', async (req, res) => {
  try {
    const { idOrSlug } = req.params;
    const isNumeric = /^\d+$/.test(idOrSlug);

    const product = isNumeric
      ? await db('products').where('id', idOrSlug).first()
      : await db('products').where('slug', idOrSlug).first();

    if (!product) return res.status(404).json({ error: 'Produit non trouvé' });

    product.preview_images = typeof product.preview_images === 'string'
      ? JSON.parse(product.preview_images) : product.preview_images || [];

    // Récupérer les avis approuvés
    const reviews = await db('reviews')
      .where({ product_id: product.id, is_approved: true })
      .orderBy('created_at', 'desc');

    res.json({ ...product, reviews });
  } catch (err) {
    console.error('Product detail error:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

/**
 * GET /api/products/:id/similar
 * Produits similaires (même thème, publiés)
 */
router.get('/:id/similar', async (req, res) => {
  try {
    const product = await db('products').where('id', req.params.id).first();
    if (!product) return res.status(404).json({ error: 'Produit non trouvé' });

    const similar = await db('products')
      .where({ theme: product.theme, is_published: true })
      .whereNot('id', product.id)
      .orderBy('download_count', 'desc')
      .limit(4);

    res.json(similar.map((p) => ({
      ...p,
      preview_images: typeof p.preview_images === 'string' ? JSON.parse(p.preview_images) : p.preview_images || [],
    })));
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

/**
 * POST /api/products/admin
 * Créer un produit — Admin uniquement
 */
router.post('/admin', requireAuth, uploadProductFiles.fields([
  { name: 'pdf_file', maxCount: 1 },
  { name: 'bonus_file', maxCount: 1 },
  { name: 'cover_image', maxCount: 1 },
  { name: 'preview_images', maxCount: 6 },
]), async (req, res) => {
  try {
    const data = req.body;
    const files = req.files || {};

    // Construire l'objet produit
    const product = {
      slug: data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      title: data.title,
      title_en: data.title_en || null,
      title_es: data.title_es || null,
      title_de: data.title_de || null,
      description: data.description || null,
      description_en: data.description_en || null,
      description_es: data.description_es || null,
      description_de: data.description_de || null,
      short_description: data.short_description || null,
      price_eur: parseFloat(data.price_eur),
      price_usd: parseFloat(data.price_usd),
      compare_price_eur: data.compare_price_eur ? parseFloat(data.compare_price_eur) : null,
      compare_price_usd: data.compare_price_usd ? parseFloat(data.compare_price_usd) : null,
      page_count: parseInt(data.page_count) || 0,
      dpi: parseInt(data.dpi) || 300,
      age_group: data.age_group,
      theme: data.theme,
      badge: data.badge || '',
      is_featured: data.is_featured === 'true' || data.is_featured === true,
      is_published: data.is_published !== 'false' && data.is_published !== false,
    };

    // Fichiers uploadés
    if (files.pdf_file?.[0]) product.pdf_filename = files.pdf_file[0].filename;
    if (files.bonus_file?.[0]) product.bonus_filename = files.bonus_file[0].filename;
    if (files.cover_image?.[0]) product.cover_image = `/api/uploads/images/${files.cover_image[0].filename}`;
    if (files.preview_images?.length) {
      product.preview_images = JSON.stringify(
        files.preview_images.map((f) => `/api/uploads/images/${f.filename}`)
      );
    }

    const [id] = await db('products').insert(product);
    const created = await db('products').where('id', id).first();

    res.status(201).json(created);
  } catch (err) {
    console.error('Product create error:', err);
    res.status(500).json({ error: 'Erreur création produit' });
  }
});

/**
 * PUT /api/products/admin/:id
 * Mettre à jour un produit — Admin uniquement
 */
router.put('/admin/:id', requireAuth, uploadProductFiles.fields([
  { name: 'pdf_file', maxCount: 1 },
  { name: 'bonus_file', maxCount: 1 },
  { name: 'cover_image', maxCount: 1 },
  { name: 'preview_images', maxCount: 6 },
]), async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await db('products').where('id', id).first();
    if (!existing) return res.status(404).json({ error: 'Produit non trouvé' });

    const data = req.body;
    const files = req.files || {};

    const updates = {};
    const fields = ['title', 'title_en', 'title_es', 'title_de', 'description', 'description_en',
      'description_es', 'description_de', 'short_description', 'slug', 'badge', 'theme', 'age_group'];

    for (const f of fields) {
      if (data[f] !== undefined) updates[f] = data[f];
    }
    if (data.price_eur !== undefined) updates.price_eur = parseFloat(data.price_eur);
    if (data.price_usd !== undefined) updates.price_usd = parseFloat(data.price_usd);
    if (data.compare_price_eur !== undefined) updates.compare_price_eur = data.compare_price_eur ? parseFloat(data.compare_price_eur) : null;
    if (data.compare_price_usd !== undefined) updates.compare_price_usd = data.compare_price_usd ? parseFloat(data.compare_price_usd) : null;
    if (data.page_count !== undefined) updates.page_count = parseInt(data.page_count);
    if (data.dpi !== undefined) updates.dpi = parseInt(data.dpi);
    if (data.is_featured !== undefined) updates.is_featured = data.is_featured === 'true' || data.is_featured === true;
    if (data.is_published !== undefined) updates.is_published = data.is_published === 'true' || data.is_published === true;

    if (files.pdf_file?.[0]) updates.pdf_filename = files.pdf_file[0].filename;
    if (files.bonus_file?.[0]) updates.bonus_filename = files.bonus_file[0].filename;
    if (files.cover_image?.[0]) updates.cover_image = `/api/uploads/images/${files.cover_image[0].filename}`;
    if (files.preview_images?.length) {
      updates.preview_images = JSON.stringify(
        files.preview_images.map((f) => `/api/uploads/images/${f.filename}`)
      );
    }

    updates.updated_at = db.fn.now();
    await db('products').where('id', id).update(updates);

    const updated = await db('products').where('id', id).first();
    res.json(updated);
  } catch (err) {
    console.error('Product update error:', err);
    res.status(500).json({ error: 'Erreur mise à jour produit' });
  }
});

/**
 * DELETE /api/products/admin/:id
 * Supprimer un produit — Admin uniquement
 */
router.delete('/admin/:id', requireAuth, async (req, res) => {
  try {
    const deleted = await db('products').where('id', req.params.id).del();
    if (!deleted) return res.status(404).json({ error: 'Produit non trouvé' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Erreur suppression produit' });
  }
});

export default router;

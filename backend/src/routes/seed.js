// backend/src/routes/seed.js
// Route temporaire pour seed les produits via API interne
import { Router } from 'express';
import db from '../config/database.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

const products = [
  {
    slug: 'alphabet-pre-pdf', title: 'Alphabet - Preparer le PDF', age_group: '3-5', theme: 'nature', price_eur: 4.99, price_usd: 5.99,
    short_description: 'Apprendre l alphabet en coloriant', page_count: 26, dpi: 300,
    badge: 'Nouveau', is_featured: true, is_published: true,
    preview_images: JSON.stringify([]), pdf_filename: null, bonus_filename: null,
  },
  {
    slug: 'alphabet-exe-mockup', title: 'Alphabet + Exe (Mockup)', age_group: '3-5', theme: 'nature', price_eur: 4.99, price_usd: 5.99,
    short_description: 'Colorier les lettres de A a Z', page_count: 26, dpi: 300,
    badge: '', is_featured: false, is_published: true,
    preview_images: JSON.stringify([]), pdf_filename: null, bonus_filename: null,
  },
];

router.post('/seed', requireAuth, async (req, res) => {
  try {
    const results = [];
    for (const p of products) {
      const existing = await db('products').where('slug', p.slug).first();
      if (existing) { results.push({ slug: p.slug, status: 'skipped' }); continue; }
      const [id] = await db('products').insert(p);
      results.push({ slug: p.slug, status: 'inserted', id });
    }
    res.json({ success: true, results });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

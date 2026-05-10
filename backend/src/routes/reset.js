import { Router } from 'express';
import db from '../config/database.js';
const router = Router();

router.post('/seed', async (req, res) => {
  try {
    const products = [
      { slug: 'alphabet-pre-pdf', title: 'Alphabet - Preparer le PDF', age_group: '3-5', theme: 'nature', price_eur: 4.99, price_usd: 5.99, short_description: 'Apprendre l alphabet en coloriant', page_count: 26, dpi: 300, badge: 'Nouveau', is_featured: true, is_published: true, preview_images: '[]' },
      { slug: 'color-pre-pdf', title: 'Colorier les couleurs', age_group: '3-5', theme: 'nature', price_eur: 4.99, price_usd: 5.99, short_description: 'Decouvrir les couleurs en coloriant', page_count: 30, dpi: 300, badge: '', is_featured: false, is_published: true, preview_images: '[]' },
      { slug: 'forme-geometrique-pre-pdf', title: 'Formes geometriques', age_group: '3-5', theme: 'nature', price_eur: 4.99, price_usd: 5.99, short_description: 'Decouvrir les formes en coloriant', page_count: 24, dpi: 300, badge: '', is_featured: false, is_published: true, preview_images: '[]' },
      { slug: 'nursery-prints-pre-pdf', title: 'Nursery Prints', age_group: '3-5', theme: 'nature', price_eur: 5.99, price_usd: 6.99, short_description: 'Impressions pour chambre de bebe', page_count: 40, dpi: 300, badge: 'Populaire', is_featured: true, is_published: true, preview_images: '[]' },
    ];
    const results = [];
    for (const p of products) {
      const existing = await db('products').where('slug', p.slug).first();
      if (existing) { results.push({ slug: p.slug, status: 'skipped' }); continue; }
      const [id] = await db('products').insert(p);
      results.push({ slug: p.slug, status: 'inserted', id });
    }
    const count = await db('products').count('id as total').first();
    res.json({ success: true, results, total: count.total });
  } catch (err) {
    res.status(500).json({ error: err.message, stack: err.stack });
  }
});

export default router;
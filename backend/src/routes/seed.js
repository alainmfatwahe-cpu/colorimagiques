import { Router } from 'express';
import db from '../config/database.js';
import { requireAuth } from '../middleware/auth.js';
import { createHash } from 'crypto';
const router = Router();

function hashPassword(password) {
  return createHash('sha256').update(password + 'ColoriMagiques_SALT_2026').digest('hex');
}

const products = [
  { slug: 'alphabet-pre-pdf', title: 'Alphabet - Preparer le PDF', age_group: '3-5', theme: 'nature', price_eur: 4.99, price_usd: 5.99, short_description: 'Apprendre l alphabet en coloriant', page_count: 26, dpi: 300, badge: 'Nouveau', is_featured: true, is_published: true, preview_images: '[]', pdf_filename: null, bonus_filename: null },
  { slug: 'color-pre-pdf', title: 'Colorier les couleurs', age_group: '3-5', theme: 'nature', price_eur: 4.99, price_usd: 5.99, short_description: 'Decouvrir les couleurs en coloriant', page_count: 30, dpi: 300, badge: '', is_featured: false, is_published: true, preview_images: '[]', pdf_filename: null, bonus_filename: null },
  { slug: 'forme-geometrique-pre-pdf', title: 'Formes geometriques', age_group: '3-5', theme: 'nature', price_eur: 4.99, price_usd: 5.99, short_description: 'Decouvrir les formes en coloriant', page_count: 24, dpi: 300, badge: '', is_featured: false, is_published: true, preview_images: '[]', pdf_filename: null, bonus_filename: null },
  { slug: 'nursery-prints-pre-pdf', title: 'Nursery Prints', age_group: '3-5', theme: 'nature', price_eur: 5.99, price_usd: 6.99, short_description: 'Impressions pour chambre de bebe', page_count: 40, dpi: 300, badge: 'Populaire', is_featured: true, is_published: true, preview_images: '[]', pdf_filename: null, bonus_filename: null },
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
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/init-admin', async (req, res) => {
  const { email, password, name } = req.body;
  try {
    const existing = await db('admins').where('email', email).first();
    if (existing) return res.json({ message: 'Admin already exists', email });
    const hash = hashPassword(password || 'Admin2026!');
    const [id] = await db('admins').insert({ email, password_hash: hash, name: name || 'Admin', role: 'superadmin' });
    res.json({ success: true, email, id });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

export default router;
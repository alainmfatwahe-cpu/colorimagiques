import { Router } from 'express';
import db from '../config/database.js';
const router = Router();

router.post('/seed-all', async (req, res) => {
  try {
    const products = [
      { slug: 'alphabet-pre-pdf', title: 'Alphabet - Pre PDF', age_group: '3-5', theme: 'nature', price_eur: 4.99, price_usd: 5.99, short_description: 'Apprendre l alphabet A-Z en coloriant', page_count: 26, dpi: 300, badge: 'Nouveau', is_featured: true, is_published: true, description: 'Un livre de coloriage de 26 pages pour apprendre l alphabet. Chaque lettre est associee a un animal ou objet mignon.', preview_images: '[]' },
      { slug: 'color-pre-pdf', title: 'Colorier les couleurs', age_group: '3-5', theme: 'nature', price_eur: 4.99, price_usd: 5.99, short_description: 'Decouvrir 12 couleurs en coloriant', page_count: 12, dpi: 300, badge: '', is_featured: false, is_published: true, description: 'Un livre de coloriage de 12 pages pour decouvrir les couleurs de base et les melanger.', preview_images: '[]' },
      { slug: 'forme-geometrique-pre-pdf', title: 'Formes geometriques', age_group: '3-5', theme: 'nature', price_eur: 4.99, price_usd: 5.99, short_description: 'Decouvrir les formes geometriques', page_count: 12, dpi: 300, badge: '', is_featured: false, is_published: true, description: 'Un livre de 12 pages pour decouvrir le carre, cercle, triangle, rectangle, hexagone et plus.', preview_images: '[]' },
      { slug: 'nursery-prints-pre-pdf', title: 'Nursery Prints', age_group: '3-5', theme: 'nature', price_eur: 5.99, price_usd: 6.99, short_description: '122 illustrations pour chambre de bebe', page_count: 122, dpi: 300, badge: 'Populaire', is_featured: true, is_published: true, description: 'Un livre de 122 pages deliees pour decorer la chambre de bebe. Animaux, saisons, vehicules et plus.', preview_images: '[]' },
      { slug: 'alphabet-exe-mockup', title: 'Alphabet + Exercice', age_group: '6-8', theme: 'nature', price_eur: 5.99, price_usd: 6.99, short_description: 'Alphabet avec exercises de coloriage', page_count: 26, dpi: 300, badge: 'Nouveau', is_featured: true, is_published: true, description: 'Un livre de 26 pages combinant alphabet et exercices de coloriage. Parfait pour les 6-8 ans.', preview_images: '[]' },
      { slug: 'color-mockup', title: 'Colorier les couleurs - Mockup', age_group: '3-5', theme: 'nature', price_eur: 5.49, price_usd: 5.99, short_description: 'Decouvrir les couleurs en coloriant', page_count: 12, dpi: 300, badge: '', is_featured: false, is_published: true, description: 'Un livre de 12 pages pour decouvrir les couleurs avec des illustrations mockup de haute qualite.', preview_images: '[]' },
      { slug: 'forme-geometrique-mockup', title: 'Formes geometriques - Mockup', age_group: '3-5', theme: 'nature', price_eur: 4.99, price_usd: 5.49, short_description: 'Formes geometriques a colorier', page_count: 12, dpi: 300, badge: '', is_featured: false, is_published: true, description: 'Un livre de 12 pages pour decouvrir les formes geometriques avec des illustrations mockup ludiques.', preview_images: '[]' },
      { slug: 'nursery-prints-mockup', title: 'Nursery Prints - Mockup', age_group: '3-5', theme: 'nature', price_eur: 6.99, price_usd: 7.99, short_description: '68 illustrations mockup pour bebe', page_count: 68, dpi: 300, badge: 'Populaire', is_featured: false, is_published: true, description: 'Un livre de 68 pages avec illustrations mockup pour decoration de chambre de bebe.', preview_images: '[]' },
    ];
    const results = [];
    for (const p of products) {
      const existing = await db('products').where('slug', p.slug).first();
      if (existing) {
        const { slug, ...rest } = p;
        await db('products').where('slug', slug).update({ ...rest, updated_at: db.fn.now() });
        results.push({ slug, status: 'updated', id: existing.id });
      } else {
        const result = await db('products').returning('id').insert(p);
        const id = Array.isArray(result) ? result[0] : result;
        results.push({ slug: p.slug, status: 'inserted', id });
      }
    }
    const count = await db('products').count('id as total').first();
    res.json({ success: true, results, total: count.total });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

export default router;
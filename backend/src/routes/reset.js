import { Router } from 'express';
import db from '../config/database.js';
const router = Router();

router.post('/seed-books', async (req, res) {
  try {
    await db.raw('ALTER TABLE products DROP CONSTRAINT IF EXISTS products_theme_check');
    await db.raw("ALTER TABLE products ADD CONSTRAINT products_theme_check CHECK (theme IN ('animals','noêl','space','dinosaurs','princesses','nature','véhicles','fantasy','océan','alphabet','color','forme-géometrique','nursery-prints','books'))");
    
    const books = [{"slug": "les-jeux-olympiques-de-noël", "title": "Les Jeux Olympiques de Noël", "short_description": "Livre de coloriage - Les Jeux Olympiques de Noël - 30 pages", "pdf_filename": "Livre  Les Jeux Olympiques de Noël_30 pages.pdf", "page_count": 30, "dpi": 300, "age_group": "3-5", "theme": "books", "badge": "Nouveau", "is_featured": true, "is_published": true, "price_eur": 4.99, "price_usd": 5.49}, {"slug": "noël-adorable-pour-enfants", "title": "Noël Adorable pour Enfants", "short_description": "Livre de coloriage - Noël Adorable pour Enfants - 22 pages", "pdf_filename": "Livre  Noël Adorable pour Enfants_22 pages.pdf", "page_count": 22, "dpi": 300, "age_group": "3-5", "theme": "books", "badge": "", "is_featured": false, "is_published": true, "price_eur": 3.99, "price_usd": 4.49}, {"slug": "latelier-des-oeufs-decores", "title": "L'Atelier des Oeufs Decorés", "short_description": "Livre de coloriage - L'Atelier des Oeufs Decorés - 35 pages", "pdf_filename": "Livre L'Atelier des Oeufs Decorés_35 pages.pdf", "page_count": 35, "dpi": 300, "age_group": "3-5", "theme": "books", "badge": "Populaire", "is_featured": true, "is_published": true, "price_eur": 4.99, "price_usd": 5.49}, {"slug": "latelier-magique-du-pere-noel", "title": "L'Atelier Magique du Père Noël", "short_description": "Livre de coloriage - L'Atelier Magique du Père Noël - 35 pages", "pdf_filename": "Livre L'Atelier Magique du Père Noël_35 pages.pdf", "page_count": 35, "dpi": 300, "age_group": "3-5", "theme": "books", "badge": "Nouveau", "is_featured": true, "is_published": true, "price_eur": 4.99, "price_usd": 5.49}];
    let inserted = 0, updated = 0;
    for (const p of books) {
      const existing = await db('products').where('slug', p.slug).first();
      if (existing) {
        await db('products').where('slug', p.slug).update({
          title: p.title, short_description: p.short_description,
          pdf_filename: p.pdf_filename, page_count: p.page_count,
          dpi: p.dpi, age_group: p.age_group, theme: p.theme,
          badge: p.badge, is_featured: p.is_featured,
          is_published: p.is_published, price_eur: p.price_eur, price_usd: p.price_usd
        });
        updated++;
      } else {
        await db('products').insert({
          slug: p.slug, title: p.title, short_description: p.short_description,
          pdf_filename: p.pdf_filename, page_count: p.page_count,
          dpi: p.dpi, age_group: p.age_group, theme: p.theme,
          badge: p.badge, is_featured: p.is_featured,
          is_published: p.is_published, preview_images: '[]',
          price_eur: p.price_eur, price_usd: p.price_usd,
          bonus_filename: null, description: null, cover_image: null
        });
        inserted++;
      }
    }
    const count = await db('products').count('id as total').first();
    res.json({ success: true, inserted, updated, total: count.total });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

export default router;

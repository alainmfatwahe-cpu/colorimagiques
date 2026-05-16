path = 'C:/Users/Alain/workspace/colorimagiques/webapp/backend/src/routes/reset.js'
code = """import { Router } from 'express';
import db from '../config/database.js';
const router = Router();

router.post('/seed-all', async (req, res) => {
  try {
    await db.raw('ALTER TABLE products DROP CONSTRAINT IF EXISTS products_theme_check');
    await db.raw("ALTER TABLE products ADD CONSTRAINT products_theme_check CHECK (theme IN ('animals','space','dinosaurs','princesses','nature','vehicles','fantasy','ocean','alphabet','color','forme-geometrique','nursery-prints'))");
    await db.raw('ALTER TABLE products DROP CONSTRAINT IF EXISTS products_age_group_check');
    await db.raw("ALTER TABLE products ADD CONSTRAINT products_age_group_check CHECK (age_group IN ('0-2','3-5','6-8','9-12','all-ages','0-3'))");
    const products = [];
    let inserted = 0, skipped = 0;
    for (const p of products) {
      const existing2 = await db('products').where('slug', p.slug).first();
      if (existing2) { skipped++; continue; }
      await db('products').insert({
        slug: p.slug, title: p.title, short_description: p.short_description,
        price_eur: p.price_eur, price_usd: p.price_usd,
        page_count: p.page_count, dpi: p.dpi, age_group: p.age_group,
        theme: p.theme, badge: p.badge, is_featured: p.is_featured,
        is_published: p.is_published, preview_images: '[]',
        pdf_filename: p.pdf_filename, bonus_filename: null, description: null
      });
      inserted++;
    }
    const count = await db('products').count('id as total').first();
    res.json({ success: true, inserted, skipped, total: count.total });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/seed-books', async (req, res) => {
  try {
    await db.raw('ALTER TABLE products DROP CONSTRAINT IF EXISTS products_theme_check');
    await db.raw("ALTER TABLE products ADD CONSTRAINT products_theme_check CHECK (theme IN ('animals','space','dinosaurs','princesses','nature','vehicles','fantasy','ocean','alphabet','color','forme-geometrique','nursery-prints','books'))");
    
    const books = [
      {slug: 'les-jeux-olympiques-de-noel', title: 'Les Jeux Olympiques de Noel', short_description: 'Livre de coloriage - Les Jeux Olympiques de Noel - 30 pages', pdf_filename: 'Livre  Les Jeux Olympiques de Noel_30 pages.pdf', page_count: 30, dpi: 300, age_group: '3-5', theme: 'books', badge: 'Nouveau', is_featured: true, is_published: true, price_eur: 4.99, price_usd: 5.49},
      {slug: 'noel-adorable-pour-enfants', title: 'Noel Adorable pour Enfants', short_description: 'Livre de coloriage - Noel Adorable pour Enfants - 22 pages', pdf_filename: 'Livre  Noel Adorable pour Enfants_22 pages.pdf', page_count: 22, dpi: 300, age_group: '3-5', theme: 'books', badge: '', is_featured: false, is_published: true, price_eur: 3.99, price_usd: 4.49},
      {slug: 'latelier-des-oufs-decores', title: "L'Atelier des Oufs Decor\\u00e9s", short_description: "Livre de coloriage - L'Atelier des Oufs Decor\\u00e9s - 35 pages", pdf_filename: "Livre L'Atelier des Oufs Decor\\u00e9s_35 pages.pdf", page_count: 35, dpi: 300, age_group: '3-5', theme: 'books', badge: 'Populaire', is_featured: true, is_published: true, price_eur: 4.99, price_usd: 5.49},
      {slug: 'latelier-magique-du-pere-noel', title: "L'Atelier Magique du P\\u00e8re Noel", short_description: "Livre de coloriage - L'Atelier Magique du P\\u00e8re Noel - 35 pages", pdf_filename: "Livre L'Atelier Magique du P\\u00e8re Noel_35 pages.pdf", page_count: 35, dpi: 300, age_group: '3-5', theme: 'books', badge: 'Nouveau', is_featured: true, is_published: true, price_eur: 4.99, price_usd: 5.49}
    ];
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
"""
with open(path, 'w', encoding='utf-8') as f:
    f.write(code)
print('reset.js OK - constraint CORRECTE, Oufs, noel (pas de accents)')

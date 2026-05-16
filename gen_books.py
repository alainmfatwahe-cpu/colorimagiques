import json

reset_path = 'C:/Users/Alain/workspace/colorimagiques/webapp/backend/src/routes/reset.js'

books = json.dumps([
    {"slug": "les-jeux-olympiques-de-noël", "title": "Les Jeux Olympiques de No\u00ebl", "short_description": "Livre de coloriage - Les Jeux Olympiques de No\u00ebl - 30 pages", "pdf_filename": "Livre  Les Jeux Olympiques de No\u00ebl_30 pages.pdf", "page_count": 30, "dpi": 300, "age_group": "3-5", "theme": "books", "badge": "Nouveau", "is_featured": True, "is_published": True, "price_eur": 4.99, "price_usd": 5.49},
    {"slug": "noël-adorable-pour-enfants", "title": "No\u00ebl Adorable pour Enfants", "short_description": "Livre de coloriage - No\u00ebl Adorable pour Enfants - 22 pages", "pdf_filename": "Livre  No\u00ebl Adorable pour Enfants_22 pages.pdf", "page_count": 22, "dpi": 300, "age_group": "3-5", "theme": "books", "badge": "", "is_featured": False, "is_published": True, "price_eur": 3.99, "price_usd": 4.49},
    {"slug": "latelier-des-oeufs-decores", "title": "L'Atelier des Oeufs Decor\u00e9s", "short_description": "Livre de coloriage - L'Atelier des Oeufs Decor\u00e9s - 35 pages", "pdf_filename": "Livre L'Atelier des Oeufs Decor\u00e9s_35 pages.pdf", "page_count": 35, "dpi": 300, "age_group": "3-5", "theme": "books", "badge": "Populaire", "is_featured": True, "is_published": True, "price_eur": 4.99, "price_usd": 5.49},
    {"slug": "latelier-magique-du-pere-noel", "title": "L'Atelier Magique du P\u00e8re No\u00ebl", "short_description": "Livre de coloriage - L'Atelier Magique du P\u00e8re No\u00ebl - 35 pages", "pdf_filename": "Livre L'Atelier Magique du P\u00e8re No\u00ebl_35 pages.pdf", "page_count": 35, "dpi": 300, "age_group": "3-5", "theme": "books", "badge": "Nouveau", "is_featured": True, "is_published": True, "price_eur": 4.99, "price_usd": 5.49},
], ensure_ascii=False)

code = f"""import {{ Router }} from 'express';
import db from '../config/database.js';
const router = Router();

router.post('/seed-books', async (req, res) {{
  try {{
    await db.raw('ALTER TABLE products DROP CONSTRAINT IF EXISTS products_theme_check');
    await db.raw("ALTER TABLE products ADD CONSTRAINT products_theme_check CHECK (theme IN ('animals','noêl','space','dinosaurs','princesses','nature','véhicles','fantasy','océan','alphabet','color','forme-géometrique','nursery-prints','books'))");
    
    const books = {books};
    let inserted = 0, updated = 0;
    for (const p of books) {{
      const existing = await db('products').where('slug', p.slug).first();
      if (existing) {{
        await db('products').where('slug', p.slug).update({{
          title: p.title, short_description: p.short_description,
          pdf_filename: p.pdf_filename, page_count: p.page_count,
          dpi: p.dpi, age_group: p.age_group, theme: p.theme,
          badge: p.badge, is_featured: p.is_featured,
          is_published: p.is_published, price_eur: p.price_eur, price_usd: p.price_usd
        }});
        updated++;
      }} else {{
        await db('products').insert({{
          slug: p.slug, title: p.title, short_description: p.short_description,
          pdf_filename: p.pdf_filename, page_count: p.page_count,
          dpi: p.dpi, age_group: p.age_group, theme: p.theme,
          badge: p.badge, is_featured: p.is_featured,
          is_published: p.is_published, preview_images: '[]',
          price_eur: p.price_eur, price_usd: p.price_usd,
          bonus_filename: null, description: null, cover_image: null
        }});
        inserted++;
      }}
    }}
    const count = await db('products').count('id as total').first();
    res.json({{ success: true, inserted, updated, total: count.total }});
  }} catch (err) {{ res.status(500).json({{ error: err.message }}); }}
}});

export default router;
"""

with open(reset_path, 'w', encoding='utf-8') as f:
    f.write(code)

print('OK')

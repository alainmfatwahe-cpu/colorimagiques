// backend/src/routes/seo.js
// Routes SEO : sitemap.xml dynamique + robots.txt
import { Router } from 'express';
import db from '../config/database.js';

const router = Router();

// Récupérer le base URL depuis les headers ou l'env
function getBaseUrl(req) {
  const proto = req.headers['x-forwarded-proto'] || req.protocol || 'https';
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  return process.env.SITE_URL || `${proto}://${host}`;
}

// ──────────────────────────────────────────
// GET /sitemap.xml — Sitemap XML dynamique
// ──────────────────────────────────────────
router.get('/sitemap.xml', async (req, res) => {
  try {
    const baseUrl = getBaseUrl(req);
    const now = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    // Récupérer tous les produits publiés
    const products = await db('products')
      .select('id', 'slug', 'updated_at')
      .where('is_published', 1)
      .orderBy('id');

    // Pages statiques
    const staticPages = [
      { loc: '/', priority: '1.0', changefreq: 'daily' },
      { loc: '/catalog', priority: '0.9', changefreq: 'daily' },
      { loc: '/about', priority: '0.5', changefreq: 'monthly' },
      { loc: '/legal/terms', priority: '0.3', changefreq: 'monthly' },
      { loc: '/legal/notice', priority: '0.3', changefreq: 'monthly' },
      { loc: '/legal/privacy', priority: '0.3', changefreq: 'monthly' },
      { loc: '/legal/refund', priority: '0.3', changefreq: 'monthly' },
    ];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
`;

    // Pages statiques
    for (const page of staticPages) {
      xml += `  <url>
    <loc>${baseUrl}${page.loc}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`;
    }

    // Pages produits (dynamiques)
    for (const product of products) {
      const lastmod = product.updated_at
        ? new Date(product.updated_at).toISOString().split('T')[0]
        : now;
      // URL via ID (route React actuelle) + slug comme alias
      xml += `  <url>
    <loc>${baseUrl}/product/${product.id}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`;
    }

    xml += `</urlset>`;

    res.set('Content-Type', 'application/xml; charset=utf-8');
    res.set('Cache-Control', 'public, max-age=3600'); // Cache 1h
    res.send(xml);
  } catch (err) {
    console.error('Sitemap error:', err);
    res.status(500).send('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>');
  }
});

// ──────────────────────────────────────────
// GET /robots.txt
// ──────────────────────────────────────────
router.get('/robots.txt', (req, res) => {
  const baseUrl = getBaseUrl(req);
  const robotsTxt = `# ColoriMagiques — robots.txt
User-agent: *
Allow: /
Disallow: /admin
Disallow: /checkout
Disallow: /api/

# Sitemap
Sitemap: ${baseUrl}/sitemap.xml
`;
  res.set('Content-Type', 'text/plain; charset=utf-8');
  res.set('Cache-Control', 'public, max-age=86400'); // Cache 24h
  res.send(robotsTxt);
});

// ──────────────────────────────────────────
// GET /meta/product/:idOrSlug — Meta SEO API pour prerendering
// ──────────────────────────────────────────
router.get('/meta/product/:idOrSlug', async (req, res) => {
  try {
    const { idOrSlug } = req.params;
    const lang = req.query.lang || 'fr';
    const baseUrl = getBaseUrl(req);

    const query = /^\d+$/.test(idOrSlug)
      ? db('products').where('id', parseInt(idOrSlug))
      : db('products').where('slug', idOrSlug);

    const product = await query.first();
    if (!product) return res.status(404).json({ error: 'Produit non trouvé' });

    const titleField = lang === 'fr' ? 'title' : `title_${lang}`;
    const title = product[titleField] || product.title;
    const description = (product.short_description || '').substring(0, 160);

    res.json({
      title: `${title} — ColoriMagiques`,
      description,
      image: product.cover_image ? `${baseUrl}${product.cover_image}` : null,
      url: `${baseUrl}/product/${product.slug || product.id}`,
      type: 'product',
      price: product.price_eur,
      currency: 'EUR',
      rating: product.average_rating,
      reviewCount: product.review_count,
    });
  } catch (err) {
    console.error('SEO meta error:', err);
    res.status(500).json({ error: 'Erreur interne' });
  }
});

export default router;

// frontend/src/components/SEOHead.jsx
// Composant SEO dynamique : document.title, meta tags, Open Graph, JSON-LD
// Fonctionne en SPA (manipulation directe du DOM <head>)
import { useEffect } from 'react';

/**
 * @param {Object} props
 * @param {string} props.title - Titre de la page
 * @param {string} props.description - Meta description
 * @param {string} [props.url] - URL canonique
 * @param {string} [props.image] - Image OG (URL absolue)
 * @param {string} [props.type] - og:type (website, product, article)
 * @param {Object} [props.jsonLd] - Structured data JSON-LD
 * @param {string} [props.lang] - Langue (fr, en, es, de)
 */
export default function SEOHead({ title, description, url, image, type = 'website', jsonLd, lang = 'fr' }) {
  useEffect(() => {
    // --- Title ---
    document.title = title;

    // --- Meta tags ---
    const setMeta = (name, content) => {
      if (!content) return;
      let el = document.querySelector(`meta[name="${name}"]`) || document.querySelector(`meta[property="${name}"]`);
      if (!el) {
        el = document.createElement('meta');
        if (name.startsWith('og:') || name.startsWith('article:') || name.startsWith('product:')) {
          el.setAttribute('property', name);
        } else {
          el.setAttribute('name', name);
        }
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    setMeta('description', description);
    setMeta('robots', 'index, follow');
    setMeta('og:title', title);
    setMeta('og:description', description);
    setMeta('og:type', type);
    setMeta('og:site_name', 'ColoriMagiques');
    setMeta('og:locale', lang === 'fr' ? 'fr_FR' : lang === 'en' ? 'en_US' : lang === 'es' ? 'es_ES' : 'de_DE');
    if (url) setMeta('og:url', url);
    if (image) setMeta('og:image', image);
    
    // Twitter
    setMeta('twitter:card', image ? 'summary_large_image' : 'summary');
    setMeta('twitter:title', title);
    setMeta('twitter:description', description);
    if (image) setMeta('twitter:image', image);

    // Canonical
    let canonical = document.querySelector('link[rel="canonical"]');
    if (url) {
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        document.head.appendChild(canonical);
      }
      canonical.setAttribute('href', url);
    }

    // Lang
    document.documentElement.lang = lang;

    // --- JSON-LD ---
    // Remove old
    const oldScript = document.getElementById('seo-jsonld');
    if (oldScript) oldScript.remove();
    if (jsonLd) {
      const script = document.createElement('script');
      script.id = 'seo-jsonld';
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }

    // Cleanup on unmount
    return () => {
      const s = document.getElementById('seo-jsonld');
      if (s) s.remove();
    };
  }, [title, description, url, image, type, jsonLd, lang]);

  return null; // Render nothing — side effects only
}

/**
 * JSON-LD : Organization (site-wide)
 */
export function getOrganizationSchema(siteUrl) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'ColoriMagiques',
    url: siteUrl,
    logo: `${siteUrl}/images/demo/logo.svg`,
    description: 'E-books de coloriage pour enfants de 3 à 10 ans',
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'support@colorimagiques.com',
      contactType: 'customer service',
    },
  };
}

/**
 * JSON-LD : WebSite (home page)
 */
export function getWebSiteSchema(siteUrl, lang) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'ColoriMagiques',
    url: siteUrl,
    inLanguage: lang,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteUrl}/catalog?search={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * JSON-LD : Product (product detail page)
 */
export function getProductSchema(product, siteUrl, currency) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.short_description || product.description?.substring(0, 200),
    image: product.cover_image ? `${siteUrl}${product.cover_image}` : undefined,
    brand: {
      '@type': 'Brand',
      name: 'ColoriMagiques',
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: currency,
      price: currency === 'EUR' ? product.price_eur : product.price_usd,
      availability: 'https://schema.org/InStock',
      url: `${siteUrl}/product/${product.id}`,
      seller: {
        '@type': 'Organization',
        name: 'ColoriMagiques',
      },
    },
    aggregateRating: product.review_count > 0 ? {
      '@type': 'AggregateRating',
      ratingValue: product.average_rating,
      reviewCount: product.review_count,
      bestRating: 5,
      worstRating: 1,
    } : undefined,
    additionalProperty: [
      { '@type': 'PropertyValue', name: 'Page Count', value: product.page_count },
      { '@type': 'PropertyValue', name: 'DPI', value: product.dpi || 300 },
      { '@type': 'PropertyValue', name: 'Format', value: 'PDF' },
      { '@type': 'PropertyValue', name: 'Age Group', value: product.age_group },
    ],
  };
}

/**
 * JSON-LD : BreadcrumbList
 */
export function getBreadcrumbSchema(items, siteUrl) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url ? `${siteUrl}${item.url}` : undefined,
    })),
  };
}

/**
 * JSON-LD : CollectionPage (catalog)
 */
export function getCollectionSchema(products, siteUrl, lang) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: lang === 'fr' ? 'Catalogue ColoriMagiques' : lang === 'es' ? 'Catálogo ColoriMagiques' : lang === 'de' ? 'Katalog ColoriMagiques' : 'ColoriMagiques Catalog',
    url: `${siteUrl}/catalog`,
    description: lang === 'fr' ? 'Collection complète de livres de coloriage pour enfants' : 'Complete collection of coloring books for kids',
    numberOfItems: products.length,
  };
}

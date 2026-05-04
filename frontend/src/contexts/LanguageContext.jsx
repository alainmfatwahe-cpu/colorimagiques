// frontend/src/contexts/LanguageContext.jsx
// Contexte multilingue complet FR/EN/ES/DE — zéro dépendance Base44
import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext(undefined);

const translations = {
  fr: {
    nav: { home: 'Accueil', catalog: 'Catalogue', about: 'À Propos', contact: 'Contact', cart: 'Panier', search: 'Rechercher...', admin: 'Administration' },
    hero: {
      title: 'Livres de Coloriage Magiques',
      subtitle: 'pour Enfants',
      description: 'Éveillez la créativité de vos enfants avec nos livres de coloriage uniques. Téléchargement instantané, pages imprimables en haute qualité.',
      cta: 'Découvrir la Collection',
    },
    benefits: {
      instant: 'Téléchargement Instantané',
      instantDesc: 'Recevez vos fichiers immédiatement après achat',
      printable: 'Pages Imprimables',
      printableDesc: 'Qualité 300 DPI pour une impression parfaite',
      unique: 'Designs Uniques',
      uniqueDesc: 'Des illustrations originales créées par des artistes',
      safe: 'Paiement Sécurisé',
      safeDesc: 'Transactions protégées et données sécurisées',
    },
    product: {
      addToCart: 'Ajouter au Panier',
      inCart: 'Dans le Panier ✓',
      viewDetails: 'Voir Détails',
      pages: 'pages',
      format: 'Format',
      ageGroup: 'Âge recommandé',
      years: 'ans',
      description: 'Description',
      specs: 'Spécifications',
      reviews: 'Avis Clients',
      similar: 'Produits Similaires',
      included: 'Inclus dans ce livre',
      mainPdf: 'Fichier PDF principal',
      bonusFile: 'Fichier bonus inclus',
      featured: 'Nos Bestsellers',
      new: 'Nouveau',
      popular: 'Populaire',
      bestseller: 'Bestseller',
      promo: 'Promo',
      noResults: 'Aucun produit trouvé',
      noReviews: 'Aucun avis pour le moment.',
      writeReview: 'Donner votre avis',
      verifiedPurchase: 'Achat vérifié',
      pendingModeration: 'En attente de modération',
      reviewSubmitted: 'Merci ! Votre avis a été soumis.',
      reviewVerified: 'Merci ! Votre avis vérifié a été publié.',
      reviewName: 'Votre prénom',
      reviewEmail: 'Email (utilisé lors de l\'achat)',
      reviewOrder: 'N° de commande (optionnel, pour vérification)',
      reviewComment: 'Votre commentaire (optionnel)',
      reviewSubmit: 'Envoyer mon avis',
      reviewAlreadyExists: 'Vous avez déjà laissé un avis vérifié pour ce produit.',
      starRating: 'Note',
    },
    catalog: {
      title: 'Notre Collection',
      filters: 'Filtres',
      age: "Tranche d'âge",
      theme: 'Thème',
      price: 'Prix',
      all: 'Tous',
      results: 'résultats',
      noResults: 'Aucun produit trouvé',
      sortBy: 'Trier par',
      priceLow: 'Prix croissant',
      priceHigh: 'Prix décroissant',
      newest: 'Plus récent',
      mostPopular: 'Plus populaire',
    },
    themes: {
      animals: 'Animaux', space: 'Espace', dinosaurs: 'Dinosaures', princesses: 'Princesses',
      nature: 'Nature', vehicles: 'Véhicules', fantasy: 'Fantaisie', ocean: 'Océan',
    },
    cart: {
      title: 'Votre Panier',
      empty: 'Votre panier est vide',
      total: 'Total',
      checkout: 'Passer la Commande',
      remove: 'Retirer',
      continueShopping: 'Continuer vos achats',
      promoCode: 'Code promo',
      apply: 'Appliquer',
      discount: 'Réduction',
      subtotal: 'Sous-total',
    },
    checkout: {
      title: 'Finaliser la Commande',
      email: 'Adresse email',
      name: 'Nom complet',
      pay: 'Payer Maintenant',
      secure: 'Paiement 100% Sécurisé',
      processing: 'Traitement en cours...',
      canceled: 'Paiement annulé. Vous pouvez réessayer.',
      stripeConfigError: 'Le système de paiement est en cours de configuration. Veuillez réessayer plus tard.',
      genericError: 'Erreur lors du paiement. Veuillez réessayer.',
      orderSummary: 'Récapitulatif',
    },
    confirmation: {
      title: 'Commande Confirmée !',
      thanks: 'Merci pour votre achat !',
      emailSent: 'Un email avec vos liens de téléchargement a été envoyé à',
      download: 'Télécharger',
      orderNumber: 'N° de commande',
      backHome: "Retour à l'accueil",
    },
    testimonials: { title: 'Ce que disent les parents' },
    footer: {
      rights: 'Tous droits réservés',
      privacy: 'Politique de confidentialité',
      terms: "Conditions d'utilisation",
      refund: 'Politique de remboursement',
      newsletter: 'Recevez nos nouveautés',
      subscribe: "S'abonner",
      emailPlaceholder: 'Votre email',
    },
    promo: {
      banner: 'Promotion : -20% avec le code BIENVENUE',
      exitTitle: '🎨 Attendez ! Ne partez pas...',
      exitText: 'Profitez de -10% sur votre première commande',
      exitCode: 'Votre code :',
      exitCta: "J'en profite !",
    },
    trust: {
      secure: 'Paiement Sécurisé',
      instant: 'Téléchargement Instantané',
      guarantee: 'Satisfait ou Remboursé',
    },
    admin: {
      dashboard: 'Tableau de Bord',
      products: 'Produits',
      orders: 'Commandes',
      addProduct: 'Ajouter un Produit',
      editProduct: 'Modifier le Produit',
      save: 'Enregistrer',
      cancel: 'Annuler',
      delete: 'Supprimer',
      totalRevenue: 'Revenu Total',
      totalOrders: 'Commandes',
      totalProducts: 'Produits',
      totalDownloads: 'Téléchargements',
      login: 'Connexion Admin',
      logout: 'Déconnexion',
    },
    legal: {
      terms: "Conditions Générales de Vente",
      notice: "Mentions Légales",
      privacy: "Politique de Confidentialité",
      refund: "Politique de Remboursement",
      lastUpdated: "Dernière mise à jour",
    },
    seo: {
      homeTitle: 'ColoriMagiques — Livres de Coloriage pour Enfants | Téléchargement PDF',
      homeDesc: 'Découvrez nos e-books de coloriage pour enfants de 3 à 10 ans. Téléchargement instantané, impression haute qualité 300 DPI. Paiement sécurisé par Stripe.',
      catalogTitle: 'Catalogue — Tous nos Livres de Coloriage | ColoriMagiques',
      catalogDesc: 'Explorez notre collection complète de livres de coloriage pour enfants : animaux, dinosaures, princesses, espace et plus. PDF téléchargeable immédiatement.',
      productTitle: '{title} — Coloriage PDF | ColoriMagiques',
      productDesc: '{title} — {pages} pages de coloriage, qualité 300 DPI, pour enfants de {age}. Téléchargement instantané après achat.',
    },
  },
  en: {
    nav: { home: 'Home', catalog: 'Catalog', about: 'About', contact: 'Contact', cart: 'Cart', search: 'Search...', admin: 'Admin' },
    hero: {
      title: 'Magical Coloring Books',
      subtitle: 'for Kids',
      description: "Spark your children's creativity with our unique coloring books. Instant download, high-quality printable pages.",
      cta: 'Discover the Collection',
    },
    benefits: {
      instant: 'Instant Download',
      instantDesc: 'Get your files immediately after purchase',
      printable: 'Printable Pages',
      printableDesc: '300 DPI quality for perfect printing',
      unique: 'Unique Designs',
      uniqueDesc: 'Original illustrations created by artists',
      safe: 'Secure Payment',
      safeDesc: 'Protected transactions and secured data',
    },
    product: {
      addToCart: 'Add to Cart',
      inCart: 'In Cart ✓',
      viewDetails: 'View Details',
      pages: 'pages',
      format: 'Format',
      ageGroup: 'Recommended age',
      years: 'years',
      description: 'Description',
      specs: 'Specifications',
      reviews: 'Customer Reviews',
      similar: 'Similar Products',
      included: 'Included in this book',
      mainPdf: 'Main PDF file',
      bonusFile: 'Bonus file included',
      featured: 'Our Bestsellers',
      new: 'New',
      popular: 'Popular',
      bestseller: 'Bestseller',
      promo: 'Sale',
      noResults: 'No products found',
      noReviews: 'No reviews yet.',
      writeReview: 'Write a review',
      verifiedPurchase: 'Verified purchase',
      pendingModeration: 'Pending moderation',
      reviewSubmitted: 'Thank you! Your review has been submitted.',
      reviewVerified: 'Thank you! Your verified review has been published.',
      reviewName: 'Your first name',
      reviewEmail: 'Email (used at purchase)',
      reviewOrder: 'Order number (optional, for verification)',
      reviewComment: 'Your comment (optional)',
      reviewSubmit: 'Submit my review',
      reviewAlreadyExists: 'You have already left a verified review for this product.',
      starRating: 'Rating',
    },
    catalog: {
      title: 'Our Collection',
      filters: 'Filters',
      age: 'Age Group',
      theme: 'Theme',
      price: 'Price',
      all: 'All',
      results: 'results',
      noResults: 'No products found',
      sortBy: 'Sort by',
      priceLow: 'Price: Low to High',
      priceHigh: 'Price: High to Low',
      newest: 'Newest',
      mostPopular: 'Most Popular',
    },
    themes: {
      animals: 'Animals', space: 'Space', dinosaurs: 'Dinosaurs', princesses: 'Princesses',
      nature: 'Nature', vehicles: 'Vehicles', fantasy: 'Fantasy', ocean: 'Ocean',
    },
    cart: {
      title: 'Your Cart',
      empty: 'Your cart is empty',
      total: 'Total',
      checkout: 'Checkout',
      remove: 'Remove',
      continueShopping: 'Continue Shopping',
      promoCode: 'Promo code',
      apply: 'Apply',
      discount: 'Discount',
      subtotal: 'Subtotal',
    },
    checkout: {
      title: 'Complete Your Order',
      email: 'Email address',
      name: 'Full name',
      pay: 'Pay Now',
      secure: '100% Secure Payment',
      processing: 'Processing...',
      canceled: 'Payment canceled. You can try again.',
      stripeConfigError: 'Payment system is being configured. Please try again later.',
      genericError: 'Payment error. Please try again.',
      orderSummary: 'Summary',
    },
    confirmation: {
      title: 'Order Confirmed!',
      thanks: 'Thank you for your purchase!',
      emailSent: 'An email with your download links has been sent to',
      download: 'Download',
      orderNumber: 'Order #',
      backHome: 'Back to Home',
    },
    testimonials: { title: 'What Parents Say' },
    footer: {
      rights: 'All rights reserved',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      refund: 'Refund Policy',
      newsletter: 'Get our latest news',
      subscribe: 'Subscribe',
      emailPlaceholder: 'Your email',
    },
    promo: {
      banner: 'Sale: -20% with code WELCOME',
      exitTitle: "🎨 Wait! Don't leave yet...",
      exitText: 'Get -10% on your first order',
      exitCode: 'Your code:',
      exitCta: 'Grab it!',
    },
    trust: {
      secure: 'Secure Payment',
      instant: 'Instant Download',
      guarantee: 'Money-Back Guarantee',
    },
    admin: {
      dashboard: 'Dashboard',
      products: 'Products',
      orders: 'Orders',
      addProduct: 'Add Product',
      editProduct: 'Edit Product',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      totalRevenue: 'Total Revenue',
      totalOrders: 'Orders',
      totalProducts: 'Products',
      totalDownloads: 'Downloads',
      login: 'Admin Login',
      logout: 'Logout',
    },
    legal: {
      terms: 'Terms of Service',
      notice: 'Legal Notice',
      privacy: 'Privacy Policy',
      refund: 'Refund Policy',
      lastUpdated: 'Last updated',
    },
    seo: {
      homeTitle: 'ColoriMagiques — Coloring Books for Kids | PDF Download',
      homeDesc: 'Discover our coloring e-books for children aged 3 to 10. Instant download, high-quality 300 DPI printing. Secure payment via Stripe.',
      catalogTitle: 'Catalog — All Our Coloring Books | ColoriMagiques',
      catalogDesc: 'Explore our complete collection of coloring books for kids: animals, dinosaurs, princesses, space and more. Instant PDF download.',
      productTitle: '{title} — Coloring PDF | ColoriMagiques',
      productDesc: '{title} — {pages} coloring pages, 300 DPI quality, for children aged {age}. Instant download after purchase.',
    },
  },
  es: {
    nav: { home: 'Inicio', catalog: 'Catálogo', about: 'Acerca de', contact: 'Contacto', cart: 'Carrito', search: 'Buscar...', admin: 'Admin' },
    hero: {
      title: 'Libros de Colorear Mágicos',
      subtitle: 'para Niños',
      description: 'Despierta la creatividad de tus hijos con nuestros libros de colorear únicos. Descarga instantánea, páginas imprimibles de alta calidad.',
      cta: 'Descubrir la Colección',
    },
    benefits: {
      instant: 'Descarga Instantánea', instantDesc: 'Recibe tus archivos inmediatamente después de la compra',
      printable: 'Páginas Imprimibles', printableDesc: 'Calidad 300 DPI para una impresión perfecta',
      unique: 'Diseños Únicos', uniqueDesc: 'Ilustraciones originales creadas por artistas',
      safe: 'Pago Seguro', safeDesc: 'Transacciones protegidas y datos seguros',
    },
    product: {
      addToCart: 'Añadir al Carrito', inCart: 'En el Carrito ✓', viewDetails: 'Ver Detalles',
      pages: 'páginas', format: 'Formato', ageGroup: 'Edad recomendada', years: 'años',
      description: 'Descripción', specs: 'Especificaciones', reviews: 'Opiniones de Clientes',
      similar: 'Productos Similares', included: 'Incluido en este libro',
      mainPdf: 'Archivo PDF principal', bonusFile: 'Archivo bonus incluido',
      featured: 'Nuestros Bestsellers', new: 'Nuevo', popular: 'Popular',
      bestseller: 'Bestseller', promo: 'Oferta', noResults: 'No se encontraron productos',
      noReviews: 'Aún no hay opiniones.', writeReview: 'Escribir una opinión', verifiedPurchase: 'Compra verificada', pendingModeration: 'Pendiente de moderación', reviewSubmitted: '¡Gracias! Tu opinión ha sido enviada.', reviewVerified: '¡Gracias! Tu opinión verificada ha sido publicada.', reviewName: 'Tu nombre', reviewEmail: 'Email (usado en la compra)', reviewOrder: 'N° de pedido (opcional)', reviewComment: 'Tu comentario (opcional)', reviewSubmit: 'Enviar mi opinión', reviewAlreadyExists: 'Ya has dejado una opinión verificada para este producto.', starRating: 'Nota',
    },
    catalog: {
      title: 'Nuestra Colección', filters: 'Filtros', age: 'Grupo de edad', theme: 'Tema',
      price: 'Precio', all: 'Todos', results: 'resultados', noResults: 'No se encontraron productos',
      sortBy: 'Ordenar por', priceLow: 'Precio: Menor a Mayor',
      priceHigh: 'Precio: Mayor a Menor', newest: 'Más reciente', mostPopular: 'Más popular',
    },
    themes: { animals: 'Animales', space: 'Espacio', dinosaurs: 'Dinosaurios', princesses: 'Princesas', nature: 'Naturaleza', vehicles: 'Vehículos', fantasy: 'Fantasía', ocean: 'Océano' },
    cart: { title: 'Tu Carrito', empty: 'Tu carrito está vacío', total: 'Total', checkout: 'Finalizar Compra', remove: 'Eliminar', continueShopping: 'Seguir Comprando', promoCode: 'Código promo', apply: 'Aplicar', discount: 'Descuento', subtotal: 'Subtotal' },
    checkout: { title: 'Finalizar tu Pedido', email: 'Correo electrónico', name: 'Nombre completo', pay: 'Pagar Ahora', secure: 'Pago 100% Seguro', processing: 'Procesando...', canceled: 'Pago cancelado. Puedes intentar de nuevo.', stripeConfigError: 'El sistema de pago está en configuración. Inténtalo más tarde.', genericError: 'Error en el pago. Inténtalo de nuevo.', orderSummary: 'Resumen' },
    confirmation: { title: '¡Pedido Confirmado!', thanks: '¡Gracias por tu compra!', emailSent: 'Un email con tus enlaces de descarga ha sido enviado a', download: 'Descargar', orderNumber: 'N° de pedido', backHome: 'Volver al inicio' },
    testimonials: { title: 'Lo que dicen los padres' },
    footer: { rights: 'Todos los derechos reservados', privacy: 'Política de Privacidad', terms: 'Términos de Servicio', refund: 'Política de Reembolso', newsletter: 'Recibe nuestras novedades', subscribe: 'Suscribirse', emailPlaceholder: 'Tu email' },
    promo: { banner: 'Promoción: -20% con el código BIENVENIDO', exitTitle: '🎨 ¡Espera! No te vayas...', exitText: 'Obtén -10% en tu primer pedido', exitCode: 'Tu código:', exitCta: '¡Lo quiero!' },
    trust: { secure: 'Pago Seguro', instant: 'Descarga Instantánea', guarantee: 'Garantía de Devolución' },
    admin: { dashboard: 'Panel', products: 'Productos', orders: 'Pedidos', addProduct: 'Añadir Producto', editProduct: 'Editar Producto', save: 'Guardar', cancel: 'Cancelar', delete: 'Eliminar', totalRevenue: 'Ingresos Totales', totalOrders: 'Pedidos', totalProducts: 'Productos', totalDownloads: 'Descargas', login: 'Acceso Admin', logout: 'Cerrar sesión' },
    legal: { terms: 'Condiciones Generales de Venta', notice: 'Aviso Legal', privacy: 'Política de Privacidad', refund: 'Política de Reembolso', lastUpdated: 'Última actualización' },
    seo: { homeTitle: 'ColoriMagiques — Libros de Colorear para Niños | Descarga PDF', homeDesc: 'Descubre nuestros e-books de colorear para niños de 3 a 10 años. Descarga instantánea, impresión de alta calidad 300 DPI.', catalogTitle: 'Catálogo — Todos nuestros Libros de Colorear | ColoriMagiques', catalogDesc: 'Explora nuestra colección completa de libros de colorear para niños. Descarga PDF instantánea.', productTitle: '{title} — Colorear PDF | ColoriMagiques', productDesc: '{title} — {pages} páginas para colorear, calidad 300 DPI, para niños de {age}.' },
  },
  de: {
    nav: { home: 'Startseite', catalog: 'Katalog', about: 'Über Uns', contact: 'Kontakt', cart: 'Warenkorb', search: 'Suchen...', admin: 'Admin' },
    hero: {
      title: 'Magische Malbücher',
      subtitle: 'für Kinder',
      description: 'Wecken Sie die Kreativität Ihrer Kinder mit unseren einzigartigen Malbüchern. Sofortiger Download, druckbare Seiten in hoher Qualität.',
      cta: 'Kollektion Entdecken',
    },
    benefits: {
      instant: 'Sofortiger Download', instantDesc: 'Erhalten Sie Ihre Dateien sofort nach dem Kauf',
      printable: 'Druckbare Seiten', printableDesc: '300 DPI Qualität für perfekten Druck',
      unique: 'Einzigartige Designs', uniqueDesc: 'Originale Illustrationen von Künstlern erstellt',
      safe: 'Sichere Zahlung', safeDesc: 'Geschützte Transaktionen und gesicherte Daten',
    },
    product: {
      addToCart: 'In den Warenkorb', inCart: 'Im Warenkorb ✓', viewDetails: 'Details Ansehen',
      pages: 'Seiten', format: 'Format', ageGroup: 'Empfohlenes Alter', years: 'Jahre',
      description: 'Beschreibung', specs: 'Spezifikationen', reviews: 'Kundenbewertungen',
      similar: 'Ähnliche Produkte', included: 'In diesem Buch enthalten',
      mainPdf: 'Haupt-PDF-Datei', bonusFile: 'Bonusdatei enthalten',
      featured: 'Unsere Bestseller', new: 'Neu', popular: 'Beliebt',
      bestseller: 'Bestseller', promo: 'Angebot', noResults: 'Keine Produkte gefunden',
      noReviews: 'Noch keine Bewertungen.', writeReview: 'Bewertung schreiben', verifiedPurchase: 'Verifizierter Kauf', pendingModeration: 'Ausstehende Moderation', reviewSubmitted: 'Danke! Ihre Bewertung wurde eingereicht.', reviewVerified: 'Danke! Ihre verifizierte Bewertung wurde veröffentlicht.', reviewName: 'Ihr Vorname', reviewEmail: 'E-Mail (beim Kauf verwendet)', reviewOrder: 'Bestellnr. (optional)', reviewComment: 'Ihr Kommentar (optional)', reviewSubmit: 'Bewertung absenden', reviewAlreadyExists: 'Sie haben bereits eine verifizierte Bewertung für dieses Produkt abgegeben.', starRating: 'Bewertung',
    },
    catalog: { title: 'Unsere Kollektion', filters: 'Filter', age: 'Altersgruppe', theme: 'Thema', price: 'Preis', all: 'Alle', results: 'Ergebnisse', noResults: 'Keine Produkte gefunden', sortBy: 'Sortieren nach', priceLow: 'Preis: Aufsteigend', priceHigh: 'Preis: Absteigend', newest: 'Neueste', mostPopular: 'Beliebteste' },
    themes: { animals: 'Tiere', space: 'Weltraum', dinosaurs: 'Dinosaurier', princesses: 'Prinzessinnen', nature: 'Natur', vehicles: 'Fahrzeuge', fantasy: 'Fantasie', ocean: 'Ozean' },
    cart: { title: 'Ihr Warenkorb', empty: 'Ihr Warenkorb ist leer', total: 'Gesamt', checkout: 'Zur Kasse', remove: 'Entfernen', continueShopping: 'Weiter Einkaufen', promoCode: 'Promo-Code', apply: 'Anwenden', discount: 'Rabatt', subtotal: 'Zwischensumme' },
    checkout: { title: 'Bestellung Abschließen', email: 'E-Mail-Adresse', name: 'Vollständiger Name', pay: 'Jetzt Bezahlen', secure: '100% Sichere Zahlung', processing: 'Verarbeitung...', canceled: 'Zahlung abgebrochen. Sie können es erneut versuchen.', stripeConfigError: 'Das Zahlungssystem wird konfiguriert. Bitte versuchen Sie es später erneut.', genericError: 'Zahlungsfehler. Bitte versuchen Sie es erneut.', orderSummary: 'Zusammenfassung' },
    confirmation: { title: 'Bestellung Bestätigt!', thanks: 'Vielen Dank für Ihren Einkauf!', emailSent: 'Eine E-Mail mit Ihren Download-Links wurde gesendet an', download: 'Herunterladen', orderNumber: 'Bestellnr.', backHome: 'Zurück zur Startseite' },
    testimonials: { title: 'Was Eltern sagen' },
    footer: { rights: 'Alle Rechte vorbehalten', privacy: 'Datenschutzrichtlinie', terms: 'Nutzungsbedingungen', refund: 'Rückerstattungsrichtlinie', newsletter: 'Erhalten Sie unsere Neuigkeiten', subscribe: 'Abonnieren', emailPlaceholder: 'Ihre E-Mail' },
    promo: { banner: 'Aktion: -20% mit dem Code WILLKOMMEN', exitTitle: '🎨 Warten Sie! Gehen Sie nicht...', exitText: 'Erhalten Sie -10% auf Ihre erste Bestellung', exitCode: 'Ihr Code:', exitCta: 'Ich will es!' },
    trust: { secure: 'Sichere Zahlung', instant: 'Sofortiger Download', guarantee: 'Geld-zurück-Garantie' },
    admin: { dashboard: 'Dashboard', products: 'Produkte', orders: 'Bestellungen', addProduct: 'Produkt Hinzufügen', editProduct: 'Produkt Bearbeiten', save: 'Speichern', cancel: 'Abbrechen', delete: 'Löschen', totalRevenue: 'Gesamtumsatz', totalOrders: 'Bestellungen', totalProducts: 'Produkte', totalDownloads: 'Downloads', login: 'Admin-Login', logout: 'Abmelden' },
    legal: { terms: 'Allgemeine Geschäftsbedingungen', notice: 'Impressum', privacy: 'Datenschutzrichtlinie', refund: 'Rückerstattungsrichtlinie', lastUpdated: 'Letzte Aktualisierung' },
    seo: { homeTitle: 'ColoriMagiques — Malbücher für Kinder | PDF-Download', homeDesc: 'Entdecken Sie unsere Ausmal-E-Books für Kinder von 3 bis 10 Jahren. Sofortiger Download, hochwertige 300 DPI Druckqualität.', catalogTitle: 'Katalog — Alle unsere Malbücher | ColoriMagiques', catalogDesc: 'Entdecken Sie unsere komplette Sammlung von Malbüchern für Kinder. Sofortiger PDF-Download.', productTitle: '{title} — Ausmalen PDF | ColoriMagiques', productDesc: '{title} — {pages} Ausmalseiten, 300 DPI Qualität, für Kinder von {age}.' },
  },
};

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try { return localStorage.getItem('cm_lang') || 'fr'; } catch { return 'fr'; }
  });
  const [currency, setCurrency] = useState(() => {
    try { return localStorage.getItem('cm_currency') || 'EUR'; } catch { return 'EUR'; }
  });

  useEffect(() => { try { localStorage.setItem('cm_lang', lang); } catch {} }, [lang]);
  useEffect(() => { try { localStorage.setItem('cm_currency', currency); } catch {} }, [currency]);

  const t = (path) => {
    const keys = path.split('.');
    let value = translations[lang];
    for (const key of keys) value = value?.[key];
    return value || path;
  };

  const getLocalizedField = (product, field) => {
    if (lang === 'fr') return product[field] || '';
    return product[`${field}_${lang}`] || product[field] || '';
  };

  const formatPrice = (product) => {
    const price = currency === 'EUR' ? (product.price_eur || 0) : (product.price_usd || 0);
    const p = typeof price === 'string' ? parseFloat(price) : price;
    return currency === 'EUR' ? `${p.toFixed(2)}€` : `$${p.toFixed(2)}`;
  };

  const getComparePrice = (product) => {
    const price = currency === 'EUR' ? product.compare_price_eur : product.compare_price_usd;
    if (!price) return null;
    const p = typeof price === 'string' ? parseFloat(price) : price;
    return currency === 'EUR' ? `${p.toFixed(2)}€` : `$${p.toFixed(2)}`;
  };

  const getRawPrice = (product) => {
    const p = currency === 'EUR' ? (product.price_eur || 0) : (product.price_usd || 0);
    return typeof p === 'string' ? parseFloat(p) : p;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, currency, setCurrency, t, getLocalizedField, formatPrice, getComparePrice, getRawPrice }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}

export default LanguageContext;

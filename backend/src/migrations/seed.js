// backend/src/migrations/seed.js
// Insère les données de démonstration (admin + 8 produits + codes promo + avis)
import db from '../config/database.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config();

async function seed() {
  console.log('🌱 ColoriMagiques — Seed des données de démo...\n');

  try {
    // ─── Admin par défaut ───
    const existingAdmin = await db('admins').where('email', process.env.ADMIN_EMAIL || 'admin@colorimagiques.com').first();
    if (!existingAdmin) {
      const hash = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Admin123!', 12);
      await db('admins').insert({
        email: process.env.ADMIN_EMAIL || 'admin@colorimagiques.com',
        password_hash: hash,
        name: 'Administrateur',
        role: 'superadmin',
      });
      console.log('  ✅ Admin créé: ' + (process.env.ADMIN_EMAIL || 'admin@colorimagiques.com'));
    }

    // ─── Codes promo ───
    const promoCodes = [
      { code: 'BIENVENUE', discount_percent: 20, is_active: true },
      { code: 'WELCOME', discount_percent: 20, is_active: true },
      { code: 'BIENVENIDO', discount_percent: 20, is_active: true },
      { code: 'WILLKOMMEN', discount_percent: 20, is_active: true },
      { code: 'FIRST10', discount_percent: 10, is_active: true },
    ];
    for (const promo of promoCodes) {
      const exists = await db('promo_codes').where('code', promo.code).first();
      if (!exists) await db('promo_codes').insert(promo);
    }
    console.log('  ✅ Codes promo créés');

    // ─── 8 Produits de démo ───
    const products = [
      {
        slug: 'animaux-mignons-coloriage',
        title: 'Animaux Mignons — Livre de Coloriage',
        title_en: 'Cute Animals — Coloring Book',
        title_es: 'Animales Lindos — Libro de Colorear',
        title_de: 'Süße Tiere — Malbuch',
        description: 'Découvrez 30 pages de coloriage avec les animaux les plus adorables ! Parfait pour développer la motricité fine de votre enfant tout en s\'amusant.',
        description_en: 'Discover 30 coloring pages with the most adorable animals! Perfect for developing your child\'s fine motor skills while having fun.',
        description_es: 'Descubre 30 páginas para colorear con los animales más adorables. Perfecto para desarrollar la motricidad fina de tu hijo.',
        description_de: 'Entdecken Sie 30 Malseiten mit den süßesten Tieren! Perfekt, um die Feinmotorik Ihres Kindes spielerisch zu fördern.',
        short_description: '30 pages • PDF haute qualité • 300 DPI • Format A4 • Impression illimitée',
        price_eur: 4.99, price_usd: 5.49,
        compare_price_eur: 7.99, compare_price_usd: 8.99,
        page_count: 30, dpi: 300,
        age_group: '3-5', theme: 'animals', badge: 'bestseller',
        is_featured: true, is_published: true,
        average_rating: 4.8, review_count: 24, download_count: 156,
        cover_image: '/images/demo/animals-cover.svg',
        preview_images: JSON.stringify(['/images/demo/animals-p1.svg', '/images/demo/animals-p2.svg', '/images/demo/animals-p3.svg']),
      },
      {
        slug: 'dinosaures-aventure',
        title: 'Dinosaures en Aventure',
        title_en: 'Dinosaur Adventures',
        title_es: 'Aventuras de Dinosaurios',
        title_de: 'Dinosaurier-Abenteuer',
        description: '25 pages de dinosaures rigolos à colorier. Du T-Rex au Tricératops, une aventure préhistorique pour les petits explorateurs !',
        description_en: '25 pages of fun dinosaurs to color. From T-Rex to Triceratops, a prehistoric adventure for little explorers!',
        description_es: '25 páginas de dinosaurios divertidos para colorear. Del T-Rex al Triceratops, ¡una aventura prehistórica!',
        description_de: '25 Seiten lustiger Dinosaurier zum Ausmalen. Vom T-Rex bis zum Triceratops, ein prähistorisches Abenteuer!',
        short_description: '25 pages • PDF • 300 DPI • A4 • Impression illimitée',
        price_eur: 3.99, price_usd: 4.49,
        page_count: 25, dpi: 300,
        age_group: '3-5', theme: 'dinosaurs', badge: 'popular',
        is_featured: true, is_published: true,
        average_rating: 4.9, review_count: 18, download_count: 132,
        cover_image: '/images/demo/dino-cover.svg',
        preview_images: JSON.stringify(['/images/demo/dino-p1.svg', '/images/demo/dino-p2.svg']),
      },
      {
        slug: 'princesses-enchantees',
        title: 'Princesses Enchantées',
        title_en: 'Enchanted Princesses',
        title_es: 'Princesas Encantadas',
        title_de: 'Verzauberte Prinzessinnen',
        description: '35 pages magiques de princesses, châteaux et licornes. Un monde féerique à colorier pour les petites rêveuses.',
        description_en: '35 magical pages of princesses, castles and unicorns. A fairy-tale world to color for little dreamers.',
        description_es: '35 páginas mágicas de princesas, castillos y unicornios.',
        description_de: '35 magische Seiten mit Prinzessinnen, Schlössern und Einhörnern.',
        short_description: '35 pages • PDF • 300 DPI • A4 • Bonus : 5 pages licornes',
        price_eur: 5.99, price_usd: 6.49,
        compare_price_eur: 8.99, compare_price_usd: 9.99,
        page_count: 35, dpi: 300,
        age_group: '6-8', theme: 'princesses', badge: 'new',
        is_featured: true, is_published: true,
        average_rating: 5.0, review_count: 31, download_count: 203,
        cover_image: '/images/demo/princess-cover.svg',
        preview_images: JSON.stringify(['/images/demo/princess-p1.svg', '/images/demo/princess-p2.svg']),
      },
      {
        slug: 'espace-galaxie',
        title: 'Espace & Galaxie — Coloriage Cosmique',
        title_en: 'Space & Galaxy — Cosmic Coloring',
        title_es: 'Espacio y Galaxia — Colorear Cósmico',
        title_de: 'Weltraum & Galaxie — Kosmisches Malbuch',
        description: '28 pages de fusées, planètes et astronautes. Idéal pour les enfants curieux qui rêvent d\'explorer les étoiles.',
        description_en: '28 pages of rockets, planets and astronauts for curious kids who dream of exploring the stars.',
        description_es: '28 páginas de cohetes, planetas y astronautas para niños curiosos.',
        description_de: '28 Seiten mit Raketen, Planeten und Astronauten für neugierige Kinder.',
        short_description: '28 pages • PDF • 300 DPI • A4',
        price_eur: 4.49, price_usd: 4.99,
        page_count: 28, dpi: 300,
        age_group: '6-8', theme: 'space', badge: 'popular',
        is_featured: true, is_published: true,
        average_rating: 4.7, review_count: 15, download_count: 98,
        cover_image: '/images/demo/space-cover.svg',
        preview_images: JSON.stringify(['/images/demo/space-p1.svg', '/images/demo/space-p2.svg']),
      },
      {
        slug: 'nature-sauvage',
        title: 'Nature Sauvage',
        title_en: 'Wild Nature',
        title_es: 'Naturaleza Salvaje',
        title_de: 'Wilde Natur',
        description: '40 pages de forêts, fleurs, papillons et paysages naturels. Un voyage au cœur de la nature.',
        description_en: '40 pages of forests, flowers, butterflies and natural landscapes.',
        description_es: '40 páginas de bosques, flores, mariposas y paisajes naturales.',
        description_de: '40 Seiten mit Wäldern, Blumen, Schmetterlingen und Naturlandschaften.',
        short_description: '40 pages • PDF • 300 DPI • A4 • Niveau intermédiaire',
        price_eur: 5.49, price_usd: 5.99,
        page_count: 40, dpi: 300,
        age_group: '9-10', theme: 'nature', badge: 'new',
        is_featured: true, is_published: true,
        average_rating: 4.6, review_count: 9, download_count: 67,
        cover_image: '/images/demo/nature-cover.svg',
        preview_images: JSON.stringify(['/images/demo/nature-p1.svg']),
      },
      {
        slug: 'vehicules-turbo',
        title: 'Véhicules Turbo',
        title_en: 'Turbo Vehicles',
        title_es: 'Vehículos Turbo',
        title_de: 'Turbo Fahrzeuge',
        description: '22 pages de voitures, camions, avions et bateaux à colorier. Vroooom !',
        description_en: '22 pages of cars, trucks, planes and boats to color. Vroooom!',
        description_es: '22 páginas de coches, camiones, aviones y barcos para colorear.',
        description_de: '22 Seiten mit Autos, LKWs, Flugzeugen und Booten zum Ausmalen.',
        short_description: '22 pages • PDF • 300 DPI • A4',
        price_eur: 3.49, price_usd: 3.99,
        page_count: 22, dpi: 300,
        age_group: '3-5', theme: 'vehicles', badge: '',
        is_featured: true, is_published: true,
        average_rating: 4.5, review_count: 12, download_count: 89,
        cover_image: '/images/demo/vehicles-cover.svg',
        preview_images: JSON.stringify(['/images/demo/vehicles-p1.svg']),
      },
      {
        slug: 'ocean-merveilles',
        title: 'Océan & Merveilles Sous-Marines',
        title_en: 'Ocean & Underwater Wonders',
        title_es: 'Océano y Maravillas Submarinas',
        title_de: 'Ozean & Unterwasserwunder',
        description: '32 pages d\'aventures sous-marines : poissons, dauphins, tortues, récifs coralliens.',
        description_en: '32 pages of underwater adventures: fish, dolphins, turtles, coral reefs.',
        description_es: '32 páginas de aventuras submarinas: peces, delfines, tortugas.',
        description_de: '32 Seiten Unterwasser-Abenteuer: Fische, Delfine, Schildkröten.',
        short_description: '32 pages • PDF • 300 DPI • A4 • Bonus : poster sous-marin',
        price_eur: 4.99, price_usd: 5.49,
        compare_price_eur: 6.99, compare_price_usd: 7.99,
        page_count: 32, dpi: 300,
        age_group: '6-8', theme: 'ocean', badge: 'promo',
        is_featured: true, is_published: true,
        average_rating: 4.9, review_count: 20, download_count: 144,
        cover_image: '/images/demo/ocean-cover.svg',
        preview_images: JSON.stringify(['/images/demo/ocean-p1.svg', '/images/demo/ocean-p2.svg']),
      },
      {
        slug: 'fantaisie-dragons-fees',
        title: 'Fantaisie : Dragons & Fées',
        title_en: 'Fantasy: Dragons & Fairies',
        title_es: 'Fantasía: Dragones y Hadas',
        title_de: 'Fantasie: Drachen & Feen',
        description: '30 pages peuplées de dragons bienveillants, fées magiques et créatures fantastiques.',
        description_en: '30 pages of friendly dragons, magical fairies and fantastic creatures.',
        description_es: '30 páginas de dragones amistosos, hadas mágicas y criaturas fantásticas.',
        description_de: '30 Seiten mit freundlichen Drachen, magischen Feen und fantastischen Kreaturen.',
        short_description: '30 pages • PDF • 300 DPI • A4 • Niveau avancé',
        price_eur: 4.99, price_usd: 5.49,
        page_count: 30, dpi: 300,
        age_group: '9-10', theme: 'fantasy', badge: 'bestseller',
        is_featured: true, is_published: true,
        average_rating: 4.8, review_count: 16, download_count: 110,
        cover_image: '/images/demo/fantasy-cover.svg',
        preview_images: JSON.stringify(['/images/demo/fantasy-p1.svg', '/images/demo/fantasy-p2.svg']),
      },
    ];

    for (const product of products) {
      const exists = await db('products').where('slug', product.slug).first();
      if (!exists) await db('products').insert(product);
    }
    console.log('  ✅ 8 produits de démo créés');

    // ─── Avis de démo ───
    const allProducts = await db('products').select('id', 'slug');
    const reviewTemplates = [
      { author_name: 'Marie L.', rating: 5, comment: 'Mes enfants adorent ! Les dessins sont magnifiques et la qualité d\'impression est top.', language: 'fr' },
      { author_name: 'Sophie D.', rating: 5, comment: 'Parfait pour occuper les enfants pendant les vacances. Je recommande !', language: 'fr' },
      { author_name: 'John S.', rating: 5, comment: 'Amazing quality! My kids love the designs. Will buy more!', language: 'en' },
      { author_name: 'Emma W.', rating: 4, comment: 'Great coloring book, my daughter spent hours on it. Very good value.', language: 'en' },
      { author_name: 'Carlos M.', rating: 5, comment: '¡Excelente calidad! A mis hijos les encanta colorear estos dibujos.', language: 'es' },
      { author_name: 'Anna K.', rating: 5, comment: 'Wunderschöne Illustrationen! Meine Kinder sind begeistert.', language: 'de' },
    ];

    const existingReviews = await db('reviews').count('* as count').first();
    if (existingReviews.count === 0) {
      for (const product of allProducts) {
        const shuffled = [...reviewTemplates].sort(() => Math.random() - 0.5);
        const reviewsForProduct = shuffled.slice(0, 2 + Math.floor(Math.random() * 3));
        for (const review of reviewsForProduct) {
          await db('reviews').insert({ ...review, product_id: product.id, is_approved: true });
        }
      }
      console.log('  ✅ Avis de démo créés');
    }

    console.log('\n🎉 Seed terminé avec succès !');
  } catch (err) {
    console.error('❌ Erreur lors du seed:', err.message);
    throw err;
  } finally {
    await db.destroy();
  }
}

seed();

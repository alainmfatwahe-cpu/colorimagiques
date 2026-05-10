// backend/src/migrations/seed-products.js
// Script de seed — ajoute 8 produits exemples dans la boutique ColoriMagiques
// Usage: node backend/src/migrations/seed-products.js
//
// Nécessite DATABASE_URL ou les variables d'environnement Railway

import db from '../config/database.js';

const products = [
  {
    slug: 'animaux-sauvages-afrique',
    title: 'Les Animaux Sauvages d Afrique',
    title_en: 'Wild Animals of Africa',
    title_es: 'Animales Salvajes de Africa',
    title_de: ' Wilde Tiere Afrikas',
    description: 'Un livre de coloriage de 48 pages avec les animaux les plus majestueux d Afrique : lions, éléphants, girafes, zèbres, rhinocéros et bien plus encore. Parfait pour les enfants de 6 à 10 ans qui adorent la nature.',
    description_en: 'A 48-page coloring book featuring the most majestic animals of Africa: lions, elephants, giraffes, zebras, rhinos and more. Perfect for children aged 6-10 who love nature.',
    description_es: 'Un libro para colorear de 48 paginas con los animales mas majestuosos de Africa: leones, elefantes, jirafas, cebras, rinocerontes y mucho mas.',
    description_de: 'Ein 48-seitiges Ausmalbuch mit den majestatischsten Tieren Afrikas: Lowen, Elefanten, Giraffen, Zebras, Nashorner und mehr.',
    short_description: '48 pages de lions, éléphants et girafes à colorier',
    price_eur: 6.99,
    price_usd: 7.99,
    compare_price_eur: 9.99,
    compare_price_usd: 11.99,
    page_count: 48,
    dpi: 300,
    age_group: '6-8',
    theme: 'animals',
    badge: 'Populaire',
    is_featured: true,
    is_published: true,
    average_rating: 4.80,
    review_count: 24,
    download_count: 156,
    cover_image: null,
    preview_images: JSON.stringify([
      '/api/uploads/images/placeholder-1.jpg',
      '/api/uploads/images/placeholder-2.jpg',
    ]),
    pdf_filename: null,
    bonus_filename: null,
  },
  {
    slug: 'espace-et-explorateurs',
    title: 'L Espace et les Petits Explorateurs',
    title_en: 'Space and Little Explorers',
    title_es: 'El Espacio y los Pequenos Exploradores',
    title_de: ' Weltraum und kleine Entdecker',
    description: 'Découvrez les planètes, les étoiles et les fusées dans ce livre de coloriage de 40 pages. Une aventure cosmique pour les petits astronautes de 6 à 10 ans.',
    description_en: 'Discover planets, stars and rockets in this 40-page coloring book. A cosmic adventure for young astronauts aged 6-10.',
    description_es: 'Descubre planetas, estrellas y cohetes en este libro para colorear de 40 paginas. Una aventura cosmica para jovenes astronautas.',
    description_de: 'Entdecke Planeten, Sterne und Raketen in diesem 40-seitigen Ausmalbuch. Ein kosmisches Abenteuer fur junge Astronauten.',
    short_description: '40 pages de fusées, planètes et étoiles',
    price_eur: 5.99,
    price_usd: 6.99,
    compare_price_eur: 8.99,
    compare_price_usd: 10.49,
    page_count: 40,
    dpi: 300,
    age_group: '6-8',
    theme: 'space',
    badge: 'Nouveau',
    is_featured: true,
    is_published: true,
    average_rating: 4.65,
    review_count: 12,
    download_count: 89,
    cover_image: null,
    preview_images: JSON.stringify([]),
    pdf_filename: null,
    bonus_filename: null,
  },
  {
    slug: 'dinosaures-jurassique',
    title: 'Les Dinosaures du Jurassique',
    title_en: 'Jurassic Dinosaurs',
    title_es: 'Dinosaurios del Jurásico',
    title_de: 'Dinosaurier des Jura',
    description: 'Un livre de coloriage de 56 pages avec les dinosaures les plus impressionnants du Jurassique : T-Rex, Tricératops, Vélociraptor, Brachiosaure et des dizaines d autres espèces préhistoriques.',
    description_en: 'A 56-page coloring book with the most impressive dinosaurs of the Jurassic: T-Rex, Triceratops, Velociraptor, Brachiosaurus and dozens of other prehistoric species.',
    short_description: '56 pages de T-Rex et dinosaures du Jurassique',
    price_eur: 7.99,
    price_usd: 8.99,
    compare_price_eur: null,
    compare_price_usd: null,
    page_count: 56,
    dpi: 300,
    age_group: '6-8',
    theme: 'dinosaurs',
    badge: '',
    is_featured: false,
    is_published: true,
    average_rating: 4.90,
    review_count: 38,
    download_count: 203,
    cover_image: null,
    preview_images: JSON.stringify([]),
    pdf_filename: null,
    bonus_filename: null,
  },
  {
    slug: 'princesses-et-royal',
    title: 'Princesses et Fée du Royaume',
    title_en: 'Princesses and Fairy Kingdom',
    title_es: 'Princesas y Hadas del Reino',
    title_de: ' Prinzessinnen und Feenreich',
    description: 'Un livre enchanteur de 44 pages avec des princesses, des châteaux, des fées et des licornes. Des illustrations magiques pour les petites filles de 3 à 8 ans.',
    description_en: 'A magical 44-page book with princesses, castles, fairies and unicorns. Magical illustrations for girls aged 3-8.',
    short_description: '44 pages de princesses, fées et licornes',
    price_eur: 5.99,
    price_usd: 6.99,
    compare_price_eur: 7.99,
    compare_price_usd: 9.49,
    page_count: 44,
    dpi: 300,
    age_group: '3-5',
    theme: 'princesses',
    badge: '',
    is_featured: false,
    is_published: true,
    average_rating: 4.72,
    review_count: 19,
    download_count: 112,
    cover_image: null,
    preview_images: JSON.stringify([]),
    pdf_filename: null,
    bonus_filename: null,
  },
  {
    slug: 'nature-fleurs-jardin',
    title: 'La Nature et les Fleurs du Jardin',
    title_en: 'Nature and Garden Flowers',
    title_es: 'La Naturaleza y las Flores del Jardin',
    title_de: ' Natur und Gartenblumen',
    description: 'Un livre de coloriage de 36 pages avec des fleurs, des papillons, des escargots et des paysages naturels. Détente et créativité pour les enfants de 3 à 7 ans.',
    description_en: 'A 36-page coloring book with flowers, butterflies, snails and natural landscapes. Relaxation and creativity for children aged 3-7.',
    short_description: '36 pages de fleurs, papillons et nature',
    price_eur: 4.99,
    price_usd: 5.49,
    compare_price_eur: null,
    compare_price_usd: null,
    page_count: 36,
    dpi: 300,
    age_group: '3-5',
    theme: 'nature',
    badge: 'Promo',
    is_featured: false,
    is_published: true,
    average_rating: 4.55,
    review_count: 8,
    download_count: 67,
    cover_image: null,
    preview_images: JSON.stringify([]),
    pdf_filename: null,
    bonus_filename: null,
  },
  {
    slug: 'vehicules-et-engins',
    title: 'Véhicules et Engins de Chantier',
    title_en: 'Vehicles and Construction Machines',
    title_es: 'Vehiculos y Maquinas de Construccion',
    title_de: 'Fahrzeuge und Baumaschinen',
    description: '36 pages de camions, pelleteuses, grues, bulldozers et tous les engins de chantier. Le livre idéal pour les petits любители машин aged 4-9 ans.',
    description_en: '36 pages of trucks, excavators, cranes, bulldozers and all construction machines. The ideal book for young machine lovers aged 4-9.',
    short_description: '36 pages de camions, pelleteuses et grues',
    price_eur: 5.49,
    price_usd: 6.49,
    compare_price_eur: null,
    compare_price_usd: null,
    page_count: 36,
    dpi: 300,
    age_group: '6-8',
    theme: 'vehicles',
    badge: '',
    is_featured: false,
    is_published: true,
    average_rating: 4.68,
    review_count: 15,
    download_count: 94,
    cover_image: null,
    preview_images: JSON.stringify([]),
    pdf_filename: null,
    bonus_filename: null,
  },
  {
    slug: 'dragon-magique',
    title: 'Les Dragons Magiques',
    title_en: 'Magical Dragons',
    title_es: 'Dragones Magicos',
    title_de: 'Magische Drachen',
    description: 'Un livre de coloriage de 52 pages avec des dragons de tous les styles : dragons de feu, dragons de glace, dragons volants et dragons des profondeurs. Pour les rêveurs de 7 à 10 ans.',
    description_en: 'A 52-page coloring book with dragons of all styles: fire dragons, ice dragons, flying dragons and deep-sea dragons. For dreamers aged 7-10.',
    short_description: '52 pages de dragons magiques et fantastiques',
    price_eur: 6.49,
    price_usd: 7.49,
    compare_price_eur: 8.99,
    compare_price_usd: 10.99,
    page_count: 52,
    dpi: 300,
    age_group: '9-10',
    theme: 'fantasy',
    badge: '',
    is_featured: false,
    is_published: true,
    average_rating: 4.85,
    review_count: 21,
    download_count: 178,
    cover_image: null,
    preview_images: JSON.stringify([]),
    pdf_filename: null,
    bonus_filename: null,
  },
  {
    slug: 'ocean-profondeurs',
    title: 'L Ocean et ses Profondeurs',
    title_en: 'The Ocean and its Depths',
    title_es: 'El Oceano y sus Profundidades',
    title_de: 'Der Ozean und seine Tiefen',
    description: 'Un voyage sous-marin de 48 pages : requins, baleines, tortues, méduses, coraux et créatures des abysses. Un livre pédagogique et amusant pour les enfants de 5 à 10 ans.',
    description_en: 'An underwater journey of 48 pages: sharks, whales, turtles, jellyfish, corals and deep-sea creatures. An educational and fun book for children aged 5-10.',
    short_description: '48 pages de requins, baleines et créatures marines',
    price_eur: 6.99,
    price_usd: 7.99,
    compare_price_eur: null,
    compare_price_usd: null,
    page_count: 48,
    dpi: 300,
    age_group: '6-8',
    theme: 'ocean',
    badge: '',
    is_featured: false,
    is_published: true,
    average_rating: 4.60,
    review_count: 11,
    download_count: 83,
    cover_image: null,
    preview_images: JSON.stringify([]),
    pdf_filename: null,
    bonus_filename: null,
  },
];

async function seed() {
  console.log('🌱 Starting product seed...\n');

  try {
    let inserted = 0;
    let skipped = 0;

    for (const product of products) {
      // Check if product with this slug already exists
      const existing = await db('products').where('slug', product.slug).first();
      if (existing) {
        console.log(`  ⏭️  Skipped: ${product.slug} (already exists)`);
        skipped++;
        continue;
      }

      await db('products').insert(product);
      console.log(`  ✅ Inserted: ${product.slug} — ${product.title}`);
      inserted++;
    }

    console.log(`\n🎉 Seed complete!`);
    console.log(`   ${inserted} products inserted`);
    console.log(`   ${skipped} products skipped (already exist)`);
    console.log(`   ${products.length} total in database`);

    // Show current count
    const count = await db('products').count('id as total').first();
    console.log(`   ${count.total} total products in DB`);

  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    throw err;
  } finally {
    await db.destroy();
    console.log('\n🔌 Database connection closed.');
  }
}

seed();
import { Router } from 'express';
import db from '../config/database.js';
const router = Router();

function slugify(name) {
  return name.toLowerCase()
    .replace(/b[eé]b[eé]/gi, 'bebe')
    .replace(/[éèêë]/gi, 'e').replace(/[àâä]/gi, 'a')
    .replace(/[îï]/gi, 'i').replace(/[ùûü]/gi, 'u')
    .replace(/[ôö]/gi, 'o').replace(/[ç]/gi, 'c')
    .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

const PRE_PDF_THEMES = {
  'Alphabet pre pdf': { theme: 'alphabet', themeLabel: 'Alphabet', age_group: '3-5', price_eur: 1.99, price_usd: 2.29, badge: 'Nouveau', featured: true },
  'color pre pdf':    { theme: 'color',    themeLabel: 'Color',    age_group: '3-5', price_eur: 1.99, price_usd: 2.29, badge: '',      featured: false },
  'forme geometrique pre pdf': { theme: 'forme-geometrique', themeLabel: 'Forme geometrique', age_group: '3-5', price_eur: 1.99, price_usd: 2.29, badge: '', featured: false },
  'Nursery prints pre pdf': { theme: 'nursery-prints', themeLabel: 'Nursery Prints', age_group: '0-3', price_eur: 2.99, price_usd: 3.49, badge: 'Populaire', featured: true },
};

const FILES = {
  'Alphabet pre pdf': ['A.png','B.png','C.png','D.png','E.png','F.png','G.png','H.png','I.png','J.png','K.png','L.png','M.png','N.png','O.png','P.png','Q.png','R.png','S.png','T.png','U.png','V.png','W.png','X.png','Y.png','Z.png'],
  'color pre pdf': ['Black color.png','Blue color.png','Brown color.png','Green color.png','Indigo color.png','Orange color.png','Pink color.png','Purple color.png','Red color.png','Sky blue color.png','White color.png','Yellow color.png'],
  'forme geometrique pre pdf': ['carre.png','Cercle.png','Coeur.png','demi lune.png','diamant.png','hexagone.png','Octogone.png','pentagone.png','rectangle.png','triangle.png','trapeze.png','Losange.png'],
  'Nursery prints pre pdf': ['Anaconda.jpg','Arc-en-ciel.png','Astraunote sur la lune.png','Avion.png','bateau a voile.png','bb croco.jpg','bb fox 2.jpg','bb fox.jpg','bb giraffe.jpg','bb lapin.jpg','bb lion.jpg','bb loupe.jpg','bb ours 2.jpg','bb ours.jpg','bb panda.jpg','bb phoque.jpg','bb pingouin 2.jpg','bb pingouin.jpg','bb renard.jpg','bb singe.jpg','bb tortue.jpg','bebe araignee.jpg','bebe elephant.jpg','bebe escargot.jpg','bebe requin.jpg','bebe sumo.jpg','bot a bonbons.jpg','bouteille lait.jpg','brosse a dent.jpg','cahier.jpg','calendrier avent.jpg','camion一回','camion一回(1).jpg','carre de magie.jpg','carte invitation.jpg','cham.allow.jpg','chevalier一回.jpg','chevre一回.jpg','circle一回.jpg','coffret cadeau.jpg','coiffure一回.jpg','coq一回.jpg','couché一回.jpg','coussin一回.jpg','crystal回.jpg','cygne一回.jpg','danseuse.jpg','dauphin一回.jpg','desert一回.jpg','dinosaure一回.jpg','dragon一回.jpg','drogon一回.jpg','eclair一回.jpg','ecureuil一回.jpg','ecureu 回.jpg',' elephant一回.jpg','fantome一回.jpg','fee一回.jpg','flamant一回.jpg','fleur一回.jpg','fork一回.jpg','fraise一回.jpg','fromage一回.jpg','gateau一回.jpg','girafe一回.jpg','glacon一回.jpg','grenouille一回.jpg','hibou一回.jpg','hippopotame一回.jpg','icone一回.jpg','jean一回.jpg','jeu de societe一回.jpg','jongleur一回.jpg','kirby一回.jpg','lampe一回.jpg','lampadaire一回.jpg','leon一回.jpg','licorne一回.jpg','livre一回.jpg','loup一回.jpg','lutin一回.jpg','magicien一回.jpg','maisons一回.jpg','mandala一回.jpg','marionnette一回.jpg','masque一回.jpg','mau一回.jpg','mouton一回.jpg','neige一回.jpg','neige2一回.jpg','nourrison一回.jpg','nuage一回.jpg','oeuf一回.jpg','ogre一回.jpg','oiseau一回.jpg','one piece一回.jpg','oursin一回.jpg','pagne一回.jpg','panda一回.jpg','panthere.jpg','papa一回.jpg','parker一回.jpg','patron一回.jpg','petit poussin一回.jpg','pirate一回.jpg','pistolet一回.jpg','pizza一回.jpg','plage一回.jpg','pokedex一回.jpg','pokemon一回.jpg','pompier一回.jpg','poney一回.jpg','princesse一回.jpg','pyramide一回.jpg','raie一回.jpg','regle一回.jpg','renne一回.jpg','requin一回.jpg','roi一回.jpg','sale一回.jpg','sapin一回.jpg','saturn.jpg','serpent一回.jpg','sko.jpg','skull一回.jpg','soleil一回.jpg','sorciere一回.jpg','sphinx一回.jpg','sports一回.jpg','statue一回.jpg','sucette一回.jpg','tas.jpg','taupe一回.jpg','tetoine一回.jpg','tortue一回.jpg','tour一回.jpg','tricycle一回.jpg','troll一回.jpg','trou一回.jpg','valise一回.jpg','vase一回.jpg','velo一回.jpg','ver de terre一回.jpg','violon一回.jpg','voiture一回.jpg','zebra一回.jpg','zon.jpg'],
};

router.post('/seed-all', async (req, res) => {
  try {
    const results = [];
    for (const [dir, config] of Object.entries(PRE_PDF_THEMES)) {
      const files = FILES[dir] || [];
      for (const file of files) {
        const baseName = file.replace(/\.[^.]+$/, '').trim();
        const slug = config.theme + '-' + slugify(baseName).substring(0, 45);
        const title = baseName
          .replace(/ color$/i, '').replace(/^color /i, 'Color ')
          .replace(/^forme /i, 'Forme ').replace(/^bb /i, 'Bebe ')
          .replace(/b[eé]b[eé]/gi, 'Bebe').replace(/\d+一回.*/, '')
          .replace(/\s*\(\d+\)\s*$/, '').trim();
        if (!title || title.length < 1) { results.push({ slug: baseName, status: 'skipped-name-empty' }); continue; }
        const existing = await db('products').where('slug', slug).first();
        if (existing) { results.push({ slug, status: 'skipped' }); continue; }
        const product = {
          slug, title, short_description: config.themeLabel + ' - ' + title,
          price_eur: config.price_eur, price_usd: config.price_usd,
          page_count: 1, dpi: 300, age_group: config.age_group, theme: config.theme,
          badge: config.badge, is_featured: config.featured, is_published: true,
          preview_images: '[]', pdf_filename: file, bonus_filename: null, description: null,
        };
        const result = await db('products').returning('id').insert(product);
        const id = Array.isArray(result) ? result[0] : result;
        results.push({ slug, status: 'inserted', id, title });
      }
    }
    const count = await db('products').count('id as total').first();
    const inserted = results.filter(r => r.status === 'inserted').length;
    const skipped = results.filter(r => r.status !== 'inserted').length;
    res.json({ success: true, inserted, skipped, total: count.total, sample: results.filter(r=>r.status==='inserted').slice(0,5) });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

export default router;
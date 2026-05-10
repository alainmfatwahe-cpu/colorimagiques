products = []

# Alphabet - 26 products
for letter in 'ABCDEFGHIJKLMNOPQRSTUVWXYZ':
    products.append({'slug': f'alphabet-{letter.lower()}', 'title': f'Lettre {letter}', 'theme': 'alphabet', 'short_description': f'Alphabet - Lettre {letter}', 'price_eur': 1.99, 'price_usd': 2.29, 'page_count': 1, 'dpi': 300, 'age_group': '3-5', 'badge': 'Nouveau', 'is_featured': True, 'is_published': True, 'pdf_filename': f'{letter}.png'})

# Color - 12 products  
colors = ['Black','Blue','Brown','Green','Indigo','Orange','Pink','Purple','Red','Sky blue','White','Yellow']
for c in colors:
    slug = f'color-{c.lower().replace(" ","-")}'
    fn = f'{c.lower().replace(" ","-")}-color.png'
    products.append({'slug': slug, 'title': f'Color {c}', 'theme': 'color', 'short_description': f'Color - {c}', 'price_eur': 1.99, 'price_usd': 2.29, 'page_count': 1, 'dpi': 300, 'age_group': '3-5', 'badge': '', 'is_featured': False, 'is_published': True, 'pdf_filename': fn})

# Forme geometrique - 12 products
formes = [('carre','Carre'),('Cercle','Cercle'),('Coeur','Coeur'),('demi-lune','Demi Lune'),('diamant','Diamant'),('hexagone','Hexagone'),('octogone','Octogone'),('pentagone','Pentagone'),('rectangle','Rectangle'),('triangle','Triangle'),('trapeze','Trapeze'),('losange','Losange')]
for slug_suffix, title in formes:
    fn = f'{slug_suffix}.png'
    products.append({'slug': f'forme-geometrique-{slug_suffix}', 'title': f'Forme {title}', 'theme': 'forme-geometrique', 'short_description': f'Forme geometrique - {title}', 'price_eur': 1.99, 'price_usd': 2.29, 'page_count': 1, 'dpi': 300, 'age_group': '3-5', 'badge': '', 'is_featured': False, 'is_published': True, 'pdf_filename': fn})

# Nursery Prints - 122 products
nursery_files = ['Anaconda.jpg','Arc-en-ciel.png','Astraunote sur la lune.png','Avion.png','bateau a voile.png','beautiful garden.jpg','biche.jpg','Blaireau.jpg','Caméléon.jpg','canapé des histoire et des siestes.png','canard rider.png','Candy land.png','Castor.jpg','Centaure.jpg','Cerbère.jpg','Chat-sirène.jpg','Chateau magique.png','Chimère.jpg','Chiot.png','Chouette.png','Cupcake.png','Demi-lune.png','Dinausore.png','Dragon.jpg','Elephant.png','Fleur.png','foret féérique.jpg','Fusée.png','Féé.jpg','Gazelle.jpg','Giraffe.png','Glace.png','Gnome.jpg','Grenouille.jpg','Griffon.jpg','Guépard.jpg','Harpie.jpg','hypopotame.jpg','Hyène.jpg','Hérisson.jpg','Hérisson.png','Jaguar.jpg','Jardin asiatique.png','Kitsune.jpg','Koala.png','Lapin-lunaire.jpg','Lapin-magique.jpg','Lapin.png','Licorne.jpg','lion.png','Monde des dinausaures.png','Mongolifière.png','Monster truck.png','nuage d'orage.jpg','Nuage.png','Ours.png','Panda.png','Parapluie.png','paresseux.png','Perroquet.jpg','Phoque.png','Phoénix.jpg','Pivert.jpg','Pégase.jpg','raton-laveur.jpg','renard.png','Rinocéros.jpg','Sanglier.jpg','Scene gardin.png','Scème magasin de jouets.png','Scène cirque.png','Scène animalerie.png','Scène animaux musicien.jpg','Scène anniversaire.png','Scène automne.png','Scène bibliothèque.jpg','Scène boulangerie.jpg','scène boutique de glace.png','Scène cabane.png','scène camping.png','Scène carnaval.png','Scène cerf-volant.jpg','Scène ciel.png','Scène espace.png','Scène ferme.png','Scène foret.png','Scène fruit.jpg','scène galaxy.jpg','Scène gouté.png','Scène hiver.png','scène jungle.jpg','Scène marais.png','Scène marché moyen age.jpg','Scène mer+ phare.png','scène montagne.jpg','Scène musique.png','Scène météo.jpg','Scène nids d'oiseau.png','Scène nourriture.png','Scène pirate.jpg','Scène plage.jpg','Scène potagé.png','Scène savane.jpg','scène sous-marine.png','Scène terrain de jeu.png','Scène vehicule.jpg','Scène voyage.jpg','Singe.jpg','Sirène et poisson.png','Soleil.png','Suricate.jpg','Tapir.jpg','Teepee.png','Toucan.jpg','Village de cabane dans les arbres.png','Vélo.png','Yéti.jpg','zèbre v2.jpg','zèbre.png','écureil.jpg','élan.jpg','étoile.png']

def make_slug(filename):
    base = filename.rsplit('.', 1)[0].strip()
    # Replace bb -> Bebe, special chars, limit 50 chars
    base = base.replace('bb ', 'Bebe ').replace('Bb ', 'Bebe ')
    base = base.replace("'", '').replace('+', '-plus-')
    base = base.lower().replace(' ', '-').replace('_', '-')
    base = ''.join(c if c.isalnum() or c in '-éèàùêëïîôû' else '' for c in base)
    base = base.replace('é','e').replace('è','e').replace('ê','e').replace('ë','e')
    base = base.replace('à','a').replace('â','a').replace('ä','a')
    base = base.replace('ù','u').replace('û','u').replace('ü','u')
    base = base.replace('î','i').replace('ï','i')
    base = base.replace('ô','o').replace('ö','o')
    base = base.replace('ç','c')
    while '--' in base: base = base.replace('--', '-')
    base = base.strip('-')
    return base[:50]

def make_title(filename):
    base = filename.rsplit('.', 1)[0].strip()
    base = base.replace('bb ', 'Bebe ').replace('Bb ', 'Bebe ')
    base = base.replace('Scène ', 'Scene ')
    base = base.replace('scène ', 'Scene ')
    return base

featured_nursery = ['Anaconda.jpg','Arc-en-ciel.png','Astraunote sur la lune.png','Elephant.png','Licorne.jpg','Chat-sirène.jpg']
badge_nursery = ['Licorne.jpg','Elephant.png','Arc-en-ciel.png','Chat-sirène.jpg','Anaconda.jpg','Dragon.jpg']

for fn in nursery_files:
    slug = 'nursery-prints-' + make_slug(fn)
    title = make_title(fn)
    badge = 'Populaire' if fn in badge_nursery else ''
    products.append({'slug': slug, 'title': title, 'theme': 'nursery-prints', 'short_description': f'Nursery Prints - {title}', 'price_eur': 2.99, 'price_usd': 3.49, 'page_count': 1, 'dpi': 300, 'age_group': '0-3', 'badge': badge, 'is_featured': fn in featured_nursery, 'is_published': True, 'pdf_filename': fn})

import json
code = f"""import {{ Router }} from 'express';
import db from '../config/database.js';
const router = Router();

router.post('/seed-all', async (req, res) => {{
  try {{
    await db.raw('ALTER TABLE products DROP CONSTRAINT IF EXISTS products_theme_check');
    await db.raw("ALTER TABLE products ADD CONSTRAINT products_theme_check CHECK (theme IN ('animals','space','dinosaurs','princesses','nature','vehicles','fantasy','ocean','alphabet','color','forme-geometrique','nursery-prints'))");
    const products = {json.dumps(products, ensure_ascii=False)};
    let inserted = 0, skipped = 0;
    for (const p of products) {{
      const existing = await db('products').where('slug', p.slug).first();
      if (existing) {{ skipped++; continue; }}
      await db('products').insert({{
        slug: p.slug, title: p.title, short_description: p.short_description,
        price_eur: p.price_eur, price_usd: p.price_usd,
        page_count: p.page_count, dpi: p.dpi, age_group: p.age_group,
        theme: p.theme, badge: p.badge, is_featured: p.is_featured,
        is_published: p.is_published, preview_images: '[]',
        pdf_filename: p.pdf_filename, bonus_filename: null, description: null
      }});
      inserted++;
    }}
    const count = await db('products').count('id as total').first();
    res.json({{ success: true, inserted, skipped, total: count.total }});
  }} catch (err) {{ res.status(500).json({{ error: err.message }}); }}
}});
export default router;"""

with open('C:/Users/Alain/workspace/colorimagiques/webapp/backend/src/routes/reset.js', 'w', encoding='utf-8') as f:
    f.write(code)
print(f'Done: {len(products)} products')

import json

products = []

for letter in 'ABCDEFGHIJKLMNOPQRSTUVWXYZ':
    products.append({'slug': f'alphabet-{letter.lower()}', 'title': f'Lettre {letter}', 'theme': 'alphabet', 'short_description': f'Alphabet - Lettre {letter}', 'price_eur': 1.99, 'price_usd': 2.29, 'page_count': 1, 'dpi': 300, 'age_group': '3-5', 'badge': 'Nouveau', 'is_featured': True, 'is_published': True, 'pdf_filename': f'{letter}.png'})

for c in ['Black','Blue','Brown','Green','Indigo','Orange','Pink','Purple','Red','Sky blue','White','Yellow']:
    slug = f'color-{c.lower().replace(" ","-")}'
    products.append({'slug': slug, 'title': f'Color {c}', 'theme': 'color', 'short_description': f'Color - {c}', 'price_eur': 1.99, 'price_usd': 2.29, 'page_count': 1, 'dpi': 300, 'age_group': '3-5', 'badge': '', 'is_featured': False, 'is_published': True, 'pdf_filename': f'{c.lower().replace(" ","-")}-color.png'})

for s,t in [('carre','Carre'),('Cercle','Cercle'),('Coeur','Coeur'),('demi-lune','Demi Lune'),('diamant','Diamant'),('hexagone','Hexagone'),('octogone','Octogone'),('pentagone','Pentagone'),('rectangle','Rectangle'),('triangle','Triangle'),('trapeze','Trapeze'),('losange','Losange')]:
    products.append({'slug': f'forme-geometrique-{s}', 'title': f'Forme {t}', 'theme': 'forme-geometrique', 'short_description': f'Forme geometrique - {t}', 'price_eur': 1.99, 'price_usd': 2.29, 'page_count': 1, 'dpi': 300, 'age_group': '3-5', 'badge': '', 'is_featured': False, 'is_published': True, 'pdf_filename': f'{s}.png'})

nursery = ['Anaconda.jpg','Arc-en-ciel.png','Astraunote sur la lune.png','Avion.png','bateau a voile.png','beautiful garden.jpg','biche.jpg','Blaireau.jpg','Caméléon.jpg','canape des histoire et des siestes.png','canard rider.png','Candy land.png','Castor.jpg','Centaure.jpg','Cerbere.jpg','Chat-sirene.jpg','Chateau magique.png','Chimere.jpg','Chiot.png','Chouette.png','Cupcake.png','Demi-lune.png','Dinausore.png','Dragon.jpg','Elephant.png','Fleur.png','foret feerique.jpg','Fusee.png','Fee.jpg','Gazelle.jpg','Giraffe.png','Glace.png','Gnome.jpg','Grenouille.jpg','Griffon.jpg','Guepard.jpg','Harpie.jpg','hypopotame.jpg','Hyene.jpg','Herisson.jpg','Herisson.png','Jaguar.jpg','Jardin asiatique.png','Kitsune.jpg','Koala.png','Lapin-lunaire.jpg','Lapin-magique.jpg','Lapin.png','Licorne.jpg','lion.png','Monde des dinausaures.png','Mongolifiere.png','Monster truck.png',"nuage d'orage.jpg",'Nuage.png','Ours.png','Panda.png','Parapluie.png','paresseux.png','Perroquet.jpg','Phoque.png','Phoenix.jpg','Pivert.jpg','Pegase.jpg','raton-laveur.jpg','renard.png','Rinoceros.jpg','Sanglier.jpg','Scene gardin.png','Sceme magasin de jouets.png','Scene cirque.png','Scene animalerie.png','Scene animauxmusicien.jpg','Scene anniversaire.png','Scene automne.png','Scene bibliotheque.jpg','Scene boulangerie.jpg','scene boutique de glace.png','Scene cabane.png','scene camping.png','Scene carnaval.png','Scene cerf-volant.jpg','Scene ciel.png','Scene espace.png','Scene ferme.png','Scene foret.png','Scene fruit.jpg','scene galaxy.jpg','Scene goute.png','Scene hiver.png','scene jungle.jpg','Scene marais.png','Scene marche moyen age.jpg','Scene mer+ phare.png','scene montagne.jpg','Scene musique.png','Scene meteo.jpg',"Scene nids d'oiseau.png",'Scene nourriture.png','Scene pirate.jpg','Scene plage.jpg','Scene potage.png','Scene savane.jpg','scene sous-marine.png','Scene terrain de jeu.png','Scene vehicule.jpg','Scene voyage.jpg','Singe.jpg','Sirene et poisson.png','Soleil.png','Suricate.jpg','Tapir.jpg','Teepee.png','Toucan.jpg','Village de cabane dans les arbres.png','Velo.png','Yeti.jpg','zebre v2.jpg','zebre.png','ecureil.jpg','elan.jpg','etoile.png']
badge_n = ['Licorne.jpg','Elephant.png','Arc-en-ciel.png','Chat-sirene.jpg','Anaconda.jpg','Dragon.jpg']
feat_n = ['Anaconda.jpg','Arc-en-ciel.png','Astraunote sur la lune.png','Elephant.png','Licorne.jpg','Chat-sirene.jpg']

for fn in nursery:
    base = fn.rsplit('.',1)[0].strip().replace('bb ','Bebe ')
    slug = 'nursery-prints-' + ''.join(c if c.isalnum() or c in '- ' else '' for c in base.lower()).replace(' ','-').replace('+','plus').replace("'",'')[:50].strip('-')
    products.append({'slug': slug, 'title': base, 'theme': 'nursery-prints', 'short_description': f'Nursery Prints - {base}', 'price_eur': 2.99, 'price_usd': 3.49, 'page_count': 1, 'dpi': 300, 'age_group': '0-3', 'badge': 'Populaire' if fn in badge_n else '', 'is_featured': fn in feat_n, 'is_published': True, 'pdf_filename': fn})

insert_code = f"""    const products = {json.dumps(products, ensure_ascii=False)};
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
"""

footer = "  } catch (err) { res.status(500).json({ error: err.message }); }\n});\nexport default router;"

full_code = $content + "`n" + insert_code + "`n" + footer

with open('C:/Users/Alain/workspace/colorimagiques/webapp/backend/src/routes/reset.js', 'w', encoding='utf-8') as f:
    f.write(full_code)
print(f'Written {len(products)} products + constraint fixes')

import psycopg2, os

conn = psycopg2.connect(os.environ['DATABASE_URL'])
cur = conn.cursor()
updates = [
    ('les-jeux-olympiques-de-noel', 'Livre Les Jeux Olympiques de Noel_30 pages.pdf'),
    ('noel-adorable-pour-enfants', 'Livre Noel Adorable pour Enfants_22 pages.pdf'),
    ('latelier-des-oufs-decores', "Livre L'Atelier des Oufs Decorés_35 pages.pdf"),
    ('latelier-magique-du-pere-noel', "Livre L'Atelier Magique du Père Noel_35 pages.pdf"),
]
for slug, fn in updates:
    cur.execute("UPDATE products SET pdf_filename = %s WHERE slug = %s", (fn, slug))
    print(f"OK {slug}: {fn}")
conn.commit()
print(f"Total mis a jour: {len(updates)}")
conn.close()

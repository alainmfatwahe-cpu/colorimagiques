import fitz, os, sys

src = r"C:\Users\Alain\workspace\colorimagiques\webapp\backend\uploads\images"

files = [
    ("les-jeux-olympiques-de-noel", "Mockups Livre Les Jeux Olympiques de Noel_10 images.pdf", 10),
    ("noel-adorable-pour-enfants", "Mockups Livre Noel Adorable pour Enfants_6 images.pdf", 6),
]

for slug, fn, total in files:
    full = os.path.join(src, fn)
    print(f"Trying: {full}")
    print(f"  exists: {os.path.exists(full)}")
    if os.path.exists(full):
        doc = fitz.open(full)
        for i in range(total):
            pix = doc[i].get_pixmap(matrix=fitz.Matrix(1.5, 1.5), alpha=False)
            pix.save(os.path.join(src, f"{slug}_mockup_{i+1}.png"))
            print(f"  saved {slug}_mockup_{i+1}.png")
        doc.close()
    else:
        # Try listing all files in dir
        all_files = os.listdir(src)
        matches = [f for f in all_files if 'Jeux' in f or 'Noel' in f or '10' in f]
        print(f"  possible matches: {matches}")

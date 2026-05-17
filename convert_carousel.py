import fitz, os

src = r"C:\Users\Alain\workspace\colorimagiques\webapp\backend\uploads\images"
dst = r"C:\Users\Alain\workspace\colorimagiques\webapp\backend\uploads\images"

books = [
    ("les-jeux-olympiques-de-noel", "Mockups Livre Les Jeux Olympiques de Noel_10 images.pdf", 10),
    ("noel-adorable-pour-enfants", "Mockups Livre Noel Adorable pour Enfants_6 images.pdf", 6),
    ("latelier-des-oufs-decores", "Mockups Livre L'Atelier des Oufs Decorés_11 images.pdf", 11),
    ("latelier-magique-du-pere-noel", "Mockups Livre L'Atelier Magique du Pere Noel_9 images.pdf", 9),
]

for slug, filename, total_pages in books:
    pdf_path = os.path.join(src, filename)
    if not os.path.exists(pdf_path):
        print(f"NOT FOUND: {filename}")
        continue
    doc = fitz.open(pdf_path)
    print(f"Processing {slug}: {total_pages} pages")
    image_urls = []
    for i in range(min(total_pages, doc.page_count)):
        page = doc[i]
        mat = fitz.Matrix(1.5, 1.5)  # ~130 DPI
        pix = page.get_pixmap(matrix=mat, alpha=False)
        out_name = f"{slug}_mockup_{i+1}.png"
        pix.save(os.path.join(dst, out_name))
        image_urls.append(out_name)
        print(f"  -> {out_name}")
    doc.close()
    print(f"Done: {len(image_urls)} images for {slug}")

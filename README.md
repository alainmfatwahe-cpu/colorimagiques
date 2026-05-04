# ColoriMagiques

> Boutique en ligne de e-books de coloriage pour enfants de 3 à 10 ans.
> Téléchargement instantané, impression illimitée, paiement sécurisé Stripe.

---

## Apercu

| | |
|---|---|
| **Stack** | React 18 + Vite · Node.js 20 + Express · Knex (SQLite/MySQL) · Stripe · Nodemailer |
| **Langues** | Francais, English, Espanol, Deutsch |
| **Devises** | EUR, USD |
| **Infra** | Docker Compose (MySQL 8 + Backend + Nginx) |
| **SEO** | Meta dynamiques, OG, JSON-LD, sitemap.xml, robots.txt |

---

## Architecture

```
colorimagiques/
├── backend/                  # API Node.js/Express (port 3000/4000)
│   ├── src/
│   │   ├── server.js         # Point d'entree Express
│   │   ├── config/
│   │   │   ├── database.js   # Knex : SQLite (dev) / MySQL (prod)
│   │   │   ├── stripe.js     # Client Stripe SDK
│   │   │   └── email.js      # Transporteur Nodemailer SMTP
│   │   ├── middleware/
│   │   │   ├── auth.js       # JWT : generateToken, requireAuth, requireSuperAdmin
│   │   │   └── upload.js     # Multer : PDF + images (UUID filenames)
│   │   ├── migrations/
│   │   │   ├── run.js        # Schema 7 tables (+ newsletter_subscribers, reviews.verified_purchase)
│   │   │   └── seed.js       # 8 produits demo, 1 admin, 5 promos, avis multilingues
│   │   ├── routes/
│   │   │   ├── auth.js       # POST /login, GET /me
│   │   │   ├── products.js   # CRUD public + admin
│   │   │   ├── orders.js     # Checkout Stripe, webhook, verify, promo, admin
│   │   │   ├── downloads.js  # GET /:token (stream PDF securise)
│   │   │   ├── reviews.js    # Avis verifies + moderation admin (approve/reject/pending)
│   │   │   ├── newsletter.js  # Subscribe/unsubscribe/admin stats
│   │   │   └── seo.js        # GET /sitemap.xml, /robots.txt
│   │   └── services/
│   │       ├── stripeService.js    # createCheckoutSession, constructWebhookEvent
│   │       ├── emailService.js     # Template HTML multilingue (FR/EN/ES/DE)
│   │       └── downloadService.js  # Liens signes UUID, 24h, 5 DL max
│   ├── uploads/              # Stockage local PDFs + images
│   ├── .env                  # Configuration (voir section Config)
│   ├── Dockerfile
│   └── package.json
│
├── frontend/                 # SPA React 18 + Vite + TailwindCSS
│   ├── src/
│   │   ├── App.jsx           # Router : /, /catalog, /product/:id, /checkout, /admin, /legal/*
│   │   ├── main.jsx          # Point d'entree React
│   │   ├── pages/
│   │   │   ├── Home.jsx      # Hero, featured products, testimonials
│   │   │   ├── Catalog.jsx   # Filtres (age, theme), tri, recherche
│   │   │   ├── ProductDetail.jsx  # Galerie, specs, reviews verifies, formulaire avis
│   │   │   ├── Checkout.jsx  # Email/nom, promo, Stripe redirect, confirmation
│   │   │   ├── Admin.jsx     # Login, stats, CRUD produits, commandes
│   │   │   ├── About.jsx     # Page A propos multilingue
│   │   │   └── LegalPage.jsx # CGV, Mentions, Privacy, Refund (generique)
│   │   ├── components/
│   │   │   ├── SEOHead.jsx   # Meta dynamiques, OG, JSON-LD
│   │   │   └── shop/         # ProductCard, Cart, Footer, LanguageSelector, etc.
│   │   ├── contexts/         # LanguageContext, CartContext, AuthContext
│   │   ├── data/
│   │   │   └── legalContent.js  # Contenu juridique 4 pages x 4 langues
│   │   └── api/
│   │       └── basecolorimag.js  # Client API centralise (remplace base44Clients.js)
│   ├── public/               # Fichiers statiques (robots.txt, images demo)
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
├── nginx/
│   └── nginx.conf            # Reverse-proxy, gzip, rate-limit, SSL ready
├── docker-compose.yml        # MySQL 8 + Backend + Nginx
├── ecosystem.config.cjs      # PM2 (dev sandbox)
└── .gitignore
```

---

## Endpoints API

### Publics

| Methode | Route | Description |
|---------|-------|-------------|
| `GET` | `/api/products` | Liste produits publies (filtres: featured, theme, age_group, search, sort) |
| `GET` | `/api/products/:idOrSlug` | Detail produit + avis approuves |
| `GET` | `/api/products/:id/similar` | 4 produits similaires |
| `GET` | `/api/reviews/:productId` | Avis approuves d'un produit (avec flag verified_purchase) |
| `POST` | `/api/reviews` | Creer un avis (name, rating, comment, email, order_number → verification achat) |
| `POST` | `/api/orders/create-checkout` | Creer session Stripe (items, email, name, currency, promoCode, lang) |
| `POST` | `/api/orders/webhook` | Webhook Stripe (raw body) |
| `GET` | `/api/orders/verify/:sessionId` | Verifier commande apres paiement |
| `POST` | `/api/orders/validate-promo` | Valider un code promo |
| `GET` | `/api/download/:token` | Telecharger PDF (token UUID, 24h, 5 DL max) |
| `POST` | `/api/newsletter/subscribe` | Inscription newsletter (email, lang) |
| `POST` | `/api/newsletter/unsubscribe` | Desinscription newsletter |
| `GET` | `/sitemap.xml` | Sitemap XML dynamique |
| `GET` | `/robots.txt` | Robots.txt |

### Admin (JWT requis — header `Authorization: Bearer <token>`)

| Methode | Route | Description |
|---------|-------|-------------|
| `POST` | `/api/auth/login` | Connexion admin (email, password) → JWT |
| `GET` | `/api/auth/me` | Profil admin courant |
| `GET` | `/api/products/admin/all` | Tous les produits (publies + brouillons) |
| `POST` | `/api/products/admin` | Creer produit (multipart: PDF, images, champs) |
| `PUT` | `/api/products/admin/:id` | Modifier produit |
| `DELETE` | `/api/products/admin/:id` | Supprimer produit |
| `GET` | `/api/orders/admin/all` | Toutes les commandes (200 dernieres) |
| `GET` | `/api/orders/admin/stats` | Stats (revenu, commandes, produits, telechargements) |
| `DELETE` | `/api/reviews/admin/:id` | Supprimer un avis |
| `GET` | `/api/reviews/admin/all` | Tous les avis (approuves + en attente) |
| `GET` | `/api/reviews/admin/pending` | Avis en attente de moderation |
| `PATCH` | `/api/reviews/admin/:id/approve` | Approuver un avis |
| `PATCH` | `/api/reviews/admin/:id/reject` | Rejeter (supprimer) un avis |
| `GET` | `/api/newsletter/admin` | Stats newsletter (admin) |

---

## Base de donnees

7 tables, gerees par Knex (migrations automatiques au demarrage) :

| Table | Colonnes cles |
|-------|---------------|
| `admins` | id, email (unique), password_hash, name, role (superadmin/admin) |
| `products` | id, slug (unique), titres multilingues (fr/en/es/de), descriptions, prix EUR/USD, PDF, images, metadata |
| `orders` | id, order_number (unique), customer_email, items JSON, total, currency, status, stripe_session_id, download_links JSON |
| `reviews` | id, product_id (FK), order_id (FK nullable), author_name, customer_email, rating, comment, language, verified_purchase, is_approved |
| `download_tokens` | id, token (unique UUID), order_id (FK), product_id (FK), filename, download_count, max_downloads, expires_at |
| `promo_codes` | id, code (unique), discount_percent, is_active, max_uses, use_count, expires_at |
| `newsletter_subscribers` | id, email (unique), language, is_active, subscribed_at, unsubscribed_at |

---

## Installation locale

### Prerequis
- Node.js >= 18
- npm >= 9

### 1. Cloner et installer

```bash
git clone <repo-url> colorimagiques
cd colorimagiques

# Backend
cd backend
cp .env.example .env    # Editer les variables (voir section Config)
npm install
npm run setup           # Migrations + seed (8 produits demo, 1 admin)

# Frontend
cd ../frontend
npm install
npm run build           # Genere frontend/dist/
```

### 2. Lancer en dev

```bash
# Terminal 1 : Backend (sert aussi le frontend builde)
cd backend
npm run dev             # Node --watch sur port 3000

# OU Terminal 1 : Backend seul (port 4000) + Terminal 2 : Vite dev (port 5173)
cd backend && PORT=4000 npm run dev
cd frontend && npm run dev
```

### 3. Acceder

- **Boutique** : http://localhost:3000
- **Admin** : http://localhost:3000/admin
  - Email : `admin@colorimagiques.com`
  - Mot de passe : `Admin123!`

---

## Configuration (.env)

```env
# Serveur
NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:3000

# Base de donnees — laisser vide pour SQLite local
# DB_HOST=localhost          # Decommentez pour MySQL
# DB_PORT=3306
# DB_USER=colorimagiques
# DB_PASSWORD=secret
# DB_NAME=colorimagiques

# Auth
JWT_SECRET=votre_secret_jwt_change_moi
JWT_EXPIRES_IN=7d

# Stripe (obligatoire pour les paiements)
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx

# SMTP (obligatoire pour les emails)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=votre-email@gmail.com
SMTP_PASS=votre-app-password
EMAIL_FROM=ColoriMagiques <noreply@colorimagiques.com>

# Fichiers
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=52428800

# Admin par defaut (cree au seed)
ADMIN_EMAIL=admin@colorimagiques.com
ADMIN_PASSWORD=Admin123!
```

---

## Deploiement production

### Option A : Docker Compose (recommande)

```bash
# 1. Configurer les secrets dans docker-compose.yml
#    (JWT_SECRET, STRIPE_SECRET_KEY, SMTP_PASS, etc.)

# 2. Builder le frontend
cd frontend && npm run build

# 3. Lancer la stack
docker compose up -d

# 4. Verifier
docker compose ps
curl http://localhost/api/products
```

Services lances :
- **db** : MySQL 8 (port 3306, volume persistant)
- **backend** : Node/Express (port 4000, migrations auto)
- **nginx** : Reverse-proxy (port 80/443, sert le frontend + proxy API)

### Option B : VPS sans Docker

```bash
# 1. Installer Node.js 18+ et PM2
npm install -g pm2

# 2. Installer et configurer
cd colorimagiques/backend
npm install --production
cp .env.example .env && nano .env   # Configurer les variables
npm run setup                        # Migrations + seed

# 3. Builder le frontend
cd ../frontend
npm install && npm run build

# 4. Lancer avec PM2
cd ../backend
pm2 start src/server.js --name colorimagiques
pm2 save
pm2 startup

# 5. Configurer Nginx (reverse-proxy)
# Copier nginx/nginx.conf vers /etc/nginx/sites-available/colorimagiques
# Adapter server_name au domaine
# Activer SSL avec Certbot
```

### Option C : Hebergement mutualise (PHP/MySQL)

Non supporte nativement (Node.js requis). Alternatives :
- Hostinger VPS ou App Hosting (supporte Node.js)
- Railway, Render, Fly.io (PaaS Node.js)
- Frontend seul sur Cloudflare Pages + backend sur un PaaS

---

## SSL / HTTPS

### Avec Certbot (Let's Encrypt)

```bash
# Installer Certbot
apt install certbot python3-certbot-nginx

# Obtenir certificat
certbot --nginx -d colorimagiques.com -d www.colorimagiques.com

# Renouvellement automatique
certbot renew --dry-run
```

### Avec Docker (decommenter dans docker-compose.yml)

```yaml
# Monter les volumes certbot dans le service nginx
volumes:
  - ./nginx/ssl:/etc/nginx/ssl
  - /etc/letsencrypt:/etc/letsencrypt
```

---

## Stripe : configuration

### 1. Creer un compte

1. Aller sur https://dashboard.stripe.com/register
2. Mode Test activé par defaut

### 2. Recuperer les cles

- **Secret Key** (`sk_test_...`) : Dashboard → Developers → API keys
- Copier dans `.env` → `STRIPE_SECRET_KEY`

### 3. Configurer le webhook

1. Dashboard → Developers → Webhooks → Add endpoint
2. URL : `https://votre-domaine.com/api/orders/webhook`
3. Evenement : `checkout.session.completed`
4. Copier le **Signing Secret** (`whsec_...`) dans `.env` → `STRIPE_WEBHOOK_SECRET`

### 4. Tester en local

```bash
# Installer Stripe CLI
brew install stripe/stripe-cli/stripe   # macOS
# ou telecharger depuis https://stripe.com/docs/stripe-cli

# Ecouter les webhooks en local
stripe listen --forward-to localhost:3000/api/orders/webhook
# Copier le whsec_... affiche dans .env
```

---

## SMTP : configuration

### Gmail (App Password)

1. Activer la verification en 2 etapes sur votre compte Google
2. Google Account → Security → App passwords → generer un mot de passe
3. Dans `.env` :
   ```
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=votre-email@gmail.com
   SMTP_PASS=xxxx xxxx xxxx xxxx
   ```

### OVH Mail

```env
SMTP_HOST=ssl0.ovh.net
SMTP_PORT=587
SMTP_USER=contact@votredomaine.com
SMTP_PASS=votre-mot-de-passe
```

---

## SEO

| Element | Implementation |
|---------|----------------|
| `<title>` dynamique | SEOHead.jsx met a jour `document.title` par page |
| `<meta description>` | Specifique par page (Home, Catalog, Product, Legal) |
| Open Graph | og:title, og:description, og:image, og:type, og:locale |
| Twitter Cards | summary_large_image pour les produits |
| Canonical URL | `<link rel="canonical">` par page |
| JSON-LD | Organization, WebSite (SearchAction), Product (offers, ratings), BreadcrumbList, CollectionPage |
| Sitemap XML | `/sitemap.xml` — dynamique, 6 pages statiques + N produits |
| Robots.txt | `/robots.txt` — Disallow /admin, /checkout, /api/ |
| Multilingue | Titres et descriptions SEO en FR/EN/ES/DE |

### Soumettre aux moteurs de recherche

```bash
# Google Search Console
# 1. Ajouter la propriete https://colorimagiques.com
# 2. Soumettre le sitemap : https://colorimagiques.com/sitemap.xml

# Bing Webmaster Tools
# 1. Ajouter le site
# 2. Soumettre le sitemap
```

---

## Pages legales

4 pages completes, traduites en FR/EN/ES/DE :

| Page | Route | Contenu |
|------|-------|---------|
| CGV | `/legal/terms` | 11 articles (objet, produits, prix, livraison, retractation, licence, PI, responsabilite) |
| Mentions Legales | `/legal/notice` | Editeur, hebergement, activite, PI, cookies, credits |
| Confidentialite | `/legal/privacy` | 10 articles RGPD (responsable, donnees, finalites, base legale, duree, droits, securite) |
| Remboursement | `/legal/refund` | Principe, cas accordes/refuses, procedure, regeneration liens |

> **A personnaliser** : remplacer `[Votre nom]` et `[Nom de l'hebergeur]` dans `frontend/src/data/legalContent.js`.

---

## Prochaines etapes pour la mise en production

### Obligatoire
- [ ] Creer compte Stripe → ajouter `sk_test_...` et `whsec_...` dans `.env`
- [ ] Configurer SMTP reel (Gmail App Password ou OVH Mail)
- [ ] Remplacer images demo SVG par vrais visuels (via admin)
- [ ] Uploader vrais PDFs de coloriage (via admin)
- [ ] Personnaliser les mentions legales (`[Votre nom]`, `[Hebergeur]`)
- [ ] Changer `JWT_SECRET` et `ADMIN_PASSWORD` en production

### Recommande
- [ ] Acheter domaine + configurer DNS
- [ ] Deployer sur VPS avec Docker Compose
- [ ] Configurer SSL (Let's Encrypt / Certbot)
- [ ] Soumettre sitemap a Google Search Console
- [ ] Ajouter Google Analytics

### Ameliorations futures
- [ ] Tests automatises (Vitest)
- [ ] Passer en mode live Stripe (`sk_live_...`)
- [x] ~~Newsletter backend (stockage emails + envoi periodique)~~ ✅ v1.4
- [x] ~~Page "A propos"~~ ✅ v1.4
- [x] ~~Avis verifies (lies aux commandes)~~ ✅ v1.4
- [x] ~~Client API centralise (basecolorimag.js)~~ ✅ v1.4

---

## Stats du projet

| Metrique | Valeur |
|----------|--------|
| Fichiers backend | 18 (.js) |
| Fichiers frontend | 24 (.jsx/.js) |
| Lignes backend | ~2 200 |
| Lignes frontend | ~4 100 |
| Total | ~6 300 lignes |
| Tables BDD | 7 |
| Endpoints API | 29 |
| Langues | 4 (FR/EN/ES/DE) |
| Pages frontend | 12 (Home, Catalog, ProductDetail, Checkout, Admin, About, 4x Legal, Confirmation, 404) |
| Build frontend | 484 KB (154 KB gzippe) |
| Tests E2E | 44/44 passes |

---

## Licence

Projet prive — ColoriMagiques. Tous droits reserves.

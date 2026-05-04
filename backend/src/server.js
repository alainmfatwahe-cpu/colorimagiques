// backend/src/server.js
// Point d'entrée principal — Serveur Express ColoriMagiques
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import routes
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';
import downloadRoutes from './routes/downloads.js';
import reviewRoutes from './routes/reviews.js';
import seoRoutes from './routes/seo.js';
import newsletterRoutes from './routes/newsletter.js';

const app = express();
const PORT = process.env.PORT || 4000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// ─── Sécurité ───
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: false, // Désactivé pour permettre les CDN frontend
}));

// ─── CORS ───
app.use(cors({
  origin: [FRONTEND_URL, 'http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ─── Rate Limiting ───
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requêtes par fenêtre
  message: { error: 'Trop de requêtes, réessayez dans 15 minutes' },
});
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10, // 10 tentatives de login par 15 min
  message: { error: 'Trop de tentatives de connexion' },
});

// ─── Logging ───
app.use(morgan('dev'));

// ─── Body parsing ───
// IMPORTANT: Le webhook Stripe a besoin du body brut, donc on l'exclut du JSON parser
app.use((req, res, next) => {
  if (req.originalUrl === '/api/orders/webhook') {
    next(); // Le webhook gère son propre parsing
  } else {
    express.json({ limit: '10mb' })(req, res, next);
  }
});
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ─── Servir les fichiers uploadés (images uniquement — les PDFs passent par les tokens) ───
const UPLOAD_DIR = path.resolve(process.env.UPLOAD_DIR || './uploads');
app.use('/api/uploads/images', express.static(path.join(UPLOAD_DIR, 'images'), {
  maxAge: '7d',
  etag: true,
}));

// ─── Routes API ───
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/products', apiLimiter, productRoutes);
app.use('/api/orders', orderRoutes); // Pas de rate limit sur le webhook
app.use('/api/download', downloadRoutes);
app.use('/api/reviews', apiLimiter, reviewRoutes);
app.use('/api/newsletter', apiLimiter, newsletterRoutes);

// ─── Routes SEO (sitemap, robots.txt, meta) — AVANT le SPA fallback ───
app.use('/', seoRoutes);
app.use('/api/seo', seoRoutes);

// ─── Servir le frontend buildé (production) ───
const frontendDist = path.join(__dirname, '../../frontend/dist');
app.use(express.static(frontendDist));

// SPA fallback — toutes les routes non-API renvoient index.html
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api/')) {
    res.sendFile(path.join(frontendDist, 'index.html'));
  } else {
    res.status(404).json({ error: 'Route API non trouvée' });
  }
});

// ─── Gestion d'erreurs globale ───
app.use((err, req, res, next) => {
  console.error('❌ Erreur non gérée:', err);

  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ error: 'Fichier trop volumineux (max 50 Mo)' });
  }
  if (err.message?.includes('Seuls les fichiers PDF')) {
    return res.status(400).json({ error: err.message });
  }
  if (err.message?.includes('Format d\'image')) {
    return res.status(400).json({ error: err.message });
  }

  res.status(500).json({ error: 'Erreur interne du serveur' });
});

// ─── Démarrage ───
app.listen(PORT, '0.0.0.0', () => {
  console.log(`
╔══════════════════════════════════════════╗
║  🎨 ColoriMagiques API                  ║
║  ─────────────────────────────────────   ║
║  Port     : ${PORT}                          ║
║  Mode     : ${process.env.NODE_ENV || 'development'}               ║
║  Frontend : ${FRONTEND_URL}    ║
╚══════════════════════════════════════════╝
  `);
});

export default app;

import diagFs from 'fs';
console.log('=== STARTUP DIAGNOSTIC ===');
console.log('UPLOAD_DIR env:', process.env.UPLOAD_DIR);
console.log('cwd:', process.cwd());
const dirsToCheck = ['/app', '/app/backend', '/app/backend/uploads', '/app/backend/uploads/images', '/app/uploads'];
for (const d of dirsToCheck) {
  try {
    const files = diagFs.readdirSync(d);
    console.log('  ' + d + ' [' + files.length + ' entries]: ' + JSON.stringify(files.slice(0, 5)));
  } catch (e) {
    console.log('  ' + d + ' - ERROR: ' + e.message);
  }
}
console.log('=== END DIAGNOSTIC ===');
import diagFs from 'fs';
console.log('=== STARTUP DIAGNOSTIC ===');
console.log('UPLOAD_DIR env:', process.env.UPLOAD_DIR);
console.log('cwd:', process.cwd());
const dirsToCheck = ['/app', '/app/backend', '/app/backend/uploads', '/app/backend/uploads/images', '/app/uploads'];
for (const d of dirsToCheck) {
  try {
    const files = diagFs.readdirSync(d);
    console.log('  ' + d + ' [' + files.length + ' entries]: ' + JSON.stringify(files.slice(0, 5)));
  } catch (e) {
    console.log('  ' + d + ' - ERROR: ' + e.message);
  }
}
console.log('=== END DIAGNOSTIC ===');
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
import seedRoutes from './routes/seed.js';
import resetRoutes from './routes/reset.js';
import migrate from './migrations/run.js';

const app = express();
app.set('trust proxy', 1);

const PORT = process.env.PORT || 4000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// ——— Sécurité ———
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' }, contentSecurityPolicy: false }));

// ——— CORS ———
app.use(cors({ origin: [FRONTEND_URL, 'http://localhost:3000', 'http://localhost:5173'], credentials: true, methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], allowedHeaders: ['Content-Type', 'Authorization'] }));

// ——— Rate Limiting ———
const apiLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100, message: { error: 'Trop de requetes, reessayez dans 15 minutes' } });
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10, message: { error: 'Trop de tentatives de connexion' } });

// ——— Logging ———
app.use(morgan('dev'));

// ——— Body parsing ———
app.use((req, res, next) => {
 if (req.originalUrl === '/api/orders/webhook') { next(); }
 else { express.json({ limit: '10mb' })(req, res, next); }
});
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ——— Static files ———
const UPLOAD_DIR = path.resolve(process.env.UPLOAD_DIR || path.join(__dirname, '../uploads'));
app.use('/api/uploads/images', express.static(path.join(UPLOAD_DIR, 'images'), { maxAge: '7d', etag: true }));

// ——— Routes API ———
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/products', apiLimiter, productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/download', downloadRoutes);
app.use('/api/reviews', apiLimiter, reviewRoutes);
app.use('/api/newsletter', apiLimiter, newsletterRoutes);
app.use('/api/admin', seedRoutes);
app.use('/api/dev', resetRoutes);

// ——— Routes SEO ———
app.use('/', seoRoutes);
app.use('/api/seo', seoRoutes);

// ——— Servir le frontend buildé ———
const frontendDist = '/app/frontend/dist';
app.use(express.static(frontendDist));

// SPA fallback
app.get('*', (req, res) => {
 if (!req.path.startsWith('/api/')) { res.sendFile(path.join(frontendDist, 'index.html')); }
 else { res.status(404).json({ error: 'Route API non trouvee' }); }
});

// ——— Gestion d'erreurs ———
app.use((err, req, res, next) => {
 console.error('Erreur non geree:', err);
 if (err.code === 'LIMIT_FILE_SIZE') return res.status(413).json({ error: 'Fichier trop volumineux' });
 if (err.message?.includes('Seuls les fichiers PDF')) return res.status(400).json({ error: err.message });
 if (err.message?.includes('Format d image')) return res.status(400).json({ error: err.message });
 res.status(500).json({ error: 'Erreur interne du serveur' });
});

// ——— Démarrage ———
migrate()
  .then(() => {
    console.log('Migrations OK');
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`ColoriMagiques API | Port: ${PORT} | Mode: ${process.env.NODE_ENV || 'development'}`);
    });
  })
  .catch(err => {
    console.error('Migrations failed:', err.message);
    process.exit(1);
  });

export default app;

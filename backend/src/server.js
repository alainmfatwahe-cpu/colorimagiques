import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import dotenv from 'dotenv';

dotenv.config();

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' }, contentSecurityPolicy: false }));
app.use(cors({ origin: [FRONTEND_URL, 'http://localhost:3000', 'http://localhost:5173'], credentials: true, methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], allowedHeaders: ['Content-Type', 'Authorization'] }));

const apiLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100, message: { error: 'Trop de requetes, reessayez dans 15 minutes' } });
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10, message: { error: 'Trop de tentatives de connexion' } });

app.use(morgan('dev'));

app.use((req, res, next) => {
  if (req.originalUrl === '/api/orders/webhook') { next(); }
  else { express.json({ limit: '10mb' })(req, res, next); }
});
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

const UPLOAD_DIR = path.resolve(process.env.UPLOAD_DIR || path.join(__dirname, '../uploads'));
console.log('[Static] UPLOAD_DIR resolved to:', UPLOAD_DIR);
app.use('/api/uploads/images', express.static(path.join(UPLOAD_DIR, 'images'), { maxAge: '7d', etag: true }));

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/products', apiLimiter, productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/download', downloadRoutes);
app.use('/api/reviews', apiLimiter, reviewRoutes);
app.use('/api/newsletter', apiLimiter, newsletterRoutes);
app.use('/api/admin', seedRoutes);
app.use('/api/dev', resetRoutes);
app.use('/api/seo', seoRoutes);

const frontendDist = '/app/frontend/dist';
app.use(express.static(frontendDist));

app.get('*', (req, res) => {
  if (!req.path.startsWith('/api/')) { res.sendFile(path.join(frontendDist, 'index.html')); }
  else { res.status(404).json({ error: 'Route API non trouvee' }); }
});

app.use((err, req, res, next) => {
  console.error('Erreur non geree:', err);
  if (err.code === 'LIMIT_FILE_SIZE') return res.status(413).json({ error: 'Fichier trop volumineux' });
  if (err.message?.includes('Seuls les fichiers PDF')) return res.status(400).json({ error: err.message });
  if (err.message?.includes('Format d image')) return res.status(400).json({ error: err.message });
  res.status(500).json({ error: 'Erreur interne du serveur' });
});

migrate()
  .then(() => {
    console.log('Migrations OK');
    app.listen(PORT, '0.0.0.0', () => {
      console.log('ColoriMagiques API | Port: ' + PORT + ' | Mode: ' + (process.env.NODE_ENV || 'development'));
    });
  })
  .catch(err => {
    console.error('Migrations failed:', err.message);
    process.exit(1);
  });

export default app;


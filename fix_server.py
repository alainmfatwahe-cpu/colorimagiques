path = 'C:/Users/Alain/workspace/colorimagiques/webapp/backend/src/server.js'
code = """// backend/src/server.js
// Point d'entr\u00e9e principal \u2014 Serveur Express ColoriMagiques

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

// \u2014\u2014\u2014 S\u00e9curit\u00e9 \u2014\u2014\u2014
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' }, contentSecurityPolicy: false }));

// \u2014\u2014\u2014 CORS \u2014\u2014\u2014
app.use(cors({ origin: [FRONTEND_URL, 'http://localhost:3000', 'http://localhost:5173'], credentials: true, methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], allowedHeaders: ['Content-Type', 'Authorization'] }));

// \u2014\u2014\u2014 Rate Limiting \u2014\u2014\u2014
const apiLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100, message: { error: 'Trop de requetes, reessayez dans 15 minutes' } });
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10, message: { error: 'Trop de tentatives de connexion' } });

// \u2014\u2014\u2014 Logging \u2014\u2014\u2014
app.use(morgan('dev'));

// \u2014\u2014\u2014 Body parsing \u2014\u2014\u2014
app.use((req, res, next) => {
 if (req.originalUrl === '/api/orders/webhook') { next(); }
 else { express.json({ limit: '10mb' })(req, res, next); }
});
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// \u2014\u2014\u2014 Static files \u2014\u2014\u2014
const UPLOAD_DIR = path.resolve(process.env.UPLOAD_DIR || './uploads');
app.use('/api/uploads/images', express.static(path.join(UPLOAD_DIR, 'images'), { maxAge: '7d', etag: true }));

// \u2014\u2014\u2014 Routes API \u2014\u2014\u2014
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/products', apiLimiter, productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/download', downloadRoutes);
app.use('/api/reviews', apiLimiter, reviewRoutes);
app.use('/api/newsletter', apiLimiter, newsletterRoutes);
app.use('/api/admin', seedRoutes);
app.use('/api/dev', resetRoutes);

// \u2014\u2014\u2014 Routes SEO \u2014\u2014\u2014
app.use('/', seoRoutes);
app.use('/api/seo', seoRoutes);

// \u2014\u2014\u2014 Servir le frontend build\u00e9 \u2014\u2014\u2014
const frontendDist = '/app/frontend/dist';
app.use(express.static(frontendDist));

// SPA fallback
app.get('*', (req, res) => {
 if (!req.path.startsWith('/api/')) { res.sendFile(path.join(frontendDist, 'index.html')); }
 else { res.status(404).json({ error: 'Route API non trouvee' }); }
});

// \u2014\u2014\u2014 Gestion d'erreurs \u2014\u2014\u2014
app.use((err, req, res, next) => {
 console.error('Erreur non geree:', err);
 if (err.code === 'LIMIT_FILE_SIZE') return res.status(413).json({ error: 'Fichier trop volumineux' });
 if (err.message?.includes('Seuls les fichiers PDF')) return res.status(400).json({ error: err.message });
 if (err.message?.includes('Format d image')) return res.status(400).json({ error: err.message });
 res.status(500).json({ error: 'Erreur interne du serveur' });
});

// \u2014\u2014\u2014 D\u00e9marrage \u2014\u2014\u2014
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
"""

with open(path, 'w', encoding='utf-8') as f:
    f.write(code)
print('OK')

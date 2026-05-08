// backend/src/server.js
// Point d'entrÃ©e principal â€” Serveur Express ColoriMagiques

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
import migrate from './migrations/run.js';

const app = express();
app.set('trust proxy', 1);

const PORT = process.env.PORT || 4000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// â”€â”€â”€ SÃ©curitÃ© â”€â”€â”€
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' }, contentSecurityPolicy: false }));

// â”€â”€â”€ CORS â”€â”€â”€
app.use(cors({ origin: [FRONTEND_URL, 'http://localhost:3000', 'http://localhost:5173'], credentials: true, methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], allowedHeaders: ['Content-Type', 'Authorization'] }));

// â”€â”€â”€ Rate Limiting â”€â”€â”€
const apiLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100, message: { error: 'Trop de requetes, reessayez dans 15 minutes' } });
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10, message: { error: 'Trop de tentatives de connexion' } });

// â”€â”€â”€ Logging â”€â”€â”€
app.use(morgan('dev'));

// â”€â”€â”€ Body parsing â”€â”€â”€
app.use((req, res, next) => {
 if (req.originalUrl === '/api/orders/webhook') { next(); }
 else { express.json({ limit: '10mb' })(req, res, next); }
});
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// â”€â”€â”€ Static files â”€â”€â”€
const UPLOAD_DIR = path.resolve(process.env.UPLOAD_DIR || './uploads');
app.use('/api/uploads/images', express.static(path.join(UPLOAD_DIR, 'images'), { maxAge: '7d', etag: true }));

// â”€â”€â”€ Routes API â”€â”€â”€
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/products', apiLimiter, productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/download', downloadRoutes);
app.use('/api/reviews', apiLimiter, reviewRoutes);
app.use('/api/newsletter', apiLimiter, newsletterRoutes);

// â”€â”€â”€ Routes SEO â”€â”€â”€
app.use('/', seoRoutes);
app.use('/api/seo', seoRoutes);

// â”€â”€â”€ Servir le frontend buildÃ© â”€â”€â”€
const frontendDist = '/app/frontend/dist';
app.use(express.static(frontendDist));

// SPA fallback
app.get('*', (req, res) => {
 if (!req.path.startsWith('/api/')) { res.sendFile(path.join(frontendDist, 'index.html')); }
 else { res.status(404).json({ error: 'Route API non trouvee' }); }
});

// â”€â”€â”€ Gestion d'erreurs â”€â”€â”€
app.use((err, req, res, next) => {
 console.error('Erreur non geree:', err);
 if (err.code === 'LIMIT_FILE_SIZE') return res.status(413).json({ error: 'Fichier trop volumineux' });
 if (err.message?.includes('Seuls les fichiers PDF')) return res.status(400).json({ error: err.message });
 if (err.message?.includes('Format d image')) return res.status(400).json({ error: err.message });
 res.status(500).json({ error: 'Erreur interne du serveur' });
});

// â”€â”€â”€ DÃ©marrage â”€â”€â”€
app.listen(PORT, '0.0.0.0', () => {
 console.log(`ColoriMagiques API | Port: ${PORT} | Mode: ${process.env.NODE_ENV || 'development'}`);
});

migrate().then(() => { console.log('Migrations OK'); }).catch(err => { console.error('Migrations failed:', err.message); });

export default app;
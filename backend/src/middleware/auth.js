// backend/src/middleware/auth.js
// Middleware d'authentification JWT pour les routes admin
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'change_me_in_production';

/**
 * Génère un token JWT pour un admin
 */
export function generateToken(admin) {
  return jwt.sign(
    { id: admin.id, email: admin.email, role: admin.role },
    JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

/**
 * Middleware : vérifie le token JWT dans Authorization header
 */
export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token d\'authentification requis' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token invalide ou expiré' });
  }
}

/**
 * Middleware : vérifie que l'admin est superadmin
 */
export function requireSuperAdmin(req, res, next) {
  if (req.admin?.role !== 'superadmin') {
    return res.status(403).json({ error: 'Accès refusé — droits insuffisants' });
  }
  next();
}

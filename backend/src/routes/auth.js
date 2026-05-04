// backend/src/routes/auth.js
// Routes d'authentification admin (login, me, logout)
import { Router } from 'express';
import bcrypt from 'bcryptjs';
import db from '../config/database.js';
import { generateToken, requireAuth } from '../middleware/auth.js';

const router = Router();

/**
 * POST /api/auth/login
 * Connexion admin — retourne un JWT
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email et mot de passe requis' });
    }

    const admin = await db('admins').where('email', email.toLowerCase().trim()).first();
    if (!admin) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    const valid = await bcrypt.compare(password, admin.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    const token = generateToken(admin);

    res.json({
      token,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

/**
 * GET /api/auth/me
 * Retourne l'admin connecté
 */
router.get('/me', requireAuth, async (req, res) => {
  try {
    const admin = await db('admins').where('id', req.admin.id).first();
    if (!admin) return res.status(404).json({ error: 'Admin non trouvé' });

    res.json({
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
    });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;

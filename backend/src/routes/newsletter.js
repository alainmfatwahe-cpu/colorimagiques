// backend/src/routes/newsletter.js
// Route API Newsletter — inscription/désinscription
import { Router } from 'express';
import db from '../config/database.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

/**
 * POST /api/newsletter/subscribe
 * Inscription à la newsletter (public)
 * Body: { email, lang }
 */
router.post('/subscribe', async (req, res) => {
  try {
    const { email, lang = 'fr' } = req.body;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Email valide requis' });
    }

    const existing = await db('newsletter_subscribers').where('email', email.toLowerCase().trim()).first();

    if (existing) {
      if (existing.is_active) {
        return res.json({ success: true, message: 'already_subscribed' });
      }
      // Réactiver un ancien abonné
      await db('newsletter_subscribers')
        .where('id', existing.id)
        .update({ is_active: true, language: lang, unsubscribed_at: null, subscribed_at: db.fn.now() });
      return res.json({ success: true, message: 'resubscribed' });
    }

    await db('newsletter_subscribers').insert({
      email: email.toLowerCase().trim(),
      language: lang,
      is_active: true,
    });

    res.status(201).json({ success: true, message: 'subscribed' });
  } catch (err) {
    console.error('Newsletter subscribe error:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

/**
 * POST /api/newsletter/unsubscribe
 * Désinscription de la newsletter (public)
 * Body: { email }
 */
router.post('/unsubscribe', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email requis' });

    const updated = await db('newsletter_subscribers')
      .where('email', email.toLowerCase().trim())
      .update({ is_active: false, unsubscribed_at: db.fn.now() });

    if (!updated) return res.status(404).json({ error: 'Email non trouvé' });
    res.json({ success: true, message: 'unsubscribed' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

/**
 * GET /api/newsletter/admin/subscribers
 * Liste des abonnés — Admin uniquement
 */
router.get('/admin/subscribers', requireAuth, async (req, res) => {
  try {
    const subscribers = await db('newsletter_subscribers')
      .orderBy('subscribed_at', 'desc');
    const stats = {
      total: subscribers.length,
      active: subscribers.filter((s) => s.is_active).length,
      byLang: {
        fr: subscribers.filter((s) => s.language === 'fr' && s.is_active).length,
        en: subscribers.filter((s) => s.language === 'en' && s.is_active).length,
        es: subscribers.filter((s) => s.language === 'es' && s.is_active).length,
        de: subscribers.filter((s) => s.language === 'de' && s.is_active).length,
      },
    };
    res.json({ subscribers, stats });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;

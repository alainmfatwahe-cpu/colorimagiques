import { Router } from 'express';
import db from '../config/database.js';
const router = Router();

router.post('/seed-all', async (req, res) => {
  try {
    // Drop old check constraint
    await db.raw('ALTER TABLE products DROP CONSTRAINT IF EXISTS products_theme_check');
    // Recreate with allowed themes + new ones
    await db.raw(\ALTER TABLE products ADD CONSTRAINT products_theme_check CHECK (theme IN ('animals','space','dinosaurs','princesses','nature','vehicles','fantasy','ocean','alphabet','color','forme-geometrique','nursery-prints'))\);
    res.json({ success: true, message: 'Theme check constraint updated' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

export default router;
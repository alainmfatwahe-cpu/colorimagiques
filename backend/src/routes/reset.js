import { Router } from 'express';
import db from '../config/database.js';
const router = Router();
router.post('/seed-all', async (req, res) => {
  try {
    await db.raw('ALTER TABLE products DROP CONSTRAINT IF EXISTS products_theme_check');
    await db.raw('ALTER TABLE products DROP CONSTRAINT IF EXISTS products_age_group_check');
    await db.raw("ALTER TABLE products ADD CONSTRAINT products_theme_check CHECK (theme IN ('animals','space','dinosaurs','princesses','nature','vehicles','fantasy','ocean','alphabet','color','forme-geometrique','nursery-prints'))");
    await db.raw("ALTER TABLE products ADD CONSTRAINT products_age_group_check CHECK (age_group IN ('0-2','3-5','6-8','9-12','all-ages','0-3','3-5','6-8'))");
    const count = await db('products').count('id as total').first();
    res.json({ success: true, total: count.total, message: 'Constraints updated' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});
export default router;
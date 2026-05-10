import { Router } from 'express';
import db from '../config/database.js';
const router = Router();
router.post('/seed-all', async (req, res) => {
  try {
    await db.raw('ALTER TABLE products DROP CONSTRAINT IF EXISTS products_theme_check');
    await db.raw("ALTER TABLE products ADD CONSTRAINT products_theme_check CHECK (theme IN ('animals','space','dinosaurs','princesses','nature','vehicles','fantasy','ocean','alphabet','color','forme-geometrique','nursery-prints'))");
    const result = await db('products').select('id','title','theme').orderBy('id');
    res.json({ success: true, count: result.length, themes: [...new Set(result.map(r=>r.theme))] });
  } catch (err) { res.status(500).json({ error: err.message }); }
});
export default router;
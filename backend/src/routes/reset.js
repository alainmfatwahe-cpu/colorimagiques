import { Router } from 'express';
import db from '../config/database.js';
const router = Router();
import { createHash } from 'crypto';

router.post('/reset-admin-hash', async (req, res) => {
  try {
    const hash = createHash('sha256').update('Admin2026!ColoriMagiques_SALT_2026').digest('hex');
    await db.raw('UPDATE admins SET password_hash = ? WHERE email = ?', [hash, 'admin@colorimagiques.com']);
    res.json({ success: true, message: 'Password hash reset to SHA256' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/check-admin', async (req, res) => {
  try {
    const admin = await db('admins').where('email', 'admin@colorimagiques.com').first();
    res.json({ email: admin.email, hash: admin.password_hash.substring(0, 20) + '...', name: admin.name });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

export default router;
// backend/src/routes/downloads.js
// Route de téléchargement sécurisé de fichiers PDF
import { Router } from 'express';
import { validateDownloadToken } from '../services/downloadService.js';
import path from 'path';
import fs from 'fs';

const router = Router();

/**
 * GET /api/download/:token
 * Télécharge un fichier PDF via un token sécurisé
 */
router.get('/:token', async (req, res) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({ error: 'Token requis' });
    }

    const result = await validateDownloadToken(token);

    if (!result) {
      return res.status(404).json({ error: 'Lien de téléchargement invalide' });
    }

    if (result.error === 'expired') {
      return res.status(410).json({ error: result.message });
    }

    if (result.error === 'limit_reached') {
      return res.status(429).json({ error: result.message });
    }

    const { filePath, filename } = result;

    // Vérifier que le fichier existe
    if (!fs.existsSync(filePath)) {
      console.error(`Fichier non trouvé: ${filePath}`);
      return res.status(404).json({ error: 'Fichier non trouvé sur le serveur' });
    }

    // Envoyer le fichier
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.sendFile(filePath);

  } catch (err) {
    console.error('Download error:', err);
    res.status(500).json({ error: 'Erreur lors du téléchargement' });
  }
});

export default router;

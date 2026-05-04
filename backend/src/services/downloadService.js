// backend/src/services/downloadService.js
// Service de gestion des liens de téléchargement sécurisés (tokens signés, expirables)
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import db from '../config/database.js';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

const UPLOAD_DIR = process.env.UPLOAD_DIR || './uploads';
const EXPIRY_SECONDS = parseInt(process.env.SIGNED_URL_EXPIRY || '86400'); // 24h
const BACKEND_URL = `http://localhost:${process.env.PORT || 4000}`;

/**
 * Génère des liens de téléchargement sécurisés pour une commande
 * @param {number} orderId
 * @param {Array} items - [{product_id, product_title, pdf_filename}]
 * @returns {Array} - [{product_id, token, url, expires_at}]
 */
export async function generateDownloadLinks(orderId, items) {
  const links = [];

  for (const item of items) {
    if (!item.pdf_filename) continue;

    const token = uuidv4();
    const expiresAt = new Date(Date.now() + EXPIRY_SECONDS * 1000);

    await db('download_tokens').insert({
      token,
      order_id: orderId,
      product_id: item.product_id,
      filename: item.pdf_filename,
      max_downloads: 5,
      download_count: 0,
      expires_at: expiresAt,
    });

    links.push({
      product_id: item.product_id,
      product_title: item.product_title,
      token,
      url: `${BACKEND_URL}/api/download/${token}`,
      expires_at: expiresAt.toISOString(),
    });
  }

  return links;
}

/**
 * Valide un token de téléchargement et retourne le chemin du fichier
 * @param {string} token
 * @returns {Object|null} - { filePath, filename } ou null
 */
export async function validateDownloadToken(token) {
  const record = await db('download_tokens').where('token', token).first();

  if (!record) return null;

  // Vérifier expiration
  if (new Date(record.expires_at) < new Date()) {
    return { error: 'expired', message: 'Ce lien de téléchargement a expiré.' };
  }

  // Vérifier limite de téléchargements
  if (record.download_count >= record.max_downloads) {
    return { error: 'limit_reached', message: 'Nombre maximum de téléchargements atteint.' };
  }

  // Incrémenter le compteur
  await db('download_tokens').where('token', token).increment('download_count', 1);

  // Incrémenter le compteur de téléchargements du produit
  await db('products').where('id', record.product_id).increment('download_count', 1);

  const filePath = path.resolve(UPLOAD_DIR, 'pdfs', record.filename);
  return { filePath, filename: record.filename };
}

// backend/src/services/emailService.js
// Service d'envoi d'emails avec Nodemailer (confirmation commande + liens téléchargement)
import transporter from '../config/email.js';
import dotenv from 'dotenv';
dotenv.config();

const FROM = process.env.EMAIL_FROM || 'ColoriMagiques <noreply@colorimagiques.com>';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

/**
 * Envoie l'email de confirmation de commande avec liens de téléchargement
 */
export async function sendOrderConfirmation({ order, downloadLinks, lang = 'fr' }) {
  const t = translations[lang] || translations.fr;
  const symbol = order.currency === 'EUR' ? '€' : '$';

  const itemsHtml = (order.items || []).map((item, i) => {
    const dl = downloadLinks[i];
    const downloadBtn = dl
      ? `<a href="${dl.url}" style="display:inline-block;background:#7c3aed;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:bold;margin-top:8px;">📥 ${t.download}</a>`
      : '';
    return `
      <tr>
        <td style="padding:12px;border-bottom:1px solid #e5e7eb;">
          <strong>${item.product_title}</strong><br/>
          <span style="color:#6b7280;font-size:13px;">PDF • E-book</span>
        </td>
        <td style="padding:12px;border-bottom:1px solid #e5e7eb;text-align:right;font-weight:bold;">
          ${item.price.toFixed(2)}${symbol}
        </td>
      </tr>
      ${dl ? `<tr><td colspan="2" style="padding:8px 12px;">${downloadBtn}</td></tr>` : ''}
    `;
  }).join('');

  const discountHtml = order.discount_percent > 0
    ? `<tr><td style="padding:8px 12px;color:#10b981;">${t.discount} (${order.promo_code})</td><td style="padding:8px 12px;text-align:right;color:#10b981;">-${order.discount_percent}%</td></tr>`
    : '';

  const html = `
    <!DOCTYPE html>
    <html lang="${lang}">
    <head><meta charset="UTF-8"></head>
    <body style="font-family:'Inter','Helvetica Neue',Arial,sans-serif;background:#f3f4f6;padding:40px 0;">
      <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);">
        <!-- Header -->
        <div style="background:linear-gradient(135deg,#7c3aed,#ec4899);padding:32px;text-align:center;">
          <h1 style="color:#fff;font-size:28px;margin:0;">🎨 ColoriMagiques</h1>
          <p style="color:rgba(255,255,255,0.9);font-size:16px;margin:8px 0 0;">${t.confirmed}</p>
        </div>

        <!-- Content -->
        <div style="padding:32px;">
          <h2 style="color:#1f2937;font-size:22px;margin:0 0 8px;">${t.thanks}</h2>
          <p style="color:#6b7280;font-size:14px;margin:0 0 24px;">
            ${t.orderNum}: <strong>${order.order_number}</strong>
          </p>

          <!-- Items -->
          <table style="width:100%;border-collapse:collapse;margin-bottom:16px;">
            <thead>
              <tr style="background:#f9fafb;">
                <th style="padding:12px;text-align:left;font-size:13px;color:#6b7280;">${t.product}</th>
                <th style="padding:12px;text-align:right;font-size:13px;color:#6b7280;">${t.price}</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
              ${discountHtml}
            </tbody>
            <tfoot>
              <tr style="background:#f9fafb;">
                <td style="padding:12px;font-weight:bold;font-size:16px;">Total</td>
                <td style="padding:12px;text-align:right;font-weight:bold;font-size:16px;color:#7c3aed;">
                  ${order.total_amount.toFixed(2)}${symbol}
                </td>
              </tr>
            </tfoot>
          </table>

          <!-- Download reminder -->
          <div style="background:#faf5ff;border:1px solid #e9d5ff;border-radius:12px;padding:16px;margin:24px 0;">
            <p style="margin:0;font-size:14px;color:#6b21a8;">
              ⏰ ${t.expiryWarning}
            </p>
          </div>

          <p style="color:#6b7280;font-size:13px;">${t.emailSentTo} <strong>${order.customer_email}</strong></p>
        </div>

        <!-- Footer -->
        <div style="background:#f9fafb;padding:20px 32px;text-align:center;border-top:1px solid #e5e7eb;">
          <p style="color:#9ca3af;font-size:12px;margin:0;">
            © ${new Date().getFullYear()} ColoriMagiques — ${t.rights}
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  const subject = `${t.confirmed} — ${order.order_number} | ColoriMagiques`;

  try {
    await transporter.sendMail({
      from: FROM,
      to: order.customer_email,
      subject,
      html,
    });
    console.log(`📧 Email envoyé à ${order.customer_email}`);
    return true;
  } catch (err) {
    console.error(`❌ Erreur envoi email à ${order.customer_email}:`, err.message);
    // On ne fait pas échouer la commande si l'email échoue
    return false;
  }
}

// Traductions emails
const translations = {
  fr: {
    confirmed: 'Commande Confirmée !',
    thanks: 'Merci pour votre achat !',
    orderNum: 'N° de commande',
    product: 'Produit',
    price: 'Prix',
    discount: 'Réduction',
    download: 'Télécharger le PDF',
    expiryWarning: 'Vos liens de téléchargement expirent dans 24 heures. Téléchargez vos fichiers dès maintenant !',
    emailSentTo: 'Cet email a été envoyé à',
    rights: 'Tous droits réservés',
  },
  en: {
    confirmed: 'Order Confirmed!',
    thanks: 'Thank you for your purchase!',
    orderNum: 'Order #',
    product: 'Product',
    price: 'Price',
    discount: 'Discount',
    download: 'Download PDF',
    expiryWarning: 'Your download links expire in 24 hours. Download your files now!',
    emailSentTo: 'This email was sent to',
    rights: 'All rights reserved',
  },
  es: {
    confirmed: '¡Pedido Confirmado!',
    thanks: '¡Gracias por tu compra!',
    orderNum: 'N° de pedido',
    product: 'Producto',
    price: 'Precio',
    discount: 'Descuento',
    download: 'Descargar PDF',
    expiryWarning: 'Tus enlaces de descarga expiran en 24 horas. ¡Descarga tus archivos ahora!',
    emailSentTo: 'Este email fue enviado a',
    rights: 'Todos los derechos reservados',
  },
  de: {
    confirmed: 'Bestellung Bestätigt!',
    thanks: 'Vielen Dank für Ihren Einkauf!',
    orderNum: 'Bestellnr.',
    product: 'Produkt',
    price: 'Preis',
    discount: 'Rabatt',
    download: 'PDF Herunterladen',
    expiryWarning: 'Ihre Download-Links laufen in 24 Stunden ab. Laden Sie Ihre Dateien jetzt herunter!',
    emailSentTo: 'Diese E-Mail wurde gesendet an',
    rights: 'Alle Rechte vorbehalten',
  },
};

// frontend/src/data/legalContent.js
// Contenu juridique complet multilingue (FR/EN/ES/DE) pour ColoriMagiques
// Chaque page retourne du HTML structuré adapté à un e-commerce de produits numériques (PDF)

// ──────────────────────────────────────────────
// 1. CONDITIONS GENERALES DE VENTE (CGV / ToS)
// ──────────────────────────────────────────────
export const termsContent = {
  fr: `
<h2>1. Objet</h2>
<p>Les présentes Conditions Générales de Vente (CGV) régissent les ventes de produits numériques (e-books de coloriage au format PDF) proposés sur le site <strong>ColoriMagiques</strong> (ci-après « le Site »), édité par ColoriMagiques.</p>
<p>Toute commande implique l'acceptation sans réserve des présentes CGV.</p>

<h2>2. Produits</h2>
<p>Les produits vendus sont des fichiers PDF téléchargeables, destinés à l'impression personnelle. Chaque fiche produit précise le nombre de pages, la résolution (DPI), la tranche d'âge recommandée et le prix.</p>
<p>Les visuels présentés sur le Site sont des représentations fidèles des produits mais peuvent légèrement varier en fonction du support d'impression utilisé.</p>

<h2>3. Prix et paiement</h2>
<p>Les prix sont indiqués en euros (EUR) ou en dollars américains (USD), toutes taxes comprises. ColoriMagiques se réserve le droit de modifier ses prix à tout moment, les produits étant facturés au prix en vigueur au moment de la validation de la commande.</p>
<p>Le paiement s'effectue en ligne par carte bancaire via la plateforme sécurisée <strong>Stripe</strong>. Aucune donnée bancaire n'est stockée sur nos serveurs.</p>

<h2>4. Livraison numérique</h2>
<p>Après validation du paiement, le client reçoit immédiatement :</p>
<ul>
  <li>Un email de confirmation contenant des liens de téléchargement sécurisés ;</li>
  <li>Un accès aux liens directement sur la page de confirmation de commande.</li>
</ul>
<p>Les liens de téléchargement sont valables <strong>24 heures</strong> et limités à <strong>5 téléchargements</strong> par fichier. En cas de problème, contactez notre support.</p>

<h2>5. Droit de rétractation</h2>
<p>Conformément à l'article L221-28 du Code de la consommation, le droit de rétractation ne peut être exercé pour les contrats de fourniture de contenu numérique non fourni sur un support matériel dont l'exécution a commencé avec l'accord préalable du consommateur.</p>
<p>En validant votre commande, vous reconnaissez que le téléchargement des fichiers PDF constitue le début de l'exécution du contrat et renoncez expressément à votre droit de rétractation.</p>

<h2>6. Licence d'utilisation</h2>
<p>L'achat d'un produit confère une licence d'utilisation personnelle et non-exclusive :</p>
<ul>
  <li><strong>Autorisé :</strong> impression personnelle, utilisation à domicile ou dans un cadre éducatif familial ;</li>
  <li><strong>Interdit :</strong> revente, redistribution, reproduction commerciale, partage en ligne des fichiers PDF.</li>
</ul>

<h2>7. Propriété intellectuelle</h2>
<p>L'ensemble des contenus du Site (illustrations, textes, logos, fichiers PDF) sont protégés par le droit d'auteur. Toute reproduction, même partielle, est strictement interdite sans autorisation écrite préalable.</p>

<h2>8. Responsabilité</h2>
<p>ColoriMagiques ne saurait être tenu responsable des dommages résultant d'une mauvaise utilisation des produits, d'une incompatibilité technique ou d'une indisponibilité temporaire du Site.</p>

<h2>9. Protection des données</h2>
<p>Le traitement des données personnelles est détaillé dans notre <a href="/legal/privacy">Politique de Confidentialité</a>.</p>

<h2>10. Droit applicable</h2>
<p>Les présentes CGV sont soumises au droit français. Tout litige sera soumis aux tribunaux compétents du ressort du siège social de ColoriMagiques.</p>

<h2>11. Service client</h2>
<p>Pour toute question, contactez-nous par email à <strong>support@colorimagiques.com</strong>. Nous nous engageons à répondre sous 48 heures ouvrées.</p>
`,

  en: `
<h2>1. Purpose</h2>
<p>These Terms of Service (ToS) govern the sale of digital products (coloring e-books in PDF format) offered on the <strong>ColoriMagiques</strong> website (hereinafter "the Site").</p>
<p>Placing an order implies unconditional acceptance of these Terms.</p>

<h2>2. Products</h2>
<p>Products sold are downloadable PDF files intended for personal printing. Each product page specifies the number of pages, resolution (DPI), recommended age range, and price.</p>
<p>Images shown on the Site are faithful representations of the products but may vary slightly depending on the printing device used.</p>

<h2>3. Prices and Payment</h2>
<p>Prices are displayed in euros (EUR) or US dollars (USD), tax included. ColoriMagiques reserves the right to change prices at any time; products are billed at the price in effect at the time of order confirmation.</p>
<p>Payment is made online by credit card through the secure <strong>Stripe</strong> platform. No banking data is stored on our servers.</p>

<h2>4. Digital Delivery</h2>
<p>After payment confirmation, the customer immediately receives:</p>
<ul>
  <li>A confirmation email with secure download links;</li>
  <li>Access to download links directly on the order confirmation page.</li>
</ul>
<p>Download links are valid for <strong>24 hours</strong> and limited to <strong>5 downloads</strong> per file. If you encounter any issues, please contact our support team.</p>

<h2>5. Right of Withdrawal</h2>
<p>In accordance with applicable consumer protection laws, the right of withdrawal cannot be exercised for digital content that is not supplied on a tangible medium once performance has begun with the consumer's prior consent.</p>
<p>By confirming your order, you acknowledge that downloading the PDF files constitutes the start of contract performance and expressly waive your right of withdrawal.</p>

<h2>6. License of Use</h2>
<p>Purchasing a product grants a personal, non-exclusive license of use:</p>
<ul>
  <li><strong>Permitted:</strong> personal printing, home use, or family educational use;</li>
  <li><strong>Prohibited:</strong> resale, redistribution, commercial reproduction, online sharing of PDF files.</li>
</ul>

<h2>7. Intellectual Property</h2>
<p>All content on the Site (illustrations, text, logos, PDF files) is protected by copyright. Any reproduction, even partial, is strictly prohibited without prior written authorization.</p>

<h2>8. Liability</h2>
<p>ColoriMagiques shall not be held liable for damages resulting from misuse of products, technical incompatibility, or temporary unavailability of the Site.</p>

<h2>9. Data Protection</h2>
<p>Personal data processing is detailed in our <a href="/legal/privacy">Privacy Policy</a>.</p>

<h2>10. Applicable Law</h2>
<p>These Terms are governed by applicable laws. Any dispute shall be submitted to the competent courts.</p>

<h2>11. Customer Service</h2>
<p>For any questions, contact us by email at <strong>support@colorimagiques.com</strong>. We commit to responding within 48 business hours.</p>
`,

  es: `
<h2>1. Objeto</h2>
<p>Las presentes Condiciones Generales de Venta (CGV) regulan las ventas de productos digitales (e-books de colorear en formato PDF) ofrecidos en el sitio <strong>ColoriMagiques</strong> (en adelante "el Sitio").</p>
<p>Cualquier pedido implica la aceptación incondicional de estas CGV.</p>

<h2>2. Productos</h2>
<p>Los productos vendidos son archivos PDF descargables, destinados a la impresión personal. Cada ficha de producto indica el número de páginas, la resolución (DPI), el rango de edad recomendado y el precio.</p>

<h2>3. Precios y Pago</h2>
<p>Los precios se muestran en euros (EUR) o dólares estadounidenses (USD), impuestos incluidos. ColoriMagiques se reserva el derecho de modificar sus precios en cualquier momento.</p>
<p>El pago se realiza en línea mediante tarjeta de crédito a través de la plataforma segura <strong>Stripe</strong>. No se almacenan datos bancarios en nuestros servidores.</p>

<h2>4. Entrega Digital</h2>
<p>Tras la confirmación del pago, el cliente recibe inmediatamente:</p>
<ul>
  <li>Un email de confirmación con enlaces de descarga seguros;</li>
  <li>Acceso a los enlaces de descarga en la página de confirmación del pedido.</li>
</ul>
<p>Los enlaces de descarga son válidos durante <strong>24 horas</strong> y están limitados a <strong>5 descargas</strong> por archivo.</p>

<h2>5. Derecho de Desistimiento</h2>
<p>De acuerdo con la legislación de protección al consumidor, el derecho de desistimiento no puede ejercerse para contenido digital no suministrado en soporte material una vez que se ha iniciado la ejecución con el consentimiento previo del consumidor.</p>

<h2>6. Licencia de Uso</h2>
<p>La compra otorga una licencia de uso personal y no exclusiva:</p>
<ul>
  <li><strong>Permitido:</strong> impresión personal, uso doméstico o educativo familiar;</li>
  <li><strong>Prohibido:</strong> reventa, redistribución, reproducción comercial, compartir los archivos PDF en línea.</li>
</ul>

<h2>7. Propiedad Intelectual</h2>
<p>Todo el contenido del Sitio está protegido por derechos de autor. Cualquier reproducción está estrictamente prohibida sin autorización escrita previa.</p>

<h2>8. Responsabilidad</h2>
<p>ColoriMagiques no será responsable de los daños resultantes del mal uso de los productos, incompatibilidad técnica o indisponibilidad temporal del Sitio.</p>

<h2>9. Protección de Datos</h2>
<p>El tratamiento de datos personales se detalla en nuestra <a href="/legal/privacy">Política de Privacidad</a>.</p>

<h2>10. Ley Aplicable</h2>
<p>Estas CGV se rigen por la legislación aplicable. Cualquier disputa se someterá a los tribunales competentes.</p>

<h2>11. Servicio al Cliente</h2>
<p>Para cualquier consulta, contáctenos por email en <strong>support@colorimagiques.com</strong>. Nos comprometemos a responder en un plazo de 48 horas laborables.</p>
`,

  de: `
<h2>1. Gegenstand</h2>
<p>Diese Allgemeinen Geschäftsbedingungen (AGB) regeln den Verkauf digitaler Produkte (Ausmal-E-Books im PDF-Format) auf der Website <strong>ColoriMagiques</strong> (nachfolgend „die Website").</p>
<p>Jede Bestellung impliziert die vorbehaltlose Annahme dieser AGB.</p>

<h2>2. Produkte</h2>
<p>Die verkauften Produkte sind herunterladbare PDF-Dateien, die zum persönlichen Ausdruck bestimmt sind. Jede Produktseite gibt die Seitenanzahl, Auflösung (DPI), empfohlene Altersgruppe und den Preis an.</p>

<h2>3. Preise und Zahlung</h2>
<p>Die Preise sind in Euro (EUR) oder US-Dollar (USD) angegeben, inklusive aller Steuern. ColoriMagiques behält sich das Recht vor, Preise jederzeit zu ändern.</p>
<p>Die Zahlung erfolgt online per Kreditkarte über die sichere Plattform <strong>Stripe</strong>. Es werden keine Bankdaten auf unseren Servern gespeichert.</p>

<h2>4. Digitale Lieferung</h2>
<p>Nach Zahlungsbestätigung erhält der Kunde sofort:</p>
<ul>
  <li>Eine Bestätigungs-E-Mail mit sicheren Download-Links;</li>
  <li>Zugang zu Download-Links direkt auf der Bestellbestätigungsseite.</li>
</ul>
<p>Download-Links sind <strong>24 Stunden</strong> gültig und auf <strong>5 Downloads</strong> pro Datei begrenzt.</p>

<h2>5. Widerrufsrecht</h2>
<p>Gemäß den geltenden Verbraucherschutzgesetzen kann das Widerrufsrecht nicht für digitale Inhalte ausgeübt werden, die nicht auf einem materiellen Datenträger geliefert werden, sobald die Ausführung mit vorheriger Zustimmung des Verbrauchers begonnen hat.</p>

<h2>6. Nutzungslizenz</h2>
<p>Der Kauf gewährt eine persönliche, nicht-exklusive Nutzungslizenz:</p>
<ul>
  <li><strong>Erlaubt:</strong> persönlicher Ausdruck, häusliche oder familiäre Bildungsnutzung;</li>
  <li><strong>Verboten:</strong> Weiterverkauf, Weitergabe, kommerzielle Reproduktion, Online-Teilen der PDF-Dateien.</li>
</ul>

<h2>7. Geistiges Eigentum</h2>
<p>Alle Inhalte der Website sind urheberrechtlich geschützt. Jede Reproduktion ist ohne vorherige schriftliche Genehmigung streng verboten.</p>

<h2>8. Haftung</h2>
<p>ColoriMagiques haftet nicht für Schäden, die aus unsachgemäßer Nutzung der Produkte, technischer Inkompatibilität oder vorübergehender Nichtverfügbarkeit der Website resultieren.</p>

<h2>9. Datenschutz</h2>
<p>Die Verarbeitung personenbezogener Daten wird in unserer <a href="/legal/privacy">Datenschutzrichtlinie</a> beschrieben.</p>

<h2>10. Anwendbares Recht</h2>
<p>Diese AGB unterliegen dem anwendbaren Recht. Jeder Rechtsstreit wird vor den zuständigen Gerichten verhandelt.</p>

<h2>11. Kundenservice</h2>
<p>Bei Fragen kontaktieren Sie uns per E-Mail an <strong>support@colorimagiques.com</strong>. Wir verpflichten uns, innerhalb von 48 Geschäftsstunden zu antworten.</p>
`,
};

// ──────────────────────────────────────────────
// 2. MENTIONS LEGALES
// ──────────────────────────────────────────────
export const legalNoticeContent = {
  fr: `
<h2>Éditeur du site</h2>
<p><strong>ColoriMagiques</strong><br/>
Micro-entreprise / Auto-entrepreneur<br/>
Email : <strong>contact@colorimagiques.com</strong></p>
<p>Directeur de la publication : [Votre nom]</p>

<h2>Hébergement</h2>
<p>Le site est hébergé par :<br/>
<strong>[Nom de l'hébergeur]</strong><br/>
[Adresse de l'hébergeur]<br/>
[Téléphone de l'hébergeur]</p>

<h2>Activité</h2>
<p>Vente en ligne de produits numériques (e-books de coloriage pour enfants au format PDF téléchargeable).</p>

<h2>Propriété intellectuelle</h2>
<p>L'ensemble des éléments du site (textes, images, illustrations, logos, fichiers PDF, code source) sont la propriété exclusive de ColoriMagiques ou de ses partenaires. Toute reproduction, représentation ou exploitation, même partielle, sans autorisation écrite préalable, est interdite et constitue une contrefaçon sanctionnée par le Code de la propriété intellectuelle.</p>

<h2>Données personnelles</h2>
<p>Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés, vous disposez d'un droit d'accès, de rectification, de suppression et de portabilité de vos données. Consultez notre <a href="/legal/privacy">Politique de Confidentialité</a> pour plus de détails.</p>

<h2>Cookies</h2>
<p>Le site utilise des cookies techniques essentiels au fonctionnement (préférence de langue, panier) et éventuellement des cookies analytiques. Vous pouvez gérer vos préférences via les paramètres de votre navigateur.</p>

<h2>Crédits</h2>
<p>Design et développement : ColoriMagiques<br/>
Illustrations : Artistes indépendants sous licence exclusive<br/>
Icônes : Lucide Icons (licence MIT)</p>
`,

  en: `
<h2>Website Publisher</h2>
<p><strong>ColoriMagiques</strong><br/>
Sole Proprietorship<br/>
Email: <strong>contact@colorimagiques.com</strong></p>
<p>Publication Director: [Your name]</p>

<h2>Hosting</h2>
<p>The website is hosted by:<br/>
<strong>[Hosting provider name]</strong><br/>
[Hosting provider address]<br/>
[Hosting provider phone]</p>

<h2>Activity</h2>
<p>Online sale of digital products (coloring e-books for children in downloadable PDF format).</p>

<h2>Intellectual Property</h2>
<p>All elements of the website (texts, images, illustrations, logos, PDF files, source code) are the exclusive property of ColoriMagiques or its partners. Any reproduction, representation, or exploitation, even partial, without prior written authorization, is prohibited and constitutes infringement.</p>

<h2>Personal Data</h2>
<p>In accordance with the General Data Protection Regulation (GDPR) and applicable data protection laws, you have the right to access, rectify, delete, and transfer your data. See our <a href="/legal/privacy">Privacy Policy</a> for details.</p>

<h2>Cookies</h2>
<p>The site uses essential technical cookies (language preference, cart) and potentially analytics cookies. You can manage your preferences through your browser settings.</p>

<h2>Credits</h2>
<p>Design & Development: ColoriMagiques<br/>
Illustrations: Independent artists under exclusive license<br/>
Icons: Lucide Icons (MIT license)</p>
`,

  es: `
<h2>Editor del Sitio</h2>
<p><strong>ColoriMagiques</strong><br/>
Autónomo / Micro-empresa<br/>
Email: <strong>contact@colorimagiques.com</strong></p>
<p>Director de publicación: [Su nombre]</p>

<h2>Alojamiento</h2>
<p>El sitio está alojado por:<br/>
<strong>[Nombre del proveedor de hosting]</strong><br/>
[Dirección del proveedor]<br/>
[Teléfono del proveedor]</p>

<h2>Actividad</h2>
<p>Venta en línea de productos digitales (e-books de colorear para niños en formato PDF descargable).</p>

<h2>Propiedad Intelectual</h2>
<p>Todos los elementos del sitio web son propiedad exclusiva de ColoriMagiques o sus socios. Cualquier reproducción sin autorización escrita previa está prohibida.</p>

<h2>Datos Personales</h2>
<p>De acuerdo con el RGPD y las leyes de protección de datos aplicables, usted tiene derecho a acceder, rectificar, eliminar y transferir sus datos. Consulte nuestra <a href="/legal/privacy">Política de Privacidad</a>.</p>

<h2>Cookies</h2>
<p>El sitio utiliza cookies técnicas esenciales (preferencia de idioma, carrito) y posiblemente cookies analíticas. Puede gestionar sus preferencias a través de la configuración de su navegador.</p>

<h2>Créditos</h2>
<p>Diseño y desarrollo: ColoriMagiques<br/>
Ilustraciones: Artistas independientes bajo licencia exclusiva<br/>
Iconos: Lucide Icons (licencia MIT)</p>
`,

  de: `
<h2>Website-Herausgeber</h2>
<p><strong>ColoriMagiques</strong><br/>
Einzelunternehmen<br/>
E-Mail: <strong>contact@colorimagiques.com</strong></p>
<p>Verantwortlicher Herausgeber: [Ihr Name]</p>

<h2>Hosting</h2>
<p>Die Website wird gehostet von:<br/>
<strong>[Name des Hosting-Anbieters]</strong><br/>
[Adresse des Anbieters]<br/>
[Telefon des Anbieters]</p>

<h2>Tätigkeit</h2>
<p>Online-Verkauf digitaler Produkte (Ausmal-E-Books für Kinder im herunterladbaren PDF-Format).</p>

<h2>Geistiges Eigentum</h2>
<p>Alle Elemente der Website sind ausschließliches Eigentum von ColoriMagiques oder seiner Partner. Jede Reproduktion ohne vorherige schriftliche Genehmigung ist verboten.</p>

<h2>Personenbezogene Daten</h2>
<p>Gemäß der DSGVO haben Sie das Recht auf Zugang, Berichtigung, Löschung und Übertragung Ihrer Daten. Weitere Details finden Sie in unserer <a href="/legal/privacy">Datenschutzrichtlinie</a>.</p>

<h2>Cookies</h2>
<p>Die Website verwendet essenzielle technische Cookies (Sprachpräferenz, Warenkorb) und möglicherweise Analyse-Cookies. Sie können Ihre Einstellungen über Ihre Browsereinstellungen verwalten.</p>

<h2>Impressum</h2>
<p>Design & Entwicklung: ColoriMagiques<br/>
Illustrationen: Unabhängige Künstler unter Exklusivlizenz<br/>
Icons: Lucide Icons (MIT-Lizenz)</p>
`,
};

// ──────────────────────────────────────────────
// 3. POLITIQUE DE CONFIDENTIALITE (RGPD)
// ──────────────────────────────────────────────
export const privacyContent = {
  fr: `
<h2>1. Responsable du traitement</h2>
<p><strong>ColoriMagiques</strong> est responsable du traitement de vos données personnelles collectées via le site colorimagiques.com.</p>
<p>Contact : <strong>privacy@colorimagiques.com</strong></p>

<h2>2. Données collectées</h2>
<p>Nous collectons les données suivantes :</p>
<ul>
  <li><strong>Lors d'une commande :</strong> adresse email, nom complet ;</li>
  <li><strong>Données de paiement :</strong> traitées directement par Stripe — nous ne stockons aucune donnée bancaire ;</li>
  <li><strong>Données techniques :</strong> adresse IP, type de navigateur, pages visitées (via cookies analytiques si acceptés) ;</li>
  <li><strong>Avis clients :</strong> nom d'affichage, note, commentaire.</li>
</ul>

<h2>3. Finalités du traitement</h2>
<ul>
  <li>Exécution de la commande et livraison des produits numériques ;</li>
  <li>Envoi de l'email de confirmation avec les liens de téléchargement ;</li>
  <li>Gestion du service client ;</li>
  <li>Amélioration de l'expérience utilisateur ;</li>
  <li>Envoi de la newsletter (avec votre consentement).</li>
</ul>

<h2>4. Base légale</h2>
<ul>
  <li><strong>Exécution du contrat</strong> : traitement de votre commande ;</li>
  <li><strong>Intérêt légitime</strong> : amélioration du site, prévention des fraudes ;</li>
  <li><strong>Consentement</strong> : newsletter, cookies analytiques.</li>
</ul>

<h2>5. Durée de conservation</h2>
<ul>
  <li>Données de commande : 5 ans (obligation légale de facturation) ;</li>
  <li>Liens de téléchargement : 24 heures après génération ;</li>
  <li>Compte admin : durée de l'activité ;</li>
  <li>Cookies : 13 mois maximum.</li>
</ul>

<h2>6. Destinataires des données</h2>
<p>Vos données peuvent être partagées avec :</p>
<ul>
  <li><strong>Stripe</strong> : traitement des paiements (certifié PCI-DSS) ;</li>
  <li><strong>Service SMTP</strong> : envoi des emails transactionnels ;</li>
  <li><strong>Hébergeur</strong> : stockage sécurisé des données.</li>
</ul>
<p>Aucune donnée n'est vendue à des tiers.</p>

<h2>7. Vos droits (RGPD)</h2>
<p>Vous disposez des droits suivants :</p>
<ul>
  <li><strong>Accès</strong> : obtenir une copie de vos données ;</li>
  <li><strong>Rectification</strong> : corriger des données inexactes ;</li>
  <li><strong>Effacement</strong> : demander la suppression de vos données ;</li>
  <li><strong>Portabilité</strong> : recevoir vos données dans un format lisible ;</li>
  <li><strong>Opposition</strong> : vous opposer au traitement ;</li>
  <li><strong>Limitation</strong> : restreindre le traitement.</li>
</ul>
<p>Pour exercer vos droits, contactez <strong>privacy@colorimagiques.com</strong>. Nous répondons sous 30 jours.</p>

<h2>8. Sécurité</h2>
<p>Nous mettons en oeuvre des mesures techniques et organisationnelles pour protéger vos données : chiffrement SSL/TLS, hachage des mots de passe, accès restreint, liens de téléchargement signés et limités dans le temps.</p>

<h2>9. Transferts internationaux</h2>
<p>Vos données peuvent être traitées par Stripe (USA) dans le cadre du Data Privacy Framework EU-US.</p>

<h2>10. Modifications</h2>
<p>Nous nous réservons le droit de modifier cette politique. La date de dernière mise à jour est indiquée en bas de page.</p>
`,

  en: `
<h2>1. Data Controller</h2>
<p><strong>ColoriMagiques</strong> is the data controller for personal data collected through colorimagiques.com.</p>
<p>Contact: <strong>privacy@colorimagiques.com</strong></p>

<h2>2. Data Collected</h2>
<p>We collect the following data:</p>
<ul>
  <li><strong>When placing an order:</strong> email address, full name;</li>
  <li><strong>Payment data:</strong> processed directly by Stripe — we do not store any banking data;</li>
  <li><strong>Technical data:</strong> IP address, browser type, pages visited (via analytics cookies if accepted);</li>
  <li><strong>Customer reviews:</strong> display name, rating, comment.</li>
</ul>

<h2>3. Purposes of Processing</h2>
<ul>
  <li>Order execution and digital product delivery;</li>
  <li>Sending confirmation email with download links;</li>
  <li>Customer service management;</li>
  <li>Improving user experience;</li>
  <li>Sending newsletters (with your consent).</li>
</ul>

<h2>4. Legal Basis</h2>
<ul>
  <li><strong>Contract execution</strong>: processing your order;</li>
  <li><strong>Legitimate interest</strong>: site improvement, fraud prevention;</li>
  <li><strong>Consent</strong>: newsletters, analytics cookies.</li>
</ul>

<h2>5. Data Retention</h2>
<ul>
  <li>Order data: 5 years (legal billing obligation);</li>
  <li>Download links: 24 hours after generation;</li>
  <li>Admin accounts: duration of activity;</li>
  <li>Cookies: 13 months maximum.</li>
</ul>

<h2>6. Data Recipients</h2>
<p>Your data may be shared with:</p>
<ul>
  <li><strong>Stripe</strong>: payment processing (PCI-DSS certified);</li>
  <li><strong>SMTP service</strong>: transactional email delivery;</li>
  <li><strong>Hosting provider</strong>: secure data storage.</li>
</ul>
<p>No data is sold to third parties.</p>

<h2>7. Your Rights (GDPR)</h2>
<p>You have the following rights:</p>
<ul>
  <li><strong>Access</strong>: obtain a copy of your data;</li>
  <li><strong>Rectification</strong>: correct inaccurate data;</li>
  <li><strong>Erasure</strong>: request deletion of your data;</li>
  <li><strong>Portability</strong>: receive your data in a readable format;</li>
  <li><strong>Objection</strong>: object to processing;</li>
  <li><strong>Restriction</strong>: restrict processing.</li>
</ul>
<p>To exercise your rights, contact <strong>privacy@colorimagiques.com</strong>. We respond within 30 days.</p>

<h2>8. Security</h2>
<p>We implement technical and organizational measures to protect your data: SSL/TLS encryption, password hashing, restricted access, signed and time-limited download links.</p>

<h2>9. International Transfers</h2>
<p>Your data may be processed by Stripe (USA) under the EU-US Data Privacy Framework.</p>

<h2>10. Changes</h2>
<p>We reserve the right to modify this policy. The last update date is indicated at the bottom of the page.</p>
`,

  es: `
<h2>1. Responsable del Tratamiento</h2>
<p><strong>ColoriMagiques</strong> es el responsable del tratamiento de datos personales recopilados a través de colorimagiques.com.</p>
<p>Contacto: <strong>privacy@colorimagiques.com</strong></p>

<h2>2. Datos Recopilados</h2>
<ul>
  <li><strong>Al realizar un pedido:</strong> dirección de email, nombre completo;</li>
  <li><strong>Datos de pago:</strong> procesados directamente por Stripe — no almacenamos datos bancarios;</li>
  <li><strong>Datos técnicos:</strong> dirección IP, tipo de navegador, páginas visitadas;</li>
  <li><strong>Opiniones de clientes:</strong> nombre, calificación, comentario.</li>
</ul>

<h2>3. Finalidades del Tratamiento</h2>
<ul>
  <li>Ejecución del pedido y entrega de productos digitales;</li>
  <li>Envío del email de confirmación con enlaces de descarga;</li>
  <li>Gestión del servicio al cliente;</li>
  <li>Mejora de la experiencia del usuario;</li>
  <li>Envío de boletines (con su consentimiento).</li>
</ul>

<h2>4. Base Legal</h2>
<ul>
  <li><strong>Ejecución del contrato</strong>: procesamiento de su pedido;</li>
  <li><strong>Interés legítimo</strong>: mejora del sitio, prevención de fraude;</li>
  <li><strong>Consentimiento</strong>: boletines, cookies analíticas.</li>
</ul>

<h2>5. Período de Conservación</h2>
<ul>
  <li>Datos de pedidos: 5 años;</li>
  <li>Enlaces de descarga: 24 horas;</li>
  <li>Cookies: 13 meses máximo.</li>
</ul>

<h2>6. Destinatarios de los Datos</h2>
<p>Sus datos pueden compartirse con Stripe (pagos), servicio SMTP (emails) y el proveedor de hosting. No se venden datos a terceros.</p>

<h2>7. Sus Derechos (RGPD)</h2>
<p>Tiene derecho a acceder, rectificar, eliminar, portar, oponerse y limitar el tratamiento de sus datos. Contacte a <strong>privacy@colorimagiques.com</strong>.</p>

<h2>8. Seguridad</h2>
<p>Implementamos medidas técnicas y organizativas: cifrado SSL/TLS, hash de contraseñas, acceso restringido, enlaces de descarga firmados y limitados en el tiempo.</p>

<h2>9. Transferencias Internacionales</h2>
<p>Sus datos pueden ser procesados por Stripe (EE.UU.) bajo el Marco de Privacidad de Datos UE-EE.UU.</p>

<h2>10. Modificaciones</h2>
<p>Nos reservamos el derecho de modificar esta política.</p>
`,

  de: `
<h2>1. Verantwortlicher</h2>
<p><strong>ColoriMagiques</strong> ist verantwortlich für die Verarbeitung personenbezogener Daten, die über colorimagiques.com erhoben werden.</p>
<p>Kontakt: <strong>privacy@colorimagiques.com</strong></p>

<h2>2. Erhobene Daten</h2>
<ul>
  <li><strong>Bei einer Bestellung:</strong> E-Mail-Adresse, vollständiger Name;</li>
  <li><strong>Zahlungsdaten:</strong> direkt von Stripe verarbeitet — wir speichern keine Bankdaten;</li>
  <li><strong>Technische Daten:</strong> IP-Adresse, Browsertyp, besuchte Seiten;</li>
  <li><strong>Kundenbewertungen:</strong> Anzeigename, Bewertung, Kommentar.</li>
</ul>

<h2>3. Zwecke der Verarbeitung</h2>
<ul>
  <li>Auftragsausführung und digitale Produktlieferung;</li>
  <li>Versand der Bestätigungs-E-Mail mit Download-Links;</li>
  <li>Kundenservice-Management;</li>
  <li>Verbesserung der Benutzererfahrung;</li>
  <li>Versand von Newslettern (mit Ihrer Zustimmung).</li>
</ul>

<h2>4. Rechtsgrundlage</h2>
<ul>
  <li><strong>Vertragserfüllung</strong>: Bearbeitung Ihrer Bestellung;</li>
  <li><strong>Berechtigtes Interesse</strong>: Website-Verbesserung, Betrugsprävention;</li>
  <li><strong>Einwilligung</strong>: Newsletter, Analyse-Cookies.</li>
</ul>

<h2>5. Aufbewahrungsdauer</h2>
<ul>
  <li>Bestelldaten: 5 Jahre;</li>
  <li>Download-Links: 24 Stunden;</li>
  <li>Cookies: maximal 13 Monate.</li>
</ul>

<h2>6. Datenempfänger</h2>
<p>Ihre Daten können mit Stripe (Zahlungen), SMTP-Dienst (E-Mails) und dem Hosting-Anbieter geteilt werden. Keine Daten werden an Dritte verkauft.</p>

<h2>7. Ihre Rechte (DSGVO)</h2>
<p>Sie haben das Recht auf Auskunft, Berichtigung, Löschung, Datenübertragbarkeit, Widerspruch und Einschränkung der Verarbeitung. Kontaktieren Sie <strong>privacy@colorimagiques.com</strong>.</p>

<h2>8. Sicherheit</h2>
<p>Wir setzen technische und organisatorische Maßnahmen ein: SSL/TLS-Verschlüsselung, Passwort-Hashing, eingeschränkter Zugriff, signierte und zeitlich begrenzte Download-Links.</p>

<h2>9. Internationale Übermittlungen</h2>
<p>Ihre Daten können von Stripe (USA) im Rahmen des EU-US-Datenschutzrahmens verarbeitet werden.</p>

<h2>10. Änderungen</h2>
<p>Wir behalten uns das Recht vor, diese Richtlinie zu ändern.</p>
`,
};

// ──────────────────────────────────────────────
// 4. POLITIQUE DE REMBOURSEMENT
// ──────────────────────────────────────────────
export const refundContent = {
  fr: `
<h2>Notre politique</h2>
<p>Chez <strong>ColoriMagiques</strong>, votre satisfaction est notre priorité. Étant donné la nature numérique de nos produits (fichiers PDF téléchargeables), notre politique de remboursement est encadrée comme suit :</p>

<h2>Produits numériques — Principe général</h2>
<p>En vertu de la législation sur les contenus numériques, une fois que le téléchargement a été initié, le droit de rétractation ne s'applique plus. Vous êtes informé de cette condition avant la validation de votre commande.</p>

<h2>Cas où un remboursement est accordé</h2>
<p>Nous remboursons intégralement dans les cas suivants :</p>
<ul>
  <li><strong>Fichier corrompu ou illisible :</strong> si le PDF ne peut pas être ouvert ou imprimé malgré un lecteur PDF à jour ;</li>
  <li><strong>Produit non conforme :</strong> le contenu ne correspond pas à la description sur le site ;</li>
  <li><strong>Liens de téléchargement expirés :</strong> si un problème technique empêche le téléchargement dans le délai imparti et que nous ne parvenons pas à régénérer les liens ;</li>
  <li><strong>Double facturation :</strong> en cas de paiement en double pour le même produit.</li>
</ul>

<h2>Procédure de demande</h2>
<ol>
  <li>Contactez-nous à <strong>support@colorimagiques.com</strong> dans les <strong>7 jours</strong> suivant l'achat ;</li>
  <li>Indiquez votre numéro de commande et décrivez le problème rencontré ;</li>
  <li>Nous traiterons votre demande sous <strong>48 heures ouvrées</strong> ;</li>
  <li>Le remboursement, s'il est accordé, sera effectué sur le moyen de paiement original sous 5 à 10 jours ouvrés.</li>
</ol>

<h2>Cas où le remboursement n'est pas applicable</h2>
<ul>
  <li>Le fichier a déjà été téléchargé et utilisé ;</li>
  <li>Le client a changé d'avis après le téléchargement ;</li>
  <li>Incompatibilité avec une imprimante non standard.</li>
</ul>

<h2>Régénération de liens</h2>
<p>Si vos liens de téléchargement ont expiré mais que vous n'avez pas encore téléchargé vos fichiers, contactez-nous : nous pouvons régénérer de nouveaux liens gratuitement.</p>

<h2>Contact</h2>
<p>Email : <strong>support@colorimagiques.com</strong><br/>
Délai de réponse : 48 heures ouvrées maximum</p>
`,

  en: `
<h2>Our Policy</h2>
<p>At <strong>ColoriMagiques</strong>, your satisfaction is our priority. Given the digital nature of our products (downloadable PDF files), our refund policy is as follows:</p>

<h2>Digital Products — General Principle</h2>
<p>Under digital content legislation, once a download has been initiated, the right of withdrawal no longer applies. You are informed of this condition before confirming your order.</p>

<h2>Cases Where a Refund Is Granted</h2>
<p>We provide a full refund in the following cases:</p>
<ul>
  <li><strong>Corrupted or unreadable file:</strong> the PDF cannot be opened or printed despite using an up-to-date PDF reader;</li>
  <li><strong>Non-conforming product:</strong> the content does not match the description on the website;</li>
  <li><strong>Expired download links:</strong> if a technical issue prevents downloading within the allotted time and we cannot regenerate links;</li>
  <li><strong>Double billing:</strong> in case of duplicate payment for the same product.</li>
</ul>

<h2>Request Procedure</h2>
<ol>
  <li>Contact us at <strong>support@colorimagiques.com</strong> within <strong>7 days</strong> of purchase;</li>
  <li>Include your order number and describe the issue;</li>
  <li>We will process your request within <strong>48 business hours</strong>;</li>
  <li>If approved, the refund will be issued to the original payment method within 5 to 10 business days.</li>
</ol>

<h2>Cases Where Refunds Do Not Apply</h2>
<ul>
  <li>The file has already been downloaded and used;</li>
  <li>The customer changed their mind after downloading;</li>
  <li>Incompatibility with a non-standard printer.</li>
</ul>

<h2>Link Regeneration</h2>
<p>If your download links have expired but you haven't downloaded your files yet, contact us — we can regenerate new links free of charge.</p>

<h2>Contact</h2>
<p>Email: <strong>support@colorimagiques.com</strong><br/>
Response time: 48 business hours maximum</p>
`,

  es: `
<h2>Nuestra Política</h2>
<p>En <strong>ColoriMagiques</strong>, su satisfacción es nuestra prioridad. Dada la naturaleza digital de nuestros productos (archivos PDF descargables), nuestra política de reembolso es la siguiente:</p>

<h2>Productos Digitales — Principio General</h2>
<p>Según la legislación sobre contenidos digitales, una vez iniciada la descarga, el derecho de desistimiento ya no se aplica.</p>

<h2>Casos en los que se Concede un Reembolso</h2>
<ul>
  <li><strong>Archivo corrupto o ilegible;</strong></li>
  <li><strong>Producto no conforme</strong> a la descripción;</li>
  <li><strong>Enlaces de descarga expirados</strong> por problemas técnicos;</li>
  <li><strong>Doble facturación.</strong></li>
</ul>

<h2>Procedimiento de Solicitud</h2>
<ol>
  <li>Contáctenos en <strong>support@colorimagiques.com</strong> dentro de los <strong>7 días</strong> posteriores a la compra;</li>
  <li>Indique su número de pedido y describa el problema;</li>
  <li>Procesaremos su solicitud en <strong>48 horas laborables</strong>;</li>
  <li>El reembolso se realizará en el medio de pago original en 5 a 10 días laborables.</li>
</ol>

<h2>Casos en los que No se Aplica el Reembolso</h2>
<ul>
  <li>El archivo ya fue descargado y utilizado;</li>
  <li>Cambio de opinión después de la descarga;</li>
  <li>Incompatibilidad con impresora no estándar.</li>
</ul>

<h2>Regeneración de Enlaces</h2>
<p>Si sus enlaces han expirado pero no ha descargado los archivos, contáctenos para regenerarlos gratuitamente.</p>

<h2>Contacto</h2>
<p>Email: <strong>support@colorimagiques.com</strong></p>
`,

  de: `
<h2>Unsere Richtlinie</h2>
<p>Bei <strong>ColoriMagiques</strong> hat Ihre Zufriedenheit höchste Priorität. Aufgrund der digitalen Natur unserer Produkte (herunterladbare PDF-Dateien) gilt folgende Rückerstattungsrichtlinie:</p>

<h2>Digitale Produkte — Allgemeines Prinzip</h2>
<p>Gemäß den Gesetzen über digitale Inhalte gilt das Widerrufsrecht nicht mehr, sobald ein Download initiiert wurde.</p>

<h2>Fälle, in denen eine Rückerstattung gewährt wird</h2>
<ul>
  <li><strong>Beschädigte oder unlesbare Datei;</strong></li>
  <li><strong>Nicht konformes Produkt</strong> (entspricht nicht der Beschreibung);</li>
  <li><strong>Abgelaufene Download-Links</strong> durch technische Probleme;</li>
  <li><strong>Doppelte Abrechnung.</strong></li>
</ul>

<h2>Antragsverfahren</h2>
<ol>
  <li>Kontaktieren Sie uns unter <strong>support@colorimagiques.com</strong> innerhalb von <strong>7 Tagen</strong> nach dem Kauf;</li>
  <li>Geben Sie Ihre Bestellnummer an und beschreiben Sie das Problem;</li>
  <li>Wir bearbeiten Ihre Anfrage innerhalb von <strong>48 Geschäftsstunden</strong>;</li>
  <li>Die Rückerstattung erfolgt auf das ursprüngliche Zahlungsmittel innerhalb von 5 bis 10 Werktagen.</li>
</ol>

<h2>Fälle ohne Rückerstattung</h2>
<ul>
  <li>Die Datei wurde bereits heruntergeladen und verwendet;</li>
  <li>Meinungsänderung nach dem Download;</li>
  <li>Inkompatibilität mit nicht-standardmäßigem Drucker.</li>
</ul>

<h2>Link-Regenerierung</h2>
<p>Falls Ihre Download-Links abgelaufen sind, Sie die Dateien aber noch nicht heruntergeladen haben, kontaktieren Sie uns — wir können kostenlos neue Links generieren.</p>

<h2>Kontakt</h2>
<p>E-Mail: <strong>support@colorimagiques.com</strong></p>
`,
};

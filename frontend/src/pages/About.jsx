// frontend/src/pages/About.jsx
// Page À propos — ColoriMagiques
import React from 'react';
import { Heart, Printer, Download, Shield, Star, Globe } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import Footer from '@/components/shop/Footer';
import SEOHead from '@/components/SEOHead';
import { motion } from 'framer-motion';

const ABOUT_CONTENT = {
  fr: {
    title: 'À propos de ColoriMagiques',
    subtitle: 'Des coloriages créatifs pour les petits artistes',
    intro: 'ColoriMagiques est né d\'une passion simple : offrir aux enfants de 3 à 10 ans des livres de coloriage numériques de qualité professionnelle, accessibles instantanément et imprimables à l\'infini.',
    story: {
      title: 'Notre histoire',
      text: 'Tout a commencé quand nous avons remarqué que les livres de coloriage en librairie étaient souvent chers, avec des dessins trop petits ou peu inspirants. Nous avons alors décidé de créer des e-books de coloriage en PDF haute résolution (300 DPI), pensés par des illustrateurs professionnels, à un prix accessible pour toutes les familles.',
    },
    mission: {
      title: 'Notre mission',
      text: 'Rendre la créativité accessible à chaque enfant. Chaque coloriage est conçu pour stimuler l\'imagination, développer la motricité fine et offrir un moment de calme et de plaisir.',
    },
    values: [
      { icon: Heart, title: 'Passion', desc: 'Chaque illustration est créée avec amour et attention aux détails.' },
      { icon: Printer, title: 'Impression illimitée', desc: 'Imprimez autant de fois que vous voulez. Un achat, des heures de coloriage.' },
      { icon: Download, title: 'Téléchargement instantané', desc: 'Pas d\'attente. Achetez et téléchargez immédiatement votre PDF.' },
      { icon: Shield, title: 'Paiement sécurisé', desc: 'Vos transactions sont protégées par Stripe, leader mondial du paiement en ligne.' },
      { icon: Star, title: 'Qualité 300 DPI', desc: 'Des fichiers professionnels qui s\'impriment parfaitement sur tout type de papier.' },
      { icon: Globe, title: 'Multilingue', desc: 'Notre boutique est disponible en français, anglais, espagnol et allemand.' },
    ],
    stats: [
      { value: '2 500+', label: 'Parents satisfaits' },
      { value: '8', label: 'Thèmes uniques' },
      { value: '4', label: 'Langues supportées' },
      { value: '300', label: 'DPI (qualité pro)' },
    ],
    cta: 'Découvrir nos coloriages',
  },
  en: {
    title: 'About ColoriMagiques',
    subtitle: 'Creative coloring for little artists',
    intro: 'ColoriMagiques was born from a simple passion: offering children aged 3 to 10 professional-quality digital coloring books, instantly accessible and infinitely printable.',
    story: {
      title: 'Our story',
      text: 'It all started when we noticed that coloring books in bookstores were often expensive, with drawings that were too small or uninspiring. We then decided to create high-resolution PDF coloring e-books (300 DPI), designed by professional illustrators, at an affordable price for all families.',
    },
    mission: {
      title: 'Our mission',
      text: 'Making creativity accessible to every child. Each coloring page is designed to stimulate imagination, develop fine motor skills, and offer a moment of calm and pleasure.',
    },
    values: [
      { icon: Heart, title: 'Passion', desc: 'Each illustration is created with love and attention to detail.' },
      { icon: Printer, title: 'Unlimited printing', desc: 'Print as many times as you want. One purchase, hours of coloring.' },
      { icon: Download, title: 'Instant download', desc: 'No waiting. Buy and download your PDF immediately.' },
      { icon: Shield, title: 'Secure payment', desc: 'Your transactions are protected by Stripe, the world leader in online payments.' },
      { icon: Star, title: '300 DPI quality', desc: 'Professional files that print perfectly on any paper type.' },
      { icon: Globe, title: 'Multilingual', desc: 'Our shop is available in French, English, Spanish and German.' },
    ],
    stats: [
      { value: '2,500+', label: 'Happy parents' },
      { value: '8', label: 'Unique themes' },
      { value: '4', label: 'Languages supported' },
      { value: '300', label: 'DPI (pro quality)' },
    ],
    cta: 'Discover our coloring books',
  },
  es: {
    title: 'Acerca de ColoriMagiques',
    subtitle: 'Colorear creativos para pequeños artistas',
    intro: 'ColoriMagiques nació de una pasión simple: ofrecer a los niños de 3 a 10 años libros de colorear digitales de calidad profesional, accesibles al instante e imprimibles infinitamente.',
    story: {
      title: 'Nuestra historia',
      text: 'Todo empezó cuando notamos que los libros de colorear en las librerías eran caros, con dibujos demasiado pequeños o poco inspiradores. Decidimos crear e-books de colorear en PDF de alta resolución (300 DPI), diseñados por ilustradores profesionales, a un precio accesible para todas las familias.',
    },
    mission: {
      title: 'Nuestra misión',
      text: 'Hacer la creatividad accesible a cada niño. Cada página está diseñada para estimular la imaginación, desarrollar la motricidad fina y ofrecer un momento de calma y placer.',
    },
    values: [
      { icon: Heart, title: 'Pasión', desc: 'Cada ilustración está creada con amor y atención al detalle.' },
      { icon: Printer, title: 'Impresión ilimitada', desc: 'Imprime tantas veces como quieras. Una compra, horas de diversión.' },
      { icon: Download, title: 'Descarga instantánea', desc: 'Sin espera. Compra y descarga tu PDF inmediatamente.' },
      { icon: Shield, title: 'Pago seguro', desc: 'Tus transacciones están protegidas por Stripe.' },
      { icon: Star, title: 'Calidad 300 DPI', desc: 'Archivos profesionales que se imprimen perfectamente.' },
      { icon: Globe, title: 'Multilingüe', desc: 'Nuestra tienda está disponible en 4 idiomas.' },
    ],
    stats: [
      { value: '2.500+', label: 'Padres satisfechos' },
      { value: '8', label: 'Temas únicos' },
      { value: '4', label: 'Idiomas' },
      { value: '300', label: 'DPI (calidad pro)' },
    ],
    cta: 'Descubrir nuestros libros',
  },
  de: {
    title: 'Über ColoriMagiques',
    subtitle: 'Kreatives Ausmalen für kleine Künstler',
    intro: 'ColoriMagiques entstand aus einer einfachen Leidenschaft: Kindern von 3 bis 10 Jahren professionelle digitale Malbücher anzubieten, sofort zugänglich und unbegrenzt druckbar.',
    story: {
      title: 'Unsere Geschichte',
      text: 'Alles begann, als wir feststellten, dass Malbücher in Buchhandlungen oft teuer waren, mit zu kleinen oder wenig inspirierenden Zeichnungen. Wir beschlossen, hochauflösende PDF-Malbücher (300 DPI) zu erstellen, von professionellen Illustratoren gestaltet, zu einem erschwinglichen Preis für alle Familien.',
    },
    mission: {
      title: 'Unsere Mission',
      text: 'Kreativität für jedes Kind zugänglich machen. Jede Ausmalseite ist darauf ausgelegt, die Fantasie anzuregen, die Feinmotorik zu entwickeln und einen Moment der Ruhe und Freude zu bieten.',
    },
    values: [
      { icon: Heart, title: 'Leidenschaft', desc: 'Jede Illustration wird mit Liebe und Aufmerksamkeit zum Detail erstellt.' },
      { icon: Printer, title: 'Unbegrenztes Drucken', desc: 'Drucken Sie so oft wie Sie möchten. Ein Kauf, stundenlanger Malspaß.' },
      { icon: Download, title: 'Sofortiger Download', desc: 'Kein Warten. Kaufen und laden Sie Ihr PDF sofort herunter.' },
      { icon: Shield, title: 'Sichere Zahlung', desc: 'Ihre Transaktionen sind durch Stripe geschützt.' },
      { icon: Star, title: '300 DPI Qualität', desc: 'Professionelle Dateien, die perfekt auf jedem Papier drucken.' },
      { icon: Globe, title: 'Mehrsprachig', desc: 'Unser Shop ist in 4 Sprachen verfügbar.' },
    ],
    stats: [
      { value: '2.500+', label: 'Zufriedene Eltern' },
      { value: '8', label: 'Einzigartige Themen' },
      { value: '4', label: 'Sprachen' },
      { value: '300', label: 'DPI (Profi-Qualität)' },
    ],
    cta: 'Unsere Malbücher entdecken',
  },
};

export default function About() {
  const { language } = useLanguage();
  const content = ABOUT_CONTENT[language] || ABOUT_CONTENT.fr;

  return (
    <>
      <SEOHead
        title={content.title}
        description={content.intro}
      />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50 py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 text-6xl animate-bounce">🎨</div>
          <div className="absolute top-20 right-20 text-5xl animate-pulse">✏️</div>
          <div className="absolute bottom-10 left-1/3 text-4xl animate-bounce delay-200">🌈</div>
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4"
          >
            {content.title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600 mb-8"
          >
            {content.subtitle}
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed"
          >
            {content.intro}
          </motion.p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {content.stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl"
            >
              <div className="text-3xl font-extrabold text-purple-700 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Story & Mission */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto space-y-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <span className="text-3xl">📖</span> {content.story.title}
            </h2>
            <p className="text-gray-700 leading-relaxed text-lg">{content.story.text}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <span className="text-3xl">🎯</span> {content.mission.title}
            </h2>
            <p className="text-gray-700 leading-relaxed text-lg">{content.mission.text}</p>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {content.values.map((value, i) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-6 bg-gradient-to-br from-gray-50 to-purple-50 rounded-2xl border border-purple-100 hover:shadow-lg transition-shadow"
                >
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{value.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{value.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold text-white mb-6">🎨 {content.cta}</h2>
          <a
            href="/catalog"
            className="inline-block px-8 py-4 bg-white text-purple-700 font-bold rounded-2xl text-lg hover:bg-purple-50 transition-colors shadow-xl"
          >
            {content.cta} →
          </a>
        </div>
      </section>

      <Footer />
    </>
  );
}

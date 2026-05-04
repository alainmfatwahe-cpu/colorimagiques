// frontend/src/components/shop/Testimonials.jsx
import React from 'react';
import { Star } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';

const testimonials = {
  fr: [
    { name: 'Marie L.', text: 'Mes enfants adorent ! Les dessins sont magnifiques et la qualité d\'impression est top. On a déjà imprimé le livre 3 fois !', rating: 5, avatar: '👩' },
    { name: 'Thomas P.', text: 'Cadeau parfait pour ma nièce de 5 ans. Elle était ravie et a passé des heures à colorier. Je recommande vivement.', rating: 5, avatar: '👨' },
    { name: 'Sophie D.', text: 'Téléchargement instantané, super qualité. Les thèmes sont variés et les dessins adaptés à l\'âge. Top !', rating: 5, avatar: '👩‍🦰' },
  ],
  en: [
    { name: 'Sarah M.', text: 'My kids absolutely love these! The designs are beautiful and print quality is amazing. Already printed the book 3 times!', rating: 5, avatar: '👩' },
    { name: 'James R.', text: 'Perfect gift for my 5-year-old niece. She was thrilled and spent hours coloring. Highly recommend.', rating: 5, avatar: '👨' },
    { name: 'Emma W.', text: 'Instant download, super quality. The themes are varied and age-appropriate designs. Excellent!', rating: 5, avatar: '👩‍🦰' },
  ],
  es: [
    { name: 'María L.', text: '¡A mis hijos les encantan! Los diseños son preciosos y la calidad de impresión es excelente.', rating: 5, avatar: '👩' },
    { name: 'Carlos M.', text: 'Regalo perfecto para mi sobrina de 5 años. Estaba encantada y pasó horas coloreando.', rating: 5, avatar: '👨' },
    { name: 'Ana G.', text: 'Descarga instantánea, súper calidad. Los temas son variados y los diseños adecuados para la edad.', rating: 5, avatar: '👩‍🦰' },
  ],
  de: [
    { name: 'Anna K.', text: 'Meine Kinder lieben es! Die Designs sind wunderschön und die Druckqualität ist top.', rating: 5, avatar: '👩' },
    { name: 'Thomas M.', text: 'Perfektes Geschenk für meine 5-jährige Nichte. Sie war begeistert und hat stundenlang gemalt.', rating: 5, avatar: '👨' },
    { name: 'Lisa S.', text: 'Sofortiger Download, super Qualität. Die Themen sind vielfältig und altersgerecht.', rating: 5, avatar: '👩‍🦰' },
  ],
};

export default function Testimonials() {
  const { t, lang } = useLanguage();
  const items = testimonials[lang] || testimonials.fr;

  return (
    <section className="py-16 md:py-24 px-4 bg-gradient-to-b from-white to-purple-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
          {t('testimonials.title')} ⭐
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center gap-1 mb-3">
                {[...Array(item.rating)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">"{item.text}"</p>
              <div className="flex items-center gap-2">
                <span className="text-2xl">{item.avatar}</span>
                <span className="font-medium text-gray-900 text-sm">{item.name}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

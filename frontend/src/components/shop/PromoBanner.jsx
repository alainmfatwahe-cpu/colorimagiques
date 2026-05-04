// frontend/src/components/shop/PromoBanner.jsx
import React from 'react';
import { X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function PromoBanner({ onClose }) {
  const { t } = useLanguage();

  return (
    <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-amber-500 text-white text-center py-2.5 px-4 text-sm font-medium relative">
      <span>🎉 {t('promo.banner')}</span>
      <button onClick={onClose} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-white/20 rounded-full transition-colors">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

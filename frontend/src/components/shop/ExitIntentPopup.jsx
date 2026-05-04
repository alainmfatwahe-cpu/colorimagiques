// frontend/src/components/shop/ExitIntentPopup.jsx
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function ExitIntentPopup() {
  const { t } = useLanguage();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const shown = sessionStorage.getItem('cm_exit_shown');
    if (shown) return;

    const handleMouseLeave = (e) => {
      if (e.clientY < 10) {
        setShow(true);
        sessionStorage.setItem('cm_exit_shown', 'true');
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, []);

  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
        onClick={() => setShow(false)}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 text-center relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-purple-600 via-pink-500 to-amber-500" />
          <button onClick={() => setShow(false)} className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5" />
          </button>

          <div className="text-5xl mb-4">🎨</div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{t('promo.exitTitle')}</h3>
          <p className="text-gray-600 mb-4">{t('promo.exitText')}</p>

          <div className="bg-purple-50 rounded-2xl p-4 mb-6">
            <p className="text-sm text-gray-500 mb-1">{t('promo.exitCode')}</p>
            <p className="text-3xl font-extrabold text-purple-700 tracking-wider">FIRST10</p>
          </div>

          <button
            onClick={() => setShow(false)}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white py-3 rounded-2xl font-bold hover:from-purple-700 hover:to-pink-600 transition-all shadow-lg"
          >
            {t('promo.exitCta')}
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

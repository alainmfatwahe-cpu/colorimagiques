// frontend/src/components/shop/CartSlideOver.jsx
import React from 'react';
import { X, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function CartSlideOver() {
  const { items, removeItem, isOpen, setIsOpen } = useCart();
  const { t, formatPrice, getRawPrice, currency } = useLanguage();

  const total = items.reduce((sum, item) => sum + getRawPrice(item.product), 0);
  const symbol = currency === 'EUR' ? '€' : '$';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            onClick={() => setIsOpen(false)}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-purple-600" />
                <h2 className="text-lg font-bold">{t('cart.title')}</h2>
                <span className="bg-purple-100 text-purple-700 text-xs font-bold px-2 py-0.5 rounded-full">{items.length}</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag className="w-16 h-16 text-gray-200 mb-4" />
                  <p className="text-gray-500 text-lg">{t('cart.empty')}</p>
                  <button onClick={() => setIsOpen(false)} className="mt-6 px-6 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors">
                    {t('cart.continueShopping')}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <AnimatePresence>
                    {items.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 100 }}
                        className="flex gap-4 bg-gray-50 rounded-2xl p-3"
                      >
                        <div className="w-20 h-24 rounded-xl overflow-hidden bg-gradient-to-br from-purple-100 to-pink-100 flex-shrink-0">
                          {item.product.cover_image ? (
                            <img src={item.product.cover_image} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-2xl">🎨</div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm truncate">{item.product.title}</h3>
                          <p className="text-purple-600 font-bold mt-1">{formatPrice(item.product)}</p>
                          <p className="text-xs text-gray-400 mt-1">PDF • {item.product.page_count || '—'} {t('product.pages')}</p>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors self-start"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t p-6 space-y-4">
                <div className="flex justify-between items-center text-lg">
                  <span className="font-medium text-gray-700">{t('cart.total')}</span>
                  <span className="font-extrabold text-purple-700">{total.toFixed(2)}{symbol}</span>
                </div>
                <Link
                  to="/checkout"
                  onClick={() => setIsOpen(false)}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white py-4 rounded-2xl font-bold hover:from-purple-700 hover:to-pink-600 transition-all shadow-lg shadow-purple-200"
                >
                  {t('cart.checkout')} <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

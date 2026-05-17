import React from 'react';
import { Star, ShoppingCart, Eye } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ProductCarousel from './ProductCarousel';

const badgeColors = {
  new: 'bg-emerald-500',
  popular: 'bg-amber-500',
  bestseller: 'bg-purple-600',
  promo: 'bg-red-500',
};

const CAROUSEL_SLUGS = [
  'les-jeux-olympiques-de-noel',
  'noel-adorable-pour-enfants',
  'latelier-des-oufs-decores',
  'latelier-magique-du-pere-noel',
];

export default function ProductCard({ product, index = 0 }) {
  const { t, formatPrice, getComparePrice, getLocalizedField } = useLanguage();
  const { addItem, isInCart } = useCart();
  const inCart = isInCart(product.id);
  const comparePrice = getComparePrice(product);
  const hasCarousel = CAROUSEL_SLUGS.includes(product.slug);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="group"
    >
      <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 hover:border-purple-200 h-full flex flex-col">
        <Link to={`/product/${product.id}`} className="block">
          <div className="relative aspect-[3/4] overflow-hidden">
            <ProductCarousel
              slug={product.slug}
              title={getLocalizedField(product, 'title')}
            />

            {product.badge && product.badge !== '' && (
              <span className={`absolute top-3 left-3 ${badgeColors[product.badge] || 'bg-gray-500'} text-white text-xs font-bold px-3 py-1 rounded-full shadow-md z-20`}>
                {t(`product.${product.badge}`)}
              </span>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />

            <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 z-10">
              <button className="w-full bg-white/90 backdrop-blur-sm text-gray-800 hover:bg-white rounded-xl font-medium text-sm py-2 px-4 flex items-center justify-center gap-1.5 shadow-lg">
                <Eye className="w-4 h-4" />
                {t('product.viewDetails')}
              </button>
            </div>
          </div>
        </Link>

        <div className="p-5 flex-1 flex flex-col">
          <div className="flex items-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 ${i < Math.round(product.average_rating || 5) ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`}
              />
            ))}
            {product.review_count > 0 && (
              <span className="text-xs text-gray-400 ml-1">({product.review_count})</span>
            )}
          </div>

          <Link to={`/product/${product.id}`}>
            <h3 className="font-bold text-gray-900 mb-1 line-clamp-2 group-hover:text-purple-700 transition-colors">
              {getLocalizedField(product, 'title')}
            </h3>
          </Link>

          <p className="text-xs text-gray-400 mb-3">
            {product.page_count && `${product.page_count} ${t('product.pages')}`}
            {product.age_group && ` • ${product.age_group} ${t('product.years')}`}
          </p>

          <div className="mt-auto flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-extrabold text-purple-700">{formatPrice(product)}</span>
              {comparePrice && (
                <span className="text-sm text-gray-400 line-through">{comparePrice}</span>
              )}
            </div>
            <button
              onClick={(e) => { e.preventDefault(); if (!inCart) addItem(product); }}
              disabled={inCart}
              className={`p-2.5 rounded-xl transition-all ${
                inCart
                  ? 'bg-emerald-100 text-emerald-600'
                  : 'bg-purple-100 text-purple-600 hover:bg-purple-600 hover:text-white hover:scale-110 hover:shadow-lg'
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

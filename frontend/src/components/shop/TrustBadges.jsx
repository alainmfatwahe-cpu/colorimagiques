// frontend/src/components/shop/TrustBadges.jsx
import React from 'react';
import { ShieldCheck, Zap, RefreshCw } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function TrustBadges({ className = '' }) {
  const { t } = useLanguage();

  const badges = [
    { icon: ShieldCheck, label: t('trust.secure'), color: 'text-emerald-600' },
    { icon: Zap, label: t('trust.instant'), color: 'text-amber-600' },
    { icon: RefreshCw, label: t('trust.guarantee'), color: 'text-blue-600' },
  ];

  return (
    <div className={`flex flex-wrap items-center justify-center gap-6 ${className}`}>
      {badges.map((b, i) => (
        <div key={i} className="flex items-center gap-2 text-sm text-gray-500">
          <b.icon className={`w-4 h-4 ${b.color}`} />
          <span className="font-medium">{b.label}</span>
        </div>
      ))}
    </div>
  );
}

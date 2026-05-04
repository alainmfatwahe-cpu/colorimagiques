// frontend/src/components/shop/LanguageSelector.jsx
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const languages = [
  { code: 'fr', label: 'FR', flag: '🇫🇷' },
  { code: 'en', label: 'EN', flag: '🇬🇧' },
  { code: 'es', label: 'ES', flag: '🇪🇸' },
  { code: 'de', label: 'DE', flag: '🇩🇪' },
];

const currencies = [
  { code: 'EUR', symbol: '€' },
  { code: 'USD', symbol: '$' },
];

export default function LanguageSelector() {
  const { lang, setLang, currency, setCurrency } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const currentLang = languages.find((l) => l.code === lang) || languages[0];

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
      >
        <span>{currentLang.flag}</span>
        <span className="hidden sm:inline">{currentLang.label}</span>
        <span className="text-gray-400">|</span>
        <span>{currency === 'EUR' ? '€' : '$'}</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 p-3 z-50 min-w-[200px]">
          <p className="text-xs font-medium text-gray-400 mb-2 px-2">Langue</p>
          <div className="space-y-1 mb-3">
            {languages.map((l) => (
              <button
                key={l.code}
                onClick={() => { setLang(l.code); }}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-colors ${
                  lang === l.code ? 'bg-purple-50 text-purple-700 font-medium' : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                <span>{l.flag}</span>
                <span>{l.label}</span>
              </button>
            ))}
          </div>
          <div className="border-t pt-3">
            <p className="text-xs font-medium text-gray-400 mb-2 px-2">Devise</p>
            <div className="flex gap-2">
              {currencies.map((c) => (
                <button
                  key={c.code}
                  onClick={() => { setCurrency(c.code); setOpen(false); }}
                  className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${
                    currency === c.code ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {c.symbol} {c.code}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

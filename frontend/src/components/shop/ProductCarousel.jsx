import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const MOCKUP_COUNTS = {
  'les-jeux-olympiques-de-noel': 10,
  'noel-adorable-pour-enfants': 6,
  'latelier-des-oufs-decores': 11,
  'latelier-magique-du-pere-noel': 9,
};

export default function ProductCarousel({ slug, title }) {
  const count = MOCKUP_COUNTS[slug] || 0;
  const [current, setCurrent] = useState(0);
  const [loaded, setLoaded] = useState([]);

  const total = count;

  const prev = useCallback(() => setCurrent(c => (c - 1 + total) % total), [total]);
  const next = useCallback(() => setCurrent(c => (c + 1) % total), [total]);

  useEffect(() => {
    if (total === 0) return;
    const imgs = Array.from({ length: total }, (_, i) => {
      const img = new Image();
      img.src = `https://raw.githubusercontent.com/alainmfatwahe-cpu/colorimagiques/master/backend/uploads/images/${slug}_mockup_${i + 1}.png`;
      return img;
    });
    setLoaded(imgs);
  }, [slug, total]);

  if (total === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50">
        <span className="text-6xl">ðŸŽ¨</span>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full overflow-hidden bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50">
      {loaded[current] && (
        <img
          src={loaded[current].src}
          alt={`${title} - ${current + 1}`}
          className="w-full h-full object-cover transition-opacity duration-300"
          loading="lazy"
        />
      )}

      {/* Dots indicator */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
        {loaded.map((_, i) => (
          <button
            key={i}
            onClick={(e) => { e.preventDefault(); setCurrent(i); }}
            className={`w-1.5 h-1.5 rounded-full transition-all ${i === current ? 'bg-white w-3' : 'bg-white/50'}`}
            aria-label={`Image ${i + 1}`}
          />
        ))}
      </div>

      {/* Arrows */}
      {total > 1 && (
        <>
          <button
            onClick={(e) => { e.preventDefault(); prev(); }}
            className="absolute left-1.5 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:bg-white hover:scale-110 transition-all z-10 opacity-0 group-hover:opacity-100"
            aria-label="Previous"
          >
            <ChevronLeft className="w-3.5 h-3.5 text-gray-700" />
          </button>
          <button
            onClick={(e) => { e.preventDefault(); next(); }}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:bg-white hover:scale-110 transition-all z-10 opacity-0 group-hover:opacity-100"
            aria-label="Next"
          >
            <ChevronRight className="w-3.5 h-3.5 text-gray-700" />
          </button>
        </>
      )}

      {/* Counter badge */}
      <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm text-white text-[10px] px-2 py-0.5 rounded-full z-10">
        {current + 1}/{total}
      </div>
    </div>
  );
}

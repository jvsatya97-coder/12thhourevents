'use client';
import { useState } from 'react';
import { getImgFallbacks } from '@/lib/products';

function DriveImg({ src, alt, className, onClick }: { src: string; alt: string; className?: string; onClick?: () => void }) {
  const [imgSrc, setImgSrc] = useState(src);
  const [fallbackIdx, setFallbackIdx] = useState(0);
  const [error, setError] = useState(false);

  const handleError = () => {
    const fallbacks = getImgFallbacks(src);
    if (fallbackIdx < fallbacks.length) {
      setImgSrc(fallbacks[fallbackIdx]);
      setFallbackIdx(f => f + 1);
    } else {
      setError(true);
    }
  };

  if (error) {
    return (
      <div className={`${className} bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center`} onClick={onClick}>
        <span className="text-4xl">🎉</span>
      </div>
    );
  }

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      referrerPolicy="no-referrer"
      onError={handleError}
      onClick={onClick}
    />
  );
}

export default function ImageGallery({ imgs, name }: { imgs: string[]; name: string }) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  if (!imgs.length) return (
    <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center" style={{ aspectRatio: '4/3' }}>
      <span className="text-6xl">🎉</span>
    </div>
  );

  const prev = () => setActive(a => (a - 1 + imgs.length) % imgs.length);
  const next = () => setActive(a => (a + 1) % imgs.length);

  return (
    <div>
      {/* Main image */}
      <div className="rounded-2xl overflow-hidden mb-3 relative group cursor-zoom-in" style={{ aspectRatio: '4/3' }}>
        <DriveImg
          src={imgs[active]}
          alt={`${name} ${active + 1}`}
          className="w-full h-full object-cover"
          onClick={() => setLightbox(true)}
        />

        {/* Nav arrows */}
        {imgs.length > 1 && (
          <>
            <button
              onClick={e => { e.stopPropagation(); prev(); }}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-sm font-bold"
            >‹</button>
            <button
              onClick={e => { e.stopPropagation(); next(); }}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-sm font-bold"
            >›</button>
            {/* Counter */}
            <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {active + 1} / {imgs.length}
            </div>
          </>
        )}

        {/* Zoom hint */}
        <div className="absolute top-2 right-2 bg-black/40 text-white text-[10px] px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
          🔍 Zoom
        </div>
      </div>

      {/* Thumbnails */}
      {imgs.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          {imgs.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                i === active ? 'border-orange-500 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              <DriveImg src={img} alt={`thumb ${i + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-4"
          onClick={() => setLightbox(false)}
        >
          <button className="absolute top-4 right-4 text-white text-3xl z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20">✕</button>

          {imgs.length > 1 && (
            <>
              <button
                onClick={e => { e.stopPropagation(); prev(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-4xl z-10 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 font-bold"
              >‹</button>
              <button
                onClick={e => { e.stopPropagation(); next(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-4xl z-10 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 font-bold"
              >›</button>
            </>
          )}

          <DriveImg
            src={imgs[active]}
            alt={name}
            className="max-w-full max-h-[85vh] rounded-xl object-contain"
          />

          {imgs.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
              {imgs.map((_, i) => (
                <button
                  key={i}
                  onClick={e => { e.stopPropagation(); setActive(i); }}
                  className={`h-2 rounded-full transition-all ${i === active ? 'bg-orange-400 w-4' : 'bg-white/40 w-2'}`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

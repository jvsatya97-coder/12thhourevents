'use client';
import { useState } from 'react';

export default function ImageGallery({ imgs, name }: { imgs: string[]; name: string }) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  if (!imgs.length) return null;

  return (
    <div>
      {/* Main image */}
      <div className="rounded-2xl overflow-hidden mb-3 cursor-zoom-in" onClick={() => setLightbox(true)} style={{ aspectRatio: '4/3' }}>
        <img src={imgs[active]} alt={`${name} ${active + 1}`} className="w-full h-full object-cover" />
      </div>
      {/* Thumbnails */}
      {imgs.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {imgs.map((img, i) => (
            <button key={i} onClick={() => setActive(i)}
              className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${i === active ? 'border-orange-500' : 'border-transparent opacity-60 hover:opacity-100'}`}>
              <img src={img} alt={`thumb ${i}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-[200] bg-black/90 flex items-center justify-center p-4" onClick={() => setLightbox(false)}>
          <img src={imgs[active]} alt={name} className="max-w-full max-h-full rounded-xl object-contain" />
          <button className="absolute top-4 right-4 text-white text-3xl">✕</button>
        </div>
      )}
    </div>
  );
}

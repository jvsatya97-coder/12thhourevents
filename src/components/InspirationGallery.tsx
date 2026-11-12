'use client';
import { useState } from 'react';

const CATEGORIES = ['All', 'Birthday', 'Anniversary', 'Baby Shower', 'Bachelorette', 'Theme'];

const PHOTOS = [
  // Birthday
  { src: 'https://images.unsplash.com/photo-1464349153735-7db50ed83c84?w=500&q=70', cat: 'Birthday', label: 'Pink Birthday Setup', city: 'Delhi' },
  { src: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=500&q=70', cat: 'Birthday', label: 'Balloon Extravaganza', city: 'Noida' },
  { src: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=70', cat: 'Birthday', label: 'Golden Theme', city: 'Gurgaon' },
  { src: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=500&q=70', cat: 'Birthday', label: 'Rainbow Explosion', city: 'Mumbai' },
  // Anniversary
  { src: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=500&q=70', cat: 'Anniversary', label: 'Romantic Rose Setup', city: 'Delhi' },
  { src: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=500&q=70', cat: 'Anniversary', label: 'Fairy Light Canopy', city: 'Bangalore' },
  { src: 'https://images.unsplash.com/photo-1507919909716-c8262e491cde?w=500&q=70', cat: 'Anniversary', label: 'Red & Gold Night', city: 'Hyderabad' },
  // Baby Shower
  { src: 'https://images.unsplash.com/photo-1544126592-807ade215a0b?w=500&q=70', cat: 'Baby Shower', label: 'Pastel Cloud Setup', city: 'Chennai' },
  { src: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=500&q=70', cat: 'Baby Shower', label: 'Mint & Gold Shower', city: 'Pune' },
  // Bachelorette
  { src: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=500&q=70', cat: 'Bachelorette', label: 'Neon Vibes Night', city: 'Mumbai' },
  { src: 'https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=500&q=70', cat: 'Bachelorette', label: 'Last Fling 🥂', city: 'Bangalore' },
  // Theme
  { src: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&q=70', cat: 'Theme', label: 'Enchanted Forest', city: 'Delhi' },
  { src: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=500&q=70', cat: 'Theme', label: 'Gatsby Glam', city: 'Gurgaon' },
  { src: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500&q=70', cat: 'Theme', label: 'Under the Stars', city: 'Noida' },
];

export default function InspirationGallery() {
  const [active, setActive] = useState('All');
  const [lightbox, setLightbox] = useState<typeof PHOTOS[0] | null>(null);

  const filtered = active === 'All' ? PHOTOS : PHOTOS.filter(p => p.cat === active);

  return (
    <>
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          {/* Heading */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-pink-100 text-pink-600 rounded-full px-3 py-1 text-xs font-bold mb-3">
              📸 REAL SETUPS
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-800 mb-2">
              Get <span style={{ background: 'linear-gradient(135deg,#ec4899,#f97316)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>Inspired</span>
            </h2>
            <p className="text-sm text-gray-500">Real setups by our team. Tap any photo to zoom.</p>
          </div>

          {/* Category filter */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`flex-shrink-0 text-sm font-semibold px-4 py-2 rounded-full border-2 transition-all ${active === cat ? 'border-pink-500 bg-pink-500 text-white' : 'border-gray-200 text-gray-600 hover:border-pink-300 hover:text-pink-600'}`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Masonry grid */}
          <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 space-y-3">
            {filtered.map((photo, i) => (
              <div
                key={photo.src + i}
                className="break-inside-avoid cursor-pointer group relative overflow-hidden rounded-2xl"
                onClick={() => setLightbox(photo)}
              >
                <img
                  src={photo.src}
                  alt={photo.label}
                  className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  style={{ aspectRatio: i % 3 === 0 ? '3/4' : i % 3 === 1 ? '1/1' : '4/3' }}
                  loading="lazy"
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="text-white font-bold text-sm leading-tight">{photo.label}</div>
                    <div className="text-white/70 text-xs mt-0.5">📍 {photo.city}</div>
                  </div>
                  <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-2 py-0.5 rounded-full border border-white/30">
                    {photo.cat}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-8">
            <a
              href="https://wa.me/918073552837?text=Hi! I saw your inspiration gallery and want something similar for my event. Can you help?"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-orange-500 text-white font-bold px-7 py-3.5 rounded-full shadow-lg shadow-pink-200 hover:opacity-90 transition text-sm"
            >
              📲 Recreate This for My Event
            </a>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
          onClick={() => setLightbox(null)}
        >
          <div className="relative max-w-2xl w-full" onClick={e => e.stopPropagation()}>
            <img src={lightbox.src} alt={lightbox.label} className="w-full rounded-2xl shadow-2xl" />
            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
              <div>
                <div className="text-white font-bold text-lg drop-shadow">{lightbox.label}</div>
                <div className="text-white/70 text-sm">📍 {lightbox.city} · {lightbox.cat}</div>
              </div>
              <a
                href={`https://wa.me/918073552837?text=Hi! I want a ${lightbox.cat} decoration similar to "${lightbox.label}" in ${lightbox.city}. Can you help?`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 bg-green-500 text-white font-bold text-sm px-4 py-2 rounded-full"
                onClick={e => e.stopPropagation()}
              >
                💬 Book This Style
              </a>
            </div>
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-3 right-3 w-9 h-9 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center text-lg backdrop-blur-sm"
            >✕</button>
          </div>
        </div>
      )}
    </>
  );
}

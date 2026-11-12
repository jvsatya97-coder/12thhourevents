'use client';
import { useState } from 'react';

/*
 * ┌─────────────────────────────────────────────────────────────┐
 * │  HOW TO ADD YOUR OWN REAL PHOTOS                            │
 * │                                                             │
 * │  Option A — Google Drive (easiest):                         │
 * │  1. Upload your photo to Google Drive                       │
 * │  2. Right-click → Share → "Anyone with the link"            │
 * │  3. Copy the link, e.g.:                                    │
 * │     https://drive.google.com/file/d/1AbCdEfG.../view       │
 * │  4. Extract the ID (the part between /d/ and /view)         │
 * │  5. Add an entry below:                                     │
 * │     { driveId: '1AbCdEfG...', cat: 'Birthday', label: '...', city: '...' }
 * │                                                             │
 * │  Option B — Direct image URL:                               │
 * │  1. Upload to any image host (Cloudinary, Imgur, etc.)      │
 * │  2. Add an entry:                                           │
 * │     { src: 'https://...', cat: 'Birthday', label: '...', city: '...' }
 * │                                                             │
 * │  Categories: 'Birthday' | 'Anniversary' | 'Baby Shower' |  │
 * │              'Bachelorette' | 'Theme' | 'Corporate'         │
 * └─────────────────────────────────────────────────────────────┘
 */

type Photo = {
  src?: string;       // direct image URL
  driveId?: string;   // Google Drive file ID
  cat: string;
  label: string;
  city: string;
};

// Convert Google Drive file ID → CDN image URL
function driveUrl(id: string): string {
  return `https://lh3.googleusercontent.com/d/${id}=w800`;
}

// Get the display URL for a photo entry
function photoSrc(p: Photo): string {
  if (p.driveId) return driveUrl(p.driveId);
  return p.src || '';
}

// Fallback URLs for Drive photos if primary fails
function photoFallbacks(p: Photo): string[] {
  if (!p.driveId) return [];
  return [
    `https://drive.google.com/thumbnail?id=${p.driveId}&sz=w800`,
    `https://drive.google.com/uc?export=view&id=${p.driveId}`,
  ];
}

/* ─── YOUR PHOTOS GO HERE ──────────────────────────────────────
   Replace/add entries below. Use `driveId` for Google Drive photos
   or `src` for direct image URLs.
   ─────────────────────────────────────────────────────────────*/
const PHOTOS: Photo[] = [
  // ── BIRTHDAY ───────────────────────────────────────────────
  { src: 'https://images.unsplash.com/photo-1464349153735-7db50ed83c84?w=500&q=70', cat: 'Birthday', label: 'Pink Birthday Setup', city: 'Delhi' },
  { src: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=500&q=70', cat: 'Birthday', label: 'Balloon Extravaganza', city: 'Noida' },
  { src: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=70', cat: 'Birthday', label: 'Golden Theme', city: 'Gurgaon' },
  { src: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=500&q=70', cat: 'Birthday', label: 'Rainbow Explosion', city: 'Mumbai' },

  // ── ANNIVERSARY ────────────────────────────────────────────
  { src: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=500&q=70', cat: 'Anniversary', label: 'Romantic Rose Setup', city: 'Delhi' },
  { src: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=500&q=70', cat: 'Anniversary', label: 'Fairy Light Canopy', city: 'Bangalore' },
  { src: 'https://images.unsplash.com/photo-1507919909716-c8262e491cde?w=500&q=70', cat: 'Anniversary', label: 'Red & Gold Night', city: 'Hyderabad' },

  // ── BABY SHOWER ────────────────────────────────────────────
  { src: 'https://images.unsplash.com/photo-1544126592-807ade215a0b?w=500&q=70', cat: 'Baby Shower', label: 'Pastel Cloud Setup', city: 'Chennai' },
  { src: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=500&q=70', cat: 'Baby Shower', label: 'Mint & Gold Shower', city: 'Pune' },

  // ── BACHELORETTE ───────────────────────────────────────────
  { src: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=500&q=70', cat: 'Bachelorette', label: 'Neon Vibes Night', city: 'Mumbai' },
  { src: 'https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=500&q=70', cat: 'Bachelorette', label: 'Last Fling 🥂', city: 'Bangalore' },

  // ── THEME ──────────────────────────────────────────────────
  { src: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&q=70', cat: 'Theme', label: 'Enchanted Forest', city: 'Delhi' },
  { src: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=500&q=70', cat: 'Theme', label: 'Gatsby Glam', city: 'Gurgaon' },
  { src: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500&q=70', cat: 'Theme', label: 'Under the Stars', city: 'Noida' },

  // ── ADD YOUR REAL PHOTOS BELOW ─────────────────────────────
  // Example Google Drive photo (replace with your real Drive ID):
  // { driveId: 'YOUR_GOOGLE_DRIVE_FILE_ID_HERE', cat: 'Birthday', label: 'My Setup Name', city: 'Delhi' },
  //
  // Example direct URL:
  // { src: 'https://your-image-url.com/photo.jpg', cat: 'Anniversary', label: 'Romantic Setup', city: 'Mumbai' },
];

const CATEGORIES = ['All', 'Birthday', 'Anniversary', 'Baby Shower', 'Bachelorette', 'Theme'];

/* ─── Single photo card with fallback chain ─────────────────── */
function GalleryCard({ photo, index, onClick }: { photo: Photo; index: number; onClick: () => void }) {
  const primary = photoSrc(photo);
  const fallbacks = photoFallbacks(photo);
  const allSrcs = [primary, ...fallbacks].filter(Boolean);

  const [srcIdx, setSrcIdx] = useState(0);
  const [failed, setFailed] = useState(!primary);

  const handleError = () => {
    if (srcIdx + 1 < allSrcs.length) {
      setSrcIdx(i => i + 1);
    } else {
      setFailed(true);
    }
  };

  const aspectMap: Record<number, string> = { 0: '3/4', 1: '1/1', 2: '4/3' };
  const aspect = aspectMap[index % 3];

  return (
    <div
      className="break-inside-avoid cursor-pointer group relative overflow-hidden rounded-2xl bg-orange-50"
      onClick={onClick}
    >
      {!failed ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={allSrcs[srcIdx]}
          alt={photo.label}
          className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
          style={{ aspectRatio: aspect }}
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={handleError}
        />
      ) : (
        /* Fallback: decorative placeholder */
        <div
          className="w-full flex flex-col items-center justify-center bg-gradient-to-br from-orange-100 to-pink-100 text-center p-4"
          style={{ aspectRatio: aspect }}
        >
          <div className="text-4xl mb-2">🎊</div>
          <div className="text-xs font-semibold text-orange-700 leading-tight">{photo.label}</div>
          <div className="text-[10px] text-orange-400 mt-1">📍 {photo.city}</div>
        </div>
      )}

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
  );
}

/* ─── Main component ─────────────────────────────────────────── */
export default function InspirationGallery() {
  const [active, setActive] = useState('All');
  const [lightbox, setLightbox] = useState<{ photo: Photo; index: number } | null>(null);

  const filtered = active === 'All' ? PHOTOS : PHOTOS.filter(p => p.cat === active);

  const lbPrimary = lightbox ? photoSrc(lightbox.photo) : '';
  const lbFallbacks = lightbox ? photoFallbacks(lightbox.photo) : [];
  const lbAllSrcs = [lbPrimary, ...lbFallbacks].filter(Boolean);
  const [lbSrcIdx, setLbSrcIdx] = useState(0);
  const [lbFailed, setLbFailed] = useState(false);

  const openLightbox = (photo: Photo, index: number) => {
    setLbSrcIdx(0);
    setLbFailed(!photoSrc(photo));
    setLightbox({ photo, index });
  };

  const handleLbError = () => {
    if (lbSrcIdx + 1 < lbAllSrcs.length) {
      setLbSrcIdx(i => i + 1);
    } else {
      setLbFailed(true);
    }
  };

  return (
    <>
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          {/* Heading */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-600 rounded-full px-3 py-1 text-xs font-bold mb-3">
              📸 REAL SETUPS
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-800 mb-2">
              Get <span style={{ background: 'linear-gradient(135deg,#ec4899,#f97316)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>Inspired</span>
            </h2>
            <p className="text-sm text-gray-500">Real setups by our team. Tap any photo to zoom.</p>
          </div>

          {/* Category filter — orange active state */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`flex-shrink-0 text-sm font-semibold px-4 py-2 rounded-full border-2 transition-all ${
                  active === cat
                    ? 'border-orange-500 bg-orange-500 text-white'
                    : 'border-gray-200 text-gray-600 hover:border-orange-300 hover:text-orange-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Masonry grid */}
          <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 space-y-3">
            {filtered.map((photo, i) => (
              <GalleryCard
                key={`${photo.driveId || photo.src}-${i}`}
                photo={photo}
                index={i}
                onClick={() => openLightbox(photo, i)}
              />
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-8">
            <a
              href="https://wa.me/918073552837?text=Hi! I saw your inspiration gallery and want something similar for my event. Can you help?"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold px-7 py-3.5 rounded-full shadow-lg shadow-orange-200 hover:opacity-90 transition text-sm"
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
            {!lbFailed ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={lbAllSrcs[lbSrcIdx]}
                alt={lightbox.photo.label}
                className="w-full rounded-2xl shadow-2xl"
                referrerPolicy="no-referrer"
                onError={handleLbError}
              />
            ) : (
              <div className="w-full aspect-video rounded-2xl bg-gradient-to-br from-orange-100 to-pink-100 flex flex-col items-center justify-center">
                <div className="text-6xl mb-3">🎊</div>
                <div className="text-gray-700 font-bold">{lightbox.photo.label}</div>
              </div>
            )}

            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
              <div>
                <div className="text-white font-bold text-lg drop-shadow">{lightbox.photo.label}</div>
                <div className="text-white/70 text-sm">📍 {lightbox.photo.city} · {lightbox.photo.cat}</div>
              </div>
              <a
                href={`https://wa.me/918073552837?text=Hi! I want a ${lightbox.photo.cat} decoration similar to "${lightbox.photo.label}" in ${lightbox.photo.city}. Can you help?`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 bg-orange-500 text-white font-bold text-sm px-4 py-2 rounded-full"
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

'use client';
import { useState } from 'react';
import { WA_NUM } from '@/lib/config';

const THEMES = [
  {
    id: 'princess',
    label: 'Princess',
    emoji: '👸',
    color: 'from-pink-400 to-rose-400',
    photos: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=70',
      'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=400&q=70',
      'https://images.unsplash.com/photo-1464349153735-7db50ed83c84?w=400&q=70',
      'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&q=70',
    ],
  },
  {
    id: 'safari',
    label: 'Jungle Safari',
    emoji: '🦁',
    color: 'from-green-500 to-emerald-500',
    photos: [
      'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&q=70',
      'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=400&q=70',
      'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=400&q=70',
      'https://images.unsplash.com/photo-1464349153735-7db50ed83c84?w=400&q=70',
    ],
  },
  {
    id: 'unicorn',
    label: 'Unicorn',
    emoji: '🦄',
    color: 'from-purple-400 to-pink-400',
    photos: [
      'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=400&q=70',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=70',
      'https://images.unsplash.com/photo-1464349153735-7db50ed83c84?w=400&q=70',
      'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&q=70',
    ],
  },
  {
    id: 'roses',
    label: 'Roses & Romance',
    emoji: '🌹',
    color: 'from-red-400 to-rose-500',
    photos: [
      'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&q=70',
      'https://images.unsplash.com/photo-1464349153735-7db50ed83c84?w=400&q=70',
      'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=400&q=70',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=70',
    ],
  },
  {
    id: 'boho',
    label: 'Boho Chic',
    emoji: '🌿',
    color: 'from-amber-400 to-orange-400',
    photos: [
      'https://images.unsplash.com/photo-1544126592-807ade215a0b?w=400&q=70',
      'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&q=70',
      'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=400&q=70',
      'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&q=70',
    ],
  },
  {
    id: 'winter',
    label: 'Winter Wonderland',
    emoji: '❄️',
    color: 'from-blue-400 to-cyan-400',
    photos: [
      'https://images.unsplash.com/photo-1512389098783-66b81f86e199?w=400&q=70',
      'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=400&q=70',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=70',
      'https://images.unsplash.com/photo-1464349153735-7db50ed83c84?w=400&q=70',
    ],
  },
];

export default function PhotoMoodBoard() {
  const [active, setActive] = useState(THEMES[0].id);
  const [saved, setSaved] = useState<string[]>([]);
  const [lightbox, setLightbox] = useState<string | null>(null);

  const theme = THEMES.find(t => t.id === active) || THEMES[0];

  const toggleSave = (id: string) => {
    setSaved(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const shareToWhatsApp = () => {
    const savedThemes = THEMES.filter(t => saved.includes(t.id));
    const list = savedThemes.length > 0
      ? savedThemes.map(t => `${t.emoji} ${t.label}`).join(', ')
      : `${theme.emoji} ${theme.label}`;
    const msg = `Hi! I found some decoration styles I love on your website:\n\n${list}\n\nCan you show me packages in these themes?`;
    window.open(`https://wa.me/${WA_NUM}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <>
      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 p-4"
          onClick={() => setLightbox(null)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={lightbox}
            alt="Preview"
            className="max-w-full max-h-full rounded-2xl object-contain shadow-2xl"
            onClick={e => e.stopPropagation()}
          />
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white text-xl transition">
            ×
          </button>
        </div>
      )}

      <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className={`bg-gradient-to-r ${theme.color} p-5 text-white`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-base">Theme Mood Board</h3>
              <p className="text-xs text-white/80 mt-0.5">Tap styles you love → share on WhatsApp</p>
            </div>
            {saved.length > 0 && (
              <button
                onClick={shareToWhatsApp}
                className="bg-white/20 hover:bg-white/30 active:scale-95 text-white text-xs font-bold px-3 py-2 rounded-xl transition flex items-center gap-1.5">
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.978-1.306A9.962 9.962 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18a7.959 7.959 0 01-4.065-1.112l-.29-.173-3.005.788.802-2.924-.19-.3A7.96 7.96 0 014 12c0-4.418 3.582-8 8-8s8 3.582 8 8-3.582 8-8 8z"/></svg>
                Share {saved.length} style{saved.length !== 1 ? 's' : ''}
              </button>
            )}
          </div>
        </div>

        {/* Theme tabs */}
        <div className="flex gap-2 px-4 pt-4 pb-2 overflow-x-auto scrollbar-hide">
          {THEMES.map(t => (
            <button
              key={t.id}
              onClick={() => setActive(t.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all flex-none ${
                active === t.id
                  ? 'bg-gray-800 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}>
              <span>{t.emoji}</span>
              <span>{t.label}</span>
              {saved.includes(t.id) && <span className="w-1.5 h-1.5 rounded-full bg-orange-400 flex-none" />}
            </button>
          ))}
        </div>

        {/* Photo grid */}
        <div className="grid grid-cols-2 gap-2 px-4 pb-2">
          {theme.photos.map((url, i) => (
            <div key={i} className="relative group aspect-square overflow-hidden rounded-2xl bg-gray-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt={`${theme.label} ${i + 1}`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                onClick={() => setLightbox(url)}
                loading="lazy"
              />
              {/* Zoom overlay */}
              <button
                onClick={() => setLightbox(url)}
                className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-all">
                <span className="opacity-0 group-hover:opacity-100 transition text-white text-2xl drop-shadow-lg">🔍</span>
              </button>
            </div>
          ))}
        </div>

        {/* Save & share bar */}
        <div className="p-4 flex items-center justify-between gap-3">
          <button
            onClick={() => toggleSave(theme.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-bold transition-all active:scale-95 ${
              saved.includes(theme.id)
                ? 'bg-orange-500 text-white shadow-md'
                : 'bg-orange-50 text-orange-600 hover:bg-orange-100 border border-orange-200'
            }`}>
            <span>{saved.includes(theme.id) ? '❤️' : '🤍'}</span>
            {saved.includes(theme.id) ? 'Saved!' : `Love this style`}
          </button>

          <button
            onClick={shareToWhatsApp}
            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 active:scale-95 text-white text-sm font-bold px-4 py-2.5 rounded-2xl transition shadow-md">
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.978-1.306A9.962 9.962 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18a7.959 7.959 0 01-4.065-1.112l-.29-.173-3.005.788.802-2.924-.19-.3A7.96 7.96 0 014 12c0-4.418 3.582-8 8-8s8 3.582 8 8-3.582 8-8 8z"/></svg>
            Ask for this →
          </button>
        </div>
      </div>
    </>
  );
}

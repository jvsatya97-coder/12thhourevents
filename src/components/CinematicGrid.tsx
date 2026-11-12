'use client';

// Premium bento-style cinematic photo grid
// Full-bleed, hover zoom, category badge + WhatsApp CTA overlay
// Inspired by Peerspace, Cherishx, premium event decoration brands

const PHOTOS = [
  {
    src: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=70',
    label: 'Anniversary Setup',
    cat: 'Anniversary',
    size: 'large', // spans 2 rows
  },
  {
    src: 'https://images.unsplash.com/photo-1464349153735-7db50ed83c84?w=600&q=70',
    label: 'Birthday Balloon Arch',
    cat: 'Birthday',
    size: 'normal',
  },
  {
    src: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&q=70',
    label: 'Theme Party Setup',
    cat: 'Theme',
    size: 'normal',
  },
  {
    src: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&q=70',
    label: 'Pinterest Aesthetic',
    cat: 'Pinterest',
    size: 'wide', // spans 2 cols
  },
  {
    src: 'https://images.unsplash.com/photo-1544126592-807ade215a0b?w=600&q=70',
    label: 'Baby Shower Pastels',
    cat: 'Baby Shower',
    size: 'normal',
  },
  {
    src: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&q=70',
    label: 'Bachelorette Neon',
    cat: 'Bachelorette',
    size: 'normal',
  },
];

const CAT_COLORS: Record<string, string> = {
  Anniversary: '#e11d48',
  Birthday: '#f97316',
  Theme: '#8b5cf6',
  Pinterest: '#dc2626',
  'Baby Shower': '#ec4899',
  Bachelorette: '#7c3aed',
};

export default function CinematicGrid() {
  return (
    <section className="py-14 md:py-20 bg-[#0c0c0c]">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 border border-orange-500/30 bg-orange-500/10 text-orange-300 rounded-full px-4 py-1.5 text-xs font-bold mb-4 tracking-widest uppercase">
              📸 Real Setups
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white leading-tight">
              Setups We&apos;ve<br />
              <span style={{ background: 'linear-gradient(135deg, #ff6b00, #ff3c78)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                Created for You
              </span>
            </h2>
          </div>
          <a
            href="https://wa.me/918073552837?text=Hi! I saw your setups and want to book a decoration. Can you help?"
            target="_blank" rel="noopener noreferrer"
            className="flex-shrink-0 inline-flex items-center gap-2 font-bold text-sm px-6 py-3 rounded-full text-white border border-white/20 hover:border-orange-500/60 hover:bg-orange-500/10 transition"
          >
            💬 Get a Custom Quote →
          </a>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
          {PHOTOS.map((photo, i) => (
            <div
              key={i}
              className={`relative overflow-hidden rounded-2xl group cursor-pointer ${
                photo.size === 'large' ? 'row-span-2' : ''
              } ${
                photo.size === 'wide' ? 'col-span-2' : ''
              }`}
              style={{ aspectRatio: photo.size === 'large' ? '3/4' : photo.size === 'wide' ? '16/7' : '4/3' }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.src}
                alt={photo.label}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />

              {/* Dark overlay — reveals on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

              {/* Category badge */}
              <div className="absolute top-3 left-3">
                <span
                  className="text-[10px] md:text-xs font-bold text-white px-2.5 py-1 rounded-full"
                  style={{ background: CAT_COLORS[photo.cat] ?? '#f97316' }}
                >
                  {photo.cat}
                </span>
              </div>

              {/* Label + CTA — slides up on hover */}
              <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <p className="text-white font-bold text-sm md:text-base mb-2 drop-shadow-md">
                  {photo.label}
                </p>
                <a
                  href={`https://wa.me/918073552837?text=Hi! I love the ${photo.label} setup I saw on your website. Can you recreate this for my event?`}
                  target="_blank" rel="noopener noreferrer"
                  onClick={e => e.stopPropagation()}
                  className="inline-flex items-center gap-1.5 text-[11px] font-bold text-white bg-white/15 backdrop-blur-sm border border-white/25 px-3 py-1.5 rounded-full hover:bg-orange-500/80 hover:border-orange-500 transition-colors duration-200"
                >
                  ✨ Book This Style
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm mb-4">Every setup is fully customised to your space and budget.</p>
          <a
            href="https://wa.me/918073552837?text=Hi! Can you show me more of your decoration setups?"
            target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-bold text-sm px-7 py-3.5 rounded-full text-white transition hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #ff6b00, #ff3c78)', boxShadow: '0 8px 24px rgba(255,107,0,0.3)' }}
          >
            📸 See All Our Work →
          </a>
        </div>
      </div>
    </section>
  );
}

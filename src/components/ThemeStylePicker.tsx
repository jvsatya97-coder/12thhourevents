'use client';
import { useState } from 'react';
import Link from 'next/link';

const STYLES = [
  {
    id: 'romantic',
    label: 'Romantic',
    sub: '& Elegant',
    emoji: '🌹',
    color: 'from-rose-600 to-pink-500',
    glow: 'rgba(244,63,94,0.4)',
    bg: '#1a0810',
    img: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&q=70',
    tags: ['Rose setups', 'Fairy lights', 'Candle arch', 'Petal trails'],
    desc: 'Soft florals, warm candlelight, petals on the floor. Perfect for anniversaries and proposals.',
    link: '/anniversary-decoration',
    linkLabel: 'View Anniversary Packages',
  },
  {
    id: 'royal',
    label: 'Royal',
    sub: '& Grand',
    emoji: '👑',
    color: 'from-amber-500 to-yellow-400',
    glow: 'rgba(245,158,11,0.4)',
    bg: '#120e00',
    img: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=70',
    tags: ['Gold drapes', 'Crystal balloon arch', 'Regal florals', 'Monogram'],
    desc: 'Bold, opulent, and unforgettable. Gold accents, tall florals, and an air of grandeur.',
    link: '/birthday-decoration',
    linkLabel: 'View Birthday Packages',
  },
  {
    id: 'minimal',
    label: 'Minimal',
    sub: '& Modern',
    emoji: '🤍',
    color: 'from-slate-400 to-gray-300',
    glow: 'rgba(148,163,184,0.3)',
    bg: '#0f0f0f',
    img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=70',
    tags: ['White palette', 'Clean lines', 'Geometric arches', 'Linen textures'],
    desc: 'Less is more. White, cream and nude tones with sculptural florals and clean geometry.',
    link: '/room-decoration',
    linkLabel: 'View Room Decor',
  },
  {
    id: 'boho',
    label: 'Pinterest',
    sub: 'Aesthetic',
    emoji: '📌',
    color: 'from-orange-400 to-amber-300',
    glow: 'rgba(251,146,60,0.4)',
    bg: '#120800',
    img: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&q=70',
    tags: ['Neon signs', 'Pampas grass', 'Balloon garlands', 'Arch backdrops'],
    desc: 'Instagram-worthy setups straight from your Pinterest board. Dreamy, trendy, and photo-perfect.',
    link: '/pinterest-edition',
    linkLabel: 'View Pinterest Edition',
  },
  {
    id: 'fun',
    label: 'Fun &',
    sub: 'Colourful',
    emoji: '🎈',
    color: 'from-purple-500 to-pink-400',
    glow: 'rgba(168,85,247,0.4)',
    bg: '#0d0012',
    img: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&q=70',
    tags: ['Rainbow balloons', 'Confetti cannons', 'Bright florals', 'Kids themes'],
    desc: 'Bold, joyful and bursting with colour. Perfect for kids birthdays and high-energy celebrations.',
    link: '/birthday-decoration',
    linkLabel: 'View Birthday Packages',
  },
  {
    id: 'dark',
    label: 'Dark &',
    sub: 'Moody',
    emoji: '🖤',
    color: 'from-violet-700 to-indigo-600',
    glow: 'rgba(109,40,217,0.4)',
    bg: '#06000f',
    img: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&q=70',
    tags: ['Neon lights', 'Dark florals', 'Dramatic drapes', 'Smoke effects'],
    desc: 'Dramatic, mysterious and intensely photogenic. Black, deep purple, and electric neon.',
    link: '/bachelorette-party',
    linkLabel: 'View Bachelorette Packages',
  },
];

export default function ThemeStylePicker() {
  const [active, setActive] = useState(0);
  const current = STYLES[active];

  return (
    <section className="py-14 md:py-20 bg-[#0c0c0c] overflow-hidden relative">
      {/* Ambient glow behind active card */}
      <div
        className="absolute inset-0 pointer-events-none transition-all duration-700"
        style={{
          background: `radial-gradient(ellipse 60% 50% at 50% 50%, ${current.glow} 0%, transparent 70%)`,
          opacity: 0.25,
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 border border-white/10 bg-white/5 text-white/60 rounded-full px-4 py-1.5 text-xs font-bold mb-5 tracking-widest uppercase">
            🎨 Pick Your Aesthetic
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-3 leading-tight">
            What&apos;s Your
            <span className={`ml-3 bg-gradient-to-r ${current.color} bg-clip-text text-transparent`}>
              {current.label} {current.sub}
            </span>
            <span className="text-white"> Vibe?</span>
          </h2>
          <p className="text-gray-500 text-sm md:text-base max-w-xl mx-auto">
            Tap a style to see real setups, what&apos;s included, and browse matching packages.
          </p>
        </div>

        {/* Style selector pills */}
        <div className="flex gap-2 md:gap-3 overflow-x-auto pb-3 mb-8 justify-start md:justify-center scrollbar-hide">
          {STYLES.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setActive(i)}
              className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-full border text-sm font-semibold transition-all duration-200 ${
                active === i
                  ? 'text-white scale-105 shadow-lg'
                  : 'border-white/10 text-white/50 bg-white/5 hover:border-white/25 hover:text-white/80'
              }`}
              style={active === i ? {
                background: `linear-gradient(135deg, ${s.color.includes('rose') ? '#e11d48,#ec4899' : s.color.includes('amber') ? '#d97706,#fbbf24' : s.color.includes('slate') ? '#475569,#94a3b8' : s.color.includes('orange') ? '#ea580c,#f59e0b' : s.color.includes('purple') ? '#7c3aed,#ec4899' : '#5b21b6,#4338ca'})`,
                borderColor: 'transparent',
                boxShadow: `0 4px 20px ${s.glow}`,
              } : {}}
            >
              <span>{s.emoji}</span>
              <span>{s.label} {s.sub}</span>
            </button>
          ))}
        </div>

        {/* Main showcase — 2 column layout */}
        <div className="grid md:grid-cols-2 gap-6 md:gap-10 items-center">
          {/* Left: image */}
          <div className="relative rounded-3xl overflow-hidden aspect-[4/3] group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              key={current.id}
              src={current.img}
              alt={current.label}
              className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
            />
            {/* gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            {/* style badge */}
            <div className="absolute top-4 left-4">
              <div
                className={`inline-flex items-center gap-2 text-white text-sm font-bold px-4 py-1.5 rounded-full bg-gradient-to-r ${current.color}`}
                style={{ boxShadow: `0 4px 16px ${current.glow}` }}
              >
                {current.emoji} {current.label} {current.sub}
              </div>
            </div>
            {/* tag strip */}
            <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-1.5">
              {current.tags.map(tag => (
                <span key={tag} className="text-[11px] text-white bg-black/50 backdrop-blur-sm border border-white/20 px-2.5 py-0.5 rounded-full font-medium">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Right: description + CTA */}
          <div className="text-white">
            <div className="text-5xl mb-5">{current.emoji}</div>
            <h3 className={`text-3xl md:text-4xl font-extrabold mb-4 bg-gradient-to-r ${current.color} bg-clip-text text-transparent`}>
              {current.label} {current.sub}
            </h3>
            <p className="text-gray-300 text-base leading-relaxed mb-7">
              {current.desc}
            </p>

            {/* What's included dots */}
            <ul className="space-y-2.5 mb-8">
              {current.tags.map(tag => (
                <li key={tag} className="flex items-center gap-3 text-sm text-gray-200">
                  <span
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: `linear-gradient(135deg, ${current.glow}, ${current.glow})`, boxShadow: `0 0 6px ${current.glow}` }}
                  />
                  {tag}
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-3">
              <Link
                href={current.link}
                className={`inline-flex items-center gap-2 font-bold text-sm px-6 py-3 rounded-full text-white bg-gradient-to-r ${current.color} hover:opacity-90 transition`}
                style={{ boxShadow: `0 6px 20px ${current.glow}` }}
              >
                {current.linkLabel} →
              </Link>
              <a
                href={`https://wa.me/918073552837?text=Hi! I love the ${current.label} ${current.sub} style. Can you create something like this for my event?`}
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-semibold text-sm px-6 py-3 rounded-full text-white/70 border border-white/15 hover:border-white/40 hover:text-white transition"
              >
                💬 Ask Us to Recreate
              </a>
            </div>
          </div>
        </div>

        {/* Thumbnail strip */}
        <div className="flex gap-3 mt-8 overflow-x-auto pb-2 scrollbar-hide">
          {STYLES.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setActive(i)}
              className={`flex-shrink-0 relative rounded-xl overflow-hidden transition-all duration-200 ${
                active === i ? 'ring-2 scale-105' : 'opacity-50 hover:opacity-80'
              }`}
              style={{
                width: 72,
                height: 56,
                outline: active === i ? `2px solid ${s.glow}` : 'none',
                outlineOffset: '2px',
              }}
              aria-label={s.label}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={s.img} alt={s.label} className="w-full h-full object-cover" />
              <div className="absolute inset-0 flex items-end justify-start p-1">
                <span className="text-sm">{s.emoji}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <style>{`.scrollbar-hide::-webkit-scrollbar{display:none}.scrollbar-hide{-ms-overflow-style:none;scrollbar-width:none}`}</style>
    </section>
  );
}

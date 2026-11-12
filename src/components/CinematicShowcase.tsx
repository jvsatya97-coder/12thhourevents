'use client';
import { useState } from 'react';
import Link from 'next/link';

// Cinematic full-bleed showcase — premium foreign brand style
// Large atmospheric imagery, text-overlay layout, hover zoom

const SHOWCASES = [
  {
    id: 'romantic',
    title: 'Romance & Elegance',
    sub: 'Anniversaries · Proposals · Date Night',
    desc: 'Candles, petals, fairy lights and florals — crafted to make your partner feel like the only person in the world.',
    cta: 'View Romantic Setups',
    ctaHref: '/anniversary-decoration',
    img: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=900&q=75',
    badge: '🌹 Most Popular',
    accent: 'rgba(244,63,94,0.7)',
    tag: 'From ₹2,999',
  },
  {
    id: 'birthday',
    title: 'Birthday Dreams',
    sub: 'Kids · Adults · Milestone Birthdays',
    desc: 'From unicorn wonderlands to royal gold themes — we bring every birthday vision to life, right on time.',
    cta: 'View Birthday Packages',
    ctaHref: '/birthday-decoration',
    img: 'https://images.unsplash.com/photo-1464349153735-7db50ed83c84?w=900&q=75',
    badge: '🎂 Top Booked',
    accent: 'rgba(249,115,22,0.7)',
    tag: 'From ₹1,999',
  },
  {
    id: 'bachelorette',
    title: 'Bachelorette & Parties',
    sub: 'Bachelorette · Girls Night · Kitty Party',
    desc: 'Bold, glam, and reel-worthy. Neon signs, balloon walls, and setups your whole squad will talk about.',
    cta: 'View Party Setups',
    ctaHref: '/bachelorette-party',
    img: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=900&q=75',
    badge: '👰 Trending',
    accent: 'rgba(168,85,247,0.7)',
    tag: 'From ₹3,499',
  },
];

export default function CinematicShowcase() {
  const [active, setActive] = useState(0);
  const current = SHOWCASES[active];

  return (
    <section className="relative overflow-hidden" style={{ background: '#050505' }}>
      {/* Large cinematic image area */}
      <div className="relative w-full" style={{ height: 'clamp(420px, 65vw, 680px)' }}>
        {SHOWCASES.map((s, i) => (
          <div
            key={s.id}
            className="absolute inset-0 transition-opacity duration-700"
            style={{ opacity: active === i ? 1 : 0 }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={s.img}
              alt={s.title}
              className="w-full h-full object-cover transition-transform duration-[8000ms]"
              style={{ transform: active === i ? 'scale(1.04)' : 'scale(1)' }}
            />
            {/* Cinematic vignette overlay */}
            <div className="absolute inset-0"
              style={{ background: 'linear-gradient(to right, rgba(5,5,5,0.9) 0%, rgba(5,5,5,0.5) 50%, rgba(5,5,5,0.2) 100%)' }} />
            <div className="absolute inset-0"
              style={{ background: 'linear-gradient(to top, rgba(5,5,5,0.85) 0%, transparent 50%)' }} />
          </div>
        ))}

        {/* Content overlay */}
        <div className="absolute inset-0 flex items-end md:items-center">
          <div className="max-w-7xl mx-auto px-4 w-full pb-8 md:pb-0">
            <div className="max-w-xl">
              {/* Badge */}
              <div
                key={current.id + '-badge'}
                className="inline-flex items-center gap-2 text-white text-xs font-bold px-4 py-1.5 rounded-full mb-4"
                style={{ background: current.accent, backdropFilter: 'blur(8px)', animation: 'fadeSlideUp 0.5s ease' }}
              >
                {current.badge}
              </div>

              {/* Title */}
              <h2
                key={current.id + '-title'}
                className="text-3xl md:text-6xl font-black text-white leading-[1.05] mb-3 tracking-tight"
                style={{ animation: 'fadeSlideUp 0.5s ease 0.05s both' }}
              >
                {current.title}
              </h2>

              {/* Sub */}
              <p
                key={current.id + '-sub'}
                className="text-white/60 text-sm font-semibold tracking-widest uppercase mb-4"
                style={{ animation: 'fadeSlideUp 0.5s ease 0.1s both' }}
              >
                {current.sub}
              </p>

              {/* Desc */}
              <p
                key={current.id + '-desc'}
                className="text-gray-300 text-base leading-relaxed mb-6 max-w-md"
                style={{ animation: 'fadeSlideUp 0.5s ease 0.15s both' }}
              >
                {current.desc}
              </p>

              {/* CTAs */}
              <div
                key={current.id + '-cta'}
                className="flex flex-wrap gap-3"
                style={{ animation: 'fadeSlideUp 0.5s ease 0.2s both' }}
              >
                <Link
                  href={current.ctaHref}
                  className="inline-flex items-center gap-2 font-bold text-sm px-6 py-3 rounded-full text-white transition hover:opacity-90"
                  style={{ background: current.accent, boxShadow: `0 8px 24px ${current.accent.replace('0.7', '0.4')}` }}
                >
                  {current.cta} →
                </Link>
                <span className="inline-flex items-center text-sm font-semibold text-white/50 bg-white/5 border border-white/10 px-5 py-3 rounded-full">
                  {current.tag}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Slide indicators — right side desktop, bottom mobile */}
        <div className="absolute right-6 top-1/2 -translate-y-1/2 hidden md:flex flex-col gap-2.5">
          {SHOWCASES.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setActive(i)}
              className="transition-all duration-300 rounded-full overflow-hidden"
              style={{
                width: active === i ? 48 : 36,
                height: active === i ? 60 : 36,
                opacity: active === i ? 1 : 0.4,
                outline: active === i ? '2px solid rgba(255,255,255,0.4)' : 'none',
                outlineOffset: 2,
              }}
              aria-label={s.title}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={s.img} alt={s.title} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>

      {/* Bottom tab strip — mobile + desktop */}
      <div className="flex border-t border-white/[0.06]">
        {SHOWCASES.map((s, i) => (
          <button
            key={s.id}
            onClick={() => setActive(i)}
            className="flex-1 py-4 px-3 text-center transition-all duration-200 relative overflow-hidden group"
            style={{ background: active === i ? 'rgba(255,255,255,0.05)' : 'transparent' }}
          >
            {/* active accent line */}
            {active === i && (
              <div className="absolute top-0 left-0 right-0 h-0.5"
                style={{ background: s.accent }} />
            )}
            <div className={`text-sm font-bold transition-colors ${active === i ? 'text-white' : 'text-white/40 group-hover:text-white/70'}`}>
              {s.title}
            </div>
            <div className={`text-xs mt-0.5 transition-colors ${active === i ? 'text-white/60' : 'text-white/25 group-hover:text-white/40'}`}>
              {s.tag}
            </div>
          </button>
        ))}
      </div>

      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}

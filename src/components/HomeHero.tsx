'use client';
import Link from 'next/link';
import { useCity } from '@/context/CityContext';
import { useState } from 'react';
import { SERVICES } from '@/lib/config';
import PackageFinder from '@/components/PackageFinder';
import SmartSearch from '@/components/SmartSearch';

export default function HomeHero() {
  const { cityName } = useCity();
  const [finderOpen, setFinderOpen] = useState(false);

  return (
    <section className="relative text-white overflow-hidden" style={{ minHeight: '520px' }}>
      {/* Background photo — use <img> tag so browser can prioritise LCP */}
      <div className="absolute inset-0 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=1400&q=70"
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover object-center"
          fetchPriority="high"
          decoding="async"
        />
      </div>
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/55 to-black/80" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-14 md:py-24 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur border border-white/20 rounded-full px-4 py-1.5 text-sm mb-5 font-medium">
          🌟 {cityName}&apos;s Most Trusted Party Decorators
        </div>

        <h1 className="text-3xl md:text-6xl font-extrabold mb-4 leading-tight drop-shadow-lg">
          Make Every Moment<br />
          <span className="text-orange-400">Unforgettable ✨</span>
        </h1>

        <p className="text-base md:text-lg text-gray-200 mb-7 max-w-2xl mx-auto leading-relaxed">
          Premium birthday, anniversary &amp; party decorations in <strong className="text-white">{cityName}</strong>.
          Same-day setup. Book in 2 minutes on WhatsApp!
        </p>

        {/* Smart Search with live suggestions */}
        <div className="max-w-2xl mx-auto mb-5">
          <SmartSearch placeholder="Search birthday, anniversary, theme decoration..." />
        </div>

        {/* Category chips */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {SERVICES.slice(0, 6).map(s => (
            <Link key={s.slug} href={`/${s.slug}`}
              className="text-xs md:text-sm bg-white/15 hover:bg-white/25 border border-white/25 text-white rounded-full px-3 py-1.5 transition font-medium backdrop-blur-sm">
              {s.emoji} {s.name}
            </Link>
          ))}
        </div>

        {/* HERO CTA — Find My Package (giant, glowing) */}
        <div className="mb-5">
          <button
            onClick={() => setFinderOpen(true)}
            className="finder-btn group relative w-full max-w-lg mx-auto flex items-center justify-center gap-3 py-5 px-8 rounded-2xl font-extrabold text-white text-xl md:text-2xl shadow-2xl overflow-hidden"
          >
            {/* animated shimmer layer */}
            <span className="finder-shimmer" aria-hidden="true" />
            <span className="text-3xl group-hover:scale-125 transition-transform duration-300">🎯</span>
            <span className="relative z-10 drop-shadow">Find My Perfect Package</span>
            <span className="relative z-10 text-2xl group-hover:translate-x-1 transition-transform duration-200">→</span>
          </button>
          <p className="text-white/60 text-xs mt-2 text-center">3 quick questions · instant recommendations</p>
        </div>

        {/* Secondary CTA */}
        <div className="flex flex-wrap gap-3 justify-center mb-8">
          <a href="https://wa.me/918073552837?text=Hi! I want to book a decoration. Can you help?" target="_blank" rel="noopener noreferrer"
            className="btn-wa text-base px-7 py-3 shadow-lg shadow-orange-800/30">
            💬 Free Quote on WhatsApp
          </a>
          <Link href="/birthday-decoration"
            className="border border-white/30 text-white/80 px-7 py-3 rounded-full font-medium hover:bg-white/10 transition text-sm backdrop-blur-sm">
            Browse All Packages →
          </Link>
        </div>
        {finderOpen && <PackageFinder onClose={() => setFinderOpen(false)} />}

        <style>{`
          .finder-btn {
            background: linear-gradient(135deg, #ff6b00 0%, #ff3c78 50%, #ff9800 100%);
            background-size: 200% 200%;
            animation: finder-gradient 3s ease infinite;
            box-shadow: 0 0 32px rgba(255,80,30,0.55), 0 4px 20px rgba(0,0,0,0.4);
            border: 2px solid rgba(255,255,255,0.25);
          }
          .finder-btn:hover {
            box-shadow: 0 0 48px rgba(255,80,30,0.75), 0 8px 32px rgba(0,0,0,0.4);
            transform: translateY(-2px) scale(1.01);
            transition: all 0.2s;
          }
          .finder-shimmer {
            position: absolute; inset: 0;
            background: linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.18) 50%, transparent 70%);
            background-size: 200% 100%;
            animation: shimmer 2.4s linear infinite;
          }
          @keyframes finder-gradient {
            0%,100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
        `}</style>

        {/* Trust strip */}
        <div className="flex flex-wrap justify-center gap-3 md:gap-6 text-sm text-white/80">
          <span className="flex items-center gap-1.5"><span className="text-orange-400">✅</span> 5000+ Events Done</span>
          <span className="flex items-center gap-1.5"><span className="text-yellow-400">⭐</span> 4.9 Star Rating</span>
          <span className="flex items-center gap-1.5"><span className="text-orange-400">⚡</span> Same Day Available</span>
          <span className="flex items-center gap-1.5"><span className="text-amber-400">🌍</span> Pan India</span>
        </div>
      </div>
    </section>
  );
}

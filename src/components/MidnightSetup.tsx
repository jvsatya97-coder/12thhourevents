'use client';
import { useState } from 'react';
import Link from 'next/link';

const SURPRISE_TYPES = [
  {
    emoji: '🌙',
    title: 'Midnight Room Setup',
    desc: 'Your partner walks into a completely transformed room at midnight. Fairy lights, roses, candles — all set while they sleep.',
    tags: ['Anniversaries', 'Proposals', 'Birthdays'],
    popular: true,
  },
  {
    emoji: '🌅',
    title: 'Early Morning Surprise',
    desc: 'Wake them up to a decorated space. We set up at 5–6 AM so everything is perfect before they open their eyes.',
    tags: ['Birthdays', 'Mother\'s Day', 'Homecoming'],
    popular: false,
  },
  {
    emoji: '🏨',
    title: 'Hotel Room Decoration',
    desc: 'Coordinate directly with the hotel. We enter, transform the room, and leave before you arrive. Total secrecy guaranteed.',
    tags: ['Honeymoon', 'Anniversary Trip', 'Proposal'],
    popular: true,
  },
  {
    emoji: '🎁',
    title: 'Office Surprise',
    desc: 'Decorate their workspace before they arrive. The whole team joins the moment — unforgettable birthday or farewell setup.',
    tags: ['Work Birthday', 'Farewell', 'Promotion'],
    popular: false,
  },
];

const STEPS = [
  { icon: '📲', text: 'WhatsApp us with the date & location' },
  { icon: '🤫', text: 'We plan in complete secrecy' },
  { icon: '🌙', text: 'Team arrives at your chosen hour' },
  { icon: '✨', text: 'You arrive to pure magic' },
];

export default function MidnightSetup() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section className="relative overflow-hidden py-16 md:py-24">
      {/* Deep dark background */}
      <div className="absolute inset-0 bg-[#0a0a1a]" />

      {/* Starfield */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
        {[...Array(60)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: `${(i % 3) + 1}px`,
              height: `${(i % 3) + 1}px`,
              left: `${(i * 17.3) % 100}%`,
              top: `${(i * 11.7) % 100}%`,
              opacity: 0.1 + (i % 5) * 0.12,
              animation: `twinkle ${2 + (i % 4)}s ease-in-out ${(i % 6) * 0.4}s infinite alternate`,
            }}
          />
        ))}
      </div>

      {/* Warm glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full opacity-10 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #ff9800, transparent)' }} />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full opacity-8 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #ff6b00, transparent)' }} />

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 border border-orange-500/30 bg-orange-500/10 text-orange-300 rounded-full px-4 py-1.5 text-xs font-bold mb-5 tracking-widest uppercase">
            🌙 Secret Setups
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
            While They Sleep,<br />
            <span style={{ background: 'linear-gradient(135deg, #ff9800, #ff6b00, #ff3c78)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              We Create Magic ✨
            </span>
          </h2>
          <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            The most memorable surprises happen when they least expect it. Our team works in the quiet hours so you can deliver the perfect moment.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
          {SURPRISE_TYPES.map((type, i) => (
            <div
              key={i}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              className="relative rounded-2xl border border-white/8 p-5 cursor-default transition-all duration-300"
              style={{
                background: hovered === i
                  ? 'linear-gradient(135deg, rgba(255,107,0,0.15), rgba(255,60,120,0.1))'
                  : 'rgba(255,255,255,0.03)',
                borderColor: hovered === i ? 'rgba(255,107,0,0.4)' : 'rgba(255,255,255,0.08)',
                transform: hovered === i ? 'translateY(-4px)' : 'none',
                boxShadow: hovered === i ? '0 20px 40px rgba(255,107,0,0.15)' : 'none',
              }}
            >
              {type.popular && (
                <div className="absolute -top-2.5 left-4 text-[10px] font-extrabold bg-gradient-to-r from-orange-500 to-pink-500 text-white px-3 py-0.5 rounded-full tracking-wide">
                  POPULAR
                </div>
              )}
              <div className="text-3xl mb-3">{type.emoji}</div>
              <h3 className="text-white font-bold text-base mb-2 leading-snug">{type.title}</h3>
              <p className="text-gray-400 text-xs leading-relaxed mb-4">{type.desc}</p>
              <div className="flex flex-wrap gap-1.5">
                {type.tags.map(tag => (
                  <span key={tag} className="text-[10px] text-orange-300/80 border border-orange-500/25 px-2 py-0.5 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* How it works — horizontal steps */}
        <div className="border border-white/8 rounded-3xl p-6 md:p-8 mb-10"
          style={{ background: 'rgba(255,255,255,0.03)' }}>
          <div className="text-center mb-7">
            <span className="text-xs font-bold tracking-widest text-orange-400 uppercase">How the secret stays secret</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-0 relative">
            {/* Connector line (desktop) */}
            <div className="hidden md:block absolute top-5 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-orange-500/30 to-transparent" />
            {STEPS.map((s, i) => (
              <div key={i} className="flex flex-col items-center text-center gap-2 relative z-10">
                <div className="w-11 h-11 rounded-full flex items-center justify-center text-xl mb-1"
                  style={{ background: 'rgba(255,107,0,0.15)', border: '1px solid rgba(255,107,0,0.3)' }}>
                  {s.icon}
                </div>
                <span className="text-xs text-gray-300 leading-snug max-w-[100px]">{s.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <p className="text-gray-500 text-sm mb-5">
            🔒 100% confidential · Available pan India · Same-night possible
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <a
              href="https://wa.me/918073552837?text=Hi! I want to plan a secret midnight/surprise setup. Can you help me plan it?"
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 font-bold text-sm px-7 py-3.5 rounded-full text-white shadow-lg transition hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #ff6b00, #ff3c78)', boxShadow: '0 8px 24px rgba(255,107,0,0.35)' }}
            >
              🌙 Plan a Secret Setup
            </a>
            <Link
              href="/room-decoration"
              className="inline-flex items-center gap-2 font-semibold text-sm px-7 py-3.5 rounded-full text-white/70 border border-white/15 hover:border-orange-500/50 hover:text-white transition"
            >
              Browse Room Decor →
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes twinkle {
          from { opacity: 0.05; transform: scale(0.8); }
          to   { opacity: 0.6;  transform: scale(1.2); }
        }
      `}</style>
    </section>
  );
}

'use client';

// Premium testimonials — inspired by CherishX and foreign event brands
// Features: Google rating badge, photo-avatar initials, service tags,
// metric highlight, verified badge, smooth horizontal scroll

const REVIEWS = [
  {
    name: 'Priya S.', city: 'Delhi', stars: 5,
    text: 'Absolutely loved the birthday decoration! Team set it up in an hour and the photos came out stunning. Will book again!',
    service: 'Birthday Decoration', date: 'Oct 2024',
    metric: '1 hour setup',
    color: 'from-rose-500 to-pink-500',
    bg: 'rgba(244,63,94,0.08)',
  },
  {
    name: 'Rahul M.', city: 'Gurgaon', stars: 5,
    text: 'Surprise room setup for my wife — way beyond what I imagined. Quick WhatsApp response, everything went perfectly.',
    service: 'Room Decoration', date: 'Sep 2024',
    metric: 'Under ₹3500',
    color: 'from-orange-500 to-amber-500',
    bg: 'rgba(249,115,22,0.08)',
  },
  {
    name: 'Sneha K.', city: 'Noida', stars: 5,
    text: 'Best anniversary decoration I have seen! Balloons, flowers, fairy lights — it was like a fairy tale. Super affordable.',
    service: 'Anniversary Decoration', date: 'Aug 2024',
    metric: 'Dream setup ✨',
    color: 'from-purple-500 to-violet-500',
    bg: 'rgba(168,85,247,0.08)',
  },
  {
    name: 'Amit T.', city: 'Delhi', stars: 5,
    text: 'Kids loved the unicorn theme! Delivered on time, even helped clean up. 100% recommend 12th Hour Events.',
    service: 'Kids Birthday', date: 'Oct 2024',
    metric: 'On time, every time',
    color: 'from-sky-500 to-blue-500',
    bg: 'rgba(14,165,233,0.08)',
  },
  {
    name: 'Kavya R.', city: 'Bangalore', stars: 5,
    text: 'Even in Bangalore they delivered perfectly. Online booking was smooth, team was punctual and decoration was gorgeous!',
    service: 'Baby Shower', date: 'Sep 2024',
    metric: 'Pan India delivery',
    color: 'from-green-500 to-teal-500',
    bg: 'rgba(16,185,129,0.08)',
  },
  {
    name: 'Arjun P.', city: 'Mumbai', stars: 5,
    text: 'Bachelorette setup was beyond expectations. My friend was completely surprised. Very creative team!',
    service: 'Bachelorette Party', date: 'Aug 2024',
    metric: 'Viral reel ready 📸',
    color: 'from-fuchsia-500 to-pink-600',
    bg: 'rgba(217,70,239,0.08)',
  },
];

export default function PremiumTestimonials() {
  return (
    <section className="py-14 md:py-20 bg-[#080808] overflow-hidden relative">
      {/* Subtle radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none opacity-20"
        style={{ background: 'radial-gradient(ellipse at 50% 0%, #ff6b00 0%, transparent 70%)' }} />

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 border border-orange-500/20 bg-orange-500/10 text-orange-400 rounded-full px-4 py-1.5 text-xs font-bold mb-4 tracking-widest uppercase">
              ⭐ Real Reviews
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white leading-tight">
              Loved by{' '}
              <span style={{ background: 'linear-gradient(135deg, #ff9800, #ff6b00)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                5000+
              </span>{' '}
              Families
            </h2>
          </div>

          {/* Google Rating badge */}
          <div className="flex-shrink-0 inline-flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl px-5 py-4">
            {/* Google G icon */}
            <div className="w-10 h-10 rounded-full flex items-center justify-center font-extrabold text-lg flex-shrink-0"
              style={{ background: 'conic-gradient(#4285f4 0deg 90deg, #34a853 90deg 180deg, #fbbc05 180deg 270deg, #ea4335 270deg 360deg)' }}>
              <span className="text-white text-xs font-black">G</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-2xl font-extrabold text-white">4.9</span>
                <div className="text-yellow-400 text-sm leading-none">★★★★★</div>
              </div>
              <div className="text-xs text-gray-400">5,000+ Google reviews</div>
            </div>
          </div>
        </div>

        {/* Cards — horizontal scroll */}
        <div
          className="flex gap-4 overflow-x-auto pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {REVIEWS.map((r, i) => (
            <div
              key={i}
              className="flex-shrink-0 rounded-2xl border border-white/8 p-5 flex flex-col gap-3 relative overflow-hidden transition-all duration-300 hover:-translate-y-1"
              style={{
                width: 290,
                background: r.bg,
                borderColor: 'rgba(255,255,255,0.08)',
              }}
            >
              {/* Gradient accent line at top */}
              <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${r.color}`} />

              {/* Stars */}
              <div className="flex items-center gap-1">
                {Array.from({ length: r.stars }).map((_, j) => (
                  <span key={j} className="text-yellow-400 text-sm">★</span>
                ))}
                {/* Verified badge */}
                <span className="ml-auto text-[10px] text-green-400 border border-green-400/30 bg-green-400/10 px-2 py-0.5 rounded-full font-semibold">
                  ✓ Verified
                </span>
              </div>

              {/* Review text */}
              <p className="text-gray-200 text-sm leading-relaxed flex-1">
                &ldquo;{r.text}&rdquo;
              </p>

              {/* Metric highlight */}
              <div className={`text-xs font-bold px-3 py-1.5 rounded-full self-start bg-gradient-to-r ${r.color} text-white`}>
                {r.metric}
              </div>

              {/* Footer */}
              <div className="flex items-center gap-2.5 pt-1 border-t border-white/[0.06]">
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 bg-gradient-to-br ${r.color}`}
                >
                  {r.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-white text-sm font-semibold truncate">{r.name}</div>
                  <div className="text-gray-500 text-xs">{r.city} · {r.date}</div>
                </div>
                <div className="text-[10px] text-orange-400/80 border border-orange-500/20 px-2 py-0.5 rounded-full whitespace-nowrap">
                  {r.service}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-8">
          <a
            href="https://wa.me/918073552837?text=Hi! I saw your reviews and want to book a decoration. Can you help?"
            target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 font-bold text-sm px-7 py-3.5 rounded-full text-white transition hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #ff6b00, #ff9800)', boxShadow: '0 8px 24px rgba(255,107,0,0.3)' }}
          >
            💬 Join 5000+ Happy Families → Book on WhatsApp
          </a>
        </div>
      </div>

      <style>{`.no-scrollbar::-webkit-scrollbar{display:none}`}</style>
    </section>
  );
}

'use client';

// Animated trust bar — partner logos + press mentions
// Loops endlessly left; no library required

const PARTNERS = [
  { name: 'Taj Hotels',         emoji: '🏨', type: 'partner' },
  { name: 'OYO Rooms',          emoji: '🏩', type: 'partner' },
  { name: 'Hilton',             emoji: '🏨', type: 'partner' },
  { name: 'Lemon Tree',         emoji: '🍋', type: 'partner' },
  { name: 'Treebo Hotels',      emoji: '🌳', type: 'partner' },
  { name: 'FabHotels',          emoji: '🌟', type: 'partner' },
  { name: 'As seen on Instagram', emoji: '📸', type: 'press' },
  { name: '5000+ Setups Done',  emoji: '🎉', type: 'stat' },
  { name: 'Pan India',          emoji: '🇮🇳', type: 'stat' },
  { name: 'Same-Day Available', emoji: '⚡', type: 'stat' },
  { name: 'Taj Hotels',         emoji: '🏨', type: 'partner' },
  { name: 'OYO Rooms',          emoji: '🏩', type: 'partner' },
  { name: 'Hilton',             emoji: '🏨', type: 'partner' },
  { name: 'Lemon Tree',         emoji: '🍋', type: 'partner' },
  { name: 'Treebo Hotels',      emoji: '🌳', type: 'partner' },
  { name: 'FabHotels',          emoji: '🌟', type: 'partner' },
  { name: 'As seen on Instagram', emoji: '📸', type: 'press' },
  { name: '5000+ Setups Done',  emoji: '🎉', type: 'stat' },
  { name: 'Pan India',          emoji: '🇮🇳', type: 'stat' },
  { name: 'Same-Day Available', emoji: '⚡', type: 'stat' },
];

export default function TrustBar() {
  return (
    <div className="bg-[#0d0d0d] border-y border-white/[0.06] py-3 overflow-hidden relative">
      {/* fade masks */}
      <div className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to right, #0d0d0d, transparent)' }} />
      <div className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to left, #0d0d0d, transparent)' }} />

      {/* Scrolling strip */}
      <div
        className="flex gap-5 items-center whitespace-nowrap"
        style={{ animation: 'trustScroll 32s linear infinite', width: 'max-content' }}
      >
        {PARTNERS.map((p, i) => (
          <div
            key={i}
            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-sm font-semibold flex-shrink-0 ${
              p.type === 'partner'
                ? 'border-white/10 bg-white/5 text-white/60'
                : p.type === 'press'
                ? 'border-orange-500/20 bg-orange-500/10 text-orange-400/80'
                : 'border-green-500/20 bg-green-500/10 text-green-400/80'
            }`}
          >
            <span className="text-base">{p.emoji}</span>
            <span className="tracking-wide text-xs">{p.name}</span>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes trustScroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}

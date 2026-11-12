'use client';
import { useCity } from '@/context/CityContext';
import { useState } from 'react';

// City-specific deal configs
const CITY_DEALS: Record<string, { deal: string; tag: string; color: string; emoji: string }> = {
  delhi:     { deal: 'FREE fairy-light upgrade on orders ₹3,000+', tag: 'Delhi NCR Special', color: 'from-purple-600 to-indigo-600', emoji: '🏛️' },
  noida:     { deal: 'Extra balloon arch FREE for first 5 bookings today', tag: 'Noida Flash Deal', color: 'from-blue-600 to-cyan-500', emoji: '🎈' },
  gurgaon:   { deal: '10% off all anniversary packages this week', tag: 'Gurgaon Special', color: 'from-rose-600 to-pink-500', emoji: '💑' },
  faridabad: { deal: 'FREE custom banner worth ₹500 with every booking', tag: 'Faridabad Offer', color: 'from-green-600 to-teal-500', emoji: '🎀' },
  ghaziabad: { deal: 'Book same-day — get 2 extra balloon bouquets FREE', tag: 'Ghaziabad Today', color: 'from-orange-600 to-amber-500', emoji: '⚡' },
  bangalore: { deal: 'Free photo backdrop on birthday packages ₹4,000+', tag: 'Bangalore Special', color: 'from-violet-600 to-purple-500', emoji: '🌟' },
  mumbai:    { deal: '5% cashback on WhatsApp bookings today only', tag: 'Mumbai Exclusive', color: 'from-red-600 to-orange-500', emoji: '🌊' },
  hyderabad: { deal: 'FREE personalised welcome board with every booking', tag: 'Hyderabad Deal', color: 'from-teal-600 to-green-500', emoji: '🎊' },
  pune:      { deal: 'Complimentary scented candle setup on orders ₹2,500+', tag: 'Pune Special', color: 'from-pink-600 to-rose-500', emoji: '🕯️' },
  chennai:   { deal: 'Book 3 days ahead — get ₹300 off any package', tag: 'Chennai Promo', color: 'from-amber-600 to-yellow-500', emoji: '🌺' },
  kolkata:   { deal: 'Free glitter balloon upgrade on all birthday packages', tag: 'Kolkata Offer', color: 'from-indigo-600 to-blue-500', emoji: '🎭' },
  lucknow:   { deal: 'Festive season: extra 8% off on theme decorations', tag: 'Lucknow Deal', color: 'from-emerald-600 to-teal-500', emoji: '🌙' },
  ahmedabad: { deal: 'FREE video coverage worth ₹400 on orders ₹5,000+', tag: 'Ahmedabad Special', color: 'from-orange-600 to-red-500', emoji: '🎥' },
  thane:     { deal: 'Same-day slots open — extra floral ring FREE', tag: 'Thane Flash', color: 'from-purple-600 to-pink-500', emoji: '🌸' },
};

const DEFAULT_DEAL = { deal: 'Free balloon bouquet on orders ₹2,500+', tag: 'Pan India Offer', color: 'from-orange-600 to-pink-600', emoji: '🎁' };

export default function CityDealsBanner() {
  const { city, cityName } = useCity();
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const info = CITY_DEALS[city] || DEFAULT_DEAL;

  const waText = `Hi! I'm in ${cityName} and saw the offer: "${info.deal}". I want to claim this deal!`;

  return (
    <div className={`relative bg-gradient-to-r ${info.color} text-white overflow-hidden`}>
      {/* Animated confetti dots background */}
      <div className="absolute inset-0 opacity-10" aria-hidden>
        {[...Array(12)].map((_, i) => (
          <div key={i}
            className="absolute w-2 h-2 rounded-full bg-white"
            style={{
              left: `${(i * 8.5) % 100}%`,
              top: `${(i * 15 + 10) % 100}%`,
              animation: `confetti-float ${2 + (i % 3)}s ease-in-out ${i * 0.2}s infinite alternate`,
            }} />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 py-3 md:py-3.5 relative">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
            {/* City emoji */}
            <div className="text-xl md:text-2xl flex-shrink-0">{info.emoji}</div>

            <div className="min-w-0">
              {/* Tag pill */}
              <div className="inline-flex items-center gap-1 bg-white/25 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-full mb-0.5">
                🎯 {info.tag}
              </div>
              <div className="text-sm md:text-base font-bold leading-tight truncate">
                {info.deal}
              </div>
            </div>
          </div>

          {/* CTA + dismiss */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <a
              href={`https://wa.me/918073552837?text=${encodeURIComponent(waText)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs md:text-sm font-bold bg-white px-3 md:px-4 py-1.5 md:py-2 rounded-full text-orange-600 hover:bg-orange-50 transition shadow whitespace-nowrap"
            >
              Claim →
            </a>
            <button
              onClick={() => setDismissed(true)}
              className="text-white/70 hover:text-white w-6 h-6 flex items-center justify-center rounded-full hover:bg-white/20 transition text-sm flex-shrink-0"
              aria-label="Dismiss"
            >
              ✕
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes confetti-float {
          from { transform: translateY(0) scale(1); }
          to { transform: translateY(-6px) scale(1.3); }
        }
      `}</style>
    </div>
  );
}

'use client';
import { useState } from 'react';

const TRANSFORMATIONS = [
  {
    label: 'Birthday Surprise',
    before: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=70',
    after: 'https://images.unsplash.com/photo-1464349153735-7db50ed83c84?w=600&q=70',
    city: 'Delhi',
    tag: '🎂 Birthday',
  },
  {
    label: 'Anniversary Night',
    before: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=70',
    after: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&q=70',
    city: 'Gurgaon',
    tag: '💑 Anniversary',
  },
  {
    label: 'Baby Shower Setup',
    before: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=70',
    after: 'https://images.unsplash.com/photo-1544126592-807ade215a0b?w=600&q=70',
    city: 'Noida',
    tag: '🍼 Baby Shower',
  },
  {
    label: 'Bachelorette Glam',
    before: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=70',
    after: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&q=70',
    city: 'Mumbai',
    tag: '👰 Bachelorette',
  },
];

function SliderCard({ item }: { item: typeof TRANSFORMATIONS[0] }) {
  const [pos, setPos] = useState(50); // 0–100 percent
  const [dragging, setDragging] = useState(false);

  const update = (clientX: number, rect: DOMRect) => {
    const p = Math.max(5, Math.min(95, ((clientX - rect.left) / rect.width) * 100));
    setPos(p);
  };

  return (
    <div className="rounded-2xl overflow-hidden shadow-lg relative select-none bg-black"
      style={{ aspectRatio: '4/3' }}
      onMouseMove={e => dragging && update(e.clientX, e.currentTarget.getBoundingClientRect())}
      onMouseUp={() => setDragging(false)}
      onMouseLeave={() => setDragging(false)}
      onTouchMove={e => {
        if (!dragging) return;
        update(e.touches[0].clientX, e.currentTarget.getBoundingClientRect());
      }}
      onTouchEnd={() => setDragging(false)}
    >
      {/* After (full width underneath) */}
      <img src={item.after} alt="After decoration" className="absolute inset-0 w-full h-full object-cover" draggable={false} />

      {/* Before (clipped left portion) */}
      <div className="absolute inset-0 overflow-hidden" style={{ width: `${pos}%` }}>
        <img src={item.before} alt="Before decoration" className="absolute inset-0 w-full h-full object-cover"
          style={{ width: `${10000 / pos}%`, maxWidth: 'none' }} draggable={false} />
      </div>

      {/* Divider line */}
      <div className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_8px_2px_rgba(0,0,0,0.5)] z-10"
        style={{ left: `${pos}%` }} />

      {/* Handle */}
      <div
        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 bg-white rounded-full shadow-xl flex items-center justify-center cursor-ew-resize z-20 border-2 border-orange-400"
        style={{ left: `${pos}%` }}
        onMouseDown={() => setDragging(true)}
        onTouchStart={() => setDragging(true)}
      >
        <svg width="18" height="12" viewBox="0 0 18 12" fill="none">
          <path d="M5 6H1M1 6L4 3M1 6L4 9" stroke="#ff6b00" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M13 6H17M17 6L14 3M17 6L14 9" stroke="#ff6b00" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      {/* Labels */}
      <div className="absolute top-3 left-3 bg-black/60 text-white text-xs font-bold px-2 py-1 rounded-full backdrop-blur-sm z-10">BEFORE</div>
      <div className="absolute top-3 right-3 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10">AFTER ✨</div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-4 py-3 z-10">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-white font-bold text-sm">{item.label}</div>
            <div className="text-white/70 text-xs">📍 {item.city}</div>
          </div>
          <div className="bg-white/20 backdrop-blur text-white text-xs font-semibold px-2.5 py-1 rounded-full border border-white/25">{item.tag}</div>
        </div>
      </div>

      {/* Drag hint (fades out) */}
      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none opacity-70">
        <div className="text-white/50 text-xs font-medium bg-black/30 px-3 py-1.5 rounded-full backdrop-blur-sm">← drag to compare →</div>
      </div>
    </div>
  );
}

export default function TransformationGallery() {
  return (
    <section className="py-12 md:py-16 bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-orange-500/20 border border-orange-500/30 text-orange-400 rounded-full px-4 py-1.5 text-sm font-semibold mb-4">
            ✨ Real Transformations
          </div>
          <h2 className="text-2xl md:text-4xl font-extrabold text-white mb-3">See the <span style={{ background: 'linear-gradient(135deg,#ff6b00,#ff9800)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Magic</span> We Create</h2>
          <p className="text-gray-400 text-sm md:text-base">Drag the slider to see the before &amp; after transformation</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {TRANSFORMATIONS.map(item => (
            <SliderCard key={item.label} item={item} />
          ))}
        </div>
        <div className="text-center mt-8">
          <a href="https://wa.me/918073552837?text=Hi! I want a decoration like these! Can you help?" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-3.5 rounded-full shadow-lg shadow-orange-500/30 transition text-base">
            📲 Get This for My Event
          </a>
        </div>
      </div>
    </section>
  );
}

'use client';
import { useEffect, useState, useCallback } from 'react';

const REVIEWS = [
  { name: 'Priya S.', city: 'Delhi', text: 'Just booked for my daughter\'s birthday 🎂', time: '2 min ago', emoji: '🎉', rating: 5 },
  { name: 'Rahul M.', city: 'Gurgaon', text: 'Amazing surprise setup for wife ❤️', time: '5 min ago', emoji: '💑', rating: 5 },
  { name: 'Anjali K.', city: 'Noida', text: 'Balloon arch came out stunning!', time: '8 min ago', emoji: '🎈', rating: 5 },
  { name: 'Deepak T.', city: 'Bangalore', text: 'Booked bachelorette package 💃', time: '12 min ago', emoji: '🥂', rating: 5 },
  { name: 'Meera P.', city: 'Mumbai', text: 'Team arrived on time, so professional!', time: '15 min ago', emoji: '✨', rating: 5 },
  { name: 'Sana R.', city: 'Hyderabad', text: 'Pinterest-style setup was 🔥', time: '18 min ago', emoji: '📌', rating: 5 },
  { name: 'Karan V.', city: 'Pune', text: 'Booked same-day — delivered perfectly!', time: '22 min ago', emoji: '⚡', rating: 5 },
  { name: 'Nisha B.', city: 'Chennai', text: 'Baby shower decor exceeded expectations', time: '25 min ago', emoji: '🍼', rating: 5 },
  { name: 'Arjun S.', city: 'Delhi NCR', text: 'Corporate event was a huge hit 🏢', time: '30 min ago', emoji: '🏆', rating: 5 },
  { name: 'Pooja L.', city: 'Kolkata', text: 'Theme decoration was out of this world!', time: '35 min ago', emoji: '🎨', rating: 5 },
];

export default function ReviewToast() {
  const [current, setCurrent] = useState<typeof REVIEWS[0] | null>(null);
  const [visible, setVisible] = useState(false);
  const [idx, setIdx] = useState(0);

  const show = useCallback(() => {
    setCurrent(REVIEWS[idx % REVIEWS.length]);
    setVisible(true);
    setIdx(i => i + 1);

    // Auto-hide after 4.5s
    setTimeout(() => setVisible(false), 4500);
  }, [idx]);

  useEffect(() => {
    // First toast after 6s, then every 18s
    const first = setTimeout(show, 6000);
    const interval = setInterval(show, 18000);
    return () => { clearTimeout(first); clearInterval(interval); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!current) return null;

  return (
    <div
      className={`fixed bottom-24 left-4 z-[140] transition-all duration-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
      style={{ maxWidth: 'min(300px, calc(100vw - 32px))' }}
    >
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-3.5 flex items-start gap-3"
        style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.14)' }}>
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
          {current.name[0]}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="font-bold text-gray-800 text-sm truncate">{current.name}</span>
            <span className="text-[10px] text-gray-400 flex-shrink-0">· {current.city}</span>
          </div>
          <div className="text-orange-400 text-xs mb-1">{'★'.repeat(current.rating)}</div>
          <div className="text-sm text-gray-600 leading-snug">
            {current.emoji} {current.text}
          </div>
          <div className="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
            {current.time}
          </div>
        </div>
        <button
          onClick={() => setVisible(false)}
          className="text-gray-300 hover:text-gray-500 text-sm flex-shrink-0 -mt-0.5"
        >✕</button>
      </div>

      {/* WhatsApp nudge strip */}
      <div className="mt-1.5 bg-green-500 text-white text-[11px] font-semibold rounded-xl px-3 py-1.5 text-center">
        💬 Join them — book on WhatsApp in 2 min!
      </div>
    </div>
  );
}

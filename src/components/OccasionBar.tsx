'use client';
import Link from 'next/link';

const OCCASIONS = [
  { label: 'All Popular', emoji: '⭐', href: '/birthday-decoration' },
  { label: 'Kids Activities', emoji: '🎪', href: '/activities' },
  { label: 'Birthday', emoji: '🎂', href: '/birthday-decoration' },
  { label: 'Anniversary', emoji: '💑', href: '/anniversary-decoration' },
  { label: 'Baby Shower', emoji: '🍼', href: '/baby-shower' },
  { label: 'Bachelorette', emoji: '👰', href: '/bachelorette-party' },
  { label: 'Room Decor', emoji: '🛏️', href: '/room-decoration' },
  { label: 'Pinterest', emoji: '📌', href: '/pinterest-edition' },
];

export default function OccasionBar() {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
      {OCCASIONS.map(occ => (
        <Link
          key={occ.href + occ.label}
          href={occ.href}
          className="flex-shrink-0 flex flex-col items-center gap-1 px-4 py-2 rounded-2xl bg-orange-50 hover:bg-orange-100 border border-orange-100 hover:border-orange-300 transition-all group"
        >
          <span className="text-xl group-hover:scale-110 transition-transform">{occ.emoji}</span>
          <span className="text-[10px] font-semibold text-orange-700 whitespace-nowrap">{occ.label}</span>
        </Link>
      ))}
      <style>{`.no-scrollbar::-webkit-scrollbar { display: none; } .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }`}</style>
    </div>
  );
}

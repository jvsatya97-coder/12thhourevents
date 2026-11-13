'use client';

// Sticky category bar — fixed below navbar, scrollable chips for all services
// Like PartyOne's category row

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SERVICES } from '@/lib/config';

const EXTRA = [
  { slug: 'theme-decoration', name: 'All Themes', emoji: '🎨' },
];

// All categories in display order
const CATS = [
  { slug: 'birthday-decoration',    name: 'Birthday',      emoji: '🎂' },
  { slug: 'theme-decoration',       name: 'Themes',        emoji: '🎨' },
  { slug: 'anniversary-decoration', name: 'Anniversary',   emoji: '❤️' },
  { slug: 'baby-shower',            name: 'Baby Shower',   emoji: '👶' },
  { slug: 'bachelorette-party',     name: 'Bachelorette',  emoji: '👰' },
  { slug: 'balloon-decoration',     name: 'Balloons',      emoji: '🎈' },
  { slug: 'pinterest-edition',      name: 'Pinterest',     emoji: '📌' },
  { slug: 'activities',             name: 'Kids Fun',      emoji: '🌟' },
  { slug: 'welcome-baby',           name: 'Welcome Baby',  emoji: '🍼' },
  { slug: 'corporate-events',       name: 'Corporate',     emoji: '🏢' },
];

export default function StickyCategories() {
  const pathname = usePathname();

  return (
    <div className="sticky top-16 z-40 bg-white border-b border-gray-100 shadow-sm">
      <div
        className="flex items-center gap-2 overflow-x-auto px-4 py-2.5"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {CATS.map(cat => {
          const isActive = pathname === `/${cat.slug}` || pathname.startsWith(`/${cat.slug}/`);
          return (
            <Link
              key={cat.slug}
              href={`/${cat.slug}`}
              className={`flex-none flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                isActive
                  ? 'text-white shadow-sm'
                  : 'bg-gray-50 text-gray-600 hover:bg-orange-50 hover:text-orange-600 border border-gray-200 hover:border-orange-300'
              }`}
              style={isActive ? { background: 'linear-gradient(135deg, #ff6b00, #ff9800)', border: 'none' } : {}}
            >
              <span className="text-sm">{cat.emoji}</span>
              <span>{cat.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SERVICES } from '@/lib/config';

export default function CategoryBar() {
  const pathname = usePathname();

  return (
    <div className="category-bar-wrap">
      <div className="category-bar-inner">
        {SERVICES.map(s => {
          // Mark active if pathname starts with the service slug
          const isActive = pathname === `/${s.slug}` || pathname.startsWith(`/${s.slug}/`);
          return (
            <Link
              key={s.cat}
              href={`/${s.slug}`}
              className={`cat-chip ${isActive ? 'cat-chip--active' : ''}`}
            >
              <span className="cat-chip-emoji">{s.emoji}</span>
              <span className="cat-chip-label">{s.name}</span>
            </Link>
          );
        })}
      </div>

      <style>{`
        .category-bar-wrap {
          background: #fff;
          border-bottom: 1px solid #f3f4f6;
          position: sticky;
          top: 60px;
          z-index: 20;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        }
        .category-bar-inner {
          display: flex;
          gap: 6px;
          overflow-x: auto;
          padding: 10px max(16px, env(safe-area-inset-left, 0px));
          padding-right: max(16px, env(safe-area-inset-right, 0px));
          max-width: 1280px;
          margin: 0 auto;
          scrollbar-width: none;
        }
        .category-bar-inner::-webkit-scrollbar { display: none; }
        .cat-chip {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 5px;
          flex-shrink: 0;
          padding: 6px 12px;
          border-radius: 999px;
          border: 1.5px solid #e5e7eb;
          background: #fafafa;
          font-size: 12px;
          font-weight: 600;
          color: #374151;
          white-space: nowrap;
          transition: all 0.15s ease;
          text-decoration: none;
        }
        .cat-chip:hover {
          border-color: #fb923c;
          background: #fff7ed;
          color: #ea580c;
        }
        .cat-chip--active {
          border-color: #ff6b00;
          background: linear-gradient(90deg, #ff6b00, #f59e0b);
          color: #fff !important;
          box-shadow: 0 2px 8px rgba(255,107,0,0.25);
        }
        .cat-chip-emoji { font-size: 15px; line-height: 1; }
        .cat-chip-label { font-size: 12px; }
        @media (prefers-color-scheme: dark) {
          .category-bar-wrap { background: #111; border-bottom-color: #222; }
          .cat-chip { background: #1a1a1a; border-color: #333; color: #d1d5db; }
          .cat-chip:hover { background: #2a1500; border-color: #fb923c; color: #fb923c; }
        }
      `}</style>
    </div>
  );
}

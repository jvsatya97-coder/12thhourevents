'use client';
import { useEffect, useState } from 'react';

const KEY = '12he_wishlist_v1';

function getWishlist(): string[] {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; }
}

export function toggleWishlist(id: string): boolean {
  const list = getWishlist();
  const has = list.includes(id);
  const updated = has ? list.filter(x => x !== id) : [id, ...list];
  try { localStorage.setItem(KEY, JSON.stringify(updated)); } catch {}
  return !has;
}

export function isWishlisted(id: string): boolean {
  return getWishlist().includes(id);
}

export default function WishlistButton({ id, className = '' }: { id: string; className?: string }) {
  const [saved, setSaved] = useState(false);
  const [popped, setPopped] = useState(false);

  useEffect(() => { setSaved(isWishlisted(id)); }, [id]);

  const toggle = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    const nowSaved = toggleWishlist(id);
    setSaved(nowSaved);
    if (nowSaved) { setPopped(true); setTimeout(() => setPopped(false), 600); }
    // Dispatch event so other components can listen
    window.dispatchEvent(new CustomEvent('wishlistChange'));
  };

  return (
    <button onClick={toggle} aria-label={saved ? 'Remove from wishlist' : 'Add to wishlist'}
      className={`wishlist-btn ${saved ? 'wishlisted' : ''} ${popped ? 'pop' : ''} ${className}`}>
      <svg viewBox="0 0 24 24" width="18" height="18" fill={saved ? '#ef4444' : 'none'}
        stroke={saved ? '#ef4444' : 'white'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </button>
  );
}

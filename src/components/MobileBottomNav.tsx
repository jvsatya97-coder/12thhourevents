'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function MobileBottomNav() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname.startsWith(path) && (path !== '/' || pathname === '/');

  return (
    <nav className="mobile-bottom-nav md:hidden">
      <Link href="/" className={`mobile-nav-item ${pathname === '/' ? 'active' : ''}`}>
        <span className="mobile-nav-icon">🏠</span>
        <span>Home</span>
      </Link>

      <Link href="/pinterest-edition" className={`mobile-nav-item ${isActive('/pinterest-edition') ? 'active' : ''}`}>
        <span className="mobile-nav-icon">📌</span>
        <span>Pinterest</span>
      </Link>

      <Link href="/theme-decoration" className={`mobile-nav-item ${isActive('/theme-decoration') ? 'active' : ''}`}>
        <span className="mobile-nav-icon">🎨</span>
        <span>Themes</span>
      </Link>

      <Link href="/wishlist" className={`mobile-nav-item ${pathname === '/wishlist' ? 'active' : ''}`}>
        <span className="mobile-nav-icon">❤️</span>
        <span>Saved</span>
      </Link>

      <a
        href="https://wa.me/918073552837?text=Hi! I want to book a decoration."
        target="_blank"
        rel="noopener noreferrer"
        className="mobile-nav-item mobile-nav-book"
      >
        <span className="mobile-nav-icon">💬</span>
        <span>Book Now</span>
      </a>
    </nav>
  );
}

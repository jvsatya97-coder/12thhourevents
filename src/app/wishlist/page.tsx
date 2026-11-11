import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'My Wishlist — 12th Hour Events', robots: 'noindex' };

import WishlistPage from './WishlistClient';
export default function Page() { return <WishlistPage />; }

import type { Metadata } from 'next';
import { Suspense } from 'react';
import SearchContent from './SearchContent';

export const metadata: Metadata = {
  title: 'Search Decoration Packages | 12th Hour Events',
  description: 'Search all party decoration packages by 12th Hour Events. Find the perfect setup for your event.',
};

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading search…</p>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}

import type { Metadata } from 'next';
import BrowseClient from './BrowseClient';

export const metadata: Metadata = {
  title: 'Browse All Packages | 12th Hour Events',
  description: 'Browse all party and decoration packages by 12th Hour Events. Birthday, anniversary, theme, baby shower, room decoration and more. Filter by city, budget and occasion.',
  alternates: { canonical: 'https://12thhourevents.in/browse' },
  robots: { index: true, follow: true },
};

export default function Page() {
  return <BrowseClient />;
}

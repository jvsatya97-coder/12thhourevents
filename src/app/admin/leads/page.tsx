import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Leads CRM — 12th Hour Admin', robots: 'noindex,nofollow' };
export default function Page() {
  return <LeadsWrapper />;
}

import LeadsWrapper from './LeadsClient';

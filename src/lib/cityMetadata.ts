import type { Metadata } from 'next';
import { DOMAIN } from '@/lib/config';

export function generateCityMetadata({ serviceName, cityName, serviceSlug, citySlug }: { serviceName: string; cityName: string; serviceSlug?: string; citySlug?: string }): Metadata {
  const title = `${serviceName} in ${cityName} | 12th Hour Events — Same-Day Setup`;
  const description = `Best ${serviceName.toLowerCase()} in ${cityName} ✓ Same-day setup ✓ 5000+ events done ✓ Transparent pricing ✓ WhatsApp booking in 2 mins. 12th Hour Events — #1 party decorators.`;
  const url = serviceSlug && citySlug ? `${DOMAIN}/${serviceSlug}-${citySlug}` : DOMAIN;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      type: 'website',
      url,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

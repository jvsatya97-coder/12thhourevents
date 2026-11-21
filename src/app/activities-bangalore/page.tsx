import type { Metadata } from 'next';
import CityServiceTemplate from '@/components/CityServiceTemplate';
import { generateCityMetadata } from '@/lib/cityMetadata';

export const metadata: Metadata = generateCityMetadata({ serviceName: 'Kids Activities', cityName: 'Bangalore', serviceSlug: 'activities', citySlug: 'bangalore' });

export default function Page() {
  return <CityServiceTemplate
    cat="act-artists" serviceName="Kids Activities" serviceSlug="activities" emoji="🎪"
    citySlug="bangalore" cityName="Bangalore"
  />;
}

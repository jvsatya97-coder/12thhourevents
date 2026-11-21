import type { Metadata } from 'next';
import CityServiceTemplate from '@/components/CityServiceTemplate';
import { generateCityMetadata } from '@/lib/cityMetadata';

export const metadata: Metadata = generateCityMetadata({ serviceName: 'Kids Activities', cityName: 'Thane', serviceSlug: 'activities', citySlug: 'thane' });

export default function Page() {
  return <CityServiceTemplate
    cat="act-artists" serviceName="Kids Activities" serviceSlug="activities" emoji="🎪"
    citySlug="thane" cityName="Thane"
  />;
}

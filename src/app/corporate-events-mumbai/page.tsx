import type { Metadata } from 'next';
import CityServiceTemplate from '@/components/CityServiceTemplate';
import { generateCityMetadata } from '@/lib/cityMetadata';

export const metadata: Metadata = generateCityMetadata({ serviceName: 'Corporate Events', cityName: 'Mumbai', serviceSlug: 'corporate-events', citySlug: 'mumbai' });

export default function Page() {
  return <CityServiceTemplate
    cat="corporate" serviceName="Corporate Events" serviceSlug="corporate-events" emoji="🏢"
    citySlug="mumbai" cityName="Mumbai"
  />;
}

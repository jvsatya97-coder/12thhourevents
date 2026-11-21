import type { Metadata } from 'next';
import CityServiceTemplate from '@/components/CityServiceTemplate';
import { generateCityMetadata } from '@/lib/cityMetadata';

export const metadata: Metadata = generateCityMetadata({ serviceName: 'Bachelorette Party', cityName: 'Pune', serviceSlug: 'bachelorette-party', citySlug: 'pune' });

export default function Page() {
  return <CityServiceTemplate
    cat="bachelorette" serviceName="Bachelorette Party" serviceSlug="bachelorette-party" emoji="💃"
    citySlug="pune" cityName="Pune"
  />;
}

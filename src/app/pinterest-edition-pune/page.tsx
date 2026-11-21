import type { Metadata } from 'next';
import CityServiceTemplate from '@/components/CityServiceTemplate';
import { generateCityMetadata } from '@/lib/cityMetadata';

export const metadata: Metadata = generateCityMetadata({ serviceName: 'Pinterest Edition', cityName: 'Pune', serviceSlug: 'pinterest-edition', citySlug: 'pune' });

export default function Page() {
  return <CityServiceTemplate
    cat="pinterest" serviceName="Pinterest Edition" serviceSlug="pinterest-edition" emoji="📌"
    citySlug="pune" cityName="Pune"
  />;
}

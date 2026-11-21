import type { Metadata } from 'next';
import CityServiceTemplate from '@/components/CityServiceTemplate';
import { generateCityMetadata } from '@/lib/cityMetadata';

export const metadata: Metadata = generateCityMetadata({ serviceName: 'Pinterest Edition', cityName: 'Noida', serviceSlug: 'pinterest-edition', citySlug: 'noida' });

export default function Page() {
  return <CityServiceTemplate
    cat="pinterest" serviceName="Pinterest Edition" serviceSlug="pinterest-edition" emoji="📌"
    citySlug="noida" cityName="Noida"
  />;
}

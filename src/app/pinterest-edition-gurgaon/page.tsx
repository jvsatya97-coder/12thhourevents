import type { Metadata } from 'next';
import CityServiceTemplate, { generateCityMetadata } from '@/components/CityServiceTemplate';

export const metadata: Metadata = generateCityMetadata({ serviceName: 'Pinterest Edition', cityName: 'Gurgaon' });

export default function Page() {
  return <CityServiceTemplate
    cat="pinterest" serviceName="Pinterest Edition" serviceSlug="pinterest-edition" emoji="📌"
    citySlug="gurgaon" cityName="Gurgaon"
  />;
}

import type { Metadata } from 'next';
import CityServiceTemplate, { generateCityMetadata } from '@/components/CityServiceTemplate';

export const metadata: Metadata = generateCityMetadata({ serviceName: 'Corporate Events', cityName: 'Gurgaon' });

export default function Page() {
  return <CityServiceTemplate
    cat="corporate" serviceName="Corporate Events" serviceSlug="corporate-events" emoji="🏢"
    citySlug="gurgaon" cityName="Gurgaon"
  />;
}

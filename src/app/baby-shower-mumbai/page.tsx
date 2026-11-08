import type { Metadata } from 'next';
import CityServiceTemplate, { generateCityMetadata } from '@/components/CityServiceTemplate';

export const metadata: Metadata = generateCityMetadata({ serviceName: 'Baby Shower', cityName: 'Mumbai' });

export default function Page() {
  return <CityServiceTemplate
    cat="baby" serviceName="Baby Shower" serviceSlug="baby-shower" emoji="👶"
    citySlug="mumbai" cityName="Mumbai"
  />;
}

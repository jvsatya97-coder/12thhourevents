import type { Metadata } from 'next';
import CityServiceTemplate, { generateCityMetadata } from '@/components/CityServiceTemplate';

export const metadata: Metadata = generateCityMetadata({ serviceName: 'Welcome Baby', cityName: 'Kolkata' });

export default function Page() {
  return <CityServiceTemplate
    cat="welcomebaby" serviceName="Welcome Baby" serviceSlug="welcome-baby" emoji="🍼"
    citySlug="kolkata" cityName="Kolkata"
  />;
}

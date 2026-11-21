import type { Metadata } from 'next';
import CityServiceTemplate from '@/components/CityServiceTemplate';
import { generateCityMetadata } from '@/lib/cityMetadata';

export const metadata: Metadata = generateCityMetadata({ serviceName: 'Welcome Baby', cityName: 'Pune', serviceSlug: 'welcome-baby', citySlug: 'pune' });

export default function Page() {
  return <CityServiceTemplate
    cat="welcomebaby" serviceName="Welcome Baby" serviceSlug="welcome-baby" emoji="🍼"
    citySlug="pune" cityName="Pune"
  />;
}

import type { Metadata } from 'next';
import CityServiceTemplate from '@/components/CityServiceTemplate';
import { generateCityMetadata } from '@/lib/cityMetadata';

export const metadata: Metadata = generateCityMetadata({ serviceName: 'Welcome Baby', cityName: 'Noida', serviceSlug: 'welcome-baby', citySlug: 'noida' });

export default function Page() {
  return <CityServiceTemplate
    cat="welcomebaby" serviceName="Welcome Baby" serviceSlug="welcome-baby" emoji="🍼"
    citySlug="noida" cityName="Noida"
  />;
}

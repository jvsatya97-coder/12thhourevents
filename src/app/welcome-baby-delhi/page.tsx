import type { Metadata } from 'next';
import CityServiceTemplate from '@/components/CityServiceTemplate';
import { generateCityMetadata } from '@/lib/cityMetadata';

export const metadata: Metadata = generateCityMetadata({ serviceName: 'Welcome Baby', cityName: 'Delhi NCR', serviceSlug: 'welcome-baby', citySlug: 'delhi' });

export default function Page() {
  return <CityServiceTemplate
    cat="welcomebaby" serviceName="Welcome Baby" serviceSlug="welcome-baby" emoji="🍼"
    citySlug="delhi" cityName="Delhi NCR"
  />;
}

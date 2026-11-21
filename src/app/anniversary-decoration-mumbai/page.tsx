import type { Metadata } from 'next';
import CityServiceTemplate from '@/components/CityServiceTemplate';
import { generateCityMetadata } from '@/lib/cityMetadata';

export const metadata: Metadata = generateCityMetadata({ serviceName: 'Anniversary Decoration', cityName: 'Mumbai', serviceSlug: 'anniversary-decoration', citySlug: 'mumbai' });

export default function Page() {
  return <CityServiceTemplate
    cat="anniv" serviceName="Anniversary Decoration" serviceSlug="anniversary-decoration" emoji="❤️"
    citySlug="mumbai" cityName="Mumbai"
  />;
}

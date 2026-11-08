import type { Metadata } from 'next';
import CityServiceTemplate, { generateCityMetadata } from '@/components/CityServiceTemplate';

export const metadata: Metadata = generateCityMetadata({ serviceName: 'Anniversary Decoration', cityName: 'Pune' });

export default function Page() {
  return <CityServiceTemplate
    cat="anniv" serviceName="Anniversary Decoration" serviceSlug="anniversary-decoration" emoji="❤️"
    citySlug="pune" cityName="Pune"
  />;
}

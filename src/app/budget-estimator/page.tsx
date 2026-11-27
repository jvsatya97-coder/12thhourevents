import type { Metadata } from 'next';
import BudgetEstimatorClient from './BudgetEstimatorClient';

export const metadata: Metadata = {
  title: 'Party Decoration Budget Estimator | 12th Hour Events',
  description: 'Estimate the cost of your party decoration in seconds. Enter your city, occasion and guest count to get an instant price range. No commitment needed.',
  alternates: { canonical: 'https://12thhourevents.in/budget-estimator' },
  robots: { index: true, follow: true },
};

export default function Page() {
  return <BudgetEstimatorClient />;
}

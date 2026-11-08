import type { Metadata } from 'next';
import ThemeDecorationClient from './ThemeDecorationClient';

export const metadata: Metadata = {
  title: 'Theme Party Decoration | Mermaid, Superhero, Barbie & More — 12th Hour Events',
  description: 'Book any theme party decoration across India — Mermaid, Cars, Superhero, Barbie, K-Pop, Space, Rainbow, Peppa Pig, Hello Kitty & more. Same-day setup. WhatsApp booking!',
  keywords: 'theme party decoration, mermaid theme decoration, superhero theme birthday, barbie theme party, kpop theme decoration, space theme birthday, peppa pig decoration india',
};

export default function Page() {
  return <ThemeDecorationClient />;
}

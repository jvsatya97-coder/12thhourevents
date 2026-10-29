import Link from 'next/link';
import { SERVICES, CITIES } from '@/lib/config';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 pb-6 mt-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="text-xl font-extrabold text-white mb-2">🎉 12th Hour Events</div>
            <p className="text-sm text-gray-400">Premium party decorators across India. Book in 2 mins on WhatsApp!</p>
            <a href="https://wa.me/918073552837" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-4 bg-green-500 text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-green-600">
              📞 +91 80735 52837
            </a>
          </div>
          <div>
            <h4 className="font-bold text-white mb-3">Our Services</h4>
            <ul className="space-y-1">
              {SERVICES.map(s => (
                <li key={s.slug}>
                  <Link href={`/${s.slug}`} className="text-sm text-gray-400 hover:text-orange-400">{s.name}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-3">Cities We Serve</h4>
            <div className="grid grid-cols-2 gap-1">
              {CITIES.slice(0, 8).map(c => (
                <Link key={c.slug} href={`/birthday-decoration-${c.slug}`}
                  className="text-sm text-gray-400 hover:text-orange-400">{c.name}</Link>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-bold text-white mb-3">Quick Links</h4>
            <ul className="space-y-1">
              <li><Link href="/contact" className="text-sm text-gray-400 hover:text-orange-400">Contact Us</Link></li>
              <li><Link href="/search" className="text-sm text-gray-400 hover:text-orange-400">Search</Link></li>
              <li><a href="https://wa.me/918073552837" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-400 hover:text-orange-400">WhatsApp Us</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 pt-4 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} 12th Hour Events. All rights reserved. | Delhi NCR & Pan India
        </div>
      </div>
    </footer>
  );
}

import type { Metadata } from 'next';
import ContactForm from './ContactForm';

export const metadata: Metadata = {
  title: 'Contact Us | 12th Hour Events',
  description: 'Contact 12th Hour Events for party decoration bookings in Delhi NCR and pan India. WhatsApp or call us!',
};

export default function ContactPage() {
  return (
    <div>
      <div className="hero-bg text-white py-14 text-center relative">
        <div className="relative z-10 max-w-2xl mx-auto px-4">
          <h1 className="text-4xl font-extrabold mb-3">Get in Touch 📞</h1>
          <p className="text-gray-300">We&apos;d love to plan your perfect celebration!</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-14">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact info */}
          <div className="space-y-6">
            <div className="card p-6">
              <div className="text-3xl mb-3">📱</div>
              <h3 className="font-bold text-lg mb-1">WhatsApp / Phone</h3>
              <p className="text-gray-600 text-sm mb-3">Fastest way to reach us. Get a reply in minutes!</p>
              <a href="https://wa.me/918073552837" target="_blank" rel="noopener noreferrer" className="btn-wa inline-flex">
                Chat on WhatsApp
              </a>
            </div>
            <div className="card p-6">
              <div className="text-3xl mb-3">⏰</div>
              <h3 className="font-bold text-lg mb-1">Working Hours</h3>
              <p className="text-gray-600 text-sm">Mon – Sun: 8 AM to 10 PM</p>
              <p className="text-gray-500 text-xs mt-1">Available 365 days a year including holidays</p>
            </div>
            <div className="card p-6">
              <div className="text-3xl mb-3">📍</div>
              <h3 className="font-bold text-lg mb-1">Service Areas</h3>
              <p className="text-gray-600 text-sm">Delhi, Noida, Gurgaon, Faridabad, Ghaziabad, and 9 more cities across India.</p>
            </div>
          </div>

          <ContactForm />
        </div>
      </div>
    </div>
  );
}

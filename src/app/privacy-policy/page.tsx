import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | 12th Hour Events',
  description: 'Privacy policy for 12th Hour Events — how we collect, use, and protect your personal information.',
  alternates: {
    canonical: 'https://12thhourevents.in/privacy-policy',
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div>
      <div className="hero-bg text-white py-14 text-center relative">
        <div className="relative z-10 max-w-2xl mx-auto px-4">
          <h1 className="text-4xl font-extrabold mb-3">Privacy Policy</h1>
          <p className="text-gray-300">Last updated: November 2026</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-14">
        <div className="prose prose-lg max-w-none space-y-8">

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">1. Who We Are</h2>
            <p className="text-gray-600 leading-relaxed">
              12th Hour Events (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) is a party decoration and kids entertainment service based in India. We operate at <strong>12thhourevents.in</strong> and serve customers across Hyderabad, Bangalore, Delhi NCR, Mumbai, and other cities.
            </p>
            <p className="text-gray-600 leading-relaxed mt-3">
              For any privacy-related queries, contact us at: <a href="mailto:12thhourevents@gmail.com" className="text-purple-600 hover:underline">12thhourevents@gmail.com</a> or WhatsApp: <a href="https://wa.me/918073552837" className="text-purple-600 hover:underline">+91 80735 52837</a>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">2. Information We Collect</h2>
            <p className="text-gray-600 leading-relaxed">We collect the following types of information:</p>
            <ul className="list-disc pl-6 mt-3 space-y-2 text-gray-600">
              <li><strong>Contact Information:</strong> Name, phone number, email address, and city — when you fill out a booking or enquiry form.</li>
              <li><strong>Event Details:</strong> Event date, theme preferences, venue details — to plan your decoration.</li>
              <li><strong>Usage Data:</strong> Pages visited, time spent, device type — collected automatically via Google Analytics and Google Tag Manager to improve our website.</li>
              <li><strong>Ad Interaction Data:</strong> If you interact with our Google Ads, Google may share limited lead information with us (name, phone, email, city) through their lead form extensions.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">3. How We Use Your Information</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>To respond to your booking enquiries and provide decoration services</li>
              <li>To send confirmation messages and event reminders via WhatsApp or phone</li>
              <li>To improve our website and services based on usage patterns</li>
              <li>To run targeted advertising on Google to reach customers interested in party decoration</li>
              <li>To comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">4. How We Share Your Information</h2>
            <p className="text-gray-600 leading-relaxed">
              We do <strong>not</strong> sell, trade, or rent your personal information to third parties. We may share data with:
            </p>
            <ul className="list-disc pl-6 mt-3 space-y-2 text-gray-600">
              <li><strong>Google:</strong> For analytics (Google Analytics) and advertising (Google Ads). Google&apos;s privacy policy applies: <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">policies.google.com/privacy</a></li>
              <li><strong>Our Decoration Team:</strong> Your event details are shared internally to plan and execute your decoration.</li>
              <li><strong>Legal Authorities:</strong> If required by law or court order.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">5. Cookies</h2>
            <p className="text-gray-600 leading-relaxed">
              Our website uses cookies to enhance your experience and for analytics. These include:
            </p>
            <ul className="list-disc pl-6 mt-3 space-y-2 text-gray-600">
              <li><strong>Google Analytics cookies</strong> — to understand website traffic and user behaviour</li>
              <li><strong>Google Ads cookies</strong> — to measure the effectiveness of our advertisements</li>
              <li><strong>Functional cookies</strong> — to remember your city preference and wishlist</li>
            </ul>
            <p className="text-gray-600 leading-relaxed mt-3">
              You can control cookies through your browser settings. Disabling cookies may affect some website features.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">6. Data Retention</h2>
            <p className="text-gray-600 leading-relaxed">
              We retain your personal information for as long as necessary to provide services and comply with legal obligations. Lead form data is typically retained for 12 months. You may request deletion at any time.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">7. Your Rights</h2>
            <p className="text-gray-600 leading-relaxed">You have the right to:</p>
            <ul className="list-disc pl-6 mt-3 space-y-2 text-gray-600">
              <li>Access the personal data we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Opt out of marketing communications at any time</li>
            </ul>
            <p className="text-gray-600 leading-relaxed mt-3">
              To exercise these rights, WhatsApp us at <a href="https://wa.me/918073552837" className="text-purple-600 hover:underline">+91 80735 52837</a> or email <a href="mailto:12thhourevents@gmail.com" className="text-purple-600 hover:underline">12thhourevents@gmail.com</a>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">8. Children&apos;s Privacy</h2>
            <p className="text-gray-600 leading-relaxed">
              Our services are booked by adults on behalf of children&apos;s events. We do not knowingly collect personal information directly from children under 13. All bookings are made by adults.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">9. Changes to This Policy</h2>
            <p className="text-gray-600 leading-relaxed">
              We may update this privacy policy from time to time. We will notify you of significant changes by updating the date at the top of this page. Continued use of our website after changes constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">10. Contact Us</h2>
            <p className="text-gray-600 leading-relaxed">
              If you have any questions about this privacy policy, please contact us:
            </p>
            <div className="mt-3 bg-purple-50 rounded-xl p-5 text-gray-700">
              <p><strong>12th Hour Events</strong></p>
              <p>📞 WhatsApp: <a href="https://wa.me/918073552837" className="text-purple-600 hover:underline">+91 80735 52837</a></p>
              <p>📧 Email: <a href="mailto:12thhourevents@gmail.com" className="text-purple-600 hover:underline">12thhourevents@gmail.com</a></p>
              <p>🌐 Website: <a href="https://12thhourevents.in" className="text-purple-600 hover:underline">12thhourevents.in</a></p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}

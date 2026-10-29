'use client';

export default function ContactForm() {
  const handleSubmit = () => {
    if (typeof window === 'undefined') return;
    const n = (document.getElementById('cname') as HTMLInputElement)?.value || '';
    const p = (document.getElementById('cphone') as HTMLInputElement)?.value || '';
    const m = (document.getElementById('cmsg') as HTMLTextAreaElement)?.value || '';
    window.open(`https://wa.me/918073552837?text=${encodeURIComponent(`Hi! I'm ${n} (${p}).\n\n${m}`)}`, '_blank');
  };

  return (
    <div className="card p-8">
      <h2 className="text-xl font-bold mb-6 grad-text">Send Us a Message</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
          <input id="cname" placeholder="Enter your name" className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
          <input id="cphone" placeholder="Enter phone number" className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
          <textarea id="cmsg" rows={3} placeholder="What decoration are you looking for?" className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400 resize-none" />
        </div>
        <button onClick={handleSubmit} className="btn-wa w-full justify-center">
          📲 Send via WhatsApp
        </button>
      </div>
    </div>
  );
}

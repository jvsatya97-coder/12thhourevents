'use client';
import { useState } from 'react';

export default function ReferralCard() {
  const [copied, setCopied] = useState(false);
  const [name, setName] = useState('');
  const [generated, setGenerated] = useState(false);

  const siteUrl = 'https://12thhourevents.in';
  const shareText = name.trim()
    ? `Hey! ${name.trim()} recommended 12th Hour Events for the most stunning party decorations 🎉 Same-day setup, amazing prices. Check them out 👇\n${siteUrl}?ref=friend`
    : `Check out 12th Hour Events for the most amazing party decorations! 🎉 Same-day setup all over India. Use this link for a special welcome offer 👇\n${siteUrl}?ref=friend`;

  const handleGenerate = () => {
    if (!name.trim()) return;
    setGenerated(true);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shareText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {});
  };

  const waUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;

  return (
    <section className="py-10 md:py-14 bg-gradient-to-br from-green-50 to-emerald-50">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-green-100">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-5 text-white text-center relative overflow-hidden">
            {/* Confetti bg */}
            <div className="absolute inset-0 opacity-10" aria-hidden>
              {['🎉','🎊','🎈','⭐','✨'].map((e, i) => (
                <span key={i} className="absolute text-2xl" style={{ left: `${i*22+5}%`, top: `${(i*17+10)%80}%` }}>{e}</span>
              ))}
            </div>
            <div className="relative">
              <div className="text-4xl mb-2">🤝</div>
              <h2 className="text-xl font-extrabold mb-1">Tell a Friend, Spread the Joy!</h2>
              <p className="text-green-100 text-sm">Share 12th Hour Events with your friends &amp; help them celebrate in style</p>
            </div>
          </div>

          <div className="p-6">
            {!generated ? (
              <>
                <div className="mb-5">
                  <label className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2 block">Your name (so they know who sent it)</label>
                  <input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Priya"
                    className="w-full border-2 border-gray-200 focus:border-green-400 rounded-xl px-4 py-2.5 text-sm outline-none transition"
                  />
                </div>

                {/* What they get */}
                <div className="bg-green-50 rounded-2xl p-4 mb-5 space-y-2">
                  <div className="text-xs font-bold text-green-700 uppercase tracking-wider mb-1">Your friend gets:</div>
                  {['A warm welcome from our team 🎉', 'Priority booking on WhatsApp ⚡', 'Exclusive first-time customer pricing 💰'].map(pt => (
                    <div key={pt} className="flex items-center gap-2 text-sm text-gray-700">
                      <span className="text-green-500 flex-shrink-0">✓</span> {pt}
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleGenerate}
                  disabled={!name.trim()}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold py-3 rounded-2xl text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition"
                >
                  Generate My Referral Message →
                </button>
              </>
            ) : (
              <>
                {/* Generated message */}
                <div className="bg-gray-50 rounded-2xl p-4 mb-4 relative">
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{shareText}</p>
                </div>

                {/* Share buttons */}
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-2xl text-sm transition"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    Share on WhatsApp
                  </a>
                  <button
                    onClick={handleCopy}
                    className="flex items-center justify-center gap-2 border-2 border-gray-200 hover:border-green-400 text-gray-700 font-bold py-3 rounded-2xl text-sm transition hover:bg-green-50"
                  >
                    {copied ? '✅ Copied!' : '📋 Copy Message'}
                  </button>
                </div>

                <button
                  onClick={() => { setGenerated(false); setName(''); }}
                  className="w-full text-sm text-gray-400 hover:text-gray-600 font-medium py-2 transition"
                >
                  ← Change Name
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

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
    <section className="py-10 md:py-14 bg-gradient-to-br from-orange-50 to-amber-50">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-orange-100">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-pink-500 px-6 py-5 text-white text-center relative overflow-hidden">
            {/* Confetti bg */}
            <div className="absolute inset-0 opacity-10" aria-hidden>
              {['🎉','🎊','🎈','⭐','✨'].map((e, i) => (
                <span key={i} className="absolute text-2xl" style={{ left: `${i*22+5}%`, top: `${(i*17+10)%80}%` }}>{e}</span>
              ))}
            </div>
            <div className="relative">
              <div className="text-4xl mb-2">🤝</div>
              <h2 className="text-xl font-extrabold mb-1">Tell a Friend, Spread the Joy!</h2>
              <p className="text-orange-100 text-sm">Share 12th Hour Events with your friends &amp; help them celebrate in style</p>
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
                    className="w-full border-2 border-gray-200 focus:border-orange-400 rounded-xl px-4 py-2.5 text-sm outline-none transition"
                  />
                </div>

                {/* What they get */}
                <div className="bg-orange-50 rounded-2xl p-4 mb-5 space-y-2">
                  <div className="text-xs font-bold text-orange-700 uppercase tracking-wider mb-1">Your friend gets:</div>
                  {['A warm welcome from our team 🎉', 'Priority booking on WhatsApp ⚡', 'Exclusive first-time customer pricing 💰'].map(pt => (
                    <div key={pt} className="flex items-center gap-2 text-sm text-gray-700">
                      <span className="text-orange-500 flex-shrink-0">✓</span> {pt}
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleGenerate}
                  disabled={!name.trim()}
                  className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold py-3 rounded-2xl text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition"
                >
                  Generate My Referral Message →
                </button>
              </>
            ) : (
              <>
                {/* Generated message */}
                <div className="bg-orange-50 rounded-2xl p-4 mb-4 relative">
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{shareText}</p>
                </div>

                {/* Share buttons */}
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-2xl text-sm transition"
                  >
                    💬 Share on WhatsApp
                  </a>
                  <button
                    onClick={handleCopy}
                    className="flex items-center justify-center gap-2 border-2 border-orange-200 hover:border-orange-400 text-orange-600 font-bold py-3 rounded-2xl text-sm transition hover:bg-orange-50"
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

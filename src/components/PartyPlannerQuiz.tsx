'use client';
import { useState } from 'react';
import { WA_NUM } from '@/lib/config';
import { useCity } from '@/context/CityContext';

const STEPS = [
  {
    id: 'occasion',
    q: "What's the occasion? 🎉",
    sub: 'Pick one to get started',
    opts: [
      { id: 'birthday', label: 'Birthday', emoji: '🎂' },
      { id: 'anniversary', label: 'Anniversary', emoji: '❤️' },
      { id: 'baby-shower', label: 'Baby Shower', emoji: '👶' },
      { id: 'bachelorette', label: 'Bachelorette', emoji: '💃' },
      { id: 'theme-party', label: 'Theme Party', emoji: '🎨' },
      { id: 'corporate', label: 'Corporate Event', emoji: '🏢' },
    ],
  },
  {
    id: 'vibe',
    q: 'What vibe are you going for? ✨',
    sub: 'This helps us suggest the right theme',
    opts: [
      { id: 'elegant', label: 'Elegant & Classy', emoji: '🌹' },
      { id: 'colorful', label: 'Colorful & Fun', emoji: '🌈' },
      { id: 'minimalist', label: 'Minimalist Chic', emoji: '🤍' },
      { id: 'whimsical', label: 'Whimsical & Dreamy', emoji: '🦄' },
      { id: 'vintage', label: 'Vintage & Rustic', emoji: '🕯️' },
      { id: 'bold', label: 'Bold & Dramatic', emoji: '🔥' },
    ],
  },
  {
    id: 'guests',
    q: 'How many guests are you expecting? 👥',
    sub: 'Rough count is fine',
    opts: [
      { id: 'intimate', label: 'Just Family (< 10)', emoji: '🏠' },
      { id: 'small', label: 'Small Group (10–25)', emoji: '👫' },
      { id: 'medium', label: 'Party (25–50)', emoji: '🎊' },
      { id: 'large', label: 'Big Bash (50+)', emoji: '🎆' },
    ],
  },
  {
    id: 'budget',
    q: "What's your ballpark budget? 💰",
    sub: 'We work with every budget',
    opts: [
      { id: 'low', label: '₹1,500 – ₹3,000', emoji: '🌱' },
      { id: 'mid', label: '₹3,000 – ₹6,000', emoji: '⭐' },
      { id: 'high', label: '₹6,000 – ₹12,000', emoji: '💎' },
      { id: 'premium', label: '₹12,000+', emoji: '👑' },
    ],
  },
  {
    id: 'when',
    q: 'When is the event? 📅',
    sub: 'We do same-day setups too!',
    opts: [
      { id: 'today', label: 'Today!', emoji: '⚡' },
      { id: 'tomorrow', label: 'Tomorrow', emoji: '🌅' },
      { id: 'thisweek', label: 'This Week', emoji: '📆' },
      { id: 'nextweek', label: 'Next Week+', emoji: '🗓️' },
    ],
  },
];

const OCCASION_LABELS: Record<string, string> = {
  birthday: 'Birthday Party',
  anniversary: 'Anniversary Celebration',
  'baby-shower': 'Baby Shower',
  bachelorette: 'Bachelorette Party',
  'theme-party': 'Theme Party',
  corporate: 'Corporate Event',
};

const VIBE_LABELS: Record<string, string> = {
  elegant: 'elegant & classy',
  colorful: 'colorful & fun',
  minimalist: 'minimalist chic',
  whimsical: 'whimsical & dreamy',
  vintage: 'vintage & rustic',
  bold: 'bold & dramatic',
};

const BUDGET_LABELS: Record<string, string> = {
  low: '₹1,500–₹3,000',
  mid: '₹3,000–₹6,000',
  high: '₹6,000–₹12,000',
  premium: '₹12,000+',
};

const WHEN_LABELS: Record<string, string> = {
  today: 'today',
  tomorrow: 'tomorrow',
  thisweek: 'this week',
  nextweek: 'next week or later',
};

export default function PartyPlannerQuiz() {
  const { cityName } = useCity();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);

  const current = STEPS[step];
  const progress = ((step) / STEPS.length) * 100;

  const pick = (id: string) => {
    const updated = { ...answers, [current.id]: id };
    setAnswers(updated);
    if (step < STEPS.length - 1) {
      setTimeout(() => setStep(s => s + 1), 220);
    } else {
      setTimeout(() => setDone(true), 220);
    }
  };

  const reset = () => { setStep(0); setAnswers({}); setDone(false); };

  const sendToWhatsApp = () => {
    const occ = OCCASION_LABELS[answers.occasion] || answers.occasion;
    const vibe = VIBE_LABELS[answers.vibe] || answers.vibe;
    const guests = answers.guests;
    const budget = BUDGET_LABELS[answers.budget] || answers.budget;
    const when = WHEN_LABELS[answers.when] || answers.when;

    const guestMap: Record<string, string> = {
      intimate: 'less than 10',
      small: '10–25',
      medium: '25–50',
      large: '50+',
    };

    const msg = `Hi! I just used the Party Planner on your website and here's what I need:

🎉 *Occasion:* ${occ}
✨ *Vibe:* ${vibe.charAt(0).toUpperCase() + vibe.slice(1)}
👥 *Guests:* ${guestMap[guests] || guests}
💰 *Budget:* ${budget}
📅 *When:* ${when.charAt(0).toUpperCase() + when.slice(1)}
📍 *City:* ${cityName}

Can you suggest some packages for me?`;

    const url = `https://wa.me/${WA_NUM}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  if (done) {
    const occ = OCCASION_LABELS[answers.occasion];
    const vibe = VIBE_LABELS[answers.vibe];
    return (
      <div className="bg-gradient-to-br from-orange-50 to-pink-50 rounded-3xl p-6 text-center max-w-md mx-auto shadow-lg border border-orange-100">
        <div className="text-5xl mb-3">🎊</div>
        <h3 className="text-xl font-extrabold text-gray-800 mb-1">Your Party Profile is Ready!</h3>
        <p className="text-sm text-gray-500 mb-5">Share this with our team and get a custom quote in minutes</p>

        <div className="bg-white rounded-2xl p-4 mb-5 text-left space-y-2 shadow-sm">
          {Object.entries({
            '🎉 Occasion': OCCASION_LABELS[answers.occasion],
            '✨ Vibe': vibe?.charAt(0).toUpperCase() + vibe?.slice(1),
            '👥 Guests': { intimate: '< 10 people', small: '10–25 people', medium: '25–50 people', large: '50+ people' }[answers.guests] || answers.guests,
            '💰 Budget': BUDGET_LABELS[answers.budget],
            '📅 When': WHEN_LABELS[answers.when]?.charAt(0).toUpperCase() + WHEN_LABELS[answers.when]?.slice(1),
            '📍 City': cityName,
          }).map(([k, v]) => (
            <div key={k} className="flex justify-between items-center text-sm">
              <span className="text-gray-500">{k}</span>
              <span className="font-semibold text-gray-800">{v}</span>
            </div>
          ))}
        </div>

        <button
          onClick={sendToWhatsApp}
          className="w-full bg-green-500 hover:bg-green-600 active:scale-95 text-white font-bold py-3.5 rounded-2xl text-sm transition flex items-center justify-center gap-2 shadow-md">
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.978-1.306A9.962 9.962 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18a7.959 7.959 0 01-4.065-1.112l-.29-.173-3.005.788.802-2.924-.19-.3A7.96 7.96 0 014 12c0-4.418 3.582-8 8-8s8 3.582 8 8-3.582 8-8 8z"/></svg>
          Send to WhatsApp & Get a Quote
        </button>
        <button onClick={reset} className="mt-3 text-xs text-gray-400 hover:text-gray-600 transition underline underline-offset-2">
          Start over
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden max-w-md mx-auto">
      {/* Progress bar */}
      <div className="h-1.5 bg-gray-100">
        <div
          className="h-full bg-gradient-to-r from-orange-400 to-pink-500 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="p-5">
        {/* Step counter */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-[11px] font-bold text-orange-500 uppercase tracking-widest">
            Step {step + 1} of {STEPS.length}
          </span>
          {step > 0 && (
            <button
              onClick={() => setStep(s => s - 1)}
              className="text-xs text-gray-400 hover:text-gray-600 transition flex items-center gap-1">
              ← Back
            </button>
          )}
        </div>

        {/* Question */}
        <h3 className="text-lg font-extrabold text-gray-800 mb-1">{current.q}</h3>
        <p className="text-xs text-gray-400 mb-5">{current.sub}</p>

        {/* Options */}
        <div className="grid grid-cols-2 gap-2.5">
          {current.opts.map(opt => {
            const selected = answers[current.id] === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => pick(opt.id)}
                className={`flex items-center gap-3 p-3 rounded-2xl border-2 text-left transition-all active:scale-95 ${
                  selected
                    ? 'border-orange-400 bg-orange-50 shadow-sm'
                    : 'border-gray-100 hover:border-orange-200 hover:bg-orange-50/50'
                }`}>
                <span className="text-2xl flex-none">{opt.emoji}</span>
                <span className={`text-xs font-semibold leading-tight ${selected ? 'text-orange-700' : 'text-gray-700'}`}>
                  {opt.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SERVICES } from '@/lib/config';

interface Step {
  question: string;
  emoji: string;
  options: { label: string; value: string; emoji: string }[];
}

const STEPS: Step[] = [
  {
    question: "What's the occasion?",
    emoji: '🎊',
    options: [
      { label: 'Birthday', value: 'birthday-decoration', emoji: '🎂' },
      { label: 'Anniversary', value: 'anniversary-decoration', emoji: '💑' },
      { label: 'Baby Shower', value: 'baby-shower', emoji: '🍼' },
      { label: 'Bachelorette', value: 'bachelorette-party', emoji: '👰' },
      { label: 'Kids Party', value: 'activities', emoji: '🎪' },
      { label: 'Corporate', value: 'corporate-events', emoji: '🏢' },
    ],
  },
  {
    question: "What's your budget?",
    emoji: '💰',
    options: [
      { label: 'Under ₹2,000', value: 'budget-low', emoji: '💸' },
      { label: '₹2,000–₹5,000', value: 'budget-mid', emoji: '💵' },
      { label: '₹5,000–₹10,000', value: 'budget-high', emoji: '💎' },
      { label: '₹10,000+', value: 'budget-premium', emoji: '👑' },
    ],
  },
  {
    question: 'What vibe are you going for?',
    emoji: '✨',
    options: [
      { label: 'Romantic & Elegant', value: 'vibe-romantic', emoji: '🌹' },
      { label: 'Fun & Colourful', value: 'vibe-fun', emoji: '🎈' },
      { label: 'Minimal & Modern', value: 'vibe-minimal', emoji: '🤍' },
      { label: 'Pinterest / Aesthetic', value: 'pinterest-edition', emoji: '📌' },
    ],
  },
];

export default function PackageFinder({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);

  const current = STEPS[step];

  const pick = (value: string) => {
    const next = [...answers, value];
    setAnswers(next);
    if (step < STEPS.length - 1) {
      setStep(s => s + 1);
    } else {
      // Determine destination
      const occasion = next[0];
      const vibe = next[2];
      const dest = vibe === 'pinterest-edition' ? '/pinterest-edition' : `/${occasion}`;
      onClose();
      router.push(dest);
    }
  };

  const back = () => {
    setAnswers(a => a.slice(0, -1));
    setStep(s => s - 1);
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-pink-500 px-6 pt-6 pb-8 text-white text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/70 hover:text-white text-xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition"
          >
            ✕
          </button>
          <div className="text-4xl mb-2">{current.emoji}</div>
          <h2 className="text-xl font-extrabold leading-tight">{current.question}</h2>
          {/* Progress dots */}
          <div className="flex justify-center gap-1.5 mt-3">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all ${i <= step ? 'bg-white w-6' : 'bg-white/40 w-1.5'}`}
              />
            ))}
          </div>
        </div>

        {/* Negative margin pull-up trick */}
        <div className="px-5 py-5 -mt-4 bg-white rounded-t-3xl grid grid-cols-2 gap-2.5">
          {current.options.map(opt => (
            <button
              key={opt.value}
              onClick={() => pick(opt.value)}
              className="flex flex-col items-center gap-1.5 p-3.5 rounded-2xl border-2 border-gray-100 hover:border-orange-400 hover:bg-orange-50 transition-all text-center group"
            >
              <span className="text-3xl group-hover:scale-110 transition-transform">{opt.emoji}</span>
              <span className="text-xs font-semibold text-gray-700">{opt.label}</span>
            </button>
          ))}
        </div>

        {step > 0 && (
          <div className="px-5 pb-5">
            <button onClick={back} className="w-full text-sm text-gray-400 hover:text-gray-600 font-medium py-2 transition">
              ← Go back
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

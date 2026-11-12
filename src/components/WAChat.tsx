'use client';
import { useState, useEffect } from 'react';

const QUICK_REPLIES = [
  { label: '🎂 Birthday Decoration', text: 'Hi! I want to book a birthday decoration. Can you help me?' },
  { label: '💑 Anniversary Setup', text: 'Hi! I need an anniversary decoration setup. Please share details!' },
  { label: '📦 Check Package Prices', text: 'Hi! Can you share the package prices and options available?' },
  { label: '📅 Check Slot Availability', text: 'Hi! I want to check slot availability for my event. Can you help?' },
  { label: '🎁 Surprise Room Setup', text: 'Hi! I want to book a surprise room decoration. Please help!' },
  { label: '💰 Get Custom Quote', text: 'Hi! I need a custom decoration quote for my event. Can you help?' },
];

const CHAT_INTRO = "Hi there! 👋 How can I help you celebrate today?";
const RESPONSE_DELAY_MS = 800;

export default function WAChat() {
  const [open, setOpen] = useState(false);
  const [replied, setReplied] = useState(false);
  const [showBubble, setShowBubble] = useState(false);

  // After 4s, show a notification bubble to draw attention
  useEffect(() => {
    const t = setTimeout(() => setShowBubble(true), 4000);
    return () => clearTimeout(t);
  }, []);

  const handleQuickReply = (text: string) => {
    const url = `https://wa.me/918073552837?text=${encodeURIComponent(text)}`;
    setReplied(true);
    setTimeout(() => window.open(url, '_blank'), RESPONSE_DELAY_MS);
  };

  return (
    <>
      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-24 right-4 md:bottom-6 md:right-6 z-[150] w-[min(340px,calc(100vw-32px))] rounded-3xl shadow-2xl overflow-hidden border border-gray-100"
          style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.18)' }}>

          {/* Header */}
          <div className="bg-[#075e54] px-4 py-3.5 flex items-center gap-3 text-white relative">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-xl flex-shrink-0">🎉</div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-sm">12th Hour Events</div>
              <div className="text-xs text-green-200 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
                Usually replies in 5 minutes
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-white/60 hover:text-white text-lg w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition flex-shrink-0">✕</button>
          </div>

          {/* Chat body */}
          <div className="bg-[#e5ddd5] px-4 py-4 min-h-[180px]" style={{
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect width='80' height='80' fill='%23e5ddd5'/%3E%3C/svg%3E\")",
          }}>
            {/* Bot message bubble */}
            <div className="flex items-end gap-2 mb-4">
              <div className="w-7 h-7 rounded-full bg-[#075e54] flex items-center justify-center text-xs flex-shrink-0 mb-0.5">🎉</div>
              <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm max-w-[85%]">
                <p className="text-sm text-gray-800 leading-relaxed">{CHAT_INTRO}</p>
                <div className="text-[10px] text-gray-400 mt-1 text-right">12th Hour Events</div>
              </div>
            </div>

            {/* After user taps quick reply */}
            {replied && (
              <div className="flex justify-end mb-2">
                <div className="bg-[#dcf8c6] rounded-2xl rounded-tr-sm px-4 py-2.5 shadow-sm max-w-[80%]">
                  <p className="text-sm text-gray-800">Opening WhatsApp…</p>
                  <div className="text-[10px] text-gray-400 mt-1 text-right flex items-center justify-end gap-1">
                    Just now <span className="text-blue-500">✓✓</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick replies */}
          <div className="bg-white border-t border-gray-100 px-3 py-3">
            <p className="text-[10px] text-gray-400 uppercase font-semibold tracking-wider mb-2 px-1">Quick replies</p>
            <div className="flex flex-col gap-1.5 max-h-[180px] overflow-y-auto">
              {QUICK_REPLIES.map(qr => (
                <button
                  key={qr.label}
                  onClick={() => handleQuickReply(qr.text)}
                  className="text-left text-sm text-[#075e54] font-medium border border-[#075e54]/25 hover:border-[#075e54]/60 hover:bg-[#075e54]/5 px-3.5 py-2 rounded-xl transition-all active:scale-95"
                >
                  {qr.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Floating trigger button */}
      <div className="fixed bottom-[72px] right-4 md:bottom-5 md:right-6 z-[150] flex flex-col items-end gap-2">
        {/* Notification bubble */}
        {showBubble && !open && (
          <button
            onClick={() => { setOpen(true); setShowBubble(false); }}
            className="bg-white text-gray-800 text-sm font-medium px-4 py-2.5 rounded-2xl rounded-br-sm shadow-xl border border-gray-100 max-w-[220px] text-left animate-bounce-soft hover:shadow-2xl transition"
            style={{ animation: 'fadeSlideUp 0.4s ease both' }}
          >
            💬 <span className="font-semibold">We&apos;re here!</span> Chat to book your decoration
            <button className="ml-2 text-gray-400 hover:text-gray-600 text-xs" onClick={e => { e.stopPropagation(); setShowBubble(false); }}>✕</button>
          </button>
        )}

        <button
          onClick={() => { setOpen(!open); setShowBubble(false); }}
          className="wa-chat-btn w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-200 hover:scale-110 active:scale-95 relative"
          style={{ background: '#25d366' }}
          aria-label="Chat on WhatsApp"
        >
          <svg width="30" height="30" viewBox="0 0 36 36" fill="none">
            <path d="M18 1C8.6 1 1 8.6 1 18c0 3.1.8 6 2.3 8.6L1 35l8.6-2.3C12 34.2 15 35 18 35c9.4 0 17-7.6 17-17S27.4 1 18 1z" fill="white"/>
            <path d="M26.5 23.5c-.4 1.1-2 2-3.3 2.3-.9.2-2.1.3-6.1-1.3-5.1-2-8.4-7.2-8.7-7.5-.3-.3-2.4-3.2-2.4-6.1 0-2.9 1.5-4.3 2-4.9.5-.6 1.1-.7 1.5-.7.4 0 .7 0 1 .1.3 0 .8-.1 1.2.9.4 1 1.5 3.6 1.6 3.9.1.3.2.6 0 1-.2.4-.3.7-.6 1-.3.4-.6.7-.9 1-.3.3-.6.6-.3 1.1.4.5 1.6 2.6 3.4 4.2 2.3 2 4.3 2.7 4.9 3 .6.3 1 .2 1.3-.1.4-.4 1.5-1.8 1.9-2.4.4-.6.8-.5 1.4-.3.6.2 3.6 1.7 4.2 2 .6.3 1 .4 1.1.7.1.3.1 1.5-.3 2.6z" fill="#25d366"/>
          </svg>
          {/* Pulsing ring */}
          {!open && (
            <span className="absolute inset-0 rounded-full border-2 border-green-400 opacity-0"
              style={{ animation: 'wa-pulse 2s ease-out infinite' }} />
          )}
        </button>
      </div>

      <style>{`
        @keyframes wa-pulse {
          0% { opacity: 0.8; transform: scale(1); }
          100% { opacity: 0; transform: scale(1.6); }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}

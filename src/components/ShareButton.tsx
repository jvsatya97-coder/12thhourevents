'use client';
import { useState } from 'react';

interface Props {
  title: string;
  text?: string;
  url?: string;
  className?: string;
}

export default function ShareButton({ title, text, url, className = '' }: Props) {
  const [copied, setCopied] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const shareText = text || title;

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title, text: shareText, url: shareUrl });
      } catch {
        // User cancelled or not supported
      }
    } else {
      setShowMenu(s => !s);
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback: select text
    }
    setShowMenu(false);
  };

  const shareWA = () => {
    window.open(
      `https://wa.me/?text=${encodeURIComponent(`${shareText}\n${shareUrl}`)}`,
      '_blank'
    );
    setShowMenu(false);
  };

  return (
    <div className="relative">
      <button
        onClick={handleNativeShare}
        className={`flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-orange-500 transition-colors ${className}`}
        title="Share this package"
      >
        {copied ? (
          <>✅ <span>Copied!</span></>
        ) : (
          <>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
            <span>Share</span>
          </>
        )}
      </button>

      {showMenu && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
          <div className="absolute right-0 top-full mt-2 z-50 bg-white rounded-2xl shadow-xl border border-gray-100 w-44 overflow-hidden">
            <button
              onClick={copyLink}
              className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
            >
              🔗 Copy Link
            </button>
            <button
              onClick={shareWA}
              className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors border-t border-gray-50"
            >
              💬 Share on WhatsApp
            </button>
          </div>
        </>
      )}
    </div>
  );
}

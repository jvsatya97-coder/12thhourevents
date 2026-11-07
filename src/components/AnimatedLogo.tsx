'use client';

/**
 * Animated 12th Hour clock logo for the navbar.
 * Features:
 *  - Orange pulsing background circle
 *  - Spinning orbit ring with a sparkle dot
 *  - Ticking minute hand (slight rock animation)
 *  - Hour hand pointing near 12
 */
export default function AnimatedLogo() {
  return (
    <span className="animated-logo-wrap" aria-hidden="true">
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="animated-logo-svg"
      >
        {/* Animated glow/pulse ring */}
        <circle cx="24" cy="24" r="23" className="logo-pulse-ring" />

        {/* Orange filled background circle */}
        <circle cx="24" cy="24" r="21" fill="#ff6b00" />

        {/* White clock face */}
        <circle cx="24" cy="24" r="15" fill="white" />

        {/* Clock tick marks */}
        <line x1="24" y1="10" x2="24" y2="13" stroke="#ff6b00" strokeWidth="2" strokeLinecap="round" />
        <line x1="24" y1="35" x2="24" y2="38" stroke="#ff6b00" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="10" y1="24" x2="13" y2="24" stroke="#ff6b00" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="35" y1="24" x2="38" y2="24" stroke="#ff6b00" strokeWidth="1.5" strokeLinecap="round" />

        {/* Hour hand — static, pointing to 12 */}
        <line
          x1="24" y1="24" x2="24" y2="13"
          stroke="#1a1a2e" strokeWidth="2.5" strokeLinecap="round"
        />

        {/* Minute hand — animated tick */}
        <line
          x1="24" y1="24" x2="19.5" y2="13.5"
          stroke="#ff6b00" strokeWidth="2" strokeLinecap="round"
          className="logo-minute-hand"
        />

        {/* Center dot */}
        <circle cx="24" cy="24" r="2" fill="#1a1a2e" />

        {/* Spinning orbit sparkle — small dot that orbits */}
        <g className="logo-orbit">
          <circle cx="24" cy="4" r="2.5" fill="#ffd700" />
          <circle cx="24" cy="4" r="1.2" fill="white" />
        </g>
      </svg>

      <style>{`
        .animated-logo-wrap {
          display: inline-flex;
          align-items: center;
          flex-shrink: 0;
        }

        .animated-logo-svg {
          width: 36px;
          height: 36px;
          overflow: visible;
        }

        /* Pulsing glow ring */
        .logo-pulse-ring {
          fill: none;
          stroke: #ff6b00;
          stroke-width: 2;
          opacity: 0;
          animation: logoPulse 2.4s ease-out infinite;
          transform-origin: 24px 24px;
        }

        @keyframes logoPulse {
          0%   { r: 21; opacity: 0.6; }
          100% { r: 29; opacity: 0; }
        }

        /* Minute hand: subtle tick every 2s */
        .logo-minute-hand {
          transform-origin: 24px 24px;
          animation: logoTick 2s steps(1, end) infinite;
        }

        @keyframes logoTick {
          0%   { transform: rotate(0deg); }
          25%  { transform: rotate(6deg); }
          50%  { transform: rotate(0deg); }
          75%  { transform: rotate(-3deg); }
          100% { transform: rotate(0deg); }
        }

        /* Orbit: a golden dot spins around the clock */
        .logo-orbit {
          transform-origin: 24px 24px;
          animation: logoOrbit 4s linear infinite;
        }

        @keyframes logoOrbit {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </span>
  );
}

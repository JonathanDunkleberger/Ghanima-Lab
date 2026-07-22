"use client";

import { useId } from "react";

/**
 * Ghanima — Feyris' mascot logo.
 * A silver chinchilla doll-face Persian kitten, dedicated to a very good girl.
 */
export function CatLogo({
  size = 32,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        {/* Silver chinchilla fur — warm pearl at the crown, cooling to a soft slate shadow */}
        <linearGradient id={`furGrad-${uid}`} x1="16" y1="8" x2="48" y2="58">
          <stop offset="0%" stopColor="#f5f2ec" />
          <stop offset="45%" stopColor="#d8d4cb" />
          <stop offset="100%" stopColor="#a9a59c" />
        </linearGradient>
        {/* Warm amber-gold eyes */}
        <radialGradient id={`irisGrad-${uid}`} cx="45%" cy="40%" r="65%">
          <stop offset="0%" stopColor="#f0d68a" />
          <stop offset="60%" stopColor="#c8a44e" />
          <stop offset="100%" stopColor="#8a7235" />
        </radialGradient>
        {/* Crown gold */}
        <linearGradient id={`goldGrad-${uid}`} x1="24" y1="6" x2="40" y2="18">
          <stop offset="0%" stopColor="#f0d68a" />
          <stop offset="55%" stopColor="#c8a44e" />
          <stop offset="100%" stopColor="#8a7235" />
        </linearGradient>
        {/* Royal purple gems */}
        <radialGradient id={`gemGrad-${uid}`} cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#9b7fd4" />
          <stop offset="100%" stopColor="#5a3d8a" />
        </radialGradient>
        <radialGradient id={`blushGrad-${uid}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#e8927c" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#e8927c" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Ears — small, rounded, tucked into the fur */}
      <ellipse
        cx="15.5"
        cy="20"
        rx="7"
        ry="9"
        transform="rotate(-18 15.5 20)"
        fill={`url(#furGrad-${uid})`}
      />
      <ellipse
        cx="48.5"
        cy="20"
        rx="7"
        ry="9"
        transform="rotate(18 48.5 20)"
        fill={`url(#furGrad-${uid})`}
      />
      <ellipse
        cx="16"
        cy="22"
        rx="3"
        ry="4"
        transform="rotate(-18 16 22)"
        fill="#e8927c"
        opacity="0.35"
      />
      <ellipse
        cx="48"
        cy="22"
        rx="3"
        ry="4"
        transform="rotate(18 48 22)"
        fill="#e8927c"
        opacity="0.35"
      />

      {/* Head — wide, flat "doll face" Persian silhouette */}
      <ellipse cx="32" cy="39" rx="25.5" ry="20.5" fill={`url(#furGrad-${uid})`} />

      {/* Center part + cheek-fluff highlight */}
      <ellipse cx="32" cy="27" rx="5" ry="11" fill="#ffffff" opacity="0.14" />
      <ellipse cx="32" cy="45" rx="15" ry="11" fill="#ffffff" opacity="0.16" />

      {/* Cheek blush */}
      <circle cx="13.5" cy="45" r="4.5" fill={`url(#blushGrad-${uid})`} />
      <circle cx="50.5" cy="45" r="4.5" fill={`url(#blushGrad-${uid})`} />

      {/* Little crown, resting between the ears */}
      <path
        d="M24 18.5 L26.8 9 L30 15 L32 6 L34 15 L37.2 9 L40 18.5 Z"
        fill={`url(#goldGrad-${uid})`}
      />
      <ellipse cx="32" cy="11.5" rx="2.1" ry="2.7" fill={`url(#gemGrad-${uid})`} />
      <circle cx="31.3" cy="10.4" r="0.55" fill="#fff" opacity="0.8" />
      <path d="M26.3 13.2L27.5 11.4L28.7 13.2L27.5 15Z" fill={`url(#gemGrad-${uid})`} />
      <path d="M35.3 13.2L36.5 11.4L37.7 13.2L36.5 15Z" fill={`url(#gemGrad-${uid})`} />

      {/* Eyes — big, round, sleepy-sweet doll eyes */}
      <ellipse cx="21" cy="37.5" rx="6.5" ry="7" fill={`url(#irisGrad-${uid})`} />
      <ellipse cx="43" cy="37.5" rx="6.5" ry="7" fill={`url(#irisGrad-${uid})`} />
      <circle cx="21" cy="38.5" r="3.3" fill="#0a0a0f" />
      <circle cx="43" cy="38.5" r="3.3" fill="#0a0a0f" />
      <circle cx="19.2" cy="36" r="1.5" fill="#fff" />
      <circle cx="41.2" cy="36" r="1.5" fill="#fff" />
      <circle cx="23" cy="40" r="0.7" fill="#fff" opacity="0.5" />
      <circle cx="45" cy="40" r="0.7" fill="#fff" opacity="0.5" />
      <path
        d="M15 33.5C17.5 31 24.5 31 27 33.5"
        stroke="#4a4a52"
        strokeWidth="1"
        fill="none"
        strokeLinecap="round"
        opacity="0.4"
      />
      <path
        d="M37 33.5C39.5 31 46.5 31 49 33.5"
        stroke="#4a4a52"
        strokeWidth="1"
        fill="none"
        strokeLinecap="round"
        opacity="0.4"
      />

      {/* Nose — small, flat, pink */}
      <path
        d="M29.6 44.2Q32 42.8 34.4 44.2Q33.9 46.6 32 47.1Q30.1 46.6 29.6 44.2Z"
        fill="#dba3a3"
      />

      {/* Mouth */}
      <path
        d="M27 48.5C29 50.5 30.5 51 32 50C32.5 51 34 50.5 36 48.5"
        stroke="#8a8680"
        strokeWidth="1"
        fill="none"
        strokeLinecap="round"
      />

      {/* Whiskers */}
      <line x1="3" y1="42" x2="16" y2="44" stroke="#8a8680" strokeWidth="0.6" opacity="0.3" />
      <line x1="3" y1="48" x2="16" y2="46" stroke="#8a8680" strokeWidth="0.6" opacity="0.3" />
      <line x1="48" y1="44" x2="61" y2="42" stroke="#8a8680" strokeWidth="0.6" opacity="0.3" />
      <line x1="48" y1="46" x2="61" y2="48" stroke="#8a8680" strokeWidth="0.6" opacity="0.3" />
    </svg>
  );
}

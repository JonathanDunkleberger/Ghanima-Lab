"use client";

/**
 * Side-facing cat outline — quiet silver silhouette mark.
 */
export function CatLogo({
  size = 32,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      {/* Facing right — ears, arched back, tucked paws, soft tail */}
      <path
        d="M14 42
           C12 36 13 28 18 22
           L16 12 L22 18
           L28 14 L30 20
           C36 17 44 18 50 24
           C56 30 56 38 52 44
           C48 50 40 54 30 54
           C22 54 16 50 14 42 Z"
        fill="#e8e6e1"
        fillOpacity="0.92"
      />
      {/* Inner shade for depth without cartoon face details */}
      <path
        d="M22 44
           C20 38 22 30 28 26
           C34 23 42 24 46 30
           C50 36 48 44 42 48
           C34 52 26 50 22 44 Z"
        fill="#9a9791"
        fillOpacity="0.22"
      />
      {/* Ear notch */}
      <path
        d="M18 20 L16.5 13.5 L22 18.5 Z"
        fill="#0c0c0e"
        fillOpacity="0.35"
      />
      <path
        d="M27.5 18 L28.5 12.5 L31 19 Z"
        fill="#0c0c0e"
        fillOpacity="0.28"
      />
      {/* Eye — single quiet mark, green-teal hint */}
      <ellipse cx="42" cy="30" rx="1.6" ry="2" fill="#6f8f86" />
      {/* Nose tip */}
      <circle cx="50.5" cy="33.5" r="1.1" fill="#a66b6b" opacity="0.85" />
      {/* Tail curl */}
      <path
        d="M14 40 C8 38 6 44 10 48 C12 50 14 48 15 46"
        stroke="#c5c2bc"
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
        opacity="0.75"
      />
    </svg>
  );
}

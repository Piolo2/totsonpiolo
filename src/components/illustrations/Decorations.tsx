'use client';

import React from 'react';

interface DecorationProps {
  className?: string;
  size?: number;
}

/**
 * SpeechBubbleHeart - Small rounded speech bubble with a cute dark/red heart
 * Placed next to Piolo's head as in the mockup
 */
export function SpeechBubbleHeart({ className = '' }: DecorationProps) {
  return (
    <svg
      width="56"
      height="48"
      viewBox="0 0 56 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Speech bubble body */}
      <path
        d="M6 20 C6 10, 15 4, 28 4 C41 4, 50 10, 50 20 C50 30, 41 36, 28 36 C24 36, 20 35.5, 17 34.5 L9 42 C8 43, 6 42.5, 6.5 41 L7.5 33 C6.5 30, 6 25, 6 20 Z"
        fill="#FFFFFF"
        stroke="#E6E6EF"
        strokeWidth="2.5"
      />
      {/* Black heart inside as in the mockup */}
      <path
        d="M28 27 C28 27, 21 21, 21 16.5 C21 14, 23 12, 25.5 12 C26.8 12, 27.6 12.6, 28 13.2 C28.4 12.6, 29.2 12, 30.5 12 C33 12, 35 14, 35 16.5 C35 21, 28 27, 28 27 Z"
        fill="#17171C"
      />
    </svg>
  );
}

/**
 * Sparkles - Playful yellow star sparkles
 */
export function Sparkles({ className = '' }: DecorationProps) {
  return (
    <svg
      width="60"
      height="60"
      viewBox="0 0 60 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Big sparkle */}
      <path
        d="M26 18 C26 24, 21 29, 15 29 C21 29, 26 34, 26 40 C26 34, 31 29, 37 29 C31 29, 26 24, 26 18 Z"
        fill="#FFC857"
      />
      {/* Small sparkle top right */}
      <path
        d="M44 8 C44 12, 41 15, 37 15 C41 15, 44 18, 44 22 C44 18, 47 15, 51 15 C47 15, 44 12, 44 8 Z"
        fill="#FFC857"
      />
      {/* Tiny circle */}
      <circle cx="48" cy="38" r="3" fill="#FFC857" />
      <circle cx="12" cy="14" r="2" fill="#FFC857" />
    </svg>
  );
}

/**
 * AccentMarks - Playful yellow dashes / motion accents around text or illustrations
 */
export function AccentMarks({ className = '' }: DecorationProps) {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 28 L24 16" stroke="#FFC857" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M22 36 L34 24" stroke="#FFC857" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M6 18 L14 10" stroke="#FFC857" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

/**
 * FloatingHearts - Soft lavender & pink hearts
 */
export function FloatingHearts({ className = '' }: DecorationProps) {
  return (
    <svg
      width="50"
      height="50"
      viewBox="0 0 50 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Heart 1 */}
      <path
        d="M16 22 C16 22, 10 17, 10 13.5 C10 11.5, 11.5 10, 13.5 10 C14.6 10, 15.3 10.5, 16 11 C16.7 10.5, 17.4 10, 18.5 10 C20.5 10, 22 11.5, 22 13.5 C22 17, 16 22, 16 22 Z"
        fill="#B8B9E8"
      />
      {/* Heart 2 */}
      <path
        d="M34 36 C34 36, 26 29, 26 24 C26 21, 28 19, 31 19 C32.5 19, 33.3 19.8, 34 20.5 C34.7 19.8, 35.5 19, 37 19 C40 19, 42 21, 42 24 C42 29, 34 36, 34 36 Z"
        fill="#FFB8C6"
      />
    </svg>
  );
}


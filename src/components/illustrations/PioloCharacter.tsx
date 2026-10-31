'use client';

import React from 'react';

interface CharacterProps {
  className?: string;
  size?: number;
}

/**
 * PioloDefault - Uses character1.png (Piolo resting cheek on hand)
 */
export function PioloDefault({ className = '', size = 280 }: CharacterProps) {
  return (
    <div
      style={{ width: size, height: size }}
      className={`relative inline-flex items-center justify-center select-none ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/character1.png"
        alt="Piolo"
        width={size}
        height={size}
        className="w-full h-full object-contain drop-shadow-md"
        draggable={false}
      />
    </div>
  );
}

/**
 * PioloHappy - Uses character2.png (Piolo winking, thumbs up with speech bubble heart)
 */
export function PioloHappy({ className = '', size = 280 }: CharacterProps) {
  return (
    <div
      style={{ width: size, height: size }}
      className={`relative inline-flex items-center justify-center select-none ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/character2.png"
        alt="Piolo cheerful"
        width={size}
        height={size}
        className="w-full h-full object-contain drop-shadow-md"
        draggable={false}
      />
    </div>
  );
}

/**
 * PioloWorking - Seated / avatar pose
 */
export function PioloWorking({ className = '', size = 180 }: CharacterProps) {
  return (
    <div
      style={{ width: size, height: size }}
      className={`relative inline-flex items-center justify-center select-none ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/character2.png"
        alt="Piolo working"
        width={size}
        height={size}
        className="w-full h-full object-contain drop-shadow-sm"
        draggable={false}
      />
    </div>
  );
}

/**
 * PioloPeeking - Cute peeking Piolo head for empty wall state
 */
export function PioloPeeking({ className = '', size = 140 }: CharacterProps) {
  return (
    <div
      style={{ width: size, height: size * 0.8 }}
      className={`relative inline-flex items-center justify-center overflow-hidden select-none ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/character1.png"
        alt="Piolo peeking"
        width={size}
        height={size}
        className="w-full h-auto object-contain translate-y-1 drop-shadow-sm"
        draggable={false}
      />
    </div>
  );
}

/**
 * PioloAvatar - Small circle avatar for headers / profile
 */
export function PioloAvatar({ size = 36, className = '' }: { size?: number; className?: string }) {
  return (
    <div
      style={{ width: size, height: size }}
      className={`rounded-full overflow-hidden bg-[#E8EEFF] border-2 border-[#FFC857] flex items-center justify-center shrink-0 shadow-sm ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/character1.png"
        alt="Piolo avatar"
        width={size * 1.3}
        height={size * 1.3}
        className="w-[130%] h-[130%] object-contain translate-y-1"
        draggable={false}
      />
    </div>
  );
}

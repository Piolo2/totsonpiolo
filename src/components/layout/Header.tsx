'use client';

import React from 'react';
import Link from 'next/link';

interface HeaderProps {
  variant?: 'public' | 'wall';
}

export default function Header({ variant = 'public' }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-[#F7F7FC]/90 backdrop-blur-md border-b border-[#E6E6EF]/70">
      <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 group focus:outline-none"
        >
          <div className="w-7 h-7 rounded-lg bg-white border border-[#E6E6EF] shadow-xs flex items-center justify-center text-[#17171C]">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            </svg>
          </div>
          <span className="font-['Nunito',sans-serif] font-black text-base text-[#17171C] tracking-tight">
            TOTS on Piolo
          </span>
        </Link>

        {/* Right Navigation Action */}
        <div>
          {variant === 'public' ? (
            <Link
              href="/wall"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-white border border-[#E6E6EF] text-[#17171C] hover:bg-[#F0F2FA] shadow-xs transition-all font-['Nunito',sans-serif]"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="3" r="3" />
              </svg>
              <span>View TOTS Wall</span>
            </Link>
          ) : (
            <Link
              href="/"
              className="w-8 h-8 rounded-full bg-white border border-[#E6E6EF] text-[#17171C] hover:bg-[#F0F2FA] shadow-xs flex items-center justify-center transition-all"
              title="Return to Home"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { PioloHappy, PioloDefault } from '@/components/illustrations/PioloCharacter';
import { formatRelativeTime } from '@/lib/utils';
import { Message } from '@/lib/db';

export default function WallPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWall() {
      try {
        const res = await fetch('/api/wall', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          setMessages(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error('Failed to load wall messages:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchWall();
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#F7F7FC] dark:bg-[#0D0E12] relative overflow-x-hidden selection:bg-[#DDE0FA] dark:selection:bg-[#34354A] transition-colors">
      {/* Background aura blobs */}
      <div
        className="fixed top-0 right-0 w-72 h-72 rounded-full bg-[#E8EEFF]/60 dark:bg-[#142036]/40 blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="fixed top-1/2 left-0 w-72 h-72 rounded-full bg-[#E8E8FA]/60 dark:bg-[#1C1A32]/40 blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      {/* Header */}
      <Header variant="wall" />

      {/* Main Container - Vertical Mobile Focus */}
      <main className="flex-1 max-w-[420px] w-full mx-auto px-4 py-6">
        {/* Page Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#FFC857" className="shrink-0">
              <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
            </svg>

            <h1 className="font-['Nunito',sans-serif] font-black text-2xl sm:text-3xl text-[#17171C] dark:text-white tracking-tight">
              TOTS Wall
            </h1>

            <svg width="18" height="18" viewBox="0 0 24 24" fill="#FFC857" className="shrink-0">
              <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
            </svg>
          </div>
          <p className="text-[#666779] dark:text-[#9E9EB2] text-xs sm:text-sm mt-1 font-medium">
            Messages that received a reply will appear here!
          </p>
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="bg-white dark:bg-[#16161D] rounded-none p-5 border border-[#E6E6EF] dark:border-[#272736] shadow-xs animate-pulse space-y-3 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#E6E6EF] dark:bg-[#2C2C3C]" />
                  <div className="w-28 h-3.5 rounded bg-[#E6E6EF] dark:bg-[#2C2C3C]" />
                  <div className="ml-auto w-12 h-3 rounded bg-[#E6E6EF] dark:bg-[#2C2C3C]" />
                </div>
                <div className="w-3/4 h-4 rounded bg-[#E6E6EF] dark:bg-[#2C2C3C]" />
                <div className="rounded-none bg-[#F7F7FC] dark:bg-[#1A1A24] p-3 space-y-2">
                  <div className="w-20 h-3 rounded bg-[#E6E6EF] dark:bg-[#2C2C3C]" />
                  <div className="w-full h-3.5 rounded bg-[#E6E6EF] dark:bg-[#2C2C3C]" />
                </div>
              </div>
            ))}
          </div>
        ) : messages.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center text-center py-8 px-4 bg-white/80 dark:bg-[#16161D]/80 rounded-none border border-[#E6E6EF] dark:border-[#272736] shadow-xs transition-colors">
            <PioloHappy size={160} />

            <h2 className="font-['Nunito',sans-serif] font-bold text-lg text-[#17171C] dark:text-white mt-2">
              No tots here yet!
            </h2>
            <p className="text-[#666779] dark:text-[#9E9EB2] text-xs mt-1 mb-5 max-w-xs">
              Be the first to leave a message for Piolo.
            </p>

            <Link
              href="/"
              className="py-2.5 px-5 rounded-[14px] font-['Nunito',sans-serif] font-bold text-xs sm:text-sm text-white dark:text-[#0D0E12] bg-[#202127] dark:bg-white hover:bg-[#32343D] dark:hover:bg-[#EAEAF0] active:scale-[0.98] inline-flex items-center gap-2 shadow-xs transition-all"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
              <span>Send a Message</span>
            </Link>
          </div>
        ) : (
          /* Messages List */
          <div className="space-y-4">
            {messages.map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-[#16161D] rounded-none p-4 sm:p-5 border border-[#E6E6EF] dark:border-[#272736] shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition-colors"
              >
                {/* Message Header */}
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#E8E8FA] dark:bg-[#25243A] flex items-center justify-center text-[#17171C] dark:text-[#C0BFE0]">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                  <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-[#666779] dark:text-[#8E8E9F] font-['Nunito',sans-serif]">
                    ANONYMOUS MESSAGE
                  </span>
                  <span className="ml-auto text-[11px] text-[#9293A5] dark:text-[#68687D] font-medium">
                    {formatRelativeTime(item.createdAt)}
                  </span>
                </div>

                {/* Original Message Content */}
                <div className="mt-2.5 text-[#17171C] dark:text-[#E8E8F0] text-sm leading-relaxed break-words font-medium">
                  {item.content}
                </div>

                {/* Reply section if reply exists */}
                {item.reply && (
                  <div className="mt-3 rounded-none bg-[#E8EEFF]/80 dark:bg-[#1A2240]/60 border border-[#DDE0FA]/80 dark:border-[#2A3050] p-3.5 transition-colors">
                    <div className="flex items-center gap-1.5 text-[11px] font-black text-[#4778F5] dark:text-[#7EA2FF] uppercase tracking-wider font-['Nunito',sans-serif]">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 10 4 15 9 20" />
                        <path d="M20 4v7a4 4 0 0 1-4 4H4" />
                      </svg>
                      <span>PIOLO&apos;S REPLY</span>
                    </div>
                    <div className="mt-1.5 text-xs sm:text-sm text-[#17171C] dark:text-[#E8E8F0] leading-relaxed break-words font-medium">
                      {item.reply}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Bottom Invitation */}
            <div className="pt-6 flex flex-col items-center text-center">
              <PioloDefault size={140} />
              <div className="text-xs font-bold text-[#17171C] dark:text-white font-['Nunito',sans-serif] mt-1">
                Be the first to leave a message for Piolo.
              </div>
              <Link
                href="/"
                className="mt-2.5 py-2.5 px-5 rounded-[14px] text-xs font-['Nunito',sans-serif] font-bold text-white dark:text-[#0D0E12] bg-[#202127] dark:bg-white hover:bg-[#32343D] dark:hover:bg-[#EAEAF0] inline-flex items-center gap-1.5 shadow-xs transition-all"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
                <span>Send a Message</span>
              </Link>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { PioloDefault, PioloHappy } from '@/components/illustrations/PioloCharacter';
import { SpeechBubbleHeart, AccentMarks, Sparkles } from '@/components/illustrations/Decorations';
import { useToast } from '@/components/ui/Toast';

export default function HomePage() {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { showToast } = useToast();

  const maxLength = 500;
  const isNearLimit = content.length > maxLength * 0.9;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = content.trim();

    if (!trimmed) {
      showToast('Please type a message first!', 'info');
      return;
    }

    if (trimmed.length > maxLength) {
      showToast('Message is too long. Maximum 500 characters.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: trimmed }),
      });

      const data = await res.json();

      if (res.ok) {
        setIsSubmitted(true);
        setContent('');
        showToast('Your message has been sent!', 'success');
      } else if (res.status === 429) {
        showToast(data.error || 'Please wait a moment before sending another message.', 'info');
      } else {
        showToast(data.error || 'Could not send message. Please try again.', 'error');
      }
    } catch {
      showToast('Something went wrong. Please check your connection.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setContent('');
    setIsSubmitted(false);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#F7F7FC] dark:bg-[#0D0E12] relative overflow-x-hidden selection:bg-[#DDE0FA] dark:selection:bg-[#34354A] transition-colors">
      {/* Background soft pastel auras */}
      <div
        className="fixed -top-20 -left-20 w-72 h-72 rounded-full bg-[#E8E8FA]/70 dark:bg-[#1C1A32]/40 blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="fixed top-1/2 -right-20 w-72 h-72 rounded-full bg-[#E8EEFF]/70 dark:bg-[#142036]/40 blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      {/* Header */}
      <Header variant="public" />

      {/* Vertical Mobile Container */}
      <main className="flex-1 max-w-[420px] w-full mx-auto px-4 py-4 flex flex-col items-center justify-center">
        {!isSubmitted ? (
          /* ========================================================== */
          /* LANDING STATE (Flat Boxes, Rounded Buttons)                */
          /* ========================================================== */
          <div className="w-full flex flex-col items-center">
            {/* Top Heading */}
            <div className="text-center w-full mb-3">
              <div className="inline-flex items-center justify-center gap-1.5">
                <h1 className="font-['Nunito',sans-serif] font-black text-3xl sm:text-4xl text-[#17171C] dark:text-white tracking-tight">
                  TOTS on Piolo
                </h1>
                <span className="text-[#FFC857] text-xl font-bold tracking-tighter">///</span>
              </div>
              <h2 className="text-[#17171C] dark:text-[#E8E8F0] font-bold text-base sm:text-lg mt-1 font-['Nunito',sans-serif]">
                Got something to tell me?
              </h2>
              <p className="text-[#666779] dark:text-[#9E9EB2] text-xs sm:text-sm mt-0.5">
                Don&apos;t be shy. This is your safe place. ♡
              </p>
            </div>

            {/* Character Illustration using character1.png */}
            <div className="relative my-2 flex items-center justify-center">
              <div className="absolute -top-1 -left-4 pointer-events-none">
                <AccentMarks className="rotate-12 scale-90" />
              </div>
              <div className="absolute top-2 -right-3 pointer-events-none">
                <Sparkles className="scale-75" />
              </div>

              <PioloDefault size={220} className="transition-transform duration-300 hover:scale-[1.02]" />

              <div className="absolute top-12 -right-3 pointer-events-none animate-bounce-subtle">
                <SpeechBubbleHeart />
              </div>
            </div>

            {/* Message Form Box - Flat / No curve on box */}
            <div className="w-full bg-white dark:bg-[#16161D] rounded-none p-4 sm:p-5 border border-[#E6E6EF] dark:border-[#272736] shadow-xs mt-2 transition-colors">
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                {/* Textarea - Flat box */}
                <div className="relative">
                  <div className="absolute top-3.5 left-3.5 text-[#9293A5] dark:text-[#68687D] pointer-events-none">
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 20h9" />
                      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                    </svg>
                  </div>

                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Your anonymous message..."
                    maxLength={maxLength}
                    rows={4}
                    disabled={isSubmitting}
                    className="w-full pl-10 pr-3 pt-3 pb-7 rounded-none border border-[#E6E6EF] dark:border-[#2C2C3E] bg-[#FCFCFF] dark:bg-[#1A1A24] text-[#17171C] dark:text-white placeholder:text-[#9293A5] dark:placeholder:text-[#68687D] text-sm focus:outline-none focus:ring-2 focus:ring-[#17171C]/20 dark:focus:ring-white/20 focus:border-[#17171C] dark:focus:border-white resize-none transition-all"
                  />

                  {/* Character counter */}
                  <div
                    className={`absolute bottom-2.5 right-3 text-[11px] font-semibold select-none ${
                      isNearLimit ? 'text-red-500' : 'text-[#9293A5] dark:text-[#68687D]'
                    }`}
                  >
                    {content.length}/{maxLength}
                  </div>
                </div>

                {/* Submit Button - Keeps Rounded Curve */}
                <button
                  type="submit"
                  disabled={isSubmitting || !content.trim()}
                  className={`
                    w-full py-3 px-5 rounded-[16px] font-['Nunito',sans-serif] font-bold text-sm
                    bg-[#202127] dark:bg-white text-white dark:text-[#0D0E12]
                    hover:bg-[#32343D] dark:hover:bg-[#EAEAF0] active:scale-[0.99]
                    flex items-center justify-center gap-2 shadow-sm
                    transition-all duration-150
                    ${isSubmitting || !content.trim() ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
                  `}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4 text-white dark:text-[#0D0E12]" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="22" y1="2" x2="11" y2="13" />
                        <polygon points="22 2 15 22 11 13 2 9 22 2" />
                      </svg>
                      <span>Send Anonymously</span>
                    </>
                  )}
                </button>
              </form>

              {/* Privacy note */}
              <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-[#9293A5] dark:text-[#68687D] text-center">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <span>Your message will remain private until Piolo replies.</span>
              </div>
            </div>
          </div>
        ) : (
          /* ========================================================== */
          /* SUCCESS STATE                                              */
          /* ========================================================== */
          <div className="w-full flex flex-col items-center text-center animate-fade-in">
            <div className="relative mb-2">
              <div className="absolute -top-2 -left-3 pointer-events-none">
                <Sparkles className="scale-75" />
              </div>
              <PioloHappy size={210} />
            </div>

            {/* Success Box - Flat / No curve on box */}
            <div className="w-full bg-white dark:bg-[#16161D] rounded-none p-6 border border-[#E6E6EF] dark:border-[#272736] shadow-xs flex flex-col items-center transition-colors">
              <div className="w-12 h-12 rounded-full bg-[#E8EEFF] dark:bg-[#1E2845] text-[#4778F5] dark:text-[#7EA2FF] flex items-center justify-center mb-3">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>

              <h2 className="font-['Nunito',sans-serif] font-black text-xl text-[#17171C] dark:text-white tracking-tight">
                Your message has been sent!
              </h2>

              <p className="text-[#666779] dark:text-[#9E9EB2] text-xs sm:text-sm mt-1.5 leading-relaxed">
                Thank you for sharing your thoughts.
                <br />
                Piolo will receive it anonymously. ♡
              </p>

              {/* Action Button - Keeps Rounded Curve */}
              <button
                onClick={handleReset}
                className="w-full mt-5 py-3 px-5 rounded-[16px] font-['Nunito',sans-serif] font-bold text-sm text-white dark:text-[#0D0E12] bg-[#202127] dark:bg-white hover:bg-[#32343D] dark:hover:bg-[#EAEAF0] active:scale-[0.99] flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
                <span>Send Another Message</span>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

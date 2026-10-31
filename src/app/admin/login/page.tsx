'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { PioloAvatar } from '@/components/illustrations/PioloCharacter';
import { useToast } from '@/components/ui/Toast';
import ThemeToggle from '@/components/ui/ThemeToggle';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { showToast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        showToast('Welcome back, Piolo!', 'success');
        router.push('/admin');
        router.refresh();
      } else {
        setError('Incorrect password. Please try again.');
      }
    } catch {
      setError('Something went wrong. Please check connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 bg-[#F7F7FC] dark:bg-[#0D0E12] relative overflow-hidden transition-colors">
      {/* Theme Toggle - top right */}
      <div className="absolute top-5 right-5">
        <ThemeToggle size="md" />
      </div>

      {/* Return to Public Site Link */}
      <Link
        href="/"
        className="absolute top-5 left-5 inline-flex items-center gap-1.5 text-xs font-bold text-[#666779] dark:text-[#8E8E9F] hover:text-[#17171C] dark:hover:text-white transition-colors font-['Nunito',sans-serif]"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
        <span>Back to TOTS</span>
      </Link>

      {/* Login Card - Flat / No curve on box */}
      <div className="w-full max-w-[360px] bg-white dark:bg-[#16161D] rounded-none p-6 sm:p-7 border border-[#E6E6EF] dark:border-[#272736] shadow-sm relative z-10 flex flex-col items-center transition-colors">
        <div className="mb-3 w-12 h-12 rounded-full border border-[#E6E6EF] dark:border-[#2C2C3C] overflow-hidden">
          <PioloAvatar size={48} className="border-none" />
        </div>

        <h1 className="font-['Nunito',sans-serif] font-black text-xl text-[#17171C] dark:text-white text-center tracking-tight">
          Admin Login
        </h1>
        <p className="text-[#666779] dark:text-[#9E9EB2] text-xs text-center mt-0.5">
          Enter password to access your inbox.
        </p>

        {/* Form */}
        <form onSubmit={handleLogin} className="w-full mt-5 space-y-3.5">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#666779] dark:text-[#8E8E9F] mb-1 font-['Nunito',sans-serif]">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password..."
              disabled={loading}
              autoFocus
              className="w-full px-3.5 py-2.5 rounded-none border border-[#E6E6EF] dark:border-[#2C2C3E] bg-[#FCFCFF] dark:bg-[#1A1A24] text-[#17171C] dark:text-white placeholder:text-[#9293A5] dark:placeholder:text-[#68687D] text-sm focus:outline-none focus:ring-2 focus:ring-[#17171C]/20 dark:focus:ring-white/20 focus:border-[#17171C] dark:focus:border-white transition-all"
            />
          </div>

          {error && (
            <div className="text-[11px] text-[#17171C] dark:text-white font-semibold bg-[#F4F4F8] dark:bg-[#1E1E28] px-3 py-2 rounded-none border border-[#E6E6EF] dark:border-[#2C2C3C] flex items-center gap-1.5">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className={`
              w-full py-2.5 px-5 rounded-[14px] font-['Nunito',sans-serif] font-bold text-xs
              bg-[#17171C] dark:bg-white text-white dark:text-[#0D0E12]
              hover:bg-[#2C2D35] dark:hover:bg-[#EAEAF0] active:scale-[0.99]
              flex items-center justify-center gap-2 shadow-xs transition-all
              ${loading || !password ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            {loading ? (
              <span className="flex items-center gap-1.5">
                <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Signing In...
              </span>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

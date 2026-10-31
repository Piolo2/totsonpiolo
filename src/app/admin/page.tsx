'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { PioloHappy, PioloAvatar } from '@/components/illustrations/PioloCharacter';
import { formatRelativeTime } from '@/lib/utils';
import { Message } from '@/lib/db';

interface Stats {
  total: number;
  unread: number;
  replied: number;
  published: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentMessages, setRecentMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [statsRes, messagesRes] = await Promise.all([
          fetch('/api/admin/stats', { cache: 'no-store' }),
          fetch('/api/admin/messages?filter=all', { cache: 'no-store' }),
        ]);

        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData);
        }

        if (messagesRes.ok) {
          const messagesData = await messagesRes.json();
          setRecentMessages(Array.isArray(messagesData) ? messagesData.slice(0, 4) : []);
        }
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#E6E6EF] dark:border-[#222230]">
        <div>
          <h1 className="font-['Nunito',sans-serif] font-black text-xl text-[#17171C] dark:text-white tracking-tight">
            Dashboard
          </h1>
          <p className="text-[#666779] dark:text-[#9E9EB2] text-xs mt-0.5">
            Here&apos;s an overview of your TOTS.
          </p>
        </div>

        <div className="w-8 h-8 rounded-full border border-[#E6E6EF] dark:border-[#2C2C3C] overflow-hidden">
          <PioloAvatar size={32} className="border-none" />
        </div>
      </div>

      {/* 2x2 Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Total Messages */}
        <div className="bg-white dark:bg-[#16161D] rounded-none p-4 border border-[#E6E6EF] dark:border-[#272736] shadow-xs flex flex-col items-center text-center transition-colors">
          <div className="w-9 h-9 rounded-full bg-[#F4F4F8] dark:bg-[#1E1E28] flex items-center justify-center text-[#17171C] dark:text-[#EDEDF2] mb-2">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
          </div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#666779] dark:text-[#8E8E9F] font-['Nunito',sans-serif]">
            Total Messages
          </div>
          <div className="font-['Nunito',sans-serif] font-black text-2xl text-[#17171C] dark:text-white mt-0.5">
            {loading ? '...' : stats?.total ?? 0}
          </div>
        </div>

        {/* Unread Messages */}
        <div className="bg-white dark:bg-[#16161D] rounded-none p-4 border border-[#E6E6EF] dark:border-[#272736] shadow-xs flex flex-col items-center text-center transition-colors">
          <div className="w-9 h-9 rounded-full bg-[#F4F4F8] dark:bg-[#1E1E28] flex items-center justify-center text-[#17171C] dark:text-[#EDEDF2] mb-2">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 12h-6l-2 3h-4l-2-3H2" />
              <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
            </svg>
          </div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#17171C] dark:text-white font-['Nunito',sans-serif]">
            Unread Messages
          </div>
          <div className="font-['Nunito',sans-serif] font-black text-2xl text-[#17171C] dark:text-white mt-0.5">
            {loading ? '...' : stats?.unread ?? 0}
          </div>
        </div>

        {/* Replied Messages */}
        <div className="bg-white dark:bg-[#16161D] rounded-none p-4 border border-[#E6E6EF] dark:border-[#272736] shadow-xs flex flex-col items-center text-center transition-colors">
          <div className="w-9 h-9 rounded-full bg-[#F4F4F8] dark:bg-[#1E1E28] flex items-center justify-center text-[#17171C] dark:text-[#EDEDF2] mb-2">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#666779] dark:text-[#8E8E9F] font-['Nunito',sans-serif]">
            Replied Messages
          </div>
          <div className="font-['Nunito',sans-serif] font-black text-2xl text-[#17171C] dark:text-white mt-0.5">
            {loading ? '...' : stats?.replied ?? 0}
          </div>
        </div>

        {/* Published Messages */}
        <div className="bg-white dark:bg-[#16161D] rounded-none p-4 border border-[#E6E6EF] dark:border-[#272736] shadow-xs flex flex-col items-center text-center transition-colors">
          <div className="w-9 h-9 rounded-full bg-[#F4F4F8] dark:bg-[#1E1E28] flex items-center justify-center text-[#17171C] dark:text-[#EDEDF2] mb-2">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#666779] dark:text-[#8E8E9F] font-['Nunito',sans-serif]">
            Published Messages
          </div>
          <div className="font-['Nunito',sans-serif] font-black text-2xl text-[#17171C] dark:text-white mt-0.5">
            {loading ? '...' : stats?.published ?? 0}
          </div>
        </div>
      </div>

      {/* Recent Activity Card */}
      <div className="bg-white dark:bg-[#16161D] rounded-none border border-[#E6E6EF] dark:border-[#272736] p-4 shadow-xs transition-colors">
        <div className="flex items-center justify-between pb-3 border-b border-[#E6E6EF] dark:border-[#272736]">
          <h2 className="font-['Nunito',sans-serif] font-black text-sm text-[#17171C] dark:text-white">
            Recent Activity
          </h2>
          <Link
            href="/admin/inbox"
            className="text-xs font-bold text-[#17171C] dark:text-white hover:underline flex items-center gap-1 font-['Nunito',sans-serif]"
          >
            <span>View All</span>
            <span>→</span>
          </Link>
        </div>

        <div className="divide-y divide-[#E6E6EF] dark:divide-[#272736]">
          {loading ? (
            <div className="py-6 text-center text-xs text-[#9293A5] dark:text-[#68687D]">Loading activity...</div>
          ) : recentMessages.length === 0 ? (
            <div className="py-6 text-center text-xs text-[#9293A5] dark:text-[#68687D]">
              No messages yet.
            </div>
          ) : (
            recentMessages.map((msg) => (
              <Link
                key={msg.id}
                href={`/admin/inbox?id=${msg.id}`}
                className="py-2.5 flex items-center justify-between hover:bg-[#F7F7FC] dark:hover:bg-[#1A1A24] px-1 rounded-none transition-colors group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-full bg-[#F4F4F8] dark:bg-[#1E1E28] text-[#17171C] dark:text-[#EDEDF2] flex items-center justify-center shrink-0">
                    {!msg.isRead ? (
                      <span className="w-2 h-2 rounded-full bg-[#17171C] dark:bg-white" />
                    ) : (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      </svg>
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-[#17171C] dark:text-white truncate group-hover:underline">
                      {msg.content}
                    </div>
                    <div className="text-[10px] text-[#666779] dark:text-[#8E8E9F]">
                      {!msg.isRead ? 'New message' : msg.isPublished ? 'Published on wall' : 'Replied'}
                    </div>
                  </div>
                </div>

                <span className="text-[10px] text-[#9293A5] dark:text-[#68687D] shrink-0 ml-2 font-medium">
                  {formatRelativeTime(msg.createdAt)}
                </span>
              </Link>
            ))
          )}
        </div>
      </div>

      {/* Encouraging Character Banner */}
      <div className="flex flex-col items-center justify-center pt-2 text-center select-none">
        <PioloHappy size={120} />
        <div className="text-xs font-black text-[#17171C] dark:text-white font-['Nunito',sans-serif] mt-0.5">
          Keep going, Piolo!
        </div>
      </div>
    </div>
  );
}

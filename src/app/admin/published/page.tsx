'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { formatRelativeTime } from '@/lib/utils';
import { useToast } from '@/components/ui/Toast';
import { Message } from '@/lib/db';

export default function AdminPublishedPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const { showToast } = useToast();

  const fetchPublished = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/messages?filter=all', { cache: 'no-store' });
      if (res.ok) {
        const data: Message[] = await res.json();
        setMessages(data.filter((m) => m.isPublished));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublished();
  }, []);

  const handleUnpublish = async (id: string) => {
    setActionLoading(id);
    try {
      const res = await fetch(`/api/admin/messages/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'unpublish' }),
      });

      if (res.ok) {
        showToast('Message unpublished from TOTS Wall.', 'info');
        setMessages((prev) => prev.filter((m) => m.id !== id));
      } else {
        showToast('Failed to unpublish message.', 'error');
      }
    } catch {
      showToast('Network error.', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#E6E6EF] dark:border-[#222230]">
        <div>
          <h1 className="font-['Nunito',sans-serif] font-black text-xl text-[#17171C] dark:text-white tracking-tight">
            Published Messages
          </h1>
          <p className="text-[#666779] dark:text-[#9E9EB2] text-xs mt-0.5">
            Live conversations on your public TOTS Wall.
          </p>
        </div>

        <Link
          href="/wall"
          target="_blank"
          className="px-2.5 py-1 rounded-[10px] text-xs font-bold text-[#17171C] dark:text-white bg-white dark:bg-[#16161D] border border-[#E6E6EF] dark:border-[#272736] hover:bg-[#F7F7FC] dark:hover:bg-[#1E1E28] transition-all font-['Nunito',sans-serif] shrink-0"
        >
          View Wall
        </Link>
      </div>

      {/* Messages List */}
      <div className="space-y-3">
        {loading ? (
          <div className="space-y-2.5">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white dark:bg-[#16161D] rounded-none p-4 border border-[#E6E6EF] dark:border-[#272736] animate-pulse h-28" />
            ))}
          </div>
        ) : messages.length === 0 ? (
          <div className="bg-white dark:bg-[#16161D] rounded-none border border-[#E6E6EF] dark:border-[#272736] p-8 text-center transition-colors">
            <div className="font-['Nunito',sans-serif] font-bold text-sm text-[#17171C] dark:text-white">
              No published messages yet
            </div>
            <p className="text-[11px] text-[#9293A5] dark:text-[#68687D] mt-1">
              Replies you publish from your inbox will appear here!
            </p>
            <Link
              href="/admin/inbox"
              className="mt-3 inline-flex items-center py-2 px-4 rounded-[12px] text-xs font-bold font-['Nunito',sans-serif] text-white dark:text-[#0D0E12] bg-[#17171C] dark:bg-white"
            >
              Go to Inbox
            </Link>
          </div>
        ) : (
          messages.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-[#16161D] rounded-none p-4 border border-[#E6E6EF] dark:border-[#272736] shadow-xs space-y-3 transition-colors"
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-[#17171C] dark:text-white bg-[#F0F0F4] dark:bg-[#272736] px-2 py-0.5 rounded-full font-['Nunito',sans-serif]">
                  Live on Wall
                </span>
                <span className="text-[11px] text-[#9293A5] dark:text-[#68687D]">
                  {formatRelativeTime(item.createdAt)}
                </span>
              </div>

              {/* Original Message */}
              <div>
                <div className="text-[10px] font-black uppercase tracking-wider text-[#666779] dark:text-[#8E8E9F] font-['Nunito',sans-serif]">
                  Anonymous Message:
                </div>
                <div className="text-xs sm:text-sm text-[#17171C] dark:text-[#E8E8F0] font-medium leading-relaxed mt-0.5">
                  {item.content}
                </div>
              </div>

              {/* Piolo's Reply */}
              <div className="rounded-none bg-[#F7F7FC] dark:bg-[#1A1A24] border border-[#E6E6EF] dark:border-[#272736] p-3 transition-colors">
                <div className="text-[10px] font-black uppercase tracking-wider text-[#17171C] dark:text-white font-['Nunito',sans-serif]">
                  Your Live Reply:
                </div>
                <div className="text-xs sm:text-sm text-[#17171C] dark:text-[#E8E8F0] font-medium leading-relaxed mt-0.5">
                  {item.reply}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-1 border-t border-[#E6E6EF] dark:border-[#272736]">
                <Link
                  href={`/admin/inbox?id=${item.id}`}
                  className="text-[11px] font-bold text-[#17171C] dark:text-white hover:underline font-['Nunito',sans-serif]"
                >
                  Edit in Inbox →
                </Link>

                <button
                  onClick={() => handleUnpublish(item.id)}
                  disabled={actionLoading === item.id}
                  className="py-1 px-3 rounded-[10px] text-[11px] font-bold text-[#17171C] dark:text-[#EDEDF2] bg-[#F7F7FC] dark:bg-[#1E1E28] hover:bg-[#EAEAF2] dark:hover:bg-[#272736] border border-[#E6E6EF] dark:border-[#272736] font-['Nunito',sans-serif] transition-colors"
                >
                  {actionLoading === item.id ? 'Unpublishing...' : 'Unpublish'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

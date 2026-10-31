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
      <div className="flex items-center justify-between pb-3 border-b border-[#E6E6EF]">
        <div>
          <h1 className="font-['Nunito',sans-serif] font-black text-xl text-[#17171C] tracking-tight">
            Published Messages
          </h1>
          <p className="text-[#666779] text-xs mt-0.5">
            Live conversations on your public TOTS Wall.
          </p>
        </div>

        <Link
          href="/wall"
          target="_blank"
          className="px-2.5 py-1 rounded-[10px] text-xs font-bold text-[#17171C] bg-white border border-[#E6E6EF] hover:bg-[#F7F7FC] transition-all font-['Nunito',sans-serif] shrink-0"
        >
          View Wall
        </Link>
      </div>

      {/* Messages List - Monochrome */}
      <div className="space-y-3">
        {loading ? (
          <div className="space-y-2.5">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white rounded-[20px] p-4 border border-[#E6E6EF] animate-pulse h-28" />
            ))}
          </div>
        ) : messages.length === 0 ? (
          <div className="bg-white rounded-[20px] border border-[#E6E6EF] p-8 text-center">
            <div className="font-['Nunito',sans-serif] font-bold text-sm text-[#17171C]">
              No published messages yet
            </div>
            <p className="text-[11px] text-[#9293A5] mt-1">
              Replies you publish from your inbox will appear here!
            </p>
            <Link
              href="/admin/inbox"
              className="mt-3 inline-flex items-center py-2 px-4 rounded-[12px] text-xs font-bold font-['Nunito',sans-serif] text-white bg-[#17171C]"
            >
              Go to Inbox
            </Link>
          </div>
        ) : (
          messages.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-[20px] p-4 border border-[#E6E6EF] shadow-xs space-y-3"
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-[#17171C] bg-[#F0F0F4] px-2 py-0.5 rounded-full font-['Nunito',sans-serif]">
                  Live on Wall
                </span>
                <span className="text-[11px] text-[#9293A5]">
                  {formatRelativeTime(item.createdAt)}
                </span>
              </div>

              {/* Original Message */}
              <div>
                <div className="text-[10px] font-black uppercase tracking-wider text-[#666779] font-['Nunito',sans-serif]">
                  Anonymous Message:
                </div>
                <div className="text-xs sm:text-sm text-[#17171C] font-medium leading-relaxed mt-0.5">
                  {item.content}
                </div>
              </div>

              {/* Piolo's Reply */}
              <div className="rounded-[14px] bg-[#F7F7FC] border border-[#E6E6EF] p-3">
                <div className="text-[10px] font-black uppercase tracking-wider text-[#17171C] font-['Nunito',sans-serif]">
                  Your Live Reply:
                </div>
                <div className="text-xs sm:text-sm text-[#17171C] font-medium leading-relaxed mt-0.5">
                  {item.reply}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-1 border-t border-[#E6E6EF]">
                <Link
                  href={`/admin/inbox?id=${item.id}`}
                  className="text-[11px] font-bold text-[#17171C] hover:underline font-['Nunito',sans-serif]"
                >
                  Edit in Inbox →
                </Link>

                <button
                  onClick={() => handleUnpublish(item.id)}
                  disabled={actionLoading === item.id}
                  className="py-1 px-3 rounded-[10px] text-[11px] font-bold text-[#17171C] bg-[#F7F7FC] hover:bg-[#EAEAF2] border border-[#E6E6EF] font-['Nunito',sans-serif] transition-colors"
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

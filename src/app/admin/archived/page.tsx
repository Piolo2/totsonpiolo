'use client';

import React, { useEffect, useState } from 'react';
import { formatRelativeTime } from '@/lib/utils';
import { useToast } from '@/components/ui/Toast';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { Message } from '@/lib/db';

export default function AdminArchivedPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const { showToast } = useToast();

  const fetchArchived = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/messages?filter=archived', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setMessages(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArchived();
  }, []);

  const handleUnarchive = async (id: string) => {
    setActionLoading(id);
    try {
      const res = await fetch(`/api/admin/messages/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'unarchive' }),
      });

      if (res.ok) {
        showToast('Message restored to Inbox.', 'success');
        setMessages((prev) => prev.filter((m) => m.id !== id));
      } else {
        showToast('Could not restore message.', 'error');
      }
    } catch {
      showToast('Network error.', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/admin/messages/${deleteTarget}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        showToast('Message deleted permanently.', 'info');
        setMessages((prev) => prev.filter((m) => m.id !== deleteTarget));
      } else {
        showToast('Could not delete message.', 'error');
      }
    } catch {
      showToast('Network error.', 'error');
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="pb-3 border-b border-[#E6E6EF]">
        <h1 className="font-['Nunito',sans-serif] font-black text-xl text-[#17171C] tracking-tight">
          Archived Messages
        </h1>
        <p className="text-[#666779] text-xs mt-0.5">
          Archived messages are hidden from main inbox but preserved here.
        </p>
      </div>

      {/* Messages List - Monochrome */}
      <div className="space-y-3">
        {loading ? (
          <div className="space-y-2.5">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white rounded-[20px] p-4 border border-[#E6E6EF] animate-pulse h-24" />
            ))}
          </div>
        ) : messages.length === 0 ? (
          <div className="bg-white rounded-[20px] border border-[#E6E6EF] p-8 text-center">
            <div className="font-['Nunito',sans-serif] font-bold text-sm text-[#17171C]">
              No archived messages
            </div>
            <p className="text-[11px] text-[#9293A5] mt-1">
              Messages you archive from your inbox will be safely kept here.
            </p>
          </div>
        ) : (
          messages.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-[20px] p-4 border border-[#E6E6EF] shadow-xs flex flex-col gap-2.5"
            >
              <div>
                <div className="flex items-center gap-1.5 text-[10px] text-[#9293A5]">
                  <span className="font-black uppercase tracking-wider font-['Nunito',sans-serif]">Anonymous</span>
                  <span>• {formatRelativeTime(item.createdAt)}</span>
                </div>
                <div className="text-xs sm:text-sm text-[#17171C] font-medium leading-relaxed mt-1">
                  {item.content}
                </div>
                {item.reply && (
                  <div className="mt-2 text-xs text-[#17171C] bg-[#F7F7FC] p-2 rounded-xl border border-[#E6E6EF]">
                    <span className="font-bold text-[#17171C]">Reply:</span> {item.reply}
                  </div>
                )}
              </div>

              {/* Actions - Monochrome */}
              <div className="flex items-center justify-end gap-2 pt-1 border-t border-[#E6E6EF]">
                <button
                  onClick={() => handleUnarchive(item.id)}
                  disabled={actionLoading === item.id}
                  className="py-1 px-3 rounded-[10px] text-[11px] font-bold text-[#17171C] bg-[#F4F4F8] hover:bg-[#EAEAF2] border border-[#E6E6EF] font-['Nunito',sans-serif] transition-colors"
                >
                  Restore to Inbox
                </button>
                <button
                  onClick={() => setDeleteTarget(item.id)}
                  className="py-1 px-2.5 rounded-[10px] text-[11px] font-bold text-[#17171C] bg-white hover:bg-[#F7F7FC] border border-[#E6E6EF] hover:border-black font-['Nunito',sans-serif] transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Permanently?"
        description="This will permanently delete this message."
        confirmLabel="Delete"
        variant="danger"
      />
    </div>
  );
}

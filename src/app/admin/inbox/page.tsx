'use client';

import React, { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { formatRelativeTime } from '@/lib/utils';
import { useToast } from '@/components/ui/Toast';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { Message } from '@/lib/db';

type FilterType = 'all' | 'unread' | 'replied' | 'archived';

function InboxContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { showToast } = useToast();

  const [filter, setFilter] = useState<FilterType>('all');
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const fetchMessages = useCallback(async (currentFilter: FilterType) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/messages?filter=${currentFilter}`, {
        cache: 'no-store',
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Failed to load messages:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMessages(filter);
  }, [filter, fetchMessages]);

  useEffect(() => {
    const idFromUrl = searchParams.get('id');
    if (idFromUrl) {
      async function loadSingleMessage(id: string) {
        try {
          const res = await fetch(`/api/admin/messages/${id}`, { cache: 'no-store' });
          if (res.ok) {
            const data = await res.json();
            setSelectedMessage(data);
            setReplyText(data.reply || '');
          }
        } catch (err) {
          console.error(err);
        }
      }
      loadSingleMessage(idFromUrl);
    }
  }, [searchParams]);

  const handleSelectMessage = async (msg: Message) => {
    setSelectedMessage(msg);
    setReplyText(msg.reply || '');

    if (!msg.isRead) {
      try {
        const res = await fetch(`/api/admin/messages/${msg.id}`, { cache: 'no-store' });
        if (res.ok) {
          const updated = await res.json();
          setSelectedMessage(updated);
          setMessages((prev) =>
            prev.map((m) => (m.id === msg.id ? { ...m, isRead: true } : m))
          );
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleBackToList = () => {
    setSelectedMessage(null);
    setReplyText('');
    router.replace('/admin/inbox');
    fetchMessages(filter);
  };

  const handleSaveReply = async () => {
    if (!selectedMessage) return;
    const trimmed = replyText.trim();
    if (!trimmed) {
      showToast('Please type a reply first.', 'info');
      return;
    }

    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/messages/${selectedMessage.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reply', reply: trimmed }),
      });

      if (res.ok) {
        const updated = await res.json();
        setSelectedMessage(updated);
        showToast('Reply saved privately.', 'success');
        fetchMessages(filter);
      } else {
        showToast('Could not save reply.', 'error');
      }
    } catch {
      showToast('Network error while saving reply.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handlePublish = async () => {
    if (!selectedMessage) return;
    const trimmed = replyText.trim();

    if (!trimmed && !selectedMessage.reply) {
      showToast('Please write a reply before publishing to wall.', 'info');
      return;
    }

    setActionLoading(true);
    try {
      if (trimmed && trimmed !== selectedMessage.reply) {
        await fetch(`/api/admin/messages/${selectedMessage.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'reply', reply: trimmed }),
        });
      }

      const res = await fetch(`/api/admin/messages/${selectedMessage.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'publish' }),
      });

      if (res.ok) {
        const updated = await res.json();
        setSelectedMessage(updated);
        showToast('Published to public TOTS Wall.', 'success');
        fetchMessages(filter);
      } else {
        showToast('Failed to publish message.', 'error');
      }
    } catch {
      showToast('Network error while publishing.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUnpublish = async () => {
    if (!selectedMessage) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/messages/${selectedMessage.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'unpublish' }),
      });

      if (res.ok) {
        const updated = await res.json();
        setSelectedMessage(updated);
        showToast('Unpublished from TOTS Wall.', 'info');
        fetchMessages(filter);
      }
    } catch {
      showToast('Failed to unpublish.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleArchive = async () => {
    if (!selectedMessage) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/messages/${selectedMessage.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'archive' }),
      });

      if (res.ok) {
        showToast('Message archived.', 'info');
        handleBackToList();
      }
    } catch {
      showToast('Failed to archive message.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedMessage) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/messages/${selectedMessage.id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        showToast('Message deleted.', 'info');
        setDeleteConfirmOpen(false);
        handleBackToList();
      }
    } catch {
      showToast('Failed to delete message.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="w-full">
      {!selectedMessage ? (
        /* ========================================================== */
        /* INBOX LIST VIEW (Monochrome)                               */
        /* ========================================================== */
        <div className="space-y-4">
          {/* Header */}
          <div>
            <h1 className="font-['Nunito',sans-serif] font-black text-xl text-[#17171C] tracking-tight">
              Your Inbox
            </h1>
            <p className="text-[#666779] text-xs mt-0.5">
              Here are the messages you&apos;ve received.
            </p>
          </div>

          {/* Filter Pills - Monochrome */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none select-none">
            {(
              [
                { id: 'all', label: 'All' },
                { id: 'unread', label: 'Unread' },
                { id: 'replied', label: 'Replied' },
                { id: 'archived', label: 'Archived' },
              ] as const
            ).map((tab) => {
              const isActive = filter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setFilter(tab.id)}
                  className={`
                    px-3.5 py-1 rounded-full text-xs font-['Nunito',sans-serif] font-bold transition-all shrink-0
                    ${
                      isActive
                        ? 'bg-[#17171C] text-white'
                        : 'bg-white text-[#666779] border border-[#E6E6EF] hover:bg-[#F7F7FC]'
                    }
                  `}
                >
                  {tab.label}
                  {tab.id === 'unread' && messages.some((m) => !m.isRead) && (
                    <span className="ml-1 w-1.5 h-1.5 rounded-full bg-[#17171C] inline-block" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Messages List - Monochrome */}
          <div className="space-y-2.5">
            {loading ? (
              <div className="space-y-2.5">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="bg-white rounded-[18px] p-3.5 border border-[#E6E6EF] animate-pulse flex items-center gap-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#E6E6EF]" />
                    <div className="flex-1 space-y-2">
                      <div className="w-3/4 h-3.5 rounded bg-[#E6E6EF]" />
                      <div className="w-1/4 h-2.5 rounded bg-[#E6E6EF]" />
                    </div>
                  </div>
                ))}
              </div>
            ) : messages.length === 0 ? (
              <div className="bg-white rounded-[20px] border border-[#E6E6EF] p-8 text-center">
                <div className="font-['Nunito',sans-serif] font-bold text-sm text-[#17171C]">
                  No messages in {filter}
                </div>
                <div className="text-[11px] text-[#9293A5] mt-1">
                  {filter === 'unread'
                    ? 'All caught up! No unread messages.'
                    : 'Check back later or share your link!'}
                </div>
              </div>
            ) : (
              messages.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleSelectMessage(item)}
                  className={`
                    bg-white rounded-[18px] p-3.5 border transition-all cursor-pointer flex items-center gap-3
                    hover:border-[#17171C]
                    ${!item.isRead ? 'border-[#17171C] bg-[#FCFCFF]' : 'border-[#E6E6EF]'}
                  `}
                >
                  {/* Left Avatar with monochrome indicator */}
                  <div className="w-8 h-8 rounded-full bg-[#F4F4F8] text-[#17171C] flex items-center justify-center shrink-0">
                    {!item.isRead ? (
                      <span className="w-2.5 h-2.5 rounded-full bg-[#17171C]" />
                    ) : (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                    )}
                  </div>

                  {/* Center Content Preview */}
                  <div className="flex-1 min-w-0">
                    <div
                      className={`text-xs sm:text-sm truncate ${
                        !item.isRead ? 'font-black text-[#17171C]' : 'font-medium text-[#17171C]'
                      }`}
                    >
                      {item.content}
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      {item.isPublished && (
                        <span className="text-[9px] font-bold text-[#17171C] bg-[#F0F0F4] px-1.5 py-0.5 rounded-full font-['Nunito',sans-serif]">
                          Published
                        </span>
                      )}
                      {item.reply && !item.isPublished && (
                        <span className="text-[9px] font-bold text-[#17171C] bg-[#F0F0F4] px-1.5 py-0.5 rounded-full font-['Nunito',sans-serif]">
                          Replied
                        </span>
                      )}
                      {!item.isRead && (
                        <span className="text-[9px] font-black text-white bg-[#17171C] px-1.5 py-0.5 rounded-full font-['Nunito',sans-serif]">
                          New
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right relative timestamp and arrow */}
                  <div className="flex items-center gap-1 shrink-0">
                    <span className="text-[11px] text-[#9293A5] font-medium">
                      {formatRelativeTime(item.createdAt)}
                    </span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9293A5" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        /* ========================================================== */
        /* MESSAGE DETAIL & REPLY VIEW (Monochrome)                   */
        /* ========================================================== */
        <div className="space-y-4 animate-fade-in">
          {/* Back to Inbox */}
          <div>
            <button
              onClick={handleBackToList}
              className="inline-flex items-center gap-1 text-xs font-bold text-[#666779] hover:text-[#17171C] transition-colors font-['Nunito',sans-serif]"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              <span>Back to Inbox</span>
            </button>
          </div>

          {/* Original Anonymous Message Card */}
          <div className="bg-white rounded-[20px] p-4 border border-[#E6E6EF] shadow-xs">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-[#F4F4F8] flex items-center justify-center text-[#17171C]">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider text-[#666779] font-['Nunito',sans-serif]">
                ANONYMOUS MESSAGE
              </span>
              <span className="ml-auto text-[11px] text-[#9293A5] font-medium">
                {formatRelativeTime(selectedMessage.createdAt)}
              </span>
            </div>

            <div className="mt-2.5 text-[#17171C] text-sm leading-relaxed break-words font-medium">
              {selectedMessage.content}
            </div>
          </div>

          {/* Reply Interface - Monochrome */}
          <div className="bg-white rounded-[20px] p-4 border border-[#E6E6EF] shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-['Nunito',sans-serif] font-black text-sm text-[#17171C]">
                Your Reply
              </h2>
              {selectedMessage.isPublished ? (
                <span className="text-[10px] font-bold text-[#17171C] bg-[#F0F0F4] px-2 py-0.5 rounded-full font-['Nunito',sans-serif]">
                  Published on Wall
                </span>
              ) : selectedMessage.reply ? (
                <span className="text-[10px] font-bold text-[#666779] bg-[#F0F0F4] px-2 py-0.5 rounded-full font-['Nunito',sans-serif]">
                  Private Reply Saved
                </span>
              ) : null}
            </div>

            {/* Reply Textarea */}
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write your reply here..."
              rows={4}
              disabled={actionLoading}
              className="w-full p-3.5 rounded-[16px] border border-[#E6E6EF] bg-[#FCFCFF] text-[#17171C] placeholder:text-[#9293A5] text-sm focus:outline-none focus:ring-2 focus:ring-[#17171C]/20 focus:border-[#17171C] resize-none transition-all"
            />

            {/* Buttons Row - Monochrome */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {/* Publish / Unpublish Button */}
              {!selectedMessage.isPublished ? (
                <button
                  type="button"
                  onClick={handlePublish}
                  disabled={actionLoading}
                  className="py-2.5 px-4 rounded-[14px] font-['Nunito',sans-serif] font-bold text-xs text-white bg-[#17171C] hover:bg-[#2C2D35] active:scale-[0.98] flex items-center gap-1.5 shadow-xs transition-all"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                  <span>Publish to TOTS Wall</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleUnpublish}
                  disabled={actionLoading}
                  className="py-2.5 px-4 rounded-[14px] font-['Nunito',sans-serif] font-bold text-xs text-[#17171C] bg-[#EAEAF2] hover:bg-[#DFDFE9] flex items-center gap-1.5 transition-all"
                >
                  <span>Unpublish from Wall</span>
                </button>
              )}

              {/* Archive Action */}
              <button
                type="button"
                onClick={handleArchive}
                disabled={actionLoading}
                className="py-2.5 px-3 rounded-[14px] font-['Nunito',sans-serif] font-bold text-xs text-[#17171C] bg-white border border-[#E6E6EF] hover:bg-[#F7F7FC] flex items-center gap-1.5 transition-all"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <polyline points="21 8 21 21 3 21 3 8" />
                  <rect x="1" y="3" width="22" height="5" />
                  <line x1="10" y1="12" x2="14" y2="12" />
                </svg>
                <span>Archive</span>
              </button>

              {/* Delete Action */}
              <button
                type="button"
                onClick={() => setDeleteConfirmOpen(true)}
                disabled={actionLoading}
                className="py-2.5 px-3 rounded-[14px] font-['Nunito',sans-serif] font-bold text-xs text-[#17171C] bg-white border border-[#E6E6EF] hover:bg-[#F7F7FC] hover:border-black ml-auto flex items-center gap-1 transition-all"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
                <span>Delete</span>
              </button>
            </div>

            {/* Subtle Save Privately option */}
            <div className="pt-2 border-t border-[#E6E6EF] flex justify-end">
              <button
                type="button"
                onClick={handleSaveReply}
                disabled={actionLoading}
                className="text-[11px] font-bold text-[#666779] hover:text-[#17171C] hover:underline font-['Nunito',sans-serif]"
              >
                Save as private reply (don&apos;t publish)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Delete Message?"
        description="Are you sure you want to permanently delete this anonymous message?"
        confirmLabel="Delete"
        variant="danger"
      />
    </div>
  );
}

export default function AdminInboxPage() {
  return (
    <Suspense fallback={<div className="p-4 text-center text-xs text-[#9293A5]">Loading inbox...</div>}>
      <InboxContent />
    </Suspense>
  );
}

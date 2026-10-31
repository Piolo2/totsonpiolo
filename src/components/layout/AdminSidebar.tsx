'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { PioloWorking } from '../illustrations/PioloCharacter';

interface AdminSidebarProps {
  unreadCount?: number;
}

export default function AdminSidebar({ unreadCount = 0 }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch {
      router.push('/admin/login');
    }
  };

  const navItems = [
    {
      label: 'Dashboard',
      href: '/admin',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      ),
      exact: true,
    },
    {
      label: 'Inbox',
      href: '/admin/inbox',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
      ),
      badge: unreadCount > 0 ? unreadCount : undefined,
    },
    {
      label: 'Published Messages',
      href: '/admin/published',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ),
    },
    {
      label: 'Archived Messages',
      href: '/admin/archived',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="21 8 21 21 3 21 3 8" />
          <rect x="1" y="3" width="22" height="5" />
          <line x1="10" y1="12" x2="14" y2="12" />
        </svg>
      ),
    },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-[#202127] text-white h-screen fixed left-0 top-0 z-40 border-r border-[#2C2D35] select-none">
      {/* Brand Logo */}
      <div className="p-6 pb-5 border-b border-[#2C2D35]/60 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-white">
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          </svg>
        </div>
        <div>
          <div className="font-['Nunito',sans-serif] font-extrabold text-base leading-tight tracking-tight">
            TOTS
          </div>
          <div className="text-xs text-[#9293A5] font-medium">on Piolo • Admin</div>
        </div>
      </div>

      {/* Navigation links */}
      <nav className="flex-1 p-3.5 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center justify-between px-3.5 py-2.5 rounded-[12px] text-sm font-medium transition-all
                ${
                  isActive
                    ? 'bg-[#4778F5] text-white shadow-sm'
                    : 'text-[#B8B9E8]/80 hover:text-white hover:bg-white/5'
                }
              `}
            >
              <div className="flex items-center gap-3">
                <span className={isActive ? 'text-white' : 'text-[#9293A5]'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                    isActive ? 'bg-white text-[#4778F5]' : 'bg-[#4778F5] text-white'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}

        {/* Public View link */}
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3.5 py-2.5 rounded-[12px] text-sm font-medium text-[#9293A5] hover:text-white hover:bg-white/5 transition-all mt-4"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
          <span>View Public Site</span>
        </Link>
      </nav>

      {/* Decorative Character at bottom */}
      <div className="px-4 py-2 border-t border-[#2C2D35]/60 flex flex-col items-center text-center">
        <PioloWorking size={130} className="-mb-2" />
        <div className="text-xs font-['Nunito',sans-serif] font-bold text-[#E8E8FA]">
          Keep going, Piolo! ☺
        </div>
      </div>

      {/* Logout button */}
      <div className="p-3 border-t border-[#2C2D35]">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2 rounded-[12px] text-sm font-medium text-[#9293A5] hover:text-red-300 hover:bg-red-500/10 transition-colors"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}


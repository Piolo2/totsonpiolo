'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { PioloAvatar } from '@/components/illustrations/PioloCharacter';
import ThemeToggle from '@/components/ui/ThemeToggle';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    let isMounted = true;

    async function checkAuth() {
      if (isLoginPage) {
        setCheckingAuth(false);
        return;
      }

      try {
        const res = await fetch('/api/auth/check');
        const data = await res.json();

        if (!data.authenticated) {
          router.push('/admin/login');
        } else {
          try {
            const statsRes = await fetch('/api/admin/stats', { cache: 'no-store' });
            if (statsRes.ok) {
              const stats = await statsRes.json();
              if (isMounted) {
                setUnreadCount(stats.unread || 0);
              }
            }
          } catch {
            // stats fetch error ignored
          }
        }
      } catch {
        router.push('/admin/login');
      } finally {
        if (isMounted) {
          setCheckingAuth(false);
        }
      }
    }

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, [pathname, isLoginPage, router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch {
      router.push('/admin/login');
    }
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F7FC] dark:bg-[#0D0E12] transition-colors">
        <div className="flex flex-col items-center gap-2.5">
          <div className="w-8 h-8 border-3 border-[#E6E6EF] dark:border-[#2C2C3C] border-t-[#17171C] dark:border-t-white rounded-full animate-spin" />
          <span className="text-xs font-bold text-[#666779] dark:text-[#9E9EB2] font-['Nunito',sans-serif]">
            Loading...
          </span>
        </div>
      </div>
    );
  }

  const navTabs = [
    {
      label: 'Dashboard',
      href: '/admin',
      exact: true,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      ),
    },
    {
      label: 'Inbox',
      href: '/admin/inbox',
      badge: unreadCount > 0 ? unreadCount : undefined,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
      ),
    },
    {
      label: 'Published',
      href: '/admin/published',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ),
    },
    {
      label: 'Archived',
      href: '/admin/archived',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="21 8 21 21 3 21 3 8" />
          <rect x="1" y="3" width="22" height="5" />
          <line x1="10" y1="12" x2="14" y2="12" />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#F0F1F6] dark:bg-[#09090E] flex justify-center selection:bg-[#E6E6EF] dark:selection:bg-[#34354A] transition-colors">
      {/* Mobile-Dimensioned App Frame */}
      <div className="w-full max-w-[440px] min-h-screen bg-white dark:bg-[#0D0E12] shadow-xs flex flex-col relative border-x border-[#E6E6EF] dark:border-[#1A1A24] pb-16 transition-colors">
        {/* Top Admin Header Bar */}
        <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#0D0E12]/95 backdrop-blur-md border-b border-[#E6E6EF] dark:border-[#222230] px-4 h-14 flex items-center justify-between transition-colors">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#17171C] dark:bg-white text-white dark:text-[#0D0E12] flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
              </svg>
            </div>
            <div>
              <span className="font-['Nunito',sans-serif] font-black text-sm text-[#17171C] dark:text-white">
                TOTS on Piolo
              </span>
              <span className="text-[10px] text-[#666779] dark:text-[#8E8E9F] font-bold block -mt-1 font-['Nunito',sans-serif]">
                Admin Space
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <ThemeToggle size="sm" />

            <Link
              href="/"
              target="_blank"
              title="View Public Wall"
              className="w-7 h-7 rounded-full bg-[#F7F7FC] dark:bg-[#181822] border border-[#E6E6EF] dark:border-[#2C2C3C] text-[#666779] dark:text-[#8E8E9F] hover:text-[#17171C] dark:hover:text-white hover:bg-[#EAEAF2] dark:hover:bg-[#222230] flex items-center justify-center text-xs transition-colors"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="3" r="3" />
              </svg>
            </Link>

            <button
              onClick={handleLogout}
              title="Logout"
              className="w-7 h-7 rounded-full bg-[#F7F7FC] dark:bg-[#181822] border border-[#E6E6EF] dark:border-[#2C2C3C] text-[#666779] dark:text-[#8E8E9F] hover:text-[#17171C] dark:hover:text-white hover:bg-[#EAEAF2] dark:hover:bg-[#222230] flex items-center justify-center text-xs transition-colors"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </button>

            <div className="w-7 h-7 rounded-full overflow-hidden border border-[#E6E6EF] dark:border-[#2C2C3C]">
              <PioloAvatar size={28} className="border-none" />
            </div>
          </div>
        </header>

        {/* Admin Content Area */}
        <main className="flex-1 p-4 bg-[#F7F7FC] dark:bg-[#0D0E12] transition-colors">
          {children}
        </main>

        {/* Bottom Tab Bar */}
        <nav className="fixed bottom-0 w-full max-w-[440px] z-40 bg-white/95 dark:bg-[#0D0E12]/95 backdrop-blur-md border-t border-[#E6E6EF] dark:border-[#222230] px-3 py-1.5 flex items-center justify-around shadow-xs transition-colors">
          {navTabs.map((tab) => {
            const isActive = tab.exact
              ? pathname === tab.href
              : pathname.startsWith(tab.href);

            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`
                  flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all relative
                  ${isActive ? 'text-[#17171C] dark:text-white font-black' : 'text-[#8E8E9F] dark:text-[#5A5A6E] hover:text-[#17171C] dark:hover:text-white'}
                `}
              >
                <div className="relative">
                  {tab.icon}
                  {tab.badge !== undefined && (
                    <span className="absolute -top-1.5 -right-2 min-w-4 h-4 px-1 rounded-full bg-[#17171C] dark:bg-white text-white dark:text-[#0D0E12] text-[9px] font-black flex items-center justify-center">
                      {tab.badge}
                    </span>
                  )}
                </div>
                <span className={`text-[10px] mt-0.5 font-['Nunito',sans-serif] ${isActive ? 'text-[#17171C] dark:text-white font-black' : ''}`}>
                  {tab.label}
                </span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#17171C] dark:bg-white mt-0.5" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

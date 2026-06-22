'use client';
import { useEffect, useState } from 'react';
import type { CurrentUser } from '@/lib/queries';
import { CommandPalette } from './command-palette';
import { DashboardNav } from './dashboard-nav';
import { MobileDashboardNav } from './mobile-nav';

export function DashboardShell({
  user,
  children,
}: {
  user: CurrentUser;
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const v = localStorage.getItem('sidebar-collapsed');
    if (v !== null) setCollapsed(v === 'true');
  }, []);

  const toggle = () =>
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('sidebar-collapsed', String(next));
      return next;
    });

  return (
    <div className="flex min-h-screen bg-[oklch(97.5%_0_0)]">
      <aside
        className={`fixed left-0 top-0 hidden h-full flex-col border-r border-black/8 bg-white transition-[width] duration-[220ms] ease-[cubic-bezier(0.22,1,0.36,1)] md:flex ${
          collapsed ? 'w-14' : 'w-52'
        }`}
      >
        <DashboardNav user={user} collapsed={collapsed} onToggle={toggle} />
      </aside>
      <div
        className={`flex flex-1 flex-col transition-[margin] duration-[220ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
          collapsed ? 'md:ml-14' : 'md:ml-52'
        }`}
      >
        <MobileDashboardNav user={user} />
        <main className="flex-1 p-6 md:p-8">{children}</main>
      </div>
      <CommandPalette />
    </div>
  );
}

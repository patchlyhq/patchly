'use client';
import {
  BarChart2,
  Bell,
  LayoutDashboard,
  Link2,
  Menu,
  Settings,
  Users,
  X,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Drawer } from 'vaul';
import type { CurrentUser } from '@/lib/queries';

const WORKSPACE_NAV = [
  { href: '/dashboard', label: 'Projects', icon: LayoutDashboard },
  { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart2 },
];

const MANAGE_NAV = [
  { href: '/dashboard/subscribers', label: 'Subscribers', icon: Users },
  { href: '/dashboard/notifications', label: 'Notifications', icon: Bell },
  { href: '/dashboard/integrations', label: 'Integrations', icon: Link2 },
];

export function MobileDashboardNav({ user }: { user: CurrentUser }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === '/dashboard'
      ? pathname === '/dashboard'
      : pathname.startsWith(href);

  const navItemClass = (href: string) =>
    `flex items-center gap-2.5 rounded-lg px-2.5 py-2.5 text-sm transition-colors ${
      isActive(href)
        ? 'bg-black/6 font-medium text-black/85'
        : 'text-black/50 hover:bg-black/5 hover:text-black/75'
    }`;

  return (
    <header className="flex h-14 items-center justify-between border-b border-black/6 bg-white px-5 md:hidden">
      <Link href="/" className="text-sm font-bold tracking-tight text-black">
        Patchly
      </Link>
      <Drawer.Root open={open} onOpenChange={setOpen} direction="left">
        <Drawer.Trigger asChild>
          <button
            type="button"
            aria-label="Open navigation"
            className="rounded-lg p-1.5 text-black/40 hover:bg-black/5 hover:text-black/65 transition-colors"
          >
            <Menu size={18} />
          </button>
        </Drawer.Trigger>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 z-40 bg-black/20" />
          <Drawer.Content className="fixed left-0 top-0 z-50 flex h-full w-64 flex-col border-r border-black/8 bg-white outline-none">
            <div className="flex h-14 items-center justify-between border-b border-black/6 px-5">
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className="text-sm font-bold tracking-tight text-black"
              >
                Patchly
              </Link>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg p-1.5 text-black/30 hover:bg-black/5 hover:text-black/60 transition-colors"
              >
                <X size={15} />
              </button>
            </div>

            <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto p-3">
              <p className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-widest text-black/25">
                Workspace
              </p>
              {WORKSPACE_NAV.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className={navItemClass(href)}
                >
                  <Icon size={14} className="shrink-0" />
                  {label}
                </Link>
              ))}

              <p className="mb-1 mt-3 px-2 text-[10px] font-semibold uppercase tracking-widest text-black/25">
                Manage
              </p>
              {MANAGE_NAV.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className={navItemClass(href)}
                >
                  <Icon size={14} className="shrink-0" />
                  {label}
                </Link>
              ))}
            </nav>

            <div className="border-t border-black/6 p-3">
              <Link
                href="/dashboard/settings"
                onClick={() => setOpen(false)}
                className={navItemClass('/dashboard/settings')}
              >
                <Settings size={14} className="shrink-0" />
                Settings
              </Link>
              <Link
                href="/dashboard/upgrade"
                onClick={() => setOpen(false)}
                className={navItemClass('/dashboard/upgrade')}
              >
                <Zap size={14} className="shrink-0" />
                Upgrade to Pro
              </Link>
              <div className="mt-2 flex items-center gap-2.5 rounded-lg px-2.5 py-2">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-black text-[10px] font-bold text-white">
                  {(user.name?.charAt(0) ?? user.email.charAt(0)).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-xs font-medium text-black/70">
                    {user.name ?? user.email.split('@')[0]}
                  </p>
                  <p className="text-[10px] text-black/30">{user.email}</p>
                </div>
              </div>
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </header>
  );
}

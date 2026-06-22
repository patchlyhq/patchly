'use client';
import * as Tooltip from '@radix-ui/react-tooltip';
import {
  BarChart2,
  Bell,
  LayoutDashboard,
  Link2,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  Users,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import type { CurrentUser } from '@/lib/queries';
import { ProfileDialog } from './profile-dialog';

const NAV_SECTIONS = [
  {
    label: 'Workspace',
    items: [
      { href: '/dashboard', label: 'Projects', icon: LayoutDashboard },
      { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart2 },
    ],
  },
  {
    label: 'Manage',
    items: [
      { href: '/dashboard/subscribers', label: 'Subscribers', icon: Users },
      { href: '/dashboard/notifications', label: 'Notifications', icon: Bell },
      { href: '/dashboard/integrations', label: 'Integrations', icon: Link2 },
    ],
  },
];

function NavItem({
  href,
  label,
  icon: Icon,
  collapsed,
  active,
}: {
  href: string;
  label: string;
  icon: React.ElementType;
  collapsed: boolean;
  active: boolean;
}) {
  const link = (
    <Link
      href={href}
      className={`flex items-center rounded-lg transition-colors ${
        collapsed ? 'justify-center px-2 py-2.5' : 'gap-2.5 px-2.5 py-2'
      } ${active ? 'bg-black/6 font-medium text-black/85' : 'text-black/50 hover:bg-black/5 hover:text-black/75'}`}
    >
      <Icon size={14} className="shrink-0" />
      {!collapsed && <span className="truncate text-sm">{label}</span>}
    </Link>
  );

  if (!collapsed) return link;

  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>{link}</Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content
          side="right"
          sideOffset={8}
          className="z-50 rounded-lg border border-black/10 bg-white px-2.5 py-1.5 text-xs font-medium text-black/70 shadow-sm"
        >
          {label}
          <Tooltip.Arrow className="fill-white" />
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
}

export function DashboardNav({
  user,
  collapsed,
  onToggle,
}: {
  user: CurrentUser;
  collapsed: boolean;
  onToggle: () => void;
}) {
  const pathname = usePathname();
  const [profileOpen, setProfileOpen] = useState(false);

  const isActive = (href: string) =>
    href === '/dashboard'
      ? pathname === '/dashboard'
      : pathname.startsWith(href);

  return (
    <Tooltip.Provider delayDuration={0}>
      <ProfileDialog user={user} open={profileOpen} onOpenChange={setProfileOpen} />
      <div
        className={`flex h-14 shrink-0 items-center border-b border-black/6 ${
          collapsed ? 'justify-center px-3' : 'justify-between px-5'
        }`}
      >
        {collapsed ? (
          <Link
            href="/"
            className="text-sm font-black tracking-tight text-black"
          >
            P
          </Link>
        ) : (
          <>
            <Link
              href="/"
              className="text-sm font-bold tracking-tight text-black"
            >
              Patchly
            </Link>
            <kbd className="hidden rounded border border-black/10 px-1.5 py-0.5 text-[10px] text-black/30 xl:block">
              ⌘K
            </kbd>
          </>
        )}
      </div>

      <nav className="flex flex-1 flex-col gap-0 overflow-y-auto p-2">
        {NAV_SECTIONS.map(({ label, items }) => (
          <div key={label} className="mb-3">
            {!collapsed && (
              <p className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-widest text-black/25">
                {label}
              </p>
            )}
            {collapsed && <div className="mb-1 h-px bg-black/5" />}
            <div className="flex flex-col gap-0.5">
              {items.map(({ href, label: l, icon }) => (
                <NavItem
                  key={href}
                  href={href}
                  label={l}
                  icon={icon}
                  collapsed={collapsed}
                  active={isActive(href)}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-black/6 p-2">
        <div className="flex flex-col gap-0.5">
          <NavItem
            href="/dashboard/settings"
            label="Settings"
            icon={Settings}
            collapsed={collapsed}
            active={pathname === '/dashboard/settings'}
          />
          <NavItem
            href="/dashboard/upgrade"
            label="Upgrade to Pro"
            icon={Zap}
            collapsed={collapsed}
            active={pathname === '/dashboard/upgrade'}
          />
        </div>

        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <button
              type="button"
              onClick={() => setProfileOpen(true)}
              className={`mt-2 flex w-full items-center rounded-lg transition-colors hover:bg-black/5 ${
                collapsed ? 'justify-center px-2 py-2.5' : 'gap-2.5 px-2.5 py-2'
              }`}
            >
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-black text-[10px] font-bold text-white">
                {(user.name?.charAt(0) ?? user.email.charAt(0)).toUpperCase()}
              </div>
              {!collapsed && (
                <div className="min-w-0 text-left">
                  <p className="truncate text-xs font-medium text-black/70">
                    {user.name ?? user.email.split('@')[0]}
                  </p>
                  <p className="text-[10px] text-black/30">Free plan</p>
                </div>
              )}
            </button>
          </Tooltip.Trigger>
          {collapsed && (
            <Tooltip.Portal>
              <Tooltip.Content
                side="right"
                sideOffset={8}
                className="z-50 rounded-lg border border-black/10 bg-white px-2.5 py-1.5 text-xs font-medium text-black/70 shadow-sm"
              >
                {(user.name ?? user.email.split('@')[0])} · Profile
                <Tooltip.Arrow className="fill-white" />
              </Tooltip.Content>
            </Tooltip.Portal>
          )}
        </Tooltip.Root>

        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <button
              type="button"
              onClick={onToggle}
              className={`mt-1 flex w-full items-center rounded-lg py-2 text-black/25 transition-colors hover:bg-black/5 hover:text-black/55 ${
                collapsed ? 'justify-center px-2' : 'justify-between px-2.5'
              }`}
            >
              {!collapsed && (
                <span className="text-[10px] text-black/25">Collapse</span>
              )}
              {collapsed ? (
                <PanelLeftOpen size={13} />
              ) : (
                <PanelLeftClose size={13} />
              )}
            </button>
          </Tooltip.Trigger>
          {collapsed && (
            <Tooltip.Portal>
              <Tooltip.Content
                side="right"
                sideOffset={8}
                className="z-50 rounded-lg border border-black/10 bg-white px-2.5 py-1.5 text-xs font-medium text-black/70 shadow-sm"
              >
                Expand sidebar
                <Tooltip.Arrow className="fill-white" />
              </Tooltip.Content>
            </Tooltip.Portal>
          )}
        </Tooltip.Root>
      </div>
    </Tooltip.Provider>
  );
}

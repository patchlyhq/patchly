'use client';
import { Command } from 'cmdk';
import {
  BarChart2,
  Bell,
  LayoutDashboard,
  Link2,
  Plus,
  Settings,
  Users,
  Zap,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const COMMANDS = [
  { label: 'Go to Projects', icon: LayoutDashboard, href: '/dashboard' },
  { label: 'Go to Analytics', icon: BarChart2, href: '/dashboard/analytics' },
  { label: 'Go to Settings', icon: Settings, href: '/dashboard/settings' },
  { label: 'Upgrade to Pro', icon: Zap, href: '/dashboard/upgrade' },
  { label: 'Go to Subscribers', icon: Users, href: '/dashboard/subscribers' },
  {
    label: 'Go to Notifications',
    icon: Bell,
    href: '/dashboard/notifications',
  },
  { label: 'Go to Integrations', icon: Link2, href: '/dashboard/integrations' },
  {
    label: 'New entry — Acme App',
    icon: Plus,
    href: '/dashboard/acme-app/new',
  },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="backdrop"
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={() => setOpen(false)}
          />
          <motion.div
            key="palette"
            className="fixed left-1/2 top-[22%] z-50 w-full max-w-sm -translate-x-1/2"
            initial={{ opacity: 0, y: -12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
          >
            <Command className="overflow-hidden rounded-2xl border border-black/10 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.15)]">
              <div className="border-b border-black/8 px-4 py-3">
                <Command.Input
                  placeholder="Search or jump to..."
                  className="w-full bg-transparent text-sm text-black outline-none placeholder:text-black/30"
                />
              </div>
              <Command.List className="max-h-64 overflow-y-auto p-2">
                <Command.Empty className="py-8 text-center text-xs text-black/30">
                  No results found.
                </Command.Empty>
                {COMMANDS.map(({ label, icon: Icon, href }) => (
                  <Command.Item
                    key={label}
                    value={label}
                    onSelect={() => {
                      router.push(href);
                      setOpen(false);
                    }}
                    className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-black/65 transition-colors aria-selected:bg-black/5 aria-selected:text-black"
                  >
                    <Icon size={14} className="shrink-0 text-black/35" />
                    {label}
                  </Command.Item>
                ))}
              </Command.List>
              <div className="border-t border-black/6 px-4 py-2">
                <span className="text-[10px] text-black/25">
                  Press Esc to close
                </span>
              </div>
            </Command>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

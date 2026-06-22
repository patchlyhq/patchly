'use client';
import * as Dialog from '@radix-ui/react-dialog';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, Camera, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import type { CurrentUser } from '@/lib/queries';
import { authClient } from '@/lib/auth-client';

export function ProfileDialog({
  user,
  open,
  onOpenChange,
}: {
  user: CurrentUser;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [name, setName] = useState(user.name ?? '');
  const router = useRouter();

  const handleSave = async () => {
    await fetch('/api/me', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    toast.success('Profile updated');
    onOpenChange(false);
    router.refresh();
  };

  const handleSignOut = async () => {
    await authClient.signOut();
    window.location.href = '/login';
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <AnimatePresence>
          {open && (
            <>
              <Dialog.Overlay asChild>
                <motion.div
                  className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                />
              </Dialog.Overlay>
              <Dialog.Content asChild>
                <motion.div
                  className="fixed left-1/2 top-1/2 z-50 w-[calc(100vw-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 max-h-[90vh] overflow-y-auto rounded-2xl border border-black/10 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.12)] outline-none"
                  initial={{ opacity: 0, y: -12, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.97 }}
                  transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="px-6 pb-6 pt-5">
                    <div className="mb-5 flex items-center justify-between">
                      <Dialog.Title className="text-sm font-semibold text-black/60">
                        Profile
                      </Dialog.Title>
                      <Dialog.Close className="rounded-lg p-1.5 text-black/30 transition-colors hover:bg-black/5 hover:text-black/60">
                        <X size={15} />
                      </Dialog.Close>
                    </div>

                    {/* Avatar */}
                    <div className="mb-6 flex flex-col items-center gap-3">
                      <button
                        type="button"
                        onClick={() => toast('Photo upload coming soon.')}
                        className="group relative flex h-16 w-16 items-center justify-center rounded-full bg-black text-xl font-black text-white transition-opacity hover:opacity-85"
                      >
                        {(user.name?.charAt(0) ?? user.email.charAt(0)).toUpperCase()}
                        <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                          <Camera size={16} className="text-white" />
                        </span>
                      </button>
                      <div className="text-center">
                        <p className="text-sm font-semibold text-black/80">
                          {name || user.email.split('@')[0]}
                        </p>
                        <p className="text-xs text-black/35">{user.email}</p>
                      </div>
                    </div>

                    {/* Plan badge */}
                    <div className="mb-5 flex items-center justify-between rounded-xl border border-black/8 bg-[oklch(98%_0_0)] px-4 py-2.5">
                      <div>
                        <p className="text-xs text-black/35">Current plan</p>
                        <p className="text-sm font-medium text-black/70">Free</p>
                      </div>
                      <Link
                        href="/dashboard/upgrade"
                        onClick={() => onOpenChange(false)}
                        className="flex items-center gap-1 text-xs font-medium text-black/50 transition-colors hover:text-black/75"
                      >
                        Upgrade <ArrowRight size={11} />
                      </Link>
                    </div>

                    {/* Fields */}
                    <div className="space-y-3">
                      <div>
                        <label className="mb-1.5 block text-xs font-medium text-black/50">
                          Display name
                        </label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full rounded-xl border border-black/10 bg-[oklch(98%_0_0)] px-3.5 py-2.5 text-sm text-black/85 outline-none transition focus:border-black/25 focus:bg-white"
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-xs font-medium text-black/50">
                          Email
                        </label>
                        <input
                          type="email"
                          value={user.email}
                          disabled
                          className="w-full cursor-not-allowed rounded-xl border border-black/8 bg-black/3 px-3.5 py-2.5 text-sm text-black/35"
                        />
                        <p className="mt-1 text-[10px] text-black/25">
                          Email cannot be changed here.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleSave}
                      className="mt-4 w-full rounded-xl bg-black py-2.5 text-sm font-semibold text-white transition-all hover:bg-black/85"
                    >
                      Save changes
                    </button>
                  </div>

                  <div className="border-t border-black/6 px-6 py-3">
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="w-full rounded-lg py-2 text-sm text-black/35 transition-colors hover:bg-black/4 hover:text-black/55"
                    >
                      Sign out
                    </button>
                  </div>
                </motion.div>
              </Dialog.Content>
            </>
          )}
        </AnimatePresence>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

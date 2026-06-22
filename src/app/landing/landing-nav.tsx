'use client';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export function LandingNav({ isAuthed }: { isAuthed: boolean }) {
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(false);

  return (
    <motion.nav
      className="relative flex items-center justify-between px-5 py-5 border-b border-black/6 sm:px-8"
      initial={reduced ? false : { opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <span className="text-sm font-bold tracking-tight text-black">
        Patchly
      </span>

      {/* Desktop links */}
      <div className="hidden sm:flex items-center gap-6">
        <Link
          href="#features"
          className="text-sm text-black/45 hover:text-black transition-colors"
        >
          Features
        </Link>
        <Link
          href="#pricing"
          className="text-sm text-black/45 hover:text-black transition-colors"
        >
          Pricing
        </Link>
        <Link
          href={isAuthed ? '/dashboard' : '/login'}
          className="rounded-lg bg-black px-4 py-1.5 text-sm font-medium text-white hover:bg-black/85 transition-colors"
        >
          {isAuthed ? 'Dashboard' : 'Sign in'}
        </Link>
      </div>

      {/* Mobile hamburger */}
      <button
        type="button"
        className="flex sm:hidden items-center justify-center rounded-lg p-2 text-black/50 hover:text-black transition-colors"
        aria-label={open ? 'Close menu' : 'Open menu'}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? <X size={18} /> : <Menu size={18} />}
      </button>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="absolute top-[57px] left-0 right-0 z-50 border-b border-black/8 bg-white px-5 pb-4 sm:hidden"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex flex-col gap-1 pt-3">
              <Link
                href="#features"
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm text-black/55 hover:bg-black/4 hover:text-black transition-colors"
              >
                Features
              </Link>
              <Link
                href="#pricing"
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm text-black/55 hover:bg-black/4 hover:text-black transition-colors"
              >
                Pricing
              </Link>
              <Link
                href={isAuthed ? '/dashboard' : '/login'}
                onClick={() => setOpen(false)}
                className="mt-1 rounded-lg bg-black px-3 py-2.5 text-sm font-medium text-white text-center hover:bg-black/85 transition-colors"
              >
                {isAuthed ? 'Dashboard' : 'Sign in'}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

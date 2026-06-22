'use client';
import { AnimatePresence, motion } from 'motion/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const KEY = 'patchly_cookie_consent';

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(KEY)) {
      const t = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(t);
    }
  }, []);

  const respond = (value: 'accepted' | 'rejected') => {
    localStorage.setItem(KEY, value);
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.98 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-5 left-5 z-50 w-full max-w-[320px]"
        >
          <div className="rounded-2xl border border-black/10 bg-white p-4 shadow-[0_8px_32px_rgba(0,0,0,0.10)]">
            <p className="mb-0.5 text-sm font-semibold text-black/80">
              We use cookies
            </p>
            <p className="text-xs leading-relaxed text-black/45">
              We use cookies to improve your experience and analyze site usage.{' '}
              <Link
                href="/privacy"
                className="underline underline-offset-2 transition-colors hover:text-black/65"
              >
                Privacy policy
              </Link>
              .
            </p>
            <div className="mt-3.5 flex items-center gap-2">
              <button
                type="button"
                onClick={() => respond('accepted')}
                className="flex-1 rounded-xl bg-black py-2 text-xs font-semibold text-white transition-all hover:bg-black/85"
              >
                Accept all
              </button>
              <button
                type="button"
                onClick={() => respond('rejected')}
                className="flex-1 rounded-xl border border-black/10 py-2 text-xs font-medium text-black/50 transition-colors hover:bg-black/4 hover:text-black/70"
              >
                Reject
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

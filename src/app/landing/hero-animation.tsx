'use client';
import { ArrowRight, Check } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import Link from 'next/link';
import Balancer from 'react-wrap-balancer';
import { TextEffect } from '@/components/motion/text-effect';

export function HeroAnimation({ isAuthed }: { isAuthed: boolean }) {
  const reduced = useReducedMotion();

  return (
    <>
      <motion.p
        className="mb-6 text-xs font-semibold uppercase tracking-widest text-black/30"
        initial={reduced ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        Changelog infrastructure
      </motion.p>

      <h1 className="mb-6 text-4xl font-black leading-[1.02] tracking-tight text-black sm:text-6xl lg:text-7xl">
        <Balancer>
          <TextEffect
            text="Changelogs your users actually read."
            delay={0.2}
          />
        </Balancer>
      </h1>

      <motion.p
        className="mx-auto mb-10 max-w-lg text-base leading-relaxed text-black/45 sm:text-lg"
        initial={reduced ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.65, ease: [0.22, 1, 0.36, 1] }}
      >
        Write release notes once. Get a beautiful public page, an embeddable
        widget, and users who know what you shipped.
      </motion.p>

      <motion.div
        className="flex flex-wrap items-center justify-center gap-3 mb-6"
        initial={reduced ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.78, ease: [0.22, 1, 0.36, 1] }}
      >
        <Link
          href={isAuthed ? '/dashboard' : '/login'}
          className="flex items-center gap-2 rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white hover:bg-black/85 transition-all"
        >
          {isAuthed ? 'Go to dashboard' : 'Start for free'} <ArrowRight size={14} />
        </Link>
        <Link
          href="/patchly"
          className="flex items-center gap-2 rounded-xl border border-black/12 px-6 py-3 text-sm font-medium text-black/60 hover:border-black/25 hover:text-black transition-all"
        >
          See live example
        </Link>
      </motion.div>

      <motion.ul
        className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1"
        initial={reduced ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.9 }}
      >
        {[
          'Free forever plan',
          'No credit card required',
          'Live in 2 minutes',
        ].map((item) => (
          <li
            key={item}
            className="flex items-center gap-1.5 text-xs text-black/35"
          >
            <Check size={11} className="text-black/25" />
            {item}
          </li>
        ))}
      </motion.ul>
    </>
  );
}

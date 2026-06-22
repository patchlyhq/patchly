'use client';
import NumberFlow from '@number-flow/react';
import { ArrowRight, Bell, Check, Code2, Globe } from 'lucide-react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import Link from 'next/link';
import { useRef } from 'react';
import Marquee from 'react-fast-marquee';
import Balancer from 'react-wrap-balancer';
import { Reveal } from '@/components/motion/reveal';
import { SmoothScroll } from '@/components/motion/smooth-scroll';
import { TextEffect } from '@/components/motion/text-effect';

const DEMO_ENTRIES = [
  {
    version: 'v2.4.0',
    date: 'Jun 18, 2026',
    title: 'Faster search and new keyboard shortcuts',
    tags: ['Performance', 'UX'],
    content:
      'Search results now appear in under 50ms. Added ⌘K for global search.',
  },
  {
    version: 'v2.3.0',
    date: 'Jun 5, 2026',
    title: 'Markdown support in release notes',
    tags: ['New'],
    content:
      'Write release notes in full Markdown — headings, code blocks, links.',
  },
  {
    version: 'v2.2.1',
    date: 'May 28, 2026',
    title: 'Bug fixes and stability improvements',
    tags: ['Fix'],
    content: 'Fixed a race condition in the widget loader on slow connections.',
  },
];

const LOGOS = [
  {
    label: 'GitHub',
    svg: (
      <svg width="22" height="22" viewBox="0 0 98 96" aria-label="GitHub">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    label: 'Vercel',
    svg: (
      <svg width="22" height="22" viewBox="0 0 76 65" aria-label="Vercel">
        <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: 'Next.js',
    svg: (
      <svg width="22" height="22" viewBox="0 0 180 180" aria-label="Next.js">
        <mask
          id="nx"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="180"
          height="180"
        >
          <circle cx="90" cy="90" r="90" fill="black" />
        </mask>
        <g mask="url(#nx)">
          <circle cx="90" cy="90" r="90" fill="black" />
          <path
            d="M149.508 157.52L69.142 54H54V125.97H66.1875V69.3836L139.999 164.845C143.333 162.614 146.509 160.165 149.508 157.52Z"
            fill="url(#nx-g1)"
          />
          <rect x="115" y="54" width="12" height="72" fill="url(#nx-g2)" />
          <defs>
            <linearGradient
              id="nx-g1"
              x1="109"
              y1="116.5"
              x2="144.5"
              y2="160.5"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="white" />
              <stop offset="1" stopColor="white" stopOpacity="0" />
            </linearGradient>
            <linearGradient
              id="nx-g2"
              x1="121"
              y1="54"
              x2="120.799"
              y2="106.875"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="white" />
              <stop offset="1" stopColor="white" stopOpacity="0" />
            </linearGradient>
          </defs>
        </g>
      </svg>
    ),
  },
  {
    label: 'Stripe',
    svg: (
      <svg width="38" height="16" viewBox="0 0 468 222" aria-label="Stripe">
        <path
          d="M414 113.4c0-25.6-12.4-45.8-36.1-45.8-23.8 0-38.2 20.2-38.2 45.6 0 30.1 17 45.3 41.4 45.3 11.9 0 20.9-2.7 27.7-6.5v-20c-6.8 3.4-14.6 5.5-24.5 5.5-9.7 0-18.3-3.4-19.4-15.2H414c0-1.3.2-6.5.2-8.9zm-49.4-9.5c0-11.3 6.9-16 13.2-16 6.1 0 12.6 4.7 12.6 16h-25.8zM301.1 67.6c-9.8 0-16.1 4.6-19.6 7.8l-1.3-6.2h-22v116.6l25-5.3.1-28.3c3.6 2.6 8.9 6.3 17.7 6.3 17.9 0 34.2-14.4 34.2-46.1-.1-29-16.6-44.8-34.1-44.8zm-6 68.9c-5.9 0-9.4-2.1-11.8-4.7l-.1-37.1c2.6-2.9 6.2-4.9 11.9-4.9 9.1 0 15.4 10.2 15.4 23.3 0 13.4-6.2 23.4-15.4 23.4zM223.8 61.7l25.1-5.4V36l-25.1 5.3zM223.8 69.2H248.9V157.5H223.8zM196.9 76.7l-1.6-7.5h-21.6V157.5h25V97.2c5.9-7.7 15.9-6.3 19-5.2V69.2c-3.2-1.2-14.9-3.4-20.8 7.5zM146.9 47.6l-24.4 5.2-.1 80.1c0 14.8 11.1 25.7 25.9 25.7 8.2 0 14.2-1.5 17.5-3.3V135c-3.2 1.3-19 5.9-19-8.9V90.6h19V69.2h-19l.1-21.6zM79.3 94.7c0-3.9 3.2-5.4 8.5-5.4 7.6 0 17.2 2.3 24.8 6.4V72.2c-8.3-3.3-16.5-4.6-24.8-4.6C67.5 67.6 54 78.2 54 95.9c0 27.6 38 23.2 38 35.1 0 4.6-4 6.1-9.6 6.1-8.3 0-18.9-3.4-27.3-8v23.8c9.3 4 18.7 5.7 27.3 5.7 20.8 0 35.1-10.3 35.1-28.2-.1-29.8-38.2-24.5-38.2-35.7z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    label: 'Supabase',
    svg: (
      <svg width="20" height="22" viewBox="0 0 109 113" aria-label="Supabase">
        <defs>
          <linearGradient
            id="sb-g1"
            x1="66"
            y1="0"
            x2="66"
            y2="106"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#249361" />
            <stop offset="1" stopColor="#3ECF8E" />
          </linearGradient>
          <linearGradient
            id="sb-g2"
            x1="0"
            y1="0"
            x2="66"
            y2="113"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#000" />
            <stop offset="1" stopColor="#000" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d="M63.708 110.284c-2.86 3.601-8.655 1.628-8.768-2.97l-1.509-58.996h39.5c7.192 0 11.188 8.337 6.621 13.9l-35.844 48.066z"
          fill="url(#sb-g1)"
        />
        <path
          d="M63.708 110.284c-2.86 3.601-8.655 1.628-8.768-2.97l-1.509-58.996h39.5c7.192 0 11.188 8.337 6.621 13.9l-35.844 48.066z"
          fill="url(#sb-g2)"
          fillOpacity="0.2"
        />
        <path
          d="M45.317 2.071C48.177-1.53 53.972.443 54.085 5.041l1.51 58.997H16.094c-7.192 0-11.188-8.338-6.621-13.9L45.317 2.071z"
          fill="#3ECF8E"
        />
      </svg>
    ),
  },
  {
    label: 'Linear',
    svg: (
      <svg width="20" height="20" viewBox="0 0 100 100" aria-label="Linear">
        <path
          d="M1.22541 61.5228c-.2225-.9485.90748-1.5459 1.59638-.857l36.3582 36.3582c.6889.6889.0915 1.8189-.857 1.5964C20.0515 94.4522 5.54779 79.9485 1.22541 61.5228zM.00189135 46.8891c-.01764375.2833.08887.5599.28957.7606L52.3503 99.7085c.2007.2007.4773.3075.7606.2896 2.3692-.1476 4.6938-.46 6.9624-.9259.7645-.157 1.0301-1.0963.4782-1.6481L2.14184 39.9313c-.55186-.5519-1.49117-.2863-1.648174.4782-.465915 2.2686-.77976 4.5932-.927346 6.9626zM4.21093 29.7054c-.16649.3738-.08169.8106.20765 1.1l64.7766 64.7766c.2894.2894.7262.3742 1.1.2077 1.7861-.7956 3.5171-1.6927 5.1855-2.684.5521-.328.6373-1.0867.1832-1.5407L8.07364 24.3367c-.45409-.4541-1.21271-.3689-1.54074.1832-.99132 1.6684-1.88843 3.3994-2.68397 5.1855zM13.8175 18.4045c-.3701-.3701-.3701-.9703 0-1.3404C22.4073 8.71652 34.4018 3.48324 47.5699 3.48324c13.1682 0 25.1627 5.23328 33.7525 13.82306 8.5898 8.5898 13.8231 20.5843 13.8231 33.7525 0 13.1682-5.2333 25.1627-13.8231 33.7525-.3701.3701-.9703.3701-1.3404 0L13.8175 18.4045z"
          fill="currentColor"
        />
      </svg>
    ),
  },
];

const FEATURES = [
  {
    icon: Globe,
    title: 'Beautiful public pages',
    body: 'Every project gets a clean, shareable changelog URL. Your users can browse, filter by tag, and subscribe — no account needed.',
  },
  {
    icon: Code2,
    title: 'One-line embed',
    body: 'Drop a script tag. A floating widget shows your latest updates inside your app — no build step, no framework dependency.',
  },
  {
    icon: Bell,
    title: 'Subscriber notifications',
    body: 'Users subscribe with their email. Every new release triggers a digest automatically. Write once, everyone knows.',
  },
];

function PricingNumber({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  return (
    <span ref={ref}>
      <NumberFlow value={inView ? value : 0} format={{ style: 'decimal' }} />
    </span>
  );
}

function TrustStat({
  value,
  suffix,
  label,
}: {
  value: number;
  suffix: string;
  label: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  return (
    <div ref={ref} className="text-center">
      <p className="flex items-baseline justify-center gap-0.5 text-5xl font-black tracking-tight text-black">
        <NumberFlow value={inView ? value : 0} />
        <span className="text-2xl text-black/65">{suffix}</span>
      </p>
      <p className="mt-2 text-xs font-medium uppercase tracking-widest text-black/30">
        {label}
      </p>
    </div>
  );
}

function WidgetPreview() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '80px' });

  return (
    <div
      ref={ref}
      className="overflow-hidden rounded-2xl border border-black/10 shadow-[0_8px_40px_rgba(0,0,0,0.07)]"
    >
      {/* Browser chrome */}
      <div className="flex items-center gap-2 border-b border-black/8 bg-[oklch(97.5%_0_0)] px-4 py-2.5">
        <div className="flex gap-1.5">
          <div className="h-2 w-2 rounded-full bg-black/10" />
          <div className="h-2 w-2 rounded-full bg-black/10" />
          <div className="h-2 w-2 rounded-full bg-black/10" />
        </div>
        <div className="flex flex-1 justify-center">
          <div className="flex items-center gap-1.5 rounded-md bg-black/6 px-2.5 py-0.5">
            <div className="h-1.5 w-1.5 rounded-full bg-black/20" />
            <span className="text-[10px] text-black/35">
              myapp.com/dashboard
            </span>
          </div>
        </div>
        <div className="w-16" />
      </div>

      {/* App content */}
      <div className="relative bg-white" style={{ height: 280 }}>
        {/* Fake sidebar */}
        <div className="absolute inset-y-0 left-0 flex w-12 flex-col items-center gap-3 border-r border-black/5 bg-[oklch(98.5%_0_0)] py-4">
          <div className="h-5 w-5 rounded-md bg-black/12" />
          <div className="mt-2 h-3.5 w-3.5 rounded bg-black/6" />
          <div className="h-3.5 w-3.5 rounded bg-black/6" />
          <div className="h-3.5 w-3.5 rounded bg-black/6" />
        </div>

        {/* Fake page content */}
        <div className="ml-12 p-5 opacity-40">
          <div className="mb-4 h-3 w-28 rounded bg-black/15" />
          <div className="mb-4 grid grid-cols-3 gap-2">
            <div className="h-12 rounded-lg bg-black/7" />
            <div className="h-12 rounded-lg bg-black/7" />
            <div className="h-12 rounded-lg bg-black/7" />
          </div>
          <div className="space-y-2">
            <div className="h-2 w-full rounded bg-black/7" />
            <div className="h-2 w-5/6 rounded bg-black/5" />
            <div className="h-2 w-4/6 rounded bg-black/5" />
          </div>
        </div>

        {/* Animated widget popup */}
        <div className="absolute bottom-3 right-3">
          <motion.div
            className="mb-2 w-60 overflow-hidden rounded-xl border border-black/10 bg-white shadow-[0_8px_28px_rgba(0,0,0,0.13)]"
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{
              delay: 0.45,
              duration: 0.38,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <div className="flex items-center justify-between border-b border-black/6 px-3.5 py-2.5">
              <span className="text-xs font-semibold text-black">
                What&apos;s new
              </span>
              <span className="rounded-full bg-black px-1.5 py-0.5 text-[9px] font-bold text-white">
                3
              </span>
            </div>
            <div className="divide-y divide-black/5">
              {[
                {
                  version: 'v2.4.0',
                  title: 'Faster search + ⌘K',
                  tag: 'Performance',
                },
                { version: 'v2.3.0', title: 'Markdown support', tag: 'New' },
              ].map((e) => (
                <div key={e.version} className="px-3.5 py-2.5">
                  <div className="mb-0.5 flex items-center gap-1.5">
                    <span className="font-mono text-[9px] text-black/35">
                      {e.version}
                    </span>
                    <span className="rounded border border-black/10 px-1 py-px text-[8px] text-black/30">
                      {e.tag}
                    </span>
                  </div>
                  <p className="text-[11px] font-medium text-black/72">
                    {e.title}
                  </p>
                </div>
              ))}
            </div>
            <div className="border-t border-black/6 px-3.5 py-2">
              <span className="text-[10px] text-black/35">
                View all updates →
              </span>
            </div>
          </motion.div>

          <motion.div
            className="flex justify-end"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{
              delay: 0.25,
              duration: 0.3,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <div className="flex items-center gap-1.5 rounded-full bg-black px-3 py-1.5 shadow-lg">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
              </span>
              <span className="text-[10px] font-medium text-white">
                What&apos;s new
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  const reduced = useReducedMotion();

  return (
    <div className="min-h-screen bg-white">
      <SmoothScroll />

      {/* Nav */}
      <motion.nav
        className="flex items-center justify-between px-8 py-5 border-b border-black/6"
        initial={reduced ? false : { opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className="text-sm font-bold tracking-tight text-black">
          Patchly
        </span>
        <div className="flex items-center gap-6">
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
            href="/login"
            className="rounded-lg bg-black px-4 py-1.5 text-sm font-medium text-white hover:bg-black/85 transition-colors"
          >
            Sign in
          </Link>
        </div>
      </motion.nav>

      {/* Hero */}
      <section className="mx-auto max-w-4xl px-8 pt-24 pb-16 text-center">
        <motion.p
          className="mb-6 text-xs font-semibold uppercase tracking-widest text-black/30"
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Changelog infrastructure
        </motion.p>

        <h1 className="mb-6 text-6xl font-black leading-[1.02] tracking-tight text-black lg:text-7xl">
          <Balancer>
            <TextEffect
              text="Changelogs your users actually read."
              delay={0.2}
            />
          </Balancer>
        </h1>

        <motion.p
          className="mx-auto mb-10 max-w-lg text-lg leading-relaxed text-black/45"
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
            href="/login"
            className="flex items-center gap-2 rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white hover:bg-black/85 transition-all"
          >
            Start for free <ArrowRight size={14} />
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
      </section>

      {/* Product preview */}
      <Reveal className="mx-auto max-w-3xl px-8 pb-24" delay={0.1}>
        <div className="overflow-hidden rounded-2xl border border-black/10 shadow-[0_8px_40px_rgba(0,0,0,0.08)]">
          <div className="flex items-center gap-2 border-b border-black/8 bg-[oklch(98%_0_0)] px-4 py-3">
            <div className="flex gap-1.5">
              <div className="h-2.5 w-2.5 rounded-full bg-black/10" />
              <div className="h-2.5 w-2.5 rounded-full bg-black/10" />
              <div className="h-2.5 w-2.5 rounded-full bg-black/10" />
            </div>
            <div className="mx-auto flex items-center gap-1.5 rounded-md bg-black/5 px-3 py-1">
              <div className="h-1.5 w-1.5 rounded-full bg-black/20" />
              <span className="text-xs text-black/35">acme-app.patchly.io</span>
            </div>
          </div>
          <div className="bg-white px-10 py-10">
            <div className="mb-10">
              <h2 className="text-2xl font-black tracking-tight text-black">
                Acme App
              </h2>
              <p className="mt-1 text-sm text-black/40">
                Building in public. Every release, documented.
              </p>
            </div>
            <div className="relative space-y-0">
              <div className="absolute left-[5px] top-2 bottom-2 w-px bg-black/8" />
              {DEMO_ENTRIES.map((entry, i) => (
                <div key={entry.version} className="flex gap-6 pb-8">
                  <div className="relative mt-1.5 shrink-0">
                    <div className="h-2.5 w-2.5 rounded-full border border-black/20 bg-white" />
                  </div>
                  <div
                    className="flex-1 min-w-0"
                    style={{ opacity: 1 - i * 0.15 }}
                  >
                    <div className="mb-1.5 flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs text-black/40">
                        {entry.version}
                      </span>
                      <span className="text-xs text-black/25">
                        {entry.date}
                      </span>
                      {entry.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded border border-black/10 px-1.5 py-px text-[10px] text-black/35"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <p className="text-sm font-semibold text-black/80 mb-1">
                      {entry.title}
                    </p>
                    <p className="text-xs leading-relaxed text-black/45">
                      {entry.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Reveal>

      {/* Trust numbers */}
      <section className="border-y border-black/6 py-16">
        <div className="mx-auto grid max-w-2xl grid-cols-3 gap-8 px-8">
          <Reveal>
            <TrustStat value={2400} suffix="+" label="changelogs live" />
          </Reveal>
          <Reveal delay={0.05}>
            <TrustStat value={18000} suffix="+" label="users notified" />
          </Reveal>
          <Reveal delay={0.1}>
            <TrustStat value={5} suffix="min" label="to set up" />
          </Reveal>
        </div>
      </section>

      {/* Logo marquee */}
      <section className="border-b border-black/6 bg-[oklch(98.5%_0_0)] py-12">
        <p className="mb-8 text-center text-[10px] font-semibold uppercase tracking-widest text-black/25">
          Works with the tools you already use
        </p>
        <Marquee
          speed={28}
          pauseOnHover
          gradient
          gradientColor="oklch(98.5% 0 0)"
          gradientWidth={80}
          className="grayscale"
        >
          {[...LOGOS, ...LOGOS].map(({ label, svg }, i) => (
            <div
              key={`${label}-${i}`}
              className="mx-10 opacity-30 hover:opacity-75 transition-opacity"
            >
              {svg}
            </div>
          ))}
        </Marquee>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-5xl px-8 py-28">
        <Reveal>
          <h2 className="mb-3 text-center text-3xl font-black tracking-tight text-black">
            Everything a changelog needs
          </h2>
          <p className="mb-16 text-center text-sm text-black/40">
            Built for products that ship continuously.
          </p>
        </Reveal>
        <div className="grid gap-5 md:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, body }, i) => (
            <Reveal key={title} delay={i * 0.07}>
              <div className="h-full rounded-2xl border border-black/8 bg-[oklch(98.5%_0_0)] p-7 transition-colors hover:border-black/15 hover:bg-white">
                <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-black/6">
                  <Icon size={17} className="text-black/55" />
                </div>
                <h3 className="mb-2.5 text-sm font-bold text-black/85">
                  {title}
                </h3>
                <p className="text-sm leading-relaxed text-black/45">{body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Widget demo */}
      <section className="border-y border-black/6 bg-[oklch(98.5%_0_0)] py-24">
        <div className="mx-auto grid max-w-4xl items-center gap-12 px-8 md:grid-cols-2">
          <Reveal>
            <p className="mb-4 font-mono text-xs font-medium text-black/30">
              embed
            </p>
            <h2 className="mb-4 text-3xl font-black tracking-tight text-black">
              Drop it anywhere. In one line.
            </h2>
            <p className="mb-7 text-sm leading-relaxed text-black/45">
              Add a single script tag to your site. A floating widget shows your
              latest updates inside your app — no build step, no framework
              dependency, no configuration required.
            </p>
            <div className="overflow-x-auto rounded-xl bg-black px-4 py-3.5">
              <code className="font-mono text-xs leading-relaxed">
                <span className="text-white/30">{'<'}</span>
                <span className="text-white/65">script</span>{' '}
                <span className="text-white/40">src</span>
                <span className="text-white/30">{'="'}</span>
                <span className="text-white/85">
                  https://patchly.io/widget.js
                </span>
                <span className="text-white/30">{'"'}</span>{' '}
                <span className="text-white/40">data-project</span>
                <span className="text-white/30">{'="'}</span>
                <span className="text-white/85">my-app</span>
                <span className="text-white/30">{'"'}</span>
                <span className="text-white/30">{' />'}</span>
              </code>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <WidgetPreview />
          </Reveal>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="mx-auto max-w-4xl px-8 py-28">
        <Reveal>
          <h2 className="mb-3 text-center text-3xl font-black tracking-tight text-black">
            Simple pricing
          </h2>
          <p className="mb-14 text-center text-sm text-black/40">
            No per-seat fees. No surprises.
          </p>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-4">
          <Reveal delay={0.05}>
            <div className="rounded-2xl border border-black/10 p-8 h-full">
              <p className="font-mono text-xs text-black/30 mb-4">free</p>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-5xl font-black text-black">
                  $<PricingNumber value={0} />
                </span>
              </div>
              <p className="text-sm text-black/40 mb-8">
                For indie hackers and side projects
              </p>
              <ul className="mb-8 space-y-2.5">
                {[
                  '1 project',
                  '50 entries/mo',
                  'Public changelog page',
                  'Patchly branding',
                ].map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-2 text-sm text-black/55"
                  >
                    <Check size={13} className="shrink-0 text-black/25" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/login"
                className="block w-full rounded-xl border border-black/12 py-2.5 text-center text-sm text-black/50 hover:bg-black/3 hover:text-black/70 transition-colors"
              >
                Get started
              </Link>
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="rounded-2xl bg-black p-8 h-full">
              <p className="font-mono text-xs text-white/35 mb-4">pro</p>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-5xl font-black text-white">
                  $<NumberFlow value={12} className="tabular-nums" />
                </span>
                <span className="text-sm text-white/40">/mo</span>
              </div>
              <p className="text-sm text-white/45 mb-8">For growing products</p>
              <ul className="mb-8 space-y-2.5">
                {[
                  'Unlimited projects',
                  'Unlimited entries',
                  'Custom domain',
                  'Embeddable widget',
                  'Remove branding',
                  'API access',
                ].map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-2 text-sm text-white/70"
                  >
                    <Check size={13} className="shrink-0 text-white/35" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/login"
                className="block w-full rounded-xl bg-white py-2.5 text-center text-sm font-semibold text-black hover:bg-white/90 transition-all"
              >
                Get started
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-black px-8 py-28">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="mb-4 text-[2.75rem] font-black leading-[1.06] tracking-tight text-white">
            <Balancer>Ship your first changelog in 2 minutes.</Balancer>
          </h2>
          <p className="mb-10 text-base leading-relaxed text-white/40">
            Free to start. No credit card required. Your changelog is live
            before your next deploy.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/login"
              className="flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm font-semibold text-black hover:bg-white/92 transition-all"
            >
              Get started free <ArrowRight size={14} />
            </Link>
            <Link
              href="/patchly"
              className="rounded-xl border border-white/15 px-7 py-3.5 text-sm font-medium text-white/60 hover:border-white/30 hover:text-white/80 transition-all"
            >
              See live example
            </Link>
          </div>
        </Reveal>
      </section>

      {/* Footer */}
      <footer className="border-t border-black/6 px-8 py-8">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-4">
          <span className="text-xs text-black/25">Patchly &copy; 2026</span>
          <div className="flex items-center gap-5">
            {['Docs', 'Privacy', 'Terms'].map((link) => (
              <Link
                key={link}
                href={`/${link.toLowerCase()}`}
                className="text-xs text-black/30 hover:text-black/55 transition-colors"
              >
                {link}
              </Link>
            ))}
            <a
              href="https://github.com"
              className="text-xs text-black/30 hover:text-black/55 transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

'use client';
import NumberFlow from '@number-flow/react';
import * as Accordion from '@radix-ui/react-accordion';
import { ArrowRight, Check, Plus } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';

const PRO_FEATURES = [
  'Unlimited projects',
  'Unlimited entries',
  'Custom domain',
  'Embeddable widget',
  'Remove Patchly branding',
  'API access',
];

const FAQS = [
  {
    q: 'Can I cancel anytime?',
    a: 'Yes. Cancel from your account settings at any time. You keep Pro access until the end of your billing period.',
  },
  {
    q: 'What happens to my changelogs if I downgrade?',
    a: "They stay live and public. You just can't add new entries until you upgrade again.",
  },
  {
    q: 'Do you offer yearly billing?',
    a: "Coming soon. We'll notify you when annual plans are available.",
  },
];

export default function UpgradePage() {
  return (
    <div className="max-w-lg space-y-10">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text)]">Upgrade</h1>
        <p className="mt-2 text-sm text-[var(--color-muted)]">
          You&apos;re on the{' '}
          <span className="font-medium text-black/70">Free plan</span>.
        </p>
      </div>

      <motion.div
        className="rounded-2xl bg-black p-8 text-white"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="mb-4 font-mono text-xs text-white/40">pro</p>
        <div className="mb-1 flex items-baseline gap-1">
          <span className="text-5xl font-black">
            $<NumberFlow value={12} />
          </span>
          <span className="text-sm text-white/50">/ month</span>
        </div>
        <p className="mb-7 text-sm text-white/50">
          Everything you need to ship confidently.
        </p>

        <ul className="mb-8 space-y-2.5">
          {PRO_FEATURES.map((f, i) => (
            <motion.li
              key={f}
              className="flex items-center gap-2.5 text-sm text-white/75"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.3,
                delay: 0.1 + i * 0.06,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <Check size={14} className="shrink-0 text-white/40" />
              {f}
            </motion.li>
          ))}
        </ul>

        <button
          type="button"
          onClick={() =>
            toast('Redirecting to checkout…', {
              description: 'Stripe checkout coming soon.',
            })
          }
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-white py-3 text-sm font-semibold text-black transition-all hover:bg-white/90"
        >
          Upgrade to Pro <ArrowRight size={14} />
        </button>

        <p className="mt-4 text-center text-xs text-white/30">
          Billed monthly. Cancel anytime.
        </p>
      </motion.div>

      <div>
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-black/30">
          FAQ
        </h2>
        <Accordion.Root type="single" collapsible className="space-y-2">
          {FAQS.map(({ q, a }) => (
            <Accordion.Item
              key={q}
              value={q}
              className="overflow-hidden rounded-xl border border-black/8 bg-[oklch(98%_0_0)] data-[state=open]:bg-white transition-colors"
            >
              <Accordion.Trigger className="group flex w-full cursor-pointer items-center justify-between px-5 py-4 text-left text-sm font-medium text-black/75 select-none">
                {q}
                <Plus
                  size={14}
                  className="shrink-0 text-black/25 transition-transform duration-200 group-data-[state=open]:rotate-45"
                />
              </Accordion.Trigger>
              <Accordion.Content className="overflow-hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-up-4 data-[state=open]:slide-down-4">
                <p className="px-5 pb-4 text-sm leading-relaxed text-black/50">
                  {a}
                </p>
              </Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      </div>
    </div>
  );
}

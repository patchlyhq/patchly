'use client';
import NumberFlow from '@number-flow/react';
import { ArrowRight, Check } from 'lucide-react';
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

export function UpgradeCard() {
  return (
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
      <p className="mb-7 text-sm text-white/50">Everything you need to ship confidently.</p>

      <ul className="mb-8 space-y-2.5">
        {PRO_FEATURES.map((f, i) => (
          <motion.li
            key={f}
            className="flex items-center gap-2.5 text-sm text-white/75"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
          >
            <Check size={14} className="shrink-0 text-white/40" />
            {f}
          </motion.li>
        ))}
      </ul>

      <button
        type="button"
        onClick={() =>
          toast('Redirecting to checkout…', { description: 'Stripe checkout coming soon.' })
        }
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-white py-3 text-sm font-semibold text-black transition-all hover:bg-white/90"
      >
        Upgrade to Pro <ArrowRight size={14} />
      </button>

      <p className="mt-4 text-center text-xs text-white/30">Billed monthly. Cancel anytime.</p>
    </motion.div>
  );
}

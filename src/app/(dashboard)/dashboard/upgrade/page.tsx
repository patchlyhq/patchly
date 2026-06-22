import { Clock } from 'lucide-react';

export default function UpgradePage() {
  return (
    <div className="max-w-lg space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text)]">Upgrade</h1>
        <p className="mt-2 text-sm text-[var(--color-muted)]">
          You&apos;re on the{' '}
          <span className="font-medium text-black/70">Free plan</span>.
        </p>
      </div>

      <div className="rounded-2xl border border-black/8 bg-[oklch(98%_0_0)] p-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-black/8 bg-white">
          <Clock size={20} className="text-black/30" />
        </div>
        <h2 className="mb-2 text-base font-semibold text-black/75">Payments aren&apos;t ready yet</h2>
        <p className="text-sm leading-relaxed text-black/40">
          Pro plan is coming soon. For now, everything is free — no limits, no card required. We&apos;ll let you know when billing goes live.
        </p>
      </div>
    </div>
  );
}

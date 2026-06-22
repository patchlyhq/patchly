import { UpgradeCard } from './upgrade-card';
import { UpgradeFAQ } from './upgrade-faq';

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

      <UpgradeCard />

      <UpgradeFAQ />
    </div>
  );
}

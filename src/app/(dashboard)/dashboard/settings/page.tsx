'use client';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

const PROJECTS = [
  { name: 'Acme App', slug: 'acme-app' },
  { name: 'Dev Tools', slug: 'dev-tools' },
];

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
        checked ? 'bg-black' : 'bg-black/15'
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow transition-transform duration-200 ${
          checked ? 'translate-x-4' : 'translate-x-0'
        }`}
      />
    </button>
  );
}

export default function SettingsPage() {
  const [notifySubscriber, setNotifySubscriber] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);
  const [widgetBranding, setWidgetBranding] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const router = useRouter();

  const handleToggle = (label: string, value: boolean) => {
    toast(`${label} ${value ? 'enabled' : 'disabled'}`);
  };

  return (
    <div className="max-w-2xl space-y-12">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text)]">Settings</h1>
        <p className="mt-1 text-sm text-[var(--color-muted)]">
          Workspace preferences and configuration.
        </p>
      </div>

      {/* Projects */}
      <section className="space-y-4">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-black/30">Projects</h2>
        <div className="space-y-2">
          {PROJECTS.map((p) => (
            <div
              key={p.slug}
              className="flex items-center justify-between rounded-xl border border-black/8 bg-[oklch(98%_0_0)] px-4 py-3"
            >
              <div>
                <p className="text-sm font-medium text-black/80">{p.name}</p>
                <p className="text-xs text-black/30">/{p.slug}</p>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  href={`/${p.slug}`}
                  target="_blank"
                  className="flex items-center gap-1 text-xs text-black/35 transition-colors hover:text-black/65"
                >
                  View public <ArrowUpRight size={12} />
                </Link>
                <Link
                  href={`/dashboard/${p.slug}`}
                  className="text-xs text-black/35 transition-colors hover:text-black/65"
                >
                  Manage
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="h-px bg-black/6" />

      {/* Notifications */}
      <section className="space-y-4">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-black/30">Notifications</h2>
        <div className="space-y-3">
          {(
            [
              { label: 'Email me on new subscriber', value: notifySubscriber, set: setNotifySubscriber },
              { label: 'Weekly digest email', value: weeklyDigest, set: setWeeklyDigest },
            ] as const
          ).map(({ label, value, set }) => (
            <div
              key={label}
              className="flex items-center justify-between rounded-xl border border-black/8 bg-[oklch(98%_0_0)] px-4 py-3"
            >
              <span className="text-sm text-black/70">{label}</span>
              <Toggle
                checked={value}
                onChange={(v) => {
                  set(v);
                  handleToggle(label, v);
                }}
              />
            </div>
          ))}
        </div>
      </section>

      <div className="h-px bg-black/6" />

      {/* Branding */}
      <section className="space-y-4">
        <div className="flex items-start justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-black/30">Branding</h2>
          <span className="rounded-full border border-black/10 px-2 py-0.5 text-[10px] font-medium text-black/35">
            Pro
          </span>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-xl border border-black/8 bg-[oklch(98%_0_0)] px-4 py-3">
            <div>
              <p className="text-sm text-black/70">Show &quot;Powered by Patchly&quot;</p>
              <p className="text-xs text-black/30">Displayed in the footer of your public changelog.</p>
            </div>
            <Toggle
              checked={widgetBranding}
              onChange={(v) => {
                if (!v) {
                  toast('Remove branding requires Pro.', {
                    action: { label: 'Upgrade', onClick: () => router.push('/dashboard/upgrade') },
                  });
                  return;
                }
                setWidgetBranding(v);
              }}
            />
          </div>
          <div className="rounded-xl border border-black/8 bg-[oklch(98%_0_0)] px-4 py-3 opacity-50">
            <p className="text-sm text-black/70">Custom domain</p>
            <p className="text-xs text-black/30">Point your own domain to your public changelog.</p>
            <p className="mt-2 text-xs font-medium text-black/40">
              Requires Pro ·{' '}
              <Link
                href="/dashboard/upgrade"
                className="underline underline-offset-2 transition-colors hover:text-black/60"
              >
                Upgrade
              </Link>
            </p>
          </div>
        </div>
      </section>

      <div className="h-px bg-black/6" />

      {/* Danger zone */}
      <section className="space-y-4">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-red-400/70">Danger zone</h2>
        <div className="rounded-xl border border-red-100 bg-red-50/30 p-5">
          <p className="mb-3 text-sm text-black/55">
            Permanently delete your account and all associated projects. This cannot be undone.
          </p>
          {!confirmDelete ? (
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              className="rounded-lg border border-red-200 px-4 py-2 text-sm text-red-400 transition-colors hover:bg-red-50"
            >
              Delete account
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <p className="text-sm font-medium text-red-500">Are you sure?</p>
              <button
                type="button"
                onClick={() => {
                  toast.success('Account deleted');
                  router.push('/');
                }}
                className="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-600"
              >
                Yes, delete everything
              </button>
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                className="text-sm text-black/40 transition-colors hover:text-black/65"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

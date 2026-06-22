import { NotificationsTable } from './notifications-client';

const NOTIFICATIONS = [
  {
    id: '1',
    entryTitle: 'Faster search and new keyboard shortcuts',
    version: 'v2.4.0',
    project: 'Acme App',
    recipients: 136,
    sentDate: 'Jun 18, 2026 at 9:14 AM',
    status: 'delivered' as const,
    openRate: 42,
    clickRate: 18,
  },
  {
    id: '2',
    entryTitle: 'Markdown support in release notes',
    version: 'v2.3.0',
    project: 'Acme App',
    recipients: 129,
    sentDate: 'Jun 5, 2026 at 11:02 AM',
    status: 'delivered' as const,
    openRate: 51,
    clickRate: 23,
  },
  {
    id: '3',
    entryTitle: 'CLI tool beta release',
    version: 'v1.0.0',
    project: 'Dev Tools',
    recipients: 44,
    sentDate: 'Jun 2, 2026 at 2:30 PM',
    status: 'delivered' as const,
    openRate: 67,
    clickRate: 38,
  },
  {
    id: '4',
    entryTitle: 'Bug fixes and stability improvements',
    version: 'v2.2.1',
    project: 'Acme App',
    recipients: 122,
    sentDate: 'May 28, 2026 at 3:15 PM',
    status: 'delivered' as const,
    openRate: 35,
    clickRate: 12,
  },
  {
    id: '5',
    entryTitle: 'Embeddable widget is live',
    version: 'v2.2.0',
    project: 'Acme App',
    recipients: 118,
    sentDate: 'May 12, 2026 at 10:45 AM',
    status: 'delivered' as const,
    openRate: 58,
    clickRate: 31,
  },
  {
    id: '6',
    entryTitle: 'Performance dashboard v2',
    version: 'v0.9.0',
    project: 'Dev Tools',
    recipients: 38,
    sentDate: 'May 8, 2026 at 4:00 PM',
    status: 'delivered' as const,
    openRate: 72,
    clickRate: 44,
  },
  {
    id: '7',
    entryTitle: 'Dark mode support — WIP',
    version: 'v2.5.0',
    project: 'Acme App',
    recipients: 148,
    sentDate: 'Jun 22, 2026 at 1:00 PM',
    status: 'pending' as const,
  },
  {
    id: '8',
    entryTitle: 'Webhook integrations beta',
    version: 'v1.1.0',
    project: 'Dev Tools',
    recipients: 44,
    sentDate: 'Apr 15, 2026 at 9:30 AM',
    status: 'failed' as const,
    failReason: 'Email provider rate limit exceeded. Retry scheduled.',
  },
];

export default function NotificationsPage() {
  const delivered = NOTIFICATIONS.filter((n) => n.status === 'delivered').length;
  const pending = NOTIFICATIONS.filter((n) => n.status === 'pending').length;
  const failed = NOTIFICATIONS.filter((n) => n.status === 'failed').length;
  const totalRecipients = NOTIFICATIONS.reduce((sum, n) => sum + n.recipients, 0);

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--color-text)]">Notifications</h1>
        <p className="mt-1 text-sm text-[var(--color-muted)]">
          Outgoing email notifications sent to your subscribers.
        </p>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: 'Total sent', value: NOTIFICATIONS.length },
          { label: 'Total recipients', value: totalRecipients },
          { label: 'Delivered', value: delivered },
          { label: 'Failed', value: failed },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-xl border border-black/8 bg-white px-5 py-4">
            <p className="text-xs text-black/35">{label}</p>
            <p className="mt-1 text-2xl font-bold text-[var(--color-text)]">{value}</p>
          </div>
        ))}
      </div>

      <NotificationsTable notifications={NOTIFICATIONS} pending={pending} />
    </div>
  );
}

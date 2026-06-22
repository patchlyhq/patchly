import { redirect } from 'next/navigation';
import { getCurrentUser, getNotificationLogs } from '@/lib/queries';
import { NotificationsTable } from './notifications-client';

export default async function NotificationsPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const logs = await getNotificationLogs(user.id);

  const notifications = logs.map((log) => ({
    id: log.id,
    entryTitle: log.entryTitle,
    version: log.version ?? '',
    project: log.projectName,
    recipients: log.recipientCount,
    sentDate: log.sentAt.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }),
    status: 'delivered' as const,
  }));

  const totalRecipients = notifications.reduce((sum, n) => sum + n.recipients, 0);

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
          { label: 'Total sent', value: notifications.length },
          { label: 'Total recipients', value: totalRecipients },
          { label: 'Delivered', value: notifications.length },
          { label: 'Failed', value: 0 },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-xl border border-black/8 bg-white px-5 py-4">
            <p className="text-xs text-black/35">{label}</p>
            <p className="mt-1 text-2xl font-bold text-[var(--color-text)]">{value}</p>
          </div>
        ))}
      </div>

      {notifications.length === 0 ? (
        <div className="flex min-h-48 items-center justify-center rounded-xl border border-black/8 bg-white">
          <p className="text-sm text-black/40">
            No notifications sent yet. Publish a changelog entry to send your first.
          </p>
        </div>
      ) : (
        <NotificationsTable notifications={notifications} pending={0} />
      )}
    </div>
  );
}

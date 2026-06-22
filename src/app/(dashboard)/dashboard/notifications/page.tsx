'use client';
import { ChevronDown } from 'lucide-react';
import { Fragment, useState } from 'react';

interface NotificationRecord {
  id: string;
  entryTitle: string;
  version: string;
  project: string;
  recipients: number;
  sentDate: string;
  status: 'delivered' | 'pending' | 'failed';
  openRate?: number;
  clickRate?: number;
  failReason?: string;
}

const NOTIFICATIONS: NotificationRecord[] = [
  {
    id: '1',
    entryTitle: 'Faster search and new keyboard shortcuts',
    version: 'v2.4.0',
    project: 'Acme App',
    recipients: 136,
    sentDate: 'Jun 18, 2026 at 9:14 AM',
    status: 'delivered',
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
    status: 'delivered',
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
    status: 'delivered',
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
    status: 'delivered',
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
    status: 'delivered',
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
    status: 'delivered',
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
    status: 'pending',
  },
  {
    id: '8',
    entryTitle: 'Webhook integrations beta',
    version: 'v1.1.0',
    project: 'Dev Tools',
    recipients: 44,
    sentDate: 'Apr 15, 2026 at 9:30 AM',
    status: 'failed',
    failReason: 'Email provider rate limit exceeded. Retry scheduled.',
  },
];

const STATUS_STYLES: Record<NotificationRecord['status'], string> = {
  delivered: 'bg-black/6 text-black/55',
  pending: 'bg-amber-50 text-amber-600',
  failed: 'bg-red-50 text-red-400',
};

export default function NotificationsPage() {
  const [expanded, setExpanded] = useState<string | null>(null);

  const delivered = NOTIFICATIONS.filter(
    (n) => n.status === 'delivered'
  ).length;
  const pending = NOTIFICATIONS.filter((n) => n.status === 'pending').length;
  const failed = NOTIFICATIONS.filter((n) => n.status === 'failed').length;
  const totalRecipients = NOTIFICATIONS.reduce(
    (sum, n) => sum + n.recipients,
    0
  );

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--color-text)]">
          Notifications
        </h1>
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
          <div
            key={label}
            className="rounded-xl border border-black/8 bg-white px-5 py-4"
          >
            <p className="text-xs text-black/35">{label}</p>
            <p className="mt-1 text-2xl font-bold text-[var(--color-text)]">
              {value}
            </p>
          </div>
        ))}
      </div>

      {pending > 0 && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-amber-100 bg-amber-50/50 px-4 py-3">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
          <p className="text-sm text-amber-700">
            {pending} notification{pending !== 1 ? 's' : ''} currently sending.
          </p>
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-black/8">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-black/8 bg-[oklch(98%_0_0)]">
              <th className="px-5 py-3 text-left font-medium text-black/35">
                Entry
              </th>
              <th className="hidden px-5 py-3 text-left font-medium text-black/35 sm:table-cell">
                Project
              </th>
              <th className="px-5 py-3 text-left font-medium text-black/35">
                Recipients
              </th>
              <th className="hidden px-5 py-3 text-left font-medium text-black/35 md:table-cell">
                Sent
              </th>
              <th className="px-5 py-3 text-left font-medium text-black/35">
                Status
              </th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5 bg-white">
            {NOTIFICATIONS.map((notif) => (
              <Fragment key={notif.id}>
                <tr
                  className="cursor-pointer transition-colors hover:bg-black/[0.02]"
                  onClick={() =>
                    setExpanded((prev) => (prev === notif.id ? null : notif.id))
                  }
                >
                  <td className="px-5 py-3.5">
                    <div>
                      <p className="max-w-xs truncate font-medium text-black/75">
                        {notif.entryTitle}
                      </p>
                      <p className="font-mono text-xs text-black/30">
                        {notif.version}
                      </p>
                    </div>
                  </td>
                  <td className="hidden px-5 py-3.5 text-black/40 sm:table-cell">
                    {notif.project}
                  </td>
                  <td className="px-5 py-3.5 tabular-nums text-black/55">
                    {notif.recipients}
                  </td>
                  <td className="hidden px-5 py-3.5 text-black/35 md:table-cell">
                    {notif.sentDate}
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[notif.status]}`}
                    >
                      {notif.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <ChevronDown
                      size={14}
                      className={`text-black/25 transition-transform duration-150 ${expanded === notif.id ? 'rotate-180' : ''}`}
                    />
                  </td>
                </tr>
                {expanded === notif.id && (
                  <tr className="bg-[oklch(98.5%_0_0)]">
                    <td colSpan={6} className="px-5 py-4">
                      {notif.status === 'delivered' && (
                        <div className="flex items-center gap-8">
                          <div>
                            <p className="text-xs text-black/35">Open rate</p>
                            <p className="mt-0.5 text-lg font-bold text-black/75">
                              {notif.openRate}%
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-black/35">Click rate</p>
                            <p className="mt-0.5 text-lg font-bold text-black/75">
                              {notif.clickRate}%
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-black/35">
                              Delivered to
                            </p>
                            <p className="mt-0.5 text-lg font-bold text-black/75">
                              {notif.recipients} subscribers
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-black/35">Sent on</p>
                            <p className="mt-0.5 text-sm font-medium text-black/55">
                              {notif.sentDate}
                            </p>
                          </div>
                        </div>
                      )}
                      {notif.status === 'pending' && (
                        <p className="text-sm text-amber-600">
                          Sending in progress — {notif.recipients} recipients
                          queued.
                        </p>
                      )}
                      {notif.status === 'failed' && (
                        <div className="flex items-start gap-2">
                          <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-400" />
                          <p className="text-sm text-red-500">
                            {notif.failReason}
                          </p>
                        </div>
                      )}
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

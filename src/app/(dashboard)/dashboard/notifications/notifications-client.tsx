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

const STATUS_STYLES: Record<NotificationRecord['status'], string> = {
  delivered: 'bg-black/6 text-black/55',
  pending: 'bg-amber-50 text-amber-600',
  failed: 'bg-red-50 text-red-400',
};

export function NotificationsTable({
  notifications,
  pending,
}: {
  notifications: NotificationRecord[];
  pending: number;
}) {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <>
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
              <th className="px-5 py-3 text-left font-medium text-black/35">Entry</th>
              <th className="hidden px-5 py-3 text-left font-medium text-black/35 sm:table-cell">Project</th>
              <th className="px-5 py-3 text-left font-medium text-black/35">Recipients</th>
              <th className="hidden px-5 py-3 text-left font-medium text-black/35 md:table-cell">Sent</th>
              <th className="px-5 py-3 text-left font-medium text-black/35">Status</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5 bg-white">
            {notifications.map((notif) => (
              <Fragment key={notif.id}>
                <tr
                  className="cursor-pointer transition-colors hover:bg-black/[0.02]"
                  onClick={() =>
                    setExpanded((prev) => (prev === notif.id ? null : notif.id))
                  }
                >
                  <td className="px-5 py-3.5">
                    <div>
                      <p className="max-w-xs truncate font-medium text-black/75">{notif.entryTitle}</p>
                      <p className="font-mono text-xs text-black/30">{notif.version}</p>
                    </div>
                  </td>
                  <td className="hidden px-5 py-3.5 text-black/40 sm:table-cell">{notif.project}</td>
                  <td className="px-5 py-3.5 tabular-nums text-black/55">{notif.recipients}</td>
                  <td className="hidden px-5 py-3.5 text-black/35 md:table-cell">{notif.sentDate}</td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[notif.status]}`}>
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
                        <div className="flex flex-wrap items-center gap-4">
                          <div>
                            <p className="text-xs text-black/35">Open rate</p>
                            <p className="mt-0.5 text-lg font-bold text-black/75">{notif.openRate}%</p>
                          </div>
                          <div>
                            <p className="text-xs text-black/35">Click rate</p>
                            <p className="mt-0.5 text-lg font-bold text-black/75">{notif.clickRate}%</p>
                          </div>
                          <div>
                            <p className="text-xs text-black/35">Delivered to</p>
                            <p className="mt-0.5 text-lg font-bold text-black/75">{notif.recipients} subscribers</p>
                          </div>
                          <div>
                            <p className="text-xs text-black/35">Sent on</p>
                            <p className="mt-0.5 text-sm font-medium text-black/55">{notif.sentDate}</p>
                          </div>
                        </div>
                      )}
                      {notif.status === 'pending' && (
                        <p className="text-sm text-amber-600">
                          Sending in progress — {notif.recipients} recipients queued.
                        </p>
                      )}
                      {notif.status === 'failed' && (
                        <div className="flex items-start gap-2">
                          <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-400" />
                          <p className="text-sm text-red-500">{notif.failReason}</p>
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
    </>
  );
}

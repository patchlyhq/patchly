'use client';
import { Download, Search, UserMinus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import type { SubscriberWithProject } from '@/lib/queries';

const SOURCE_LABELS: Record<string, string> = {
  widget: 'Widget',
  'public page': 'Public page',
  import: 'Import',
  api: 'API',
};

export function SubscribersClient({
  initialSubscribers,
  stats,
}: {
  initialSubscribers: SubscriberWithProject[];
  stats: { total: number; active: number; thisMonth: number };
}) {
  const [search, setSearch] = useState('');
  const router = useRouter();

  const filtered = initialSubscribers.filter(
    (s) =>
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      s.projectName.toLowerCase().includes(search.toLowerCase())
  );

  const handleUnsubscribe = async (id: string, email: string) => {
    try {
      const res = await fetch(`/api/subscribers/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed');
      toast(`${email} unsubscribed`);
      router.refresh();
    } catch {
      toast.error('Failed to unsubscribe.');
    }
  };

  const handleExport = () => {
    toast.success('Export started', { description: 'CSV will be ready in a moment.' });
  };

  return (
    <>
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text)]">Subscribers</h1>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            People subscribed to your changelogs.
          </p>
        </div>
        <button
          type="button"
          onClick={handleExport}
          className="flex items-center gap-2 rounded-lg border border-black/10 px-3.5 py-2 text-sm text-black/55 transition-colors hover:bg-black/4 hover:text-black/75"
        >
          <Download size={13} />
          Export CSV
        </button>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {[
          { label: 'Total subscribers', value: stats.total },
          { label: 'Active', value: stats.active },
          { label: 'Joined this month', value: stats.thisMonth },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-xl border border-black/8 bg-white px-5 py-4">
            <p className="text-xs text-black/35">{label}</p>
            <p className="mt-1 text-2xl font-bold text-[var(--color-text)]">{value}</p>
          </div>
        ))}
      </div>

      <div className="mb-3 flex items-center gap-3">
        <div className="relative flex-1">
          <Search size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-black/25" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by email or project…"
            className="w-full rounded-lg border border-black/10 bg-white py-2 pl-9 pr-4 text-sm text-black/80 placeholder:text-black/25 outline-none focus:border-black/25 transition-colors"
          />
        </div>
        <span className="text-xs text-black/30">
          {filtered.length} result{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="overflow-x-auto rounded-xl border border-black/8">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-black/8 bg-[oklch(98%_0_0)]">
              <th className="px-5 py-3 text-left font-medium text-black/35">Email</th>
              <th className="hidden px-5 py-3 text-left font-medium text-black/35 sm:table-cell">Project</th>
              <th className="hidden px-5 py-3 text-left font-medium text-black/35 md:table-cell">Source</th>
              <th className="hidden px-5 py-3 text-left font-medium text-black/35 lg:table-cell">Joined</th>
              <th className="px-5 py-3 text-left font-medium text-black/35">Status</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5 bg-white">
            {filtered.map((sub) => {
              const isActive = !sub.unsubscribedAt;
              const joinedDate = new Date(sub.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });
              return (
                <tr key={sub.id} className="group transition-colors hover:bg-black/[0.02]">
                  <td className="px-5 py-3.5 font-medium text-black/75">{sub.email}</td>
                  <td className="hidden px-5 py-3.5 text-black/40 sm:table-cell">{sub.projectName}</td>
                  <td className="hidden px-5 py-3.5 md:table-cell">
                    <span className="rounded border border-black/8 px-2 py-0.5 text-xs text-black/40">
                      {SOURCE_LABELS[sub.source] ?? sub.source}
                    </span>
                  </td>
                  <td className="hidden px-5 py-3.5 text-black/35 lg:table-cell">{joinedDate}</td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                        isActive ? 'bg-black/6 text-black/55' : 'bg-black/4 text-black/30'
                      }`}
                    >
                      {isActive ? 'active' : 'unsubscribed'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    {isActive && (
                      <div className="flex justify-end opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
                        <button
                          type="button"
                          onClick={() => handleUnsubscribe(sub.id, sub.email)}
                          className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs text-black/30 transition-colors hover:bg-black/5 hover:text-black/55"
                        >
                          <UserMinus size={11} />
                          Unsubscribe
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center text-sm text-black/30">
                  No subscribers match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

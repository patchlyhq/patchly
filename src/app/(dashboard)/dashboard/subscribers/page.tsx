'use client';
import { Download, Search, UserMinus } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface Subscriber {
  id: string;
  email: string;
  joinedDate: string;
  source: 'widget' | 'public page' | 'import' | 'api';
  status: 'active' | 'unsubscribed';
  project: string;
}

const INITIAL_SUBSCRIBERS: Subscriber[] = [
  {
    id: '1',
    email: 'sarah.chen@linear.app',
    joinedDate: 'Jun 18, 2026',
    source: 'widget',
    status: 'active',
    project: 'Acme App',
  },
  {
    id: '2',
    email: 'marcus@vercel.com',
    joinedDate: 'Jun 15, 2026',
    source: 'public page',
    status: 'active',
    project: 'Acme App',
  },
  {
    id: '3',
    email: 'priya.k@stripe.com',
    joinedDate: 'Jun 12, 2026',
    source: 'widget',
    status: 'active',
    project: 'Dev Tools',
  },
  {
    id: '4',
    email: 'tobias.m@notion.so',
    joinedDate: 'Jun 10, 2026',
    source: 'api',
    status: 'active',
    project: 'Acme App',
  },
  {
    id: '5',
    email: 'ali.hassan@figma.com',
    joinedDate: 'Jun 8, 2026',
    source: 'public page',
    status: 'active',
    project: 'Acme App',
  },
  {
    id: '6',
    email: 'nina.petrov@planetscale.com',
    joinedDate: 'Jun 5, 2026',
    source: 'widget',
    status: 'active',
    project: 'Dev Tools',
  },
  {
    id: '7',
    email: 'james.okoye@railway.app',
    joinedDate: 'Jun 3, 2026',
    source: 'import',
    status: 'active',
    project: 'Acme App',
  },
  {
    id: '8',
    email: 'yuki.tanaka@supabase.io',
    joinedDate: 'May 28, 2026',
    source: 'widget',
    status: 'active',
    project: 'Dev Tools',
  },
  {
    id: '9',
    email: 'elena.v@turso.tech',
    joinedDate: 'May 22, 2026',
    source: 'public page',
    status: 'active',
    project: 'Acme App',
  },
  {
    id: '10',
    email: 'daniel.wu@resend.com',
    joinedDate: 'May 18, 2026',
    source: 'api',
    status: 'active',
    project: 'Acme App',
  },
  {
    id: '11',
    email: 'fatima.al@neon.tech',
    joinedDate: 'May 12, 2026',
    source: 'widget',
    status: 'unsubscribed',
    project: 'Dev Tools',
  },
  {
    id: '12',
    email: 'lucas.b@upstash.com',
    joinedDate: 'May 5, 2026',
    source: 'import',
    status: 'unsubscribed',
    project: 'Acme App',
  },
  {
    id: '13',
    email: 'amara.diallo@clerk.com',
    joinedDate: 'Apr 29, 2026',
    source: 'public page',
    status: 'active',
    project: 'Acme App',
  },
  {
    id: '14',
    email: 'soren.n@fly.io',
    joinedDate: 'Apr 20, 2026',
    source: 'widget',
    status: 'active',
    project: 'Dev Tools',
  },
];

const SOURCE_LABELS: Record<Subscriber['source'], string> = {
  widget: 'Widget',
  'public page': 'Public page',
  import: 'Import',
  api: 'API',
};

export default function SubscribersPage() {
  const [subscribers, setSubscribers] =
    useState<Subscriber[]>(INITIAL_SUBSCRIBERS);
  const [search, setSearch] = useState('');

  const filtered = subscribers.filter(
    (s) =>
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      s.project.toLowerCase().includes(search.toLowerCase())
  );

  const active = subscribers.filter((s) => s.status === 'active').length;
  const thisMonth = subscribers.filter((s) =>
    s.joinedDate.startsWith('Jun')
  ).length;

  const handleUnsubscribe = (id: string, email: string) => {
    const prev = subscribers;
    setSubscribers((s) =>
      s.map((x) => (x.id === id ? { ...x, status: 'unsubscribed' } : x))
    );
    toast(`${email} unsubscribed`, {
      action: { label: 'Undo', onClick: () => setSubscribers(prev) },
    });
  };

  const handleExport = () => {
    toast.success('Export started', {
      description: 'CSV will be ready in a moment.',
    });
  };

  return (
    <div className="max-w-4xl">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text)]">
            Subscribers
          </h1>
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

      <div className="mb-6 grid grid-cols-3 gap-3">
        {[
          { label: 'Total subscribers', value: subscribers.length },
          { label: 'Active', value: active },
          { label: 'Joined this month', value: thisMonth },
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

      <div className="mb-3 flex items-center gap-3">
        <div className="relative flex-1">
          <Search
            size={13}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-black/25"
          />
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

      <div className="overflow-hidden rounded-xl border border-black/8">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-black/8 bg-[oklch(98%_0_0)]">
              <th className="px-5 py-3 text-left font-medium text-black/35">
                Email
              </th>
              <th className="hidden px-5 py-3 text-left font-medium text-black/35 sm:table-cell">
                Project
              </th>
              <th className="hidden px-5 py-3 text-left font-medium text-black/35 md:table-cell">
                Source
              </th>
              <th className="hidden px-5 py-3 text-left font-medium text-black/35 lg:table-cell">
                Joined
              </th>
              <th className="px-5 py-3 text-left font-medium text-black/35">
                Status
              </th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5 bg-white">
            {filtered.map((sub) => (
              <tr
                key={sub.id}
                className="group transition-colors hover:bg-black/[0.02]"
              >
                <td className="px-5 py-3.5 font-medium text-black/75">
                  {sub.email}
                </td>
                <td className="hidden px-5 py-3.5 text-black/40 sm:table-cell">
                  {sub.project}
                </td>
                <td className="hidden px-5 py-3.5 md:table-cell">
                  <span className="rounded border border-black/8 px-2 py-0.5 text-xs text-black/40">
                    {SOURCE_LABELS[sub.source]}
                  </span>
                </td>
                <td className="hidden px-5 py-3.5 text-black/35 lg:table-cell">
                  {sub.joinedDate}
                </td>
                <td className="px-5 py-3.5">
                  <span
                    className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                      sub.status === 'active'
                        ? 'bg-black/6 text-black/55'
                        : 'bg-black/4 text-black/30'
                    }`}
                  >
                    {sub.status}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  {sub.status === 'active' && (
                    <div className="flex justify-end opacity-0 transition-opacity group-hover:opacity-100">
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
            ))}
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-5 py-12 text-center text-sm text-black/30"
                >
                  No subscribers match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

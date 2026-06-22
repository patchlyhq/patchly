import { getCurrentUser, getAnalyticsStats } from '@/lib/queries';
import { redirect } from 'next/navigation';
import { ViewsChartWrapper } from './chart-wrapper';
import { StatsClient } from './stats-client';

const TOP_ENTRIES = [
  { title: 'Embeddable widget is live', version: 'v2.2.0', views: 892, project: 'Acme App' },
  { title: 'Faster search and new keyboard shortcuts', version: 'v2.4.0', views: 654, project: 'Acme App' },
  { title: 'Markdown support in release notes', version: 'v2.3.0', views: 501, project: 'Acme App' },
  { title: 'Bug fixes and stability improvements', version: 'v2.2.1', views: 380, project: 'Acme App' },
  { title: 'CLI tool beta release', version: 'v1.0.0', views: 247, project: 'Dev Tools' },
];

export default async function AnalyticsPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const { totalViews, daily } = await getAnalyticsStats(user.id);

  return (
    <div className="max-w-4xl">
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-[var(--color-text)]">Analytics</h1>
        <p className="mt-1 text-sm text-[var(--color-muted)]">
          Last 30 days across all projects.
        </p>
      </div>

      <StatsClient totalViews={totalViews} />

      <ViewsChartWrapper daily={daily} />

      {/* Top entries */}
      <div className="overflow-x-auto rounded-xl border border-black/8">
        <div className="border-b border-black/8 bg-[oklch(98%_0_0)] px-5 py-3.5">
          <h2 className="text-sm font-semibold text-[var(--color-text)]">Top entries</h2>
        </div>
        <table className="w-full bg-white text-sm">
          <thead>
            <tr className="border-b border-black/5">
              <th className="px-5 py-3 text-left font-medium text-black/30">Entry</th>
              <th className="hidden px-5 py-3 text-left font-medium text-black/30 sm:table-cell">Project</th>
              <th className="px-5 py-3 text-right font-medium text-black/30">Views</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {TOP_ENTRIES.map((entry, i) => (
              <tr key={entry.title} className="transition-colors hover:bg-black/[0.015]">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <span className="w-4 text-right text-xs tabular-nums text-black/20">{i + 1}</span>
                    <div>
                      <p className="max-w-xs truncate font-medium text-black/75">{entry.title}</p>
                      <p className="font-mono text-xs text-black/30">{entry.version}</p>
                    </div>
                  </div>
                </td>
                <td className="hidden px-5 py-3.5 text-black/40 sm:table-cell">{entry.project}</td>
                <td className="px-5 py-3.5 text-right font-medium tabular-nums text-black/60">
                  {entry.views.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

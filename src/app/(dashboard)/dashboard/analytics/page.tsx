'use client';
import NumberFlow from '@number-flow/react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { BarChart2, Eye, TrendingUp, Users } from 'lucide-react';
import { useInView } from 'motion/react';
import { useRef } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const STATS = [
  {
    label: 'Total page views',
    value: 3241,
    display: '+12% this month',
    icon: Eye,
  },
  { label: 'Subscribers', value: 148, display: '+8 this week', icon: Users },
  {
    label: 'Entries published',
    value: 23,
    display: '4 this month',
    icon: BarChart2,
  },
  {
    label: 'Avg. views / entry',
    value: 141,
    display: 'Up from 118',
    icon: TrendingUp,
  },
];

const VIEWS_DATA = [
  { day: 'Jun 1', views: 42 },
  { day: 'Jun 2', views: 38 },
  { day: 'Jun 3', views: 61 },
  { day: 'Jun 4', views: 55 },
  { day: 'Jun 5', views: 89 },
  { day: 'Jun 6', views: 74 },
  { day: 'Jun 7', views: 33 },
  { day: 'Jun 8', views: 47 },
  { day: 'Jun 9', views: 92 },
  { day: 'Jun 10', views: 105 },
  { day: 'Jun 11', views: 118 },
  { day: 'Jun 12', views: 97 },
  { day: 'Jun 13', views: 84 },
  { day: 'Jun 14', views: 71 },
  { day: 'Jun 15', views: 130 },
  { day: 'Jun 16', views: 142 },
  { day: 'Jun 17', views: 156 },
  { day: 'Jun 18', views: 143 },
  { day: 'Jun 19', views: 121 },
  { day: 'Jun 20', views: 108 },
  { day: 'Jun 21', views: 94 },
  { day: 'Jun 22', views: 87 },
  { day: 'Jun 23', views: 112 },
  { day: 'Jun 24', views: 128 },
  { day: 'Jun 25', views: 149 },
  { day: 'Jun 26', views: 162 },
  { day: 'Jun 27', views: 138 },
  { day: 'Jun 28', views: 175 },
  { day: 'Jun 29', views: 193 },
  { day: 'Jun 30', views: 210 },
];

const TOP_ENTRIES = [
  {
    title: 'Embeddable widget is live',
    version: 'v2.2.0',
    views: 892,
    project: 'Acme App',
  },
  {
    title: 'Faster search and new keyboard shortcuts',
    version: 'v2.4.0',
    views: 654,
    project: 'Acme App',
  },
  {
    title: 'Markdown support in release notes',
    version: 'v2.3.0',
    views: 501,
    project: 'Acme App',
  },
  {
    title: 'Bug fixes and stability improvements',
    version: 'v2.2.1',
    views: 380,
    project: 'Acme App',
  },
  {
    title: 'CLI tool beta release',
    version: 'v1.0.0',
    views: 247,
    project: 'Dev Tools',
  },
];

const ACTIVE_DAYS = new Set([
  3, 7, 12, 18, 22, 27, 31, 35, 40, 44, 49, 55, 60, 66, 72,
]);
const DOUBLE_DAYS = new Set([25, 52, 78]);
const HEATMAP = Array.from({ length: 91 }, (_, i) => ({
  index: i,
  value: DOUBLE_DAYS.has(i) ? 2 : ACTIVE_DAYS.has(i) ? 1 : 0,
}));

const MONTH_LABELS = ['Mar', 'Apr', 'May', 'Jun'];
const DAY_LABELS = ['', 'M', '', 'W', '', 'F', ''];

function ViewsTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: { day: string; views: number } }>;
}) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="rounded-lg border border-black/10 bg-white px-3 py-2 shadow-sm">
      <p className="text-xs text-black/45">{d.day}</p>
      <p className="text-sm font-semibold text-black/80">{d.views} views</p>
    </div>
  );
}

function StatCard({
  label,
  value,
  display,
  icon: Icon,
}: {
  label: string;
  value: number;
  display: string;
  icon: React.ElementType;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  return (
    <div ref={ref} className="rounded-xl border border-black/8 bg-white p-5">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs text-black/35">{label}</p>
        <Icon size={13} className="text-black/20" />
      </div>
      <p className="text-2xl font-bold text-[var(--color-text)]">
        <NumberFlow value={inView ? value : 0} />
      </p>
      <p className="mt-1 text-xs text-black/30">{display}</p>
    </div>
  );
}

function HeatCell({ value, index }: { value: number; index: number }) {
  const label =
    value > 0
      ? `${value} ${value === 1 ? 'entry' : 'entries'} published`
      : 'No entries';
  return (
    <TooltipPrimitive.Root>
      <TooltipPrimitive.Trigger asChild>
        <div
          className={`h-3 w-3 cursor-default rounded-sm transition-opacity hover:opacity-70 ${
            value === 2
              ? 'bg-black/50'
              : value === 1
                ? 'bg-black/20'
                : 'bg-black/5'
          }`}
          aria-label={`Day ${index}: ${label}`}
        />
      </TooltipPrimitive.Trigger>
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content
          className="rounded-lg border border-black/10 bg-white px-2.5 py-1.5 text-xs text-black/60 shadow-sm"
          sideOffset={4}
        >
          {label}
          <TooltipPrimitive.Arrow className="fill-white" />
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  );
}

export default function AnalyticsPage() {
  return (
    <TooltipPrimitive.Provider delayDuration={120}>
      <div className="max-w-4xl">
        <div className="mb-10">
          <h1 className="text-2xl font-bold text-[var(--color-text)]">
            Analytics
          </h1>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            Last 30 days across all projects.
          </p>
        </div>

        {/* Stats */}
        <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          {STATS.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>

        {/* Area chart */}
        <div className="mb-6 rounded-xl border border-black/8 bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-[var(--color-text)]">
              Page views
            </h2>
            <span className="rounded-full bg-black/5 px-2.5 py-0.5 text-xs text-black/40">
              Last 30 days
            </span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart
              data={VIEWS_DATA}
              margin={{ top: 4, right: 4, bottom: 0, left: 0 }}
            >
              <defs>
                <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgba(0,0,0,0.12)" />
                  <stop offset="100%" stopColor="rgba(0,0,0,0)" />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(0,0,0,0.06)"
                vertical={false}
              />
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={(props) => {
                  const { x, y, payload, index } = props as {
                    x: number;
                    y: number;
                    payload: { value: string };
                    index: number;
                  };
                  return index % 5 === 0 ? (
                    <text
                      x={x}
                      y={y + 12}
                      textAnchor="middle"
                      fontSize={11}
                      fill="rgba(0,0,0,0.3)"
                    >
                      {payload.value}
                    </text>
                  ) : (
                    <g />
                  );
                }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: 'rgba(0,0,0,0.3)' }}
                width={28}
              />
              <Tooltip
                content={<ViewsTooltip />}
                cursor={{ stroke: 'rgba(0,0,0,0.08)', strokeWidth: 1 }}
              />
              <Area
                type="monotone"
                dataKey="views"
                stroke="#000"
                strokeWidth={1.5}
                fill="url(#viewsGradient)"
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Contribution heatmap */}
        <div className="mb-6 rounded-xl border border-black/8 bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-[var(--color-text)]">
              Publishing activity
            </h2>
            <span className="text-xs text-black/30">2026</span>
          </div>
          <div className="flex gap-2">
            <div className="flex flex-col gap-1 pt-5">
              {DAY_LABELS.map((label, i) => (
                <div key={i} className="flex h-3 items-center">
                  <span className="w-3 text-[10px] text-black/25">{label}</span>
                </div>
              ))}
            </div>
            <div className="flex-1 overflow-x-auto">
              <div className="mb-1 flex gap-1">
                {Array.from({ length: 13 }, (_, w) => (
                  <div key={w} className="w-3 shrink-0">
                    {w % 3 === 0 && w / 3 < MONTH_LABELS.length && (
                      <span className="text-[10px] text-black/25">
                        {MONTH_LABELS[Math.floor(w / 3)]}
                      </span>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex gap-1">
                {Array.from({ length: 13 }, (_, week) => (
                  <div key={week} className="flex flex-col gap-1">
                    {Array.from({ length: 7 }, (_, day) => {
                      const idx = week * 7 + day;
                      const cell = HEATMAP[idx];
                      return (
                        <HeatCell key={day} value={cell.value} index={idx} />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col justify-end gap-1 pb-0.5">
              {[
                { level: 0, cls: 'bg-black/5' },
                { level: 1, cls: 'bg-black/20' },
                { level: 2, cls: 'bg-black/50' },
              ].map(({ level, cls }) => (
                <div key={level} className="flex items-center gap-1">
                  <div className={`h-3 w-3 rounded-sm ${cls}`} />
                  <span className="text-[10px] text-black/25">
                    {level === 2 ? '2+' : level}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top entries */}
        <div className="overflow-hidden rounded-xl border border-black/8">
          <div className="border-b border-black/8 bg-[oklch(98%_0_0)] px-5 py-3.5">
            <h2 className="text-sm font-semibold text-[var(--color-text)]">
              Top entries
            </h2>
          </div>
          <table className="w-full bg-white text-sm">
            <thead>
              <tr className="border-b border-black/5">
                <th className="px-5 py-3 text-left font-medium text-black/30">
                  Entry
                </th>
                <th className="hidden px-5 py-3 text-left font-medium text-black/30 sm:table-cell">
                  Project
                </th>
                <th className="px-5 py-3 text-right font-medium text-black/30">
                  Views
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {TOP_ENTRIES.map((entry, i) => (
                <tr
                  key={entry.title}
                  className="transition-colors hover:bg-black/[0.015]"
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <span className="w-4 text-right text-xs tabular-nums text-black/20">
                        {i + 1}
                      </span>
                      <div>
                        <p className="max-w-xs truncate font-medium text-black/75">
                          {entry.title}
                        </p>
                        <p className="font-mono text-xs text-black/30">
                          {entry.version}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="hidden px-5 py-3.5 text-black/40 sm:table-cell">
                    {entry.project}
                  </td>
                  <td className="px-5 py-3.5 text-right font-medium tabular-nums text-black/60">
                    {entry.views.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </TooltipPrimitive.Provider>
  );
}

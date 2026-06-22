'use client';
import NumberFlow from '@number-flow/react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { BarChart2, Eye, TrendingUp, Users } from 'lucide-react';
import { useInView } from 'motion/react';
import { useRef } from 'react';


const ACTIVE_DAYS = new Set([3, 7, 12, 18, 22, 27, 31, 35, 40, 44, 49, 55, 60, 66, 72]);
const DOUBLE_DAYS = new Set([25, 52, 78]);
const HEATMAP = Array.from({ length: 91 }, (_, i) => ({
  index: i,
  value: DOUBLE_DAYS.has(i) ? 2 : ACTIVE_DAYS.has(i) ? 1 : 0,
}));

const MONTH_LABELS = ['Mar', 'Apr', 'May', 'Jun'];
const DAY_LABELS = ['', 'M', '', 'W', '', 'F', ''];

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

export function StatsClient({ totalViews }: { totalViews: number }) {
  const stats = [
    { label: 'Total page views', value: totalViews, display: 'All time', icon: Eye },
    { label: 'Subscribers', value: 0, display: 'Coming soon', icon: Users },
    { label: 'Entries published', value: 0, display: 'Coming soon', icon: BarChart2 },
    { label: 'Avg. views / entry', value: 0, display: 'Coming soon', icon: TrendingUp },
  ];

  return (
    <TooltipPrimitive.Provider delayDuration={120}>
      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
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
    </TooltipPrimitive.Provider>
  );
}

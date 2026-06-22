'use client';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

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

export function ViewsChart() {
  return (
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
  );
}

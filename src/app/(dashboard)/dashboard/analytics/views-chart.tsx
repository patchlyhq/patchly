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

export function ViewsChart({ daily }: { daily: { date: string; count: number }[] }) {
  const data = daily.map((d) => ({
    day: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    views: d.count,
  }));

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
      {data.length === 0 ? (
        <div className="flex h-[220px] items-center justify-center">
          <p className="text-sm text-black/25">No views yet</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart
            data={data}
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
      )}
    </div>
  );
}

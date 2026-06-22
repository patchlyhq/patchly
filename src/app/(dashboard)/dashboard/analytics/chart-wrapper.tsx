'use client';
import dynamic from 'next/dynamic';

const ViewsChartDynamic = dynamic(
  () => import('./views-chart').then((m) => m.ViewsChart),
  { ssr: false }
);

export function ViewsChartWrapper({ daily }: { daily: { date: string; count: number }[] }) {
  return <ViewsChartDynamic daily={daily} />;
}

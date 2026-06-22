'use client';
import dynamic from 'next/dynamic';

export const ViewsChartWrapper = dynamic(
  () => import('./views-chart').then((m) => m.ViewsChart),
  { ssr: false }
);

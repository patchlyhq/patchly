'use client';
import Marquee from 'react-fast-marquee';
import type { ReactNode } from 'react';

interface LogoItem {
  label: string;
  svg: ReactNode;
}

interface MarqueeStripProps {
  logos: LogoItem[];
}

export function MarqueeStrip({ logos }: MarqueeStripProps) {
  return (
    <Marquee
      speed={28}
      pauseOnHover
      gradient
      gradientColor="oklch(98.5% 0 0)"
      gradientWidth={80}
      className="grayscale"
    >
      {[...logos, ...logos].map(({ label, svg }, i) => (
        <div
          key={`${label}-${i}`}
          className="mx-6 opacity-30 hover:opacity-75 transition-opacity sm:mx-10"
        >
          {svg}
        </div>
      ))}
    </Marquee>
  );
}

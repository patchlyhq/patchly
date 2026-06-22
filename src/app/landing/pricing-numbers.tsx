'use client';
import NumberFlow from '@number-flow/react';
import { useInView } from 'motion/react';
import { useRef } from 'react';

export function PricingNumber({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  return (
    <span ref={ref}>
      <NumberFlow value={inView ? value : 0} format={{ style: 'decimal' }} />
    </span>
  );
}

export function TrustStat({
  value,
  suffix,
  label,
}: {
  value: number;
  suffix: string;
  label: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  return (
    <div ref={ref} className="text-center">
      <p className="flex items-baseline justify-center gap-0.5 text-4xl font-black tracking-tight text-black sm:text-5xl">
        <NumberFlow value={inView ? value : 0} />
        <span className="text-2xl text-black/65">{suffix}</span>
      </p>
      <p className="mt-2 text-xs font-medium uppercase tracking-widest text-black/30">
        {label}
      </p>
    </div>
  );
}

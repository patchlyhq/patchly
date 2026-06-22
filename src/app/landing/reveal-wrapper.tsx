'use client';
import { Reveal } from '@/components/motion/reveal';
import type { ReactNode } from 'react';

interface RevealWrapperProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export function RevealWrapper({ children, delay, className }: RevealWrapperProps) {
  return (
    <Reveal delay={delay} className={className}>
      {children}
    </Reveal>
  );
}

'use client';
import { motion, useInView } from 'motion/react';
import { useRef } from 'react';

export function WidgetPreview() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '80px' });

  return (
    <div
      ref={ref}
      className="overflow-hidden rounded-2xl border border-black/10 shadow-[0_8px_40px_rgba(0,0,0,0.07)]"
    >
      {/* Browser chrome */}
      <div className="flex items-center gap-2 border-b border-black/8 bg-[oklch(97.5%_0_0)] px-4 py-2.5">
        <div className="flex gap-1.5">
          <div className="h-2 w-2 rounded-full bg-black/10" />
          <div className="h-2 w-2 rounded-full bg-black/10" />
          <div className="h-2 w-2 rounded-full bg-black/10" />
        </div>
        <div className="flex flex-1 justify-center">
          <div className="flex items-center gap-1.5 rounded-md bg-black/6 px-2.5 py-0.5">
            <div className="h-1.5 w-1.5 rounded-full bg-black/20" />
            <span className="text-[10px] text-black/35">
              myapp.com/dashboard
            </span>
          </div>
        </div>
        <div className="w-16" />
      </div>

      {/* App content */}
      <div className="relative bg-white" style={{ height: 280 }}>
        {/* Fake sidebar */}
        <div className="absolute inset-y-0 left-0 flex w-12 flex-col items-center gap-3 border-r border-black/5 bg-[oklch(98.5%_0_0)] py-4">
          <div className="h-5 w-5 rounded-md bg-black/12" />
          <div className="mt-2 h-3.5 w-3.5 rounded bg-black/6" />
          <div className="h-3.5 w-3.5 rounded bg-black/6" />
          <div className="h-3.5 w-3.5 rounded bg-black/6" />
        </div>

        {/* Fake page content */}
        <div className="ml-12 p-5 opacity-40">
          <div className="mb-4 h-3 w-28 rounded bg-black/15" />
          <div className="mb-4 grid grid-cols-3 gap-2">
            <div className="h-12 rounded-lg bg-black/7" />
            <div className="h-12 rounded-lg bg-black/7" />
            <div className="h-12 rounded-lg bg-black/7" />
          </div>
          <div className="space-y-2">
            <div className="h-2 w-full rounded bg-black/7" />
            <div className="h-2 w-5/6 rounded bg-black/5" />
            <div className="h-2 w-4/6 rounded bg-black/5" />
          </div>
        </div>

        {/* Animated widget popup */}
        <div className="absolute bottom-3 right-3">
          <motion.div
            className="mb-2 w-60 overflow-hidden rounded-xl border border-black/10 bg-white shadow-[0_8px_28px_rgba(0,0,0,0.13)]"
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{
              delay: 0.45,
              duration: 0.38,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <div className="flex items-center justify-between border-b border-black/6 px-3.5 py-2.5">
              <span className="text-xs font-semibold text-black">
                What&apos;s new
              </span>
              <span className="rounded-full bg-black px-1.5 py-0.5 text-[9px] font-bold text-white">
                3
              </span>
            </div>
            <div className="divide-y divide-black/5">
              {[
                {
                  version: 'v2.4.0',
                  title: 'Faster search + ⌘K',
                  tag: 'Performance',
                },
                { version: 'v2.3.0', title: 'Markdown support', tag: 'New' },
              ].map((e) => (
                <div key={e.version} className="px-3.5 py-2.5">
                  <div className="mb-0.5 flex items-center gap-1.5">
                    <span className="font-mono text-[9px] text-black/35">
                      {e.version}
                    </span>
                    <span className="rounded border border-black/10 px-1 py-px text-[8px] text-black/30">
                      {e.tag}
                    </span>
                  </div>
                  <p className="text-[11px] font-medium text-black/72">
                    {e.title}
                  </p>
                </div>
              ))}
            </div>
            <div className="border-t border-black/6 px-3.5 py-2">
              <span className="text-[10px] text-black/35">
                View all updates →
              </span>
            </div>
          </motion.div>

          <motion.div
            className="flex justify-end"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{
              delay: 0.25,
              duration: 0.3,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <div className="flex items-center gap-1.5 rounded-full bg-black px-3 py-1.5 shadow-lg">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
              </span>
              <span className="text-[10px] font-medium text-white">
                What&apos;s new
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

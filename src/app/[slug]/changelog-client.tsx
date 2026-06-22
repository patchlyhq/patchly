'use client';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { toast } from 'sonner';
import { TimelineAnimation } from '@/components/ui/timeline-animation';

interface Entry {
  id: string;
  version: string;
  date: string;
  title: string;
  contentHtml: string;
  tags: string[];
}

interface Project {
  name: string;
  description: string;
}

const TAG_COLORS: Record<string, string> = {
  New: 'border-black/15 text-black/55',
  Fix: 'border-black/10 text-black/35',
  Performance: 'border-black/12 text-black/45',
  UX: 'border-black/12 text-black/45',
  Editor: 'border-black/12 text-black/45',
};

export function ChangelogClient({
  project,
  entries,
}: {
  project: Project;
  entries: Entry[];
}) {
  const timelineRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = () => {
    const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!EMAIL_RE.test(email)) {
      toast.error('Enter a valid email.');
      return;
    }
    setSubscribed(true);
    toast.success('Subscribed!', {
      description: `You'll get notified at ${email}`,
    });
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* Minimal nav */}
      <nav className="border-b border-black/6 px-4 py-4 flex items-center justify-between gap-2 sm:px-6">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-1.5 text-xs text-black/35 hover:text-black/60 transition-colors"
        >
          <ArrowLeft size={12} />
          Patchly
        </Link>
        <span className="min-w-0 truncate text-center text-xs font-semibold text-black/30 tracking-tight">
          {project.name}
        </span>
        <div className="w-16 shrink-0" />
      </nav>

      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-16">
        {/* Header */}
        <div className="mb-16">
          <h1 className="text-2xl font-black tracking-tight text-[var(--color-text)] sm:text-4xl">
            {project.name}
          </h1>
          <p className="mt-3 text-[var(--color-muted)]">
            {project.description}
          </p>

          {/* Subscribe */}
          <div className="mt-6">
            {subscribed ? (
              <p className="text-sm text-black/45">
                You're subscribed. We'll notify you of new releases.
              </p>
            ) : (
              <div className="flex w-full max-w-sm gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubscribe()}
                  placeholder="your@email.com"
                  className="min-w-0 flex-1 rounded-lg border border-black/10 bg-[oklch(98%_0_0)] px-3.5 py-2 text-sm text-black/80 placeholder:text-black/25 outline-none focus:border-black/25 focus:bg-white transition"
                />
                <button
                  type="button"
                  onClick={handleSubscribe}
                  className="shrink-0 rounded-lg border border-black/12 px-4 py-2 text-sm font-medium text-black/60 hover:bg-black/5 hover:text-black/80 transition-colors whitespace-nowrap"
                >
                  Subscribe
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Timeline */}
        <div ref={timelineRef} className="relative space-y-3">
          <div className="absolute bottom-2 left-[7px] top-2 w-px bg-black/8" />

          {entries.map((entry, i) => (
            <TimelineAnimation
              key={entry.id}
              animationNum={i}
              timelineRef={timelineRef as React.RefObject<HTMLElement>}
            >
              <div className="flex gap-4 sm:gap-6">
                <div className="relative mt-5 shrink-0">
                  <div className="h-3.5 w-3.5 rounded-full border border-black/15 bg-[var(--color-bg)]" />
                </div>
                <div className="min-w-0 flex-1 rounded-xl border border-black/8 bg-[oklch(98%_0_0)] p-5">
                  <div className="mb-3 flex flex-wrap items-center gap-3">
                    <span className="font-mono text-xs text-black/40">
                      {entry.version}
                    </span>
                    <span className="text-xs text-black/25">{entry.date}</span>
                    <div className="flex gap-1.5">
                      {entry.tags.map((tag) => (
                        <span
                          key={tag}
                          className={`rounded border px-2 py-0.5 text-xs ${TAG_COLORS[tag] ?? 'border-black/10 text-black/35'}`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <h2 className="mb-2 text-base font-semibold text-black/85">
                    {entry.title}
                  </h2>
                  <div
                    className="prose text-sm text-black/50"
                    dangerouslySetInnerHTML={{ __html: entry.contentHtml }}
                  />
                </div>
              </div>
            </TimelineAnimation>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-16 border-t border-black/6 pt-8 text-center">
          <p className="text-xs text-black/25">
            Powered by{' '}
            <Link
              href="/"
              className="text-black/40 hover:text-black/60 transition-colors"
            >
              Patchly
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

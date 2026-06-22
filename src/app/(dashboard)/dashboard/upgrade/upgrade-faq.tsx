'use client';
import * as Accordion from '@radix-ui/react-accordion';
import { Plus } from 'lucide-react';

const FAQS = [
  {
    q: 'Can I cancel anytime?',
    a: 'Yes. Cancel from your account settings at any time. You keep Pro access until the end of your billing period.',
  },
  {
    q: 'What happens to my changelogs if I downgrade?',
    a: "They stay live and public. You just can't add new entries until you upgrade again.",
  },
  {
    q: 'Do you offer yearly billing?',
    a: "Coming soon. We'll notify you when annual plans are available.",
  },
];

export function UpgradeFAQ() {
  return (
    <div>
      <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-black/30">FAQ</h2>
      <Accordion.Root type="single" collapsible className="space-y-2">
        {FAQS.map(({ q, a }) => (
          <Accordion.Item
            key={q}
            value={q}
            className="overflow-hidden rounded-xl border border-black/8 bg-[oklch(98%_0_0)] data-[state=open]:bg-white transition-colors"
          >
            <Accordion.Trigger className="group flex w-full cursor-pointer items-center justify-between px-5 py-4 text-left text-sm font-medium text-black/75 select-none">
              {q}
              <Plus
                size={14}
                className="shrink-0 text-black/25 transition-transform duration-200 group-data-[state=open]:rotate-45"
              />
            </Accordion.Trigger>
            <Accordion.Content className="overflow-hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-up-4 data-[state=open]:slide-down-4">
              <p className="px-5 pb-4 text-sm leading-relaxed text-black/50">{a}</p>
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </div>
  );
}

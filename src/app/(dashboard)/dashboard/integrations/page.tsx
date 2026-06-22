'use client';
import { Check, Copy, Eye, EyeOff, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const REAL_KEY = 'pk_live_4xKr9mQzN8bLpVtY2cWdAjFu7eHs0nRi';
const MASKED_KEY = 'pk_live_••••••••••••••••••••••••••••••';

interface Integration {
  id: string;
  name: string;
  description: string;
  letter: string;
  status: 'connected' | 'coming_soon';
  connectedAs?: string;
}

const INTEGRATIONS: Integration[] = [
  {
    id: 'zapier',
    name: 'Zapier',
    description: 'Trigger Zaps when you publish a new changelog entry.',
    letter: 'Z',
    status: 'connected',
    connectedAs: 'patchly@zapier',
  },
  {
    id: 'resend',
    name: 'Resend',
    description: 'Send subscriber notifications via your Resend account.',
    letter: 'R',
    status: 'connected',
    connectedAs: 'info@clientreach.ai',
  },
  {
    id: 'slack',
    name: 'Slack',
    description: 'Post to a channel when you ship a new entry.',
    letter: 'S',
    status: 'coming_soon',
  },
  {
    id: 'discord',
    name: 'Discord',
    description: 'Announce releases in your Discord server automatically.',
    letter: 'D',
    status: 'coming_soon',
  },
  {
    id: 'github',
    name: 'GitHub',
    description: 'Auto-generate entries from merged PRs and releases.',
    letter: 'G',
    status: 'coming_soon',
  },
];

const EVENTS = [
  { id: 'entry_published', label: 'Entry published' },
  { id: 'new_subscriber', label: 'New subscriber' },
];

export default function IntegrationsPage() {
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState('');
  const [enabledEvents, setEnabledEvents] = useState<Set<string>>(
    new Set(['entry_published'])
  );

  const handleCopyKey = async () => {
    await navigator.clipboard.writeText(REAL_KEY);
    setCopied(true);
    toast.success('API key copied');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRegenerate = () => {
    toast('API key regenerated', {
      description: 'Your old key is now invalid.',
    });
  };

  const handleSaveWebhook = () => {
    if (!webhookUrl.trim()) {
      toast.error('Enter a webhook URL.');
      return;
    }
    toast.success('Webhook saved', { description: webhookUrl });
  };

  const toggleEvent = (id: string) => {
    setEnabledEvents((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="max-w-3xl space-y-10">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text)]">
          Integrations
        </h1>
        <p className="mt-1 text-sm text-[var(--color-muted)]">
          Connect Patchly to your existing tools.
        </p>
      </div>

      {/* API Key */}
      <section className="space-y-4">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-black/30">
          API Key
        </h2>
        <div className="rounded-xl border border-black/8 bg-white p-5">
          <p className="mb-3 text-sm text-black/55">
            Use your API key to publish entries programmatically or integrate
            with CI/CD.
          </p>
          <div className="flex items-center gap-2">
            <div className="flex flex-1 items-center gap-3 rounded-lg border border-black/8 bg-[oklch(98%_0_0)] px-4 py-2.5">
              <code className="flex-1 truncate font-mono text-xs text-black/55">
                {revealed ? REAL_KEY : MASKED_KEY}
              </code>
              <button
                type="button"
                onClick={() => setRevealed((r) => !r)}
                className="shrink-0 text-black/25 transition-colors hover:text-black/55"
              >
                {revealed ? <EyeOff size={13} /> : <Eye size={13} />}
              </button>
            </div>
            <button
              type="button"
              onClick={handleCopyKey}
              className="flex items-center gap-1.5 rounded-lg border border-black/10 px-3 py-2.5 text-xs text-black/45 transition-colors hover:bg-black/4 hover:text-black/65"
            >
              {copied ? <Check size={11} /> : <Copy size={11} />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <button
            type="button"
            onClick={handleRegenerate}
            className="mt-3 flex items-center gap-1.5 text-xs text-black/30 transition-colors hover:text-black/55"
          >
            <RefreshCw size={11} />
            Regenerate key
          </button>
        </div>
      </section>

      <div className="h-px bg-black/6" />

      {/* Webhooks */}
      <section className="space-y-4">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-black/30">
          Webhooks
        </h2>
        <div className="rounded-xl border border-black/8 bg-white p-5">
          <p className="mb-4 text-sm text-black/55">
            Patchly will POST a JSON payload to your endpoint when selected
            events occur.
          </p>
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-black/55">
                Endpoint URL
              </label>
              <div className="flex gap-2">
                <span className="flex items-center rounded-lg border border-black/8 bg-black/3 px-3 py-2.5 text-xs text-black/35">
                  POST
                </span>
                <input
                  type="url"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  placeholder="https://your-app.com/webhooks/patchly"
                  className="flex-1 rounded-lg border border-black/10 bg-[oklch(98%_0_0)] px-3.5 py-2.5 text-sm text-black/80 placeholder:text-black/25 outline-none focus:border-black/25 focus:bg-white transition-colors"
                />
              </div>
            </div>
            <div>
              <label className="mb-2 block text-xs font-medium text-black/55">
                Events
              </label>
              <div className="space-y-2">
                {EVENTS.map(({ id, label }) => (
                  <label
                    key={id}
                    className="flex cursor-pointer items-center gap-2.5"
                  >
                    <input
                      type="checkbox"
                      checked={enabledEvents.has(id)}
                      onChange={() => toggleEvent(id)}
                      className="h-3.5 w-3.5 cursor-pointer accent-black"
                    />
                    <span className="text-sm text-black/65">{label}</span>
                  </label>
                ))}
              </div>
            </div>
            <button
              type="button"
              onClick={handleSaveWebhook}
              className="rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-black/85"
            >
              Save webhook
            </button>
          </div>
        </div>
      </section>

      <div className="h-px bg-black/6" />

      {/* Integration cards */}
      <section className="space-y-4">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-black/30">
          Connected apps
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {INTEGRATIONS.map((integration) => (
            <div
              key={integration.id}
              className={`rounded-xl border p-4 transition-colors ${
                integration.status === 'connected'
                  ? 'border-black/8 bg-white'
                  : 'border-black/6 bg-[oklch(98.5%_0_0)]'
              }`}
            >
              <div className="mb-3 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-xl border text-sm font-bold ${
                      integration.status === 'connected'
                        ? 'border-black/12 bg-[oklch(96%_0_0)] text-black/60'
                        : 'border-black/8 bg-[oklch(97%_0_0)] text-black/25'
                    }`}
                  >
                    {integration.letter}
                  </div>
                  <div>
                    <p
                      className={`text-sm font-semibold ${integration.status === 'connected' ? 'text-black/80' : 'text-black/35'}`}
                    >
                      {integration.name}
                    </p>
                    {integration.status === 'connected' &&
                      integration.connectedAs && (
                        <p className="text-[10px] text-black/30">
                          {integration.connectedAs}
                        </p>
                      )}
                  </div>
                </div>
                {integration.status === 'connected' && (
                  <span className="flex items-center gap-1 text-[10px] text-black/40">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    Connected
                  </span>
                )}
              </div>
              <p
                className={`mb-3 text-xs leading-relaxed ${integration.status === 'connected' ? 'text-black/45' : 'text-black/25'}`}
              >
                {integration.description}
              </p>
              {integration.status === 'connected' ? (
                <button
                  type="button"
                  onClick={() => toast(`${integration.name} disconnected`)}
                  className="text-xs text-black/30 transition-colors hover:text-black/55"
                >
                  Disconnect
                </button>
              ) : (
                <span className="rounded border border-black/8 px-2 py-1 text-[10px] font-medium text-black/25">
                  Coming soon
                </span>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

'use client';
import {
  Check,
  ChevronDown,
  ChevronRight,
  Copy,
  Eye,
  EyeOff,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

type ProjectRow = {
  id: string;
  slug: string;
  name: string;
  githubWebhookSecret: string | null;
};

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://patchly.dawit.dev';

const COMING_SOON = [
  { id: 'zapier', name: 'Zapier', letter: 'Z', description: 'Trigger Zaps when you publish a new changelog entry.' },
  { id: 'slack',  name: 'Slack',  letter: 'S', description: 'Post to a channel when you ship a new entry.' },
  { id: 'discord', name: 'Discord', letter: 'D', description: 'Announce releases in your Discord server automatically.' },
];

export function IntegrationsClient({ projects }: { projects: ProjectRow[] }) {
  const [githubOpen, setGithubOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(projects[0]?.id ?? '');
  const [secrets, setSecrets] = useState<Record<string, string>>(() =>
    Object.fromEntries(projects.filter((p) => p.githubWebhookSecret).map((p) => [p.id, p.githubWebhookSecret!]))
  );
  const [revealed, setRevealed] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState<'url' | 'secret' | null>(null);

  const selectedProject = projects.find((p) => p.id === selectedProjectId);
  const secret = selectedProjectId ? secrets[selectedProjectId] : null;
  const webhookUrl = selectedProject
    ? `${APP_URL}/api/integrations/github/webhook?project=${selectedProject.slug}`
    : '';

  const copyText = async (text: string, kind: 'url' | 'secret') => {
    await navigator.clipboard.writeText(text);
    setCopied(kind);
    setTimeout(() => setCopied(null), 2000);
  };

  const generateSecret = async () => {
    if (!selectedProjectId) return;
    setGenerating(true);
    try {
      const res = await fetch('/api/integrations/github', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId: selectedProjectId }),
      });
      if (!res.ok) throw new Error('Failed');
      const { secret: newSecret } = await res.json() as { secret: string };
      setSecrets((prev) => ({ ...prev, [selectedProjectId]: newSecret }));
      setRevealed(true);
      toast.success('Webhook secret generated');
    } catch {
      toast.error('Failed to generate secret');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-10">
      {/* GitHub Integration */}
      <section className="space-y-4">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-black/30">GitHub</h2>
        <div className="rounded-xl border border-black/8 bg-white overflow-hidden">
          <button
            type="button"
            onClick={() => setGithubOpen((v) => !v)}
            className="flex w-full items-center justify-between p-5 text-left"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-black/12 bg-[oklch(96%_0_0)] text-sm font-bold text-black/60">
                G
              </div>
              <div>
                <p className="text-sm font-semibold text-black/80">GitHub</p>
                <p className="text-xs text-black/40">
                  Auto-create draft entries from GitHub releases
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {Object.keys(secrets).length > 0 && (
                <span className="flex items-center gap-1.5 text-[11px] text-black/40">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  {Object.keys(secrets).length} project{Object.keys(secrets).length !== 1 ? 's' : ''} connected
                </span>
              )}
              {githubOpen ? (
                <ChevronDown size={15} className="text-black/30" />
              ) : (
                <ChevronRight size={15} className="text-black/30" />
              )}
            </div>
          </button>

          {githubOpen && (
            <div className="border-t border-black/6 p-5 space-y-6">
              {projects.length === 0 ? (
                <p className="text-sm text-black/45">Create a project first to set up the GitHub integration.</p>
              ) : (
                <>
                  {/* Project selector */}
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-black/55">Project</label>
                    <select
                      value={selectedProjectId}
                      onChange={(e) => { setSelectedProjectId(e.target.value); setRevealed(false); }}
                      className="w-full rounded-lg border border-black/10 bg-[oklch(98%_0_0)] px-3.5 py-2.5 text-sm text-black/80 outline-none focus:border-black/25 focus:bg-white transition-colors"
                    >
                      {projects.map((p) => (
                        <option key={p.id} value={p.id}>{p.name} (/{p.slug})</option>
                      ))}
                    </select>
                  </div>

                  {/* Webhook URL */}
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-black/55">Webhook URL</label>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 truncate rounded-lg border border-black/8 bg-[oklch(98%_0_0)] px-3.5 py-2.5 font-mono text-xs text-black/55">
                        {webhookUrl}
                      </code>
                      <button
                        type="button"
                        onClick={() => copyText(webhookUrl, 'url')}
                        className="flex shrink-0 items-center gap-1.5 rounded-lg border border-black/10 px-3 py-2.5 text-xs text-black/45 transition-colors hover:bg-black/4 hover:text-black/65"
                      >
                        {copied === 'url' ? <Check size={11} /> : <Copy size={11} />}
                        {copied === 'url' ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                  </div>

                  {/* Webhook secret */}
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-black/55">Webhook secret</label>
                    {secret ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="flex flex-1 items-center gap-3 rounded-lg border border-black/8 bg-[oklch(98%_0_0)] px-3.5 py-2.5">
                            <code className="flex-1 truncate font-mono text-xs text-black/55">
                              {revealed ? secret : '•'.repeat(48)}
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
                            onClick={() => copyText(secret, 'secret')}
                            className="flex shrink-0 items-center gap-1.5 rounded-lg border border-black/10 px-3 py-2.5 text-xs text-black/45 transition-colors hover:bg-black/4 hover:text-black/65"
                          >
                            {copied === 'secret' ? <Check size={11} /> : <Copy size={11} />}
                            {copied === 'secret' ? 'Copied' : 'Copy'}
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={generateSecret}
                          disabled={generating}
                          className="flex items-center gap-1.5 text-xs text-black/30 transition-colors hover:text-black/55 disabled:opacity-40"
                        >
                          <RefreshCw size={11} />
                          Regenerate secret
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={generateSecret}
                        disabled={generating}
                        className="flex items-center gap-2 rounded-lg bg-black px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-black/85 disabled:opacity-40"
                      >
                        {generating && <Loader2 size={13} className="animate-spin" />}
                        Generate secret
                      </button>
                    )}
                  </div>

                  {/* Instructions */}
                  <div className="rounded-lg border border-black/6 bg-[oklch(98.5%_0_0)] p-4 space-y-3">
                    <p className="text-xs font-semibold text-black/55">Setup in GitHub</p>
                    <ol className="space-y-2 text-xs text-black/50 list-decimal list-inside">
                      <li>Go to your GitHub repo → Settings → Webhooks → Add webhook</li>
                      <li>Paste the Webhook URL above into <span className="font-mono text-black/65">Payload URL</span></li>
                      <li>Set Content type to <span className="font-mono text-black/65">application/json</span></li>
                      <li>Paste the secret above into <span className="font-mono text-black/65">Secret</span></li>
                      <li>Under events, choose <span className="font-medium text-black/65">Let me select individual events</span> → check <span className="font-medium text-black/65">Releases</span></li>
                      <li>Click <span className="font-medium text-black/65">Add webhook</span></li>
                    </ol>
                    <p className="text-xs text-black/35">
                      Every time you publish a release on GitHub, Patchly will create a draft changelog entry — ready for you to review and publish.
                    </p>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </section>

      <div className="h-px bg-black/6" />

      {/* Coming soon */}
      <section className="space-y-4">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-black/30">Coming soon</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {COMING_SOON.map((integration) => (
            <div key={integration.id} className="rounded-xl border border-black/6 bg-[oklch(98.5%_0_0)] p-4">
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-black/8 bg-[oklch(97%_0_0)] text-sm font-bold text-black/25">
                  {integration.letter}
                </div>
                <p className="text-sm font-semibold text-black/35">{integration.name}</p>
              </div>
              <p className="mb-3 text-xs leading-relaxed text-black/25">{integration.description}</p>
              <span className="rounded border border-black/8 px-2 py-1 text-[10px] font-medium text-black/25">
                Coming soon
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

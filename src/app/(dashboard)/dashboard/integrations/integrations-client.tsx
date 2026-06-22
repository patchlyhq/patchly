'use client';
import { ChevronDown, ChevronRight, GitBranch, Loader2, Unlink } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

type ProjectRow = {
  id: string;
  slug: string;
  name: string;
  githubWebhookSecret: string | null;
  githubRepoOwner: string | null;
  githubRepoName: string | null;
};

const COMING_SOON = [
  { id: 'zapier', name: 'Zapier', letter: 'Z', description: 'Trigger Zaps when you publish a new changelog entry.' },
  { id: 'slack',  name: 'Slack',  letter: 'S', description: 'Post to a channel when you ship a new entry.' },
  { id: 'discord', name: 'Discord', letter: 'D', description: 'Announce releases in your Discord server automatically.' },
];

export function IntegrationsClient({ projects: initial }: { projects: ProjectRow[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [githubOpen, setGithubOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(initial[0]?.id ?? '');
  const [repo, setRepo] = useState('');
  const [projects, setProjects] = useState(initial);
  const [disconnecting, setDisconnecting] = useState(false);

  const selectedProject = projects.find((p) => p.id === selectedProjectId);
  const isConnected = !!(selectedProject?.githubRepoOwner && selectedProject?.githubRepoName);

  // Handle OAuth return params
  useEffect(() => {
    const status = searchParams.get('github');
    if (!status) return;
    if (status === 'connected') {
      setGithubOpen(true);
      toast.success('GitHub connected — releases will create draft entries automatically.');
      router.replace('/dashboard/integrations');
      router.refresh();
    } else if (status === 'webhook_error') {
      setGithubOpen(true);
      toast.error('GitHub OAuth succeeded but webhook creation failed. Check that the repo exists and you have admin access.');
      router.replace('/dashboard/integrations');
    } else if (status === 'error') {
      setGithubOpen(true);
      toast.error('GitHub connection failed. Try again.');
      router.replace('/dashboard/integrations');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleConnect = () => {
    const trimmed = repo.trim();
    if (!trimmed || !trimmed.includes('/')) {
      toast.error('Enter a repo in owner/name format, e.g. acme/my-app');
      return;
    }
    const url = `/api/integrations/github/connect?projectId=${encodeURIComponent(selectedProjectId)}&repo=${encodeURIComponent(trimmed)}`;
    window.location.href = url;
  };

  const handleDisconnect = async () => {
    if (!selectedProjectId) return;
    setDisconnecting(true);
    try {
      const res = await fetch('/api/integrations/github/disconnect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId: selectedProjectId }),
      });
      if (!res.ok) throw new Error('Failed');
      setProjects((prev) =>
        prev.map((p) =>
          p.id === selectedProjectId
            ? { ...p, githubRepoOwner: null, githubRepoName: null, githubWebhookSecret: null }
            : p
        )
      );
      setRepo('');
      toast.success('GitHub disconnected');
      router.refresh();
    } catch {
      toast.error('Failed to disconnect');
    } finally {
      setDisconnecting(false);
    }
  };

  const connectedCount = projects.filter((p) => p.githubRepoOwner).length;

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
                <p className="text-xs text-black/40">Auto-create draft entries from GitHub releases</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {connectedCount > 0 && (
                <span className="flex items-center gap-1.5 text-[11px] text-black/40">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  {connectedCount} project{connectedCount !== 1 ? 's' : ''} connected
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
                      onChange={(e) => {
                        setSelectedProjectId(e.target.value);
                        setRepo('');
                      }}
                      className="w-full rounded-lg border border-black/10 bg-[oklch(98%_0_0)] px-3.5 py-2.5 text-sm text-black/80 outline-none focus:border-black/25 focus:bg-white transition-colors"
                    >
                      {projects.map((p) => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>

                  {isConnected ? (
                    /* Connected state */
                    <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <GitBranch size={16} className="shrink-0 text-emerald-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-semibold text-emerald-900">
                            {selectedProject?.githubRepoOwner}/{selectedProject?.githubRepoName}
                          </p>
                          <p className="text-xs text-emerald-700 mt-0.5">
                            New GitHub releases will create draft changelog entries automatically.
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleDisconnect}
                        disabled={disconnecting}
                        className="flex shrink-0 items-center gap-1.5 rounded-lg border border-black/10 px-3 py-2 text-xs text-black/45 transition-colors hover:bg-black/4 hover:text-black/65 disabled:opacity-40"
                      >
                        {disconnecting ? <Loader2 size={11} className="animate-spin" /> : <Unlink size={11} />}
                        Disconnect
                      </button>
                    </div>
                  ) : (
                    /* Connect form */
                    <div className="space-y-4">
                      <div>
                        <label className="mb-1.5 block text-xs font-medium text-black/55">GitHub repository</label>
                        <input
                          type="text"
                          placeholder="owner/repository"
                          value={repo}
                          onChange={(e) => setRepo(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleConnect()}
                          className="w-full rounded-lg border border-black/10 bg-[oklch(98%_0_0)] px-3.5 py-2.5 font-mono text-sm text-black/80 placeholder:text-black/30 outline-none focus:border-black/25 focus:bg-white transition-colors"
                        />
                        <p className="mt-1.5 text-[11px] text-black/35">e.g. <span className="font-mono">acme/my-app</span></p>
                      </div>

                      <button
                        type="button"
                        onClick={handleConnect}
                        className="flex items-center gap-2 rounded-lg bg-black px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-black/85"
                      >
                        <svg viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4">
                          <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
                        </svg>
                        Connect with GitHub
                      </button>

                      <p className="text-xs text-black/35 leading-relaxed">
                        You&apos;ll authorize Patchly to create a webhook on that repo.
                        Patchly only requests <span className="font-medium text-black/50">admin:repo_hook</span> scope — nothing else.
                      </p>
                    </div>
                  )}
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

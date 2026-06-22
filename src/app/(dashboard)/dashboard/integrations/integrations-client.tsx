'use client';
import { ChevronDown, ChevronRight, GitBranch, Loader2, RefreshCw, Unlink } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import type { ProjectIntegration } from '@/lib/queries';

type ProjectRow = {
  id: string;
  slug: string;
  name: string;
  githubWebhookSecret: string | null;
  githubRepoOwner: string | null;
  githubRepoName: string | null;
};

type IntegrationConfig = {
  webhookUrl?: string;
  channel?: string;
  teamName?: string;
  channelId?: string;
  name?: string;
};

function getProviderConfig(integrations: ProjectIntegration[], projectId: string, provider: string): IntegrationConfig | null {
  const row = integrations.find((i) => i.projectId === projectId && i.provider === provider);
  return row ? (row.config as IntegrationConfig) : null;
}

function Section({ title, open, onToggle, badge, children }: {
  title: string; open: boolean; onToggle: () => void; badge?: string; children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-black/8 bg-white overflow-hidden">
      <button type="button" onClick={onToggle} className="flex w-full items-center justify-between p-5 text-left">
        <span className="text-sm font-semibold text-black/80">{title}</span>
        <div className="flex items-center gap-3">
          {badge && (
            <span className="flex items-center gap-1.5 text-[11px] text-black/40">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              {badge}
            </span>
          )}
          {open ? <ChevronDown size={15} className="text-black/30" /> : <ChevronRight size={15} className="text-black/30" />}
        </div>
      </button>
      {open && <div className="border-t border-black/6 p-5 space-y-5">{children}</div>}
    </div>
  );
}

function ProjectSelector({ projects, value, onChange }: {
  projects: ProjectRow[]; value: string; onChange: (v: string) => void;
}) {
  if (projects.length === 0) return <p className="text-sm text-black/45">Create a project first.</p>;
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-black/55">Project</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-black/10 bg-[oklch(98%_0_0)] px-3.5 py-2.5 text-sm text-black/80 outline-none focus:border-black/25 focus:bg-white transition-colors"
      >
        {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
      </select>
    </div>
  );
}

function ConnectedBadge({ label, sublabel, onDisconnect, disconnecting, extraAction }: {
  label: string; sublabel: string; onDisconnect: () => void; disconnecting: boolean;
  extraAction?: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 flex items-start justify-between gap-3">
      <div className="flex items-center gap-3">
        <GitBranch size={16} className="shrink-0 text-emerald-600 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-emerald-900">{label}</p>
          <p className="text-xs text-emerald-700 mt-0.5">{sublabel}</p>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {extraAction}
        <button
          type="button"
          onClick={onDisconnect}
          disabled={disconnecting}
          className="flex items-center gap-1.5 rounded-lg border border-black/10 px-3 py-2 text-xs text-black/45 transition-colors hover:bg-black/4 hover:text-black/65 disabled:opacity-40"
        >
          {disconnecting ? <Loader2 size={11} className="animate-spin" /> : <Unlink size={11} />}
          Disconnect
        </button>
      </div>
    </div>
  );
}

export function IntegrationsClient({
  projects: initial,
  integrations: initialIntegrations,
}: {
  projects: ProjectRow[];
  integrations: ProjectIntegration[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [projects, setProjects] = useState(initial);
  const [integrationsList, setIntegrationsList] = useState(initialIntegrations);

  const [githubOpen, setGithubOpen] = useState(false);
  const [slackOpen, setSlackOpen] = useState(false);
  const [discordOpen, setDiscordOpen] = useState(false);
  const [zapierOpen, setZapierOpen] = useState(false);

  const [githubProjectId, setGithubProjectId] = useState(initial[0]?.id ?? '');
  const [slackProjectId, setSlackProjectId] = useState(initial[0]?.id ?? '');
  const [discordProjectId, setDiscordProjectId] = useState(initial[0]?.id ?? '');
  const [zapierProjectId, setZapierProjectId] = useState(initial[0]?.id ?? '');

  const [repo, setRepo] = useState('');
  const [zapierUrl, setZapierUrl] = useState('');

  const [disconnecting, setDisconnecting] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [savingZapier, setSavingZapier] = useState(false);

  const githubProject = projects.find((p) => p.id === githubProjectId);
  const githubConnected = !!(githubProject?.githubRepoOwner && githubProject?.githubRepoName);

  const slackConfig = getProviderConfig(integrationsList, slackProjectId, 'slack');
  const discordConfig = getProviderConfig(integrationsList, discordProjectId, 'discord');
  const zapierConfig = getProviderConfig(integrationsList, zapierProjectId, 'zapier');

  const githubConnectedCount = projects.filter((p) => p.githubRepoOwner).length;
  const slackConnectedCount = [...new Set(integrationsList.filter((i) => i.provider === 'slack').map((i) => i.projectId))].length;
  const discordConnectedCount = [...new Set(integrationsList.filter((i) => i.provider === 'discord').map((i) => i.projectId))].length;
  const zapierConnectedCount = [...new Set(integrationsList.filter((i) => i.provider === 'zapier').map((i) => i.projectId))].length;

  useEffect(() => {
    const gh = searchParams.get('github');
    const sl = searchParams.get('slack');
    const dc = searchParams.get('discord');

    if (gh === 'connected') {
      setGithubOpen(true);
      toast.success('GitHub connected — existing releases imported as drafts.');
      router.replace('/dashboard/integrations');
      router.refresh();
    } else if (gh === 'webhook_error') {
      setGithubOpen(true);
      toast.error('GitHub OAuth succeeded but webhook creation failed.');
      router.replace('/dashboard/integrations');
    } else if (gh === 'error') {
      setGithubOpen(true);
      toast.error('GitHub connection failed. Try again.');
      router.replace('/dashboard/integrations');
    }

    if (sl === 'connected') {
      setSlackOpen(true);
      toast.success('Slack connected — entries will post to your channel on publish.');
      router.replace('/dashboard/integrations');
      router.refresh();
    } else if (sl === 'error') {
      setSlackOpen(true);
      toast.error('Slack connection failed. Try again.');
      router.replace('/dashboard/integrations');
    }

    if (dc === 'connected') {
      setDiscordOpen(true);
      toast.success('Discord connected — entries will post to your channel on publish.');
      router.replace('/dashboard/integrations');
      router.refresh();
    } else if (dc === 'error') {
      setDiscordOpen(true);
      toast.error('Discord connection failed. Try again.');
      router.replace('/dashboard/integrations');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGithubConnect = () => {
    const trimmed = repo.trim();
    if (!trimmed || !trimmed.includes('/')) {
      toast.error('Enter a repo in owner/name format, e.g. acme/my-app');
      return;
    }
    window.location.href = `/api/integrations/github/connect?projectId=${encodeURIComponent(githubProjectId)}&repo=${encodeURIComponent(trimmed)}`;
  };

  const handleGithubSync = async () => {
    setSyncing(true);
    try {
      const res = await fetch('/api/integrations/github/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId: githubProjectId }),
      });
      const data = await res.json() as { added?: number };
      if (res.ok) {
        toast.success(data.added ? `Synced — ${data.added} new draft entries added.` : 'Already up to date.');
        if (data.added) router.refresh();
      } else {
        toast.error('Sync failed.');
      }
    } catch {
      toast.error('Sync failed.');
    } finally {
      setSyncing(false);
    }
  };

  const handleGithubDisconnect = async () => {
    setDisconnecting('github');
    try {
      const res = await fetch('/api/integrations/github/disconnect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId: githubProjectId }),
      });
      if (!res.ok) throw new Error();
      setProjects((prev) =>
        prev.map((p) =>
          p.id === githubProjectId
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
      setDisconnecting(null);
    }
  };

  const handleSlackConnect = () => {
    window.location.href = `/api/integrations/slack/connect?projectId=${encodeURIComponent(slackProjectId)}`;
  };

  const handleSlackDisconnect = async () => {
    setDisconnecting('slack');
    try {
      const res = await fetch('/api/integrations/slack/disconnect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId: slackProjectId }),
      });
      if (!res.ok) throw new Error();
      setIntegrationsList((prev) => prev.filter((i) => !(i.projectId === slackProjectId && i.provider === 'slack')));
      toast.success('Slack disconnected');
    } catch {
      toast.error('Failed to disconnect');
    } finally {
      setDisconnecting(null);
    }
  };

  const handleDiscordConnect = () => {
    window.location.href = `/api/integrations/discord/connect?projectId=${encodeURIComponent(discordProjectId)}`;
  };

  const handleDiscordDisconnect = async () => {
    setDisconnecting('discord');
    try {
      const res = await fetch('/api/integrations/discord/disconnect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId: discordProjectId }),
      });
      if (!res.ok) throw new Error();
      setIntegrationsList((prev) => prev.filter((i) => !(i.projectId === discordProjectId && i.provider === 'discord')));
      toast.success('Discord disconnected');
    } catch {
      toast.error('Failed to disconnect');
    } finally {
      setDisconnecting(null);
    }
  };

  const handleZapierSave = async () => {
    const url = zapierUrl.trim();
    if (!url) { toast.error('Enter a webhook URL'); return; }
    try { new URL(url); } catch { toast.error('Invalid URL'); return; }
    setSavingZapier(true);
    try {
      const res = await fetch('/api/integrations/zapier', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId: zapierProjectId, webhookUrl: url }),
      });
      if (!res.ok) throw new Error();
      setIntegrationsList((prev) => {
        const without = prev.filter((i) => !(i.projectId === zapierProjectId && i.provider === 'zapier'));
        return [...without, { projectId: zapierProjectId, provider: 'zapier', config: { webhookUrl: url } }];
      });
      setZapierUrl('');
      toast.success('Zapier webhook saved — entries will POST on publish.');
    } catch {
      toast.error('Failed to save');
    } finally {
      setSavingZapier(false);
    }
  };

  const handleZapierDisconnect = async () => {
    setDisconnecting('zapier');
    try {
      const res = await fetch('/api/integrations/zapier', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId: zapierProjectId }),
      });
      if (!res.ok) throw new Error();
      setIntegrationsList((prev) => prev.filter((i) => !(i.projectId === zapierProjectId && i.provider === 'zapier')));
      toast.success('Zapier disconnected');
    } catch {
      toast.error('Failed to disconnect');
    } finally {
      setDisconnecting(null);
    }
  };

  return (
    <div className="space-y-3">
      {/* GitHub */}
      <Section
        title="GitHub"
        open={githubOpen}
        onToggle={() => setGithubOpen((v) => !v)}
        badge={githubConnectedCount > 0 ? `${githubConnectedCount} connected` : undefined}
      >
        <p className="text-xs text-black/40">Auto-create draft entries from GitHub releases, tags, and merged PRs.</p>
        <ProjectSelector projects={projects} value={githubProjectId} onChange={(v) => { setGithubProjectId(v); setRepo(''); }} />
        {projects.length > 0 && (githubConnected ? (
          <ConnectedBadge
            label={`${githubProject?.githubRepoOwner}/${githubProject?.githubRepoName}`}
            sublabel="Releases, tags, and merged PRs create draft entries automatically."
            onDisconnect={handleGithubDisconnect}
            disconnecting={disconnecting === 'github'}
            extraAction={
              <button
                type="button"
                onClick={handleGithubSync}
                disabled={syncing}
                className="flex items-center gap-1.5 rounded-lg border border-black/10 px-3 py-2 text-xs text-black/45 transition-colors hover:bg-black/4 hover:text-black/65 disabled:opacity-40"
              >
                {syncing ? <Loader2 size={11} className="animate-spin" /> : <RefreshCw size={11} />}
                Sync now
              </button>
            }
          />
        ) : (
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-black/55">GitHub repository</label>
              <input
                type="text"
                placeholder="owner/repository"
                value={repo}
                onChange={(e) => setRepo(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleGithubConnect()}
                className="w-full rounded-lg border border-black/10 bg-[oklch(98%_0_0)] px-3.5 py-2.5 font-mono text-sm text-black/80 placeholder:text-black/30 outline-none focus:border-black/25 focus:bg-white transition-colors"
              />
              <p className="mt-1.5 text-[11px] text-black/35">e.g. <span className="font-mono">acme/my-app</span></p>
            </div>
            <button
              type="button"
              onClick={handleGithubConnect}
              className="flex items-center gap-2 rounded-lg bg-black px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-black/85"
            >
              <svg viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
              </svg>
              Connect with GitHub
            </button>
            <p className="text-xs text-black/35 leading-relaxed">
              Authorizes Patchly to create a webhook. Only requests <span className="font-medium text-black/50">admin:repo_hook</span> scope.
            </p>
          </div>
        ))}
      </Section>

      {/* Slack */}
      <Section
        title="Slack"
        open={slackOpen}
        onToggle={() => setSlackOpen((v) => !v)}
        badge={slackConnectedCount > 0 ? `${slackConnectedCount} connected` : undefined}
      >
        <p className="text-xs text-black/40">Post to a Slack channel when you publish a new entry.</p>
        <ProjectSelector projects={projects} value={slackProjectId} onChange={setSlackProjectId} />
        {projects.length > 0 && (slackConfig ? (
          <ConnectedBadge
            label={slackConfig.teamName ? `${slackConfig.teamName} · ${slackConfig.channel ?? ''}` : (slackConfig.channel ?? 'Slack')}
            sublabel="New entries post to this channel on publish."
            onDisconnect={handleSlackDisconnect}
            disconnecting={disconnecting === 'slack'}
          />
        ) : (
          <button
            type="button"
            onClick={handleSlackConnect}
            className="flex items-center gap-2 rounded-lg bg-[#4A154B] px-4 py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
              <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zm1.271 0a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zm2.521-10.123a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zm0 1.271a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zm10.122 2.521a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zm-1.268 0a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zm-2.523 10.122a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zm0-1.268a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" />
            </svg>
            Connect with Slack
          </button>
        ))}
      </Section>

      {/* Discord */}
      <Section
        title="Discord"
        open={discordOpen}
        onToggle={() => setDiscordOpen((v) => !v)}
        badge={discordConnectedCount > 0 ? `${discordConnectedCount} connected` : undefined}
      >
        <p className="text-xs text-black/40">Announce releases in your Discord server when you publish.</p>
        <ProjectSelector projects={projects} value={discordProjectId} onChange={setDiscordProjectId} />
        {projects.length > 0 && (discordConfig ? (
          <ConnectedBadge
            label={discordConfig.name ?? 'Discord'}
            sublabel="New entries post to this channel on publish."
            onDisconnect={handleDiscordDisconnect}
            disconnecting={disconnecting === 'discord'}
          />
        ) : (
          <button
            type="button"
            onClick={handleDiscordConnect}
            className="flex items-center gap-2 rounded-lg bg-[#5865F2] px-4 py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.003.022.015.043.031.051a19.9 19.9 0 0 0 5.993 3.03.077.077 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
            </svg>
            Connect with Discord
          </button>
        ))}
      </Section>

      {/* Zapier */}
      <Section
        title="Zapier"
        open={zapierOpen}
        onToggle={() => setZapierOpen((v) => !v)}
        badge={zapierConnectedCount > 0 ? `${zapierConnectedCount} connected` : undefined}
      >
        <p className="text-xs text-black/40">Trigger Zaps when you publish a new changelog entry. Paste a Zapier catch webhook URL below.</p>
        <ProjectSelector projects={projects} value={zapierProjectId} onChange={setZapierProjectId} />
        {projects.length > 0 && (zapierConfig ? (
          <ConnectedBadge
            label="Zapier webhook active"
            sublabel="Entry data POSTs to your Zap on every publish."
            onDisconnect={handleZapierDisconnect}
            disconnecting={disconnecting === 'zapier'}
          />
        ) : (
          <div className="space-y-3">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-black/55">Zapier catch webhook URL</label>
              <input
                type="url"
                placeholder="https://hooks.zapier.com/hooks/catch/..."
                value={zapierUrl}
                onChange={(e) => setZapierUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleZapierSave()}
                className="w-full rounded-lg border border-black/10 bg-[oklch(98%_0_0)] px-3.5 py-2.5 text-sm text-black/80 placeholder:text-black/30 outline-none focus:border-black/25 focus:bg-white transition-colors"
              />
            </div>
            <button
              type="button"
              onClick={handleZapierSave}
              disabled={savingZapier}
              className="flex items-center gap-2 rounded-lg bg-[#FF4A00] px-4 py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50"
            >
              {savingZapier ? <Loader2 size={14} className="animate-spin" /> : null}
              Save webhook
            </button>
            <p className="text-xs text-black/35 leading-relaxed">
              Create a <span className="font-medium text-black/50">Webhooks by Zapier</span> trigger → Catch Hook. Paste the URL here.
            </p>
          </div>
        ))}
      </Section>
    </div>
  );
}

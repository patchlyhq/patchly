import { db } from '@/lib/db';
import { entries } from '@/db/schema';
import { eq, and, isNotNull } from 'drizzle-orm';
import type { Project } from '@/db/schema';

type GithubEntry = {
  title: string;
  version: string | null;
  tag: string;
  content: string;
  sourceId: string;
};

async function fetchGithub<T>(url: string, token: string): Promise<T | null> {
  const res = await fetch(url, {
    headers: {
      Authorization: `token ${token}`,
      Accept: 'application/vnd.github+json',
      'User-Agent': 'Patchly',
    },
  });
  if (!res.ok) return null;
  return res.json() as Promise<T>;
}

export async function pullGithubEntries(project: Project): Promise<number> {
  const { githubAccessToken: token, githubRepoOwner: owner, githubRepoName: repo, id: projectId } = project;
  if (!token || !owner || !repo) return 0;

  const base = `https://api.github.com/repos/${owner}/${repo}`;
  const candidates: GithubEntry[] = [];

  // Releases
  type GhRelease = { id: number; tag_name: string; name: string; body: string; prerelease: boolean; draft: boolean };
  const releases = await fetchGithub<GhRelease[]>(`${base}/releases?per_page=100`, token);
  if (releases && releases.length > 0) {
    for (const r of releases) {
      if (r.draft) continue;
      candidates.push({
        title: r.name || r.tag_name,
        version: r.tag_name,
        tag: r.prerelease ? 'patch' : 'release',
        content: r.body ?? '',
        sourceId: `github:release:${r.id}`,
      });
    }
  } else {
    // Tags fallback — only when there are no releases at all
    type GhTag = { name: string };
    const tags = await fetchGithub<GhTag[]>(`${base}/tags?per_page=100`, token);
    if (tags) {
      for (const t of tags) {
        candidates.push({
          title: t.name,
          version: t.name,
          tag: 'release',
          content: '',
          sourceId: `github:tag:${t.name}`,
        });
      }
    }
  }

  // Merged PRs
  type GhPR = { number: number; title: string; body: string | null; merged_at: string | null };
  const prs = await fetchGithub<GhPR[]>(`${base}/pulls?state=closed&sort=updated&direction=desc&per_page=100`, token);
  if (prs) {
    for (const pr of prs) {
      if (!pr.merged_at) continue;
      candidates.push({
        title: pr.title,
        version: null,
        tag: 'release',
        content: pr.body ?? '',
        sourceId: `github:pr:${pr.number}`,
      });
    }
  }

  if (candidates.length === 0) return 0;

  // Load existing sourceIds for this project to skip already-imported ones
  const existing = await db
    .select({ sourceId: entries.sourceId })
    .from(entries)
    .where(and(eq(entries.projectId, projectId), isNotNull(entries.sourceId)));
  const existingSet = new Set(existing.map((e) => e.sourceId));

  const fresh = candidates.filter((c) => !existingSet.has(c.sourceId));
  if (fresh.length === 0) return 0;

  await db.insert(entries).values(
    fresh.map((c) => ({
      projectId,
      title: c.title,
      version: c.version,
      tag: c.tag,
      content: c.content,
      published: false,
      sourceId: c.sourceId,
    })),
  ).onConflictDoNothing();

  return fresh.length;
}

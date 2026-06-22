import { db } from '@/lib/db';
import { entries } from '@/db/schema';
import { eq, and, isNotNull } from 'drizzle-orm';

type SentryRelease = {
  version: string;
  dateReleased: string | null;
  shortVersion: string;
  projects: { slug: string; name: string }[];
};

type SentryConfig = {
  accessToken: string;
  orgSlug: string;
  projectSlug: string;
};

export async function pullSentryReleases(projectId: string, config: SentryConfig): Promise<number> {
  const { accessToken, orgSlug, projectSlug } = config;
  if (!accessToken || !orgSlug || !projectSlug) return 0;

  const res = await fetch(
    `https://sentry.io/api/0/projects/${orgSlug}/${projectSlug}/releases/?per_page=100`,
    {
      headers: { Authorization: `Bearer ${accessToken}`, 'User-Agent': 'Patchly' },
    },
  );
  if (!res.ok) return 0;

  const releases = await res.json() as SentryRelease[];
  if (!releases.length) return 0;

  const existing = await db
    .select({ sourceId: entries.sourceId })
    .from(entries)
    .where(and(eq(entries.projectId, projectId), isNotNull(entries.sourceId)));
  const existingSet = new Set(existing.map((e) => e.sourceId));

  const fresh = releases.filter((r) => !existingSet.has(`sentry:release:${r.version}`));
  if (!fresh.length) return 0;

  await db.insert(entries).values(
    fresh.map((r) => ({
      projectId,
      title: r.shortVersion || r.version,
      version: r.version,
      tag: 'release' as const,
      content: '',
      published: false,
      sourceId: `sentry:release:${r.version}`,
    })),
  ).onConflictDoNothing();

  return fresh.length;
}

import { eq, and } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { getUser } from '@/lib/get-auth';
import { db } from '@/lib/db';
import { integrations, projects } from '@/db/schema';
import { pullSentryReleases } from '@/lib/sentry';

export async function POST(request: Request) {
  const u = await getUser(request);
  if (!u) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json().catch(() => null);
  const projectId: string = body?.projectId ?? '';
  if (!projectId) return NextResponse.json({ error: 'projectId required' }, { status: 400 });

  const projectRows = await db.select({ id: projects.id }).from(projects)
    .where(and(eq(projects.id, projectId), eq(projects.userId, u.id))).limit(1);
  if (!projectRows[0]) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const intRows = await db.select().from(integrations)
    .where(and(eq(integrations.projectId, projectId), eq(integrations.provider, 'sentry'))).limit(1);
  const config = intRows[0]?.config as { accessToken?: string; orgSlug?: string; projectSlug?: string } | undefined;

  if (!config?.accessToken || !config?.orgSlug || !config?.projectSlug) {
    return NextResponse.json({ error: 'Sentry not fully configured' }, { status: 400 });
  }

  const added = await pullSentryReleases(projectId, {
    accessToken: config.accessToken,
    orgSlug: config.orgSlug,
    projectSlug: config.projectSlug,
  });

  return NextResponse.json({ ok: true, added });
}

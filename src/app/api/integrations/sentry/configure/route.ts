import { eq, and } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { getUser } from '@/lib/get-auth';
import { db } from '@/lib/db';
import { integrations, projects } from '@/db/schema';

export async function PATCH(request: Request) {
  const u = await getUser(request);
  if (!u) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json().catch(() => null);
  const projectId: string = body?.projectId ?? '';
  const orgSlug: string = body?.orgSlug?.trim() ?? '';
  const projectSlug: string = body?.projectSlug?.trim() ?? '';

  if (!projectId || !orgSlug || !projectSlug) {
    return NextResponse.json({ error: 'projectId, orgSlug and projectSlug required' }, { status: 400 });
  }

  const projectRows = await db.select({ id: projects.id }).from(projects)
    .where(and(eq(projects.id, projectId), eq(projects.userId, u.id))).limit(1);
  if (!projectRows[0]) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const intRows = await db.select().from(integrations)
    .where(and(eq(integrations.projectId, projectId), eq(integrations.provider, 'sentry'))).limit(1);
  if (!intRows[0]) return NextResponse.json({ error: 'Sentry not connected' }, { status: 400 });

  const existing = intRows[0].config as { accessToken: string; orgName?: string };
  await db.update(integrations).set({
    config: { ...existing, orgSlug, projectSlug },
  }).where(and(eq(integrations.projectId, projectId), eq(integrations.provider, 'sentry')));

  return NextResponse.json({ ok: true });
}

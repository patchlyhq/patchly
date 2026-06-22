import { eq, and } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { getUser } from '@/lib/get-auth';
import { db } from '@/lib/db';
import { integrations, projects } from '@/db/schema';

export async function POST(request: Request) {
  const u = await getUser(request);
  if (!u) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json().catch(() => null);
  const projectId: string = body?.projectId ?? '';
  if (!projectId) return NextResponse.json({ error: 'projectId required' }, { status: 400 });

  const rows = await db.select({ id: projects.id }).from(projects)
    .where(and(eq(projects.id, projectId), eq(projects.userId, u.id))).limit(1);
  if (!rows[0]) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  await db.delete(integrations).where(
    and(eq(integrations.projectId, projectId), eq(integrations.provider, 'sentry'))
  );

  return NextResponse.json({ ok: true });
}

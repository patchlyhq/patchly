import { eq, and } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { getUser } from '@/lib/get-auth';
import { db } from '@/lib/db';
import { integrations, projects } from '@/db/schema';

async function assertOwnership(userId: string, projectId: string) {
  const rows = await db.select({ id: projects.id }).from(projects)
    .where(and(eq(projects.id, projectId), eq(projects.userId, userId))).limit(1);
  return !!rows[0];
}

export async function POST(request: Request) {
  const u = await getUser(request);
  if (!u) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json().catch(() => null);
  const projectId: string = body?.projectId ?? '';
  const webhookUrl: string = body?.webhookUrl ?? '';

  if (!projectId || !webhookUrl) {
    return NextResponse.json({ error: 'projectId and webhookUrl required' }, { status: 400 });
  }

  try { new URL(webhookUrl); } catch {
    return NextResponse.json({ error: 'Invalid webhookUrl' }, { status: 400 });
  }

  if (!(await assertOwnership(u.id, projectId))) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  await db.insert(integrations).values({
    projectId,
    provider: 'zapier',
    config: { webhookUrl },
  }).onConflictDoUpdate({
    target: [integrations.projectId, integrations.provider],
    set: { config: { webhookUrl } },
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  const u = await getUser(request);
  if (!u) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json().catch(() => null);
  const projectId: string = body?.projectId ?? '';
  if (!projectId) return NextResponse.json({ error: 'projectId required' }, { status: 400 });

  if (!(await assertOwnership(u.id, projectId))) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  await db.delete(integrations).where(
    and(eq(integrations.projectId, projectId), eq(integrations.provider, 'zapier'))
  );

  return NextResponse.json({ ok: true });
}

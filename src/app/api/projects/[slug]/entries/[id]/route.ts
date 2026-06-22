import { db } from '@/lib/db';
import { getUser } from '@/lib/get-auth';
import { entries, projects } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { dispatchPublish } from '@/lib/notify';

async function assertOwnership(userId: string, entryId: string) {
  const result = await db
    .select({ entryId: entries.id })
    .from(entries)
    .innerJoin(projects, eq(entries.projectId, projects.id))
    .where(and(eq(entries.id, entryId), eq(projects.userId, userId)))
    .limit(1);
  return !!result[0];
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ slug: string; id: string }> },
) {
  const u = await getUser(request);
  if (!u) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  if (!(await assertOwnership(u.id, id))) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const body = await request.json().catch(() => null);

  // Snapshot prior published state so we only dispatch once per publish event
  const prior = await db.select({ published: entries.published, projectId: entries.projectId }).from(entries).where(eq(entries.id, id)).limit(1);
  const wasUnpublished = prior[0] && !prior[0].published;

  const updates: Record<string, unknown> = { updatedAt: new Date() };
  if (body?.title !== undefined) updates.title = body.title;
  if (body?.version !== undefined) updates.version = body.version;
  if (body?.tag !== undefined) updates.tag = body.tag;
  if (body?.content !== undefined) updates.content = body.content;
  if (body?.published !== undefined) {
    updates.published = body.published;
    updates.publishedAt = body.published ? new Date() : null;
  }

  const [updated] = await db
    .update(entries)
    .set(updates)
    .where(eq(entries.id, id))
    .returning();

  if (body?.published === true && wasUnpublished && updated) {
    dispatchPublish(updated.projectId, updated).catch(() => null);
  }

  return NextResponse.json(updated);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ slug: string; id: string }> },
) {
  const u = await getUser(request);
  if (!u) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  if (!(await assertOwnership(u.id, id))) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  await db.delete(entries).where(eq(entries.id, id));
  return NextResponse.json({ ok: true });
}

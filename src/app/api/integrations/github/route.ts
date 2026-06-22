import crypto from 'node:crypto';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { getUser } from '@/lib/get-auth';
import { db } from '@/lib/db';
import { projects } from '@/db/schema';

export async function GET(request: Request) {
  const u = await getUser(request);
  if (!u) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const rows = await db
    .select({ id: projects.id, slug: projects.slug, name: projects.name, githubWebhookSecret: projects.githubWebhookSecret })
    .from(projects)
    .where(eq(projects.userId, u.id));

  return NextResponse.json(rows);
}

export async function POST(request: Request) {
  const u = await getUser(request);
  if (!u) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json().catch(() => null);
  const projectId: string = body?.projectId ?? '';
  if (!projectId) return NextResponse.json({ error: 'projectId required' }, { status: 400 });

  const rows = await db
    .select()
    .from(projects)
    .where(eq(projects.id, projectId))
    .limit(1);
  const project = rows[0];
  if (!project || project.userId !== u.id) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const secret = crypto.randomBytes(24).toString('hex');
  await db.update(projects).set({ githubWebhookSecret: secret }).where(eq(projects.id, projectId));

  return NextResponse.json({ secret });
}

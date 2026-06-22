import { db } from '@/lib/db';
import { getSession } from '@/lib/session';
import { entries, projects } from '@/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { NextResponse } from 'next/server';

async function getProject(userId: string, slug: string) {
  const result = await db
    .select()
    .from(projects)
    .where(and(eq(projects.userId, userId), eq(projects.slug, slug)))
    .limit(1);
  return result[0] ?? null;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { slug } = await params;
  const project = await getProject(user.id, slug);
  if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const rows = await db
    .select()
    .from(entries)
    .where(eq(entries.projectId, project.id))
    .orderBy(desc(entries.createdAt));

  return NextResponse.json(rows);
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { slug } = await params;
  const project = await getProject(user.id, slug);
  if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const body = await request.json().catch(() => null);
  const title: string = body?.title?.trim() ?? '';
  if (!title) return NextResponse.json({ error: 'Title required' }, { status: 400 });

  const [entry] = await db
    .insert(entries)
    .values({
      projectId: project.id,
      title,
      version: body?.version ?? null,
      tag: body?.tag ?? 'release',
      content: body?.content ?? '',
      published: body?.published ?? false,
      publishedAt: body?.published ? new Date() : null,
    })
    .returning();

  return NextResponse.json(entry, { status: 201 });
}

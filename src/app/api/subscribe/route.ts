import { db } from '@/lib/db';
import { subscribers, projects } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const email: string = body?.email?.trim().toLowerCase() ?? '';
  const projectSlug: string = body?.slug ?? '';

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
  }

  const project = await db
    .select()
    .from(projects)
    .where(eq(projects.slug, projectSlug))
    .limit(1);

  if (!project[0]) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 });
  }

  await db
    .insert(subscribers)
    .values({ projectId: project[0].id, email, source: body?.source ?? 'widget' })
    .onConflictDoNothing();

  return NextResponse.json({ ok: true });
}

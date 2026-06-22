import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { getUser } from '@/lib/get-auth';
import { db } from '@/lib/db';
import { projects } from '@/db/schema';
import { pullGithubEntries } from '@/lib/github';

export async function POST(request: Request) {
  const u = await getUser(request);
  if (!u) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json().catch(() => null);
  const projectId: string = body?.projectId ?? '';
  if (!projectId) return NextResponse.json({ error: 'projectId required' }, { status: 400 });

  const rows = await db.select().from(projects).where(eq(projects.id, projectId)).limit(1);
  const project = rows[0];
  if (!project || project.userId !== u.id) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  if (!project.githubRepoOwner || !project.githubRepoName) {
    return NextResponse.json({ error: 'GitHub not connected' }, { status: 400 });
  }

  const added = await pullGithubEntries(project);
  return NextResponse.json({ ok: true, added });
}

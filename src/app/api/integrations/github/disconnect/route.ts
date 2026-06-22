import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { getUser } from '@/lib/get-auth';
import { db } from '@/lib/db';
import { projects } from '@/db/schema';

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

  // Delete webhook on GitHub
  if (project.githubWebhookId && project.githubAccessToken && project.githubRepoOwner && project.githubRepoName) {
    await fetch(
      `https://api.github.com/repos/${project.githubRepoOwner}/${project.githubRepoName}/hooks/${project.githubWebhookId}`,
      {
        method: 'DELETE',
        headers: { Authorization: `token ${project.githubAccessToken}`, 'User-Agent': 'Patchly' },
      }
    ).catch(() => null);
  }

  await db.update(projects).set({
    githubRepoOwner: null,
    githubRepoName: null,
    githubAccessToken: null,
    githubWebhookId: null,
    githubWebhookSecret: null,
  }).where(eq(projects.id, projectId));

  return NextResponse.json({ ok: true });
}

import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { getUser } from '@/lib/get-auth';
import { db } from '@/lib/db';
import { projects } from '@/db/schema';

export async function GET(request: Request) {
  const u = await getUser(request);
  if (!u) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get('projectId');
  const repo = searchParams.get('repo'); // "owner/name"

  if (!projectId || !repo || !repo.includes('/')) {
    return Response.json({ error: 'projectId and repo (owner/name) required' }, { status: 400 });
  }

  const rows = await db.select().from(projects).where(eq(projects.id, projectId)).limit(1);
  const project = rows[0];
  if (!project || project.userId !== u.id) {
    return Response.json({ error: 'Not found' }, { status: 404 });
  }

  // Encode projectId + repo in state — validated again in callback
  const state = Buffer.from(JSON.stringify({ projectId, repo })).toString('base64url');

  const params = new URLSearchParams({
    client_id: process.env.GITHUB_CLIENT_ID!,
    redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/integrations/github/callback`,
    scope: 'admin:repo_hook',
    state,
  });

  redirect(`https://github.com/login/oauth/authorize?${params}`);
}

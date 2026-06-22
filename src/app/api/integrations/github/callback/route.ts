import crypto from 'node:crypto';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { getUser } from '@/lib/get-auth';
import { db } from '@/lib/db';
import { projects } from '@/db/schema';
import { pullGithubEntries } from '@/lib/github';

export async function GET(request: Request) {
  const u = await getUser(request);
  if (!u) return redirect('/login');

  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const stateParam = searchParams.get('state');
  const errorParam = searchParams.get('error');

  if (errorParam || !code || !stateParam) {
    return redirect('/dashboard/integrations?github=error');
  }

  let projectId: string;
  let repo: string;
  try {
    const parsed = JSON.parse(Buffer.from(stateParam, 'base64url').toString()) as { projectId: string; repo: string };
    projectId = parsed.projectId;
    repo = parsed.repo;
  } catch {
    return redirect('/dashboard/integrations?github=error');
  }

  const rows = await db.select().from(projects).where(eq(projects.id, projectId)).limit(1);
  const project = rows[0];
  if (!project || project.userId !== u.id) {
    return redirect('/dashboard/integrations?github=error');
  }

  // Exchange code for access token
  const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
      redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/integrations/github/callback`,
    }),
  });

  const tokenData = await tokenRes.json() as { access_token?: string; error?: string };
  if (!tokenData.access_token) {
    return redirect('/dashboard/integrations?github=error');
  }

  const accessToken = tokenData.access_token;
  const [repoOwner, repoName] = repo.split('/');

  // Delete existing webhook if any
  if (project.githubWebhookId && project.githubAccessToken) {
    await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/hooks/${project.githubWebhookId}`, {
      method: 'DELETE',
      headers: { Authorization: `token ${project.githubAccessToken}`, 'User-Agent': 'Patchly' },
    }).catch(() => null);
  }

  // Generate webhook secret and create webhook on GitHub
  const webhookSecret = crypto.randomBytes(24).toString('hex');
  const webhookUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/integrations/github/webhook?project=${project.slug}`;

  const hookRes = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/hooks`, {
    method: 'POST',
    headers: {
      Authorization: `token ${accessToken}`,
      Accept: 'application/vnd.github+json',
      'User-Agent': 'Patchly',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: 'web',
      active: true,
      events: ['release'],
      config: {
        url: webhookUrl,
        content_type: 'json',
        secret: webhookSecret,
        insecure_ssl: '0',
      },
    }),
  });

  if (!hookRes.ok) {
    return redirect('/dashboard/integrations?github=webhook_error');
  }

  const hookData = await hookRes.json() as { id: number };

  // Save everything to DB
  await db.update(projects).set({
    githubRepoOwner: repoOwner,
    githubRepoName: repoName,
    githubAccessToken: accessToken,
    githubWebhookId: String(hookData.id),
    githubWebhookSecret: webhookSecret,
  }).where(eq(projects.id, projectId));

  // Backfill existing releases/tags/PRs as drafts (best-effort — failure doesn't block connect)
  const fresh = await db.select().from(projects).where(eq(projects.id, projectId)).limit(1);
  if (fresh[0]) {
    await pullGithubEntries(fresh[0]).catch(() => null);
  }

  return redirect('/dashboard/integrations?github=connected');
}

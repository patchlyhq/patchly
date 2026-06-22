import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { getUser } from '@/lib/get-auth';
import { db } from '@/lib/db';
import { integrations, projects } from '@/db/schema';

export async function GET(request: Request) {
  const u = await getUser(request);
  if (!u) return redirect('/login');

  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const stateParam = searchParams.get('state');
  const error = searchParams.get('error');

  if (error || !code || !stateParam) return redirect('/dashboard/integrations?sentry=error');

  let projectId: string;
  try {
    const parsed = JSON.parse(Buffer.from(stateParam, 'base64url').toString()) as { projectId: string };
    projectId = parsed.projectId;
  } catch {
    return redirect('/dashboard/integrations?sentry=error');
  }

  const rows = await db.select().from(projects).where(eq(projects.id, projectId)).limit(1);
  const project = rows[0];
  if (!project || project.userId !== u.id) return redirect('/dashboard/integrations?sentry=error');

  const tokenRes = await fetch('https://sentry.io/oauth/token/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: process.env.SENTRY_CLIENT_ID ?? '',
      client_secret: process.env.SENTRY_CLIENT_SECRET ?? '',
      code,
      redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/integrations/sentry/callback`,
    }),
  });

  const tokenData = await tokenRes.json() as { access_token?: string; error?: string };
  if (!tokenData.access_token) return redirect('/dashboard/integrations?sentry=error');

  // Fetch the user's orgs to pre-populate
  const orgsRes = await fetch('https://sentry.io/api/0/organizations/', {
    headers: { Authorization: `Bearer ${tokenData.access_token}`, 'User-Agent': 'Patchly' },
  });
  const orgs = orgsRes.ok ? (await orgsRes.json() as { slug: string; name: string }[]) : [];

  await db.insert(integrations).values({
    projectId,
    provider: 'sentry',
    config: {
      accessToken: tokenData.access_token,
      orgSlug: orgs[0]?.slug ?? null,
      orgName: orgs[0]?.name ?? null,
      projectSlug: null,
    },
  }).onConflictDoUpdate({
    target: [integrations.projectId, integrations.provider],
    set: {
      config: {
        accessToken: tokenData.access_token,
        orgSlug: orgs[0]?.slug ?? null,
        orgName: orgs[0]?.name ?? null,
        projectSlug: null,
      },
    },
  });

  return redirect('/dashboard/integrations?sentry=connected');
}

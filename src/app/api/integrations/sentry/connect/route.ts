import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { getUser } from '@/lib/get-auth';
import { db } from '@/lib/db';
import { projects } from '@/db/schema';

export async function GET(request: Request) {
  const u = await getUser(request);
  if (!u) return redirect('/login');

  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get('projectId');
  if (!projectId) return redirect('/dashboard/integrations?sentry=error');

  const rows = await db.select({ id: projects.id, userId: projects.userId }).from(projects).where(eq(projects.id, projectId)).limit(1);
  const project = rows[0];
  if (!project || project.userId !== u.id) return redirect('/dashboard/integrations?sentry=error');

  const state = Buffer.from(JSON.stringify({ projectId })).toString('base64url');
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: process.env.SENTRY_CLIENT_ID ?? '',
    redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/integrations/sentry/callback`,
    scope: 'project:releases org:read',
    state,
  });

  return redirect(`https://sentry.io/oauth/authorize/?${params}`);
}

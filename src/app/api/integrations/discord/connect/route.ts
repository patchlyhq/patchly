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
  if (!projectId) return redirect('/dashboard/integrations?discord=error');

  const rows = await db.select({ id: projects.id, userId: projects.userId }).from(projects).where(eq(projects.id, projectId)).limit(1);
  const project = rows[0];
  if (!project || project.userId !== u.id) return redirect('/dashboard/integrations?discord=error');

  const state = Buffer.from(JSON.stringify({ projectId })).toString('base64url');
  const params = new URLSearchParams({
    client_id: process.env.DISCORD_CLIENT_ID ?? '',
    scope: 'webhook.incoming',
    response_type: 'code',
    redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/integrations/discord/callback`,
    state,
  });

  return redirect(`https://discord.com/oauth2/authorize?${params}`);
}

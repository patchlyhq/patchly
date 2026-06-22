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

  if (error || !code || !stateParam) return redirect('/dashboard/integrations?slack=error');

  let projectId: string;
  try {
    const parsed = JSON.parse(Buffer.from(stateParam, 'base64url').toString()) as { projectId: string };
    projectId = parsed.projectId;
  } catch {
    return redirect('/dashboard/integrations?slack=error');
  }

  const rows = await db.select().from(projects).where(eq(projects.id, projectId)).limit(1);
  const project = rows[0];
  if (!project || project.userId !== u.id) return redirect('/dashboard/integrations?slack=error');

  const tokenRes = await fetch('https://slack.com/api/oauth.v2.access', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.SLACK_CLIENT_ID ?? '',
      client_secret: process.env.SLACK_CLIENT_SECRET ?? '',
      code,
      redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/integrations/slack/callback`,
    }),
  });

  const tokenData = await tokenRes.json() as {
    ok: boolean;
    incoming_webhook?: { url: string; channel: string };
    team?: { name: string };
  };

  if (!tokenData.ok || !tokenData.incoming_webhook?.url) {
    return redirect('/dashboard/integrations?slack=error');
  }

  await db.insert(integrations).values({
    projectId,
    provider: 'slack',
    config: {
      webhookUrl: tokenData.incoming_webhook.url,
      channel: tokenData.incoming_webhook.channel,
      teamName: tokenData.team?.name,
    },
  }).onConflictDoUpdate({
    target: [integrations.projectId, integrations.provider],
    set: {
      config: {
        webhookUrl: tokenData.incoming_webhook.url,
        channel: tokenData.incoming_webhook.channel,
        teamName: tokenData.team?.name,
      },
    },
  });

  return redirect('/dashboard/integrations?slack=connected');
}

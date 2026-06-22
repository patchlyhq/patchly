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

  if (error || !code || !stateParam) return redirect('/dashboard/integrations?discord=error');

  let projectId: string;
  try {
    const parsed = JSON.parse(Buffer.from(stateParam, 'base64url').toString()) as { projectId: string };
    projectId = parsed.projectId;
  } catch {
    return redirect('/dashboard/integrations?discord=error');
  }

  const rows = await db.select().from(projects).where(eq(projects.id, projectId)).limit(1);
  const project = rows[0];
  if (!project || project.userId !== u.id) return redirect('/dashboard/integrations?discord=error');

  const tokenRes = await fetch('https://discord.com/api/oauth2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.DISCORD_CLIENT_ID ?? '',
      client_secret: process.env.DISCORD_CLIENT_SECRET ?? '',
      grant_type: 'authorization_code',
      code,
      redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/integrations/discord/callback`,
    }),
  });

  const tokenData = await tokenRes.json() as {
    webhook?: { url: string; channel_id: string; guild_id?: string; name?: string };
    error?: string;
  };

  if (!tokenData.webhook?.url) {
    return redirect('/dashboard/integrations?discord=error');
  }

  await db.insert(integrations).values({
    projectId,
    provider: 'discord',
    config: {
      webhookUrl: tokenData.webhook.url,
      channelId: tokenData.webhook.channel_id,
      guildId: tokenData.webhook.guild_id,
      name: tokenData.webhook.name,
    },
  }).onConflictDoUpdate({
    target: [integrations.projectId, integrations.provider],
    set: {
      config: {
        webhookUrl: tokenData.webhook.url,
        channelId: tokenData.webhook.channel_id,
        guildId: tokenData.webhook.guild_id,
        name: tokenData.webhook.name,
      },
    },
  });

  return redirect('/dashboard/integrations?discord=connected');
}

import { db } from '@/lib/db';
import { integrations, notificationLogs, projects, subscribers } from '@/db/schema';
import { and, eq, isNull } from 'drizzle-orm';
import type { Entry } from '@/db/schema';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

type IntegrationConfig = {
  webhookUrl?: string;
  channel?: string;
  teamName?: string;
  channelId?: string;
};

export async function dispatchPublish(projectId: string, entry: Entry): Promise<void> {
  const projectRows = await db.select({ slug: projects.slug }).from(projects).where(eq(projects.id, projectId)).limit(1);
  const slug = projectRows[0]?.slug;
  if (!slug) return;

  const url = `${process.env.NEXT_PUBLIC_APP_URL}/${slug}`;

  const rows = await db.select().from(integrations).where(eq(integrations.projectId, projectId));

  if (rows.length > 0) {
    await Promise.all(rows.map(async (row) => {
      const config = row.config as IntegrationConfig;
      if (!config.webhookUrl) return;

      if (row.provider === 'zapier') {
        await fetch(config.webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: entry.title,
            version: entry.version,
            tag: entry.tag,
            content: entry.content,
            url,
          }),
        }).catch(() => null);
      }

      if (row.provider === 'slack') {
        await fetch(config.webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            blocks: [
              {
                type: 'section',
                text: {
                  type: 'mrkdwn',
                  text: `*${entry.title}*${entry.version ? ` \`${entry.version}\`` : ''}\n${entry.content ? entry.content.slice(0, 200) + (entry.content.length > 200 ? '…' : '') : ''}`,
                },
              },
              {
                type: 'actions',
                elements: [{ type: 'button', text: { type: 'plain_text', text: 'View changelog' }, url }],
              },
            ],
          }),
        }).catch(() => null);
      }

      if (row.provider === 'discord') {
        await fetch(config.webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            embeds: [
              {
                title: `${entry.title}${entry.version ? ` (${entry.version})` : ''}`,
                description: entry.content ? entry.content.slice(0, 300) + (entry.content.length > 300 ? '…' : '') : undefined,
                url,
                color: 0x000000,
              },
            ],
          }),
        }).catch(() => null);
      }
    }));
  }

  const subs = await db
    .select({ email: subscribers.email })
    .from(subscribers)
    .where(and(eq(subscribers.projectId, projectId), isNull(subscribers.unsubscribedAt)));

  if (subs.length === 0) return;

  const subject = `${entry.title}${entry.version ? ` (${entry.version})` : ''}`;
  const preview = entry.content
    ? entry.content.replace(/[#*`_~>\[\]]/g, '').slice(0, 300).trimEnd() +
      (entry.content.length > 300 ? '…' : '')
    : '';

  await Promise.all(
    subs.map(({ email }) =>
      resend.emails.send({
        from: 'Patchly <noreply@dawit.dev>',
        to: email,
        subject,
        html: `
          <div style="font-family:system-ui,sans-serif;max-width:520px;margin:0 auto;padding:40px 24px">
            <h2 style="font-size:20px;font-weight:700;color:#000;margin:0 0 8px">${entry.title}${entry.version ? ` <span style="font-size:14px;font-weight:500;color:#666">${entry.version}</span>` : ''}</h2>
            ${preview ? `<p style="font-size:14px;color:#444;line-height:1.6;margin:0 0 24px">${preview}</p>` : ''}
            <a href="${url}" style="display:inline-block;background:#000;color:#fff;text-decoration:none;font-size:14px;font-weight:600;padding:12px 24px;border-radius:10px">View changelog</a>
            <p style="font-size:12px;color:#999;margin:32px 0 0">You're receiving this because you subscribed to changelog updates.</p>
          </div>
        `,
      }).catch(() => null),
    ),
  );

  await db.insert(notificationLogs).values({
    projectId,
    entryId: entry.id,
    entryTitle: entry.title,
    version: entry.version ?? null,
    recipientCount: subs.length,
  }).catch(() => null);
}

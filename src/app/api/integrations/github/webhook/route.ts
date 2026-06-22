import crypto from 'node:crypto';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { entries, projects } from '@/db/schema';

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('project');
  if (!slug) return NextResponse.json({ error: 'Missing project param' }, { status: 400 });

  const body = await request.text();
  const signature = request.headers.get('x-hub-signature-256');
  const event = request.headers.get('x-github-event');

  const rows = await db
    .select()
    .from(projects)
    .where(eq(projects.slug, slug))
    .limit(1);
  const project = rows[0];

  if (!project?.githubWebhookSecret) {
    return NextResponse.json({ error: 'Not configured' }, { status: 404 });
  }

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 401 });
  }

  const expected =
    'sha256=' +
    crypto.createHmac('sha256', project.githubWebhookSecret).update(body).digest('hex');

  if (
    signature.length !== expected.length ||
    !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
  ) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  if (event !== 'release') return NextResponse.json({ ok: true });

  const payload = JSON.parse(body) as {
    action: string;
    release: {
      id: number;
      tag_name: string;
      name: string;
      body: string;
      prerelease: boolean;
      draft: boolean;
    };
  };

  if (payload.action !== 'published' || payload.release.draft) {
    return NextResponse.json({ ok: true });
  }

  const { release } = payload;
  await db.insert(entries).values({
    projectId: project.id,
    title: release.name || release.tag_name,
    version: release.tag_name,
    tag: release.prerelease ? 'patch' : 'release',
    content: release.body ?? '',
    published: false,
    sourceId: `github:release:${release.id}`,
  }).onConflictDoNothing();

  return NextResponse.json({ ok: true });
}

import { db } from '@/lib/db';
import { pageViews, projects } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const projectSlug: string = body?.projectSlug ?? '';
    const entryId: string | undefined = body?.entryId ?? undefined;

    if (!projectSlug) return NextResponse.json({ ok: true });

    const projectRows = await db
      .select({ id: projects.id })
      .from(projects)
      .where(eq(projects.slug, projectSlug))
      .limit(1);

    if (!projectRows[0]) return NextResponse.json({ ok: true });

    await db.insert(pageViews).values({
      projectId: projectRows[0].id,
      entryId: entryId ?? null,
    });
  } catch {
    // best-effort — never surface errors to client
  }

  return NextResponse.json({ ok: true });
}

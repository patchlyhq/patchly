import { db } from '@/lib/db';
import { getSession } from '@/lib/session';
import { projects } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { slug } = await params;
  await db
    .delete(projects)
    .where(and(eq(projects.slug, slug), eq(projects.userId, user.id)));

  return NextResponse.json({ ok: true });
}

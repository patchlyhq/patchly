import { db } from '@/lib/db';
import { getUser } from '@/lib/get-auth';
import { projects } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const u = await getUser(request);
  if (!u) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { slug } = await params;
  await db
    .delete(projects)
    .where(and(eq(projects.slug, slug), eq(projects.userId, u.id)));

  return NextResponse.json({ ok: true });
}

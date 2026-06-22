import { db } from '@/lib/db';
import { getUser } from '@/lib/get-auth';
import { projects } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const u = await getUser(request);
  if (!u) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const rows = await db
    .select()
    .from(projects)
    .where(eq(projects.userId, u.id))
    .orderBy(projects.createdAt);

  return NextResponse.json(rows);
}

export async function POST(request: Request) {
  const u = await getUser(request);
  if (!u) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json().catch(() => null);
  const name: string = body?.name?.trim() ?? '';
  if (!name) return NextResponse.json({ error: 'Name required' }, { status: 400 });

  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  const [project] = await db
    .insert(projects)
    .values({ userId: u.id, name, slug })
    .returning();

  return NextResponse.json(project, { status: 201 });
}

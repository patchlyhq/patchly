import { getUser } from '@/lib/get-auth';
import { db } from '@/lib/db';
import { user as userTable } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const u = await getUser(request);
  if (!u) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  return NextResponse.json({ id: u.id, email: u.email, name: u.name });
}

export async function PATCH(request: Request) {
  const u = await getUser(request);
  if (!u) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json().catch(() => null);
  const name: string = body?.name?.trim() ?? '';
  if (!name) return NextResponse.json({ error: 'Name required' }, { status: 400 });

  const [updated] = await db
    .update(userTable)
    .set({ name, updatedAt: new Date() })
    .where(eq(userTable.id, u.id))
    .returning();

  return NextResponse.json({ id: updated.id, email: updated.email, name: updated.name });
}

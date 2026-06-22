import { getSession } from '@/lib/session';
import { db } from '@/lib/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET() {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  return NextResponse.json({ id: user.id, email: user.email, name: user.name });
}

export async function PATCH(request: Request) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json().catch(() => null);
  const name: string = body?.name?.trim() ?? '';
  if (!name) return NextResponse.json({ error: 'Name required' }, { status: 400 });

  const [updated] = await db
    .update(users)
    .set({ name })
    .where(eq(users.id, user.id))
    .returning();

  return NextResponse.json({ id: updated.id, email: updated.email, name: updated.name });
}

import { getUser } from '@/lib/get-auth';
import { db } from '@/lib/db';
import { user as userTable } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function PATCH(request: Request) {
  const u = await getUser(request);
  if (!u) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const patch: Record<string, boolean> = {};
  if (typeof body.notifyOnSubscriber === 'boolean') patch.notifyOnSubscriber = body.notifyOnSubscriber;
  if (typeof body.weeklyDigest === 'boolean') patch.weeklyDigest = body.weeklyDigest;
  if (Object.keys(patch).length === 0) return NextResponse.json({ error: 'No valid fields' }, { status: 400 });

  await db.update(userTable).set({ ...patch, updatedAt: new Date() }).where(eq(userTable.id, u.id));
  return NextResponse.json({ ok: true });
}

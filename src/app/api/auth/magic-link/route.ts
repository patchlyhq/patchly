import { createMagicToken, sendMagicLink } from '@/lib/auth';
import { NextResponse } from 'next/server';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const email: string = body?.email?.trim().toLowerCase() ?? '';

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
  }

  const token = await createMagicToken(email);
  await sendMagicLink(email, token);

  return NextResponse.json({ ok: true });
}

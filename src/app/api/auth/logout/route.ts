import { cookies } from 'next/headers';
import { deleteSession, clearSessionCookie, COOKIE_NAME } from '@/lib/session';
import { NextResponse } from 'next/server';

export async function POST() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(COOKIE_NAME)?.value;
  if (sessionId) {
    await deleteSession(sessionId);
  }

  const response = NextResponse.redirect(
    new URL('/login', process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3030'),
  );
  clearSessionCookie(response);
  return response;
}

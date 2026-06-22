import { verifyMagicToken } from '@/lib/auth';
import { createSession, setSessionCookie } from '@/lib/session';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const token = url.searchParams.get('token') ?? '';

  const result = await verifyMagicToken(token);
  if (!result) {
    return NextResponse.redirect(new URL('/login?error=invalid', request.url));
  }

  const sessionId = await createSession(result.userId);
  const response = NextResponse.redirect(new URL('/dashboard', request.url));
  setSessionCookie(response, sessionId);
  return response;
}

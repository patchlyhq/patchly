import { type NextRequest, NextResponse } from 'next/server';

const COOKIE_NAME = 'patchly_session';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionId = request.cookies.get(COOKIE_NAME)?.value;

  if (pathname.startsWith('/dashboard') && !sessionId) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};

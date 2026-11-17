import { NextResponse, type NextRequest } from 'next/server';
import { isAuthorized, unauthorizedResponse } from '@/lib/api-guard';

/**
 * Site-wide password gate (Next.js 16 "proxy", formerly middleware).
 *
 * When APP_PASSWORD is set, every page and API call needs it: browsers show a
 * sign-in prompt once and then send the credentials on same-origin requests.
 * Scripts can use API_SECRET instead (x-api-key or Bearer). With no
 * APP_PASSWORD the site stays open, but AI routes still fail closed in
 * production (see lib/api-guard.ts), and each API route re-checks auth itself.
 */
export function proxy(request: NextRequest) {
  if (!process.env.APP_PASSWORD) return NextResponse.next();
  if (isAuthorized(request.headers)) return NextResponse.next();

  const res = unauthorizedResponse();
  // Pages get a plain-text body; the WWW-Authenticate header triggers the prompt.
  return request.nextUrl.pathname.startsWith('/api/')
    ? res
    : new NextResponse('Authentication required', {
        status: 401,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'WWW-Authenticate': res.headers.get('WWW-Authenticate') ?? 'Basic',
        },
      });
}

export const config = {
  matcher: [
    // Everything except static assets, image optimisation, metadata files and
    // the cron route (which has its own CRON_SECRET check).
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|api/cron|.*\\.(?:png|jpg|jpeg|gif|webp|avif|svg|ico|woff2?)$).*)',
  ],
};

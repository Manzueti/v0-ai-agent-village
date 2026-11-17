import { timingSafeEqual } from 'node:crypto';

/**
 * Access control for the app and its API routes.
 *
 * Environment variables (all optional in development):
 *   APP_PASSWORD  Password for the whole site. Browsers get a Basic Auth prompt
 *                 (any username) and then send it automatically on same-origin
 *                 fetches, so the UI keeps working once you have signed in.
 *   API_SECRET    Key for scripts and other servers: send it as
 *                 `x-api-key: <key>` or `Authorization: Bearer <key>`.
 *   CRON_SECRET   Vercel sends `Authorization: Bearer <CRON_SECRET>` to cron
 *                 routes; /api/cron accepts only that.
 *
 * In production, AI routes (which spend provider credits) refuse every request
 * until APP_PASSWORD or API_SECRET is set: fail closed, not open.
 */

const BASIC_REALM = 'CyberEmpire';
const MAX_BODY_BYTES = 32 * 1024;

const isProduction = () => process.env.NODE_ENV === 'production';
const appPassword = () => process.env.APP_PASSWORD || '';
const apiSecret = () => process.env.API_SECRET || '';

export const accessControlConfigured = () => !!(appPassword() || apiSecret());

/** Constant-time string comparison (avoids leaking the secret through timing). */
function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) {
    timingSafeEqual(ab, ab); // keep timing similar on length mismatch
    return false;
  }
  return timingSafeEqual(ab, bb);
}

/** True when the request carries a valid site password or API key. */
export function isAuthorized(headers: Headers): boolean {
  const password = appPassword();
  const secret = apiSecret();
  const auth = headers.get('authorization') || '';

  if (secret) {
    const key = headers.get('x-api-key') || (auth.startsWith('Bearer ') ? auth.slice(7) : '');
    if (key && safeEqual(key, secret)) return true;
  }
  if (password && auth.startsWith('Basic ')) {
    try {
      const decoded = Buffer.from(auth.slice(6), 'base64').toString('utf8');
      const pass = decoded.slice(decoded.indexOf(':') + 1);
      if (safeEqual(pass, password)) return true;
    } catch {
      return false;
    }
  }
  return false;
}

export function unauthorizedResponse(): Response {
  return new Response(JSON.stringify({ error: 'Authentication required' }), {
    status: 401,
    headers: {
      'Content-Type': 'application/json',
      'WWW-Authenticate': `Basic realm="${BASIC_REALM}", charset="UTF-8"`,
    },
  });
}

// ── Rate limiting ────────────────────────────────────────────────────────────
// In-memory fixed window per client IP. On serverless hosts each instance keeps
// its own counters, so treat this as a backstop; use Vercel Firewall rate-limit
// rules (or a shared store such as Upstash) for a hard global limit.

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

export const RATE_LIMITS = {
  ai: { limit: 20, windowMs: 10 * 60_000 }, // 20 AI calls per 10 minutes per IP
  standard: { limit: 120, windowMs: 60_000 }, // 120 calls per minute per IP
} as const;

export function clientIp(headers: Headers): string {
  return (
    headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    headers.get('x-real-ip') ||
    'unknown'
  );
}

function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  if (buckets.size > 5000) {
    for (const [k, b] of buckets) if (b.resetAt <= now) buckets.delete(k);
  }
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfter: 0 };
  }
  bucket.count += 1;
  return bucket.count > limit
    ? { ok: false, retryAfter: Math.ceil((bucket.resetAt - now) / 1000) }
    : { ok: true, retryAfter: 0 };
}

// ── Route wrapper ────────────────────────────────────────────────────────────

type GuardOptions = {
  /** Route calls an AI provider (costs money): stricter limit, fails closed in production. */
  ai?: boolean;
};

type Handler<R extends Request, C> = (request: R, context: C) => Response | Promise<Response>;

function json(status: number, body: object, extra: Record<string, string> = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...extra },
  });
}

/**
 * Wrap a route handler with auth, rate limiting and a body-size cap.
 * proxy.ts also gates the site, but the Next.js docs advise checking inside
 * each route as well, so a matcher change can never silently expose one.
 */
export function withApiGuard<R extends Request, C>(
  handler: Handler<R, C>,
  options: GuardOptions = {}
): Handler<R, C> {
  return async (request, context) => {
    const { headers } = request;

    if (accessControlConfigured()) {
      if (!isAuthorized(headers)) return unauthorizedResponse();
    } else if (options.ai && isProduction()) {
      return json(503, {
        error:
          'AI routes are disabled until access control is configured. Set APP_PASSWORD (and optionally API_SECRET) in the deployment environment.',
      });
    }

    const { limit, windowMs } = options.ai ? RATE_LIMITS.ai : RATE_LIMITS.standard;
    const scope = options.ai ? 'ai' : 'std';
    const rl = rateLimit(`${scope}:${clientIp(headers)}`, limit, windowMs);
    if (!rl.ok) {
      return json(429, { error: 'Too many requests. Try again later.' }, { 'Retry-After': String(rl.retryAfter) });
    }

    const length = Number(headers.get('content-length') || 0);
    if (length > MAX_BODY_BYTES) {
      return json(413, { error: `Request body too large (max ${MAX_BODY_BYTES / 1024} KB).` });
    }

    return handler(request, context);
  };
}

/** Guard for Vercel Cron: only `Authorization: Bearer $CRON_SECRET` is accepted. */
export function withCronGuard<R extends Request, C>(handler: Handler<R, C>): Handler<R, C> {
  return async (request, context) => {
    const secret = process.env.CRON_SECRET || '';
    if (!secret) {
      if (isProduction()) return json(503, { error: 'Set CRON_SECRET to enable the cron route.' });
      return handler(request, context);
    }
    const auth = request.headers.get('authorization') || '';
    if (!auth.startsWith('Bearer ') || !safeEqual(auth.slice(7), secret)) {
      return json(401, { error: 'Invalid cron secret' });
    }
    return handler(request, context);
  };
}

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { checkRateLimit } from '@/lib/rate-limit';
import { jsonError, HttpError } from '@/lib/http';
import { sanitizeEmail } from '@/lib/sanitize';

const schema = z.object({
  email: z.string().email(),
  consent: z.boolean().default(true)
});

export async function POST(request: Request) {
  try {
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      'unknown';

    const rate = checkRateLimit(`newsletter:${ip}`, { windowMs: 60_000, maxRequests: 10 });
    if (!rate.success) {
      throw new HttpError(429, 'Too many requests. Please retry shortly.');
    }

    const body = await request.json();
    const parsed = schema.parse(body);
    if (!parsed.consent) {
      throw new HttpError(400, 'Consent is required to subscribe.');
    }

    const email = sanitizeEmail(parsed.email);
    console.info(`[newsletter] subscription request: ${email}`);

    // TODO: Persist newsletter subscribers to dedicated table or email provider.
    return NextResponse.json({ ok: true, email });
  } catch (error) {
    return jsonError(error);
  }
}

import { Resend } from 'resend';
import { db } from './db';
import { magicTokens, users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { generateId } from './session';

const resend = new Resend(process.env.RESEND_API_KEY);
const TOKEN_DURATION_MS = 15 * 60 * 1000; // 15 minutes

export async function createMagicToken(email: string): Promise<string> {
  const id = generateId(64);
  const expiresAt = new Date(Date.now() + TOKEN_DURATION_MS);
  await db.insert(magicTokens).values({ id, email, expiresAt });
  return id;
}

export async function sendMagicLink(email: string, token: string): Promise<void> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3030';
  const url = `${appUrl}/api/auth/verify?token=${token}`;

  await resend.emails.send({
    from: 'Patchly <noreply@dawit.dev>',
    to: email,
    subject: 'Sign in to Patchly',
    html: `
      <div style="font-family:system-ui,sans-serif;max-width:420px;margin:0 auto;padding:40px 24px">
        <h2 style="font-size:20px;font-weight:700;color:#000;margin:0 0 8px">Sign in to Patchly</h2>
        <p style="font-size:14px;color:#666;margin:0 0 24px">Click the button below to sign in. This link expires in 15 minutes.</p>
        <a href="${url}" style="display:inline-block;background:#000;color:#fff;text-decoration:none;font-size:14px;font-weight:600;padding:12px 24px;border-radius:10px">Sign in</a>
        <p style="font-size:12px;color:#999;margin:24px 0 0">If you didn't request this, you can ignore this email.</p>
      </div>
    `,
  });
}

export async function verifyMagicToken(
  token: string,
): Promise<{ email: string; userId: string } | null> {
  const result = await db
    .select()
    .from(magicTokens)
    .where(eq(magicTokens.id, token))
    .limit(1);

  const record = result[0];
  if (!record) return null;
  if (record.expiresAt < new Date()) {
    await db.delete(magicTokens).where(eq(magicTokens.id, token));
    return null;
  }

  await db.delete(magicTokens).where(eq(magicTokens.id, token));

  const existing = await db
    .select()
    .from(users)
    .where(eq(users.email, record.email))
    .limit(1);

  let userId: string;
  if (existing[0]) {
    userId = existing[0].id;
  } else {
    const [newUser] = await db
      .insert(users)
      .values({ email: record.email })
      .returning({ id: users.id });
    userId = newUser.id;
  }

  return { email: record.email, userId };
}

import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { magicLink } from 'better-auth/plugins';
import { Resend } from 'resend';
import { db } from '@/lib/db';
import * as schema from '@/db/schema';

const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL ?? 'http://localhost:3030',
  secret: process.env.BETTER_AUTH_SECRET!,
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    },
  }),
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  plugins: [
    magicLink({
      expiresIn: 900,
      sendMagicLink: async ({ email, url }) => {
        await resend.emails.send({
          from: 'Patchly <noreply@dawit.dev>',
          to: email,
          subject: 'Sign in to Patchly',
          html: `
            <div style="font-family:system-ui,sans-serif;max-width:420px;margin:0 auto;padding:40px 24px">
              <h2 style="font-size:20px;font-weight:700;color:#000;margin:0 0 8px">Sign in to Patchly</h2>
              <p style="font-size:14px;color:#666;margin:0 0 24px">Click the button below to sign in. This link expires in 15 minutes.</p>
              <a href="${url}" style="display:inline-block;background:#000;color:#fff;text-decoration:none;font-size:14px;font-weight:600;padding:12px 24px;border-radius:10px">Sign in</a>
              <p style="font-size:12px;color:#999;margin:24px 0 0">If you didn't request this, you can safely ignore this email.</p>
            </div>
          `,
        });
      },
    }),
  ],
});

import { readFileSync } from 'node:fs';
import type { Config } from 'drizzle-kit';

// drizzle-kit doesn't load .env.local automatically
try {
  const env = readFileSync('.env.local', 'utf-8');
  for (const line of env.split('\n')) {
    const [key, ...rest] = line.split('=');
    if (key && rest.length) process.env[key.trim()] ??= rest.join('=').trim();
  }
} catch {}

export default {
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
} satisfies Config;

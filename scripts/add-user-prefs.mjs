import { readFileSync } from 'node:fs';
import { neon } from '@neondatabase/serverless';

const env = readFileSync('.env.local', 'utf8');
for (const line of env.split('\n')) {
  const [key, ...vals] = line.split('=');
  if (key && vals.length) process.env[key.trim()] = vals.join('=').trim();
}

const sql = neon(process.env.DATABASE_URL);

await sql`ALTER TABLE "user" ADD COLUMN IF NOT EXISTS notify_on_subscriber boolean NOT NULL DEFAULT true`;
console.log('notify_on_subscriber column added');

await sql`ALTER TABLE "user" ADD COLUMN IF NOT EXISTS weekly_digest boolean NOT NULL DEFAULT false`;
console.log('weekly_digest column added');

await sql`
  CREATE TABLE IF NOT EXISTS notification_logs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    entry_id uuid REFERENCES entries(id) ON DELETE SET NULL,
    entry_title text NOT NULL,
    version text,
    recipient_count int NOT NULL DEFAULT 0,
    sent_at timestamptz NOT NULL DEFAULT now()
  )
`;
console.log('notification_logs table created');

await sql`
  CREATE INDEX IF NOT EXISTS notification_logs_project_sent_idx
  ON notification_logs (project_id, sent_at DESC)
`;
console.log('notification_logs index on (project_id, sent_at DESC) created');

console.log('Migration complete');

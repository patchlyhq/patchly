import { readFileSync } from 'node:fs';
import { neon } from '@neondatabase/serverless';

const env = readFileSync('.env.local', 'utf8');
for (const line of env.split('\n')) {
  const [key, ...vals] = line.split('=');
  if (key && vals.length) process.env[key.trim()] = vals.join('=').trim();
}

const sql = neon(process.env.DATABASE_URL);

await sql`
  CREATE TABLE IF NOT EXISTS page_views (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    entry_id uuid REFERENCES entries(id) ON DELETE SET NULL,
    created_at timestamp DEFAULT now() NOT NULL
  )
`;
console.log('page_views table created');

await sql`
  CREATE INDEX IF NOT EXISTS page_views_project_created_idx
  ON page_views (project_id, created_at)
`;
console.log('page_views index on (project_id, created_at) created');

console.log('Migration complete');

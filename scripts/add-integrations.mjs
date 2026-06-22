import { readFileSync } from 'node:fs';
import { neon } from '@neondatabase/serverless';

const env = readFileSync('.env.local', 'utf8');
for (const line of env.split('\n')) {
  const [key, ...vals] = line.split('=');
  if (key && vals.length) process.env[key.trim()] = vals.join('=').trim();
}

const sql = neon(process.env.DATABASE_URL);

await sql`ALTER TABLE entries ADD COLUMN IF NOT EXISTS source_id text`;
console.log('entries.source_id added');

await sql`
  CREATE UNIQUE INDEX IF NOT EXISTS entries_project_source_idx
  ON entries (project_id, source_id)
  WHERE source_id IS NOT NULL
`;
console.log('entries unique index on (project_id, source_id) created');

await sql`
  CREATE TABLE IF NOT EXISTS integrations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    provider text NOT NULL,
    config jsonb NOT NULL,
    created_at timestamp DEFAULT now() NOT NULL
  )
`;
console.log('integrations table created');

await sql`
  CREATE UNIQUE INDEX IF NOT EXISTS integrations_project_provider_idx
  ON integrations (project_id, provider)
`;
console.log('integrations unique index on (project_id, provider) created');

console.log('Migration complete');

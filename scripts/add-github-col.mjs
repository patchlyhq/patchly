import { readFileSync } from 'node:fs';
import { neon } from '@neondatabase/serverless';

// Load env
const env = readFileSync('.env.local', 'utf8');
for (const line of env.split('\n')) {
  const [key, ...vals] = line.split('=');
  if (key && vals.length) process.env[key.trim()] = vals.join('=').trim();
}

const sql = neon(process.env.DATABASE_URL);

// Drop old hand-rolled tables (if they exist)
await sql`DROP TABLE IF EXISTS magic_tokens CASCADE`;
await sql`DROP TABLE IF EXISTS sessions CASCADE`;
await sql`DROP TABLE IF EXISTS users CASCADE`;
console.log('Dropped old tables (if any)');

// Create Better Auth tables
await sql`
  CREATE TABLE IF NOT EXISTS "user" (
    "id" text PRIMARY KEY NOT NULL,
    "name" text NOT NULL,
    "email" text NOT NULL,
    "email_verified" boolean DEFAULT false NOT NULL,
    "image" text,
    "created_at" timestamp DEFAULT now() NOT NULL,
    "updated_at" timestamp DEFAULT now() NOT NULL,
    CONSTRAINT "user_email_unique" UNIQUE("email")
  )
`;
await sql`
  CREATE TABLE IF NOT EXISTS "session" (
    "id" text PRIMARY KEY NOT NULL,
    "user_id" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
    "token" text NOT NULL,
    "expires_at" timestamp NOT NULL,
    "ip_address" text,
    "user_agent" text,
    "created_at" timestamp DEFAULT now() NOT NULL,
    "updated_at" timestamp DEFAULT now() NOT NULL,
    CONSTRAINT "session_token_unique" UNIQUE("token")
  )
`;
await sql`
  CREATE TABLE IF NOT EXISTS "account" (
    "id" text PRIMARY KEY NOT NULL,
    "user_id" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
    "account_id" text NOT NULL,
    "provider_id" text NOT NULL,
    "access_token" text,
    "refresh_token" text,
    "access_token_expires_at" timestamp,
    "refresh_token_expires_at" timestamp,
    "scope" text,
    "id_token" text,
    "password" text,
    "created_at" timestamp DEFAULT now() NOT NULL,
    "updated_at" timestamp DEFAULT now() NOT NULL
  )
`;
await sql`
  CREATE TABLE IF NOT EXISTS "verification" (
    "id" text PRIMARY KEY NOT NULL,
    "identifier" text NOT NULL,
    "value" text NOT NULL,
    "expires_at" timestamp NOT NULL,
    "created_at" timestamp DEFAULT now(),
    "updated_at" timestamp DEFAULT now()
  )
`;
await sql`
  CREATE TABLE IF NOT EXISTS "projects" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "user_id" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
    "name" text NOT NULL,
    "slug" text NOT NULL,
    "description" text,
    "created_at" timestamp DEFAULT now() NOT NULL,
    CONSTRAINT "projects_slug_unique" UNIQUE("slug")
  )
`;
await sql`
  CREATE TABLE IF NOT EXISTS "entries" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "project_id" uuid NOT NULL REFERENCES "projects"("id") ON DELETE CASCADE,
    "title" text NOT NULL,
    "version" text,
    "tag" text DEFAULT 'release' NOT NULL,
    "content" text DEFAULT '' NOT NULL,
    "published" boolean DEFAULT false NOT NULL,
    "published_at" timestamp,
    "created_at" timestamp DEFAULT now() NOT NULL,
    "updated_at" timestamp DEFAULT now() NOT NULL
  )
`;
await sql`
  CREATE TABLE IF NOT EXISTS "subscribers" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "project_id" uuid NOT NULL REFERENCES "projects"("id") ON DELETE CASCADE,
    "email" text NOT NULL,
    "source" text DEFAULT 'widget' NOT NULL,
    "unsubscribed_at" timestamp,
    "created_at" timestamp DEFAULT now() NOT NULL
  )
`;
await sql`CREATE UNIQUE INDEX IF NOT EXISTS "subscribers_project_email_idx" ON "subscribers" ("project_id", "email")`;

console.log('Migration complete — all Better Auth tables created');

// Additional migration
await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS github_webhook_secret text`;
console.log('github_webhook_secret column added');

// OAuth columns
await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS github_repo_owner text`;
await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS github_repo_name text`;
await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS github_access_token text`;
await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS github_webhook_id text`;
console.log('github OAuth columns added');

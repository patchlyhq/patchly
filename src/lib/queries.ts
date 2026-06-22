import { headers } from 'next/headers';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';
import { projects, entries, subscribers } from '@/db/schema';
import { eq, and, desc } from 'drizzle-orm';

export type CurrentUser = {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
};

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const h = await headers();
  const session = await auth.api.getSession({ headers: h });
  if (!session?.user) return null;
  return {
    id: session.user.id,
    name: session.user.name ?? null,
    email: session.user.email,
    image: session.user.image ?? null,
  };
}

export async function getProjects(userId: string) {
  return db
    .select()
    .from(projects)
    .where(eq(projects.userId, userId))
    .orderBy(projects.createdAt);
}

export async function getProject(slug: string, userId: string) {
  const rows = await db
    .select()
    .from(projects)
    .where(and(eq(projects.slug, slug), eq(projects.userId, userId)))
    .limit(1);
  return rows[0] ?? null;
}

export async function getProjectEntries(projectId: string) {
  return db
    .select()
    .from(entries)
    .where(eq(entries.projectId, projectId))
    .orderBy(desc(entries.createdAt));
}

export type SubscriberWithProject = typeof subscribers.$inferSelect & {
  projectName: string;
};

export async function getSubscribers(userId: string): Promise<SubscriberWithProject[]> {
  const rows = await db
    .select({
      id: subscribers.id,
      projectId: subscribers.projectId,
      email: subscribers.email,
      source: subscribers.source,
      unsubscribedAt: subscribers.unsubscribedAt,
      createdAt: subscribers.createdAt,
      projectName: projects.name,
    })
    .from(subscribers)
    .innerJoin(projects, eq(subscribers.projectId, projects.id))
    .where(eq(projects.userId, userId))
    .orderBy(desc(subscribers.createdAt));
  return rows;
}

export type SubscriberStats = {
  total: number;
  active: number;
  thisMonth: number;
};

export type ProjectWithSecret = {
  id: string;
  slug: string;
  name: string;
  githubWebhookSecret: string | null;
  githubRepoOwner: string | null;
  githubRepoName: string | null;
};

export async function getProjectsWithSecrets(userId: string): Promise<ProjectWithSecret[]> {
  return db
    .select({
      id: projects.id,
      slug: projects.slug,
      name: projects.name,
      githubWebhookSecret: projects.githubWebhookSecret,
      githubRepoOwner: projects.githubRepoOwner,
      githubRepoName: projects.githubRepoName,
    })
    .from(projects)
    .where(eq(projects.userId, userId));
}

export async function getSubscriberStats(userId: string): Promise<SubscriberStats> {
  const rows = await getSubscribers(userId);
  const now = new Date();
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  return {
    total: rows.length,
    active: rows.filter((s) => !s.unsubscribedAt).length,
    thisMonth: rows.filter((s) => new Date(s.createdAt) >= thisMonthStart).length,
  };
}

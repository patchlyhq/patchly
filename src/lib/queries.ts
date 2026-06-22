import { headers } from 'next/headers';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';
import { projects, entries, subscribers, integrations, pageViews, notificationLogs, user } from '@/db/schema';
import { eq, and, desc, sql, count } from 'drizzle-orm';

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

export type ProjectIntegration = {
  projectId: string;
  provider: string;
  config: unknown;
};

export async function getProjectIntegrations(userId: string): Promise<ProjectIntegration[]> {
  const rows = await db
    .select({
      projectId: integrations.projectId,
      provider: integrations.provider,
      config: integrations.config,
    })
    .from(integrations)
    .innerJoin(projects, eq(integrations.projectId, projects.id))
    .where(eq(projects.userId, userId));
  return rows;
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

export type AnalyticsStats = {
  totalViews: number;
  daily: { date: string; count: number }[];
};

export type UserSettings = { notifyOnSubscriber: boolean; weeklyDigest: boolean };

export async function getUserSettings(userId: string): Promise<UserSettings> {
  const rows = await db.select({ notifyOnSubscriber: user.notifyOnSubscriber, weeklyDigest: user.weeklyDigest }).from(user).where(eq(user.id, userId)).limit(1);
  return rows[0] ?? { notifyOnSubscriber: true, weeklyDigest: false };
}

export type NotificationLogRow = {
  id: string;
  entryTitle: string;
  version: string | null;
  projectName: string;
  recipientCount: number;
  sentAt: Date;
};

export async function getNotificationLogs(userId: string): Promise<NotificationLogRow[]> {
  const rows = await db
    .select({
      id: notificationLogs.id,
      entryTitle: notificationLogs.entryTitle,
      version: notificationLogs.version,
      projectName: projects.name,
      recipientCount: notificationLogs.recipientCount,
      sentAt: notificationLogs.sentAt,
    })
    .from(notificationLogs)
    .innerJoin(projects, eq(notificationLogs.projectId, projects.id))
    .where(eq(projects.userId, userId))
    .orderBy(desc(notificationLogs.sentAt))
    .limit(100);
  return rows;
}

export async function getAnalyticsStats(userId: string): Promise<AnalyticsStats> {
  const totalRows = await db
    .select({ count: count() })
    .from(pageViews)
    .innerJoin(projects, eq(pageViews.projectId, projects.id))
    .where(eq(projects.userId, userId));

  const dailyRows = await db
    .select({
      date: sql<string>`date_trunc('day', ${pageViews.createdAt})::date::text`,
      count: count(),
    })
    .from(pageViews)
    .innerJoin(projects, eq(pageViews.projectId, projects.id))
    .where(eq(projects.userId, userId))
    .groupBy(sql`date_trunc('day', ${pageViews.createdAt})`)
    .orderBy(sql`date_trunc('day', ${pageViews.createdAt})`);

  return {
    totalViews: totalRows[0]?.count ?? 0,
    daily: dailyRows,
  };
}

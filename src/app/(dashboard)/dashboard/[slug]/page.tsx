import { redirect, notFound } from 'next/navigation';
import { getCurrentUser, getProject, getProjectEntries } from '@/lib/queries';
import { EntriesClient } from './entries-client';

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const project = await getProject(slug, user.id);
  if (!project) notFound();

  const entries = await getProjectEntries(project.id);

  return <EntriesClient project={project} initialEntries={entries} />;
}

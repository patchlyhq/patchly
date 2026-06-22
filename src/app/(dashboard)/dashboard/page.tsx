import { redirect } from 'next/navigation';
import { getCurrentUser, getProjects } from '@/lib/queries';
import { ProjectsClient } from './projects-client';

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  const projects = await getProjects(user.id);
  return (
    <div className="max-w-3xl">
      <ProjectsClient initialProjects={projects} />
    </div>
  );
}

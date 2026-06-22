import { redirect } from 'next/navigation';
import { getCurrentUser, getProjects } from '@/lib/queries';
import { SettingsClient } from './settings-client';

export default async function SettingsPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  const projects = await getProjects(user.id);
  return <SettingsClient projects={projects} />;
}

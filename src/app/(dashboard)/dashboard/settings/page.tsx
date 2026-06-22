import { redirect } from 'next/navigation';
import { getCurrentUser, getProjects, getUserSettings } from '@/lib/queries';
import { SettingsClient } from './settings-client';

export default async function SettingsPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  const [projects, settings] = await Promise.all([getProjects(user.id), getUserSettings(user.id)]);
  return <SettingsClient projects={projects} initialSettings={settings} />;
}

import { redirect } from 'next/navigation';
import { getCurrentUser, getProjectsWithSecrets } from '@/lib/queries';
import { IntegrationsClient } from './integrations-client';

export default async function IntegrationsPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const projects = await getProjectsWithSecrets(user.id);

  return (
    <div className="max-w-3xl space-y-10">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text)]">Integrations</h1>
        <p className="mt-1 text-sm text-[var(--color-muted)]">Connect Patchly to your existing tools.</p>
      </div>
      <IntegrationsClient projects={projects} />
    </div>
  );
}

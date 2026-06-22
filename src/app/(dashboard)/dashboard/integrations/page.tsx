import { redirect } from 'next/navigation';
import { getCurrentUser, getProjectsWithSecrets, getProjectIntegrations } from '@/lib/queries';
import { IntegrationsClient } from './integrations-client';

export default async function IntegrationsPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const [projectsData, integrationsData] = await Promise.all([
    getProjectsWithSecrets(user.id),
    getProjectIntegrations(user.id),
  ]);

  return (
    <div className="max-w-3xl space-y-10">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text)]">Integrations</h1>
        <p className="mt-1 text-sm text-[var(--color-muted)]">Connect Patchly to your existing tools.</p>
      </div>
      <IntegrationsClient projects={projectsData} integrations={integrationsData} />
    </div>
  );
}

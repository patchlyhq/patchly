import { redirect } from 'next/navigation';
import { getCurrentUser, getSubscribers, getSubscriberStats } from '@/lib/queries';
import { SubscribersClient } from './subscribers-client';

export default async function SubscribersPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const [subscribers, stats] = await Promise.all([
    getSubscribers(user.id),
    getSubscriberStats(user.id),
  ]);

  return (
    <div className="max-w-4xl">
      <SubscribersClient initialSubscribers={subscribers} stats={stats} />
    </div>
  );
}

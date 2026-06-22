import { auth } from './auth';
import type { User } from '@/db/schema';

export async function getUser(request: Request): Promise<User | null> {
  const session = await auth.api.getSession({ headers: request.headers });
  return (session?.user as User) ?? null;
}

'use client';
import { useEffect, useState } from 'react';

interface CurrentUser {
  id: string;
  email: string;
  name: string | null;
}

let cache: CurrentUser | null = null;

export function useCurrentUser() {
  const [user, setUser] = useState<CurrentUser | null>(cache);

  useEffect(() => {
    if (cache) return;
    fetch('/api/me')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        cache = data;
        setUser(data);
      });
  }, []);

  return user;
}

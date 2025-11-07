"use client";

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Session } from '@supabase/supabase-js';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';

export function HeaderActions({ initialSession }: { initialSession: Session | null }) {
  const hasSupabaseEnv = useMemo(() => {
    return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  }, []);
  const [supabase] = useState(() => (hasSupabaseEnv ? createClientComponentClient() : null));
  const [session, setSession] = useState<Session | null>(hasSupabaseEnv ? initialSession : null);
  const router = useRouter();

  useEffect(() => {
    if (!supabase) return;

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      router.refresh();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router, supabase]);

  const handleSignOut = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    router.refresh();
  };

  if (!hasSupabaseEnv) {
    return (
      <Button size="sm" disabled>
        Configura Supabase
      </Button>
    );
  }

  if (!session) {
    return (
      <Button asChild size="sm">
        <Link href="/login">Entrar</Link>
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button asChild size="sm">
        <Link href="/app">Tu recetario</Link>
      </Button>
      <Button variant="ghost" size="sm" onClick={handleSignOut}>
        Cerrar sesión
      </Button>
    </div>
  );
}

import type { Metadata } from 'next';

import { LoginForm } from '@/components/auth/login-form';

export const metadata: Metadata = {
  title: 'Iniciar sesión'
};

export default function LoginPage({
  searchParams
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const rawError = searchParams?.error;
  const errorValue = Array.isArray(rawError) ? rawError[0] : rawError;
  const initialStatus = errorValue ? 'error' : 'idle';
  let initialMessage: string | undefined;
  if (errorValue) {
    initialMessage =
      errorValue === 'supabase'
        ? 'Configura Supabase antes de iniciar sesión.'
        : 'No se pudo iniciar sesión. Intenta de nuevo.';
  }

  return (
    <div className="container max-w-3xl space-y-8 py-16">
      <div className="space-y-3 text-center">
        <h1 className="text-3xl font-semibold text-neutral-900">Accede a tu Tastebook</h1>
        <p className="text-sm text-neutral-600">
          Inicia sesión para guardar recetas y sincronizarlas con Supabase. Usa tu correo o GitHub.
        </p>
      </div>
      <LoginForm initialStatus={initialStatus} initialMessage={initialMessage} />
    </div>
  );
}

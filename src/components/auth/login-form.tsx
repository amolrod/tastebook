"use client";

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Loader2 } from 'lucide-react';
import { useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

type LoginFormProps = {
  initialStatus?: 'idle' | 'loading' | 'success' | 'error';
  initialMessage?: string;
};

export function LoginForm({ initialStatus = 'idle', initialMessage }: LoginFormProps) {
  const hasSupabaseEnv = useMemo(() => {
    return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  }, []);
  const supabase = useMemo(() => (hasSupabaseEnv ? createClientComponentClient() : null), [hasSupabaseEnv]);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>(initialStatus);
  const [message, setMessage] = useState<string | null>(initialMessage ?? null);

  const handleMagicLink = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!supabase) {
      setStatus('error');
      setMessage('Configura Supabase antes de iniciar sesión.');
      return;
    }
    setStatus('loading');
    setMessage(null);
    try {
      const origin = window.location.origin;
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${origin}/auth/callback`
        }
      });
      if (error) {
        throw error;
      }
      setStatus('success');
      setMessage('Revisa tu correo. Te enviamos un enlace mágico para entrar.');
    } catch (error) {
      setStatus('error');
      if (error instanceof Error) {
        setMessage(error.message);
      } else {
        setMessage('No se pudo enviar el enlace mágico. Intenta de nuevo.');
      }
    }
  };

  const handleGitHub = async () => {
    setStatus('loading');
    setMessage(null);
    if (!supabase) {
      setStatus('error');
      setMessage('Configura Supabase antes de iniciar sesión.');
      return;
    }
    try {
      const origin = window.location.origin;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${origin}/auth/callback`
        }
      });
      if (error) {
        throw error;
      }
      setStatus('success');
      setMessage('Redirigiendo a GitHub…');
    } catch (error) {
      setStatus('error');
      if (error instanceof Error) {
        setMessage(error.message);
      } else {
        setMessage('No se pudo iniciar sesión con GitHub.');
      }
    }
  };

  return (
    <div className="mx-auto max-w-md space-y-6">
      {!hasSupabaseEnv && (
        <p className="rounded-2xl border border-dashed border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Añade las variables NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY en `.env.local` para habilitar el login.
        </p>
      )}
      <form onSubmit={handleMagicLink} className="space-y-4 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        <div className="space-y-2">
          <Label htmlFor="email">Correo electrónico</Label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="tu-email@example.com"
            required
            className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          />
          <p className="text-xs text-neutral-500">Enviamos un enlace mágico para autenticarte sin contraseñas.</p>
        </div>
  <Button type="submit" size="md" className="w-full" disabled={status === 'loading' || !hasSupabaseEnv}>
          {status === 'loading' ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : 'Enviar enlace mágico'}
        </Button>
      </form>
      <div className="space-y-3 rounded-2xl border border-neutral-200 bg-white p-6 text-center shadow-sm">
        <p className="text-sm text-neutral-600">Prefieres OAuth?</p>
  <Button type="button" variant="outline" size="md" className="w-full" onClick={handleGitHub} disabled={status === 'loading' || !hasSupabaseEnv}>
          {status === 'loading' ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : 'Continuar con GitHub'}
        </Button>
      </div>
      {message && (
        <p className={`text-sm ${status === 'error' ? 'text-red-600' : 'text-green-700'}`}>{message}</p>
      )}
    </div>
  );
}

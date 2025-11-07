import type { Metadata, Viewport } from 'next';
import { cookies } from 'next/headers';
import type { Session } from '@supabase/supabase-js';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { Inter } from 'next/font/google';
import { ReactNode } from 'react';
import './globals.css';
import { AppProviders } from '@/components/providers/app-providers';
import { cn } from '@/lib/utils/cn';
import { HeaderActions } from '@/components/layout/header-actions';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    template: '%s | Tastebook',
    default: 'Tastebook'
  },
  description:
    'Recetario colaborativo con PWA instalable y extracción inteligente al pegar recetas de texto.',
  manifest: '/manifest.json',
  applicationName: 'Tastebook',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Tastebook'
  },
  icons: {
    icon: [
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' }
    ],
    apple: [{ url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
    shortcut: ['/icons/icon-192.png']
  },
  other: {
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default'
  }
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#f97316'
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  let session: Session | null = null;
  const hasSupabaseEnv = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  if (hasSupabaseEnv) {
    const supabase = createServerComponentClient({ cookies });
    const {
      data: { session: currentSession }
    } = await supabase.auth.getSession();
    session = currentSession;
  }

  return (
    <html lang="es" className="h-full">
      <body className={cn('min-h-screen bg-neutral-100', inter.className)}>
        <AppProviders>
          <div className="flex min-h-screen flex-col">
            <header className="border-b bg-white/80 backdrop-blur">
              <div className="container flex items-center justify-between py-4">
                <div className="flex flex-col">
                  <span className="text-sm font-semibold uppercase tracking-wide text-amber-600">
                    Tastebook
                  </span>
                  <span className="text-sm text-neutral-600">
                    Tu recetario inteligente, instalable y colaborativo
                  </span>
                </div>
                <HeaderActions initialSession={session} />
              </div>
            </header>
            <main className="flex-1">{children}</main>
            <footer className="border-t bg-white/60 text-sm text-neutral-600">
              <div className="container flex flex-col gap-2 py-6 md:flex-row md:items-center md:justify-between">
                <p>© {new Date().getFullYear()} Tastebook. Todas las recetas en tu bolsillo.</p>
                <p>
                  <a className="hocus:text-brand" href="/docs/pwa-ios" rel="noreferrer">
                    Guía iOS PWA
                  </a>
                </p>
              </div>
            </footer>
          </div>
        </AppProviders>
      </body>
    </html>
  );
}

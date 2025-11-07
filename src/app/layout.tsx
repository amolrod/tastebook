import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { ReactNode } from 'react';
import './globals.css';
import { AppProviders } from '@/components/providers/app-providers';
import { cn } from '@/lib/utils/cn';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    template: '%s | Tastebook',
    default: 'Tastebook'
  },
  description:
    'Recetario colaborativo con PWA instalable y extracción inteligente al pegar recetas de texto.',
  manifest: '/manifest.json',
  themeColor: '#f97316',
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
  viewportFit: 'cover'
};

export default function RootLayout({ children }: { children: ReactNode }) {
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
                <a
                  className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                  href="/app"
                >
                  Entrar
                </a>
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

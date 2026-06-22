import type { Metadata } from 'next';
import { Archivo, Geist_Mono } from 'next/font/google';
import { CookieBanner } from '@/components/ui/cookie-banner';
import { Toaster } from 'sonner';
import './globals.css';

const archivo = Archivo({
  variable: '--font-archivo',
  weight: ['400', '500', '700', '800', '900'],
  subsets: ['latin'],
});
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Patchly — Beautiful changelogs for your product',
  description:
    'Ship changelogs your users actually read. Embedded glass widget included.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${archivo.variable} ${geistMono.variable}`}>
      <body className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] antialiased">
        {children}
        <CookieBanner />
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: 'white',
              border: '1px solid rgba(0,0,0,0.1)',
              color: 'oklch(10% 0 0)',
              borderRadius: '12px',
              fontSize: '13px',
            },
          }}
        />
      </body>
    </html>
  );
}

import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { Inter, JetBrains_Mono } from 'next/font/google';
import { FirebaseClientProvider } from '@/firebase';
import { FloatingAssistant } from '@/components/layout/floating-assistant';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jetbrains',
});

/**
 * @fileOverview Metadata Unification Protocol.
 * Decoupled Viewport according to Next.js 15 strict production standards.
 * Ensures Zero-Waste hydration and eliminates "Not Found" metadata conflicts.
 */

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0a0a0a',
};

export const metadata: Metadata = {
  title: 'Digitiful | Beyond Digital',
  description: 'High-discipline digital systems and advanced AI integration. Redesigning core architectures with a Zero-Failure methodology.',
  icons: {
    icon: [
      { url: 'https://iili.io/qLWQrJt.md.png' },
      { url: '/favicon.ico', sizes: 'any' }
    ],
  },
  metadataBase: new URL('https://digitiful.net'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Digitiful | Beyond Digital',
    description: 'High-discipline digital engineering.',
    images: ['https://iili.io/qLWQrJt.md.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Digitiful | Beyond Digital',
    description: 'High-discipline engineering for the digital frontier.',
    images: ['https://iili.io/qLWQrJt.md.png'],
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-body antialiased" suppressHydrationWarning={true}>
        <FirebaseClientProvider>
          {children}
          <FloatingAssistant />
        </FirebaseClientProvider>
        <Toaster />
      </body>
    </html>
  );
}

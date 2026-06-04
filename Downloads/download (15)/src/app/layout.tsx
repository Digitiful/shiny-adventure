
import type {Metadata, Viewport} from 'next';
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
 * @fileOverview Root Layout Protocol.
 * Decouples viewport from metadata to align with Next.js 15 standards.
 * Identity: SAM // Digitiful // BEYOND DIGITAL
 */

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0a0a0a',
};

export const metadata: Metadata = {
  title: 'Digitiful | Beyond Digital',
  description: 'High-discipline digital systems and advanced AI integration. Redesigning core architectures with a Zero-Failure methodology.',
  keywords: ['Digital Engineering', 'AI Integration', 'Systems Architecture', 'Digitiful', 'SAM', 'Beyond Digital', 'Data Sovereignty'],
  authors: [{ name: 'SAM // Digitiful' }],
  robots: 'index, follow',
  openGraph: {
    title: 'Digitiful | Beyond Digital',
    description: 'Redesigning core business systems through deliberate engineering and technical precision.',
    url: 'https://digitiful.net',
    siteName: 'Digitiful',
    images: [
      {
        url: 'https://iili.io/qLWQrJt.md.png',
        width: 1200,
        height: 630,
        alt: 'Digitiful Signal Hub',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Digitiful | Beyond Digital',
    description: 'High-discipline engineering for the digital frontier.',
    images: ['https://iili.io/qLWQrJt.md.png'],
  },
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

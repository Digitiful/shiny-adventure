import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { Inter } from 'next/font/google';
import { FirebaseClientProvider } from '@/firebase';
import { FloatingAssistant } from '@/components/layout/floating-assistant';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Digitiful // Elite Digital Engineering & Technical Anomaly Vault',
  description: 'High-discipline digital systems engineering, decentralized protocols, and advanced AI integration. Redesigning core systems with a Zero-Failure methodology.',
  keywords: ['Digital Engineering', 'AI Integration', 'Systems Architecture', 'Alien Warehouse', 'Tech Bazaar', 'Digitiful'],
  authors: [{ name: 'Digitiful Engineering' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  openGraph: {
    title: 'Digitiful // Elite Digital Engineering',
    description: 'Redesigning core business systems through deliberate engineering and technical precision.',
    url: 'https://digitiful.net',
    siteName: 'Digitiful',
    images: [
      {
        url: 'https://digitiful.net/wp-content/uploads/2025/08/DG-04-scaled.png',
        width: 1200,
        height: 630,
        alt: 'Digitiful Digital Engineering',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${inter.variable}`}>
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

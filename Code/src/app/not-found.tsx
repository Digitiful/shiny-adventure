import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Terminal, ArrowLeft } from 'lucide-react';
import type { Metadata, Viewport } from 'next';

/**
 * @fileOverview Hardened Recovery Node.
 * Handles the "Signal Lost" state shown in telemetry.
 * Strictly separates metadata/viewport to prevent hydration errors.
 */

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0a0a0a',
};

export const metadata: Metadata = {
  title: 'Signal Lost | Digitiful',
  description: 'The requested node does not exist in the Digitiful Registry.',
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      
      <div className="relative z-10 space-y-6">
        <div className="flex justify-center">
          <div className="p-4 bg-primary/10 rounded-full border border-primary/20 animate-pulse">
            <Terminal className="h-12 w-12 text-primary" />
          </div>
        </div>
        
        <h1 className="text-4xl font-black italic text-foreground tracking-tighter uppercase">
          Signal Lost <span className="text-primary">//</span> 404
        </h1>
        
        <p className="text-muted-foreground text-sm uppercase tracking-widest max-w-md mx-auto leading-relaxed">
          " The requested node does not exist in the Digitiful Registry. "
        </p>
        
        <div className="pt-4">
          <Button asChild variant="outline" className="border-primary/20 hover:bg-primary/10 uppercase tracking-widest text-[10px] font-bold">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Return to Core
            </Link>
          </Button>
        </div>
      </div>

      <div className="absolute bottom-12 opacity-20 text-[8px] font-code uppercase tracking-[0.5em]">
        Node Alpha // Security Protocol 404
      </div>
    </div>
  );
}

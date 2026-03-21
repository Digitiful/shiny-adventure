
'use client';

import React from 'react';
import { HeaderLogo } from '@/components/layout/logo';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Terminal as TerminalIcon, ShieldCheck, Activity, Cpu, Box, Share2 } from 'lucide-react';
import Link from 'next/link';

/**
 * @fileOverview Digitiful Brand Specification Node.
 * Provides a high-density readout of the brand identity and operational rules.
 */
export default function SpecPage() {
  return (
    <div className="min-h-screen bg-black text-foreground font-code p-6 md:p-12 lg:p-20 flex flex-col items-center">
      {/* Background Effect */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.02] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      
      <div className="max-w-4xl w-full relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-16">
          <HeaderLogo />
          <Link href="/" className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors text-xs uppercase tracking-widest">
            <ArrowLeft className="h-4 w-4" />
            Terminate Link // Return
          </Link>
        </div>

        <div className="border border-primary/20 bg-neutral-900/40 backdrop-blur-md rounded-3xl p-8 md:p-12 shadow-2xl">
          <div className="flex items-center gap-3 mb-8">
            <TerminalIcon className="h-6 w-6 text-primary animate-pulse" />
            <h1 className="text-2xl font-black italic uppercase tracking-tighter">
              Brand Spec <span className="text-primary">//</span> Protocol v1.0
            </h1>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-10">
              <section className="space-y-4">
                <div className="flex items-center gap-2 text-primary">
                  <ShieldCheck className="h-4 w-4" />
                  <h2 className="text-sm font-bold uppercase tracking-[0.3em]">Core Identity</h2>
                </div>
                <div className="pl-6 border-l border-primary/20 space-y-4 text-xs leading-relaxed text-muted-foreground">
                  <p>"Digitiful is not an agency. It’s a signal hub. We don’t sell services. We transmit function."</p>
                  <p>Alien Warehouse serves as our proof of concept—a technical anomaly vault where systems are studied and reborn.</p>
                </div>
              </section>

              <section className="space-y-4">
                <div className="flex items-center gap-2 text-primary">
                  <Activity className="h-4 w-4" />
                  <h2 className="text-sm font-bold uppercase tracking-[0.3em]">Brand Pillars</h2>
                </div>
                <div className="pl-6 border-l border-primary/20 space-y-2 font-bold text-foreground italic">
                  <p>01 // DIGITAL NATIVE</p>
                  <p>02 // PRECISE ENGINEERING</p>
                  <p>03 // DELIBERATE EXECUTION</p>
                </div>
              </section>
            </div>

            <div className="space-y-10">
              <section className="space-y-4">
                <div className="flex items-center gap-2 text-primary">
                  <Cpu className="h-4 w-4" />
                  <h2 className="text-sm font-bold uppercase tracking-[0.3em]">Visual Protocol</h2>
                </div>
                <div className="pl-6 border-l border-primary/20 space-y-6">
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase mb-2">Palette</p>
                    <div className="flex gap-2">
                      <div className="h-8 w-8 rounded-full bg-[#8338EC] border border-white/10" title="Anomaly Purple" />
                      <div className="h-8 w-8 rounded-full bg-[#0a0a0a] border border-white/10" title="Void Black" />
                      <div className="h-8 w-8 rounded-full bg-[#22c55e] border border-white/10" title="Signal Green" />
                      <div className="h-8 w-8 rounded-full bg-[#3A86FE] border border-white/10" title="Cold Gray" />
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase mb-2">Typography</p>
                    <p className="text-xs font-sans font-bold">INTER // HEADLINES</p>
                    <p className="text-xs font-code mt-1">SPACE MONO // SYSTEM</p>
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <div className="flex items-center gap-2 text-primary">
                  <Box className="h-4 w-4" />
                  <h2 className="text-sm font-bold uppercase tracking-[0.3em]">Operational Rules</h2>
                </div>
                <ul className="pl-6 border-l border-primary/20 space-y-2 text-[10px] text-muted-foreground uppercase">
                  <li>— ZERO WASTE COST MANAGEMENT</li>
                  <li>— ENCRYPTED CLIENT NODES</li>
                  <li>— TIME IS THE REAL WASTE</li>
                  <li>— 3-LINE CLEARANCE MINIMUM</li>
                </ul>
              </section>
            </div>
          </div>

          <Separator className="my-12 bg-primary/10" />

          <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-muted-foreground">
             <div className="space-y-1">
                <p className="uppercase opacity-50">Core Engine</p>
                <p className="text-foreground font-bold italic">ANTIGRAVITY // VAULT ACTIVE</p>
             </div>
             <div className="space-y-1">
                <p className="uppercase opacity-50">Security Protocol</p>
                <p className="text-foreground font-bold italic">ANTIGRAVITY // SHIELD v2.0</p>
             </div>
          </div>

          <Separator className="my-12 bg-primary/10" />

          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="space-y-1">
              <p className="text-[9px] text-primary/60 uppercase">Document Status</p>
              <p className="text-xs font-bold text-foreground italic">LIVE // UNCLASSIFIED ACCESS</p>
            </div>
            <Button variant="outline" className="border-primary/20 hover:bg-primary/5 text-[10px] uppercase tracking-widest h-10 px-6">
              <Share2 className="h-3 w-3 mr-2" />
              Transmit Spec
            </Button>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-[9px] text-muted-foreground uppercase tracking-[0.5em] animate-pulse">
            SCANNING FOR NEXT SIGNAL... // SYSTEM READY.
          </p>
        </div>
      </div>
    </div>
  );
}

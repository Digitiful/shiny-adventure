'use client';

import React from 'react';
import { HeaderLogo } from '@/components/layout/logo';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Terminal as TerminalIcon, ShieldCheck, Activity, Cpu, Box, Share2, ExternalLink, Lock, Trash2, Zap } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

/**
 * @fileOverview Digitiful Brand Specification Node.
 * Provides a high-density readout of the brand identity and operational rules.
 * Identity: SAM // Digitiful
 */
export default function SpecPage() {
  const palette = ["#8338EC", "#BA89FF", "#22c55e", "#83B3FF", "#3A86FE"];
  const coolorsRef = "https://coolors.co/?ref=687039010cea43000bcda1eb";

  return (
    <div className="min-h-screen bg-black text-foreground font-code p-6 md:p-12 lg:p-20 flex flex-col items-center">
      {/* Background Effect */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.02] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      
      <div className="max-w-5xl w-full relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-16">
          <HeaderLogo />
          <Link href="/" className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors text-xs uppercase tracking-widest">
            <ArrowLeft className="h-4 w-4" />
            Terminate Link // Return
          </Link>
        </div>

        <div className="border border-primary/20 bg-neutral-900/40 backdrop-blur-md rounded-3xl p-8 md:p-12 shadow-2xl">
          <div className="flex items-center justify-between mb-12 border-b border-primary/10 pb-6">
            <div className="flex items-center gap-3">
              <TerminalIcon className="h-6 w-6 text-primary animate-pulse" />
              <h1 className="text-2xl font-black italic uppercase tracking-tighter">
                BRAND SPEC <span className="text-primary">//</span> DIGITIFUL v1.0
              </h1>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/30 rounded text-[10px] font-bold text-green-500 uppercase tracking-widest">
              [STATUS: ACTIVE]
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            {/* COLUMN 1: IDENTITY */}
            <div className="space-y-10">
              <section className="space-y-4">
                <div className="flex items-center gap-2 text-primary">
                  <ShieldCheck className="h-4 w-4" />
                  <h2 className="text-sm font-bold uppercase tracking-[0.3em]">Identity</h2>
                </div>
                <div className="pl-6 border-l border-primary/20 space-y-2 text-xs font-bold text-foreground italic uppercase leading-relaxed">
                  <p>Digitiful is not an agency.</p>
                  <p>It’s a signal hub.</p>
                  <p>We don’t sell services.</p>
                  <p>We transmit function.</p>
                </div>
              </section>
            </div>

            {/* COLUMN 2: CORE PROTOCOLS */}
            <div className="lg:col-span-2 space-y-10">
              <section className="space-y-6">
                <div className="flex items-center gap-2 text-primary">
                  <Activity className="h-4 w-4" />
                  <h2 className="text-sm font-bold uppercase tracking-[0.3em]">Core Protocols</h2>
                </div>
                
                <div className="grid md:grid-cols-1 gap-6 pl-6">
                  <div className="p-4 bg-primary/5 rounded-xl border border-primary/10 group hover:border-primary/40 transition-colors">
                    <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-1">Protocol // 01</p>
                    <p className="text-lg font-black italic text-foreground uppercase tracking-tight">Digital.</p>
                    <p className="text-xs text-muted-foreground mt-1 uppercase">Native engineering for the outer rims.</p>
                  </div>

                  <div className="p-4 bg-primary/5 rounded-xl border border-primary/10 group hover:border-primary/40 transition-colors">
                    <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-1">Protocol // 02</p>
                    <p className="text-lg font-black italic text-foreground uppercase tracking-tight">Precise.</p>
                    <p className="text-xs text-muted-foreground mt-1 uppercase">Absolute technical accuracy.</p>
                  </div>

                  <div className="p-4 bg-primary/5 rounded-xl border border-primary/10 group hover:border-primary/40 transition-colors">
                    <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-1">Protocol // 03</p>
                    <p className="text-lg font-black italic text-foreground uppercase tracking-tight">Deliberate.</p>
                    <p className="text-xs text-muted-foreground mt-1 uppercase">Zero-failure architecture.</p>
                  </div>
                </div>
              </section>
            </div>
          </div>

          <Separator className="my-12 bg-primary/10" />

          {/* VISUAL PROTOCOL & OPERATIONAL RULES */}
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <section className="space-y-6">
              <div className="flex items-center gap-2 text-primary">
                <Cpu className="h-4 w-4" />
                <h2 className="text-sm font-bold uppercase tracking-[0.3em]">Visual Protocol</h2>
              </div>
              <div className="pl-6 border-l border-primary/20 space-y-8">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black">Palette // Signal Set</p>
                    <a 
                      href={coolorsRef} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex items-center gap-2 grayscale hover:grayscale-0 transition-all opacity-70 hover:opacity-100"
                    >
                      <span className="text-[9px] font-bold uppercase tracking-tighter text-muted-foreground">WE USE</span>
                      <div className="relative h-3 w-16">
                        <Image 
                          src="https://coolors.co/assets/img/logo.svg" 
                          alt="Coolors" 
                          fill
                          className="object-contain object-left"
                        />
                      </div>
                    </a>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {palette.map((color) => (
                      <div key={color} className="group relative flex flex-col items-center">
                        <div 
                          className="h-10 w-10 rounded-full border border-white/10 shadow-lg transition-transform group-hover:scale-110" 
                          style={{ backgroundColor: color }} 
                          title={color}
                        />
                        <span className="mt-2 text-[8px] font-bold text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">{color}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase mb-2 tracking-widest font-black">Typography Protocol</p>
                  <div className="space-y-2">
                    <div className="flex items-baseline gap-4">
                      <span className="text-xs font-sans font-black uppercase tracking-tighter text-foreground">INTER</span>
                      <span className="text-[9px] text-primary/60">— HEADLINES</span>
                    </div>
                    <div className="flex items-baseline gap-4">
                      <span className="text-xs font-code font-black uppercase tracking-tighter text-foreground">SPACE MONO</span>
                      <span className="text-[9px] text-primary/60">— SYSTEM</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-center gap-2 text-primary">
                <Activity className="h-4 w-4" />
                <h2 className="text-sm font-bold uppercase tracking-[0.3em]">Operational Rules</h2>
              </div>
              <div className="pl-6 border-l border-primary/20 space-y-6">
                <div className="flex gap-4">
                  <Trash2 className="h-4 w-4 text-primary shrink-0 opacity-40" />
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-foreground uppercase tracking-widest">ZERO WASTE</p>
                    <p className="text-[9px] text-muted-foreground uppercase leading-relaxed">Cost, time, motion — all tracked.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Lock className="h-4 w-4 text-primary shrink-0 opacity-40" />
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-foreground uppercase tracking-widest">ENCRYPTED NODES</p>
                    <p className="text-[9px] text-muted-foreground uppercase leading-relaxed">Client data never exposed.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Zap className="h-4 w-4 text-primary shrink-0 opacity-40" />
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-foreground uppercase tracking-widest">TIME IS THE WASTE</p>
                    <p className="text-[9px] text-muted-foreground uppercase leading-relaxed">Speed is hygiene.</p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <Separator className="my-12 bg-primary/10" />

          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="space-y-1 text-center md:text-left">
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

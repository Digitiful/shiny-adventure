"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * @fileOverview Hero Section Node.
 * Identity: BEYOND DIGITAL // Atmospheric, high-discipline broadcast.
 * Optimized for full-screen Chiaroscuro immersion with kinetic life.
 */

export function Hero() {
  return (
    <section className="relative flex flex-col items-center justify-center min-h-screen bg-black overflow-hidden group/hero">
      {/* Background Artifact: Deep Space Signal with Kinetic Motion */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <Image
          src="https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=2072&auto=format&fit=crop"
          alt="Planet Earth from space"
          fill
          data-ai-hint="planet earth"
          className="object-cover opacity-40 grayscale animate-slow-zoom"
          priority
        />
      </div>
      
      {/* Visual Shield: High-Contrast Gradient Depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black z-10"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_95%)] z-10"></div>

      <div className="container mx-auto px-4 text-center z-20">
        <div className="flex flex-col items-center gap-8">
          {/* Node Badge */}
          <div className="flex items-center gap-4 animate-fade-in">
             <div className="h-px w-6 md:w-12 bg-primary/30" />
             <span className="text-[8px] md:text-[10px] font-code text-primary uppercase tracking-[0.6em] font-black">
               Mission // Protocol // 01
             </span>
             <div className="h-px w-6 md:w-12 bg-primary/30" />
          </div>
          
          {/* Master Signal Headline */}
          <div className="relative group cursor-default">
            <h1 className="font-headline text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter text-foreground uppercase italic leading-[0.85] transition-all duration-700 group-hover:tracking-tight animate-fade-in-up">
              Beyond <br/>
              <span className="text-primary animate-breathing drop-shadow-[0_0_20px_rgba(147,51,234,0.3)] group-hover:drop-shadow-[0_0_40px_rgba(147,51,234,0.6)] group-hover:text-white transition-all duration-500">
                Digital.
              </span>
            </h1>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/5 blur-[100px] rounded-full pointer-events-none -z-10 animate-pulse" />
          </div>
          
          {/* Master Architect Mission Statement */}
          <div className="space-y-4 animate-fade-in-up delay-300">
            <div className="max-w-2xl mx-auto">
                <p className="text-[10px] md:text-[13px] text-muted-foreground font-bold uppercase tracking-[0.3em] leading-relaxed italic">
                  " We don’t just adapt to the digital era—we architect it. "
                </p>
                <p className="mt-2 text-[8px] font-code text-foreground/20 uppercase tracking-[0.4em]">
                  Node Alpha // Broadcast Locked
                </p>
            </div>
          </div>
        </div>
      </div>

      {/* Side Status Indicators */}
      <div className="absolute left-8 bottom-12 hidden lg:flex flex-col gap-4 z-20">
         <div className="h-24 w-px bg-gradient-to-t from-primary/40 to-transparent" />
         <span className="text-[8px] font-code text-primary/40 uppercase tracking-[0.2em] [writing-mode:vertical-lr]">
           Signal: Stable
         </span>
      </div>
      
      <div className="absolute right-8 top-32 hidden lg:flex flex-col items-end gap-4 z-20">
         <span className="text-[8px] font-code text-primary/40 uppercase tracking-[0.2em] [writing-mode:vertical-lr]">
           Telemetry: Active
         </span>
         <div className="h-24 w-px bg-gradient-to-b from-primary/40 to-transparent" />
      </div>
    </section>
  );
}

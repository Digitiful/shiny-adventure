'use client';
import React from 'react';
import { cn } from '@/lib/utils';

const pillars = [
  { 
    label: "Digital", 
    desc: "We don’t adapt to the future—we build it.", 
    code: "01" 
  },
  { 
    label: "Precise", 
    desc: "Every calculation is a law, not a suggestion.", 
    code: "02" 
  },
  { 
    label: "Deliberate", 
    desc: "Just systems that work—exactly as designed.", 
    code: "03" 
  }
];

export function BrandPillars() {
  return (
    <section className="relative py-32 bg-black overflow-hidden border-y border-primary/10">
      {/* Ghost Background Text */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full opacity-[0.01] pointer-events-none font-headline text-[12rem] leading-none whitespace-nowrap select-none italic font-black text-primary text-center">
        PROTOCOL CORE
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-3 gap-12 md:gap-0 items-stretch">
          {pillars.map((pillar, index) => (
            <div 
              key={pillar.label} 
              className={cn(
                "group flex flex-col items-center text-center gap-8 font-mono py-12 md:px-8 transition-all duration-500",
                index !== pillars.length - 1 && "md:border-r md:border-primary/10"
              )}
            >
              {/* Hierarchy: Primary Label > Technical Code */}
              <div className="space-y-2">
                <div className="flex flex-col items-center gap-3">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                  <h3 className="text-3xl md:text-4xl font-black text-foreground uppercase italic tracking-tighter transition-all duration-500 group-hover:text-primary group-hover:scale-110">
                    {pillar.label}
                  </h3>
                </div>
                <p className="text-[10px] font-bold text-primary/40 uppercase tracking-[0.4em] transition-colors group-hover:text-primary">
                  PROTOCOL // {pillar.code}
                </p>
              </div>
              
              {/* Divider Node */}
              <div className="relative w-20">
                <div className="h-px w-full bg-primary/20" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-1.5 w-1.5 bg-primary/40 rounded-full scale-0 group-hover:scale-100 transition-transform duration-500 shadow-[0_0_10px_rgba(147,51,234,0.5)]" />
              </div>
              
              {/* Mission Parameter */}
              <p className="text-[11px] md:text-xs text-muted-foreground/60 italic leading-relaxed max-w-[240px] min-h-[3em] flex items-center uppercase tracking-[0.15em]">
                "{pillar.desc}"
              </p>
              
              {/* Telemetry Accents */}
              <div className="mt-4 flex flex-col items-center gap-2">
                <div className="flex gap-1.5 opacity-10 group-hover:opacity-100 transition-all duration-700 transform group-hover:scale-110">
                  <div className="h-1 w-1 rounded-full bg-primary" />
                  <div className="h-1 w-12 rounded-full bg-primary/50" />
                  <div className="h-1 w-1 rounded-full bg-primary" />
                </div>
                <span className="text-[8px] font-code text-primary opacity-0 group-hover:opacity-40 transition-all duration-700 uppercase tracking-[0.6em]">
                  NODE SECURED
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
    </section>
  );
}

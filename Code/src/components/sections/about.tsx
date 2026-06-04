
'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import placeholderData from '@/lib/placeholder-images.json';
import aboutData from '@/content/about.json';
import { ArrowRight, Activity, ShieldCheck, Cpu, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * @fileOverview About Section Node.
 * Identity: Operational Identity Dossier.
 * High-density technical readout layout.
 */
export function About() {
  const aboutImage = placeholderData.placeholderImages.find(p => p.id === 'about-me-alt');
  const { paragraphs, stats } = aboutData;
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="about-section" ref={sectionRef} className="py-24 sm:py-32 bg-black overflow-hidden relative border-y border-primary/5">
      {/* Dossier Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.02] pointer-events-none font-code text-[8px] leading-relaxed p-10 select-none overflow-hidden uppercase">
        {Array.from({ length: 15 }).map((_, i) => (
          <div key={i} className="whitespace-nowrap mb-4">
            [IDENT_PROTOCOL_ALPHA] {new Array(10).fill('STABLE_NODE_DATA_TRANSMISSION_010101').join(' ')}
          </div>
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">
            
            {/* COLUMN A: IDENTITY IMAGE & BIO-OVERLAY */}
            <div className={cn(
              "lg:col-span-5 transition-all duration-1000 transform",
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"
            )}>
              <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden group border border-primary/20 bg-neutral-900 shadow-[0_0_50px_rgba(147,51,234,0.1)]">
                {aboutImage && (
                  <Image 
                    src={aboutImage.imageUrl}
                    alt={aboutImage.description}
                    data-ai-hint={aboutImage.imageHint}
                    fill
                    className="object-cover opacity-50 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000 scale-105 group-hover:scale-100"
                  />
                )}
                
                {/* Visual Scanning Effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
                
                {/* Animated Scanner Line */}
                <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-primary/20 to-transparent animate-[float-y_6s_infinite_ease-in-out] opacity-50" />

                <div className="absolute bottom-8 left-8 right-8 p-6 bg-black/80 backdrop-blur-md rounded-2xl border border-primary/10">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[9px] font-code text-primary uppercase tracking-[0.3em]">Operator Identity Verified</span>
                  </div>
                  <p className="text-xs italic text-muted-foreground leading-relaxed">
                    " High-discipline systems require a Zero-Failure methodology at every node. "
                  </p>
                </div>
              </div>
            </div>

            {/* COLUMN B: TECHNICAL READOUT (CONTENT) */}
            <div className={cn(
              "lg:col-span-7 space-y-10 transition-all duration-1000 delay-300 transform",
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"
            )}>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                  <span className="text-[10px] font-code text-primary uppercase tracking-[0.5em] font-black">Node // Identity // Alpha</span>
                </div>
                <h2 className="font-headline text-5xl sm:text-7xl font-black tracking-tighter text-foreground uppercase italic leading-[0.85]">
                  High <br/>
                  <span className="text-primary drop-shadow-[0_0_15px_rgba(147,51,234,0.4)]">Discipline.</span>
                </h2>
              </div>

              <div className="grid gap-6">
                {paragraphs.map((paragraph, index) => (
                  <div key={index} className="relative pl-8 border-l border-primary/10">
                    <div className="absolute left-[-1px] top-0 h-4 w-[2px] bg-primary" />
                    <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed font-medium">
                      {paragraph}
                    </p>
                  </div>
                ))}
              </div>

              {/* Stats as Signal Nodes */}
              <div className="grid sm:grid-cols-3 gap-6 pt-6 border-t border-primary/10">
                {stats.map((stat, index) => (
                  <div key={index} className="space-y-1 group">
                    <div className="flex items-center gap-2">
                       <div className="h-1 w-1 rounded-full bg-primary group-hover:animate-ping" />
                       <p className="text-3xl font-black text-foreground italic tracking-tighter">{stat.value}</p>
                    </div>
                    <p className="text-[9px] text-muted-foreground uppercase tracking-widest font-bold leading-tight group-hover:text-primary transition-colors">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>

              <div className="pt-6 flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-4 py-3 px-8 bg-neutral-900/50 rounded-full border border-primary/10 shadow-[0_0_15px_rgba(147,51,234,0.1)]">
                  <div className="flex gap-1.5">
                    <div className="h-4 w-1 bg-primary/20" />
                    <div className="h-4 w-1 bg-primary/40" />
                    <div className="h-4 w-1 bg-primary/60" />
                    <div className="h-4 w-1 bg-primary animate-pulse" />
                  </div>
                  <span className="text-[10px] font-code text-primary uppercase tracking-[0.4em] font-black">Node Alpha Status: Active</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

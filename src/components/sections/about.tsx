
'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import placeholderData from '@/lib/placeholder-images.json';
import aboutData from '@/content/about.json';
import { cn } from '@/lib/utils';
import { ArrowRight, Activity, ShieldCheck } from 'lucide-react';

export function About() {
  const aboutImage = placeholderData.placeholderImages.find(p => p.id === 'about-me-alt');
  const { paragraphs, stats } = aboutData;
  const [scrollY, setScrollY] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom >= 0) {
          setScrollY(window.scrollY);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const imageParallaxOffset = () => {
    if (!sectionRef.current) return 0;
    const rect = sectionRef.current.getBoundingClientRect();
    const startY = window.scrollY + rect.top;
    const relativeScroll = scrollY - startY;
    return relativeScroll * 0.1;
  }

  return (
    <section id="about-section" ref={sectionRef} className="py-24 sm:py-32 bg-black overflow-hidden relative">
      {/* Background Pulse */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.02] pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary rounded-full blur-[150px] animate-pulse" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-16 items-center">
            
            <div className="lg:col-span-5 order-2 lg:order-1">
              <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden group border border-white/5">
                <div 
                  className="relative h-full w-full transition-transform duration-200 ease-out"
                  style={{ transform: `translateY(${imageParallaxOffset()}px)` }}
                >
                  {aboutImage && (
                    <Image 
                      src={aboutImage.imageUrl}
                      alt={aboutImage.description}
                      data-ai-hint={aboutImage.imageHint}
                      fill
                      className="object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000"
                    />
                  )}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                
                {/* Tactical Overlay */}
                <div className="absolute top-6 left-6 flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <ShieldCheck className="h-3 w-3 text-primary" />
                  <span className="text-[8px] font-code text-white uppercase tracking-widest">ID: Verified // Operator</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-10 order-1 lg:order-2">
              <div className="space-y-4">
                <div className="flex items-center gap-2 animate-fade-in">
                  <Activity className="h-4 w-4 text-primary animate-pulse" />
                  <span className="text-[10px] font-code text-primary uppercase tracking-[0.4em]">Operational DNA</span>
                </div>
                <h2 className="font-headline text-5xl sm:text-6xl font-black tracking-tighter text-foreground uppercase italic leading-[0.9]">
                  About <br/>
                  <span className="text-primary drop-shadow-[0_0_15px_rgba(147,51,234,0.4)]">Digitiful.</span>
                </h2>
              </div>

              <div className="space-y-6 text-muted-foreground text-lg leading-relaxed font-medium">
                {paragraphs.map((paragraph, index) => (
                  <p key={index} className="animate-fade-in-up" style={{ animationDelay: `${150 * (index + 1)}ms` }}>{paragraph}</p>
                ))}
              </div>

              <div className="pt-4 flex flex-wrap gap-6 items-center">
                <Link href="/about">
                  <Button size="lg" className="px-8 h-14 text-xs font-bold uppercase tracking-widest group">
                    Enter Bio-Node
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <div className="flex -space-x-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-10 w-10 rounded-full border-2 border-black bg-neutral-800 flex items-center justify-center overflow-hidden">
                      <Image src={`https://picsum.photos/seed/${i+10}/100/100`} alt="Team member" width={40} height={40} className="object-cover opacity-50 grayscale" />
                    </div>
                  ))}
                  <div className="h-10 px-4 rounded-full border-2 border-black bg-primary/20 backdrop-blur-sm flex items-center justify-center text-[10px] font-bold text-primary uppercase">
                    +44 Missions
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8 pt-10 border-t border-white/5">
                {stats.slice(0, 2).map((stat, index) => (
                  <div key={index} className="space-y-1">
                    <p className="text-3xl font-black text-foreground italic">{stat.value}</p>
                    <p className="text-[9px] text-muted-foreground uppercase tracking-widest font-bold">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}


'use client';

import React, { useState, useEffect } from 'react';
import { techLogos as fallbackTech } from '@/lib/data';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Cpu, Activity, Loader2 } from 'lucide-react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';

/**
 * @fileOverview Neural Tree Ecosystem Node.
 * Identity: Neural Orbit Protocol.
 * Synchronized with Admin Dashboard for high-authority control.
 */

const CORE_LOGO_URL = "https://iili.io/qLWQrJt.md.png";

interface TechNodeData {
    id?: string;
    name: string;
    logo: string;
    href?: string;
    invert?: boolean;
}

export function Technology() {
  const firestore = useFirestore();
  const [isPaused, setIsPaused] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Fetch Tech Stack from Firestore
  const techQuery = useMemoFirebase(
    () => firestore ? query(collection(firestore, 'technology'), orderBy('order', 'asc')) : null,
    [firestore]
  );
  const { data: dbTech, isLoading } = useCollection<TechNodeData>(techQuery);

  // Absolute Sovereignty: If DB has nodes, use them. Otherwise, hide section if loading is done.
  const techNodes = dbTech && dbTech.length > 0 ? dbTech : (isLoading ? null : []);

  if (!isLoading && techNodes?.length === 0) {
      return null;
  }

  // Exclude center hub from orbiting list if accidentally added
  const orbitingLogos = (techNodes || []).filter(logo => logo.name !== "Antigravity" && logo.name !== "Digitiful");
  
  // Split into two distinct neural layers
  const innerRing = orbitingLogos.slice(0, 4);
  const outerRing = orbitingLogos.slice(4);

  return (
    <section id="technology" className="py-32 bg-black border-y border-primary/5 relative overflow-hidden">
      {/* Deep Space Ambience */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,hsl(var(--primary)/0.08)_0%,transparent_70%)]" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-32 space-y-4">
          <div className="flex flex-col items-center gap-3">
             <div className="flex items-center gap-2">
                <Cpu className="h-4 w-4 text-primary animate-pulse" />
                <span className="text-[10px] font-code text-primary uppercase tracking-[0.5em] font-black">System DNA // Frequencies</span>
             </div>
             <h2 className="font-headline text-5xl sm:text-7xl font-black tracking-tighter text-foreground uppercase italic leading-none">
               The <br/>
               <span className="text-primary drop-shadow-[0_0_20px_rgba(147,51,234,0.4)]">Stack.</span>
             </h2>
             <p className="max-w-lg text-muted-foreground/60 text-[10px] font-bold uppercase tracking-[0.3em] leading-relaxed mt-4 italic">
                " A neural network of high-discipline engineering nodes tuned for absolute precision. "
             </p>
          </div>
        </div>

        {/* NEURAL TREE HUB */}
        <div 
          className="relative w-full max-w-5xl mx-auto h-[500px] lg:h-[700px] flex items-center justify-center"
          onMouseEnter={() => !isMobile && setIsPaused(true)}
          onMouseLeave={() => !isMobile && setIsPaused(false)}
        >
          
          {isLoading && dbTech === null ? (
              <div className="flex flex-col items-center gap-4 z-40">
                  <Loader2 className="h-10 w-10 animate-spin text-primary/40" />
                  <p className="text-[10px] uppercase font-bold tracking-[0.4em] text-muted-foreground animate-pulse">Syncing DNA...</p>
              </div>
          ) : (
            <>
              {/* NEURAL BRANCHES (Radiating SVG network) */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true">
                <defs>
                  <radialGradient id="neural-gradient">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
                  </radialGradient>
                </defs>
                
                <circle cx="50%" cy="50%" r="140" fill="none" stroke="hsl(var(--primary)/0.1)" strokeWidth="1" strokeDasharray="4 8" className="animate-spin-slow" style={{ animationDuration: '60s' }} />
                <circle cx="50%" cy="50%" r="280" fill="none" stroke="hsl(var(--primary)/0.05)" strokeWidth="1" strokeDasharray="10 20" className="animate-spin-slow" style={{ animationDuration: '120s', animationDirection: 'reverse' }} />

                {!isMobile && innerRing.map((_, idx) => (
                  <line 
                    key={`line-inner-${idx}`}
                    x1="50%" y1="50%" x2="50%" y2="50%"
                    stroke="url(#neural-gradient)" strokeWidth="0.5"
                    className="transition-all duration-1000 opacity-20"
                    style={{ 
                        transformOrigin: 'center', 
                        transform: `rotate(${(idx * 360) / innerRing.length}deg) translateY(-140px)`,
                    }}
                  />
                ))}
              </svg>

              {/* THE MASTER CORE (ROOT NODE) */}
              <div className="relative z-30 group">
                <div className="absolute inset-0 bg-primary/30 blur-[80px] rounded-full animate-breathing pointer-events-none" />
                <div className="relative h-32 w-28 sm:h-44 sm:w-36 rounded-full border-2 border-primary/40 bg-black/80 backdrop-blur-2xl p-8 shadow-[0_0_60px_rgba(147,51,234,0.4)] flex items-center justify-center transition-all duration-700 group-hover:scale-110 group-hover:border-primary group-hover:shadow-[0_0_100px_rgba(147,51,234,0.6)]">
                    <Image 
                      src={CORE_LOGO_URL} 
                      alt="Digitiful Core" 
                      width={140} 
                      height={140} 
                      className="object-contain animate-breathing"
                    />
                </div>
                
                <div className="absolute -bottom-14 left-1/2 -translate-x-1/2 whitespace-nowrap text-center">
                    <span className="text-[11px] font-black text-primary uppercase tracking-[0.5em] italic">Digitiful Hub</span>
                    <div className="flex items-center justify-center gap-2 mt-2">
                      <div className="h-1 w-1 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-[8px] text-muted-foreground font-black uppercase tracking-widest opacity-60">System // Root Active</span>
                    </div>
                </div>
              </div>

              {/* INNER NEURAL LAYER */}
              <div className={cn(
                "absolute inset-0 pointer-events-none transition-all duration-1000",
                isPaused ? "scale-[0.95] opacity-50" : "scale-100 opacity-100"
              )}>
                <div 
                  className={cn("w-full h-full animate-orbit", isPaused && "pause-animation")}
                  style={{ '--orbit-duration': '35s' } as React.CSSProperties}
                >
                  {innerRing.map((tech, idx) => {
                    const angle = (idx * 360) / innerRing.length;
                    return (
                      <div 
                        key={tech.id || tech.name}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0 h-0 pointer-events-auto"
                        style={{ transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-140px) rotate(-${angle}deg)` }}
                      >
                        <TechNode tech={tech} isPaused={isPaused} speed="35s" />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* OUTER NEURAL LAYER */}
              <div className="absolute inset-0 pointer-events-none">
                <div 
                  className={cn("w-full h-full animate-orbit", isPaused && "pause-animation")}
                  style={{ '--orbit-duration': '75s' } as React.CSSProperties}
                >
                  {outerRing.map((tech, idx) => {
                    const angle = (idx * 360) / outerRing.length;
                    return (
                      <div 
                        key={tech.id || tech.name}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0 h-0 pointer-events-auto"
                        style={{ transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-280px) rotate(-${angle}deg)` }}
                      >
                        <TechNode tech={tech} isPaused={isPaused} speed="75s" />
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}

        </div>

        {/* MOBILE FALLBACK GRID */}
        {!isLoading && orbitingLogos.length > 0 && (
            <div className="mt-20 lg:hidden grid grid-cols-2 gap-4">
            {orbitingLogos.map((tech) => (
                <div key={tech.id || tech.name} className="p-6 bg-primary/5 rounded-2xl border border-primary/10 flex flex-col items-center gap-4 group active:bg-primary/10 transition-colors">
                    <div className="relative h-10 w-10">
                    <img src={tech.logo} alt={tech.name} className={cn("max-h-full max-w-full object-contain transition-all grayscale group-active:grayscale-0", tech.invert && "invert")} />
                    </div>
                    <span className="text-[9px] font-black uppercase text-foreground/60 tracking-widest">{tech.name}</span>
                </div>
            ))}
            </div>
        )}
        
        <div className="mt-32 text-center">
            <p className="text-[9px] font-code text-muted-foreground/30 uppercase tracking-[0.8em] animate-pulse">
                SCALING CORE ARCHITECTURE... // NODES SECURED.
            </p>
        </div>
      </div>
    </section>
  );
}

function TechNode({ tech, isPaused, speed }: { tech: any, isPaused: boolean, speed: string }) {
    return (
        <div 
          className={cn(
            "group relative transition-all duration-700 animate-counter-rotate",
            isPaused && "pause-animation"
          )}
          style={{ '--orbit-duration': speed } as React.CSSProperties}
        >
            {/* Dynamic Branch Connection (Desktop Only) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-px bg-gradient-to-l from-primary/30 to-transparent -z-10 origin-left hidden lg:block" style={{ transform: 'rotate(0deg) translateX(20px)' }} />

            <div className="relative h-16 w-16 sm:h-20 sm:w-20 rounded-2xl border border-white/10 bg-neutral-900/80 backdrop-blur-xl p-4 flex items-center justify-center transition-all duration-500 group-hover:scale-150 group-hover:border-primary/50 group-hover:shadow-[0_0_40px_rgba(147,51,234,0.4)] group-hover:z-50 cursor-crosshair group-hover:-rotate-6">
                <img 
                  src={tech.logo} 
                  alt={tech.name} 
                  className={cn("max-h-full max-w-full object-contain grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 group-hover:scale-110", tech.invert && "invert")} 
                />
                
                {/* TACTICAL READOUT TOOLTIP */}
                <div className="absolute -top-16 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none translate-y-4 group-hover:translate-y-0">
                    <div className="bg-black/90 border border-primary/30 px-4 py-2 rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.8)] backdrop-blur-md">
                        <div className="flex flex-col items-center gap-1">
                           <div className="flex items-center gap-2">
                                <Activity className="h-3 w-3 text-green-500 animate-pulse" />
                                <span className="text-[10px] font-black uppercase text-primary tracking-[0.2em]">{tech.name} NODE</span>
                           </div>
                           <span className="text-[7px] text-muted-foreground font-bold uppercase tracking-widest">Signal Locked</span>
                        </div>
                    </div>
                </div>

                <div className="absolute -bottom-1 -right-1 h-3 w-3 border-b-2 border-r-2 border-primary/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute -top-1 -left-1 h-3 w-3 border-t-2 border-l-2 border-primary/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
        </div>
    );
}


'use client';
import React from 'react';

const pillars = ["Digital", "Precise", "Deliberate"];

export function BrandPillars() {
  return (
    <section className="relative py-24 bg-black overflow-hidden border-y border-primary/10">
      {/* Ghost Background Text */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.02] pointer-events-none font-headline text-[15rem] leading-none whitespace-nowrap select-none italic font-black text-primary">
        DELIBERATE PRECISE DIGITAL
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-3 gap-12 md:gap-8">
          {pillars.map((pillar, i) => (
            <div key={pillar} className="group relative">
              <div className="flex flex-col items-center justify-center gap-4 p-8 rounded-2xl bg-gradient-to-b from-primary/5 to-transparent border border-primary/10 hover:border-primary/30 transition-all duration-500 hover:-translate-y-2 text-center">
                <span className="text-[10px] font-code text-primary/40 uppercase tracking-[0.3em]">Protocol // 0{i+1}</span>
                <h3 className="text-xl md:text-2xl font-black italic tracking-tighter text-primary uppercase group-hover:scale-105 transition-transform duration-500">
                  {pillar}.
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

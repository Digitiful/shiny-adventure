
'use client';

import React, { useRef, useState, useEffect } from 'react';
import { techLogos } from '@/lib/data';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { Card } from '@/components/ui/card';

export function Technology() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: -1, y: -1 });
  const [isMouseInside, setIsMouseInside] = useState(false);

  // Simple check for touch support to infer mobile/tablet.
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    // This check only runs once on the client-side.
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    setIsMobile(isTouchDevice);
  }, []);


  useEffect(() => {
    // Only run this effect on non-mobile devices.
    if (isMobile) return;

    const handleMouseMove = (event: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
        });
      }
    };

    const currentRef = containerRef.current;
    if (currentRef) {
      currentRef.addEventListener('mousemove', handleMouseMove);
      currentRef.addEventListener('mouseenter', () => setIsMouseInside(true));
      currentRef.addEventListener('mouseleave', () => setIsMouseInside(false));
    }

    return () => {
      if (currentRef) {
        currentRef.removeEventListener('mousemove', handleMouseMove);
        currentRef.removeEventListener('mouseenter', () => setIsMouseInside(true));
        currentRef.removeEventListener('mouseleave', () => setIsMouseInside(false));
      }
    };
  }, [isMobile]); // Re-run if isMobile changes (it won't, but it's a correct dependency)

  return (
    <section id="technology" className="py-20 sm:py-28 bg-card">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="font-headline text-3xl font-bold tracking-tight text-primary sm:text-4xl md:text-5xl">
            Our Technology Stack
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            We use a modern, battle-tested stack to build scalable and reliable solutions for our clients.
          </p>
        </div>

        <div
          ref={containerRef}
          className="relative max-w-5xl mx-auto rounded-xl border border-primary/20 bg-background p-4 md:p-8"
          style={{
            // @ts-ignore
            '--mouse-x': `${mousePosition.x}px`,
            '--mouse-y': `${mousePosition.y}px`,
            // The opacity is now controlled by both mouse presence AND the device type.
            '--spotlight-opacity': !isMobile && isMouseInside ? 1 : 0,
          }}
        >
          <div 
            className="pointer-events-none absolute -inset-px rounded-xl opacity-[var(--spotlight-opacity)] transition-opacity duration-300"
            style={{
              background: `radial-gradient(350px circle at var(--mouse-x) var(--mouse-y), hsl(var(--primary)/0.15), transparent 80%)`,
            }}
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-8">
            {techLogos.map((tech) => (
              <Link
                key={tech.name}
                href={tech.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <Card className="h-full p-6 flex flex-col items-center justify-center bg-background/50 backdrop-blur-sm transition-all duration-300 ease-in-out hover:bg-background/80 hover:shadow-2xl hover:shadow-primary/20 border-border/50 hover:border-primary/30">
                  <div className="relative h-16 w-24">
                    <Image
                      src={tech.logo}
                      alt={`${tech.name} logo`}
                      fill
                      className={cn(
                        "object-contain transition-transform duration-300 group-hover:scale-110",
                        tech.invert && "invert"
                      )}
                    />
                  </div>
                  <p className="mt-4 text-sm font-semibold text-center text-muted-foreground group-hover:text-primary transition-colors">
                    {tech.name}
                  </p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

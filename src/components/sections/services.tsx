"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { services as fallbackServices, serviceIcons } from "@/lib/data";
import { Briefcase, Loader2 } from "lucide-react";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy } from "firebase/firestore";

interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export function Services() {
  const firestore = useFirestore();
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = React.useState({ x: -1, y: -1 });
  const [isMouseInside, setIsMouseInside] = React.useState(false);

  const [isMobile, setIsMobile] = React.useState(false);
  React.useEffect(() => {
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    setIsMobile(isTouchDevice);
  }, []);

  // Fetch Services from Firestore
  const servicesQuery = useMemoFirebase(
    () => firestore ? query(collection(firestore, 'services'), orderBy('title', 'asc')) : null,
    [firestore]
  );
  const { data: dbServices, isLoading } = useCollection<Service>(servicesQuery);

  // Fallback logic: Use DB services if available, otherwise fallback to JSON
  const displayServices = dbServices && dbServices.length > 0 
    ? dbServices.map(s => ({
        ...s,
        icon: serviceIcons[s.icon] || Briefcase
      }))
    : fallbackServices;

  React.useEffect(() => {
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
  }, [isMobile]);

  return (
    <section id="services" className="py-20 sm:py-28 bg-card">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-primary uppercase italic">
            Services
          </h2>
          <p className="mt-4 text-lg text-muted-foreground font-medium">
            High-discipline engineering solutions for digital transformation.
          </p>
        </div>

        <div
          ref={containerRef}
          className="relative max-w-6xl mx-auto rounded-xl border border-primary/10 bg-background/30 p-4 md:p-8"
          style={{
            // @ts-ignore
            '--mouse-x': `${mousePosition.x}px`,
            '--mouse-y': `${mousePosition.y}px`,
            '--spotlight-opacity': !isMobile && isMouseInside ? 1 : 0,
          }}
        >
          <div 
            className="pointer-events-none absolute -inset-px rounded-xl opacity-[var(--spotlight-opacity)] transition-opacity duration-300"
            style={{
              background: `radial-gradient(450px circle at var(--mouse-x) var(--mouse-y), hsl(var(--primary)/0.1), transparent 80%)`,
            }}
          />
          
          {isLoading && dbServices === null ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayServices.map((service, index) => {
                const ServiceIcon = service.icon || Briefcase;
                return (
                  <Link key={index} href="/contact" className="group h-full">
                    <Card 
                        className={cn(
                            "flex flex-col overflow-hidden h-full bg-background/50 backdrop-blur-sm transition-all duration-300 ease-in-out border-border/50",
                            "hover:bg-background/80 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1"
                        )}
                    >
                        <CardHeader className="flex flex-row items-center gap-4 pb-4">
                            <div className="bg-primary/10 p-3 rounded-full border border-primary/20 group-hover:bg-primary/20 transition-colors">
                                <ServiceIcon className="h-8 w-8 text-primary transition-transform duration-300 group-hover:scale-110" />
                            </div>
                            <CardTitle className="text-xl font-bold leading-tight">{service.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col flex-grow pt-0">
                            <p className="text-muted-foreground flex-grow">{service.description}</p>
                        </CardContent>
                    </Card>
                  </Link>
              )})}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

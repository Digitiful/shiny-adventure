
"use client";

import Link from "next/link";
import { ArrowDown } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

const headlines = [
  "Digital Native.",
  "Precise Engineering.",
  "Deliberate Execution.",
  "Elite Systems.",
];

export function Hero() {
  const [headlineIndex, setHeadlineIndex] = useState(0);
  const [typedHeadline, setTypedHeadline] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentHeadline = headlines[headlineIndex];
    let timeout: NodeJS.Timeout;

    if (isDeleting) {
      if (typedHeadline.length > 0) {
        timeout = setTimeout(() => {
          setTypedHeadline((prev) => prev.slice(0, -1));
        }, 50); // Faster deleting
      } else {
        setIsDeleting(false);
        setHeadlineIndex((prev) => (prev + 1) % headlines.length);
      }
    } else {
      if (typedHeadline.length < currentHeadline.length) {
        timeout = setTimeout(() => {
          setTypedHeadline((prev) => currentHeadline.slice(0, prev.length + 1));
        }, 100); // Typing speed
      } else {
        timeout = setTimeout(() => {
          setIsDeleting(true);
        }, 2000); // Pause before deleting
      }
    }

    return () => clearTimeout(timeout);
  }, [typedHeadline, isDeleting, headlineIndex]);

  return (
    <section className="relative flex flex-col items-center justify-center min-h-[calc(100vh-5rem)] pt-20 pb-10 bg-black overflow-hidden">
      <div className="absolute inset-0 w-full h-full animate-slow-zoom">
        <Image
          src="https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=2072&auto=format&fit=crop"
          alt="Planet Earth from space"
          fill
          data-ai-hint="planet earth"
          className="object-cover"
          priority
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/50 to-transparent z-10"></div>
      <div className="container mx-auto px-4 text-center z-20">
        <h1 className="font-headline text-4xl font-bold tracking-tighter text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
          <span className="text-primary block h-20 md:h-24 lg:h-28">
            {typedHeadline}
            <span className="inline-block w-2 h-10 md:h-12 lg:h-16 bg-primary animate-ping ml-1"></span>
          </span>
        </h1>
      </div>
      
      <div className="absolute bottom-10 z-20">
        <Link href="#book" passHref>
          <div className="flex flex-col items-center gap-2 cursor-pointer group animate-bounce-y">
            <span className="text-sm font-medium text-muted-foreground group-hover:text-white transition-colors uppercase tracking-widest font-code text-[10px]">
              Initiate Launch
            </span>
            <div
              className={cn(
                "relative h-14 w-14 rounded-full shadow-[0_0_15px_hsl(var(--primary)/0.4)] opacity-60 group-hover:opacity-100 transition-opacity flex items-center justify-center overflow-hidden animate-float-y",
                "shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]"
              )}
            >
              <Image
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/The_Earth_seen_from_Apollo_17.jpg/1200px-The_Earth_seen_from_Apollo_17.jpg"
                alt="Planet Earth"
                data-ai-hint="planet earth"
                fill
                className="object-cover"
              />
              <ArrowDown
                className="h-6 w-6 text-muted-foreground group-hover:text-white relative z-10 transition-all"
              />
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}

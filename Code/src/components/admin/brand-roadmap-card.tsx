
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, Palette, Type, Compass, Trash2, Lock, Zap, ExternalLink } from "lucide-react";
import Image from "next/image";

export function BrandRoadmapCard() {
  const palette = ["#8338EC", "#BA89FF", "#22c55e", "#83B3FF", "#3A86FE"];
  const coolorsRef = "https://coolors.co/?ref=687039010cea43000bcda1eb";
  
  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader>
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-primary" />
          <CardTitle>Brand Roadmap Spec</CardTitle>
        </div>
        <CardDescription>Official visual and tonal identity for Agency hand-off.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-[10px] font-code uppercase text-muted-foreground">Core Persona</p>
            <div className="flex items-center gap-2">
              <Compass className="h-4 w-4 text-primary" />
              <span className="font-bold text-sm">Mindful Guide (Digi.)</span>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-[10px] font-code uppercase text-muted-foreground">Current Phase</p>
            <div className="flex items-center gap-2 text-sm font-bold">
              <span className="bg-primary/20 text-primary px-2 py-0.5 rounded text-xs">April MVP launch</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-code uppercase text-muted-foreground">Color Palette (Hex Codes)</p>
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
            {palette.map((hex) => (
              <div key={hex} className="flex items-center gap-2 bg-background p-2 rounded-md border border-border/50">
                <div className="h-4 w-4 rounded-full" style={{ backgroundColor: hex }} />
                <span className="text-xs font-mono font-bold uppercase">{hex}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 pt-4 border-t border-primary/10">
          <div className="space-y-2">
            <p className="text-[10px] font-code uppercase text-muted-foreground">Typography Protocol</p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 bg-background p-2 rounded-md border border-border/50">
                <Type className="h-4 w-4 text-primary" />
                <span className="text-xs font-bold uppercase">INTER</span>
              </div>
              <div className="flex items-center gap-2 bg-background p-2 rounded-md border border-border/50">
                <Type className="h-4 w-4 text-primary" />
                <span className="text-xs font-code uppercase">SPACE MONO</span>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-[10px] font-code uppercase text-muted-foreground">Operational Rules</p>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-[10px] text-foreground font-bold">
                <Trash2 className="h-3 w-3 text-primary opacity-50" /> ZERO WASTE
              </div>
              <div className="flex items-center gap-2 text-[10px] text-foreground font-bold">
                <Lock className="h-3 w-3 text-primary opacity-50" /> ENCRYPTED NODES
              </div>
              <div className="flex items-center gap-2 text-[10px] text-foreground font-bold">
                <Zap className="h-3 w-3 text-primary opacity-50" /> SPEED IS HYGIENE
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}


'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { projectDetailsData } from "@/lib/data";
import { ShieldCheck, Palette, Type, Compass } from "lucide-react";

export function BrandRoadmapCard() {
  const { brandRoadmap } = projectDetailsData as any;

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
              <span className="font-bold text-sm">{brandRoadmap.persona}</span>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-[10px] font-code uppercase text-muted-foreground">Current Phase</p>
            <div className="flex items-center gap-2 text-sm font-bold">
              <span className="bg-primary/20 text-primary px-2 py-0.5 rounded text-xs">{brandRoadmap.phase}</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-[10px] font-code uppercase text-muted-foreground">Color Palette (Hex Codes)</p>
          <div className="flex flex-wrap gap-3">
            {Object.entries(brandRoadmap.palette).map(([name, hex]: [string, any]) => (
              <div key={name} className="flex items-center gap-2 bg-background p-2 rounded-md border border-border/50">
                <div className="h-4 w-4 rounded-full" style={{ backgroundColor: hex }} />
                <div className="flex flex-col">
                  <span className="text-[9px] uppercase opacity-50">{name}</span>
                  <span className="text-xs font-mono font-bold uppercase">{hex}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-[10px] font-code uppercase text-muted-foreground">Typography Protocol</p>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 bg-background p-2 rounded-md border border-border/50">
              <Type className="h-4 w-4 text-primary" />
              <span className="text-xs font-medium">{brandRoadmap.typography.body} (Sans)</span>
            </div>
            <div className="flex items-center gap-2 bg-background p-2 rounded-md border border-border/50">
              <Type className="h-4 w-4 text-primary" />
              <span className="text-xs font-code">{brandRoadmap.typography.system} (Code)</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

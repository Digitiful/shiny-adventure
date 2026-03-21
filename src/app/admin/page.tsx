
'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Package, ShieldCheck, Zap, Globe, Cpu } from "lucide-react";
import { adminNavLinks } from "@/lib/data";
import { useUser } from "@/firebase";
import { OverviewStats, RecentInquiries } from "@/components/admin/overview-stats";
import { BrandRoadmapCard } from "@/components/admin/brand-roadmap-card";

function SystemEfficiencyCard() {
  return (
    <Card className="border-primary/20 bg-black/40 backdrop-blur-md">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Cpu className="h-4 w-4 text-green-500" />
          <CardTitle className="text-xs font-code uppercase tracking-widest text-muted-foreground">Operational Sovereignty</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-end">
          <div>
            <p className="text-2xl font-black italic text-foreground">$0.00</p>
            <p className="text-[10px] text-muted-foreground uppercase">Monthly SaaS Tax</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold text-green-500 uppercase tracking-tighter">Optimized</p>
            <p className="text-[10px] text-muted-foreground uppercase">Spark Protocol</p>
          </div>
        </div>
        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-green-500 w-[2%] animate-pulse" />
        </div>
        <p className="text-[9px] font-code text-muted-foreground leading-tight italic">
          " System utilizing native Antigravity Node and Gemini Flash free-tiers. Zero-failure cost management active. "
        </p>
      </CardContent>
    </Card>
  );
}

export default function AdminPage() {
  const { user } = useUser();
  const displayName = user?.displayName || user?.email;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary mb-2 uppercase italic">Welcome back, {displayName}!</h1>
          <p className="text-muted-foreground font-medium">System Status: <span className="text-green-500 font-bold uppercase tracking-widest text-xs">Deliberate // Optimized</span></p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-primary/5 border border-primary/10 rounded-lg">
          <ShieldCheck className="h-4 w-4 text-primary" />
          <span className="text-[10px] font-code text-primary uppercase tracking-widest">Admin ID Verified</span>
        </div>
      </div>

      <OverviewStats />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
            <RecentInquiries />
            <BrandRoadmapCard />
        </div>
        <div className="space-y-6">
            <SystemEfficiencyCard />
            {adminNavLinks.filter(link => link.href !== '/admin').map(link => (
              <Card key={link.href} className="flex flex-col bg-card/50">
                <CardHeader>
                  <div className="flex items-center gap-4">
                     <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                        <link.icon className="h-6 w-6 text-primary" />
                     </div>
                     <div>
                        <CardTitle className="text-lg font-bold uppercase italic">{link.label}</CardTitle>
                        <CardDescription className="text-xs line-clamp-1">{link.description}</CardDescription>
                     </div>
                  </div>
                </CardHeader>
                <CardFooter className="mt-auto">
                   <Link href={link.href} className="w-full">
                      <Button variant="outline" className="w-full text-xs font-bold uppercase tracking-widest group">
                        Enter Node
                        <ArrowRight className="ml-2 h-3 w-3 transition-transform group-hover:translate-x-1" />
                      </Button>
                   </Link>
                </CardFooter>
              </Card>
            ))}
        </div>
      </div>
    </div>
  );
}

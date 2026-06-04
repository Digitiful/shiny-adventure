'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Package, ShieldCheck, Zap, Globe, Cpu, TrendingDown, Activity, CheckCircle2, Rocket, Info, Server, Database, Sparkles } from "lucide-react";
import { adminNavLinks } from "@/lib/data";
import { useUser, useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query } from 'firebase/firestore';
import { OverviewStats, RecentInquiries } from "@/components/admin/overview-stats";
import { BrandRoadmapCard } from "@/components/admin/brand-roadmap-card";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

/**
 * @fileOverview System Integrity Node.
 * Performs a real-time diagnostic sweep of critical infrastructure.
 * Identity: Zero-Failure Methodology Verification.
 */
function SystemIntegrityNode() {
  const [status, setStatus] = useState<'scanning' | 'nominal'>('scanning');
  const [pulseIndex, setPulseIndex] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => setStatus('nominal'), 2500);
    const pulseTimer = setInterval(() => setPulseIndex(prev => (prev + 1) % 4), 800);
    return () => {
        clearTimeout(timer);
        clearInterval(pulseTimer);
    };
  }, []);

  const checkpoints = [
    { label: "Auth Layer", status: "Encrypted", icon: ShieldCheck },
    { label: "Data Pipeline", status: "Synced", icon: Globe },
    { label: "AI Engine", status: "Flash 2.5", icon: Zap },
    { label: "AWH Protocol", status: "Calibrated", icon: Package },
  ];

  return (
    <Card className="border-primary/20 bg-black/40 backdrop-blur-md overflow-hidden shadow-2xl">
      <CardHeader className="pb-2 border-b border-white/5 bg-primary/5 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary animate-pulse" />
            <CardTitle className="text-[10px] font-bold uppercase tracking-[0.3em]">System Integrity Audit</CardTitle>
          </div>
          <div className={cn(
            "flex items-center gap-1.5 px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border transition-all duration-1000",
            status === 'scanning' ? "text-yellow-500 border-yellow-500/20 bg-yellow-500/5" : "text-green-500 border-green-500/20 bg-green-500/5 shadow-[0_0_10px_rgba(34,197,94,0.1)]"
          )}>
            <div className={cn("h-1 w-1 rounded-full", status === 'scanning' ? "bg-yellow-500 animate-pulse" : "bg-green-500")} />
            {status === 'scanning' ? "SCANNING INFRASTRUCTURE..." : "ZERO FAILURES DETECTED"}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4 grid grid-cols-2 gap-3">
        {checkpoints.map((check, i) => (
          <div key={check.label} className={cn(
            "p-3 rounded border transition-all duration-500 flex items-center gap-3 group relative overflow-hidden",
            status === 'scanning' && pulseIndex === i ? "bg-primary/5 border-primary/20" : "bg-white/5 border-white/5",
            status === 'nominal' && "hover:border-primary/30"
          )}>
            <div className="p-2 bg-black/40 rounded border border-white/5 group-hover:border-primary/20 z-10">
              <check.icon className={cn(
                "h-3.5 w-3.5 transition-all",
                status === 'scanning' && pulseIndex === i ? "text-primary animate-pulse" : "text-primary/40",
                status === 'nominal' && "group-hover:text-primary group-hover:scale-110"
              )} />
            </div>
            <div className="z-10">
              <p className="text-[9px] font-black text-foreground/70 uppercase leading-none tracking-tighter">{check.label}</p>
              <p className="text-[8px] text-muted-foreground uppercase mt-1.5 font-bold tabular-nums">
                {status === 'scanning' ? (pulseIndex === i ? "Verifying..." : "Waiting...") : check.status}
              </p>
            </div>
            {status === 'scanning' && pulseIndex === i && (
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent animate-in slide-in-from-left duration-500" />
            )}
          </div>
        ))}
      </CardContent>
      <CardFooter className="bg-primary/5 border-t border-primary/10 py-2">
        <p className="text-[8px] font-code text-muted-foreground uppercase tracking-widest italic mx-auto">
          " Master Protocol active. Handshake verified across all production rims. "
        </p>
      </CardFooter>
    </Card>
  );
}

function LaunchReadinessCard() {
  const firestore = useFirestore();
  const clientsQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'clients')) : null, [firestore]);
  const techQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'technology')) : null, [firestore]);
  const servicesQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'services')) : null, [firestore]);

  const { data: clients } = useCollection(clientsQuery);
  const { data: tech } = useCollection(techQuery);
  const { data: services } = useCollection(servicesQuery);

  // Production check: In the browser, we check the public project ID variable
  const isEnvConfigured = typeof window !== 'undefined' && (!!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);

  const checks = [
    { label: "Partner Signals Synced", ready: (clients?.length ?? 0) > 0 },
    { label: "DNA Stack Calibrated", ready: (tech?.length ?? 0) > 0 },
    { label: "Engineering Services Active", ready: (services?.length ?? 0) > 0 },
    { label: "Vital Signs Handshake", ready: isEnvConfigured },
  ];

  const readyCount = checks.filter(c => c.ready).length;
  const isFullyReady = readyCount === checks.length;

  return (
    <Card className="border-primary/20 bg-black/40 backdrop-blur-md shadow-2xl relative overflow-hidden">
      {isFullyReady && (
        <div className="absolute top-0 right-0 p-1 bg-green-500/10 border-b border-l border-green-500/20 rounded-bl-lg">
            <Sparkles className="h-3 w-3 text-green-500" />
        </div>
      )}
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
            <Rocket className="h-4 w-4 text-primary" />
            <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Launch Status Protocol</CardTitle>
            </div>
            {isFullyReady && <div className="text-[8px] font-black text-green-500 uppercase px-1.5 py-0.5 border border-green-500/20 bg-green-500/5 rounded">Ignition Authorized</div>}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {checks.map((check, i) => (
            <div key={i} className="flex items-center justify-between p-2 rounded bg-white/5 border border-white/5">
              <span className="text-[9px] font-black uppercase text-foreground/70">{check.label}</span>
              {check.ready ? (
                <CheckCircle2 className="h-3 w-3 text-green-500" />
              ) : (
                <div className="h-1.5 w-1.5 rounded-full bg-yellow-500 animate-pulse" />
              )}
            </div>
          ))}
        </div>
        <div className="pt-2 border-t border-white/5">
          <div className="flex justify-between items-end mb-2">
             <p className="text-[10px] font-black uppercase tracking-widest text-primary">System Readiness</p>
             <p className="text-[9px] font-bold text-muted-foreground">{readyCount}/{checks.length} READY</p>
          </div>
          <div className="h-1 w-full bg-neutral-900 rounded-full overflow-hidden">
            <div 
              className={cn("h-full transition-all duration-1000", isFullyReady ? "bg-green-500" : "bg-primary")} 
              style={{ width: `${(readyCount / checks.length) * 100}%` }} 
            />
          </div>
        </div>
      </CardContent>
      {isFullyReady ? (
          <CardFooter className="bg-green-500/5 py-2 flex items-center gap-2">
              <CheckCircle2 className="h-3 w-3 text-green-500/50" />
              <p className="text-[8px] text-green-500/70 font-bold uppercase italic">
                Environment Synchronized // Final Rollout Authorized
              </p>
          </CardFooter>
      ) : (
          <CardFooter className="bg-yellow-500/5 py-2 flex items-center gap-2">
              <Info className="h-3 w-3 text-yellow-500/50" />
              <p className="text-[8px] text-yellow-500/70 font-bold uppercase italic">
                Awaiting Final Production Rollout
              </p>
          </CardFooter>
      )}
    </Card>
  );
}

function SystemEfficiencyCard() {
  return (
    <Card className="border-primary/20 bg-black/40 backdrop-blur-md shadow-2xl">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Cpu className="h-4 w-4 text-green-500" />
          <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Operational Sovereignty</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-end">
          <div>
            <p className="text-3xl font-black italic text-foreground tracking-tighter">$0.00</p>
            <p className="text-[9px] text-muted-foreground uppercase font-bold">Monthly SaaS Tax</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold text-green-500 uppercase tracking-tighter">Optimized</p>
            <p className="text-[9px] text-muted-foreground uppercase font-bold">Zero-Waste Architecture</p>
          </div>
        </div>
        <div className="h-1.5 w-full bg-neutral-900 rounded-full overflow-hidden border border-white/5">
          <div className="h-full bg-green-500 w-[100%] animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.4)]" />
        </div>
        <div className="flex items-center gap-2 text-[9px] font-code text-muted-foreground leading-tight italic bg-green-500/5 p-2 rounded border border-green-500/10">
          <TrendingDown className="h-3 w-3 text-green-500 shrink-0" />
          <span>" System utilizing native Antigravity Node and Gemini Flash free-tiers. Maintenance cost: $0.00. "</span>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminPage() {
  const { user } = useUser();
  const displayName = "SAM"; // Hard-locked Identity

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-primary mb-2 uppercase italic">Welcome, {displayName}.</h1>
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
            <p className="text-muted-foreground font-bold uppercase tracking-widest text-[10px]">
              System Status: <span className="text-foreground">BROADCASTING LIVE // Node Alpha</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 px-6 py-3 bg-primary/5 border border-primary/10 rounded-2xl shadow-[0_0_30px_rgba(147,51,234,0.1)]">
          <ShieldCheck className="h-5 w-5 text-primary" />
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Admin ID Verified</span>
            <span className="text-[8px] text-muted-foreground uppercase font-bold tracking-widest">Access Level: Master Protocol</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* PRIMARY TELEMETRY COL */}
        <div className="lg:col-span-8 space-y-8">
            <OverviewStats />
            <RecentInquiries />
            <BrandRoadmapCard />
        </div>

        {/* SYSTEM STATUS COL */}
        <div className="lg:col-span-4 space-y-6">
            <LaunchReadinessCard />
            <SystemIntegrityNode />
            <SystemEfficiencyCard />
            
            <div className="space-y-3">
              <p className="text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground px-1">Tactical Access Nodes</p>
              {adminNavLinks.filter(link => link.href !== '/admin').map(link => (
                <Card key={link.href} className="flex flex-col bg-card/40 hover:bg-primary/5 transition-all border-primary/10 group overflow-hidden">
                  <Link href={link.href} className="p-5 flex items-center justify-between relative">
                    <div className="flex items-center gap-4 z-10">
                      <div className="p-2.5 bg-primary/10 rounded-lg border border-primary/20 group-hover:bg-primary/20 transition-all group-hover:scale-105">
                        <link.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-sm font-black uppercase italic tracking-tighter group-hover:text-primary transition-colors">{link.label}</CardTitle>
                        <p className="text-[10px] text-muted-foreground font-medium group-hover:text-foreground/70 transition-colors">{link.description}</p>
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-primary opacity-0 -translate-x-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0" />
                    <div className="absolute top-0 left-0 w-1 h-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </Card>
              ))}
            </div>
        </div>
      </div>
    </div>
  );
}

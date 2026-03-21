'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, ShieldCheck, Terminal, Compass, Package, Cpu, Layers, Ghost, ScanLine } from "lucide-react";

export default function AdminDocsPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary mb-2 uppercase italic">Agency Documentation</h1>
          <p className="text-muted-foreground font-medium">Core roadmaps and operational protocols for the Digitiful Agency.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-primary/5 border border-primary/10 rounded-lg">
          <FileText className="h-4 w-4 text-primary" />
          <span className="text-[10px] font-code text-primary uppercase tracking-widest">Read-Only // Master Protocol</span>
        </div>
      </div>

      <Tabs defaultValue="ops" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md bg-muted/20 border border-primary/10">
          <TabsTrigger value="ops" className="data-[state=active]:bg-primary/20">Operations Roadmap</TabsTrigger>
          <TabsTrigger value="brand" className="data-[state=active]:bg-primary/20">Brand Roadmap</TabsTrigger>
        </TabsList>

        <TabsContent value="ops" className="mt-6">
          <Card className="border-primary/20 bg-black/40">
            <CardHeader className="border-b border-primary/5">
              <div className="flex items-center gap-3">
                <Terminal className="h-6 w-6 text-primary" />
                <div>
                  <CardTitle>Admin Operations Roadmap</CardTitle>
                  <CardDescription>Status: Operational // Digitiful Agency Node</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-8 prose prose-invert max-w-none prose-p:text-muted-foreground prose-h3:text-primary prose-h3:uppercase prose-h3:italic">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <section>
                    <h3 className="text-lg font-bold flex items-center gap-2 text-primary">
                      <Layers className="h-4 w-4" /> 1. System Telemetry
                    </h3>
                    <p className="text-sm">Real-time visibility into the Agency's health. Tracks all client inquiries, cross-project mission tasks, and Digitiful service offerings.</p>
                  </section>
                  <section>
                    <h3 className="text-lg font-bold flex items-center gap-2 text-primary">
                      <ShieldCheck className="h-4 w-4" /> 2. Inquiry Management
                    </h3>
                    <p className="text-sm">Centralized intake for all external signals. Distinguishes between General Agency Inquiries and specific Booking Requests.</p>
                  </section>
                  <section>
                    <h3 className="text-lg font-bold flex items-center gap-2 text-primary">
                      <Package className="h-4 w-4" /> 3. Client Infrastructure
                    </h3>
                    <p className="text-sm">Management of client-specific assets, such as the **Alien Warehouse** artifact inventory and its custom sync tools.</p>
                  </section>
                </div>
                <div className="space-y-6">
                  <section>
                    <h3 className="text-lg font-bold flex items-center gap-2 text-primary">
                      <Cpu className="h-4 w-4" /> 4. Service Orchestration
                    </h3>
                    <p className="text-sm">Control Digitiful's public engineering identity. Manage what services are currently offered to prospective clients.</p>
                  </section>
                  <section>
                    <h3 className="text-lg font-bold flex items-center gap-2 text-primary">
                      <ScanLine className="h-4 w-4" /> 5. AI Linguistic Analysis
                    </h3>
                    <p className="text-sm">Vetting node used to ensure all Agency and Client (AWH) content maintains brand persona and human-centric score.</p>
                  </section>
                  <section className="bg-primary/5 p-4 rounded-lg border border-primary/10">
                    <h3 className="text-base font-bold flex items-center gap-2 text-white">
                      <Ghost className="h-4 w-4 text-primary" /> Client Access Protocol
                    </h3>
                    <p className="text-xs italic">Separate portals exist for clients (e.g., Alien Warehouse) to track their specific mission progress via Kanban and Activity Hubs.</p>
                  </section>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="brand" className="mt-6">
          <Card className="border-primary/20 bg-black/40">
            <CardHeader className="border-b border-primary/5">
              <div className="flex items-center gap-3">
                <Compass className="h-6 w-6 text-primary" />
                <div>
                  <CardTitle>Agency Brand Roadmap</CardTitle>
                  <CardDescription>Digitiful: Elite Digital Engineering Identity</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-8 prose prose-invert max-w-none">
              <div className="grid md:grid-cols-2 gap-12">
                <div>
                  <h3 className="text-primary uppercase italic font-bold mb-4">Core Agency Pillars</h3>
                  <div className="space-y-4">
                    <div className="border-l-2 border-primary pl-4">
                      <p className="font-bold text-white mb-1">Protocol // 01: Digital</p>
                    </div>
                    <div className="border-l-2 border-primary pl-4">
                      <p className="font-bold text-white mb-1">Protocol // 02: Precise</p>
                    </div>
                    <div className="border-l-2 border-primary pl-4">
                      <p className="font-bold text-white mb-1">Protocol // 03: Deliberate</p>
                    </div>
                  </div>

                  <h3 className="text-primary uppercase italic font-bold mt-8 mb-4">2. The Agency Palette</h3>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2 bg-black/60 p-2 rounded border border-primary/20">
                      <div className="h-4 w-4 rounded-full bg-[#9333ea]" />
                      <span className="text-[10px] font-code text-primary font-bold">Anomaly Purple</span>
                    </div>
                    <div className="flex items-center gap-2 bg-black/60 p-2 rounded border border-primary/20">
                      <div className="h-4 w-4 rounded-full bg-[#0a0a0a]" />
                      <span className="text-[10px] font-code text-muted-foreground">Void Black</span>
                    </div>
                    <div className="flex items-center gap-2 bg-black/60 p-2 rounded border border-primary/20">
                      <div className="h-4 w-4 rounded-full bg-[#22c55e]" />
                      <span className="text-[10px] font-code text-green-500 font-bold">Signal Green</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-primary uppercase italic font-bold mb-4">3. Visual Protocols</h3>
                  <ul className="text-sm space-y-2 text-muted-foreground">
                    <li><span className="text-white font-bold">Deep Web Underground:</span> Grids and UI overlays.</li>
                    <li><span className="text-white font-bold">Dark Room Imagery:</span> High-contrast, single-point lighting.</li>
                    <li><span className="text-white font-bold">Typography:</span> Inter (Agency Bold) and Monospace (System Readouts).</li>
                  </ul>

                  <h3 className="text-primary uppercase italic font-bold mt-8 mb-4">4. Client Relationship (AWH)</h3>
                  <div className="p-4 bg-primary/5 rounded border border-primary/10">
                    <p className="text-xs italic text-muted-foreground">" Digitiful serves as the technology engine for Alien Warehouse. All AWH assets are serviced through this node. "</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}


import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import Image from "next/image";
import placeholderData from '@/lib/placeholder-images.json';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Target, Sparkles, Code, Ghost, Rocket, ShieldAlert, Activity, Cpu, Layers, CheckCircle2, QrCode } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const values = [
    {
        icon: Rocket,
        title: "Velocity",
        description: "We don't build projects; we initiate launches. Our engineering speed is calibrated for the outer rim."
    },
    {
        icon: Ghost,
        title: "Sovereignty",
        description: "Owned tech. Local data. No masters. We build the infrastructure for digital independence."
    },
    {
        icon: ShieldAlert,
        title: "Anomalies Only",
        description: "Standard solutions are for standard businesses. We hunt for the artifacts that redefine possible."
    },
    {
        icon: Sparkles,
        title: "Artifacts",
        description: "The Alien Warehouse is our personal vault. We only drop what we believe is worth keeping."
    },
    {
        icon: Target,
        title: "Precision",
        description: "Meticulous architecture. Meticulous code. Extraterrestrial standards of accuracy."
    },
    {
        icon: Code,
        title: "Execution",
        description: "Every line of code is a digital gem. Every product is a tech drop from the future."
    }
];

export default function AboutPage() {
    const aboutImage = placeholderData.placeholderImages.find(p => p.id === 'about-me-alt');
    
    return (
        <div className="flex flex-col min-h-screen bg-black text-foreground selection:bg-primary selection:text-white font-sans">
            <Header />
            <main className="flex-grow py-20 sm:py-32 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.1),transparent)] relative overflow-hidden">
                {/* Background Grid Elements */}
                <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px]" />
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-6xl mx-auto">
                        <div className="mb-20 space-y-4">
                            <div className="flex items-center gap-2 mb-2 animate-fade-in">
                                <Activity className="h-4 w-4 text-primary animate-pulse" />
                                <span className="text-[10px] font-code text-primary uppercase tracking-[0.4em]">Node // Identity // Protocol</span>
                            </div>
                            <h1 className="font-headline text-6xl font-black tracking-tighter text-foreground sm:text-7xl md:text-8xl uppercase italic leading-[0.85] animate-fade-in-up">
                                Scouting <br/>
                                <span className="text-primary drop-shadow-[0_0_20px_rgba(147,51,234,0.3)]">The Signal.</span>
                            </h1>
                            <p className="max-w-xl text-lg text-muted-foreground font-medium animate-fade-in-up delay-100">
                                Digitiful is an elite digital engineering team dedicated to the outer rims of the frontier. We redesign core business systems using a Zero-Failure methodology.
                            </p>
                        </div>

                        <Separator className="mb-24 bg-primary/10" />
                        
                        <div className="grid lg:grid-cols-12 gap-16 items-start mb-32">
                            <div className="lg:col-span-7 space-y-12">
                                <section className="space-y-6 animate-fade-in-up delay-200">
                                    <div className="flex items-center gap-4 text-primary">
                                        <Cpu className="h-6 w-6" />
                                        <h2 className="text-2xl font-bold uppercase italic tracking-tight">High-Discipline Engineering</h2>
                                    </div>
                                    <p className="text-xl text-muted-foreground leading-relaxed font-medium">
                                        Since 2020, we've operated as a high-discipline digital systems partner. We don't just build websites; we redesign core business infrastructure from the ground up.
                                    </p>
                                    <p className="text-lg text-muted-foreground leading-relaxed">
                                        By integrating <span className="font-bold text-foreground">Decentralized Protocols</span>, <span className="font-bold text-foreground">Advanced AI</span>, and <span className="font-bold text-foreground">Hardened Data Sovereignty</span>, we ensure that your business isn't just online—it's untouchable. We bridge the gap between mass-market solutions and bespoke technical anomalies.
                                    </p>
                                </section>

                                <div className="grid sm:grid-cols-2 gap-8">
                                    <div className="p-6 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-md group hover:border-primary/30 transition-all">
                                        <Layers className="h-8 w-8 text-primary mb-4" />
                                        <h3 className="font-bold text-lg mb-2 uppercase italic">Zero-Waste</h3>
                                        <p className="text-sm text-muted-foreground">Operating with absolute efficiency. Every line of code serves a deliberate mission parameter.</p>
                                    </div>
                                    <div className="p-6 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-md group hover:border-primary/30 transition-all">
                                        <Activity className="h-8 w-8 text-primary mb-4" />
                                        <h3 className="font-bold text-lg mb-2 uppercase italic">Real-Time</h3>
                                        <p className="text-sm text-muted-foreground">Systems built for immediate throughput and zero-latency decision making.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="lg:col-span-5 sticky top-32 animate-fade-in-up delay-300">
                                <div className="relative aspect-[4/5] rounded-3xl overflow-hidden border border-white/10 shadow-2xl group">
                                    {aboutImage && (
                                        <Image
                                            src={aboutImage.imageUrl}
                                            alt={aboutImage.description}
                                            data-ai-hint={aboutImage.imageHint}
                                            fill
                                            className="object-cover opacity-60 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000 group-hover:scale-105"
                                        />
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                                    <div className="absolute bottom-8 left-8 right-8 p-6 bg-black/60 backdrop-blur-xl rounded-2xl border border-white/5">
                                        <p className="text-[10px] font-code text-primary uppercase tracking-[0.2em] mb-2">Protocol // Visualization</p>
                                        <p className="text-sm italic font-medium">" Meticulous architecture governed by zero-failure methodology. "</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-primary/5 border border-primary/20 rounded-[2.5rem] p-8 md:p-16 mb-32 relative overflow-hidden group">
                            <div className="absolute -top-24 -right-24 text-primary/10 opacity-20 rotate-12 transition-transform duration-1000 group-hover:rotate-[20deg] group-hover:scale-110">
                                <Ghost className="h-96 w-96" />
                            </div>
                            <div className="relative z-10 max-w-3xl">
                                <h2 className="text-4xl md:text-5xl font-black text-primary mb-8 uppercase italic leading-tight tracking-tighter">
                                    The Alien <br/>Warehouse.
                                </h2>
                                <p className="text-2xl font-medium text-foreground mb-10 border-l-4 border-primary pl-8 py-2 bg-gradient-to-r from-primary/5 to-transparent">
                                    "Inspired by the Alien Bodega, we curated a space for the anomalies."
                                </p>
                                <p className="text-lg text-muted-foreground leading-relaxed">
                                    The Alien Warehouse is our specialized tech-bazaar. It’s where we drop rare hardware, liberated codebases, and digital artifacts we've encountered on the outer rims of the digital frontier. These aren't mass-market products. These are one-time signals. 
                                </p>
                            </div>
                        </div>

                        <div className="text-center mb-16 space-y-4">
                            <h2 className="text-3xl font-black text-foreground uppercase tracking-tighter italic">Operational Codes</h2>
                            <p className="text-sm text-muted-foreground uppercase tracking-[0.3em]">Fundamental System Directives</p>
                        </div>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-40">
                            {values.map((value, index) => (
                                <Card key={index} className="group bg-neutral-900/40 backdrop-blur-md border-white/5 hover:border-primary/40 transition-all duration-500 hover:-translate-y-2">
                                    <CardHeader className="flex flex-col items-start gap-4">
                                        <div className="p-3 bg-primary/10 rounded-xl border border-primary/20 group-hover:bg-primary/20 transition-colors">
                                          <value.icon className="h-6 w-6 text-primary" />
                                        </div>
                                        <CardTitle className="text-lg font-bold tracking-tight uppercase italic text-foreground">{value.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-muted-foreground text-sm leading-relaxed">"{value.description}"</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Tactical Operator Card Section */}
                        <div className="max-w-4xl mx-auto border-t border-primary/10 pt-20 pb-10 flex flex-col items-center">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-12">
                                <CheckCircle2 className="h-3 w-3 text-primary" />
                                <span className="text-[8px] font-code text-primary uppercase tracking-[0.3em]">System Handshake // Finalized</span>
                            </div>

                            <div className="relative w-full max-w-lg p-8 md:p-12 rounded-[2.5rem] bg-neutral-900/80 border border-primary/20 backdrop-blur-2xl shadow-2xl shadow-primary/10 overflow-hidden group">
                                {/* Geometric Background Element */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full pointer-events-none" />
                                
                                <div className="relative z-10 flex flex-col gap-10">
                                    {/* Card Header with Glitch Slot */}
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-code text-primary uppercase tracking-[0.4em]">Manifesto // Ignition</p>
                                            <div className="h-0.5 w-12 bg-primary" />
                                        </div>
                                        <div className="relative h-20 w-20 bg-white/5 rounded-2xl border border-white/10 p-2 group-hover:border-primary/40 transition-colors duration-500 flex items-center justify-center text-[8px] text-center text-muted-foreground font-code leading-tight uppercase">
                                            picture corruptud ?
                                        </div>
                                    </div>

                                    {/* Main Card Content */}
                                    <div className="space-y-4">
                                        <h3 className="font-headline text-3xl md:text-4xl font-black italic tracking-tighter text-foreground leading-[0.9] uppercase">
                                            I don’t build systems. <br/>
                                            <span className="text-primary drop-shadow-[0_0_10px_rgba(147,51,234,0.3)]">I ignite them.</span>
                                        </h3>
                                    </div>

                                    {/* Operator Bio Node */}
                                    <div className="grid grid-cols-2 gap-8 pt-8 border-t border-white/5">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-code text-muted-foreground uppercase tracking-[0.2em]">Operator</p>
                                            <p className="text-lg font-black italic text-foreground tracking-tight uppercase">SAM // Digitiful</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-code text-muted-foreground uppercase tracking-[0.2em]">Status // Node</p>
                                            <p className="text-[10px] font-code text-primary uppercase leading-tight">
                                                Fire: Active <br/>
                                                45.5017° N, 73.5673° W
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Scanline Effect */}
                                <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(rgba(147,51,234,0)_50%,rgba(147,51,234,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] animate-pulse" />
                            </div>
                        </div>

                        <div className="mt-20 text-center space-y-8">
                            <div className="inline-block px-6 py-2 rounded-full border border-primary/20 bg-primary/5 animate-pulse">
                                <p className="text-[10px] font-code text-primary uppercase tracking-[0.5em]">
                                    SCANNING FOR NEXT SIGNAL... // SYSTEM READY.
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

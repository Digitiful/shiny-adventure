'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { CountdownTimer } from "@/components/ui/countdown-timer";
import { Badge } from "@/components/ui/badge";
import { Gavel, Loader2, AlertCircle, Rocket, Wifi, Activity, ShieldCheck, Globe } from "lucide-react";
import { cn } from '@/lib/utils';
import { useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { handlePlaceBid } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface AuctionItem {
    id: string;
    title: string;
    description: string;
    imageId: string;
    startingBid: number;
    currentBid: number;
    auctionEndDate: string;
    status: 'active' | 'sold' | 'expired';
    highestBidder?: string;
}

const getImageData = (id: string) => {
    // Return high-quality picsum placeholders for the anomalies
    return {
        imageUrl: `https://picsum.photos/seed/${id}/600/400`,
        description: "Alien Artifact",
        imageHint: "futuristic technology"
    };
}

function SignalIndicator({ id }: { id: string }) {
    const strength = (id.charCodeAt(0) % 5) + 1;
    return (
        <div className="flex items-center gap-1 text-[10px] font-code text-primary/60">
            <Wifi className="h-3 w-3" />
            <span className="uppercase tracking-widest">Signal: {strength}/5</span>
        </div>
    );
}

function BidDialog({ item }: { item: AuctionItem }) {
    const { user } = useUser();
    const { toast } = useToast();
    const [bidAmount, setBidAmount] = useState(item.currentBid + 50);
    const [isPending, setIsPending] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            toast({ title: "Identification Required", description: "You must be recognized by the system to place a bid.", variant: "destructive" });
            return;
        }

        setIsPending(true);
        const formData = new FormData();
        formData.append('itemId', item.id);
        formData.append('bidAmount', bidAmount.toString());
        formData.append('userId', user.uid);

        const result = await handlePlaceBid(formData);
        setIsPending(false);

        if (result.status === 'success') {
            toast({ title: "Bid Registered", description: "Your transmission was successful." });
            setIsOpen(false);
        } else {
            toast({ title: "Transmission Failed", description: result.message, variant: "destructive" });
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button className="w-full bg-primary/20 hover:bg-primary/40 border-primary/30 text-primary-foreground group relative overflow-hidden">
                    <div className="absolute inset-0 bg-primary/10 animate-pulse" />
                    <Activity className="mr-2 h-4 w-4 group-hover:animate-pulse z-10" />
                    <span className="z-10 font-bold uppercase tracking-widest">Place Bid</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-background/95 backdrop-blur-md border-primary/30">
                <DialogHeader>
                    <DialogTitle className="text-primary flex items-center gap-2">
                        <Rocket className="h-5 w-5" />
                        Initiate Acquisition: {item.title}
                    </DialogTitle>
                    <DialogDescription>
                        The current extraction price is ${item.currentBid.toLocaleString()}.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={onSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="bidAmount">Offer Amount ($)</Label>
                        <Input 
                            id="bidAmount" 
                            type="number" 
                            value={bidAmount} 
                            onChange={(e) => setBidAmount(parseFloat(e.target.value))} 
                            min={item.currentBid + 1}
                            required
                            className="bg-black/50 border-primary/20 focus:border-primary"
                        />
                    </div>
                    {!user && (
                        <p className="text-sm text-destructive font-medium animate-pulse">Scanning biometric ID... Unauthorized. Log in to bid.</p>
                    )}
                    <Button type="submit" className="w-full" disabled={isPending || !user}>
                        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Confirm Transmission
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default function WarehousePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: -1, y: -1 });
  const [isMouseInside, setIsMouseInside] = useState(false);
  const firestore = useFirestore();

  const auctionQuery = useMemoFirebase(
    () => firestore ? query(collection(firestore, 'auctionItems'), where('status', '==', 'active')) : null,
    [firestore]
  );

  const { data: items, isLoading, error } = useCollection<AuctionItem>(auctionQuery);

  useEffect(() => {
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
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-black">
      <div className="absolute inset-0 -z-0 h-full w-full bg-black bg-[radial-gradient(hsl(var(--primary)/0.15)_1px,transparent_1px)] [background-size:24px_24px]"></div>
      <div className="relative z-10">
        <Header />
        <main className="flex-grow py-20 sm:py-28">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-6 animate-fade-in shadow-[0_0_15px_rgba(147,51,234,0.3)]">
                    <ShieldCheck className="h-4 w-4 text-primary" />
                    <span className="text-[10px] font-code text-primary uppercase tracking-widest">Bazaar Reputation: Verified // Active Drops</span>
                </div>
                <h1 className="font-headline text-4xl font-bold tracking-tight text-primary sm:text-5xl md:text-6xl uppercase italic animate-pulse drop-shadow-[0_0_30px_rgba(147,51,234,0.5)]">
                  Warehouse
                </h1>
                <p className="mt-6 text-lg text-muted-foreground max-w-3xl mx-auto border-l-2 border-primary/50 pl-6 text-left italic bg-primary/5 py-4 rounded-r-lg">
                  " liberated technology from the outer rims of the digital frontier. rare artifacts. extraterrestrial anomalies. authenticate your presence to bid. "
                </p>
              </div>

              {error && (
                <Alert variant="destructive" className="mb-8 bg-destructive/10 border-destructive/50">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Firewall Breach</AlertTitle>
                    <AlertDescription>The secure vault is currently offline. Retrying connection.</AlertDescription>
                </Alert>
              )}

              {isLoading && (
                <div className="flex justify-center py-20">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                </div>
              )}

              {!isLoading && items?.length === 0 && (
                <div className="text-center py-20 bg-card/20 rounded-lg border border-primary/10 backdrop-blur-sm">
                    <p className="text-xl text-muted-foreground font-code">THE WAREHOUSE IS DARK. SCANNING FOR NEW SIGNAL... CHECK BACK SOON.</p>
                </div>
              )}

              <div
                ref={containerRef}
                className="relative grid md:grid-cols-1 lg:grid-cols-3 gap-8 items-stretch"
                style={{
                  // @ts-ignore
                  '--mouse-x': `${mousePosition.x}px`,
                  '--mouse-y': `${mousePosition.y}px`,
                  '--spotlight-opacity': isMouseInside ? 1 : 0,
                }}
              >
                <div 
                  className="pointer-events-none absolute -inset-px rounded-xl opacity-[var(--spotlight-opacity)] transition-opacity duration-300"
                  style={{
                    background: `radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), hsl(var(--primary)/0.15), transparent 40%)`,
                  }}
                />
                {items?.map((item) => {
                  const imgData = getImageData(item.imageId);
                  return (
                    <Card 
                      key={item.id} 
                      className="group flex flex-col overflow-hidden transition-all duration-300 bg-background/40 backdrop-blur-xl border border-primary/20 hover:border-primary/60 shadow-lg shadow-primary/5 hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-2 z-10"
                    >
                      <div className="relative h-60 w-full overflow-hidden">
                        <Image
                          src={imgData.imageUrl}
                          alt={imgData.description}
                          data-ai-hint={imgData.imageHint}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                        <div className="absolute top-3 left-3">
                          <Badge variant="destructive" className="animate-pulse text-[10px] bg-red-600/80 border-none font-bold uppercase tracking-widest shadow-[0_0_10px_rgba(220,38,38,0.5)]">
                            <Gavel className="mr-1 h-3 w-3" />
                            Live Extraction
                          </Badge>
                        </div>
                        <div className="absolute top-3 right-3 bg-black/60 px-2 py-1 rounded border border-primary/30">
                            <SignalIndicator id={item.id} />
                        </div>
                      </div>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">{item.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="flex flex-col flex-grow">
                        <CardDescription className="text-muted-foreground/80 italic text-xs mb-4">"{item.description}"</CardDescription>
                        <div className="mt-auto">
                          <p className="text-[10px] text-muted-foreground font-code tracking-tighter uppercase opacity-60">Signal Strength (Current Bid)</p>
                          <p className="text-4xl font-bold text-primary font-mono drop-shadow-[0_0_15px_hsl(var(--primary)/0.6)] animate-pulse">
                            ${item.currentBid.toLocaleString()}
                          </p>
                        </div>
                      </CardContent>
                      <CardFooter className="flex flex-col gap-4 bg-primary/5 p-4 mt-auto border-t border-primary/20">
                        <div className="w-full flex items-center justify-between text-[10px] font-code uppercase tracking-widest text-muted-foreground mb-1">
                            <span>Extraction Deadline:</span>
                        </div>
                        <CountdownTimer endDate={item.auctionEndDate} />
                        <BidDialog item={item} />
                      </CardFooter>
                    </Card>
                  )
                })}
              </div>
              
              <div className="mt-20 flex flex-col items-center gap-4 text-center border-t border-primary/10 pt-12">
                  <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 flex items-center gap-4 hover:bg-primary/10 transition-colors cursor-default">
                      <Globe className="h-8 w-8 text-primary animate-spin-slow" />
                      <div className="text-left">
                          <p className="font-bold text-foreground">Global Operations Active</p>
                          <p className="text-xs text-muted-foreground">Bridging eBay artifacts with private digital scouting.</p>
                      </div>
                  </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
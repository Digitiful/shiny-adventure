"use client"

import { successStories as fallbackStories } from '@/lib/data';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query } from 'firebase/firestore';
import { Loader2, TrendingUp, Target, Star, Gamepad2, Code, ShieldCheck, Zap, Activity } from 'lucide-react';
import { Clients } from './clients';

const resultIcons: { [key: string]: React.ElementType } = {
  TrendingUp,
  Target,
  Star,
  Gamepad2,
  Code,
};

interface PortfolioResult {
  icon: string;
  label: string;
}

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  imageId: string | null;
  testimonial?: {
    text: string;
    author: string;
    avatar: string;
  };
  results: PortfolioResult[];
}

const StoryCard = ({ story, index }: { story: any, index: number }) => {
    return (
      <div className="group flex flex-col h-full">
        <Card className="flex flex-col h-full overflow-hidden bg-neutral-950 border border-primary/10 shadow-2xl transition-all duration-700 hover:border-primary/40 hover:-translate-y-2 relative font-mono">
          
          {/* Mission Header */}
          <div className="flex items-center justify-between p-4 border-b border-primary/5 bg-black/40">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-3.5 w-3.5 text-primary animate-pulse" />
              <span className="text-[10px] font-bold text-primary uppercase tracking-[0.3em]">Mission // FILE_{String(index + 1).padStart(2, '0')}</span>
            </div>
            <div className="flex items-center gap-1 px-2 py-0.5 bg-green-500/10 border border-green-500/20 rounded">
               <div className="h-1 w-1 rounded-full bg-green-500 animate-pulse" />
               <span className="text-[8px] font-bold text-green-500 uppercase tracking-widest">Signal Secured</span>
            </div>
          </div>

          {story.imageData && (
            <div className="relative h-64 w-full overflow-hidden bg-black/80 flex items-center justify-center p-8">
              <div className="relative w-full h-full max-h-[180px]">
                <Image
                  src={story.imageData.imageUrl}
                  alt={story.imageData.description}
                  data-ai-hint={story.imageData.imageHint}
                  fill
                  className="object-contain transition-all duration-1000 group-hover:scale-110"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent pointer-events-none" />
            </div>
          )}

          <CardHeader className="pt-8 px-6">
            <CardTitle className="text-3xl font-black italic tracking-tighter text-foreground uppercase group-hover:text-primary transition-all duration-500 leading-none">
              {story.title}
            </CardTitle>
          </CardHeader>

          <CardContent className="flex-grow space-y-8 pt-2 px-6">
            <p className="text-muted-foreground text-sm leading-relaxed italic border-l-2 border-primary/20 pl-4 py-1">
              "{story.description}"
            </p>
            
            {/* Technical Results Grid */}
            <div className="grid grid-cols-1 gap-4 pt-2">
                {story.results.map((result: any, i: number) => {
                    const Icon = result.icon;
                    return (
                      <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-primary/5 border border-primary/10 transition-all duration-500 group-hover:bg-primary/10 group-hover:translate-x-1">
                          <div className="p-2 bg-primary/20 rounded-lg shadow-[0_0_15px_rgba(147,51,234,0.3)]">
                              <Icon className="h-4 w-4 text-primary" />
                          </div>
                          <div className="space-y-0.5">
                            <span className="block text-[12px] font-black text-foreground uppercase tracking-widest">{result.label}</span>
                            <span className="block text-[8px] text-primary/40 uppercase tracking-[0.2em]">Verified Telemetry</span>
                          </div>
                      </div>
                    )
                })}
            </div>

          </CardContent>

          {story.testimonial && (
              <CardFooter className="bg-black/60 p-8 border-t border-primary/10 mt-auto relative overflow-hidden">
                  <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                  
                  <div className="relative z-10 space-y-6">
                    <div className="relative">
                        <Activity className="absolute -left-2 -top-2 h-8 w-8 text-primary/5 opacity-50" />
                        <p className="text-[12px] leading-relaxed text-muted-foreground italic font-medium relative">
                        {story.testimonial.text}
                        </p>
                    </div>
                    
                    <div className="flex items-center justify-between gap-4 pt-4 border-t border-white/5">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border border-primary/30 ring-4 ring-primary/5">
                            <AvatarImage src={story.testimonial.avatar} alt={story.testimonial.author} />
                            <AvatarFallback className="bg-primary/20 text-[10px]">{story.testimonial.author[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="text-[11px] font-black text-foreground uppercase tracking-widest">{story.testimonial.author}</p>
                            <p className="text-[8px] text-primary/60 uppercase">Master Signatory</p>
                        </div>
                      </div>
                    </div>
                  </div>
              </CardFooter>
          )}
        </Card>
      </div>
    );
}

export function SuccessStories() {
  const firestore = useFirestore();

  const portfolioQuery = useMemoFirebase(
    () => firestore ? query(collection(firestore, 'portfolioItems')) : null,
    [firestore]
  );

  const { data: dbStories, isLoading } = useCollection<PortfolioItem>(portfolioQuery);

  const displayStories = dbStories && dbStories.length > 0
    ? dbStories.map(s => ({
        ...s,
        imageData: s.imageId ? { imageUrl: s.imageId.startsWith('http') ? s.imageId : `https://picsum.photos/seed/${s.imageId}/800/600`, description: s.title, imageHint: "technology" } : null,
        results: s.results.map(r => ({ ...r, icon: resultIcons[r.icon] || Star }))
      }))
    : fallbackStories;

  return (
    <section id="portfolio" className="py-24 sm:py-32 bg-black border-y border-primary/10 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-24 space-y-6">
          <div className="flex flex-col items-center justify-center gap-4 mb-2">
            <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary animate-bounce" />
                <span className="text-[10px] font-mono text-primary uppercase tracking-[0.5em] font-black">Proof of Work // Archive Node</span>
            </div>
            <div className="h-px w-24 bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
          </div>
          <h2 className="font-headline text-5xl sm:text-7xl font-black tracking-tighter text-foreground uppercase italic leading-none">
            Mission <br/>
            <span className="text-primary drop-shadow-[0_0_20px_rgba(147,51,234,0.4)]">Logs.</span>
          </h2>
        </div>

        {isLoading && dbStories === null ? (
            <div className="flex justify-center py-20">
                <Loader2 className="h-10 w-10 animate-spin text-primary/50" />
            </div>
        ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch max-w-6xl mx-auto">
              {displayStories.map((story, i) => (
                  <div key={story.id} className="h-full">
                      <StoryCard story={story} index={i} />
                  </div>
              ))}
            </div>
        )}

        <Clients />

        <div className="mt-24 text-center">
            <p className="text-[9px] font-mono text-muted-foreground uppercase tracking-[0.6em] animate-pulse">
                SCALING CORE INFRASTRUCTURE... // SYSTEMS STANDING BY.
            </p>
        </div>
      </div>
    </section>
  );
}

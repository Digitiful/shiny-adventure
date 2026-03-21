
"use client"

import { successStories as fallbackStories } from '@/lib/data';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import Link from 'next/link';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query } from 'firebase/firestore';
import { Loader2, TrendingUp, Target, Star, Gamepad2, Code } from 'lucide-react';

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

const StoryCard = ({ story }: { story: any }) => {
    return (
      <Link href={`/portfolio/${story.id}`} className="flex flex-col h-full">
        <Card className="flex flex-col h-full overflow-hidden bg-card border border-primary/20 shadow-lg shadow-primary/5 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/20">
          {story.imageData && (
            <div className="relative h-48 w-full bg-black/10">
              <Image
                src={story.imageData.imageUrl}
                alt={story.imageData.description}
                data-ai-hint={story.imageData.imageHint}
                fill
                className="object-contain"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          )}
          <CardHeader>
            <CardTitle className="text-xl font-bold">{story.title}</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow space-y-4">
            <p className="text-muted-foreground text-sm">{story.description}</p>
            
            <div className="space-y-2 pt-2">
                {story.results.map((result: any, index: number) => {
                    const Icon = result.icon;
                    return (
                      <div key={index} className="flex items-center gap-3 text-sm">
                          <div className="p-1.5 bg-primary/10 rounded-full">
                              <Icon className="h-4 w-4 text-primary" />
                          </div>
                          <span className="font-medium text-foreground/90">{result.label}</span>
                      </div>
                    )
                })}
            </div>

          </CardContent>
          {story.testimonial && (
              <CardFooter className="bg-primary/5 p-4 mt-auto">
                  <div className="flex items-start gap-4">
                  <Avatar className="h-10 w-10 border-2 border-primary/50">
                      <AvatarImage src={story.testimonial.avatar} alt={story.testimonial.author} />
                      <AvatarFallback>{story.testimonial.author.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                      <blockquote className="text-sm italic text-muted-foreground before:content-['“'] after:content-['”']">
                      {story.testimonial.text}
                      </blockquote>
                      <p className="text-xs font-bold text-foreground/80 mt-2 text-right">- {story.testimonial.author}</p>
                  </div>
                  </div>
              </CardFooter>
          )}
        </Card>
      </Link>
    );
}

export function SuccessStories() {
  const firestore = useFirestore();

  const portfolioQuery = useMemoFirebase(
    () => firestore ? query(collection(firestore, 'portfolioItems')) : null,
    [firestore]
  );

  const { data: dbStories, isLoading } = useCollection<PortfolioItem>(portfolioQuery);

  // Fallback and formatting logic
  const displayStories = dbStories && dbStories.length > 0
    ? dbStories.map(s => ({
        ...s,
        imageData: s.imageId ? { imageUrl: `https://picsum.photos/seed/${s.imageId}/600/400`, description: s.title, imageHint: "tech" } : null,
        results: s.results.map(r => ({ ...r, icon: resultIcons[r.icon] || Star }))
      }))
    : fallbackStories;

  return (
    <section id="portfolio" className="py-20 sm:py-28 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="font-headline text-3xl font-bold tracking-tight text-primary sm:text-4xl md:text-5xl uppercase italic">
            Success Stories
          </h2>
          <p className="mt-6 text-lg text-muted-foreground font-medium">
            Missions completed. Frequencies secured. Digital artifacts of elite engineering.
          </p>
        </div>

        {isLoading && dbStories === null ? (
            <div className="flex justify-center py-20">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        ) : (
            <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-8 items-stretch max-w-5xl mx-auto">
            {displayStories.map((story) => (
                <div key={story.id} className="h-full">
                    <StoryCard story={story} />
                </div>
            ))}
            </div>
        )}
      </div>
    </section>
  );
}

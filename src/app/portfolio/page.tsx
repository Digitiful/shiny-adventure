
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { successStories } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function PortfolioPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow py-20 sm:py-28">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground/80 sm:text-5xl md:text-6xl">
                Our Portfolio
              </h1>
              <p className="mt-6 text-lg text-muted-foreground max-w-3xl mx-auto">
                Explore our collection of success stories and see how we've helped businesses like yours achieve remarkable results.
              </p>
            </div>

            <div className="grid md:grid-cols-1 gap-12">
              {successStories.map((story) => (
                <Link key={story.id} href={story.href || '#'}>
                <Card 
                  className={cn(
                    "group w-full overflow-hidden transition-all duration-300 bg-card border md:grid md:grid-cols-2 items-center",
                    "hover:border-primary/80 hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-2"
                  )}
                >
                  <div className="relative h-64 md:h-full w-full overflow-hidden">
                    {story.imageData && (
                      <Image
                        src={story.imageData.imageUrl}
                        alt={story.imageData.description}
                        data-ai-hint={story.imageData.imageHint}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:bg-gradient-to-r" />
                  </div>
                  <div className="p-8">
                    <CardHeader>
                      <CardTitle className="text-2xl font-bold">{story.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col flex-grow pt-0">
                      <p className="text-muted-foreground text-sm mb-6">{story.description}</p>
                      
                      <div className="flex items-center gap-2 text-primary font-semibold mt-auto">
                        <span>Read Case Study</span>
                        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </div>
                    </CardContent>
                  </div>
                </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

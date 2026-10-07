import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { successStories } from "@/lib/data";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function PortfolioDetailPage({ params }: { params: { id: string } }) {
  const story = successStories.find((p) => p.id === params.id);

  if (!story) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow py-20 sm:py-28">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <Link href="/portfolio" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                <ArrowLeft className="h-4 w-4" />
                Back to Portfolio
              </Link>
            </div>

            <article>
                <header className="mb-12">
                     {story.imageData && (
                        <div className="relative aspect-video w-full overflow-hidden rounded-lg shadow-lg mb-8 border">
                            <Image
                                src={story.imageData.imageUrl}
                                alt={story.imageData.description}
                                data-ai-hint={story.imageData.imageHint}
                                fill
                                className="object-cover"
                            />
                             <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        </div>
                     )}
                    <h1 className="text-4xl font-bold mb-4 text-primary">{story.title}</h1>
                    <p className="text-lg text-muted-foreground">{story.description}</p>
                </header>

                <div className="prose prose-invert lg:prose-xl max-w-none mx-auto text-foreground/90">
                    {/* This is where you could put more detailed content about the case study, maybe from a CMS or markdown file */}
                    <p>This case study demonstrates a significant achievement in digital transformation. Our team undertook a complete overhaul of the client's existing infrastructure, focusing on scalability, performance, and user experience. The project involved several key phases, from initial discovery and strategic planning to implementation and post-launch optimization.</p>
                    
                    <h3 className="text-2xl font-bold text-foreground mt-8 mb-4">Project Goals</h3>
                    <ul>
                        <li>Enhance system performance and reliability.</li>
                        <li>Improve user conversion rates through a redesigned interface.</li>
                        <li>Migrate legacy data to a modern cloud-based platform.</li>
                        <li>Implement a robust analytics framework for data-driven insights.</li>
                    </ul>

                    <h3 className="text-2xl font-bold text-foreground mt-8 mb-4">Results & Outcomes</h3>
                    <p>The project was a resounding success, exceeding all initial KPIs. The migration was completed ahead of schedule, and the new platform has demonstrated exceptional stability and performance. The key outcomes are highlighted below.</p>
                </div>
                
                 <div className="my-12 grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {story.results.map((result, index) => (
                        <Card key={index} className="bg-card/50">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">{result.label}</CardTitle>
                                <result.icon className="h-5 w-5 text-primary" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-foreground">Achieved</div>
                                <p className="text-xs text-muted-foreground">Exceeded initial project goals</p>
                            </CardContent>
                        </Card>
                    ))}
                 </div>

                {story.testimonial && (
                    <Card className="bg-primary/5 border-primary/20 shadow-lg">
                        <CardHeader>
                             <div className="flex items-center gap-4">
                                <Avatar className="h-14 w-14 border-2 border-primary/50">
                                    <AvatarImage src={story.testimonial.avatar} alt={story.testimonial.author} />
                                    <AvatarFallback>{story.testimonial.author.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-bold text-lg">{story.testimonial.author}</p>
                                    <p className="text-sm text-muted-foreground">Client Testimonial</p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <blockquote className="text-xl italic text-foreground/90 border-l-4 border-primary pl-6">
                                {story.testimonial.text}
                            </blockquote>
                        </CardContent>
                    </Card>
                )}
            </article>

          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export async function generateStaticParams() {
  return successStories.map((story) => ({
    id: story.id,
  }));
}

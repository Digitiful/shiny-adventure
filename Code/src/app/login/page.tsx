import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { LoginForm } from "@/components/forms/login-form";
import Image from "next/image";
import Link from "next/link";
import placeholderData from '@/lib/placeholder-images.json';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  const loginImage = placeholderData.placeholderImages.find(p => p.id === 'about-me-alt');
  
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow flex items-center justify-center py-20 sm:py-28">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center max-w-4xl mx-auto">
             <div className="hidden md:block relative aspect-square">
                 {loginImage && (
                    <Image
                        src={loginImage.imageUrl}
                        alt={loginImage.description}
                        data-ai-hint={loginImage.imageHint}
                        fill
                        className="object-cover rounded-2xl shadow-2xl shadow-primary/20"
                    />
                 )}
                 <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-2xl" />
             </div>
             <Card className="bg-card/80 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold text-primary">Admin Login</CardTitle>
                    <CardDescription>
                      Enter your credentials to access the dashboard.
                      <div className="mt-2 text-xs opacity-70">
                        First time? <Link href="/setup" className="text-primary hover:underline font-bold">Initiate Admin Setup</Link>
                      </div>
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <LoginForm />
                </CardContent>
             </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

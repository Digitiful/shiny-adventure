
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/sections/hero";
import { Services } from "@/components/sections/services";
import { BookingTerminal } from "@/components/sections/booking-terminal";
import { About } from "@/components/sections/about";
import { BackToTopButton } from "@/components/ui/back-to-top";
import { Clients } from "@/components/sections/clients";
import { Technology } from "@/components/sections/technology";
import { SuccessStories } from "@/components/sections/success-stories";
import { BrandPillars } from "@/components/sections/brand-pillars";

function SignalTicker() {
  return (
    <div className="bg-primary/10 border-y border-primary/20 py-3 overflow-hidden whitespace-nowrap">
      <div className="flex animate-marquee-slow items-center gap-8">
        {Array.from({ length: 10 }).map((_, i) => (
          <span key={i} className="text-[10px] font-code text-primary uppercase tracking-[0.3em] flex items-center gap-4">
            <span className="text-white font-black italic">[ DIGITAL. PRECISE. DELIBERATE. ]</span>
            <span className="text-white opacity-50">44 MISSIONS COMPLETED</span>
            <span className="text-primary">$5,000+ CAPITAL SECURED</span>
            <span className="text-white opacity-50">NODE: MONTREAL-NY // FREQUENCIES STABLE</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow">
        <Hero />
        <SignalTicker />
        <BrandPillars />
        <BookingTerminal />
        <About />
        <Services />
        <Technology />
        <SuccessStories />
        <Clients />
      </main>
      <Footer />
      <BackToTopButton />
    </div>
  );
}

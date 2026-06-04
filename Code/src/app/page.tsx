import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/sections/hero";
import { Services } from "@/components/sections/services";
import { BookingTerminal } from "@/components/sections/booking-terminal";
import { About } from "@/components/sections/about";
import { BackToTopButton } from "@/components/ui/back-to-top";
import { Technology } from "@/components/sections/technology";
import { SuccessStories } from "@/components/sections/success-stories";
import { BrandPillars } from "@/components/sections/brand-pillars";

/**
 * @fileOverview Main Entry Node.
 * Identity: BEYOND DIGITAL // Operator SAM
 * Status: PRIME DAY // LIVE BROADCAST
 */

function SignalTicker() {
  return (
    <div className="bg-primary/10 border-y border-primary/20 py-3 overflow-hidden whitespace-nowrap">
      <div className="flex animate-marquee-slow items-center gap-8">
        {Array.from({ length: 10 }).map((_, i) => (
          <span key={i} className="text-[10px] font-mono text-primary uppercase tracking-[0.3em] flex items-center gap-4">
            <span className="text-white font-black italic">[ BEYOND DIGITAL. PRIME DAY IGNITION. ]</span>
            <span className="text-white opacity-50">NODE: LIVE BROADCAST</span>
            <span className="text-primary">SYSTEM UPTIME: 99.99%</span>
            <span className="text-white opacity-50">NODE: MONTREAL-NY // SIGNAL STABLE</span>
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
        <BookingTerminal />
        <BrandPillars />
        <Services />
        <About />
        <Technology />
        <SuccessStories />
      </main>
      <Footer />
      <BackToTopButton />
    </div>
  );
}

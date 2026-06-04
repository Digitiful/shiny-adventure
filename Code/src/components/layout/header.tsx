
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, LogOut, User, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { navLinks } from "@/lib/data";
import { cn } from "@/lib/utils";
import { HeaderLogo } from "./logo";
import { useUser, useAuth } from "@/firebase";
import { signOut } from "firebase/auth";
import { usePathname } from "next/navigation";

/**
 * @fileOverview Navigation Hub.
 * Optimized for transparency and seamless integration with high-impact hero sections.
 * Identity: SAM // Digitiful
 */

export function Header() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
  };
  
  const mainNavLinks = navLinks.filter(link => !link.authOnly);
  const isAdminSection = pathname.startsWith('/admin');

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 w-full transition-all duration-500",
        isScrolled || isAdminSection 
          ? "bg-background/90 backdrop-blur-md border-b border-primary/10 py-3" 
          : "bg-transparent py-5"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <HeaderLogo />
          
          <nav className="hidden md:flex items-center gap-8">
            {mainNavLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[10px] font-code font-bold uppercase tracking-[0.3em] text-foreground/70 transition-all hover:text-primary hover:tracking-[0.4em]"
              >
                {link.label}
              </Link>
            ))}
             {user && (
                 <Link href="/dashboard" className="text-[10px] font-code font-bold uppercase tracking-[0.3em] text-foreground/70 transition-all hover:text-primary">
                    Project Hub
                </Link>
            )}
          </nav>

          <div className="flex items-center gap-3">
            {!isUserLoading && (
              <>
                {user ? (
                  <div className="flex items-center gap-3">
                    <Link href="/admin">
                       <Button variant="outline" size="sm" className="h-8 border-primary/20 text-[9px] font-bold uppercase tracking-widest bg-primary/5">
                          <ShieldCheck className="mr-2 h-3 w-3" />
                          Admin
                       </Button>
                    </Link>
                    <Button variant="ghost" size="sm" onClick={handleLogout} className="h-8 text-[9px] font-bold uppercase tracking-widest text-muted-foreground hover:text-destructive">
                      <LogOut className="mr-2 h-3 w-3" />
                      Exit
                    </Button>
                  </div>
                ) : (
                  <>
                    <Link href="/login" passHref className="hidden md:block">
                      <Button variant="ghost" size="icon" className="text-foreground/50 hover:text-primary">
                        <User className="h-5 w-5" />
                        <span className="sr-only">Login</span>
                      </Button>
                    </Link>
                  </>
                )}
              </>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-primary"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              <span className="sr-only">Toggle menu</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Terminal Nav */}
      {isMenuOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur-xl border-b border-primary/20 animate-fade-in">
          <nav className="container mx-auto px-4 py-8 flex flex-col gap-6">
            {mainNavLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-bold text-foreground/80 uppercase tracking-widest hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {user && (
              <Link href="/dashboard" className="text-sm font-bold text-foreground/80 uppercase tracking-widest hover:text-primary" onClick={() => setIsMenuOpen(false)}>
                Project Hub
              </Link>
            )}
             {!user && (
                <Link href="/login" className="text-sm font-bold text-primary uppercase tracking-widest" onClick={() => setIsMenuOpen(false)}>
                  Access Login
                </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

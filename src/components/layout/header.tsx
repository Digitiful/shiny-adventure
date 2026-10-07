
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

export function Header() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
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
        "sticky top-0 z-50 w-full transition-all duration-300",
        isScrolled || isAdminSection ? "bg-background/80 backdrop-blur-sm border-b border-border" : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          <HeaderLogo />
          <nav className="hidden md:flex items-center gap-6">
            {mainNavLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
             {user && (
                 <Link href="/dashboard" className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary">
                    Dashboard
                </Link>
            )}
          </nav>
          <div className="flex items-center gap-2">
            {!isUserLoading && (
              <>
                {user ? (
                  <div className="flex items-center gap-2">
                    <Link href="/admin">
                       <Button variant="outline" size="sm">
                          <ShieldCheck className="mr-2 h-4 w-4" />
                          Admin
                       </Button>
                    </Link>
                    <Button variant="ghost" size="sm" onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </Button>
                  </div>
                ) : (
                  <>
                    <Link href="/contact" passHref className="hidden md:block">
                      <Button variant="ghost">Contact</Button>
                    </Link>
                    <Link href="/login" passHref className="hidden md:block">
                      <Button variant="ghost" size="icon">
                        <User className="h-6 w-6" />
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
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              <span className="sr-only">Toggle menu</span>
            </Button>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-sm pb-4">
          <nav className="container mx-auto px-4 flex flex-col gap-4">
            {mainNavLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-lg font-medium text-foreground/80 transition-colors hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {user && (
              <>
                 <Link href="/dashboard" className="text-lg font-medium text-foreground/80 transition-colors hover:text-primary" onClick={() => setIsMenuOpen(false)}>
                    Dashboard
                </Link>
                 <Link href="/admin" className="text-lg font-medium text-foreground/80 transition-colors hover:text-primary" onClick={() => setIsMenuOpen(false)}>
                    Admin
                </Link>
              </>
            )}
             {!user && (
              <>
                <Link href="/contact" className="text-lg font-medium text-foreground/80 transition-colors hover:text-primary" onClick={() => setIsMenuOpen(false)}>
                  Contact
                </Link>
                <Link href="/login" passHref>
                   <Button variant="ghost" className="w-full justify-start" onClick={() => setIsMenuOpen(false)}>
                      <User className="mr-2 h-5 w-5" />
                      Login
                    </Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

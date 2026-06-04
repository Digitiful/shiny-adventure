import React from 'react';
import { FooterLogo } from './logo';
import Link from 'next/link';
import { navLinks } from '@/lib/data';
import { Github, Linkedin, Mail } from 'lucide-react';
import Image from 'next/image';

const socialLinks = [
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/company/digitiful',
    icon: Linkedin,
  },
  {
    name: 'GitHub',
    href: 'https://github.com/Digitiful/shiny-adventure',
    icon: Github,
  },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t" id="contact">
      <div className="container mx-auto px-4 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Logo & Mission */}
          <div className="md:col-span-4">
            <div className="mb-4">
              <FooterLogo />
            </div>
            <p className="text-muted-foreground text-sm max-w-xs">
              Delivering measurable digital transformation and impactful results through data-driven strategies.
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-2">
            <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect With Us */}
          <div className="md:col-span-3">
             <h3 className="font-semibold text-foreground mb-4">Connect With Us</h3>
             <div className="flex space-x-4 mb-4">
              {socialLinks.map((social, index) => (
                <Link key={`${social.name}-${index}`} href={social.href} className="text-muted-foreground hover:text-primary transition-colors" target="_blank" rel="noopener noreferrer">
                    <social.icon className="h-6 w-6" />
                    <span className="sr-only">{social.name}</span>
                </Link>
              ))}
            </div>
            <Link href="/#terminal" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Contact Terminal
            </Link>
          </div>
          
          {/* Legal */}
          <div className="md:col-span-3">
            <h3 className="font-semibold text-foreground mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="https://digitiful.net/privacy-policy-3/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="https://digitiful.net/Terms/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="https://digitiful.net/DMCA/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  DMCA
                </Link>
              </li>
            </ul>
            <a href="https://www.eff.org/join" target="_blank" rel="noopener noreferrer" className="mt-4 inline-block">
              <Image 
                  src="https://www.eff.org/files/eff-join2_0.png" 
                  alt="Join EFF!" 
                  width={48} 
                  height={8}
              />
            </a>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-border/50 flex flex-col sm:flex-row justify-between items-center">
           <p className="text-sm text-muted-foreground">
            &copy; {currentYear} Digitiful. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

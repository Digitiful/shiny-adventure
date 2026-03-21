'use client';

import React, { useState, useEffect } from 'react';
import { HeaderLogo } from '@/components/layout/logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShieldCheck, Activity, Zap, Send, Loader2, Wifi } from 'lucide-react';
import Link from 'next/link';

function SignalPulse() {
  return (
    <div className="relative flex items-center justify-center h-32 w-32 mb-8">
      <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
      <div className="absolute inset-2 bg-primary/10 rounded-full animate-pulse" />
      <div className="relative z-10 p-6 bg-black border border-primary/40 rounded-full shadow-[0_0_30px_rgba(147,51,234,0.3)]">
        <Zap className="h-10 w-10 text-primary" />
      </div>
    </div>
  );
}

export default function ComingSoonPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [latency, setLatency] = useState(24);

  useEffect(() => {
    const interval = setInterval(() => {
      setLatency(Math.floor(Math.random() * (45 - 18) + 18));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus('submitting');
    setTimeout(() => setStatus('success'), 2000);
  };

  return (
    <main className="min-h-screen bg-black text-foreground font-sans flex flex-col items-center justify-center p-4 overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(circle_at_center,hsl(var(--primary)/0.2),transparent_70%)]">
        <div className="h-full w-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      </div>

      <div className="max-w-xl w-full flex flex-col items-center text-center relative z-10">
        <div className="mb-12 animate-fade-in">
          <HeaderLogo />
        </div>

        <SignalPulse />

        <div className="space-y-4 mb-12">
          <div className="flex items-center justify-center gap-2 mb-2 animate-fade-in">
            <Activity className="h-4 w-4 text-primary animate-pulse" />
            <span className="text-[10px] font-code text-primary uppercase tracking-[0.4em]">Node // Launch // Protocol</span>
          </div>
          <h1 className="font-headline text-5xl sm:text-6xl font-black tracking-tighter uppercase italic leading-none animate-fade-in-up">
            Preparing <br/>
            <span className="text-primary drop-shadow-[0_0_20px_rgba(147,51,234,0.3)]">The Ignition.</span>
          </h1>
          <p className="text-muted-foreground text-sm font-medium tracking-wide uppercase font-code opacity-70">
            [ PHASE 01: SILENT SIGNAL ACTIVE ]
          </p>
        </div>

        <div className="w-full bg-neutral-900/50 backdrop-blur-xl border border-primary/20 rounded-2xl p-8 shadow-2xl animate-fade-in-up delay-200">
          {status === 'success' ? (
            <div className="space-y-4 py-4">
              <div className="h-12 w-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/40">
                <ShieldCheck className="h-6 w-6 text-green-500" />
              </div>
              <h3 className="text-xl font-bold italic uppercase">Signal Secured</h3>
              <p className="text-sm text-muted-foreground font-medium">Authentication successful. You will receive launch coordinates shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="space-y-6">
              <div className="text-left space-y-2">
                <label className="text-[10px] font-code text-primary uppercase tracking-[0.2em] ml-1">Identity // Signal Capture</label>
                <div className="relative">
                  <Input 
                    type="email" 
                    placeholder="ENTER_SECURE_EMAIL@SIGNAL.COM" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-black/50 border-primary/30 h-12 focus:border-primary text-xs font-code uppercase tracking-widest pl-4"
                    disabled={status === 'submitting'}
                    required
                  />
                </div>
              </div>
              <Button 
                type="submit" 
                className="w-full h-12 font-bold uppercase tracking-[0.2em] italic"
                disabled={status === 'submitting'}
              >
                {status === 'submitting' ? <Loader2 className="h-4 w-4 animate-spin" /> : "Authenticate Signal"}
              </Button>
            </form>
          )}
        </div>

        <div className="mt-12 grid grid-cols-3 gap-8 w-full border-t border-primary/10 pt-8 animate-fade-in delay-300">
          <div className="space-y-1">
            <p className="text-[10px] font-code text-primary uppercase tracking-widest">Status</p>
            <p className="text-xs font-bold italic uppercase">Live Pre-Launch</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-code text-primary uppercase tracking-widest">Node</p>
            <p className="text-xs font-bold italic uppercase">MTL-NY</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-code text-primary uppercase tracking-widest">Latency</p>
            <p className="text-xs font-bold italic uppercase font-code">{latency}MS</p>
          </div>
        </div>

        <div className="mt-16 flex items-center gap-6 animate-fade-in delay-500">
          <Link href="/spec" className="text-[10px] font-code text-muted-foreground hover:text-primary transition-colors uppercase tracking-[0.3em] border-b border-transparent hover:border-primary pb-1">
            View // Spec
          </Link>
          <div className="h-1 w-1 rounded-full bg-primary/20" />
          <Link href="/login" className="text-[10px] font-code text-muted-foreground hover:text-primary transition-colors uppercase tracking-[0.3em] border-b border-transparent hover:border-primary pb-1">
            Operator // Login
          </Link>
        </div>
      </div>
    </main>
  );
}
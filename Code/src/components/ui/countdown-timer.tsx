"use client";

import { useState, useEffect } from 'react';

interface CountdownTimerProps {
  endDate: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function CountdownTimer({ endDate }: CountdownTimerProps) {
  const calculateTimeLeft = (): TimeLeft | null => {
    const difference = +new Date(endDate) - +new Date();
    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return null;
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

  useEffect(() => {
    // Set initial time left on mount to avoid hydration mismatch
    setTimeLeft(calculateTimeLeft());
    
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endDate]);

  if (!timeLeft) {
    return (
      <div className="text-center w-full p-2 bg-destructive/20 rounded-md border border-destructive/50">
        <p className="font-bold text-destructive">Auction Ended</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-4 gap-2 text-center w-full font-mono">
      <div>
        <p className="text-3xl font-bold text-primary">{timeLeft.days}</p>
        <p className="text-xs text-muted-foreground">DAYS</p>
      </div>
      <div>
        <p className="text-3xl font-bold text-primary">{String(timeLeft.hours).padStart(2, '0')}</p>
        <p className="text-xs text-muted-foreground">HOURS</p>
      </div>
      <div>
        <p className="text-3xl font-bold text-primary">{String(timeLeft.minutes).padStart(2, '0')}</p>
        <p className="text-xs text-muted-foreground">MINS</p>
      </div>
      <div>
        <p className="text-3xl font-bold text-primary">{String(timeLeft.seconds).padStart(2, '0')}</p>
        <p className="text-xs text-muted-foreground">SECS</p>
      </div>
    </div>
  );
}

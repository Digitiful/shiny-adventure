
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { handleTerminalQuery, handleBookingForm } from '@/app/actions';
import { Terminal, ChevronRight, Bot, Activity, Wifi, Cpu, ShieldCheck, Zap, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUser } from '@/firebase';

type Line = {
  type: 'input' | 'ai' | 'system' | 'success' | 'error' | 'telemetry';
  text: string;
};

type HistoryLine = {
    role: 'user' | 'model';
    content: string;
}

type BookingStep = 'none' | 'day' | 'time' | 'name' | 'email' | 'message';

const SYSTEM_LOGS = [
    "ROUTING SIGNAL THROUGH SECURE EDGE...",
    "VERIFYING ANTIGRAVITY SHIELD INTEGRITY...",
    "ENCRYPTING SESSION DATA // AES-256...",
    "SYNCING WITH ARCHIVE VAULT...",
    "CALIBRATING HEURISTICS // DIGI. CORE...",
    "UPDATING OPERATOR CLEARANCE...",
    "OPTIMIZING THROUGHPUT FOR PROJECT INTAKE...",
    "SIGNAL FREQUENCY: STABLE AT 440HZ...",
];

export function BookingTerminal() {
    const { user } = useUser();
    const [latency, setLatency] = useState(24);
    const [lines, setLines] = useState<Line[]>([
        { type: 'system', text: "HANDSHAKE: [ DIGITAL. PRECISE. DELIBERATE. ]" },
        { type: 'system', text: "INTAKE TERMINAL 3.0 // NODE: OPERATIONAL" },
        { type: 'ai', text: `Signal received. ${user ? `Welcome back, ${user.displayName || 'Operator'}.` : "I am Digi."} How shall we architect your system today?` },
        { type: 'system', text: "COMMANDS: 'book', 'spec', 'stack', 'uptime', 'signal', 'clear', 'exit'" },
    ]);
    const [history, setHistory] = useState<HistoryLine[]>([]);
    const [commandHistory, setCommandHistory] = useState<string[]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [input, setInput] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    
    // Booking Flow State
    const [bookingStep, setBookingStep] = useState<BookingStep>('none');
    const [bookingData, setBookingData] = useState({
        day: '',
        time: '',
        name: '',
        email: '',
        message: ''
    });

    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Simulate system pulse (telemetry logs)
    useEffect(() => {
        const pulseInterval = setInterval(() => {
            if (!isThinking && bookingStep === 'none' && Math.random() > 0.7) {
                const log = SYSTEM_LOGS[Math.floor(Math.random() * SYSTEM_LOGS.length)];
                setLines(prev => {
                    const lastLine = prev[prev.length - 1];
                    if (lastLine?.type === 'telemetry') return prev; 
                    return [...prev, { type: 'telemetry', text: `[PULSE] ${log}` }];
                });
            }
        }, 5000);
        return () => clearInterval(pulseInterval);
    }, [isThinking, bookingStep]);

    useEffect(() => {
        const interval = setInterval(() => {
            setLatency(Math.floor(Math.random() * (45 - 18) + 18));
        }, 3000);
        return () => clearInterval(interval);
    }, []);
    
    useEffect(() => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
        }
    }, [lines, isThinking]);
    
    const resetTerminal = () => {
        setLines([
            { type: 'system', text: "TERMINAL RECALIBRATED. PROTOCOL 3.0 ACTIVE." },
            { type: 'system', text: "Enter 'spec' for system DNA or 'book' to initiate project intake." },
        ]);
        setHistory([]);
        setCommandHistory([]);
        setHistoryIndex(-1);
        setBookingStep('none');
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (bookingStep !== 'none') return; // Disable history during booking

        if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (commandHistory.length > 0) {
                const nextIndex = historyIndex + 1;
                if (nextIndex < commandHistory.length) {
                    setHistoryIndex(nextIndex);
                    setInput(commandHistory[commandHistory.length - 1 - nextIndex]);
                }
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex > 0) {
                const nextIndex = historyIndex - 1;
                setHistoryIndex(nextIndex);
                setInput(commandHistory[commandHistory.length - 1 - nextIndex]);
            } else if (historyIndex === 0) {
                setHistoryIndex(-1);
                setInput('');
            }
        }
    };

    const handleBookingInput = async (val: string) => {
        const currentVal = val.trim();
        if (!currentVal) return;

        setLines(prev => [...prev, { type: 'input', text: currentVal }]);
        setInput('');

        if (bookingStep === 'day') {
            setBookingData(prev => ({ ...prev, day: currentVal }));
            setBookingStep('time');
            setLines(prev => [...prev, 
                { type: 'system', text: "> STEP 02: ALLOCATE BANDWIDTH" },
                { type: 'ai', text: "Select a window: [A] 09:00 EST | [B] 13:00 EST | [C] 17:00 EST" }
            ]);
        } 
        else if (bookingStep === 'time') {
            let selectedTime = currentVal;
            if (currentVal.toUpperCase() === 'A') selectedTime = '09:00 AM EST';
            if (currentVal.toUpperCase() === 'B') selectedTime = '01:00 PM EST';
            if (currentVal.toUpperCase() === 'C') selectedTime = '05:00 PM EST';
            
            setBookingData(prev => ({ ...prev, time: selectedTime }));
            setBookingStep('name');
            setLines(prev => [...prev, 
                { type: 'system', text: "> STEP 03: IDENTIFY OPERATOR" },
                { type: 'ai', text: "State your name for the record." }
            ]);
        }
        else if (bookingStep === 'name') {
            setBookingData(prev => ({ ...prev, name: currentVal }));
            setBookingStep('email');
            setLines(prev => [...prev, 
                { type: 'system', text: "> STEP 04: ESTABLISH RETURN SIGNAL" },
                { type: 'ai', text: "Enter your secure email for transmission confirmation." }
            ]);
        }
        else if (bookingStep === 'email') {
            if (!currentVal.includes('@')) {
                setLines(prev => [...prev, { type: 'error', text: "INVALID SIGNAL. EMAIL FORMAT REQUIRED." }]);
                return;
            }
            setBookingData(prev => ({ ...prev, email: currentVal }));
            setBookingStep('message');
            setLines(prev => [...prev, 
                { type: 'system', text: "> STEP 05: DEFINE MISSION PARAMETERS" },
                { type: 'ai', text: "Provide a concise summary of your project requirements or system challenges." }
            ]);
        }
        else if (bookingStep === 'message') {
            const finalData = { ...bookingData, message: currentVal };
            setBookingData(finalData);
            setBookingStep('none');
            setIsThinking(true);
            setLines(prev => [...prev, { type: 'system', text: "> TRANSMITTING INTAKE PACKET..." }]);

            try {
                const formData = new FormData();
                formData.append('name', finalData.name);
                formData.append('email', finalData.email);
                formData.append('message', finalData.message);
                formData.append('date', finalData.day);
                formData.append('time', finalData.time);
                
                const result = await handleBookingForm({ message: '', status: 'idle' }, formData);
                
                if (result.status === 'success') {
                    setLines(prev => [...prev, { type: 'success', text: "> TRANSMISSION SECURED. MISSION LOGGED." }]);
                    setLines(prev => [...prev, { type: 'ai', text: "Intake complete. Stand by for contact on your established signal." }]);
                } else {
                    setLines(prev => [...prev, { type: 'error', text: `> TRANSMISSION FAILED: ${result.message}` }]);
                }
            } catch (err) {
                setLines(prev => [...prev, { type: 'error', text: "> CRITICAL ERROR: SIGNAL TIMEOUT. PLEASE RETRANSMIT." }]);
            } finally {
                setIsThinking(false);
            }
        }
    }

    const handleInput = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key !== 'Enter' || !input.trim()) return;

        if (bookingStep !== 'none') {
            handleBookingInput(input);
            return;
        }

        const command = input.trim().toLowerCase();
        const newLines: Line[] = [...lines, { type: 'input', text: command }];
        setLines(newLines);
        
        const currentHistory: HistoryLine[] = [...history, { role: 'user', content: command }];
        setHistory(currentHistory);
        setCommandHistory(prev => [...prev, input.trim()]);
        setHistoryIndex(-1);
        
        setInput('');
        
        if (command === 'book') {
            setBookingStep('day');
            setLines(prev => [...prev, 
                { type: 'system', text: "> INITIATING PROJECT INTAKE PROTOCOL v3.0..." },
                { type: 'system', text: "> STEP 01: DEFINE MISSION TIMELINE" },
                { type: 'ai', text: "Which date shall we initiate the project handshake? (e.g. April 12th)" }
            ]);
        } else if (command === 'spec') {
            const specText = `> SYSTEM SPECIFICATION v3.0
> Protocol // 01: Digital
> Protocol // 02: Precise
> Protocol // 03: Deliberate
> UPTIME: 99.99% [OK]
> STATUS: OPERATIONAL // NODE ALPHA`;
            setLines(prev => [...prev, { type: 'system', text: specText }]);
        } else if (command === 'stack') {
            const stackText = `> TECHNICAL ASSEMBLY:
> ENGINE: Next.js 15 (App Router)
> LOGIC: Genkit AI // Gemini 2.5
> DATA: Secure Vault Node
> UI: React 19 // Tailwind CSS`;
            setLines(prev => [...prev, { type: 'system', text: stackText }]);
        } else if (command === 'uptime') {
            const uptimeText = `> OPERATIONAL LONGEVITY:
> ACTIVE_SINCE: 2020.04.01
> HEARTBEAT: STABLE [OK]
> SLI: 99.99% AVAILABILITY
> THROUGHPUT: OPTIMIZED`;
            setLines(prev => [...prev, { type: 'system', text: uptimeText }]);
        } else if (command === 'signal') {
            const signalText = `> SIGNAL DIAGNOSTIC: COMPLETE
> TEST_PACKET: RECEIVED [OK]
> LATENCY: ${latency}MS
> OPERATOR: ${user ? user.displayName?.toUpperCase() : 'UNKNOWN'} // AUTHORIZED`;
            setLines(prev => [...prev, { type: 'system', text: signalText }]);
        } else if (command === 'exit') {
            setLines(prev => [...prev, { type: 'system', text: "> Session terminated.\n> Signal closed." }]);
            setTimeout(resetTerminal, 2000);
        } else if (command === 'clear') {
            resetTerminal();
        } else {
            setIsThinking(true);
            try {
                const aiResponse = await handleTerminalQuery(command, user?.displayName, currentHistory);
                const answer = aiResponse.answer;
                setLines(prev => [...prev, { type: 'ai', text: answer }]);
                setHistory(prev => [...prev, { role: 'model', content: answer }]);
            } catch (err) {
                setLines(prev => [...prev, { type: 'error', text: "SIGNAL INTERFERENCE. ENGINE RECALIBRATING." }]);
            } finally {
                setIsThinking(false);
            }
        }
    };

    return (
        <section id="terminal" className="py-20 sm:py-28 bg-card relative overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="max-w-3xl mx-auto text-center mb-12">
                    <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-primary uppercase italic">
                        Establish Signal
                    </h2>
                    <p className="mt-4 text-lg text-muted-foreground font-medium">
                        Execute a direct handshake with Digi. for project architecture and technical intake.
                    </p>
                </div>

                <div className="max-w-4xl mx-auto bg-background/50 rounded-lg border border-primary/20 shadow-2xl font-code overflow-hidden backdrop-blur-xl">
                    <div className="bg-muted/50 p-3 flex items-center justify-between rounded-t-lg border-b border-primary/10">
                        <div className="flex items-center">
                            <Terminal className="h-5 w-5 mr-2 text-primary" />
                            <p className="text-[10px] text-foreground/80 font-bold tracking-widest uppercase">Digitiful // AI Terminal 3.0</p>
                        </div>
                        <div className="flex items-center gap-4 text-[9px] font-bold text-muted-foreground">
                            <div className="flex items-center gap-1">
                                <Activity className="h-3 w-3 text-primary animate-pulse" />
                                <span>SYNC: ACTIVE</span>
                            </div>
                            <div className="flex items-center gap-1 hidden sm:flex">
                                <Wifi className="h-3 w-3 text-primary" />
                                <span>LATENCY: {latency}MS</span>
                            </div>
                            <div className="flex items-center gap-1 text-green-500">
                                <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                                <span>STATUS: SECURE</span>
                            </div>
                        </div>
                    </div>
                    <div ref={scrollAreaRef} className="p-4 h-[550px] overflow-y-auto scrollbar-thin scrollbar-thumb-primary/20 bg-black/40">
                        {lines.map((line, index) => (
                             <div key={index} className={cn("flex items-start mb-2", { 
                                 'text-muted-foreground': line.type === 'system',
                                 'text-primary/90': line.type === 'ai',
                                 'text-green-400': line.type === 'success',
                                 'text-destructive': line.type === 'error',
                                 'text-primary/30 text-[9px] animate-pulse': line.type === 'telemetry'
                                })}>
                                {line.type === 'input' && <span className="text-primary mr-2 flex-shrink-0"><ChevronRight className="inline h-4 w-4" /></span>}
                                {line.type === 'ai' && <span className="text-primary mr-2 flex-shrink-0"><Bot className="inline h-4 w-4" /></span>}
                                {line.type === 'system' && <span className="text-muted-foreground mr-2 flex-shrink-0"><Activity className="inline h-3 w-3" /></span>}
                                {line.type === 'telemetry' && <span className="text-primary/30 mr-2 flex-shrink-0"><Cpu className="inline h-3 w-3" /></span>}
                                <p className={cn("whitespace-pre-wrap break-all uppercase text-[11px]", 
                                    line.type === 'ai' && "italic normal-case",
                                    line.type === 'telemetry' && "lowercase")}>{line.text}</p>
                            </div>
                        ))}

                        {isThinking && (
                             <div className="flex items-start text-muted-foreground animate-pulse">
                                <span className="text-primary mr-2 flex-shrink-0"><Bot className="inline h-4 w-4 animate-spin" /></span>
                                <p className="text-[11px] uppercase">Synthesizing project parameters...</p>
                            </div>
                        )}
                        
                        <div className="flex items-center mt-2 border-l-2 border-primary pl-2 bg-primary/5">
                            <span className="text-primary mr-2"><ChevronRight className="inline h-4 w-4" /></span>
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleInput}
                                onKeyUp={handleKeyDown}
                                className="bg-transparent w-full focus:outline-none text-foreground placeholder:opacity-30 text-[11px] uppercase"
                                placeholder={bookingStep !== 'none' ? "Transmit answer..." : "Enter command or mission query..."}
                            />
                        </div>
                        <div ref={scrollAreaRef} />
                    </div>
                </div>
            </div>
        </section>
    );
}

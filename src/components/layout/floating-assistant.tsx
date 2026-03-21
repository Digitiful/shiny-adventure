'use client';

import React, { useState, useRef, useEffect } from 'react';
import { handleGeneralQuery } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, Send, Loader2, Minimize2, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

type Message = {
  role: 'user' | 'model';
  content: string;
};

export function FloatingAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isThinking]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isThinking) return;

    const userMessage = input.trim();
    const newMessages: Message[] = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);
    setInput('');
    setIsThinking(true);

    try {
      const response = await handleGeneralQuery(userMessage, messages);
      setMessages((prev) => [...prev, { role: 'model', content: response.answer }]);
    } catch (error) {
      setMessages((prev) => [...prev, { role: 'model', content: "Connection error. Systems recalibrating." }]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
      {isOpen ? (
        <Card className="w-[320px] sm:w-[350px] h-[500px] mb-4 flex flex-col shadow-2xl border-primary/20 bg-background/90 backdrop-blur-xl animate-in slide-in-from-bottom-4 duration-300">
          <CardHeader className="p-4 border-b border-primary/10 flex flex-row items-center justify-between space-y-0">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary/10 rounded-full">
                <ShieldCheck className="h-4 w-4 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xs font-bold tracking-widest uppercase">Digi.</CardTitle>
                <p className="text-[9px] text-muted-foreground uppercase opacity-70">Status: Active // Precise</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive" onClick={() => setIsOpen(false)}>
              <Minimize2 className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="flex-grow p-0 flex flex-col overflow-hidden">
            <ScrollArea className="flex-grow p-4">
              <div className="space-y-4">
                {messages.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-[10px] text-muted-foreground font-code leading-relaxed">
                      " Digi. active. Welcome to Digitiful. How may I provide deliberate assistance with your systems today? "
                    </p>
                  </div>
                )}
                {messages.map((m, i) => (
                  <div key={i} className={cn("flex", m.role === 'user' ? "justify-end" : "justify-start")}>
                    <div className={cn(
                      "max-w-[85%] rounded-lg px-3 py-2 text-xs shadow-sm",
                      m.role === 'user' 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-muted border border-primary/5 font-sans"
                    )}>
                      {m.content}
                    </div>
                  </div>
                ))}
                {isThinking && (
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-lg px-3 py-2 border border-primary/5">
                      <Loader2 className="h-3 w-3 animate-spin text-primary" />
                    </div>
                  </div>
                )}
                <div ref={scrollRef} />
              </div>
            </ScrollArea>
            <form onSubmit={handleSend} className="p-4 border-t border-primary/10 flex gap-2">
              <Input
                placeholder="Submit query..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="bg-black/50 border-primary/20 focus:border-primary text-xs h-9"
                disabled={isThinking}
              />
              <Button type="submit" size="icon" className="h-9 w-9" disabled={!input.trim() || isThinking}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Button 
          size="icon" 
          className="h-14 w-14 rounded-full shadow-lg shadow-primary/20 hover:scale-110 transition-transform duration-300 relative group"
          onClick={() => setIsOpen(true)}
        >
          <MessageCircle className="h-6 w-6" />
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
          </span>
        </Button>
      )}
    </div>
  );
}

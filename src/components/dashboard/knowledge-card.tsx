
'use client';

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Check } from "lucide-react";

export function DashboardKnowledgeCard({ item }: { item: any }) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Card className="group flex items-center p-4 gap-4 hover:bg-card/80 transition-colors duration-200 h-full cursor-pointer hover:border-primary/50 hover:-translate-y-1">
                    <div className="h-12 w-12 flex-shrink-0 relative">
                        <Image 
                            src={item.logo}
                            alt={`${item.name} logo`}
                            fill
                            className={cn("object-contain")}
                        />
                    </div>
                    <div className="flex-grow">
                        <h4 className="font-semibold">{item.name}</h4>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                </Card>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="h-16 w-16 flex-shrink-0 relative p-2 bg-background rounded-md border">
                            <Image 
                                src={item.logo}
                                alt={`${item.name} logo`}
                                fill
                                className={cn("object-contain")}
                            />
                        </div>
                        <div>
                            <DialogTitle className="text-2xl">{item.name}</DialogTitle>
                            <DialogDescription>{item.description}</DialogDescription>
                        </div>
                    </div>
                </DialogHeader>
                <div className="space-y-4 py-4">
                   <div>
                        <h4 className="font-semibold text-sm mb-2">Key Features</h4>
                        <ul className="space-y-2">
                            {item.features.map((feature: string, index: number) => (
                                <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                                    <Check className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>
                   </div>
                   <div>
                        <h4 className="font-semibold text-sm mb-2">Best For</h4>
                        <p className="text-sm text-muted-foreground">{item.useCase}</p>
                   </div>
                   <div>
                        <h4 className="font-semibold text-sm mb-2">Pricing</h4>
                        <p className="text-sm text-muted-foreground">{item.pricing}</p>
                   </div>
                </div>
                 <Button asChild>
                    <Link href={item.href} target="_blank" rel="noopener noreferrer">
                        Visit {item.name}
                    </Link>
                </Button>
            </DialogContent>
        </Dialog>
    );
}

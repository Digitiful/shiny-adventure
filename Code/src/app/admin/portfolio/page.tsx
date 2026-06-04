
'use client';

import { useState, useTransition } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useCollection, useFirestore, useMemoFirebase, errorEmitter, FirestorePermissionError } from '@/firebase';
import { collection, query, orderBy, doc, addDoc, deleteDoc, writeBatch } from 'firebase/firestore';
import { Trash2, Plus, Trophy, Loader2, Star, RefreshCw, Layout } from 'lucide-react';
import { successStories as initialPortfolioData } from '@/lib/data';

export default function AdminPortfolioPage() {
    const [isPending, startTransition] = useTransition();
    const [isSeeding, startSeeding] = useTransition();
    const { toast } = useToast();
    const firestore = useFirestore();

    const portfolioQuery = useMemoFirebase(
        () => firestore ? query(collection(firestore, 'portfolioItems')) : null,
        [firestore]
    );

    const { data: portfolioItems, isLoading } = useCollection(portfolioQuery);

    const onAdd = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!firestore) return;

        const formData = new FormData(e.currentTarget);
        const title = formData.get('title') as string;
        const description = formData.get('description') as string;
        const imageId = formData.get('imageId') as string;

        const newItem = {
            title,
            description,
            imageId: imageId || null,
            results: [
                { icon: 'Star', label: 'Project Delivered' },
                { icon: 'Target', label: 'Outcome Achieved' }
            ],
            createdAt: new Date().toISOString()
        };

        const colRef = collection(firestore, 'portfolioItems');
        
        startTransition(async () => {
            addDoc(colRef, newItem)
                .then(() => {
                    toast({ title: "Success", description: "Case study added to portfolio." });
                    (e.target as HTMLFormElement).reset();
                })
                .catch(async (error) => {
                    const permissionError = new FirestorePermissionError({
                        path: colRef.path,
                        operation: 'create',
                        requestResourceData: newItem,
                    });
                    errorEmitter.emit('permission-error', permissionError);
                });
        });
    };

    const onDelete = async (id: string) => {
        if (!firestore) return;
        const docRef = doc(firestore, 'portfolioItems', id);
        
        startTransition(async () => {
            deleteDoc(docRef)
                .then(() => {
                    toast({ title: "Success", description: "Item removed from portfolio." });
                })
                .catch(async (error) => {
                    const permissionError = new FirestorePermissionError({
                        path: docRef.path,
                        operation: 'delete',
                    });
                    errorEmitter.emit('permission-error', permissionError);
                });
        });
    };

    const seedPortfolio = async () => {
        if (!firestore) return;
        startSeeding(async () => {
            try {
                const batch = writeBatch(firestore);
                const colRef = collection(firestore, 'portfolioItems');
                
                initialPortfolioData.forEach((item) => {
                    const newDoc = doc(colRef);
                    // Standardize the icons/results for storage
                    const results = item.results.map(r => ({
                        label: r.label,
                        icon: r.icon.name || 'Star' // Fallback to icon name string
                    }));

                    batch.set(newDoc, {
                        id: item.id,
                        title: item.title,
                        description: item.description,
                        imageId: item.imageId || null,
                        testimonial: item.testimonial || null,
                        results: results,
                        createdAt: new Date().toISOString()
                    });
                });

                await batch.commit();
                toast({ title: "Portfolio Synchronized", description: "Initial case studies uploaded." });
            } catch (err) {
                toast({ title: "Sync Failed", description: "Could not seed portfolio.", variant: "destructive" });
            }
        });
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-primary mb-2 uppercase italic">Success Story Manager</h1>
                    <p className="text-muted-foreground font-medium">Control the digital proof-of-work displayed on Digitiful.</p>
                </div>
                <Button variant="outline" onClick={seedPortfolio} disabled={isSeeding} className="border-primary/20 hover:bg-primary/5 text-xs font-bold uppercase tracking-widest">
                    {isSeeding ? <Loader2 className="mr-2 h-3 w-3 animate-spin" /> : <RefreshCw className="mr-2 h-3 w-3" />}
                    Seed Initial Stories
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-1 border-primary/20 bg-black/40">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Plus className="h-5 w-5 text-primary" />
                            Add Case Study
                        </CardTitle>
                        <CardDescription>Document a new mission success.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={onAdd} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Project Title</Label>
                                <Input id="title" name="title" required placeholder="e.g., Global E-commerce Pivot" className="bg-black/50 border-primary/20" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Short Description</Label>
                                <Textarea id="description" name="description" required placeholder="Describe the mission outcomes..." className="bg-black/50 border-primary/20" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="imageId">Placeholder Image ID (Optional)</Label>
                                <Input id="imageId" name="imageId" placeholder="e.g., portfolio-retail" className="bg-black/50 border-primary/20" />
                            </div>
                            <Button type="submit" className="w-full" disabled={isPending}>
                                {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trophy className="mr-2 h-4 w-4" />}
                                Broadcast Success
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <Card className="lg:col-span-2 border-primary/20 bg-black/40">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Layout className="h-5 w-5 text-primary" />
                            Active Stories
                        </CardTitle>
                        <CardDescription>Success signals currently visible to the public.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border border-primary/10 overflow-hidden">
                            <Table>
                                <TableHeader className="bg-muted/50">
                                    <TableRow>
                                        <TableHead>Mission</TableHead>
                                        <TableHead className="hidden sm:table-cell">ID</TableHead>
                                        <TableHead className="text-right">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {isLoading ? (
                                        <TableRow><TableCell colSpan={3} className="text-center py-10 animate-pulse">Scanning portfolio frequencies...</TableCell></TableRow>
                                    ) : portfolioItems?.length === 0 ? (
                                        <TableRow><TableCell colSpan={3} className="text-center py-10 text-muted-foreground">The portfolio is dark. Seed or add a story.</TableCell></TableRow>
                                    ) : portfolioItems?.map((item: any) => (
                                        <TableRow key={item.id}>
                                            <TableCell>
                                                <div className="font-bold text-foreground">{item.title}</div>
                                                <div className="text-[10px] text-muted-foreground line-clamp-1">{item.description}</div>
                                            </TableCell>
                                            <TableCell className="hidden sm:table-cell">
                                                <span className="font-code text-[10px] bg-primary/10 px-1.5 py-0.5 rounded text-primary">{item.id.slice(0, 8)}</span>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    className="text-destructive hover:bg-destructive/10"
                                                    onClick={() => onDelete(item.id)}
                                                    disabled={isPending}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

'use client';

import { useState, useTransition } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useCollection, useFirestore, useMemoFirebase, errorEmitter, FirestorePermissionError } from '@/firebase';
import { collection, query, orderBy, writeBatch, doc, addDoc, deleteDoc } from 'firebase/firestore';
import { Trash2, Plus, Users, Globe, ExternalLink, Loader2, RefreshCw } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import clientsBaseline from '@/content/clients.json';

export default function AdminClientsPage() {
    const [isPending, startTransition] = useTransition();
    const [isSeeding, startSeeding] = useTransition();
    const { toast } = useToast();
    const firestore = useFirestore();

    const clientsQuery = useMemoFirebase(
        () => firestore ? query(collection(firestore, 'clients'), orderBy('order', 'asc')) : null,
        [firestore]
    );

    const { data: clients, isLoading } = useCollection(clientsQuery);

    const onAdd = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!firestore) return;

        const formData = new FormData(e.currentTarget);
        const name = formData.get('name') as string;
        const logo = formData.get('logo') as string;
        const href = formData.get('href') as string;
        const invert = formData.get('invert') === 'on';

        const clientData = {
            name,
            logo,
            href: href || null,
            invert,
            order: Date.now(),
        };

        const colRef = collection(firestore, 'clients');
        
        startTransition(async () => {
            addDoc(colRef, clientData)
                .then(() => {
                    toast({ title: "Success", description: "Partner added to signal grid." });
                    (e.target as HTMLFormElement).reset();
                })
                .catch(async (error) => {
                    const permissionError = new FirestorePermissionError({
                        path: colRef.path,
                        operation: 'create',
                        requestResourceData: clientData,
                    });
                    errorEmitter.emit('permission-error', permissionError);
                });
        });
    };

    const onDelete = async (id: string) => {
        if (!firestore) return;
        
        const docRef = doc(firestore, 'clients', id);
        
        startTransition(async () => {
            deleteDoc(docRef)
                .then(() => {
                    toast({ title: "Success", description: "Partner removed from signal grid." });
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

    const seedBaseline = async () => {
        if (!firestore) return;
        startSeeding(async () => {
            try {
                const batch = writeBatch(firestore);
                const colRef = collection(firestore, 'clients');
                
                clientsBaseline.forEach((c, i) => {
                    const newDoc = doc(colRef);
                    batch.set(newDoc, {
                        ...c,
                        invert: c.name === 'ZAW Project' || c.name === 'Quick To Link',
                        order: i
                    });
                });

                await batch.commit();
                toast({ title: "Signal Synchronized", description: "Baseline partners uploaded." });
            } catch (err) {
                toast({ title: "Sync Failed", description: "Could not seed data.", variant: "destructive" });
            }
        });
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-primary mb-2 uppercase italic">Partner Signal Grid</h1>
                    <p className="text-muted-foreground font-medium">Manage the client entities serviced by Digitiful engineering.</p>
                </div>
                <Button variant="outline" onClick={seedBaseline} disabled={isSeeding} className="border-primary/20 hover:bg-primary/5 text-xs font-bold uppercase tracking-widest">
                    {isSeeding ? <Loader2 className="mr-2 h-3 w-3 animate-spin" /> : <RefreshCw className="mr-2 h-3 w-3" />}
                    Seed Baseline Partners
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-1 border-primary/20 bg-black/40">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Plus className="h-5 w-5 text-primary" />
                            Add Partner
                        </CardTitle>
                        <CardDescription>Initiate a new client signal in the grid.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={onAdd} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Partner Name</Label>
                                <Input id="name" name="name" required placeholder="e.g., Cyberdyne Systems" className="bg-black/50 border-primary/20" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="logo">Logo URL</Label>
                                <Input id="logo" name="logo" required placeholder="https://..." className="bg-black/50 border-primary/20" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="href">Website Link (Optional)</Label>
                                <Input id="href" name="href" placeholder="https://..." className="bg-black/50 border-primary/20" />
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-lg bg-primary/5 border border-primary/10">
                                <div className="space-y-0.5">
                                    <Label htmlFor="invert">Invert Logo</Label>
                                    <p className="text-[10px] text-muted-foreground">Apply white filter for dark mode.</p>
                                </div>
                                <Switch id="invert" name="invert" />
                            </div>
                            <Button type="submit" className="w-full" disabled={isPending}>
                                {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Globe className="mr-2 h-4 w-4" />}
                                Broadcast Signal
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <Card className="lg:col-span-2 border-primary/20 bg-black/40">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Users className="h-5 w-5 text-primary" />
                            Active Partners
                        </CardTitle>
                        <CardDescription>Entities currently authenticated in the Digitiful network.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border border-primary/10 overflow-hidden">
                            <Table>
                                <TableHeader className="bg-muted/50">
                                    <TableRow>
                                        <TableHead>Partner</TableHead>
                                        <TableHead>Visual</TableHead>
                                        <TableHead className="text-right">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {isLoading ? (
                                        <TableRow><TableCell colSpan={3} className="text-center py-10 animate-pulse">Scanning frequencies...</TableCell></TableRow>
                                    ) : clients?.length === 0 ? (
                                        <TableRow><TableCell colSpan={3} className="text-center py-10 text-muted-foreground">No partner signals detected. Seed baseline or add manually.</TableCell></TableRow>
                                    ) : clients?.map((client: any) => (
                                        <TableRow key={client.id}>
                                            <TableCell>
                                                <div className="font-bold text-foreground">{client.name}</div>
                                                {client.href && (
                                                    <a href={client.href} target="_blank" className="text-[10px] text-primary hover:underline flex items-center gap-1">
                                                        Visit Node <ExternalLink className="h-2 w-2" />
                                                    </a>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <div className="relative h-8 w-24 bg-muted/20 rounded p-1 flex items-center justify-center border border-white/5">
                                                    <Image 
                                                        src={client.logo} 
                                                        alt={client.name} 
                                                        fill 
                                                        className={cn("object-contain p-1", client.invert && "invert")} 
                                                    />
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    className="text-destructive hover:bg-destructive/10"
                                                    onClick={() => onDelete(client.id)}
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
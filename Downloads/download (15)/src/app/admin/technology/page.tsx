'use client';

import { useState, useTransition } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useCollection, useFirestore, useMemoFirebase, errorEmitter, FirestorePermissionError } from '@/firebase';
import { collection, query, orderBy, writeBatch, doc, addDoc, deleteDoc } from 'firebase/firestore';
import { Trash2, Plus, Cpu, Globe, ExternalLink, Loader2, RefreshCw, Eye, AlertCircle, Link as LinkIcon, Radio, Info, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';
import techBaseline from '@/content/technology.json';

/**
 * @fileOverview Technology Node Registry.
 * Manages the "DNA" components of the Digitiful Neural Tree.
 * Identity: Precision DNA Calibration.
 */
export default function AdminTechnologyPage() {
    const [isPending, startTransition] = useTransition();
    const [isSeeding, startSeeding] = useTransition();
    const [previewUrl, setPreviewUrl] = useState('');
    const [previewName, setPreviewName] = useState('');
    const { toast } = useToast();
    const firestore = useFirestore();

    const techQuery = useMemoFirebase(
        () => firestore ? query(collection(firestore, 'technology'), orderBy('order', 'asc')) : null,
        [firestore]
    );

    const { data: techNodes, isLoading } = useCollection(techQuery);

    const onAdd = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!firestore) return;

        const formData = new FormData(e.currentTarget);
        const name = formData.get('name') as string;
        const logo = formData.get('logo') as string;
        const href = formData.get('href') as string;
        const invert = formData.get('invert') === 'on';

        const nodeData = {
            name,
            logo,
            href: href || null,
            invert,
            order: Date.now(),
        };

        const colRef = collection(firestore, 'technology');
        
        startTransition(async () => {
            addDoc(colRef, nodeData)
                .then(() => {
                    toast({ title: "DNA Calibrated", description: `${name} integrated into Neural Tree.` });
                    (e.target as HTMLFormElement).reset();
                    setPreviewUrl('');
                    setPreviewName('');
                })
                .catch(async (error) => {
                    const permissionError = new FirestorePermissionError({
                        path: colRef.path,
                        operation: 'create',
                        requestResourceData: nodeData,
                    });
                    errorEmitter.emit('permission-error', permissionError);
                });
        });
    };

    const onDelete = async (id: string) => {
        if (!firestore) return;
        const docRef = doc(firestore, 'technology', id);
        
        startTransition(async () => {
            deleteDoc(docRef)
                .then(() => {
                    toast({ title: "DNA Purged", description: "Node removed from Neural Tree." });
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
                const colRef = collection(firestore, 'technology');
                
                techBaseline.forEach((t, i) => {
                    const newDoc = doc(colRef);
                    batch.set(newDoc, {
                        ...t,
                        order: i
                    });
                });

                await batch.commit();
                toast({ title: "DNA Sync Complete", description: "Baseline frequencies uploaded." });
            } catch (err) {
                toast({ title: "Sync Failed", description: "Could not seed technical DNA.", variant: "destructive" });
            }
        });
    }

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-primary mb-2 uppercase italic">DNA Calibration</h1>
                    <p className="text-muted-foreground font-medium text-sm">Configure the engineering nodes of the Digitiful Neural Tree.</p>
                </div>
                <Button 
                    variant="outline" 
                    onClick={seedBaseline} 
                    disabled={isSeeding} 
                    className="border-primary/20 hover:bg-primary/5 text-[10px] font-bold uppercase tracking-widest h-9"
                >
                    {isSeeding ? <Loader2 className="mr-2 h-3 w-3 animate-spin" /> : <RefreshCw className="mr-2 h-3 w-3" />}
                    Re-Sync Baseline DNA
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* INTAKE FORM */}
                <div className="lg:col-span-5 space-y-6">
                    <Card className="border-primary/20 bg-black/40 backdrop-blur-md overflow-hidden shadow-2xl">
                        <CardHeader className="bg-primary/5 border-b border-primary/10">
                            <CardTitle className="text-[10px] font-bold uppercase tracking-[0.3em] flex items-center gap-2 text-primary">
                                <Cpu className="h-4 w-4 animate-pulse" />
                                Integrate Node
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-8">
                            <form onSubmit={onAdd} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">Node Identity</Label>
                                    <Input 
                                        id="name" 
                                        name="name" 
                                        required 
                                        placeholder="e.g. Next.js" 
                                        className="bg-black/60 border-primary/20 h-12 focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm font-medium"
                                        onChange={(e) => setPreviewName(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="logo" className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">Asset URL (SVG/PNG)</Label>
                                    <div className="relative">
                                        <Input 
                                            id="logo" 
                                            name="logo" 
                                            required 
                                            placeholder="https://..." 
                                            className="bg-black/60 border-primary/20 h-12 pl-10 focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm font-medium"
                                            onChange={(e) => setPreviewUrl(e.target.value)}
                                        />
                                        <LinkIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/40" />
                                    </div>
                                    <p className="text-[9px] text-muted-foreground italic mt-2 px-1">
                                        " URL must end in .svg, .png, or .jpg for peak signal clarity. "
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="href" className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">Documentation Link</Label>
                                    <Input id="href" name="href" placeholder="https://..." className="bg-black/60 border-primary/20 h-12 focus:ring-1 focus:ring-primary" />
                                </div>
                                
                                <div className="flex items-center justify-between p-4 rounded-xl bg-primary/5 border border-primary/10">
                                    <div className="space-y-0.5">
                                        <Label htmlFor="invert" className="text-[10px] font-bold uppercase tracking-widest">Invert Visual</Label>
                                        <p className="text-[8px] text-muted-foreground uppercase">Toggle for dark mode compatibility.</p>
                                    </div>
                                    <Switch id="invert" name="invert" />
                                </div>

                                {previewUrl && (
                                    <div className="p-4 rounded-xl bg-primary/5 border border-dashed border-primary/20 animate-in zoom-in-95 duration-300">
                                        <div className="flex items-center gap-2 mb-3">
                                            <Eye className="h-3 w-3 text-primary" />
                                            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-primary">Transmission Preview</span>
                                        </div>
                                        <div className="relative h-20 w-full bg-neutral-900 rounded-lg flex items-center justify-center p-4 border border-white/5 shadow-inner">
                                            <img 
                                                src={previewUrl} 
                                                alt="Preview" 
                                                className={cn("max-h-full max-w-full object-contain transition-all duration-500", invert && "invert")} 
                                                onError={() => {
                                                    setPreviewUrl('');
                                                    toast({ title: "Preview Failed", description: "Invalid image URL.", variant: "destructive" });
                                                }}
                                            />
                                        </div>
                                        {previewName && <p className="text-center mt-3 text-[10px] font-black uppercase italic text-foreground/70 tracking-tighter">{previewName}</p>}
                                    </div>
                                )}

                                <Button type="submit" className="w-full font-black uppercase italic tracking-[0.2em] h-12 text-sm shadow-[0_0_20px_rgba(147,51,234,0.2)]" disabled={isPending}>
                                    {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                                    Integrate Node
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                {/* ACTIVE DNA TABLE */}
                <div className="lg:col-span-7">
                    <Card className="border-primary/20 bg-black/40 backdrop-blur-md h-full shadow-2xl overflow-hidden">
                        <CardHeader className="flex flex-row items-center justify-between border-b border-primary/10 bg-primary/5 py-4">
                            <div className="flex items-center gap-2">
                                <Radio className="h-4 w-4 text-primary animate-pulse" />
                                <CardTitle className="text-[10px] font-bold uppercase tracking-[0.3em]">
                                    Active DNA Nodes
                                </CardTitle>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
                                <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-[8px] font-black text-green-500 uppercase tracking-widest">Live DNA</span>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader className="bg-white/5 border-b border-white/5">
                                    <TableRow className="hover:bg-transparent border-none">
                                        <TableHead className="text-[9px] uppercase font-black tracking-widest text-muted-foreground pl-8 h-12">Technology Node</TableHead>
                                        <TableHead className="text-[9px] uppercase font-black tracking-widest text-muted-foreground text-center h-12">Asset</TableHead>
                                        <TableHead className="text-[9px] uppercase font-black tracking-widest text-muted-foreground text-right pr-8 h-12">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {isLoading ? (
                                        <TableRow>
                                            <TableCell colSpan={3} className="text-center py-32">
                                                <div className="flex flex-col items-center gap-4">
                                                    <Loader2 className="h-10 w-10 animate-spin text-primary/40" />
                                                    <p className="text-[10px] uppercase font-bold tracking-[0.5em] text-muted-foreground animate-pulse">Scanning Neural Tree...</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : techNodes?.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={3} className="text-center py-32">
                                                <div className="flex flex-col items-center gap-4 opacity-40">
                                                    <AlertCircle className="h-10 w-10 text-primary/40" />
                                                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-[0.4em]">DNA Vault Empty</p>
                                                    <Button variant="ghost" onClick={seedBaseline} className="mt-2 text-[9px] hover:text-primary tracking-widest font-black uppercase">Initiate Baseline Sync</Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : techNodes?.map((node: any) => (
                                        <TableRow key={node.id} className="group hover:bg-primary/5 transition-all border-b border-white/5 duration-300">
                                            <TableCell className="py-6 pl-8">
                                                <div className="font-black text-foreground uppercase italic tracking-tighter text-base">{node.name}</div>
                                                {node.href && (
                                                    <a href={node.href} target="_blank" className="text-[9px] text-primary/60 hover:text-primary transition-colors flex items-center gap-1.5 mt-2 font-black tracking-widest">
                                                        DNA SOURCE <ExternalLink className="h-2.5 w-2.5" />
                                                    </a>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <div className="relative h-12 w-12 mx-auto bg-neutral-900/60 rounded-xl p-2.5 border border-white/5 group-hover:border-primary/30 transition-all shadow-inner">
                                                    <img 
                                                        src={node.logo} 
                                                        alt={node.name} 
                                                        className={cn("max-h-full max-w-full object-contain relative z-10 transition-all duration-500 group-hover:scale-110", node.invert && "invert")} 
                                                    />
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right pr-8">
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all opacity-0 group-hover:opacity-100 rounded-full"
                                                    onClick={() => onDelete(node.id)}
                                                    disabled={isPending}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}


'use client';

import { useState, useTransition } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Rocket, Package, RefreshCw, Database, Terminal, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { useFirestore } from '@/firebase';
import { collection, writeBatch, doc } from 'firebase/firestore';

const USER_PRODUCT_SEED = [
  { title: "BrosTrend 5km Wireless Bridge Kit - EAP5", description: "Wireless Bridge Kit for long-range networking. Condition: Brand New.", currentBid: 169.99 },
  { title: "Ledger Nano X - Amethyst Purple", description: "Elite crypto hardware wallet. Secure your assets. Condition: Brand New.", currentBid: 30.48 },
  { title: "Namo Smart Home Plug", description: "Intelligent power management for your local node. Condition: Brand New.", currentBid: 15.00 },
  { title: "Klim Chroma Wireless Gaming Keyboard RGB", description: "High-speed mechanical input device. Condition: Brand New.", currentBid: 37.00 },
  { title: "Phomemo P831 Pink Thermal Transfer Printer", description: "Portable thermal transfer printing solution. Condition: Brand New.", currentBid: 80.00 },
  { title: "Sainlogic Automatic Drip Irrigation System", description: "Low-waste automated watering system. Condition: Good.", currentBid: 45.00 },
  { title: "Thermalright TL‑M12QR X3 120mm Fans", description: "Reverse blade cooling artifacts. 3-Pack. Condition: Brand New.", currentBid: 37.00 },
  { title: "3.5\" PS4 Data Bank HDD Upgrade Dock", description: "Legacy hardware expansion for PS4 systems. Condition: Brand New.", currentBid: 80.00 },
  { title: "Google Fitbit Charge 6", description: "Advanced biometric tracking. Condition: Brand New.", currentBid: 159.00 },
  { title: "Bose SoundLink Color Bluetooth speaker II", description: "Drip-proof acoustic anomaly. Aquatic Blue. Condition: Good.", currentBid: 169.00 },
  { title: "Precision Screwdriver Set 124-Piece", description: "Comprehensive repair tools for digital maintenance.", currentBid: 25.99 },
  { title: "Polaroid iFO45 14 MP Digital Camera", description: "Dual screen waterproof optical sensor. Condition: Good.", currentBid: 40.00 },
  { title: "WAVLINK 450W Smart Battery Charger", description: "High-capacity trickle charger with telemetry display.", currentBid: 106.00 },
  { title: "Razer Basilisk V3 X HyperSpeed", description: "Low-latency wireless gaming input. Condition: Brand New.", currentBid: 99.00 },
  { title: "Samsung Galaxy A52 5G - 128GB", description: "Hardened mobile communication node. Condition: Refurbished.", currentBid: 210.00 },
  { title: "16 Inch FHD Triple Screen Extender", description: "Multi-monitor portable workstation. Condition: Open Box.", currentBid: 299.00 }
];

export default function AdminWarehousePage() {
    const [isPending, startTransition] = useTransition();
    const [isImporting, startImportTransition] = useTransition();
    const [rawEbayData, setRawEbayData] = useState("");
    const { toast } = useToast();
    const firestore = useFirestore();

    const onSeed = async () => {
        if (!firestore) return;
        
        startTransition(async () => {
            try {
                const batch = writeBatch(firestore);
                const colRef = collection(firestore, 'auctionItems');
                
                USER_PRODUCT_SEED.forEach(item => {
                    const newDoc = doc(colRef);
                    batch.set(newDoc, {
                        ...item,
                        imageId: `artifact-${Math.floor(Math.random() * 100)}`,
                        startingBid: Math.floor(item.currentBid * 0.8),
                        auctionEndDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
                        status: 'active'
                    });
                });

                await batch.commit();
                toast({ title: "Vault Initialized", description: "The baseline artifacts have been uploaded." });
            } catch (error) {
                console.error(error);
                toast({ title: "Sync Error", description: "The system firewall blocked the transmission. Check permissions.", variant: "destructive" });
            }
        });
    }

    const onImport = () => {
        if (!rawEbayData.trim() || !firestore) return;
        
        startImportTransition(async () => {
            try {
                const lines = rawEbayData.split('\n').filter(l => l.trim().length > 5);
                const batch = writeBatch(firestore);
                const colRef = collection(firestore, 'auctionItems');
                let count = 0;

                lines.forEach(line => {
                    const parts = line.split('\t'); // Handle tab-separated data
                    if (parts.length >= 1) {
                        const title = parts[0].trim();
                        const priceStr = parts[parts.length - 1] || "$100.00";
                        const price = parseFloat(priceStr.replace(/[^0-9.]/g, '')) || 100;
                        const condition = parts[3] || "Good";
                        
                        const newDoc = doc(colRef);
                        batch.set(newDoc, {
                            title,
                            description: `Artifact recovered from transmission. Condition: ${condition}.`,
                            imageId: `imported-${Math.floor(Math.random() * 1000)}`,
                            startingBid: Math.floor(price * 0.7),
                            currentBid: price,
                            auctionEndDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
                            status: "active"
                        });
                        count++;
                    }
                });

                if (count > 0) {
                    await batch.commit();
                    toast({ title: "Signal Processed", description: `Successfully extracted ${count} artifacts.` });
                    setRawEbayData("");
                } else {
                    toast({ title: "Parse Error", description: "The transmission packet contained no valid data.", variant: "destructive" });
                }
            } catch (error) {
                toast({ title: "Import Failed", description: "The system encountered interference during parsing.", variant: "destructive" });
            }
        });
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-primary mb-2 uppercase italic">Client Node: AWH Vault</h1>
                    <p className="text-muted-foreground font-medium">Managing technology artifacts for the Alien Warehouse mission.</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-primary/5 border border-primary/10 rounded-lg">
                    <User className="h-4 w-4 text-primary" />
                    <span className="text-[10px] font-code text-primary uppercase tracking-widest">Client Service: Active</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-primary/20 bg-black/40">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <Terminal className="h-6 w-6 text-primary" />
                            <div>
                                <CardTitle>Artifact Data Packet</CardTitle>
                                <CardDescription>Paste the rows from your product sheet here to sync artifacts.</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Textarea 
                            placeholder="Paste your product list here (Tab-separated rows)..."
                            className="min-h-[200px] bg-black/50 border-primary/20 font-code text-xs"
                            value={rawEbayData}
                            onChange={(e) => setRawEbayData(e.target.value)}
                        />
                        <Button onClick={onImport} disabled={isImporting || !rawEbayData.trim()} className="w-full">
                            {isImporting ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Rocket className="mr-2 h-4 w-4" />}
                            Process Client Transmission
                        </Button>
                    </CardContent>
                </Card>

                <Card className="border-primary/20 bg-primary/5">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <Package className="h-6 w-6 text-primary" />
                            <div>
                                <CardTitle>Vault Initialization</CardTitle>
                                <CardDescription>Instantly populate the bazaar with your core product list.</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground italic">
                            " Use this protocol to seed the Alien Warehouse with your top artifacts from the provided list. "
                        </p>
                        <Button variant="outline" onClick={onSeed} disabled={isPending} className="w-full border-primary/30 hover:bg-primary/10">
                            {isPending ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Database className="mr-2 h-4 w-4" />}
                            Seed Client Vault
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

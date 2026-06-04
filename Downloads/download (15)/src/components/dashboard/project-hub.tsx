'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { dashboardData } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { CheckCircle, FileText, FileType, PlayCircle, Send, Loader2, MessageSquare, Briefcase } from 'lucide-react';
import { TimeAgo } from '../ui/time-ago';
import Link from 'next/link';
import Image from 'next/image';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { useUser } from '@/firebase';
import { addDoc, collection, query, orderBy } from 'firebase/firestore';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { Skeleton } from '../ui/skeleton';
import { Textarea } from '../ui/textarea';
import { ProjectDetails } from './project-details';
import { cn } from '@/lib/utils';


const getDocIcon = (type: string) => {
    switch(type) {
        case 'pdf': return <FileText className="h-5 w-5 text-red-500" />;
        case 'doc': return <FileText className="h-5 w-5 text-blue-500" />;
        case 'figma': return <FileType className="h-5 w-5 text-pink-500" />;
        default: return <FileText className="h-5 w-5 text-muted-foreground" />;
    }
}

interface Activity {
    id: string;
    type: 'update' | 'task';
    author: string;
    authorImage?: string;
    text: string;
    time: string;
}

export function ProjectHub() {
    const firestore = useFirestore();
    const { user } = useUser();
    const { keyDocuments, featuredVideo } = dashboardData.projectHub;
    
    const [newUpdate, setNewUpdate] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const activitiesQuery = useMemoFirebase(() => 
        firestore ? query(collection(firestore, 'activities'), orderBy('time', 'desc')) : null,
        [firestore]
    );

    const { data: activities, isLoading: isLoadingActivities } = useCollection<Activity>(activitiesQuery);

    const handlePostUpdate = async () => {
        if (!newUpdate.trim() || !firestore || !user) return;
        
        setIsSubmitting(true);
        try {
            await addDoc(collection(firestore, 'activities'), {
                type: 'update',
                author: user.displayName || user.email,
                authorImage: user.photoURL || null,
                text: newUpdate,
                time: new Date().toISOString(),
            });
            setNewUpdate("");
        } catch (error) {
            console.error("Error posting update:", error);
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <div className="grid lg:grid-cols-5 gap-8 items-start">
            {/* Main Content: Activity Feed */}
            <div className="lg:col-span-3 space-y-6">
                {/* Post Update Composer */}
                 <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Post a Project Update</CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-start gap-4">
                        <Avatar className="h-10 w-10 border">
                            <AvatarImage src={user?.photoURL || undefined} />
                            <AvatarFallback>{user?.email?.[0].toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="w-full">
                             <Textarea 
                                placeholder="What's new on the project?" 
                                className="w-full bg-muted/50 focus-visible:ring-1 focus-visible:ring-primary border-border"
                                value={newUpdate}
                                onChange={(e) => setNewUpdate(e.target.value)}
                                disabled={isSubmitting}
                            />
                            <div className="text-right mt-2">
                                <Button size="sm" onClick={handlePostUpdate} disabled={!newUpdate.trim() || isSubmitting}>
                                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Post
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Activity Feed */}
                 <div>
                    <h3 className="text-lg font-semibold mb-4">Activity Feed</h3>
                    <div className="relative pl-0 space-y-8">
                        {isLoadingActivities && Array.from({ length: 3 }).map((_, index) => (
                           <div key={index} className="relative flex items-start gap-4">
                                <div className="pl-0 pt-1.5 w-full">
                                    <div className='flex justify-between'>
                                      <Skeleton className="h-4 w-1/3 mb-2" />
                                      <Skeleton className="h-4 w-1/4 mb-2" />
                                    </div>
                                    <Skeleton className="h-16 w-full rounded-lg" />
                                </div>
                            </div>
                        ))}
                        
                        {activities?.map((item) => (
                            <div key={item.id} className="relative flex items-start gap-4">
                                <div className="w-full">
                                    <div className="p-4 bg-muted/70 rounded-lg border border-border/80">
                                        <div className="flex items-center gap-3 mb-3">
                                            {item.type === 'update' ? (
                                                <Avatar className="h-6 w-6 border border-primary/30">
                                                    <AvatarImage src={item.authorImage || `https://i.pravatar.cc/150?u=${item.author}`} />
                                                    <AvatarFallback>{item.author[0]}</AvatarFallback>
                                                </Avatar>
                                            ) : (
                                                <div className="h-6 w-6 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center">
                                                    <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                                                </div>
                                            )}
                                            <p className="text-sm text-muted-foreground flex flex-1 justify-between items-center">
                                                <span className="font-semibold text-foreground">{item.author}</span>
                                                <TimeAgo dateString={item.time} />
                                            </p>
                                        </div>
                                        <p className="text-sm">{item.text}</p>
                                    </div>
                                </div>
                            </div>
                        ))}

                         {!isLoadingActivities && activities?.length === 0 && (
                            <div className="relative flex items-start gap-4">
                               <div className="pl-0 pt-1 w-full">
                                   <div className="p-4 bg-muted/70 rounded-lg border border-border/80 text-center">
                                       <p className="text-sm text-muted-foreground">No activity yet. Post an update to get started!</p>
                                   </div>
                               </div>
                            </div>
                         )}
                    </div>
                </div>
            </div>

            {/* Right Column: Sticky Sidebar */}
            <div className="lg:col-span-2 space-y-6 lg:sticky lg:top-24">
                <ProjectDetails />

                {/* Key Documents */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Key Documents</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {keyDocuments.map(doc => (
                                <Link href={doc.href} key={doc.title} target="_blank" rel="noopener noreferrer" 
                                      className="group -m-2 p-2 flex items-center gap-3 rounded-lg hover:bg-muted/80 transition-colors">
                                    <div className="bg-muted p-2 rounded-md border">
                                        {getDocIcon(doc.type)}
                                    </div>
                                    <span className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">{doc.title}</span>
                                </Link>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Featured Video */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Featured Video</CardTitle>
                    </CardHeader>
                    <CardContent>
                         <Dialog>
                            <DialogTrigger asChild>
                                <div className="group overflow-hidden rounded-lg cursor-pointer transition-all duration-300 hover:shadow-primary/20 hover:-translate-y-1">
                                    <div className="relative aspect-video w-full">
                                        <Image 
                                            src={featuredVideo.thumbnailUrl}
                                            alt={featuredVideo.title}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <PlayCircle className="h-12 w-12 text-white/80" />
                                        </div>
                                        <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">{featuredVideo.duration}</span>
                                    </div>
                                    <div className="p-4 bg-muted/40">
                                        <h4 className="font-semibold text-sm mb-1 group-hover:text-primary transition-colors">{featuredVideo.title}</h4>
                                        <p className="text-xs text-muted-foreground">{featuredVideo.description}</p>
                                    </div>
                                </div>
                            </DialogTrigger>
                             <DialogContent className="sm:max-w-2xl p-0 border-0">
                                 <div className="aspect-video bg-black rounded-lg flex items-center justify-center text-white">
                                    {/* In a real app, you'd use a proper video player here */}
                                    <iframe 
                                      className="w-full h-full"
                                      src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1" 
                                      title="YouTube video player" 
                                      frameBorder="0" 
                                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                      allowFullScreen>
                                    </iframe>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

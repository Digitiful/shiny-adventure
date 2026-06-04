
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { dashboardData } from '@/lib/data';
import { PlayCircle, Search } from 'lucide-react';
import { Input } from '../ui/input';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';

const videos = dashboardData.videos;

export function VideoLibraryCard() {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredVideos = videos.filter(video => 
    video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    video.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="bg-card/50 border-none">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Video Library</CardTitle>
        <CardDescription>A curated collection of educational content to help you succeed.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
                placeholder="Search videos..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map(video => (
            <Dialog key={video.id}>
                <DialogTrigger asChild>
                    <Card className="group flex flex-col overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-primary/20 hover:-translate-y-1">
                        <div className="relative aspect-video w-full">
                            <Image 
                                src={video.thumbnailUrl}
                                alt={video.title}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <PlayCircle className="h-16 w-16 text-white/80" />
                            </div>
                            <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-md">{video.duration}</span>
                        </div>
                        <div className="p-4 flex-grow flex flex-col">
                            <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">{video.title}</h3>
                            <p className="text-sm text-muted-foreground flex-grow">{video.description}</p>
                        </div>
                    </Card>
                </DialogTrigger>
                 <DialogContent className="sm:max-w-[625px]">
                    <DialogHeader>
                        <DialogTitle>{video.title}</DialogTitle>
                        <DialogDescription>{video.description}</DialogDescription>
                    </DialogHeader>
                     <div className="aspect-video bg-black rounded-lg flex items-center justify-center text-white">
                        <p>Video player placeholder</p>
                    </div>
                </DialogContent>
            </Dialog>
          ))}
          {filteredVideos.length === 0 && (
            <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">No videos found for "{searchTerm}".</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

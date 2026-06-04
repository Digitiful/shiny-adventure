'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Video, VideoOff, PhoneOff, ScreenShare, MessageSquare, User, Users, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

function ConnectingLoader() {
  return (
      <div className="flex flex-col items-center justify-center gap-4 text-center p-8 transition-opacity duration-500 animate-fade-in h-full">
        <div className="relative flex items-center justify-center h-20 w-20">
          <div className="absolute h-full w-full bg-primary/20 rounded-full animate-ping delay-500"></div>
          <div className="relative bg-background rounded-full p-4 shadow-inner flex items-center justify-center">
            <Image
              src="https://matrix.org/images/matrix-logo-white.svg"
              alt="Matrix Logo"
              width={48}
              height={48}
              className="h-12 w-auto"
              priority
            />
          </div>
        </div>
        <p className="text-muted-foreground animate-pulse">Connecting to secure server...</p>
      </div>
  )
}

export function VideoCallCard() {
  const [callState, setCallState] = useState<'disconnected' | 'connecting' | 'connected' | 'error'>('disconnected');
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  const handleConnect = async () => {
    setCallState('connecting');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setTimeout(() => setCallState('connected'), 2000);
    } catch (error) {
      console.error('Error accessing camera:', error);
      setCallState('error');
      toast({
        variant: 'destructive',
        title: 'Camera Access Denied',
        description: 'Please enable camera permissions in your browser settings to join the call.',
      });
    }
  };

  const handleDisconnect = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setCallState('disconnected');
    setIsCameraOff(false);
    setIsMuted(false);
  };

  const toggleMute = () => {
    setIsMuted(prev => {
      if(videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getAudioTracks().forEach(track => track.enabled = prev);
      }
      return !prev;
    });
  };

  const toggleCamera = () => {
    setIsCameraOff(prev => {
      if(videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getVideoTracks().forEach(track => track.enabled = prev);
      }
      return !prev;
    });
  };

  if (callState === 'disconnected' || callState === 'error') {
     return (
        <Card className="bg-card/50 border-none">
            <CardHeader>
                <CardTitle className="text-2xl font-bold">Secure Video Call</CardTitle>
                <CardDescription>Connect with your account manager for a face-to-face consultation.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center text-center p-12 min-h-[500px]">
                <div className="relative h-24 w-24 mb-4">
                  <Image 
                      src="https://matrix.org/images/matrix-logo-white.svg"
                      alt="Matrix Logo"
                      fill
                      className="object-contain"
                  />
                </div>
                <h3 className="text-2xl font-bold text-foreground">End-to-End Encrypted Meeting</h3>
                <p className="mt-2 text-muted-foreground max-w-md">
                    Your privacy is our priority. All calls are secured on our private, self-hosted communication server powered by Matrix.
                </p>
                <Button onClick={handleConnect} className="mt-6">
                    Join Secure Meeting
                </Button>
                {callState === 'error' && (
                  <Alert variant="destructive" className="mt-6 max-w-sm">
                      <AlertTitle>Connection Failed</AlertTitle>
                      <AlertDescription>
                        Could not access your camera and microphone. Please check your browser permissions and try again.
                      </AlertDescription>
                  </Alert>
                )}
            </CardContent>
        </Card>
     )
  }

  if (callState === 'connecting') {
    return (
       <Card className="bg-card/50 border-none">
          <CardHeader>
              <CardTitle className="text-2xl font-bold">Secure Video Call</CardTitle>
              <CardDescription>Please wait while we establish a secure connection...</CardDescription>
          </CardHeader>
          <CardContent className="min-h-[500px] flex items-center justify-center">
             <ConnectingLoader />
          </CardContent>
       </Card>
    )
  }

  return (
    <Card className="bg-card/50 border-none overflow-hidden">
        <div className="relative aspect-video bg-black/80">
            {/* Remote participant video (placeholder) */}
            <div className="w-full h-full flex flex-col items-center justify-center text-background/50">
                 <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src="https://i.pravatar.cc/150?u=a042581f4e29026704e" alt="Digital Consultant" />
                    <AvatarFallback>SL</AvatarFallback>
                </Avatar>
                <h3 className="font-bold text-lg">SAM // Digitiful</h3>
                <p>Digital Consultant</p>
                <p className="text-sm mt-2 animate-pulse">Connecting...</p>
            </div>

            {/* Local participant video */}
            <div className="absolute bottom-4 right-4 h-32 w-48 bg-background border-2 border-primary rounded-lg shadow-2xl overflow-hidden">
                <video ref={videoRef} className={cn("w-full h-full object-cover transform -scale-x-100", isCameraOff && "opacity-0")} autoPlay muted playsInline />
                {(isCameraOff) && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-background text-muted-foreground p-2 text-center">
                       <VideoOff className="h-8 w-8 mb-2" />
                       <p className="text-xs">Camera is off</p>
                    </div>
                )}
            </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4 p-4 bg-muted/50 border-t">
            <Button variant="outline" size="icon" className={cn("h-12 w-12 rounded-full", isMuted && "bg-destructive text-destructive-foreground")} onClick={toggleMute}>
                {isMuted ? <MicOff /> : <Mic />}
            </Button>
            <Button variant="outline" size="icon" className={cn("h-12 w-12 rounded-full", isCameraOff && "bg-destructive text-destructive-foreground")} onClick={toggleCamera}>
                {isCameraOff ? <VideoOff /> : <Video />}
            </Button>
            <Button variant="outline" size="icon" className="h-12 w-12 rounded-full hidden sm:inline-flex">
                <ScreenShare />
            </Button>
             <Button variant="outline" size="icon" className="h-12 w-12 rounded-full hidden sm:inline-flex">
                <Users />
            </Button>
             <Button variant="outline" size="icon" className="h-12 w-12 rounded-full hidden sm:inline-flex">
                <MessageSquare />
            </Button>
            <Button variant="destructive" size="icon" className="h-12 w-12 rounded-full" onClick={handleDisconnect}>
                <PhoneOff />
            </Button>
        </div>
    </Card>
  );
}

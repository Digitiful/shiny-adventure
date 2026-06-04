
'use client';
import { useUser } from '@/firebase';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';

/**
 * @fileOverview Security layout for the /home route.
 * Ensures that only authenticated operators can view the full site content 
 * during the "Silent Signal" (pre-launch) phase.
 */
export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  React.useEffect(() => {
    // If auth is done loading and there's no active operator session, 
    // redirect back to the Silent Signal landing page.
    if (!isUserLoading && !user) {
      router.push('/');
    }
  }, [isUserLoading, user, router]);

  // System diagnostic check: show pulse loader during authentication verification.
  if (isUserLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  // Redirect protocol in progress if no user detected.
  if (!user) {
    return null;
  }

  return <>{children}</>;
}

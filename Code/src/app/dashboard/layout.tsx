'use client';
import { useUser } from '@/firebase';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  React.useEffect(() => {
    // If auth is done loading and there's no user, redirect to login.
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [isUserLoading, user, router]);

  // While checking for user, show a loading state
  if (isUserLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  // Render children only if user exists, otherwise return null while redirecting.
  if (!user) {
    return null;
  }

  return <>{children}</>;
}

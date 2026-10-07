'use client';
import { SidebarProvider, Sidebar, SidebarTrigger, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter } from '@/components/ui/sidebar';
import { adminNavLinks } from '@/lib/data';
import { usePathname, useRouter } from 'next/navigation';
import { LogOut, Home, Loader2, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { useUser, useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';
import React from 'react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    // If auth is done loading and there's no user, redirect to login.
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [isUserLoading, user, router]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error("Sign out failed", error);
    }
  };

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

  return (
    <SidebarProvider>
      <div className="flex flex-col min-h-screen bg-background text-foreground">
        <Sidebar className="border-none">
          <SidebarContent>
            <SidebarHeader className="border-b border-primary/10 mb-2">
              <div className="flex items-center gap-2 px-2 py-4">
                <ShieldCheck className="h-6 w-6 text-primary" />
                <h2 className="text-sm font-black uppercase tracking-tighter italic text-primary">Digitiful // Admin</h2>
              </div>
            </SidebarHeader>
            <SidebarMenu className="flex-grow px-2">
              {adminNavLinks.map((link) => (
                <SidebarMenuItem key={link.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === link.href}
                    tooltip={{ children: link.label }}
                    className="data-[active=true]:bg-primary/10 data-[active=true]:text-primary"
                  >
                    <Link href={link.href}>
                      <link.icon className="h-4 w-4" />
                      <span className="font-medium">{link.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
            <SidebarFooter className='gap-1 border-t border-primary/5 p-4'>
              <SidebarMenuButton asChild tooltip={{children: 'Public Site'}}>
                <Link href="/" className="opacity-70 hover:opacity-100">
                  <Home className="h-4 w-4" />
                  <span>Public Site</span>
                </Link>
              </SidebarMenuButton>
              <SidebarMenuButton 
                onClick={handleSignOut}
                tooltip={{children: 'Logout'}}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                  <LogOut className="h-4 w-4" />
                  <span>Terminate Session</span>
              </SidebarMenuButton>
            </SidebarFooter>
          </SidebarContent>
        </Sidebar>
        <div className="flex flex-col flex-1 md:pl-[var(--sidebar-width-icon)]">
          <header className="flex h-14 items-center gap-4 bg-muted/20 border-b border-primary/5 px-4 lg:h-[60px] lg:px-6">
            <SidebarTrigger className="md:hidden" />
            <div className="w-full flex-1">
               <p className="text-[10px] font-code text-muted-foreground uppercase tracking-widest">Agency Command Node // Protocol v1.0</p>
            </div>
          </header>
          <main className="flex-grow p-4 md:p-8">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

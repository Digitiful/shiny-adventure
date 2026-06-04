'use client';
import { SidebarProvider, Sidebar, SidebarTrigger, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter, SidebarInset } from '@/components/ui/sidebar';
import { adminNavLinks } from '@/lib/data';
import { usePathname, useRouter } from 'next/navigation';
import { LogOut, Home, Loader2, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { useUser, useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';
import React from 'react';
import { Separator } from '@/components/ui/separator';

/**
 * @fileOverview Admin Layout Node.
 * Re-architected to use SidebarInset for reactive content scaling.
 * Prevents UI overlap on smaller viewports.
 */
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

  if (isUserLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon" className="border-r border-primary/5 bg-background">
        <SidebarHeader className="border-b border-primary/5">
          <div className="flex items-center gap-2 px-2 py-4">
            <ShieldCheck className="h-6 w-6 text-primary" />
            <h2 className="text-sm font-black uppercase tracking-tighter italic text-primary group-data-[collapsible=icon]:hidden">
              Digitiful // Admin
            </h2>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu className="px-2 mt-4">
            {adminNavLinks.map((link) => (
              <SidebarMenuItem key={link.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === link.href}
                  tooltip={link.label}
                  className="data-[active=true]:bg-primary/10 data-[active=true]:text-primary"
                >
                  <Link href={link.href}>
                    <link.icon className="h-4 w-4" />
                    <span className="font-bold uppercase tracking-widest text-[10px]">{link.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="border-t border-primary/5 p-4 bg-muted/20">
          <SidebarMenuButton asChild tooltip="Public Site">
            <Link href="/" className="opacity-70 hover:opacity-100">
              <Home className="h-4 w-4" />
              <span className="text-[10px] uppercase font-bold tracking-widest">Public Site</span>
            </Link>
          </SidebarMenuButton>
          <SidebarMenuButton 
            onClick={handleSignOut}
            tooltip="Logout"
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <LogOut className="h-4 w-4" />
            <span className="text-[10px] uppercase font-bold tracking-widest">Exit Session</span>
          </SidebarMenuButton>
        </SidebarFooter>
      </Sidebar>
      
      <SidebarInset className="bg-background">
        <header className="flex h-14 shrink-0 items-center gap-2 border-b border-primary/5 px-4 lg:h-[60px] lg:px-6 sticky top-0 bg-background/80 backdrop-blur-md z-30">
          <SidebarTrigger />
          <Separator orientation="vertical" className="mr-2 h-4 bg-primary/20" />
          <div className="w-full flex-1">
            <p className="text-[10px] font-code text-muted-foreground uppercase tracking-[0.4em]">
              Agency Command Node // <span className="text-primary/60">Protocol v1.0</span>
            </p>
          </div>
        </header>
        <main className="flex-grow p-4 md:p-8 animate-in fade-in duration-500 overflow-x-hidden">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

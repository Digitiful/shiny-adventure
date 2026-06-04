'use client';

import { useState, useEffect } from 'react';
import { useAuth, useFirestore, useUser } from '@/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AlertCircle, CheckCircle, Loader2, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

type FormState = 'idle' | 'submitting' | 'success' | 'error';

export default function SetupPage() {
  const auth = useAuth();
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState<FormState>('idle');
  const [error, setError] = useState<string | null>(null);

  const handleCreateAdmin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
    }

    setStatus('submitting');
    setError(null);

    try {
      let adminUser;
      
      try {
        // Step 1: Attempt to create the user
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        adminUser = userCredential.user;
      } catch (err: any) {
        // Step 2: Handle existing email (Repair mode)
        if (err.code === 'auth/email-already-in-use') {
          try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            adminUser = userCredential.user;
          } catch (signInErr: any) {
            throw new Error('This email is already in use. Please use the correct password to verify ownership.');
          }
        } else {
          throw err;
        }
      }

      if (!adminUser || !firestore) {
        throw new Error('Could not authenticate or access database.');
      }

      // Step 3: Grant or Re-apply admin role
      const adminRoleRef = doc(firestore, 'roles_admin', adminUser.uid);
      await setDoc(adminRoleRef, { 
        isAdmin: true, 
        createdOn: new Date().toISOString(),
        setupMethod: 'protocol-v1'
      }, { merge: true });
      
      setStatus('success');

      // Step 4: Logout to force a clean session on login
      await signOut(auth);
      
      setTimeout(() => {
        router.push('/login');
      }, 3000);

    } catch (err: any) {
      setStatus('error');
      setError(err.message || 'An unknown error occurred during setup.');
    }
  };
  
  if (isUserLoading) {
      return (
          <div className="flex min-h-screen items-center justify-center bg-black">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
      )
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-black p-4">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
      <Card className="w-full max-w-md shadow-2xl border-primary/20 bg-background/80 backdrop-blur-xl">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <span className="text-[10px] font-code text-primary uppercase tracking-[0.3em]">Protocol // Initiate</span>
          </div>
          <CardTitle className="text-2xl font-bold text-primary italic uppercase">
            Admin Authentication
          </CardTitle>
          <CardDescription className="text-xs">
            Verify your master ID to establish administrative control over Digitiful.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {status === 'success' ? (
            <Alert variant="default" className="border-green-500/50 bg-green-500/5 text-green-500 [&>svg]:text-green-500">
                <CheckCircle className="h-4 w-4"/>
                <AlertTitle>Master ID Verified</AlertTitle>
                <AlertDescription className="text-xs">
                    Admin role applied successfully. Transitioning to login terminal...
                </AlertDescription>
            </Alert>
          ) : (
            <form onSubmit={handleCreateAdmin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Admin Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@digitiful.net"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-black/50 border-primary/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" title="password" className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Master Key</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-black/50 border-primary/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password" title="confirm-password" className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Confirm Key</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="bg-black/50 border-primary/20"
                />
              </div>

              {error && (
                <Alert variant="destructive" className="bg-destructive/10 border-destructive/20 text-destructive text-xs">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle className="font-bold">Transmission Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full font-bold uppercase tracking-[0.2em] italic"
                disabled={status === 'submitting'}
              >
                {status === 'submitting' ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Syncing...
                  </>
                ) : 'Authorize Admin ID'}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </main>
  );
}

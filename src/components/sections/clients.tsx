
'use client';

import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

interface Client {
    id: string;
    name: string;
    logo: string;
    href?: string;
    invert?: boolean;
}

export function Clients() {
  const firestore = useFirestore();

  const clientsQuery = useMemoFirebase(
    () => firestore ? query(collection(firestore, 'clients'), orderBy('order', 'asc')) : null,
    [firestore]
  );

  const { data: clients, isLoading } = useCollection<Client>(clientsQuery);

  if (isLoading && !clients) {
      return (
          <div className="py-20 flex justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary/50" />
          </div>
      )
  }

  if (clients?.length === 0) return null;

  return (
    <section id="clients" className="py-20 sm:py-28 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="font-headline text-3xl font-bold tracking-tight text-primary sm:text-4xl md:text-5xl uppercase italic">
            Partners
          </h2>
          <p className="mt-4 text-lg text-muted-foreground font-medium">
            We collaborate with elite entities to push the boundaries of system engineering.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 items-center max-w-5xl mx-auto">
          {clients?.map((client) => {
            const logoImage = (
              <Image
                src={client.logo}
                alt={`${client.name} logo`}
                width={150}
                height={60}
                className={cn(
                  "object-contain w-32 h-16 mx-auto transition-all duration-500",
                  client.invert && "invert"
                )}
              />
            );

            return (
              <div 
                key={client.id} 
                className="flex justify-center p-4 rounded-lg transition-all duration-300 opacity-70 hover:opacity-100 hover:bg-card hover:-translate-y-1"
              >
                {client.href ? (
                  <Link href={client.href} target="_blank" rel="noopener noreferrer" aria-label={client.name}>
                    {logoImage}
                  </Link>
                ) : (
                  <div>{logoImage}</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

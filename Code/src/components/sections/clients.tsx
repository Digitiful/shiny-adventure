
'use client';

import React, { useState } from 'react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface Client {
    id?: string;
    name: string;
    logo: string;
    href?: string;
    invert?: boolean;
}

/**
 * @fileOverview Authoritative Partner Signal Grid.
 * Re-architected with Error Handling to prevent build crashes from dead links.
 */
export function Clients() {
  const firestore = useFirestore();

  const clientsQuery = useMemoFirebase(
    () => firestore ? query(collection(firestore, 'clients'), orderBy('order', 'asc')) : null,
    [firestore]
  );

  const { data: clients, isLoading } = useCollection<Client>(clientsQuery);

  if (isLoading) {
      return (
          <div className="py-10 flex justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-primary/50" />
          </div>
      )
  }

  if (!clients || clients.length === 0) {
    return null;
  }

  return (
    <div className="pt-16 pb-8 border-t border-primary/5 mt-16 animate-in fade-in duration-1000">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 items-center max-w-5xl mx-auto">
        {clients.map((client: any, idx: number) => (
          <ClientLogo key={client.id || idx} client={client} />
        ))}
      </div>
    </div>
  );
}

function ClientLogo({ client }: { client: any }) {
    const [imgSrc, setImgSrc] = useState(client.logo);
    const fallbackSrc = `https://placehold.co/300x120/0a0a0a/ffffff?text=${client.name.replace(/\s+/g, '+')}`;

    const logoImage = (
      <div className="relative h-12 w-32 mx-auto flex items-center justify-center">
        <img
          src={imgSrc}
          alt={`${client.name} logo`}
          className={cn(
            "max-h-full max-w-full object-contain transition-all duration-500",
            client.invert && "invert"
          )}
          onError={() => setImgSrc(fallbackSrc)}
          loading="lazy"
        />
      </div>
    );

    return (
      <div className="flex justify-center p-4 rounded-lg transition-all duration-300 hover:bg-white/5 hover:-translate-y-1 group">
        {client.href ? (
          <a href={client.href} target="_blank" rel="noopener noreferrer" aria-label={client.name}>
            {logoImage}
          </a>
        ) : (
          <div className="cursor-default">{logoImage}</div>
        )}
      </div>
    );
}

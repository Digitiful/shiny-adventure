
'use client';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';

export default function BazaarPartitionRedirect() {
  useEffect(() => {
    redirect('/');
  }, []);
  return null;
}
